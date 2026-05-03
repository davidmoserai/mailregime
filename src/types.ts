// Public types. Stable surface.
//
// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
// The maintainers make no warranty regarding the accuracy, currency,
// completeness, or fitness of any rule emitted by this library and
// accept no liability for downstream use.

export type Context =
  | "newsletter-signup"
  | "lead-magnet"
  | "account-signup"
  | "purchase"
  | "transactional"
  | "drip-onboarding"
  | "abandoned-cart"
  | "referral"
  | "co-registration"
  | "event-registration"
  | "channel-migration"
  | "win-back"

export type Relationship =
  | "none"
  | "existing-customer"
  | "former-customer"
  | "inquirer"
  | "donor"
  | "member"
  | "publicly-listed-business"
  | "b2b-cold"

export type Channel = "email" | "sms" | "postal"

export type OptIn = "single" | "double" | "express" | "blocked"

export type B2BExemption = {
  regime: "casl-intra-org" | "gdpr-lia" | "can-spam-default" | "none"
  conditions: string[]
}

// Lawyer attestation — present ONLY when an actual named lawyer at a named
// firm has reviewed this data record. Maintainer review and lawyer review
// are different things. Attestation is a transparency signal, NOT a
// guarantee. See DISCLAIMER.md for the full meaning of this field.
export type LawyerAttestation = {
  lawyer: string
  firm: string
  jurisdiction: string
  date: string
  attestationUrl: string
}

export type Basis = {
  statute: string
  url: string
  jurisdiction: string
  subRegime: string | null
  // When a maintainer last touched this record. NOT a lawyer review date.
  // Lawyer-reviewed records ALSO carry a populated `lawyerAttestation`.
  dataLastUpdated: string
  // Maintainer's subjective assessment of how well-tested this record is.
  // Heuristic only. Not a warranty.
  confidence: "high" | "medium" | "low"
  extraterritorialReach: boolean
  lawyerAttestation: LawyerAttestation | null
}

// All fields a country JSON can specify (no functions — purely declarative).
export type EmailRulesData = {
  canCollectForMarketing: boolean
  optIn: OptIn
  checkboxRequired: boolean
  bundlingAllowed: boolean
  prechecking: "forbidden" | "allowed"
  channels: Channel[]
  unsubscribeMechanism: "one-click" | "link" | "any"

  softOptInAvailable: boolean
  softOptInScope: "similar-products" | "any" | "none"
  requiresCallerSimilarityAssertion: boolean
  impliedConsentTtlMonths: number | null

  b2bExemption: B2BExemption

  consentLanguage: {
    required: string[]
    mustMatchUserLocale: boolean
  }

  dataResidency: {
    storageRegion: "any" | "eu" | "local"
    crossBorderTransferMechanism:
      | "none-required"
      | "scc"
      | "adequacy"
      | "explicit-consent"
      | "blocked"
  }

  consentRecordRetentionMonths: number

  sensitiveDataFlags: {
    healthMarketingBlocked: boolean
    politicalMarketingBlocked: boolean
    childrenBlocked: boolean
  }

  preferenceCenter: {
    granularityRequired: "none" | "channel" | "purpose" | "topic"
    perEmailUnsubAlsoRequired: boolean
  }

  senderIdentity: {
    physicalAddressRequired: boolean
    legalEntityNameRequired: boolean
    representativeRequired: boolean
  }

  reConsentTriggerMonths: number | null

  childAgeOfConsent: number
  parentalVerificationRequired: boolean

  proofRequired: ("timestamp" | "ip" | "source" | "wording" | "ua")[]

  basis: Basis

  suggestedTemplate: "brevo-doi" | "single-opt-in" | "blocked"
}

// Live rules object with helpers attached at evaluation time.
export type EmailRules = EmailRulesData & {
  buildAuditRecord: (ctx: AuditContext) => Promise<AuditRecord>
}

// Country data file shape. Default rules + per-context / per-relationship /
// per-region overrides. Evaluator merges in that order.
export type CountryData = {
  code: string
  regime: string
  defaults: EmailRulesData
  byContext?: Partial<Record<Context, DeepPartial<EmailRulesData>>>
  byRelationship?: Partial<Record<Relationship, DeepPartial<EmailRulesData>>>
  byRegion?: Record<string, DeepPartial<EmailRulesData>>
}

/**
 * DeepPartial used by country-data authoring (`byContext`, `byRelationship`,
 * `byRegion`). Arrays are kept as full arrays — partial element overrides
 * aren't supported because the merge replaces arrays wholesale by design.
 * See `eval.ts` for merge semantics.
 *
 * Exported because country data authors write against it. Not intended
 * for general use.
 */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? Array<U>
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K]
}

export type GetEmailRulesInput = {
  country: string | null
  region?: string | null
  context: Context
  relationship: Relationship
}

export type AuditContext = {
  ip: string | null
  userAgent: string | null
  sourceUrl: string
  wording: string
  formVersion: string
  subjectId?: string | null
  doiConfirmedAt?: string | null
  withdrawnAt?: string | null
  withdrawalMethod?: string | null
  // Provenance of the country code. Pass through from the adapter's
  // `CountryDetection.source` so the receipt records HOW jurisdiction
  // was determined (header, billing, self-declared, etc.). Critical for
  // audit defensibility.
  countrySource?: AuditRecord["countrySource"]
}

export type AuditRecord = {
  schemaVersion: "mailregime/1"
  iso27560Version: "1.0"
  consentId: string
  // null when the caller hasn't yet hashed/pseudonymised the subject
  // (e.g. anonymous newsletter signup before email verification). Should
  // be populated once a stable identifier exists.
  subjectId: string | null
  capturedAt: string
  ip: string | null
  userAgent: string | null
  country: string
  region: string | null
  countrySource: "header" | "self-declared" | "billing" | "static" | "unknown"
  context: Context
  relationship: Relationship
  channels: Channel[]
  wording: string
  wordingHash: string
  formUrl: string
  formVersion: string
  doiConfirmedAt: string | null
  basis: Pick<Basis, "statute" | "url" | "jurisdiction" | "dataLastUpdated">
  withdrawnAt: string | null
  withdrawalMethod: string | null
}

export type CountryDetection = {
  country: string | null
  region: string | null
  source: AuditRecord["countrySource"]
  confidence: "high" | "low"
}

export type Configuration = {
  unknownCountryPolicy: "throw" | "strict" | "permissive"
  consentDataVersion: string
  staleDataWarnAfterMonths: number
}

export type RegisterCountryInput = CountryData
