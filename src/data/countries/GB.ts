import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// UK GDPR + PECR (Privacy and Electronic Communications Regulations 2003)
// + Data (Use and Access) Act 2025. Post-Brexit. NOT a GDPR alias —
// modelled separately because UK divergence will widen over time.
export const GB: CountryData = {
  code: "GB",
  regime: "UK-GDPR",
  defaults: {
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
    b2bExemption: {
      regime: "gdpr-lia",
      conditions: [
        "legitimate interest assessment required",
        "B2B corporate subscribers (companies, LLPs) have weaker PECR protections than sole traders / partnerships",
      ],
    },
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
    childAgeOfConsent: 13,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute:
        "UK GDPR + PECR (Privacy and Electronic Communications Regulations 2003) + Data (Use and Access) Act 2025",
      url: "https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/consent/",
      jurisdiction: "UK",
      subRegime: "PECR",
      dataLastUpdated: "2026-05-02",
      confidence: "medium",
      extraterritorialReach: true,
      lawyerAttestation: null,
    },
    suggestedTemplate: "brevo-doi",
  },
  byContext: {
    "lead-magnet": {
      canCollectForMarketing: false,
      optIn: "blocked",
      suggestedTemplate: "blocked",
    },
    transactional: {
      proofRequired: [],
    },
  },
  byRelationship: {
    "existing-customer": {
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
    },
  },
}
