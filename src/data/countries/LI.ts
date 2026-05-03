import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Liechtenstein is an EEA member state — GDPR applies directly via the
// EEA Agreement. Domestic implementation: Datenschutzgesetz (DSG),
// LGBl. 2018 Nr. 272 (in force 1 Jan 2020). ePrivacy/electronic
// marketing rules: Kommunikationsgesetz (KomG), LGBl. 2006 Nr. 91, esp.
// Art. 47 (unsolicited electronic communications) — express prior
// consent required for marketing email to natural persons, with a
// narrow soft opt-in for existing customers and similar own products.
// Regulator: Datenschutzstelle (https://www.datenschutzstelle.li).
export const LI: CountryData = {
  code: "LI",
  regime: "GDPR",
  defaults: {
    canCollectForMarketing: true,
    // KomG Art. 47 mirrors EU ePrivacy Art. 13 — express prior consent
    // for unsolicited electronic mail to natural persons.
    optIn: "express",
    checkboxRequired: true,
    bundlingAllowed: false,
    prechecking: "forbidden",
    channels: ["email"],
    unsubscribeMechanism: "one-click",
    // KomG Art. 47(2) soft opt-in: own similar products/services to
    // existing customers, with clear opt-out at collection and in
    // every message.
    softOptInAvailable: false,
    softOptInScope: "none",
    requiresCallerSimilarityAssertion: false,
    impliedConsentTtlMonths: null,
    // Liechtenstein has no general B2B carve-out from KomG Art. 47;
    // the prohibition on unsolicited mass email applies regardless of
    // recipient type. Generic role addresses are treated more lightly
    // in practice but this is not codified.
    b2bExemption: {
      regime: "none",
      conditions: [
        "KomG Art. 47 applies to mass advertising regardless of recipient type",
      ],
    },
    // German is the sole official language of Liechtenstein. Consent
    // wording presented to LI residents should be in German to be
    // demonstrably informed under GDPR Art. 7(2).
    consentLanguage: { required: ["de"], mustMatchUserLocale: true },
    // EEA member — data flows freely within the EEA; outbound transfers
    // require Chapter V mechanisms (adequacy/SCCs/BCRs).
    dataResidency: { storageRegion: "eu", crossBorderTransferMechanism: "adequacy" },
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
    // DSG Art. 4 sets the digital-services age of consent at 16 (LI did
    // not derogate downward from the GDPR Art. 8 default).
    childAgeOfConsent: 16,
    parentalVerificationRequired: false,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Datenschutzgesetz (DSG), LGBl. 2018 Nr. 272 + Kommunikationsgesetz (KomG), LGBl. 2006 Nr. 91, Art. 47 + GDPR (Regulation (EU) 2016/679 via EEA Agreement)",
      url: "https://www.datenschutzstelle.li/",
      jurisdiction: "LI",
      subRegime: "LI-EPRIVACY",
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
    },
  },
}
