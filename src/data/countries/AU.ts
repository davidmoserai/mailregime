import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Spam Act 2003 (Cth) ss. 16-18 + Schedule 2 (consent: express OR inferred);
// Privacy Act 1988 (as amended by Privacy and Other Legislation Amendment
// Act 2024, Royal Assent 10 Dec 2024) APP 7 (direct marketing). APP 7
// "does not apply to the extent" the Spam Act applies (OAIC APP 7 ch. 7).
// Functional unsubscribe (s. 18) and sender ID (s. 17) required in every
// commercial electronic message. No B2B exemption — Spam Act covers all
// commercial electronic messages; inferred consent only via Schedule 2
// (e.g. conspicuously published business address). Children's Online
// Privacy Code (mandated by 2024 Amendment) in exposure draft as of
// 2026-05-03 — must be registered by 10 Dec 2026; not yet in force.
// Sources verified 2026-05-03:
//   https://www.oaic.gov.au/privacy/australian-privacy-principles/australian-privacy-principles-guidelines/chapter-7-app-7-direct-marketing
//   https://www.oaic.gov.au/privacy/privacy-registers/privacy-codes/childrens-online-privacy-code
//   https://www.legislation.gov.au/C2024A00128/asmade
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
      statute:
        "Spam Act 2003 (Cth) + Privacy Act 1988 (as amended by Privacy and Other Legislation Amendment Act 2024)",
      url: "https://www.acma.gov.au/avoid-sending-spam",
      jurisdiction: "AU",
      subRegime: null,
      dataLastUpdated: "2026-05-03",
      confidence: "medium",
      extraterritorialReach: false,
      lawyerAttestation: null,
    },
    suggestedTemplate: "double-opt-in",
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
