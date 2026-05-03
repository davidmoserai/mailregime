import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Vietnam personal data protection: Law No. 91/2025/QH15 on Personal
// Data Protection (Luat Bao ve Du lieu Ca nhan, passed by the National
// Assembly and published in Cong Bao Nos. 971+972 of 24 July 2025) +
// Decree 13/2023/ND-CP on Personal Data Protection (in force 1 July
// 2023) + Decree 91/2020/ND-CP on Combating Spam Messages, Spam Emails
// and Spam Calls. The 2025 Law elevates Decree 13 to statute level and
// adds prohibitions (e.g. buying/selling personal data); Decree 13
// remains the operative implementing instrument until superseding
// implementing decrees take effect — confidence "medium" pending those
// implementing decrees.
// Regulator: A05 — Department of Cyber Security and High-Tech Crime
// Prevention, Ministry of Public Security (Bo Cong an).
// Decree 13 Art. 11: consent must be express, specific, informed, and
// unambiguous (positive, voluntary action — signing, ticking a box,
// clicking a button); pre-ticked boxes, default settings, general T&Cs,
// silence or non-response do NOT count as consent.
// Decree 13 Art. 21: marketing/advertising service providers may only
// use customer personal data with the data subject's informed opt-in
// consent and must inform the subject they are receiving marketing.
// Decree 91/2020 Art. 11: prior express consent before sending
// advertising email; sender identity, opt-out mechanism, and message
// labelling required on every advertising email.
// Decree 13 Art. 20 (children): children aged 7+ may consent but
// consent of the parent/guardian is also required; for children under
// 7, only the parent/guardian's consent applies. Age verification of
// the child is required before processing in all cases.
export const VN: CountryData = {
  code: "VN",
  regime: "PDPD",
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
        "Decree 13/2023 Art. 2 defines personal data as data of natural persons; emails identifying only a legal entity (e.g. info@company.vn) fall outside scope",
        "Role-based addresses tied to an identified individual (e.g. firstname.lastname@company.vn) remain personal data and require Art. 11 consent",
      ],
    },
    consentLanguage: { required: ["vi"], mustMatchUserLocale: true },
    dataResidency: { storageRegion: "any", crossBorderTransferMechanism: "explicit-consent" },
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
    // Decree 13/2023 Art. 20: under 7 parental-only; 7+ requires dual
    // consent (child + guardian). Decree does not set an upper age at
    // which the child can consent alone, so guardian consent is
    // effectively required throughout minority. Conservative threshold
    // set at 18 (Civil Code full civil act capacity) — guardian
    // involvement is mandatory for any under-18 data subject.
    childAgeOfConsent: 18,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Luat so 91/2025/QH15 ve Bao ve Du lieu Ca nhan (Law No. 91/2025/QH15 on Personal Data Protection, Cong Bao 971+972 of 24 July 2025) + Nghi dinh 13/2023/ND-CP ve Bao ve Du lieu Ca nhan (Decree 13/2023/ND-CP on Personal Data Protection, in force 1 July 2023) + Nghi dinh 91/2020/ND-CP ve Chong tin nhan rac, thu dien tu rac, cuoc goi rac (Decree 91/2020/ND-CP on Combating Spam)",
      url: "https://chinhphu.vn/?pageid=27160&docid=214590&classid=1&typegroupid=3",
      jurisdiction: "VN",
      subRegime: "VN-PDPD13",
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
    // Decree 13/2023 does not provide a soft opt-in / existing-customer
    // exemption equivalent to PECR Reg. 22(3); Art. 11 consent is
    // required even for prior customers.
    "existing-customer": {},
  },
}
