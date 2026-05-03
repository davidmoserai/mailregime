// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// PostgresStore — opt-in storage adapter. Opens a connection to the
// USER'S Postgres database and writes/reads receipts directly. The
// caller supplies the connection string; mailregime never knows about
// any other server, never phones home.
//
// Requires `postgres` (postgres.js) as a peer dependency. Users who
// don't import this file get the zero-dep core only.

import type { AuditRecord, EmailRulesData } from "../types.js"
import { toRow, type ConsentReceiptRow } from "./index.js"

// Inline migration SQL — kept here so the class is fully usable from
// `npm install` without users having to copy schema files. Mirrors
// schemas/postgres/0001_init.sql 1:1.
const MIGRATIONS: ReadonlyArray<{ id: string; sql: string }> = [
  {
    id: "0001_init",
    sql: `
CREATE TABLE IF NOT EXISTS mailregime_consent_receipts (
  consent_id            TEXT        PRIMARY KEY,
  subject_id            TEXT,
  captured_at           TIMESTAMPTZ NOT NULL,
  delete_after          TIMESTAMPTZ NOT NULL,
  retention_months      INTEGER     NOT NULL,
  country               TEXT        NOT NULL,
  region                TEXT,
  country_source        TEXT        NOT NULL,
  context               TEXT        NOT NULL,
  relationship          TEXT        NOT NULL,
  statute               TEXT        NOT NULL,
  statute_url           TEXT        NOT NULL,
  statute_jurisdiction  TEXT        NOT NULL,
  data_last_updated     TEXT        NOT NULL,
  wording_hash          TEXT        NOT NULL,
  doi_confirmed_at      TIMESTAMPTZ,
  withdrawn_at          TIMESTAMPTZ,
  withdrawal_method     TEXT,
  receipt               JSONB       NOT NULL,
  schema_version        TEXT        NOT NULL DEFAULT 'mailregime/1'
);
CREATE INDEX IF NOT EXISTS idx_mr_subject       ON mailregime_consent_receipts (subject_id);
CREATE INDEX IF NOT EXISTS idx_mr_captured      ON mailregime_consent_receipts (captured_at);
CREATE INDEX IF NOT EXISTS idx_mr_delete_after  ON mailregime_consent_receipts (delete_after);
CREATE INDEX IF NOT EXISTS idx_mr_country       ON mailregime_consent_receipts (country, region);
CREATE INDEX IF NOT EXISTS idx_mr_withdrawn     ON mailregime_consent_receipts (withdrawn_at)
  WHERE withdrawn_at IS NOT NULL;
CREATE TABLE IF NOT EXISTS mailregime_migrations (
  id          TEXT        PRIMARY KEY,
  applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`,
  },
] as const

// Minimal subset of postgres.js Sql interface. Declared as a type so
// we can avoid importing the runtime `postgres` package eagerly — keeps
// the core dep-free.
type SqlClient = {
  // tagged-template query
  <T extends readonly unknown[]>(strings: TemplateStringsArray, ...values: unknown[]): Promise<T>
  unsafe: (sql: string) => Promise<unknown[]>
  begin: <T>(fn: (sql: SqlClient) => Promise<T>) => Promise<T>
  end: () => Promise<void>
  // postgres.js exposes a `json` helper for tagging values to be sent
  // as JSONB. Typed loosely because we don't import the runtime types.
  json: (value: unknown) => unknown
}

export type PostgresStoreOptions = {
  /** Standard libpq URL: postgres://user:pass@host:port/db */
  connectionString: string
  /** Pool size. Default 10. */
  poolSize?: number
  /** Set to your own postgres.js client to skip internal pool creation. */
  client?: unknown
}

export class PostgresStore {
  // The `postgres` peer dep is loaded lazily on first instantiation,
  // not at import time, so users importing types still don't pull
  // node_modules/postgres.
  private sqlPromise: Promise<SqlClient>

  constructor(opts: PostgresStoreOptions) {
    if (opts.client) {
      this.sqlPromise = Promise.resolve(opts.client as SqlClient)
    } else {
      this.sqlPromise = importPostgres().then(
        (mod) =>
          mod.default(opts.connectionString, {
            max: opts.poolSize ?? 10,
          }) as SqlClient,
      )
    }
  }

