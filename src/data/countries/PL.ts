import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// GDPR + Prawo komunikacji elektronicznej (PKE) 2024, Art. 398 (in
// force 10 Nov 2024). Strictest of the major EU jurisdictions on
// existing-customer mailings — Poland did NOT transpose ePrivacy
// Art. 13(2) soft opt-in. Channel-specific consent required.
export const PL: CountryData = {
  code: "PL",
  regime: "GDPR",
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
        "PKE applies to all subscribers and end-users (natural and legal)",
        "narrow tolerance for sending to legal-person generic addresses (info@)",
      ],
    },
    consentLanguage: { required: ["pl-PL"], mustMatchUserLocale: true },
    dataResidency: { storageRegion: "any", crossBorderTransferMechanism: "scc" },
    consentRecordRetentionMonths: 60,
    sensitiveDataFlags: {
      healthMarketingBlocked: true,
      politicalMarketingBlocked: true,
      childrenBlocked: true,
    },
    preferenceCenter: { granularityRequired: "channel", perEmailUnsubAlsoRequired: true },
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
      statute: "GDPR Art. 6(1)(a) + Art. 7 + Prawo komunikacji elektronicznej (PKE) 2024 Art. 398 + Polish Data Protection Act 2018 Art. 4",
      url: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20240001221",
      jurisdiction: "EU",
      subRegime: "PL-PKE-2024",
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
    // No soft opt-in in Poland — even existing customers need fresh
    // affirmative consent for marketing.
    "existing-customer": {
      softOptInAvailable: false,
      softOptInScope: "none",
    },
  },
}
