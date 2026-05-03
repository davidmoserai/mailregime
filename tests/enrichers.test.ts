import { test } from "node:test"
import assert from "node:assert/strict"
import { enrichBE, BE_DG_POSTCODES } from "../src/enrichers/be.js"
import { fromStatic } from "../src/adapters/static.js"
import { getEmailRules } from "../src/index.js"

process.env.MAILREGIME_SILENCE_DISCLAIMER = "1"

test("enrichBE — postcode in DG range upgrades region to BE-DG", () => {
  const before = fromStatic("BE", "BE-WLG")
  const after = enrichBE(before, { postalCode: "4700" })
  assert.equal(after.region, "BE-DG")
  // other fields preserved
  assert.equal(after.country, "BE")
  assert.equal(after.source, before.source)
})

test("enrichBE — postcode outside DG keeps original region", () => {
  const before = fromStatic("BE", "BE-WLG")
  const after = enrichBE(before, { postalCode: "1000" }) // Brussels
  assert.equal(after.region, "BE-WLG")
})

test("enrichBE — declared locale 'de' triggers DG", () => {
  const before = fromStatic("BE")
  const after = enrichBE(before, { declaredLocale: "de-BE" })
  assert.equal(after.region, "BE-DG")
})

test("enrichBE — billing city Eupen triggers DG", () => {
  const before = fromStatic("BE")
  const after = enrichBE(before, { billingCity: "Eupen" })
  assert.equal(after.region, "BE-DG")
})

test("enrichBE — non-BE country passes through unchanged", () => {
  const before = fromStatic("DE")
  const after = enrichBE(before, { postalCode: "4700" })
  assert.equal(after.country, "DE")
  assert.equal(after.region, null)
})

test("enrichBE — accepts numeric postal codes", () => {
  const before = fromStatic("BE")
  const after = enrichBE(before, { postalCode: 4790 })
  assert.equal(after.region, "BE-DG")
})

test("enrichBE — exported BE_DG_POSTCODES is non-empty + sorted", () => {
  assert.ok(BE_DG_POSTCODES.length > 5)
  for (let i = 1; i < BE_DG_POSTCODES.length; i++) {
    assert.ok(BE_DG_POSTCODES[i]! >= BE_DG_POSTCODES[i - 1]!)
  }
})

test("end-to-end — German Belgian gets de-BE consent language via enricher", () => {
  // Simulate a Vercel request from Eupen; CDN says BE-WLG.
  // App has the user's postal code from a billing form.
  const cdn = fromStatic("BE", "BE-WLG")
  const refined = enrichBE(cdn, { postalCode: "4700" })

  const rules = getEmailRules({
    country: refined.country,
    region: refined.region,
    context: "newsletter-signup",
    relationship: "none",
  })

  assert.deepEqual(rules.consentLanguage.required, ["de-BE"])
  assert.equal(rules.consentLanguage.mustMatchUserLocale, true)
})

test("end-to-end — Walloon Belgian (no DG signals) gets fr-BE", () => {
  const cdn = fromStatic("BE", "BE-WAL")
  const refined = enrichBE(cdn, { postalCode: "5000" }) // Namur, French
  const rules = getEmailRules({
    country: refined.country,
    region: refined.region,
    context: "newsletter-signup",
    relationship: "none",
  })
  assert.deepEqual(rules.consentLanguage.required, ["fr-BE"])
})
