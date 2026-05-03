// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Kysely table types for mailregime_consent_receipts. Add the
// `mailregime_consent_receipts` row to your Kysely Database interface.
// Apply the SQL DDL via your migration tool of choice
// (schemas/postgres/0001_init.sql).

import type { ColumnType } from "kysely"

export interface MailregimeConsentReceiptsTable {
  consent_id:            string
  subject_id:            string | null
  captured_at:           ColumnType<Date, Date | string, never>
  delete_after:          ColumnType<Date, Date | string, never>
  retention_months:      number
  country:               string
  region:                string | null
  country_source:        string
  context:               string
  relationship:          string
  statute:               string
  statute_url:           string
  statute_jurisdiction:  string
  data_last_updated:     string
  wording_hash:          string
  doi_confirmed_at:      ColumnType<Date, Date | string, never> | null
  withdrawn_at:          ColumnType<Date | null, Date | string | null, Date | string>
  withdrawal_method:     string | null
  receipt:               unknown
  schema_version:        ColumnType<string, string | undefined, string>
}

export interface MailregimeDatabase {
  mailregime_consent_receipts: MailregimeConsentReceiptsTable
}
