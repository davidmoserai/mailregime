// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// ConsentStore — domain wrapper around a fumadb FumaDB client.
//
// Users construct this with a FumaDB client they configured with their
// own adapter (prismaAdapter, drizzleAdapter, kyselyAdapter, etc.), so
// mailregime never opens its own DB connection, never owns SSL config,
// never owns a pool. The same pattern as @c15t/backend.

import { fumadb, type FumaDB } from "fumadb"
import type { AuditRecord, EmailRulesData } from "../types.js"
import { v1 } from "./schema.js"

// Add `months` to a date in UTC. Month-end rollover follows JS rules
// (Jan 31 + 1mo → Mar 3 because Feb 31 doesn't exist) — be aware when
// reading deleteAfter values.
function addMonths(date: Date, months: number): Date {
  const out = new Date(date.getTime())
  out.setUTCMonth(out.getUTCMonth() + months)
  return out
}

// Apply the canonical SQL table name explicitly so the library matches
// the schema shipped in earlier versions (`mailregime_consent_receipts`)
// and migrations users have already applied. Without this override
// fumadb would default to the ORM-friendly camelCase name.
export const factory = fumadb({
  namespace: "mailregime",
  schemas: [v1],
}).names({
  consentReceipt: {
    sql: "mailregime_consent_receipts",
    prisma: "ConsentReceipt",
    drizzle: "consentReceipts",
  },
})

/**
 * Type alias for `factory.client(adapter)` return value. Library users
 * usually don't need to reference this directly — they pass the result
 * to `new ConsentStore(...)`.
 */
export type FumaDBClient = FumaDB<typeof factory extends {
  client: (a: never) => FumaDB<infer S>
}
  ? S
  : never>

const TABLE = "consentReceipt" as const
const VERSION = "1.0.0" as const

/** Persisted row shape (camelCase logical columns). */
type ConsentReceiptRow = {
  consentId: string
  subjectId: string | null
  capturedAt: Date
  deleteAfter: Date
  retentionMonths: number
  country: string
  region: string | null
  countrySource: AuditRecord["countrySource"]
  context: string
  relationship: string
  statute: string
  statuteUrl: string
  statuteJurisdiction: string
  dataLastUpdated: string
  wordingHash: string
  doiConfirmedAt: Date | null
  withdrawnAt: Date | null
  withdrawalMethod: string | null
  receipt: AuditRecord
  schemaVersion: string
}

function toRow(
  record: AuditRecord,
  rules: Pick<EmailRulesData, "consentRecordRetentionMonths">,
): ConsentReceiptRow {
  const captured = new Date(record.capturedAt)
  const parseOpt = (v: string | undefined | null): Date | null =>
    v ? new Date(v) : null
  return {
    consentId: record.consentId,
    subjectId: record.subjectId ?? null,
    capturedAt: captured,
    deleteAfter: addMonths(captured, rules.consentRecordRetentionMonths),
    retentionMonths: rules.consentRecordRetentionMonths,
    country: record.country,
    region: record.region ?? null,
    countrySource: record.countrySource,
    context: record.context,
    relationship: record.relationship,
    statute: record.basis.statute,
    statuteUrl: record.basis.url,
    statuteJurisdiction: record.basis.jurisdiction,
    dataLastUpdated: record.basis.dataLastUpdated,
    wordingHash: record.wordingHash,
    doiConfirmedAt: parseOpt(record.doiConfirmedAt),
    withdrawnAt: parseOpt(record.withdrawnAt),
    withdrawalMethod: record.withdrawalMethod ?? null,
    receipt: record,
    schemaVersion: record.schemaVersion,
  }
}

function fromRow(row: ConsentReceiptRow): AuditRecord {
  // The full receipt is preserved verbatim in `receipt` for audit
  // integrity — that's the source of truth for downstream consumers.
  return row.receipt
}

export type SweepResult = { deleted: number }

/**
 * Ergonomic top-level constructor matching @c15t/backend's
 * `c15t({database: adapter})` shape.
 *
 *   import { consentStore } from "mailregime/store"
 *   import { prismaAdapter } from "mailregime/store/adapters/prisma"
 *
 *   const store = consentStore({
 *     database: prismaAdapter(prismaClient, { provider: "postgresql" }),
 *   })
 *
 *   await store.save(record, rules)
 */
