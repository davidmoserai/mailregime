// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Vercel jurisdiction adapter. Reads `x-vercel-ip-country`. Vercel's edge
// overwrites any client-supplied value, so the header isn't spoofable —
// but VPN / proxy users are still detected at the egress IP, not the
// user's actual location. See docs/DESIGN.md edge cases.

import type { CountryDetection } from "../types.js"

export function fromVercelRequest(
  request: Request | { headers: Headers | { get(name: string): string | null } },
): CountryDetection {
  const country = request.headers.get("x-vercel-ip-country")
  const region = request.headers.get("x-vercel-ip-country-region")
  const normalized = country && country.length === 2 ? country.toUpperCase() : null
  return {
    country: normalized,
    region: region && country ? `${normalized}-${region.toUpperCase()}` : null,
    source: normalized ? "header" : "unknown",
    confidence: normalized ? "high" : "low",
  }
}
