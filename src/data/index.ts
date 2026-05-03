// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.

import type { CountryData } from "../types.js"

// Wave 1 — original 27 (Anglo, EU/Western, EEA, key APAC, LatAm, MENA, ZA).
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

// Wave 2 — rest of EU/EEA (GDPR + national ePrivacy transpositions).
import { BG } from "./countries/BG.js"
import { CY } from "./countries/CY.js"
import { CZ } from "./countries/CZ.js"
import { EE } from "./countries/EE.js"
import { FI } from "./countries/FI.js"
import { GR } from "./countries/GR.js"
import { HR } from "./countries/HR.js"
import { HU } from "./countries/HU.js"
import { IS } from "./countries/IS.js"
import { LI } from "./countries/LI.js"
import { LT } from "./countries/LT.js"
import { LU } from "./countries/LU.js"
import { LV } from "./countries/LV.js"
import { MT } from "./countries/MT.js"
import { PT } from "./countries/PT.js"
import { RO } from "./countries/RO.js"
import { SI } from "./countries/SI.js"
import { SK } from "./countries/SK.js"

// Wave 2 — rest of APAC, LATAM, MENA, Africa, CIS.
import { HK } from "./countries/HK.js"
import { TW } from "./countries/TW.js"
import { MY } from "./countries/MY.js"
import { TH } from "./countries/TH.js"
import { ID } from "./countries/ID.js"
import { PH } from "./countries/PH.js"
import { VN } from "./countries/VN.js"
import { AR } from "./countries/AR.js"
import { CL } from "./countries/CL.js"
import { CO } from "./countries/CO.js"
import { PE } from "./countries/PE.js"
import { UY } from "./countries/UY.js"
import { SA } from "./countries/SA.js"
import { QA } from "./countries/QA.js"
import { TR } from "./countries/TR.js"
import { EG } from "./countries/EG.js"
import { MA } from "./countries/MA.js"
import { NG } from "./countries/NG.js"
import { KE } from "./countries/KE.js"
import { GH } from "./countries/GH.js"
import { RU } from "./countries/RU.js"
import { UA } from "./countries/UA.js"

// 67 countries. See COLLABORATION.md for how to contribute a country
// (primary-source citations required). Coverage gaps remain across
// sub-Saharan Africa, Central Asia, the Caribbean and Oceania.
export const BUNDLED_COUNTRIES: ReadonlyArray<CountryData> = [
  // Original 27
  US, GB, DE, CA, AU,
  FR, IT, ES, NL, BE, IE, AT, PL, SE, DK,
  CH, NO,
  JP, KR, SG, IN, NZ,
  BR, MX,
  AE, IL, ZA,
  // Rest of EU/EEA
  BG, CY, CZ, EE, FI, GR, HR, HU, IS, LI, LT, LU, LV, MT, PT, RO, SI, SK,
  // APAC
  HK, TW, MY, TH, ID, PH, VN,
  // LATAM
  AR, CL, CO, PE, UY,
  // MENA + Africa
  SA, QA, TR, EG, MA, NG, KE, GH,
  // CIS
  RU, UA,
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
