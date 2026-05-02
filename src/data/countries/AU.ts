import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Spam Act 2003 (Cth) + Privacy Act 1988. Express OR inferred consent;
// functional unsubscribe required. ACMA enforcement is active and
// consistently turns on missing/ambiguous consent records.
export const AU: CountryData = {
  code: "AU",
  regime: "Spam-Act-2003",
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
    b2bExemption: { regime: "none", conditions: [] },
    consentLanguage: { required: [], mustMatchUserLocale: false },
    dataResidency: {
      storageRegion: "any",
      crossBorderTransferMechanism: "none-required",
    },
    consentRecordRetentionMonths: 60,
    sensitiveDataFlags: {
      healthMarketingBlocked: true,
      politicalMarketingBlocked: false,
      childrenBlocked: true,
    },
    preferenceCenter: {
      granularityRequired: "channel",
      perEmailUnsubAlsoRequired: true,
    },
    senderIdentity: {
      physicalAddressRequired: true,
      legalEntityNameRequired: true,
      representativeRequired: false,
    },
    reConsentTriggerMonths: null,
    childAgeOfConsent: 15,
    parentalVerificationRequired: false,
    proofRequired: ["timestamp", "source", "wording"],
    basis: {
      statute: "Spam Act 2003 (Cth) + Privacy Act 1988",
      url: "https://www.acma.gov.au/avoid-sending-spam",
      jurisdiction: "AU",
      subRegime: null,
      dataLastUpdated: "2026-05-02",
      confidence: "medium",
      extraterritorialReach: false,
      lawyerAttestation: null,
    },
    suggestedTemplate: "brevo-doi",
  },
  byContext: {
    transactional: {
      proofRequired: [],
    },
  },
  byRelationship: {
    "existing-customer": {
      // Spam Act 2003 §16 + ACMA "Avoid sending spam" guidance: inferred
      // consent for existing business relationships. Express consent not
      // required, but functional unsubscribe still mandatory in every
      // message.
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
      optIn: "single",
    },
  },
}
