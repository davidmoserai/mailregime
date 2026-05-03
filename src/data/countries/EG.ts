import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Egypt — Personal Data Protection Law No. 151 of 2020 (PDPL).
// Regulator: Personal Data Protection Center (PDPC) under MCIT.
// Executive Regulations issued 1 November 2025 by Ministerial
// Decree 816 of 2025 (وزير الاتصالات وتكنولوجيا المعلومات);
// PDPC is now operational. The regulations introduce a LICENSING
// requirement for direct electronic marketing activity from the
// PDPC, in addition to the data subject's express prior consent.
// Quoted clause (Decree 816/2025 reporting): "اشترطت اللائحة
// الحصول على ترخيص من المركز لمزاولة نشاط التسويق الإلكتروني،
// وأوجبت الحصول على موافقة صريحة مسبقة من الشخص المعني بالبيانات
// قبل توجيه الرسائل التسويقية إليه".
//
// Key provisions for direct electronic marketing:
//   Art. 12 — Processing personal data requires explicit consent
//             of the data subject (express, single opt-in).
//   Art. 11 — Electronic marketing communications: must be sent only
//             with the data subject's express prior consent, must
//             clearly identify the sender, must disclose the marketing
//             purpose, and must provide a free, simple opt-out
//             mechanism in every message.
//   Art. 3  — Defines "child" and protected categories; combined with
//   Art. 17 — Children's personal data requires parental/guardian
//             consent. PDPL treats persons under 18 as children.
//   Art. 14 — Cross-border transfers of personal data require a
//             licence/permit from the PDPC and an adequate level
//             of protection in the recipient jurisdiction.
//
// PDPL covers natural persons; there is no carve-out for B2B
// (employee/role) addresses — corporate inboxes tied to identifiable
// individuals are in scope. No formal soft opt-in (existing-customer
// similar-products) regime is provided in the statute.
// Consent and disclosures must be intelligible to the data subject;
// Arabic is the official language of Egypt and is required for
// consent wording directed at Egyptian residents.
//
// Source: Law 151/2020 as published in the Official Gazette,
//         republished by MCIT (mcit.gov.eg); Executive
//         Regulations issued by Ministerial Decree 816 of 2025
//         (effective 1 November 2025).
export const EG: CountryData = {
  code: "EG",
  regime: "PDPL",
  defaults: {
    canCollectForMarketing: true,
    // Art. 11 + Art. 12 — express prior consent required.
    optIn: "express",
    checkboxRequired: true,
    bundlingAllowed: false,
    prechecking: "forbidden",
    channels: ["email"],
    unsubscribeMechanism: "one-click",
    // No statutory soft opt-in under PDPL.
    softOptInAvailable: false,
    softOptInScope: "none",
    requiresCallerSimilarityAssertion: false,
    impliedConsentTtlMonths: null,
    b2bExemption: {
      regime: "none",
      conditions: [
        "PDPL Art. 2 covers personal data of natural persons; role-based business addresses tied to identifiable individuals are in scope",
      ],
    },
    // Arabic required for consent wording directed at EG residents.
    consentLanguage: { required: ["ar"], mustMatchUserLocale: true },
    // Art. 14 — cross-border transfer requires PDPC licence.
    dataResidency: { storageRegion: "any", crossBorderTransferMechanism: "explicit-consent" },
    consentRecordRetentionMonths: 60,
    sensitiveDataFlags: {
      healthMarketingBlocked: true,
      politicalMarketingBlocked: true,
      childrenBlocked: true,
    },
    preferenceCenter: { granularityRequired: "purpose", perEmailUnsubAlsoRequired: true },
    // Art. 11 — sender must be clearly identified and provide opt-out.
    senderIdentity: {
      physicalAddressRequired: true,
      legalEntityNameRequired: true,
      representativeRequired: true,
    },
    reConsentTriggerMonths: 24,
    // Art. 3 / Art. 17 — children (under 18) require parental consent.
    childAgeOfConsent: 18,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Egypt Personal Data Protection Law No. 151 of 2020 (PDPL), Arts. 11, 12, 14, 17; Executive Regulations issued by Ministerial Decree 816 of 2025 (effective 1 Nov 2025)",
      url: "https://mcit.gov.eg/en/Legislations",
      jurisdiction: "EG",
      subRegime: "EG-PDPL",
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
    // PDPL provides no soft opt-in for existing customers.
  },
}
