// Pre-publish smoke test. Run via `node scripts/preflight.mjs`.
// 1) every bundled country resolves
// 2) every country returns a valid OptIn for newsletter-signup/none
// 3) basis.url is well-formed and basis.dataLastUpdated is a valid date
// 4) spot-check the 6 round-6 corrections survived the build
// 5) basic behaviour benchmarks (US single, DE double, FR express)

import {
  getEmailRules,
  BUNDLED_COUNTRIES,
  CONSENT_DATA_VERSION,
} from "../dist/index.js"

const VALID_OPTIN = new Set(["single", "double", "express", "blocked"])
const VALID_B2B = new Set([
  "casl-intra-org",
  "gdpr-lia",
  "can-spam-default",
  "publicly-disclosed",
  "function-address",
  "none",
])

let failures = 0
const fail = (msg) => {
  console.error("FAIL:", msg)
  failures++
}
const ok = (msg) => console.log("OK  :", msg)

// 1+2+3 — sweep
for (const c of BUNDLED_COUNTRIES) {
  try {
    const rules = getEmailRules({
      country: c.code,
      context: "newsletter-signup",
      relationship: "none",
    })
    if (!VALID_OPTIN.has(rules.optIn)) fail(`${c.code} optIn invalid: ${rules.optIn}`)
    if (!VALID_B2B.has(rules.b2bExemption.regime)) fail(`${c.code} b2bExemption.regime invalid: ${rules.b2bExemption.regime}`)
    if (typeof rules.basis.url !== "string" || !/^https?:\/\//.test(rules.basis.url)) fail(`${c.code} basis.url malformed: ${rules.basis.url}`)
    const d = rules.basis.dataLastUpdated
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || isNaN(Date.parse(d))) fail(`${c.code} dataLastUpdated invalid: ${d}`)
    if (rules.basis.confidence === "high") fail(`${c.code} confidence raised to high (rule cap is medium)`)
    if (typeof rules.childAgeOfConsent !== "number" || rules.childAgeOfConsent < 5 || rules.childAgeOfConsent > 21) fail(`${c.code} childAgeOfConsent out of range: ${rules.childAgeOfConsent}`)
  } catch (e) {
    fail(`${c.code} threw: ${e.message}`)
  }
}
ok(`67 countries swept (${BUNDLED_COUNTRIES.length} bundled)`)

// 4 — round-6 corrections survived
const expectInBasis = (code, fragment) => {
  const r = getEmailRules({ country: code, context: "newsletter-signup", relationship: "none" })
  if (!r.basis.statute.includes(fragment)) {
    fail(`${code} basis.statute should include "${fragment}", got: ${r.basis.statute}`)
  } else {
    ok(`${code} basis.statute contains "${fragment}"`)
  }
}
expectInBasis("SK", "452/2021")          // Act 351/2011 §62 was repealed
expectInBasis("PE", "016-2024-JUS")      // DS 003-2013-JUS was repealed
expectInBasis("PT", "13.º-A")       // Art. 13 → 13-A/13-B
// HK / NZ / AE: comment-only fixes, not in statute string

// 5 — behaviour benchmarks
const cases = [
  ["US", "single"],
  ["DE", "double"],
  ["GB", "double"],
  ["IT", "double"],
  ["FR", "express"],
  ["CA", "express"],
  ["AU", "express"],
  ["MX", "single"],
]
for (const [code, expected] of cases) {
  const r = getEmailRules({ country: code, context: "newsletter-signup", relationship: "none" })
  if (r.optIn !== expected) fail(`${code} optIn expected ${expected}, got ${r.optIn}`)
  else ok(`${code} optIn = ${expected}`)
}

// 6 — CONSENT_DATA_VERSION shape
if (!/^\d{4}-\d{2}-\d{2}$/.test(CONSENT_DATA_VERSION)) {
  fail(`CONSENT_DATA_VERSION malformed: ${CONSENT_DATA_VERSION}`)
} else {
  ok(`CONSENT_DATA_VERSION = ${CONSENT_DATA_VERSION}`)
}

if (failures > 0) {
  console.error(`\n${failures} failure(s)`)
  process.exit(1)
}
console.log("\nAll preflight checks passed.")
