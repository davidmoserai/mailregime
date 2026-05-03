import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Iceland is an EEA member: GDPR applies via the EEA Joint Committee
// Decision and is implemented domestically by Act No. 90/2018 on Data
// Protection and the Processing of Personal Data. Electronic direct
// marketing (ePrivacy) is governed by the Electronic Communications Act
// No. 81/2003, Art. 46 — which requires PRIOR EXPRESS CONSENT for
// unsolicited electronic marketing to natural persons, with a soft
// opt-in carve-out for similar products to existing customers (mirrors
// ePrivacy Directive 2002/58/EC Art. 13). Regulator: Persónuvernd
// (Icelandic Data Protection Authority).
//
// b2bExemption: Act 81/2003 Art. 46 expressly applies to natural persons;
// electronic marketing to legal persons (companies) is permitted unless
// they have opted out. Generic role addresses (info@, sales@) are not
// linked to an identifiable natural person and are treated more lightly.
//
// childAgeOfConsent: Act No. 90/2018 Art. 10 sets the age of consent for
// information society services at 13 (Iceland used the GDPR Art. 8(1)
// derogation to lower from 16 to 13).
export const IS: CountryData = {
  code: "IS",
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
      regime: "function-address",
      conditions: [
        "Act No. 81/2003 Art. 46 applies to natural persons; legal persons may be marketed to until they opt out",
        "Generic role addresses (info@, sales@) of legal persons treated lighter; identifiable natural-person business addresses still require consent",
      ],
    },
    consentLanguage: { required: [], mustMatchUserLocale: true },
    dataResidency: { storageRegion: "eu", crossBorderTransferMechanism: "scc" },
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
    childAgeOfConsent: 13,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Act No. 90/2018 on Data Protection and the Processing of Personal Data (implementing GDPR/EU 2016/679 via EEA) + Electronic Communications Act No. 81/2003 Art. 46 (ePrivacy)",
      url: "https://www.personuvernd.is/information-in-english/",
      jurisdiction: "IS",
      subRegime: "IS-EPRIVACY",
      dataLastUpdated: "2026-05-03",
      confidence: "medium",
      extraterritorialReach: true,
      lawyerAttestation: null,
    },
    suggestedTemplate: "double-opt-in",
  },
  byContext: {
    "lead-magnet": { bundlingAllowed: false, checkboxRequired: true },
    transactional: { proofRequired: [] },
  },
  byRelationship: {
    "existing-customer": {
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
    },
  },
}
