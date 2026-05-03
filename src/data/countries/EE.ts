import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Estonia: GDPR + Electronic Communications Act (Elektroonilise side
// seadus, ESS) §103¹ which transposes ePrivacy Directive 2002/58/EC
// Art. 13 + Personal Data Protection Act (Isikuandmete kaitse seadus,
// IKS). Regulator: Andmekaitse Inspektsioon (AKI). ESS §103¹ requires
// PRIOR CONSENT for direct marketing by electronic means with a soft
// opt-in carve-out for own similar products to existing customers.
// ESS §103¹ applies to natural AND legal persons (no general B2B
// exemption — Estonia is stricter than the ePrivacy minimum here).
// IKS §8 sets the child age of consent for information society
// services at 13 (Estonia chose the GDPR Art. 8 floor).
export const EE: CountryData = {
  code: "EE",
  regime: "GDPR+ePrivacy",
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
        "ESS §103¹ applies to natural and legal persons; no blanket B2B exemption under Estonian law",
        "Sending to a legal person still requires prior consent unless soft opt-in conditions are met",
      ],
    },
    consentLanguage: { required: [], mustMatchUserLocale: true },
    dataResidency: { storageRegion: "eu", crossBorderTransferMechanism: "adequacy" },
    consentRecordRetentionMonths: 36,
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
    childAgeOfConsent: 13,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Elektroonilise side seadus (ESS) §103¹ + Isikuandmete kaitse seadus (IKS) §8 + Regulation (EU) 2016/679 (GDPR)",
      url: "https://www.riigiteataja.ee/en/eli/ee/506012021001/consolide",
      jurisdiction: "EE",
      subRegime: "EE-ESS",
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
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
      optIn: "single",
      suggestedTemplate: "single-opt-in",
    },
  },
}
