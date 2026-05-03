// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.

import type { CountryData } from "../types.js"
import { US } from "./countries/US.js"
import { GB } from "./countries/GB.js"
import { DE } from "./countries/DE.js"
import { CA } from "./countries/CA.js"
import { AU } from "./countries/AU.js"
import { FR } from "./countries/FR.js"
import { IT } from "./countries/IT.js"
import { ES } from "./countries/ES.js"
import { NL } from "./countries/NL.js"
import { BE } from "./countries/BE.js"
import { IE } from "./countries/IE.js"
import { AT } from "./countries/AT.js"
import { PL } from "./countries/PL.js"
import { SE } from "./countries/SE.js"
import { DK } from "./countries/DK.js"
import { CH } from "./countries/CH.js"
import { NO } from "./countries/NO.js"
import { JP } from "./countries/JP.js"
import { KR } from "./countries/KR.js"
import { SG } from "./countries/SG.js"
import { IN } from "./countries/IN.js"
import { NZ } from "./countries/NZ.js"
import { BR } from "./countries/BR.js"
import { MX } from "./countries/MX.js"
import { AE } from "./countries/AE.js"
import { IL } from "./countries/IL.js"
import { ZA } from "./countries/ZA.js"

// 27 countries. Roadmap: rest of EU, rest of APAC, rest of LatAm,
// MENA + Africa expansion. See COLLABORATION.md for how to contribute
// a country (primary-source citations required).
export const BUNDLED_COUNTRIES: ReadonlyArray<CountryData> = [
  US, GB, DE, CA, AU,
  FR, IT, ES, NL, BE, IE, AT, PL, SE, DK,
  CH, NO,
  JP, KR, SG, IN, NZ,
  BR, MX,
  AE, IL, ZA,
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
export const CONSENT_DATA_VERSION = "2026-05-03"
