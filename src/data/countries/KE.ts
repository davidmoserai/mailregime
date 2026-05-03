import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Kenya — Data Protection Act, 2019 (No. 24 of 2019) and the
// Data Protection (General) Regulations, 2021. Regulator: Office of
// the Data Protection Commissioner (ODPC, odpc.go.ke).
//
// Key rules for direct marketing:
// - DPA 2019 s. 30: lawful processing requires consent that is freely
//   given, specific, informed and unambiguous (or another lawful basis).
// - DPA 2019 s. 37: a data controller/processor who uses personal data
//   for commercial purposes must obtain EXPRESS CONSENT from the data
//   subject. Section 37(1)(b) provides a narrow existing-customer
//   carve-out where the contact details were obtained in the context
//   of a sale of similar products/services and the data subject is
//   given a simple opt-out at the point of collection AND at every
//   subsequent communication.
// - DPA 2019 s. 33: processing of personal data of a child requires
//   consent of a parent or guardian. Under Kenyan law (Children Act,
//   Constitution Art. 260) a child is any person under 18.
// - General Regulations 2021 reg. 13–16: detail consent quality,
//   commercial use, opt-out mechanism and record-keeping.
export const KE: CountryData = {
  code: "KE",
  regime: "KE-DPA",
  defaults: {
    canCollectForMarketing: true,
    // s. 37 requires "express consent" for commercial use of personal data — single opt-in, explicit.
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
    // DPA covers natural persons; no general B2B carve-out for individuals at corporate addresses.
    b2bExemption: {
      regime: "none",
      conditions: [
        "DPA 2019 applies to processing of personal data of identified/identifiable natural persons regardless of B2B/B2C context",
      ],
    },
    // ODPC guidance: notices and consent requests should be in a language the data subject understands;
    // Kenya's official languages are English and Kiswahili (Constitution Art. 7).
    consentLanguage: { required: ["en", "sw"], mustMatchUserLocale: true },
    dataResidency: { storageRegion: "any", crossBorderTransferMechanism: "adequacy" },
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
      representativeRequired: false,
    },
    reConsentTriggerMonths: 24,
    // DPA 2019 s. 33 — child = under 18 under Kenyan law; parental consent required.
    childAgeOfConsent: 18,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Data Protection Act, 2019 (No. 24 of 2019) + Data Protection (General) Regulations, 2021 + ODPC determinations",
      url: "https://www.odpc.go.ke/",
      jurisdiction: "KE",
      subRegime: "KE-DPA",
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
    // s. 37(1)(b) existing-customer carve-out: similar products/services with simple opt-out
    // at point of collection and at every subsequent contact.
    "existing-customer": {
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
    },
  },
}
