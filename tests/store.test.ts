import { test } from "node:test"
import assert from "node:assert/strict"
import { toRow, fromRow } from "../src/store/index.js"
import { getEmailRules } from "../src/index.js"

process.env.MAILREGIME_SILENCE_DISCLAIMER = "1"

test("toRow — flattens AuditRecord into row shape", async () => {
  const rules = getEmailRules({
    country: "DE",
    context: "newsletter-signup",
    relationship: "none",
  })
  const record = await rules.buildAuditRecord({
    ip: "203.0.113.4",
    userAgent: "test",
    sourceUrl: "https://example.com/x",
    wording: "I agree to receive marketing emails",
    formVersion: "v1",
    subjectId: "sha256:abc",
    countrySource: "header",
  })
  const row = toRow(record, rules)
  assert.equal(row.consent_id, record.consentId)
  assert.equal(row.subject_id, "sha256:abc")
  assert.equal(row.country, "DE")
  assert.equal(row.region, null)
  assert.equal(row.country_source, "header")
  assert.equal(row.context, "newsletter-signup")
  assert.equal(row.statute_jurisdiction, "EU")
  assert.equal(row.retention_months, rules.consentRecordRetentionMonths)
  assert.ok(row.captured_at instanceof Date)
  assert.ok(row.delete_after instanceof Date)
  assert.equal(row.receipt, record)
})

test("toRow — delete_after is captured_at + retention_months", async () => {
  const rules = getEmailRules({
    country: "DE",
    context: "newsletter-signup",
    relationship: "none",
  })
  const record = await rules.buildAuditRecord({
    ip: null,
    userAgent: null,
    sourceUrl: "x",
    wording: "ok",
    formVersion: "v1",
  })
  const row = toRow(record, rules)
  const expected = new Date(row.captured_at.getTime())
  expected.setUTCMonth(expected.getUTCMonth() + rules.consentRecordRetentionMonths)
  assert.equal(row.delete_after.getTime(), expected.getTime())
})

test("toRow — DOI confirmation timestamp parsed", async () => {
  const rules = getEmailRules({
    country: "DE",
    context: "newsletter-signup",
    relationship: "none",
  })
  const doiAt = "2026-05-03T10:00:00.000Z"
  const record = await rules.buildAuditRecord({
    ip: null,
    userAgent: null,
    sourceUrl: "x",
    wording: "ok",
    formVersion: "v1",
    doiConfirmedAt: doiAt,
  })
  const row = toRow(record, rules)
  assert.ok(row.doi_confirmed_at instanceof Date)
  assert.equal(row.doi_confirmed_at!.toISOString(), doiAt)
})

test("fromRow — returns the JSONB receipt verbatim", async () => {
  const rules = getEmailRules({
    country: "US",
    context: "newsletter-signup",
    relationship: "none",
  })
  const record = await rules.buildAuditRecord({
    ip: null,
    userAgent: null,
    sourceUrl: "x",
    wording: "ok",
    formVersion: "v1",
  })
  const row = toRow(record, rules)
  const restored = fromRow(row)
  assert.equal(restored, record)
  assert.equal(restored.consentId, record.consentId)
})

test("toRow — round-trips through fromRow without mutation", async () => {
  const rules = getEmailRules({
    country: "BE",
    region: "BE-DG",
    context: "newsletter-signup",
    relationship: "none",
  })
  const record = await rules.buildAuditRecord({
    ip: "1.2.3.4",
    userAgent: "ua",
    sourceUrl: "https://x",
    wording: "consent",
    formVersion: "v2",
  })
  const row = toRow(record, rules)
  const restored = fromRow(row)
  assert.deepEqual(restored, record)
  assert.equal(row.region, "BE-DG")
})
