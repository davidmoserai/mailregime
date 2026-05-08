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

// Inline migration SQL — kept here so the class is fully usable
// without users having to copy schema files. Mirrors
// schemas/postgres/0001_init.sql, but EXCLUDES the trailing INSERT
// into mailregime_migrations — that's done by migrate() itself
// inside the advisory-lock-protected loop below to avoid double
// bookkeeping when both the inline SQL and the loop track state.
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
`,
  },
] as const

// Stable advisory-lock key derived from the project name. Two booting
// processes will serialise on this lock, so only one runs migrations
// at a time — the second sees the bookkeeping rows and no-ops.
const ADVISORY_LOCK_KEY = 0x6d_61_69_6c_72 // "mailr"

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
  /**
   * TLS / SSL setting passed to postgres.js. Most managed-Postgres
   * providers (Supabase, Neon, Render, Railway, Heroku) reject plain
   * connections — set this to `"require"` (or pass an object with CA
   * pinning).
   *
   * If unset, mailregime auto-detects common managed-Postgres hosts
   * (*.supabase.co, *.supabase.com, *.pooler.supabase.com, *.neon.tech,
   * *.render.com, *.railway.app) and defaults to `"require"`. Override
   * by passing an explicit value (including `false` to disable).
   */
  ssl?: "require" | "prefer" | "verify-full" | boolean | object
}

const MANAGED_HOST_PATTERNS = [
  /\.supabase\.co$/i,
  /\.supabase\.com$/i,
  /\.pooler\.supabase\.com$/i,
  /\.neon\.tech$/i,
  /\.render\.com$/i,
  /\.railway\.app$/i,
]

function autodetectSsl(connectionString: string): "require" | undefined {
  try {
    const u = new URL(connectionString)
    if (u.searchParams.get("sslmode")) return undefined // user already specified
    if (MANAGED_HOST_PATTERNS.some((p) => p.test(u.hostname))) return "require"
  } catch {
    // Malformed URL; let postgres.js produce its native error.
  }
  return undefined
}

/**
 * @deprecated Use `ConsentStore` from `mailregime/store` with a fumadb
 * adapter (prisma / drizzle / kysely / typeorm / mongodb). PostgresStore
 * forces mailregime to own connection-string parsing, SSL config, pool
 * sizing, and migration locking — duplicate work that ORMs already do
 * better. The new `ConsentStore` takes any fumadb-configured client and
 * never opens its own socket. PostgresStore will be removed in v0.6.0.
 *
 * Migration:
 *   - Prisma:   `new ConsentStore(factory.client(prismaAdapter(prisma, { provider: 'postgresql' })))`
 *   - Drizzle:  `new ConsentStore(factory.client(drizzleAdapter(db, { provider: 'postgresql' })))`
 *   - Kysely:   `new ConsentStore(factory.client(kyselyAdapter({ db, provider: 'postgresql' })))`
 *
 * Existing `mailregime_consent_receipts` tables are compatible — the
 * fumadb schema preserves the same SQL column names. Ship code that
 * uses `ConsentStore`, deploy, then optionally remove the old
 * PostgresStore call sites.
 */
export class PostgresStore {
  // The `postgres` peer dep is loaded lazily on first instantiation,
  // not at import time, so users importing types still don't pull
  // node_modules/postgres.
  private sqlPromise: Promise<SqlClient>

  constructor(opts: PostgresStoreOptions) {
    if (opts.client) {
      this.sqlPromise = Promise.resolve(opts.client as SqlClient)
    } else {
      const ssl = opts.ssl !== undefined ? opts.ssl : autodetectSsl(opts.connectionString)
      this.sqlPromise = importPostgres().then(
        (mod) =>
          mod.default(opts.connectionString, {
            max: opts.poolSize ?? 10,
            ...(ssl !== undefined ? { ssl } : {}),
          }) as SqlClient,
      )
    }
  }

  /**
   * Apply pending migrations idempotently and race-safely.
   *
   * Uses a transaction-scoped Postgres advisory lock so two app
   * instances booting simultaneously serialise on the migration
   * step. The bookkeeping table is created outside the lock (idempotent
   * `CREATE TABLE IF NOT EXISTS`); the per-migration loop inside the
   * lock checks bookkeeping before running each script, so concurrent
   * boots can't double-apply.
   *
   * Safe to call on every app boot — already-applied migrations no-op.
   */
  async migrate(): Promise<{ applied: string[] }> {
    const sql = await this.sqlPromise

    // Bookkeeping table first — guaranteed idempotent.
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS mailregime_migrations (
        id          TEXT        PRIMARY KEY,
        applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)

    const applied: string[] = []
    await sql.begin(async (tx) => {
      // Serialise concurrent migrators on this key.
      await tx.unsafe(`SELECT pg_advisory_xact_lock(${ADVISORY_LOCK_KEY})`)

      const existing = (await tx`SELECT id FROM mailregime_migrations`) as Array<{ id: string }>
      const have = new Set(existing.map((r) => r.id))

      for (const m of MIGRATIONS) {
        if (have.has(m.id)) continue
        await tx.unsafe(m.sql)
        await tx`INSERT INTO mailregime_migrations (id) VALUES (${m.id}) ON CONFLICT (id) DO NOTHING`
        applied.push(m.id)
      }
    })

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
   *
   * Anonymous receipts (subject_id IS NULL) cannot be looked up here.
   * That's correct GDPR behaviour — without a subject identifier, you
   * cannot identify "which records belong to this person." Pass an
   * explicit subjectId; mailregime rejects empty strings to prevent
   * accidental "give me all rows" calls.
   */
  async findBySubject(subjectId: string): Promise<AuditRecord[]> {
    if (typeof subjectId !== "string" || subjectId.trim().length === 0) {
      throw new Error(
        "findBySubject requires a non-empty subjectId. Anonymous receipts cannot be queried by subject.",
      )
    }
    const sql = await this.sqlPromise
    const rows = (await sql`
      SELECT receipt FROM mailregime_consent_receipts
      WHERE subject_id = ${subjectId}
      ORDER BY captured_at ASC
    `) as Array<{ receipt: AuditRecord }>
    return rows.map((r) => r.receipt)
  }

  /**
   * Mark a receipt as withdrawn. Keeps the row in place until its
   * original `delete_after` so the consent record remains as proof
   * of past consent under legitimate-interest basis (ICO/CNIL aligned).
   *
   * NOT a substitute for `purgeOnWithdrawal` — they apply different
   * Art. 17 interpretations and shouldn't be chained on the same row.
   */
  async withdraw(consentId: string, method: string): Promise<void> {
    const sql = await this.sqlPromise
    await sql`
      UPDATE mailregime_consent_receipts
      SET withdrawn_at = NOW(), withdrawal_method = ${method}
      WHERE consent_id = ${consentId}
    `
  }

  /**
   * Strict-erasure withdrawal — supersets `withdraw` and additionally
   * advances `delete_after` to NOW(), so the next `sweep()` removes
   * the row. Use for callers interpreting Art. 17 as requiring
   * immediate deletion. Don't call this AND `withdraw()` on the same
   * row — `purgeOnWithdrawal` already records the withdrawal.
   */
  async purgeOnWithdrawal(consentId: string, method: string): Promise<void> {
    const sql = await this.sqlPromise
    await sql`
      UPDATE mailregime_consent_receipts
      SET withdrawn_at = NOW(), withdrawal_method = ${method}, delete_after = NOW()
      WHERE consent_id = ${consentId}
    `
  }

  /**
   * Delete receipts past their delete_after. Run on a daily cron.
   *
   * Bounded by `limit` (default 10,000) to avoid huge transactions
   * locking the table. If exactly `limit` rows are deleted, more may
   * remain — call again until `deleted < limit`.
   */
  async sweep(opts: { limit?: number } = {}): Promise<{ deleted: number }> {
    const sql = await this.sqlPromise
    const limit = opts.limit ?? 10_000
    const rows = (await sql`
      DELETE FROM mailregime_consent_receipts
      WHERE consent_id IN (
        SELECT consent_id FROM mailregime_consent_receipts
        WHERE delete_after < NOW()
        LIMIT ${limit}
      )
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
async function importPostgres(): Promise<{ default: (connectionString: string, opts: { max: number; ssl?: unknown }) => SqlClient }> {
  try {
    return (await import("postgres")) as unknown as {
      default: (connectionString: string, opts: { max: number; ssl?: unknown }) => SqlClient
    }
  } catch {
    throw new Error(
      "mailregime/store/postgres requires the 'postgres' peer dependency. Install it with: npm install postgres",
    )
  }
}
