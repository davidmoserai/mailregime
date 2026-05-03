// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Static adapter — for tests and for callers that detect jurisdiction
// elsewhere (self-declared profile, billing address, etc.).

import type { CountryDetection } from "../types.js"

export function fromStatic(
  country: string | null,
  region: string | null = null,
): CountryDetection {
  return {
    country: country ? country.toUpperCase() : null,
    region: region ? region.toUpperCase() : null,
    source: country ? "static" : "unknown",
    confidence: country ? "high" : "low",
  }
}

// Priority-ordered fold over multiple detections — last non-null wins.
// mailregime does NOT encode "which country is stricter" (that requires
// regime-level reasoning the library doesn't have at the detection
// layer). Callers pass detections in priority order, most-authoritative
// last (typically: header < self-declared < billing).
export function mergeDetections(...detections: CountryDetection[]): CountryDetection {
  let result: CountryDetection = {
    country: null,
    region: null,
    source: "unknown",
    confidence: "low",
  }
  for (const d of detections) {
    if (d.country) result = d
  }
  return result
}