export function consentStore(opts: {
  database: Parameters<typeof factory.client>[0]
}): ConsentStore {
  return new ConsentStore(factory.client(opts.database))
}

/**
 * Domain wrapper. All methods are awaitable; none open a connection;
 * the underlying fumadb client manages whatever connection your ORM
 * already established.
 */
export class ConsentStore {
  constructor(private readonly db: FumaDBClient) {}

  /**
   * Persist a consent receipt. `retentionMonths` is taken from the
   * rules object the receipt was built from; `deleteAfter` is computed
   * at insert time and frozen — see toRow doc.
   */
  async save(
    record: AuditRecord,
    rules: Pick<EmailRulesData, "consentRecordRetentionMonths">,
  ): Promise<void> {
    const orm = this.db.orm(VERSION)
    await orm.create(TABLE, toRow(record, rules))
  }

  /**
   * Find all receipts for a subject — GDPR Art. 15 access-request
   * helper. Returns receipts oldest-first. Anonymous receipts are
   * unreachable here (correct: without a subject ID you cannot
   * identify "this person's records").
   */
  async findBySubject(subjectId: string): Promise<AuditRecord[]> {
    if (!subjectId || !subjectId.trim()) {
      throw new Error(
        "ConsentStore.findBySubject requires a non-empty subjectId",
      )
    }
    const orm = this.db.orm(VERSION)
    const rows = (await orm.findMany(TABLE, {
      where: (eb) => eb("subjectId", "=", subjectId),
      orderBy: [["capturedAt", "asc"]],
    })) as unknown as ConsentReceiptRow[]
    return rows.map(fromRow)
  }

  /**
   * Mark a receipt as withdrawn. Idempotent — repeated withdrawals
   * just refresh withdrawnAt to the latest.
   */
  async withdraw(consentId: string, method: string): Promise<void> {
    const orm = this.db.orm(VERSION)
    await orm.updateMany(TABLE, {
      where: (eb) => eb("consentId", "=", consentId),
      set: {
        withdrawnAt: new Date(),
        withdrawalMethod: method,
      },
    })
  }

  /**
   * Hard-delete a receipt. For jurisdictions that require purging on
   * withdrawal (rare, usually retention takes precedence) — call
   * after withdraw(). Most callers should NOT use this; the receipt
   * is the audit trail of consent itself.
   */
  async purgeOnWithdrawal(consentId: string): Promise<void> {
    const orm = this.db.orm(VERSION)
    await orm.deleteMany(TABLE, {
      where: (eb) => eb("consentId", "=", consentId),
    })
  }

  /**
   * Delete receipts whose deleteAfter has passed. Cap with `limit`
   * to avoid unbounded sweeps on huge tables. Returns count deleted.
   */
  async sweep({ limit = 1000 }: { limit?: number } = {}): Promise<SweepResult> {
    const orm = this.db.orm(VERSION)
    const expired = (await orm.findMany(TABLE, {
      where: (eb) => eb("deleteAfter", "<", new Date()),
      limit,
      select: ["consentId"],
    })) as unknown as Array<{ consentId: string }>
    if (expired.length === 0) return { deleted: 0 }
    const ids = expired.map((r) => r.consentId)
    await orm.deleteMany(TABLE, {
      where: (eb) => eb("consentId", "in", ids),
    })
    return { deleted: expired.length }
  }

  /**
   * Apply pending schema migrations. Only meaningful for adapters that
   * own their own migration engine (Kysely, MongoDB). Prisma/Drizzle/
   * TypeORM users run their own ORM-native migrate after generating
   * the schema with `factory.generateSchema()`.
   */
  async migrate(): Promise<void> {
    const migrator = this.db.createMigrator()
    // fumadb's migrateToLatest() returns a plan; the plan must be
    // executed in a second step. This is intentional — it lets users
    // inspect / dry-run the SQL before committing changes.
    const plan = await migrator.migrateToLatest()
    await plan.execute()
  }
}
