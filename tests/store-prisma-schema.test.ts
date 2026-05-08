// Verifies the Prisma path: with a stub Prisma client, fumadb's
// prismaAdapter wires up and generateSchema('1.0.0', 'prisma')
// emits a valid Prisma model that includes the canonical SQL table
// name (mailregime_consent_receipts) and snake_case column names.
//
// This is the codegen flow downstream consumers use:
//   1. install mailregime
//   2. run `factory.client(prismaAdapter(prisma, ...)).generateSchema('1.0.0', 'prisma')`
//   3. paste the output into prisma/schema.prisma
//   4. `prisma migrate dev`

import { test } from "node:test"
import assert from "node:assert/strict"
import { prismaAdapter } from "fumadb/adapters/prisma"
import { factory } from "../src/store/store.ts"

test("Prisma path: schema generation emits the canonical table + columns", () => {
  // A stub PrismaClient — generateSchema doesn't read it.
  const stub = {} as never
  const db = factory.client(prismaAdapter(stub, { provider: "postgresql" }))

  const generated = db.generateSchema("1.0.0", "prisma")
  const code = generated.code

  // Must declare a model and map it to the canonical SQL table name.
  // Without the @@map override the model would default to `consentReceipt`
  // and break long-time PostgresStore users who already have the
  // snake_case table.
  assert.match(code, /model\s+ConsentReceipt\s*\{/, "ConsentReceipt model")
  assert.match(
    code,
    /@@map\(\s*["']mailregime_consent_receipts["']\s*\)/,
    "table mapped to mailregime_consent_receipts",
  )

  // Snake_case @map for every column that needed it
  for (const expected of [
    "consent_id",
    "subject_id",
    "captured_at",
    "delete_after",
    "retention_months",
    "country_source",
    "statute_url",
    "statute_jurisdiction",
    "data_last_updated",
    "wording_hash",
    "doi_confirmed_at",
    "withdrawn_at",
    "withdrawal_method",
    "schema_version",
  ]) {
    assert.match(
      code,
      new RegExp(`@map\\(\\s*["']${expected}["']\\s*\\)`),
      `column @map for ${expected}`,
    )
  }
})
