import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Saudi Arabia Personal Data Protection Law (PDPL), Royal Decree M/19
// of 2021, fully effective Sept 2024, plus Implementing Regulations
// (2023) issued by SDAIA (Saudi Data and AI Authority).
// - Art. 5 + 6: lawful basis defaults to explicit consent (express,
//   single purpose); no general legitimate-interest gateway for
//   marketing.
// - Art. 25: direct marketing to a data subject requires the data
//   subject's CONSENT, sender identity must be disclosed, and an
//   opt-out / withdrawal mechanism must be provided. No soft opt-in
//   for existing customers.
// - Art. 29 + Implementing Regs: cross-border transfers permitted
//   subject to SDAIA criteria (adequacy / safeguards / necessity).
// - PDPL covers natural persons; legal-person business contacts are
//   outside scope.
// - Arabic is the official language; consent wording must be
//   intelligible to the data subject — Arabic required where the
//   subject is an Arabic speaker / Saudi resident.
// - PDPL does not define a child age of consent; in the Saudi legal
//   context the age of majority is 18, and parental/guardian consent
//   is required for minors.
export const SA: CountryData = {
  code: "SA",
  regime: "PDPL",
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
        "PDPL applies to personal data of natural persons; corporate / legal-person contact data (e.g. info@company.sa) is outside scope",
        "Marketing to a named individual at a business address is still in scope",
      ],
    },
    consentLanguage: { required: ["ar"], mustMatchUserLocale: true },
    // PDPL Art. 29 + Implementing Regs: transfers outside the Kingdom
    // are permitted subject to SDAIA conditions; sensitive data and
    // certain government-related data may be subject to localization.
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
    childAgeOfConsent: 18,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Personal Data Protection Law (PDPL), Royal Decree M/19 of 9/2/1443H (2021), fully effective 14 Sept 2024, with Implementing Regulations issued by SDAIA (2023)",
      url: "https://sdaia.gov.sa/en/SDAIA/about/Pages/PersonalDataProtection.aspx",
      jurisdiction: "SA",
      subRegime: "SA-PDPL",
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
    // PDPL Art. 25 requires consent for direct marketing regardless of
    // prior customer relationship; no soft opt-in is available.
    "existing-customer": {
      softOptInAvailable: false,
      softOptInScope: "none",
      requiresCallerSimilarityAssertion: false,
    },
  },
}
