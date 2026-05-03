import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Vietnam personal data protection: Decree 13/2023/ND-CP on Personal Data
// Protection (in force 1 July 2023) + Decree 91/2020/ND-CP on Combating
// Spam Messages, Spam Emails and Spam Calls. A Personal Data Protection
// Law (Luat Bao ve Du lieu Ca nhan) is being drafted/passed by the
// National Assembly to elevate Decree 13 to statute level — confidence
// "medium" pending official publication on congbao.chinhphu.vn.
// Regulator: A05 — Department of Cyber Security and High-Tech Crime
// Prevention, Ministry of Public Security (Bo Cong an).
// Decree 13 Art. 11: consent must be express, specific, informed, and
// unambiguous; silence/non-response does not count. Direct marketing
// (Art. 21) requires the data subject's consent and the data subject
// must be informed they are receiving marketing communications.
// Decree 91/2020 Art. 11: prior express consent before sending
// advertising email; sender identity, opt-out mechanism, and message
// labelling required on every advertising email.
// Decree 13 Art. 20 (children): processing data of children under 7 is
// generally prohibited; data of children aged 7-15 requires consent of
// BOTH the child and the parent/guardian; over 15 — Decree text is
// ambiguous, conservative reading still requires guardian involvement
// where child lacks full civil act capacity (Civil Code threshold 18).
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
    // Decree 13/2023 Art. 20: under 7 parental only; 7-15 dual consent
    // (child + guardian); conservative threshold set at 15 because below
    // that age guardian consent is mandatory in addition to the child's.
    childAgeOfConsent: 15,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Nghi dinh 13/2023/ND-CP ve Bao ve Du lieu Ca nhan (Decree 13/2023/ND-CP on Personal Data Protection, in force 1 July 2023) + Nghi dinh 91/2020/ND-CP ve Chong tin nhan rac, thu dien tu rac, cuoc goi rac (Decree 91/2020/ND-CP on Combating Spam)",
      url: "https://chinhphu.vn/default.aspx?pageid=27160&docid=207759",
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
