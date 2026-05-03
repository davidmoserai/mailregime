import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// GDPR + Codice Privacy (D.Lgs. 196/2003) Art. 130. Italy has a strict
// soft-spam interpretation: Art. 130(4) text limits the existing-customer
// exception to "vendita di un prodotto o servizio" (sale of product or
// service), so free newsletter signups don't qualify by statute.
// Double opt-in is strong best practice for evidencing consent quality
// under GDPR Art. 7 accountability — not a Garante mandate.
export const IT: CountryData = {
  code: "IT",
  regime: "GDPR",
  defaults: {
    canCollectForMarketing: true,
    optIn: "double",
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
      regime: "gdpr-lia",
      conditions: [
        "limited — personal professional emails treated as personal data",
        "no general B2B carve-out (unlike France)",
      ],
    },
    // Italian not statutorily mandated by D.Lgs. 196/2003 Art. 130;
    // Garante guidance requires consent to be "comprensibile" — Italian
    // is best practice for IT-resident consumers, not legally required.
    consentLanguage: { required: [], mustMatchUserLocale: true },
    dataResidency: { storageRegion: "any", crossBorderTransferMechanism: "scc" },
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
    childAgeOfConsent: 14,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "GDPR Art. 6(1)(a) + Art. 7 + Codice Privacy (D.Lgs. 196/2003) Art. 130(1) + (4)",
      url: "https://www.garanteprivacy.it/temi/marketing",
      jurisdiction: "EU",
      subRegime: "IT-GARANTE",
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
      // Art. 130(4): soft opt-in requires actual sale of product/service.
      // Free signup does not qualify by statute.
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
    },
  },
}
