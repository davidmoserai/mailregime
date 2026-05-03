import { test } from "node:test"
import assert from "node:assert/strict"
import {
  configure,
  getEmailRules,
  registerCountry,
  lookupCountry,
} from "../src/index.js"

// Silence the one-time disclaimer warning during tests.
process.env["MAILREGIME_SILENCE_DISCLAIMER"] = "1"

test("getEmailRules — US newsletter-signup is single opt-in", () => {
  const rules = getEmailRules({
    country: "US",
    context: "newsletter-signup",
    relationship: "none",
  })
  assert.equal(rules.canCollectForMarketing, true)
  assert.equal(rules.optIn, "single")
  assert.equal(rules.checkboxRequired, false)
  assert.equal(typeof rules.buildAuditRecord, "function")
})

test("getEmailRules — DE lead-magnet is blocked", () => {
  const rules = getEmailRules({
    country: "DE",
    context: "lead-magnet",
    relationship: "none",
  })
  assert.equal(rules.canCollectForMarketing, false)
  assert.equal(rules.optIn, "blocked")
})

test("getEmailRules — country code normalised case-insensitively", () => {
  const lower = getEmailRules({
    country: "de",
    context: "newsletter-signup",
    relationship: "none",
  })
  assert.equal(lower.optIn, "double")
})

test("getEmailRules — null country with default policy throws", () => {
  configure({ unknownCountryPolicy: "throw" })
  assert.throws(
    () =>
      getEmailRules({
        country: null,
        context: "newsletter-signup",
        relationship: "none",
      }),
    /not registered/,
  )
})

test("getEmailRules — strict policy returns conservative fallback", () => {
  configure({ unknownCountryPolicy: "strict" })
  const rules = getEmailRules({
    country: "ZZ", // unknown
    context: "newsletter-signup",
    relationship: "none",
  })
  assert.equal(rules.optIn, "double")
  assert.equal(rules.checkboxRequired, true)
  assert.equal(rules.basis.confidence, "low")
  assert.equal(rules.basis.subRegime, "mailregime-strict-fallback")
  configure({ unknownCountryPolicy: "throw" })
})

test("getEmailRules — permissive policy falls back to US for unknown", () => {
  configure({ unknownCountryPolicy: "permissive" })
  const rules = getEmailRules({
    country: "ZZ",
    context: "newsletter-signup",
    relationship: "none",
  })
  assert.equal(rules.optIn, "single")
  configure({ unknownCountryPolicy: "throw" })
})

test("lookupCountry — case-insensitive", () => {
  assert.ok(lookupCountry("us"))
  assert.ok(lookupCountry("US"))
  assert.ok(lookupCountry("Us"))
})

test("registerCountry — overrides bundled record", () => {
  const original = lookupCountry("US")
  assert.ok(original)
  registerCountry({
    ...original,
    code: "US",
    defaults: { ...original.defaults, optIn: "double" },
  })
  const rules = getEmailRules({
    country: "US",
    context: "newsletter-signup",
    relationship: "none",
  })
  assert.equal(rules.optIn, "double")
  // Restore by re-registering original.
  registerCountry(original)
  const restored = getEmailRules({
    country: "US",
    context: "newsletter-signup",
    relationship: "none",
  })
  assert.equal(restored.optIn, "single")
})
