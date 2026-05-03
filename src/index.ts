// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// mailregime — country-code → email-marketing-consent rules.
// The maintainers carry zero liability for any use of this software.
// By importing this module you agree to the terms in LICENSE.

import { evaluate } from "./eval.js"
import { lookupCountry, CONSENT_DATA_VERSION } from "./data/index.js"
import { buildAuditRecord } from "./audit/index.js"
import type {
  AuditContext,
  AuditRecord,
  Configuration,
  CountryData,
  EmailRules,
  EmailRulesData,
  GetEmailRulesInput,
} from "./types.js"

export type {
  AuditContext,
  AuditRecord,
  Basis,
  B2BExemption,
  Channel,
  Configuration,
  Context,
  CountryData,
  CountryDetection,
  DeepPartial,
  EmailRules,
  EmailRulesData,
  GetEmailRulesInput,
  LawyerAttestation,
  OptIn,
  RegisterCountryInput,
  Relationship,
} from "./types.js"

export { registerCountry, lookupCountry, BUNDLED_COUNTRIES } from "./data/index.js"
export { evaluate, deepMerge } from "./eval.js"
export { buildAuditRecord, redactReceipt, serializeISO27560 } from "./audit/index.js"
export { CONSENT_DATA_VERSION }

const DEFAULT_CONFIG: Configuration = {
  unknownCountryPolicy: "throw",
  consentDataVersion: CONSENT_DATA_VERSION,
  staleDataWarnAfterMonths: 12,
}

let config: Configuration = { ...DEFAULT_CONFIG }
let disclaimerWarned = false

export function configure(partial: Partial<Configuration>): void {
  config = { ...config, ...partial }
}

export function getConfiguration(): Readonly<Configuration> {
  return config
}

// One-time advisory log so the disclaimer surfaces in environments that
// never see the README. Suppressible via MAILREGIME_SILENCE_DISCLAIMER=1.
// Edge-safe — `process` may not exist on Cloudflare Workers / browsers.
function emitDisclaimerOnce(): void {
  if (disclaimerWarned) return
  disclaimerWarned = true
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
  if (proc?.env?.["MAILREGIME_SILENCE_DISCLAIMER"] === "1" || proc?.env?.["MAILREGIME_SILENCE_DISCLAIMER"] === "true") return
  // Suppress in production by default. Opt back in with MAILREGIME_SHOW_DISCLAIMER=1.
  if (proc?.env?.["NODE_ENV"] === "production" && proc?.env?.["MAILREGIME_SHOW_DISCLAIMER"] !== "1") return
  console.warn(
    "[mailregime] Informational only, not legal advice. Maintainers carry zero liability. See LICENSE / DISCLAIMER.md. Silence with MAILREGIME_SILENCE_DISCLAIMER=1.",
  )
}

export class UnknownCountryError extends Error {
  constructor(country: string | null) {
    super(
      `mailregime: country "${country ?? "null"}" is not registered. Either bundle it via registerCountry(), pass a known ISO 3166-1 alpha-2 code, or set unknownCountryPolicy to "strict" or "permissive" via configure().`,
    )
    this.name = "UnknownCountryError"
  }
}

// Strict-fallback regime — used when configure({ unknownCountryPolicy: "strict" }).
// Mirrors the GDPR/UK shape: DOI required, checkbox required, no soft opt-in.
// Every field is "deny" or "stricter" because we don't know the user's actual
// regime. Conservative by design.
function strictFallback(country: string | null): EmailRulesData {
  return {
    canCollectForMarketing: true,
    optIn: "double",
    checkboxRequired: true,
    bundlingAllowed: false,
    prechecking: "forbidden",
    channels: ["email"],
    unsubscribeMechanism: "one-click",
    softOptInAvailable: false,
    softOptInScope: "none",
    requiresCallerSimilarityAssertion: false,
    impliedConsentTtlMonths: null,
    b2bExemption: { regime: "none", conditions: [] },
    consentLanguage: { required: [], mustMatchUserLocale: false },
    dataResidency: {
      storageRegion: "any",
      crossBorderTransferMechanism: "scc",
    },
    consentRecordRetentionMonths: 60,
    sensitiveDataFlags: {
      healthMarketingBlocked: true,
      politicalMarketingBlocked: true,
      childrenBlocked: true,
    },
    preferenceCenter: {
      granularityRequired: "purpose",
      perEmailUnsubAlsoRequired: true,
    },
    senderIdentity: {
      physicalAddressRequired: true,
      legalEntityNameRequired: true,
      representativeRequired: true,
    },
    reConsentTriggerMonths: 24,
    childAgeOfConsent: 16,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Strict fallback (unknown country)",
      url: "https://github.com/davidmoserai/mailregime/blob/main/docs/DESIGN.md",
      jurisdiction: country ?? "UNKNOWN",
      subRegime: "mailregime-strict-fallback",
      dataLastUpdated: CONSENT_DATA_VERSION,
      confidence: "low",
      extraterritorialReach: false,
      lawyerAttestation: null,
    },
    suggestedTemplate: "double-opt-in",
  }
}

// Console-warn once per process when bundled data is older than the
// configured threshold. Helps surface stale legal data in dev.
const staleWarnedFor = new Set<string>()
function warnIfStale(rules: EmailRulesData, country: string): void {
  if (staleWarnedFor.has(country)) return
  staleWarnedFor.add(country)
  const updated = Date.parse(rules.basis.dataLastUpdated)
  if (Number.isNaN(updated)) return
  // Approximate (30-day months). Precision not material at month granularity.
  const ageMonths = (Date.now() - updated) / (1000 * 60 * 60 * 24 * 30)
  if (ageMonths < config.staleDataWarnAfterMonths) return
  // eslint-disable-next-line no-console
  console.warn(
    `[mailregime] Data for ${country} is ${ageMonths.toFixed(0)} months old (last updated ${rules.basis.dataLastUpdated}). Verify against current law.`,
  )
}

export function getEmailRules(input: GetEmailRulesInput): EmailRules {
  emitDisclaimerOnce()

  const country = input.country ?? null
  let baseRules: EmailRulesData

  if (!country) {
    if (config.unknownCountryPolicy === "throw") throw new UnknownCountryError(country)
    baseRules = strictFallback(country)
  } else {
    const data = lookupCountry(country)
    if (!data) {
      if (config.unknownCountryPolicy === "throw") throw new UnknownCountryError(country)
      if (config.unknownCountryPolicy === "permissive") {
        const us = lookupCountry("US")
        if (!us) throw new UnknownCountryError(country)
        baseRules = evaluate(us, { ...input, country: "US" })
      } else {
        baseRules = strictFallback(country)
      }
    } else {
      baseRules = evaluate(data, input)
      warnIfStale(baseRules, data.code)
    }
  }

  const rules: EmailRules = {
    ...baseRules,
    buildAuditRecord: (ctx: AuditContext): Promise<AuditRecord> =>
      buildAuditRecord(input, baseRules, ctx),
  }
  return rules
}
