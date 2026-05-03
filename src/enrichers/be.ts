// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Belgium region enricher. Refines a CountryDetection when the caller
// has data the CDN can't see (postal code, declared locale, billing
// city) and that data signals the user is in the Deutschsprachige
// Gemeinschaft (German-speaking Community). DG has no ISO 3166-2 code,
// so CDN headers can never detect it directly.
//
// Pure function. Same input/output shape as fromXxxRequest adapters.
// Tree-shakeable — only imported by callers that need it.

import type { CountryDetection } from "../types.js"

// 9 municipalities of the Deutschsprachige Gemeinschaft (Eupen, Kelmis,
// Lontzen, Raeren, Amel, Büllingen, Bütgenbach, Burg-Reuland, St. Vith).
// Postal codes per bpost. Source: https://www.bpost.be/
const DG_POSTCODES = new Set([
  4700, 4701, 4710, 4711, 4720, 4721, 4728, 4730, 4731, 4750, 4760,
  4761, 4770, 4771, 4780, 4782, 4783, 4784, 4790, 4791, 4960,
])

const DG_CITY_NAMES = new Set([
  "eupen", "kelmis", "la calamine", "lontzen", "raeren", "amel",
  "amblève", "büllingen", "bullange", "bütgenbach", "butgenbach",
  "burg-reuland", "sankt vith", "st. vith", "saint-vith",
])

const DG_FLEMISH_REGION_PROVINCE = "BE-VLG" // Flanders region (BE-VLG)
const DG_WALLOON_REGION_PROVINCE = "BE-WAL" // Walloon region (BE-WAL)

export type EnrichBESignals = {
  /** Postal code if you have it (from your form / billing). Numeric or string. */
  postalCode?: string | number | null
  /** User-declared UI locale, e.g. "de", "de-BE", "fr", "nl". */
  declaredLocale?: string | null
  /** Billing city if available. Case-insensitive. */
  billingCity?: string | null
}

/**
 * Refine a Belgian CountryDetection with regional information that CDN
 * headers cannot provide.
 *
 * Decision order (first match wins):
 *   1. postalCode in DG range          → BE-DG
 *   2. billingCity is a DG municipality → BE-DG
 *   3. declaredLocale starts with "de"  → BE-DG
 *   4. detection.region already specific (BE-VLG, BE-WAL, etc.) → keep
 *   5. otherwise → leave unchanged
 *
 * If detection.country !== "BE", returns the input unchanged.
 */
export function enrichBE(
  detection: CountryDetection,
  signals: EnrichBESignals = {},
): CountryDetection {
  if (detection.country !== "BE") return detection

  const postcode =
    signals.postalCode != null ? Number.parseInt(String(signals.postalCode), 10) : NaN
  if (Number.isFinite(postcode) && DG_POSTCODES.has(postcode)) {
    return { ...detection, region: "BE-DG" }
  }

  const city = signals.billingCity?.trim().toLowerCase()
  if (city && DG_CITY_NAMES.has(city)) {
    return { ...detection, region: "BE-DG" }
  }

  const locale = signals.declaredLocale?.toLowerCase() ?? ""
  if (locale.startsWith("de")) {
    return { ...detection, region: "BE-DG" }
  }

  return detection
}

/**
 * Static maps for callers that want to do their own checks.
 * Exported so consumers don't reimplement the postcode list.
 */
export const BE_DG_POSTCODES: ReadonlyArray<number> = Array.from(DG_POSTCODES).sort()
export const BE_DG_CITIES: ReadonlyArray<string> = Array.from(DG_CITY_NAMES).sort()
export { DG_FLEMISH_REGION_PROVINCE, DG_WALLOON_REGION_PROVINCE }
