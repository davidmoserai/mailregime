// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// fumadb schema for the consent-receipt store. One table; mailregime
// uses fumadb to generate per-ORM schemas (Prisma / Drizzle / Kysely
// / TypeORM / MongoDB) so users plug their existing DB client in,
// rather than mailregime opening its own socket.
//
// Logical column names are camelCase. SQL column names are snake_case
// (matches the original schemas/postgres/0001_init.sql so PostgresStore
// users can migrate without renaming columns).

import { column, idColumn, schema, table } from "fumadb/schema"

const sqlSnake = (snake: string) => ({ sql: snake })

const consentReceiptTable = table("consentReceipt", {
  consentId: idColumn(
    { ...sqlSnake("consent_id") },
    "varchar(255)",
  ),
  subjectId: column({ ...sqlSnake("subject_id") }, "string").nullable(),
  capturedAt: column({ ...sqlSnake("captured_at") }, "timestamp"),
  // delete_after = captured_at + retention_months. Computed at insert
  // time so retention sweeps are a single indexed DELETE.
  deleteAfter: column({ ...sqlSnake("delete_after") }, "timestamp"),
  retentionMonths: column({ ...sqlSnake("retention_months") }, "integer"),
  country: column("country", "string"),
  region: column("region", "string").nullable(),
  countrySource: column({ ...sqlSnake("country_source") }, "string"),
  context: column("context", "string"),
  relationship: column("relationship", "string"),
  statute: column("statute", "string"),
  statuteUrl: column({ ...sqlSnake("statute_url") }, "string"),
  statuteJurisdiction: column(
    { ...sqlSnake("statute_jurisdiction") },
    "string",
  ),
  dataLastUpdated: column({ ...sqlSnake("data_last_updated") }, "string"),
  wordingHash: column({ ...sqlSnake("wording_hash") }, "string"),
  doiConfirmedAt: column(
    { ...sqlSnake("doi_confirmed_at") },
    "timestamp",
  ).nullable(),
  withdrawnAt: column({ ...sqlSnake("withdrawn_at") }, "timestamp").nullable(),
  withdrawalMethod: column(
    { ...sqlSnake("withdrawal_method") },
    "string",
  ).nullable(),
  receipt: column("receipt", "json"),
  schemaVersion: column({ ...sqlSnake("schema_version") }, "string").defaultTo$(
    () => "mailregime/1",
  ),
})

export const v1 = schema({
  version: "1.0.0",
  tables: { consentReceipt: consentReceiptTable },
  relations: { consentReceipt: () => ({}) },
})