  /** Apply pending migrations idempotently. Call once on app boot. */
  async migrate(): Promise<{ applied: string[] }> {
    const sql = await this.sqlPromise
    await sql.unsafe(MIGRATIONS[0]!.sql)
    const existing = (await sql`SELECT id FROM mailregime_migrations`) as Array<{ id: string }>
    const have = new Set(existing.map((r) => r.id))
    const applied: string[] = []
    for (const m of MIGRATIONS) {
      if (have.has(m.id)) continue
      await sql.unsafe(m.sql)
      await sql`INSERT INTO mailregime_migrations (id) VALUES (${m.id}) ON CONFLICT (id) DO NOTHING`
      applied.push(m.id)
    }
    return { applied }
  }

  /**
   * Save a consent receipt. Computes `delete_after` from the rules'
   * retention period so retention sweeps are a single indexed DELETE.
   */
  async save(
    record: AuditRecord,
    rules: Pick<EmailRulesData, "consentRecordRetentionMonths">,
  ): Promise<void> {
    const sql = await this.sqlPromise
    const row = toRow(record, rules)
    await sql`
      INSERT INTO mailregime_consent_receipts (
        consent_id, subject_id, captured_at, delete_after, retention_months,
        country, region, country_source, context, relationship,
        statute, statute_url, statute_jurisdiction, data_last_updated,
        wording_hash, doi_confirmed_at, withdrawn_at, withdrawal_method,
        receipt, schema_version
      ) VALUES (
        ${row.consent_id}, ${row.subject_id}, ${row.captured_at}, ${row.delete_after}, ${row.retention_months},
        ${row.country}, ${row.region}, ${row.country_source}, ${row.context}, ${row.relationship},
        ${row.statute}, ${row.statute_url}, ${row.statute_jurisdiction}, ${row.data_last_updated},
        ${row.wording_hash}, ${row.doi_confirmed_at}, ${row.withdrawn_at}, ${row.withdrawal_method},
        ${sql.json(row.receipt as unknown)}, ${row.schema_version}
      )
      ON CONFLICT (consent_id) DO NOTHING
    `
  }

  /**
   * Find all receipts for a subject — GDPR Art. 15 access-request helper.
   * Returns receipts in capture order (oldest first).
   */
  async findBySubject(subjectId: string): Promise<AuditRecord[]> {
    const sql = await this.sqlPromise
    const rows = (await sql`
      SELECT receipt FROM mailregime_consent_receipts
      WHERE subject_id = ${subjectId}
      ORDER BY captured_at ASC
    `) as Array<{ receipt: AuditRecord }>
    return rows.map((r) => r.receipt)
  }

  /** Mark withdrawn — keeps row until original `delete_after`. */
  async withdraw(consentId: string, method: string): Promise<void> {
    const sql = await this.sqlPromise
    await sql`
      UPDATE mailregime_consent_receipts
      SET withdrawn_at = NOW(), withdrawal_method = ${method}
      WHERE consent_id = ${consentId}
    `
  }

  /**
   * Strict-erasure withdrawal — advances `delete_after` to NOW() so the
   * next sweep removes the row. Use for callers who interpret Art. 17
   * as requiring immediate deletion.
   */
  async purgeOnWithdrawal(consentId: string, method: string): Promise<void> {
    const sql = await this.sqlPromise
    await sql`
      UPDATE mailregime_consent_receipts
      SET withdrawn_at = NOW(), withdrawal_method = ${method}, delete_after = NOW()
      WHERE consent_id = ${consentId}
    `
  }

  /** Delete receipts past their delete_after. Run on a cron. */
  async sweep(): Promise<{ deleted: number }> {
    const sql = await this.sqlPromise
    const rows = (await sql`
      DELETE FROM mailregime_consent_receipts
      WHERE delete_after < NOW()
      RETURNING consent_id
    `) as Array<{ consent_id: string }>
    return { deleted: rows.length }
  }

  /** Close the pool. Call on app shutdown. */
  async close(): Promise<void> {
    const sql = await this.sqlPromise
    await sql.end()
  }
}

// Lazy-load the optional peer dep with a clear error if it's missing.
async function importPostgres(): Promise<{ default: (connectionString: string, opts: { max: number }) => SqlClient }> {
  try {
    return (await import("postgres")) as unknown as {
      default: (connectionString: string, opts: { max: number }) => SqlClient
    }
  } catch {
    throw new Error(
      "mailregime/store/postgres requires the 'postgres' peer dependency. Install it with: npm install postgres",
    )
  }
}
