import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// POPIA §69 + Regulations Form 4 + Consumer Protection Act §11.
// One-shot rule: marketer may approach a non-consenting data subject
// only ONCE to request consent — repeated requests are unlawful.
// Penalties: ZAR 10M and/or up to 10 years imprisonment.
export const ZA: CountryData = {
  code: "ZA",
  regime: "POPIA",
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
        "POPIA covers juristic persons (companies are 'data subjects' in SA)",
        "§69 applies to marketing to natural and juristic persons alike",
      ],
    },
    consentLanguage: { required: [], mustMatchUserLocale: false },
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
    reConsentTriggerMonths: 24,
    childAgeOfConsent: 18,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording"],
    basis: {
      statute: "Protection of Personal Information Act 4 of 2013 (POPIA) §69 + Regulations Form 4 + Consumer Protection Act 68 of 2008 §11 + Information Regulator Guidance Note on Direct Marketing (Nov 2022)",
      url: "https://inforegulator.org.za/wp-content/uploads/2020/07/POPIA-GuidanceNote-DirectMarketing-20221103.pdf",
      jurisdiction: "ZA",
      subRegime: "ZA-POPIA-69",
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
      // §69(3) — existing customers re similar products with opt-out
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
    },
  },
}
