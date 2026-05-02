// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Generic header adapter. For CDNs/proxies that emit a country header
// under a non-standard name. Caller specifies the header name; trust is
// the caller's responsibility (the header must come from infrastructure
// the caller controls, not the client).

import type { CountryDetection } from "../types.js"

export function fromHeader(
  request: Request | { headers: Headers | { get(name: string): string | null } },
  options: { countryHeader: string; regionHeader?: string },
): CountryDetection {
  const country = request.headers.get(options.countryHeader)
  const regionCode = options.regionHeader ? request.headers.get(options.regionHeader) : null
  const normalized = country && country.length === 2 ? country.toUpperCase() : null
  return {
    country: normalized,
    region: regionCode && normalized ? `${normalized}-${regionCode.toUpperCase()}` : null,
    source: normalized ? "header" : "unknown",
    confidence: normalized ? "high" : "low",
  }
}
