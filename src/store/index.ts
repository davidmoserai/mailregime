// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Pure mapping functions between AuditRecord (the JSON-shaped consent
// receipt the rules engine produces) and ConsentReceiptRow (the flat
// table-row shape the canonical schema stores).
//
// These functions never open a connection, never log, never throw on
// untrusted input. They are ORM-agnostic — Drizzle, Prisma, Kysely,
// raw pg.Pool all consume the same row shape.

import type { AuditRecord, EmailRulesData } from "../types.js"

/**
 * Flat row shape for `mailregime_consent_receipts`. Field names match
 * the canonical Postgres DDL (snake_case at the SQL layer; ORMs that
 * map columns will surface camelCase variants — see schemas/drizzle
 * and schemas/prisma fragments).
 */
export type ConsentReceiptRow = {
  consent_id: string
  subject_id: string | null
  captured_at: Date
  delete_after: Date
  retention_months: number
  country: string
  region: string | null
  country_source: AuditRecord["countrySource"]
  context: string
  relationship: string
  statute: string
  statute_url: string
  statute_jurisdiction: string
  data_last_updated: string
  wording_hash: string
  doi_confirmed_at: Date | null
  withdrawn_at: Date | null
  withdrawal_method: string | null
  receipt: AuditRecord
  schema_version: AuditRecord["schemaVersion"]
}

/**
 * Convert an AuditRecord to a row ready for INSERT. `retentionMonths`
 * comes from the EmailRulesData `consentRecordRetentionMonths` field
 * — pass the rules object the receipt was built from. `delete_after`
 * is computed at this point and FROZEN — if a country later extends
 * its retention rule, existing rows still expire on their original
 * delete_after. Callers who interpret retention as "longest-applicable
 * rule, recomputed on rule changes" should run an UPDATE batch when
 * they update mailregime — that's a deliberate caller choice, not a
 * library default.
 *
 * Retention sweeps are a single indexed DELETE because of this column.
 */
export function toRow(
  record: AuditRecord,
  rules: Pick<EmailRulesData, "consentRecordRetentionMonths">,
): ConsentReceiptRow {
  const captured = new Date(record.capturedAt)
  return {
    consent_id: record.consentId,
    subject_id: record.subjectId,
    captured_at: captured,
    delete_after: addMonths(captured, rules.consentRecordRetentionMonths),
    retention_months: rules.consentRecordRetentionMonths,
    country: record.country,
    region: record.region,
    country_source: record.countrySource,
    context: record.context,
    relationship: record.relationship,
    statute: record.basis.statute,
    statute_url: record.basis.url,
    statute_jurisdiction: record.basis.jurisdiction,
    data_last_updated: record.basis.dataLastUpdated,
    wording_hash: record.wordingHash,
    doi_confirmed_at: parseOptDate(record.doiConfirmedAt),
    withdrawn_at: parseOptDate(record.withdrawnAt),
    withdrawal_method: record.withdrawalMethod,
    receipt: record,
    schema_version: record.schemaVersion,
  }
}

/**
 * Convert a row read from the database back into an AuditRecord. The
 * `receipt` JSONB column is the legally authoritative source — we
 * return that directly (the denormalized columns are for indexing only).
 */
export function fromRow(row: ConsentReceiptRow): AuditRecord {
  return row.receipt
}

// Plain calendar-month addition. Uses JavaScript's Date.setUTCMonth,
// which rolls over on month-end overflow: e.g. Jan 31 + 1 month →
// Mar 3 (because Feb 31 doesn't exist, JS adds the extra days). For
// retention this can shift delete_after by up to 3 days at month
// boundaries — be aware when reading delete_after values, and consult
// your own counsel if your retention regime requires day-precise
// expiry.
function addMonths(date: Date, months: number): Date {
  const out = new Date(date.getTime())
  out.setUTCMonth(out.getUTCMonth() + months)
  return out
}

function parseOptDate(s: string | null | undefined): Date | null {
  return s ? new Date(s) : null
}
