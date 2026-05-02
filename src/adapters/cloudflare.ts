// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Cloudflare Workers jurisdiction adapter. Reads `cf-ipcountry` and
// `cf-region-code`. As with Vercel, Cloudflare overwrites client-supplied
// values at the edge.

import type { CountryDetection } from "../types.js"

export function fromCloudflareRequest(
  request: Request | { headers: Headers | { get(name: string): string | null } },
): CountryDetection {
  const country = request.headers.get("cf-ipcountry")
  const regionCode = request.headers.get("cf-region-code")
  const normalized = country && country.length === 2 ? country.toUpperCase() : null
  return {
    country: normalized,
    region: regionCode && normalized ? `${normalized}-${regionCode.toUpperCase()}` : null,
    source: normalized ? "header" : "unknown",
    confidence: normalized ? "high" : "low",
  }
}
