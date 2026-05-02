import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
// This file represents the maintainer's good-faith summary of selected
// statutes. It may be wrong, out of date, or inapplicable to your facts.
// You must consult qualified counsel before relying on it.
//
// CAN-SPAM: opt-out regime. Federal. State privacy laws (CCPA/CPRA, VCDPA,
// CPA, CTDPA, UCPA, TX TDPSA, OR OCPA, MT MCDPA, TN TIPA, DE DPDPA) layer
// additional rights but don't change the email-marketing consent baseline.
export const US: CountryData = {
  code: "US",
  regime: "CAN-SPAM",
  defaults: {
    canCollectForMarketing: true,
    optIn: "single",
    checkboxRequired: false,
    bundlingAllowed: true,
    prechecking: "allowed",
    channels: ["email"],
    unsubscribeMechanism: "any",
    softOptInAvailable: false,
    softOptInScope: "none",
    requiresCallerSimilarityAssertion: false,
    impliedConsentTtlMonths: null,
    b2bExemption: { regime: "can-spam-default", conditions: [] },
    consentLanguage: { required: [], mustMatchUserLocale: false },
    dataResidency: {
      storageRegion: "any",
      crossBorderTransferMechanism: "none-required",
    },
    consentRecordRetentionMonths: 60,
    sensitiveDataFlags: {
      healthMarketingBlocked: false,
      politicalMarketingBlocked: false,
      childrenBlocked: true,
    },
    preferenceCenter: {
      granularityRequired: "none",
      perEmailUnsubAlsoRequired: true,
    },
    senderIdentity: {
      physicalAddressRequired: true,
      legalEntityNameRequired: true,
      representativeRequired: false,
    },
    reConsentTriggerMonths: null,
    childAgeOfConsent: 13,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "source"],
    basis: {
      statute:
        "15 U.S.C. §§ 7701–7713 (CAN-SPAM Act of 2003); 16 C.F.R. Part 316",
      url: "https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business",
      jurisdiction: "US",
      subRegime: null,
      dataLastUpdated: "2026-05-02",
      confidence: "medium",
      extraterritorialReach: false,
      lawyerAttestation: null,
    },
    suggestedTemplate: "single-opt-in",
  },
  byContext: {
    transactional: {
      proofRequired: [],
    },
  },
  byRelationship: {
    "existing-customer": {
      softOptInAvailable: true,
      softOptInScope: "any",
    },
  },
  byRegion: {
    // CCPA/CPRA — sale/share opt-out, not email-marketing consent per se,
    // but flagged so consumers can check for sub-regime obligations.
    "US-CA": {
      basis: {
        statute:
          "CAN-SPAM + CCPA/CPRA (Cal. Civ. Code §§ 1798.100 et seq.)",
        url: "https://oag.ca.gov/privacy/ccpa",
        jurisdiction: "US",
        subRegime: "US-CA-CCPA",
        dataLastUpdated: "2026-05-02",
        confidence: "medium",
        extraterritorialReach: false,
        lawyerAttestation: null,
      },
    },
  },
}
