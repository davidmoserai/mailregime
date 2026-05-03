import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// PDPA 2012 + Spam Control Act 2007. Hybrid regime — PDPA is consent-
// based for personal data; Spam Control Act is opt-out for bulk UCE
// with header/unsubscribe rules. PDPA s.15A "deemed consent by
// notification" introduced 2021. Fines up to SGD 1M.
export const SG: CountryData = {
  code: "SG",
  regime: "PDPA",
  defaults: {
    canCollectForMarketing: true,
    optIn: "express",
    checkboxRequired: false,
    bundlingAllowed: true,
    prechecking: "forbidden",
    channels: ["email"],
    unsubscribeMechanism: "any",
    softOptInAvailable: true,
    softOptInScope: "any",
    requiresCallerSimilarityAssertion: false,
    impliedConsentTtlMonths: null,
    b2bExemption: {
      regime: "none",
      conditions: [
        "Spam Control Act applies to bulk UCE regardless of B2B/B2C",
        "PDPA s.4(5) partial exclusion for business-contact data used for business purposes",
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
    childAgeOfConsent: 13,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "source", "wording"],
    basis: {
      statute: "Personal Data Protection Act 2012 (Act No. 26 of 2012) + Spam Control Act 2007 (Cap. 311A) + Do Not Call Registry (PDPA Part IX)",
      url: "https://www.pdpc.gov.sg/-/media/files/pdpc/pdf-files/advisory-guidelines/advisoryguidelinesonrequiringconsentformarketing8may2015.pdf",
      jurisdiction: "SG",
      subRegime: "PDPA-DNC",
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
  },
}
