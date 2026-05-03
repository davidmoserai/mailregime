import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Malaysia Personal Data Protection Act 2010 (Act 709) plus the
// Personal Data Protection (Amendment) Act 2024. Regulator is the
// Department of Personal Data Protection (JPDP / PDP Department),
// jpdp.gov.my. PDPA s. 6 requires consent for processing of personal
// data; s. 43 gives the data subject a standing right to require a
// data user to cease (or not begin) processing their personal data
// for direct marketing at any time. PDPA applies to processing in
// respect of commercial transactions, which includes B2B contexts.
// Consent must be capable of being recorded and maintained, but the
// Act does not mandate double-opt-in — a single affirmative act
// (ticked box, sign-up confirmation) is sufficient. Penalties under
// PDPA include criminal fines and imprisonment; 2024 amendments
// raised maximum penalties and introduced mandatory data breach
// notification and Data Protection Officer requirements.
export const MY: CountryData = {
  code: "MY",
  regime: "PDPA",
  defaults: {
    canCollectForMarketing: true,
    // PDPA s. 6 — consent required for processing; s. 43 — opt-out
    // right always available. Single affirmative consent is sufficient
    // (no DOI mandate); affirmative tick or signup acceptance.
    optIn: "express",
    checkboxRequired: true,
    bundlingAllowed: false,
    prechecking: "forbidden",
    channels: ["email"],
    unsubscribeMechanism: "one-click",
    // s. 43 is a cessation right, not a soft opt-in. PDPA does not
    // provide a soft opt-in carve-out for existing customers.
    softOptInAvailable: false,
    softOptInScope: "none",
    requiresCallerSimilarityAssertion: false,
    impliedConsentTtlMonths: null,
    // PDPA covers personal data processed in commercial transactions;
    // there is no separate B2B exemption — corporate contacts who are
    // identifiable individuals are protected the same way.
    b2bExemption: {
      regime: "none",
      conditions: [
        "PDPA applies to personal data in commercial transactions regardless of recipient type (B2B included)",
      ],
    },
    // Personal Data Protection Regulations 2013 require a notice in
    // both Bahasa Malaysia and English.
    consentLanguage: { required: ["ms", "en"], mustMatchUserLocale: false },
    dataResidency: { storageRegion: "any", crossBorderTransferMechanism: "adequacy" },
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
      representativeRequired: true,
    },
    reConsentTriggerMonths: 24,
    // PDPA does not specify a digital age of consent. Common-law age
    // of majority in Malaysia is 18 (Age of Majority Act 1971). 2024
    // amendments did not introduce a specific child digital-consent
    // threshold; treat under-18 as requiring guardian consent.
    childAgeOfConsent: 18,
    parentalVerificationRequired: false,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Personal Data Protection Act 2010 (Act 709) + Personal Data Protection (Amendment) Act 2024",
      url: "https://www.agc.gov.my/agcportal/uploads/files/Publications/LOM/EN/Act%20709%2014%206%202016.pdf",
      jurisdiction: "MY",
      subRegime: "MY-PDPA",
      dataLastUpdated: "2026-05-03",
      confidence: "medium",
      extraterritorialReach: false,
      lawyerAttestation: null,
    },
    suggestedTemplate: "single-opt-in",
  },
  byContext: {
    "lead-magnet": { canCollectForMarketing: false, optIn: "blocked", suggestedTemplate: "blocked" },
    transactional: { proofRequired: [] },
  },
  byRelationship: {
    "existing-customer": {
      // No statutory soft opt-in under PDPA, but s. 43 cessation right
      // remains; existing-customer marketing still requires consent.
      softOptInAvailable: false,
      softOptInScope: "none",
      requiresCallerSimilarityAssertion: false,
    },
  },
}
