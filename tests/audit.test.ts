import { test } from "node:test"
import assert from "node:assert/strict"
import { getEmailRules, redactReceipt, serializeISO27560 } from "../src/index.js"

process.env["MAILREGIME_SILENCE_DISCLAIMER"] = "1"

test("buildAuditRecord — populates ISO 27560 superset", async () => {
  const rules = getEmailRules({
    country: "DE",
    context: "newsletter-signup",
    relationship: "none",
  })
  const record = await rules.buildAuditRecord({
    ip: "203.0.113.4",
    userAgent: "Mozilla/5.0 (test)",
    sourceUrl: "https://example.com/subscribe",
    wording: "I agree to receive marketing emails about similar products.",
    formVersion: "v3",
    subjectId: "sha256:abc",
  })
  assert.equal(record.schemaVersion, "mailregime/1")
  assert.equal(record.iso27560Version, "1.0")
  assert.match(record.consentId, /^[0-9A-Z]{26}$/)
  assert.equal(record.subjectId, "sha256:abc")
  assert.equal(record.country, "DE")
  assert.equal(record.context, "newsletter-signup")
  assert.equal(record.basis.jurisdiction, "EU")
  assert.match(record.wordingHash, /^[0-9a-f]{64}$/)
  assert.equal(record.withdrawnAt, null)
})

test("buildAuditRecord — same wording produces same hash", async () => {
  const rules = getEmailRules({
    country: "US",
    context: "newsletter-signup",
    relationship: "none",
  })
  const ctx = {
    ip: null,
    userAgent: null,
    sourceUrl: "https://example.com/x",
    wording: "Subscribe",
    formVersion: "v1",
  }
  const a = await rules.buildAuditRecord(ctx)
  const b = await rules.buildAuditRecord(ctx)
  assert.equal(a.wordingHash, b.wordingHash)
  assert.notEqual(a.consentId, b.consentId)
})

test("redactReceipt — removes direct identifiers, preserves proof structure", async () => {
  const rules = getEmailRules({
    country: "GB",
    context: "newsletter-signup",
    relationship: "none",
  })
  const record = await rules.buildAuditRecord({
    ip: "203.0.113.4",
    userAgent: "Mozilla/5.0 (test)",
    sourceUrl: "https://example.com/x",
    wording: "subscribe please",
    formVersion: "v1",
    subjectId: "sha256:foo",
  })
  const redacted = redactReceipt(record)
  assert.equal(redacted.subjectId, null)
  assert.equal(redacted.ip, null)
  assert.equal(redacted.userAgent, null)
  assert.equal(redacted.wording, "[redacted]")
  assert.equal(redacted.consentId, record.consentId)
  assert.equal(redacted.basis.statute, record.basis.statute)
  assert.ok(redacted.withdrawnAt)
  assert.equal(redacted.withdrawalMethod, "erasure-request")
})

test("serializeISO27560 — emits standard-shaped projection", async () => {
  const rules = getEmailRules({
    country: "US",
    context: "newsletter-signup",
    relationship: "none",
  })
  const record = await rules.buildAuditRecord({
    ip: null,
    userAgent: null,
    sourceUrl: "https://example.com/x",
    wording: "Subscribe",
    formVersion: "v1",
  })
  const projection = serializeISO27560(record) as Record<string, unknown>
  assert.equal(projection["version"], "1.0")
  assert.equal(projection["jurisdiction"], "US")
  assert.equal(projection["consentReceiptID"], record.consentId)
  const services = projection["services"] as Array<{ purposes: Array<{ purpose: string }> }>
  assert.ok(Array.isArray(services))
  assert.equal(services[0]?.purposes[0]?.purpose, "newsletter-signup")
})

test("buildAuditRecord — preserves countrySource provenance from adapter", async () => {
  const rules = getEmailRules({
    country: "DE",
    context: "newsletter-signup",
    relationship: "none",
  })
  const record = await rules.buildAuditRecord({
    ip: null,
    userAgent: null,
    sourceUrl: "https://example.com/x",
    wording: "Subscribe",
    formVersion: "v1",
    countrySource: "header",
  })
  assert.equal(record.countrySource, "header")
})
