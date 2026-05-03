import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Finland: GDPR + Information Society Code (Tietoyhteiskuntakaari 917/2014)
// §200 — ePrivacy transposition for direct marketing — + Data Protection Act
// (Tietosuojalaki 1050/2018). Regulator: Tietosuojavaltuutettu (Data
// Protection Ombudsman, tietosuoja.fi). §200(1): direct marketing by
// electronic means to natural persons requires PRIOR CONSENT. §200(2):
// existing-customer soft opt-in for "same product group" with clear opt-out
// at collection and in every message. §200(3): direct marketing to LEGAL
// PERSONS is OPT-OUT (permitted unless the recipient has refused), which
// makes Finland one of the EU MS with a lighter B2B regime. Tietosuojalaki
// §5 sets the child age of consent for information-society services at 13.
export const FI: CountryData = {
  code: "FI",
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
      // ISC §200(3): direct marketing to legal persons is permitted unless
      // the recipient has separately refused it — opt-out, not opt-in.
      // Natural persons at a company (named role addresses) still fall
      // under §200(1) consent. Generic role addresses (info@, sales@) are
      // treated as legal-person addresses by the Ombudsman.
      regime: "function-address",
      conditions: [
        "ISC §200(3) — marketing to legal persons is opt-out",
        "natural-person addresses at a company (firstname.lastname@co.fi) still require §200(1) consent",
        "every message must offer a free, simple opt-out mechanism",
        "sender identity and marketing nature must be clearly recognisable (§202)",
      ],
    },
    consentLanguage: {
      // Finland is officially bilingual; consent wording must be
      // intelligible to the data subject. Locale-matching not statutorily
      // mandated for marketing consent but expected by the Ombudsman where
      // the service is offered in FI/SV.
      required: [],
      mustMatchUserLocale: true,
    },
    dataResidency: { storageRegion: "eu", crossBorderTransferMechanism: "scc" },
    consentRecordRetentionMonths: 60,
    sensitiveDataFlags: {
      healthMarketingBlocked: true,
      politicalMarketingBlocked: true,
      childrenBlocked: true,
    },
    preferenceCenter: { granularityRequired: "purpose", perEmailUnsubAlsoRequired: true },
    senderIdentity: {
      // ISC §202: sender must be clearly identifiable; marketing nature
      // must be recognisable without opening the message.
      physicalAddressRequired: true,
      legalEntityNameRequired: true,
      representativeRequired: false,
    },
    reConsentTriggerMonths: 24,
    // Tietosuojalaki §5: child age of consent for information-society
    // services lowered to 13 (Finland used the GDPR Art. 8 floor).
    childAgeOfConsent: 13,
    parentalVerificationRequired: false,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "GDPR (EU 2016/679) + Information Society Code §200 (Tietoyhteiskuntakaari 917/2014, since 2025 part of Sähköisen viestinnän palveluista annettu laki) + Data Protection Act (Tietosuojalaki 1050/2018)",
      url: "https://tietosuoja.fi/en/electronic-direct-marketing",
      jurisdiction: "FI",
      subRegime: "FI-ISC",
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
    // ISC §200(2): existing customer soft opt-in for own similar products
    // /services. Address must have been obtained in the context of a sale,
    // opt-out must be offered at collection AND in every subsequent message.
    "existing-customer": {
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
      optIn: "single",
      suggestedTemplate: "single-opt-in",
    },
    // ISC §200(3): legal-person recipients — opt-out regime.
    "b2b-cold": {
      optIn: "single",
      checkboxRequired: false,
      suggestedTemplate: "single-opt-in",
    },
    "publicly-listed-business": {
      optIn: "single",
      checkboxRequired: false,
      suggestedTemplate: "single-opt-in",
    },
  },
}
