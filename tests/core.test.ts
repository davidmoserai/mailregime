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

test("Tier-2 countries are bundled and queryable", () => {
  const tier2 = ["FR", "IT", "ES", "NL", "BE", "IE", "AT", "PL", "SE", "DK",
                 "CH", "NO", "JP", "KR", "SG", "IN", "NZ", "BR", "MX",
                 "AE", "IL", "ZA"]
  for (const code of tier2) {
    assert.ok(lookupCountry(code), `${code} not registered`)
  }
})

test("FR — express opt-in + French language requirement", () => {
  const rules = getEmailRules({ country: "FR", context: "newsletter-signup", relationship: "none" })
  assert.equal(rules.optIn, "express")
  assert.deepEqual(rules.consentLanguage.required, ["fr-FR"])
  assert.equal(rules.basis.subRegime, "FR-LCEN")
})

test("IN — DPDP, no soft opt-in even for existing customers", () => {
  const rules = getEmailRules({ country: "IN", context: "newsletter-signup", relationship: "existing-customer" })
  assert.equal(rules.softOptInAvailable, false)
  assert.equal(rules.childAgeOfConsent, 18)
})

test("PL — strictest EU regime, no soft opt-in", () => {
  const rules = getEmailRules({ country: "PL", context: "newsletter-signup", relationship: "existing-customer" })
  assert.equal(rules.softOptInAvailable, false)
})

test("NZ — permissive B2B via deemed consent", () => {
  const rules = getEmailRules({ country: "NZ", context: "newsletter-signup", relationship: "publicly-listed-business" })
  assert.equal(rules.optIn, "single")
})

test("BE — German-speaking Community (BE-DG) overrides language to de-BE", () => {
  const rules = getEmailRules({ country: "BE", region: "BE-DG", context: "newsletter-signup", relationship: "none" })
  assert.deepEqual(rules.consentLanguage.required, ["de-BE"])
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
