// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Drizzle table definition for mailregime_consent_receipts.
// Paste this into your project's schema (or import directly) and let
// drizzle-kit generate the migration. Maps 1:1 to the canonical SQL
// in schemas/postgres/0001_init.sql.

import { pgTable, text, timestamp, jsonb, integer, index } from "drizzle-orm/pg-core"

export const mailregimeConsentReceipts = pgTable(
  "mailregime_consent_receipts",
  {
    consentId:           text("consent_id").primaryKey(),
    subjectId:           text("subject_id"),
    capturedAt:          timestamp("captured_at", { withTimezone: true }).notNull(),
    deleteAfter:         timestamp("delete_after", { withTimezone: true }).notNull(),
    retentionMonths:     integer("retention_months").notNull(),
    country:             text("country").notNull(),
    region:              text("region"),
    countrySource:       text("country_source").notNull(),
    context:             text("context").notNull(),
    relationship:        text("relationship").notNull(),
    statute:             text("statute").notNull(),
    statuteUrl:          text("statute_url").notNull(),
    statuteJurisdiction: text("statute_jurisdiction").notNull(),
    dataLastUpdated:     text("data_last_updated").notNull(),
    wordingHash:         text("wording_hash").notNull(),
    doiConfirmedAt:      timestamp("doi_confirmed_at", { withTimezone: true }),
    withdrawnAt:         timestamp("withdrawn_at", { withTimezone: true }),
    withdrawalMethod:    text("withdrawal_method"),
    receipt:             jsonb("receipt").notNull(),
    schemaVersion:       text("schema_version").notNull().default("mailregime/1"),
  },
  (t) => ({
    bySubject:     index("idx_mr_subject").on(t.subjectId),
    byCaptured:    index("idx_mr_captured").on(t.capturedAt),
    byDeleteAfter: index("idx_mr_delete_after").on(t.deleteAfter),
    byCountry:     index("idx_mr_country").on(t.country, t.region),
    byWithdrawn:   index("idx_mr_withdrawn").on(t.withdrawnAt),
  }),
)
