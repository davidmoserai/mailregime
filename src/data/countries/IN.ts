import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Digital Personal Data Protection Act 2023 + DPDP Rules 2025 (notified
// 14 Nov 2025; full enforcement phased to ~May 2027). NO soft opt-in.
// Consent Manager intermediary architecture. Penalties up to ₹250 crore.
// Children = under 18 (highest among major regimes).
export const IN: CountryData = {
  code: "IN",
  regime: "DPDP",
  defaults: {
    canCollectForMarketing: true,
    optIn: "express",
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
      regime: "none",
      conditions: [
        "DPDP applies to digital personal data of natural persons",
        "pure corporate contact data outside scope; personal employee emails in-scope",
      ],
    },
    // English + any of the 22 Schedule-8 languages at user's option
    consentLanguage: { required: ["en-IN", "hi-IN"], mustMatchUserLocale: true },
    dataResidency: { storageRegion: "any", crossBorderTransferMechanism: "none-required" },
    consentRecordRetentionMonths: 60,
    sensitiveDataFlags: {
      healthMarketingBlocked: true,
      politicalMarketingBlocked: true,
      childrenBlocked: true,
    },
    preferenceCenter: { granularityRequired: "purpose", perEmailUnsubAlsoRequired: true },
    senderIdentity: {
      physicalAddressRequired: false,
      legalEntityNameRequired: true,
      representativeRequired: true,
    },
    reConsentTriggerMonths: null,
    childAgeOfConsent: 18,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Digital Personal Data Protection Act 2023 (Act 22 of 2023) + DPDP Rules 2025 (notified Nov 2025)",
      url: "https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc20251117695301.pdf",
      jurisdiction: "IN",
      subRegime: "DPDP",
      dataLastUpdated: "2026-05-03",
      confidence: "medium",
      extraterritorialReach: true,
      lawyerAttestation: null,
    },
    suggestedTemplate: "double-opt-in",
  },
  byContext: {
    "lead-magnet": { canCollectForMarketing: false, optIn: "blocked", suggestedTemplate: "blocked" },
    transactional: { proofRequired: [] },
  },
  byRelationship: {
    // No soft opt-in under DPDP — every channel needs fresh affirmative consent
    "existing-customer": {
      softOptInAvailable: false,
      softOptInScope: "none",
    },
  },
}
