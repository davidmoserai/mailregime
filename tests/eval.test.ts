import { test } from "node:test"
import assert from "node:assert/strict"
import { deepMerge, evaluate } from "../src/eval.js"
import { US } from "../src/data/countries/US.js"
import { DE } from "../src/data/countries/DE.js"
import { CA } from "../src/data/countries/CA.js"

test("deepMerge — replaces arrays wholesale", () => {
  const merged = deepMerge(
    { channels: ["email", "sms"] as ("email" | "sms")[], a: 1 },
    { channels: ["email"] as ("email" | "sms")[] },
  )
  assert.deepEqual(merged.channels, ["email"])
  assert.equal(merged.a, 1)
})

test("deepMerge — null override is honoured", () => {
  const merged = deepMerge(
    { ttl: 24 as number | null, other: "x" },
    { ttl: null },
  )
  assert.equal(merged.ttl, null)
  assert.equal(merged.other, "x")
})

test("deepMerge — undefined skipped", () => {
  const merged = deepMerge(
    { a: 1, b: 2 },
    { b: undefined } as { b?: number },
  )
  assert.equal(merged.a, 1)
  assert.equal(merged.b, 2)
})

test("deepMerge — nested object merge", () => {
  const merged = deepMerge(
    { nested: { a: 1, b: 2 }, x: 0 },
    { nested: { b: 99 } } as { nested?: { b?: number } },
  )
  assert.deepEqual(merged.nested, { a: 1, b: 99 })
  assert.equal(merged.x, 0)
})

test("evaluate — defaults applied when no overrides", () => {
  const rules = evaluate(US, {
    country: "US",
    context: "newsletter-signup",
    relationship: "none",
  })
  assert.equal(rules.optIn, "single")
  assert.equal(rules.checkboxRequired, false)
})

test("evaluate — context override applied (DE lead-magnet blocked)", () => {
  const rules = evaluate(DE, {
    country: "DE",
    context: "lead-magnet",
    relationship: "none",
  })
  assert.equal(rules.canCollectForMarketing, false)
  assert.equal(rules.optIn, "blocked")
})

test("evaluate — relationship override (DE existing-customer soft opt-in)", () => {
  const rules = evaluate(DE, {
    country: "DE",
    context: "newsletter-signup",
    relationship: "existing-customer",
  })
  assert.equal(rules.softOptInAvailable, true)
  assert.equal(rules.softOptInScope, "similar-products")
  assert.equal(rules.requiresCallerSimilarityAssertion, true)
})

test("evaluate — region override (Quebec French-language requirement)", () => {
  const rules = evaluate(CA, {
    country: "CA",
    region: "CA-QC",
    context: "newsletter-signup",
    relationship: "none",
  })
  assert.deepEqual(rules.consentLanguage.required, ["fr-CA"])
  assert.equal(rules.consentLanguage.mustMatchUserLocale, true)
  assert.equal(rules.basis.subRegime, "QC-Law-25")
})

test("evaluate — region override does NOT apply outside that region", () => {
  const rules = evaluate(CA, {
    country: "CA",
    context: "newsletter-signup",
    relationship: "none",
  })
  assert.deepEqual(rules.consentLanguage.required, [])
  assert.equal(rules.consentLanguage.mustMatchUserLocale, false)
})

test("evaluate — merge order: defaults < context < relationship < region", () => {
  // CA referral overrides impliedConsentTtlMonths to 6.
  // CA existing-customer overrides it to 24.
  // Relationship is later in the chain → wins.
  const rules = evaluate(CA, {
    country: "CA",
    context: "referral",
    relationship: "existing-customer",
  })
  assert.equal(rules.impliedConsentTtlMonths, 24)
})
