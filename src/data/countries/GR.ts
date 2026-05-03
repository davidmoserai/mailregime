import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Greece: GDPR + Law 3471/2006 (ePrivacy transposition, FEK A' 133/2006)
// + Law 4624/2019 (GDPR-implementing, FEK A' 137/2019).
// Regulator: Hellenic Data Protection Authority (HDPA / ΑΠΔΠΧ), dpa.gr.
//
// Law 3471/2006 Art. 11(1): unsolicited electronic communications for
// direct marketing require PRIOR EXPRESS CONSENT (opt-in).
// Art. 11(3): soft opt-in carve-out — supplier who obtained contact
// details from a customer in the context of a sale of a product/service
// may use them to market SIMILAR products/services from the SAME
// supplier, provided the customer is given a clear and free opt-out
// at collection and in every message.
// Notably, Greek ePrivacy (Law 3471/2006 Art. 2) protects BOTH natural
// AND legal persons — there is no general B2B carve-out as in some
// other EU member states. Marketing to corporate addresses is treated
// the same as to natural persons.
// Law 4624/2019 Art. 21: child digital-services consent age = 15.
export const GR: CountryData = {
  code: "GR",
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
      // Law 3471/2006 Art. 2 extends ePrivacy protection to legal persons.
      // No general B2B exemption under Greek ePrivacy.
      regime: "none",
      conditions: [
        "Law 3471/2006 Art. 2 protects subscribers including legal persons",
        "No B2B carve-out — corporate recipients require the same opt-in or soft-opt-in basis as natural persons",
      ],
    },
    consentLanguage: { required: ["el"], mustMatchUserLocale: true },
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
    // Law 4624/2019 Art. 21 — Greece set the GDPR Art. 8 threshold at 15.
    childAgeOfConsent: 15,
    parentalVerificationRequired: false,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute:
        "Regulation (EU) 2016/679 (GDPR) + Greek Law 3471/2006 Art. 11 (FEK A' 133/2006, ePrivacy transposition) + Greek Law 4624/2019 Art. 21 (FEK A' 137/2019, GDPR-implementing)",
      url: "https://www.dpa.gr/en",
      jurisdiction: "GR",
      subRegime: "GR-3471",
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
    // Law 3471/2006 Art. 11(3) soft opt-in — same supplier, similar
    // products/services, clear free opt-out at collection and every send.
    "existing-customer": {
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
    },
  },
}
