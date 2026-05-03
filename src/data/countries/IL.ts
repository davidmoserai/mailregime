import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Communications Law (Bezeq and Broadcasts) §30A "Spam Law" + Privacy
// Protection Law 5741-1981 (Amendment 13 effective Aug 2025). Statutory
// damages up to ILS 1,000 per message without proof of harm. Class
// actions are routine and lucrative. Subject line MUST start with
// "פרסומת" ("advertisement").
export const IL: CountryData = {
  code: "IL",
  regime: "PPL",
  defaults: {
    canCollectForMarketing: true,
    optIn: "express",
    checkboxRequired: true,
    bundlingAllowed: false,
    prechecking: "forbidden",
    channels: ["email"],
    unsubscribeMechanism: "link",
    softOptInAvailable: false,
    softOptInScope: "none",
    requiresCallerSimilarityAssertion: false,
    impliedConsentTtlMonths: null,
    b2bExemption: {
      regime: "none",
      conditions: [
        "§30A applies regardless of consumer/business recipient",
      ],
    },
    consentLanguage: { required: ["he-IL"], mustMatchUserLocale: true },
    dataResidency: { storageRegion: "any", crossBorderTransferMechanism: "scc" },
    consentRecordRetentionMonths: 60,
    sensitiveDataFlags: {
      healthMarketingBlocked: true,
      politicalMarketingBlocked: true,
      childrenBlocked: true,
    },
    preferenceCenter: { granularityRequired: "purpose", perEmailUnsubAlsoRequired: true },
    senderIdentity: {
      physicalAddressRequired: true,
      legalEntityNameRequired: true,
      representativeRequired: false,
    },
    reConsentTriggerMonths: null,
    childAgeOfConsent: 18,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording"],
    basis: {
      statute: "Communications Law (Bezeq and Broadcasts) 5742-1982, §30A + Protection of Privacy Law 5741-1981 + Amendment 13 to PPL (effective 14 Aug 2025)",
      url: "https://www.gov.il/en/pages/17052018_7",
      jurisdiction: "IL",
      subRegime: "IL-COMM-30A",
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
    "existing-customer": {
      // §30A(c): existing customer, similar goods/services, opt-out at
      // collection + every message, recipient did not object
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
    },
  },
}
