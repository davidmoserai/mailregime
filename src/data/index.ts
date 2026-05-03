// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.

import type { CountryData } from "../types.js"
import { US } from "./countries/US.js"
import { GB } from "./countries/GB.js"
import { DE } from "./countries/DE.js"
import { CA } from "./countries/CA.js"
import { AU } from "./countries/AU.js"

export const BUNDLED_COUNTRIES: ReadonlyArray<CountryData> = [
  US,
  GB,
  DE,
  CA,
  AU,
]

// Static map for bundled countries. Apps that want tree-shaking import
// from `mailregime/data/countries/<code>` directly and call `registerCountry`.
const bundled = new Map<string, CountryData>()
for (const c of BUNDLED_COUNTRIES) bundled.set(c.code, c)

// Runtime registry. Bundled countries are inserted lazily on first miss
// to keep imports tree-shakable for callers who never query them.
const registry = new Map<string, CountryData>()

export function registerCountry(data: CountryData): void {
  registry.set(data.code.toUpperCase(), data)
}

export function lookupCountry(code: string): CountryData | undefined {
  const upper = code.toUpperCase()
  const registered = registry.get(upper)
  if (registered) return registered
  return bundled.get(upper)
}

// The `consentDataVersion` ships in this build of the package. Pinned
// independently from the library SemVer (see docs/MODULARITY.md).
export const CONSENT_DATA_VERSION = "2026-05-02"
