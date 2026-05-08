// Integration test for the v0.5 ConsentStore wrapped over a fumadb
// Kysely + better-sqlite3 client. Proves end-to-end save / find /
// withdraw / sweep against an actual SQL engine.

import { test } from "node:test"
import assert from "node:assert/strict"
import { Kysely, SqliteDialect } from "kysely"
import Database from "better-sqlite3"
import { kyselyAdapter } from "fumadb/adapters/kysely"
import { ConsentStore, factory } from "../src/store/store.ts"
import type { AuditRecord } from "../src/types.ts"

function makeDb() {
  const sqlite = new Database(":memory:")
  return new Kysely<unknown>({
    dialect: new SqliteDialect({ database: sqlite }),
  })
}

function makeRecord(overrides: Partial<AuditRecord> = {}): AuditRecord {
  return {
    consentId: "test-" + Math.random().toString(36).slice(2),
    schemaVersion: "mailregime/1",
    capturedAt: "2026-05-04T10:00:00.000Z",
    subjectId: "subject-1@example.com",
    country: "DE",
    region: null,
    countrySource: "explicit",
    context: "newsletter-signup",
    relationship: "none",
    basis: {
      statute: "GDPR + UWG §7",
      url: "https://example.com",
      jurisdiction: "DE",
      subRegime: null,
      dataLastUpdated: "2026-05-04",
      confidence: "medium",
      extraterritorialReach: true,
      lawyerAttestation: null,
    },
    wordingHash: "deadbeef",
    doiConfirmedAt: undefined,
    withdrawnAt: undefined,
    withdrawalMethod: undefined,
    ...overrides,
  } as AuditRecord
}

test("ConsentStore: end-to-end via fumadb kyselyAdapter + sqlite", async () => {
  const db = makeDb()
  const store = new ConsentStore(
    factory.client(kyselyAdapter({ db, provider: "sqlite" })),
  )
  await store.migrate()

  // save + findBySubject
  const rec = makeRecord({ subjectId: "alice@example.com" })
  await store.save(rec, { consentRecordRetentionMonths: 60 })
  const found = await store.findBySubject("alice@example.com")
  assert.equal(found.length, 1)
  assert.equal(found[0].consentId, rec.consentId)

  // withdraw — verify via raw SQL that withdrawn_at + withdrawal_method
  // were set on the row
  await store.withdraw(rec.consentId, "preference-center")
  const after = await db
    .selectFrom("mailregime_consent_receipts" as never)
    .selectAll()
    .execute()
  assert.equal(after.length, 1)
  assert.equal(
    (after[0] as Record<string, unknown>).withdrawal_method,
    "preference-center",
  )
  assert.ok((after[0] as Record<string, unknown>).withdrawn_at)

  // sweep — one expired, one fresh, expect 1 deleted
  await store.save(
    makeRecord({
      consentId: "expired-1",
      subjectId: "bob@example.com",
      capturedAt: "2020-01-01T00:00:00.000Z",
    }),
    { consentRecordRetentionMonths: 60 },
  )
  await store.save(
    makeRecord({ consentId: "fresh-1", subjectId: "carol@example.com" }),
    { consentRecordRetentionMonths: 60 },
  )
  const swept = await store.sweep({ limit: 100 })
  assert.equal(swept.deleted, 1)

  await db.destroy()
})

test("ConsentStore: findBySubject rejects empty subjectId", async () => {
  const db = makeDb()
  const store = new ConsentStore(
    factory.client(kyselyAdapter({ db, provider: "sqlite" })),
  )
  await store.migrate()

  await assert.rejects(() => store.findBySubject(""), /non-empty/)
  await assert.rejects(() => store.findBySubject("   "), /non-empty/)

  await db.destroy()
})
