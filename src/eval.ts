// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.

import type {
  CountryData,
  DeepPartial,
  EmailRulesData,
  GetEmailRulesInput,
} from "./types.js"

// Plain-object deep merge.
//
// Semantics:
//   • Arrays REPLACE wholesale. A country override of `channels: ["email"]`
//     replaces the base array; we don't concat. Intent is "this regime
//     overrides that field," not "extend." Consumers cannot drop a single
//     channel from an inherited list — they must restate the full list.
//   • `null` overrides are honoured (some fields are nullable:
//     `impliedConsentTtlMonths`, `reConsentTriggerMonths`, `lawyerAttestation`).
//   • `undefined` values in overrides are skipped (keep the base).
//   • Plain-object values are merged recursively. Anything else is replaced.
export function deepMerge<T extends Record<string, unknown>>(
  base: T,
  override: DeepPartial<T> | undefined,
): T {
  if (!override) return base
  const out: Record<string, unknown> = { ...base }
  for (const key of Object.keys(override)) {
    // Defensive guard. Object.keys won't enumerate __proto__ on plain
    // objects, but country data could in principle be authored as a class
    // instance or with Object.create(null). Belt + suspenders.
    if (key === "__proto__" || key === "constructor" || key === "prototype") continue
    const ov = (override as Record<string, unknown>)[key]
    const bv = (base as Record<string, unknown>)[key]
    if (ov === undefined) continue
    if (ov === null) {
      out[key] = null
      continue
    }
    if (Array.isArray(ov)) {
      out[key] = ov.slice()
      continue
    }
    if (
      typeof ov === "object" &&
      bv !== null &&
      typeof bv === "object" &&
      !Array.isArray(bv)
    ) {
      out[key] = deepMerge(
        bv as Record<string, unknown>,
        ov as DeepPartial<Record<string, unknown>>,
      )
      continue
    }
    out[key] = ov
  }
  return out as T
}

// Apply per-context, per-relationship, and per-region overrides on top of
// the country defaults. Order matters: defaults < context < relationship <
// region. Later layers override earlier layers field-by-field.
export function evaluate(
  data: CountryData,
  input: GetEmailRulesInput,
): EmailRulesData {
  let rules: EmailRulesData = { ...data.defaults }

  const ctxOverride = data.byContext?.[input.context]
  if (ctxOverride) rules = deepMerge(rules, ctxOverride)

  const relOverride = data.byRelationship?.[input.relationship]
  if (relOverride) rules = deepMerge(rules, relOverride)

  if (input.region) {
    const regionOverride = data.byRegion?.[input.region]
    if (regionOverride) rules = deepMerge(rules, regionOverride)
  }

  return rules
}
