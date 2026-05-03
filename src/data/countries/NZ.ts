import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Unsolicited Electronic Messages Act 2007 (UEMA) + Privacy Act 2020.
// Express, inferred, or deemed consent all permitted. Deemed consent
// from publicly published business addresses → most permissive B2B
// regime in this set. Unsubscribe within 5 working days.
export const NZ: CountryData = {
  code: "NZ",
  regime: "UEMA",
  defaults: {
    canCollectForMarketing: true,
    optIn: "express",
    checkboxRequired: false,
    bundlingAllowed: false,
    prechecking: "forbidden",
    channels: ["email"],
    unsubscribeMechanism: "any",
    softOptInAvailable: true,
    softOptInScope: "any",
    requiresCallerSimilarityAssertion: false,
    impliedConsentTtlMonths: null,
    b2bExemption: {
      regime: "publicly-disclosed",
      conditions: [
        "UEMA Sched 1 cl.4 deemed consent: published business addresses, message relevant to role, no 'no marketing' notice",
      ],
    },
    consentLanguage: { required: [], mustMatchUserLocale: false },
    dataResidency: { storageRegion: "any", crossBorderTransferMechanism: "scc" },
    consentRecordRetentionMonths: 60,
    sensitiveDataFlags: {
      healthMarketingBlocked: false,
      politicalMarketingBlocked: false,
      childrenBlocked: true,
    },
    preferenceCenter: { granularityRequired: "channel", perEmailUnsubAlsoRequired: true },
    senderIdentity: {
      physicalAddressRequired: true,
      legalEntityNameRequired: true,
      representativeRequired: false,
    },
    reConsentTriggerMonths: null,
    childAgeOfConsent: 16,
    parentalVerificationRequired: false,
    proofRequired: ["timestamp", "source", "wording"],
    basis: {
      statute: "Unsolicited Electronic Messages Act 2007 (No. 7 of 2007) + Privacy Act 2020 (No. 31 of 2020)",
      url: "https://www.legislation.govt.nz/act/public/2007/0007/latest/whole.html",
      jurisdiction: "NZ",
      subRegime: "UEMA",
      dataLastUpdated: "2026-05-03",
      confidence: "medium",
      extraterritorialReach: true,
      lawyerAttestation: null,
    },
    suggestedTemplate: "single-opt-in",
  },
  byContext: {
    transactional: { proofRequired: [] },
  },
  byRelationship: {
    "existing-customer": {
      softOptInAvailable: true,
      softOptInScope: "any",
    },
    "publicly-listed-business": {
      // Deemed consent for B2B published addresses
      softOptInAvailable: true,
      softOptInScope: "any",
      optIn: "single",
    },
  },
}
