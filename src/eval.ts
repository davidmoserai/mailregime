import type {
  CountryData,
  DeepPartial,
  EmailRulesData,
  GetEmailRulesInput,
} from "./types.js"

// Plain-object deep merge. Arrays are replaced wholesale (not concatenated)
// because semantic intent is "this regime overrides that field," not "extend."
// Functions are not expected in data; they're attached after evaluation.
export function deepMerge<T extends Record<string, unknown>>(
  base: T,
  override: DeepPartial<T> | undefined,
): T {
  if (!override) return base
  const out: Record<string, unknown> = { ...base }
  for (const key of Object.keys(override)) {
    const ov = (override as Record<string, unknown>)[key]
    const bv = (base as Record<string, unknown>)[key]
    if (ov === undefined) continue
    if (Array.isArray(ov)) {
      out[key] = ov.slice()
    } else if (
      ov !== null &&
      typeof ov === "object" &&
      bv !== null &&
      typeof bv === "object" &&
      !Array.isArray(bv)
    ) {
      out[key] = deepMerge(
        bv as Record<string, unknown>,
        ov as DeepPartial<Record<string, unknown>>,
      )
    } else {
      out[key] = ov
    }
  }
  return out as T
}

export function evaluate(
  data: CountryData,
  input: GetEmailRulesInput,
): EmailRulesData {
  let rules: EmailRulesData = deepMerge(data.defaults, undefined)

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
