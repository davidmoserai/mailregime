import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Taiwan Personal Data Protection Act (個人資料保護法, PDPA), last
// substantive amendment 2023; subsidiary Enforcement Rules (個資法施行細則).
// Regulator: Personal Data Protection Commission (PDPC, 個人資料保護
// 委員會) — newly established 2025 as the unified competent authority;
// prior to its operational stand-up the Ministry of Justice (MOJ) issued
// interpretive guidance.
//
// Primary marketing rules:
//   * PDPA Art. 5 — collection/processing/use must respect good faith
//     and be proportionate to the specified purpose.
//   * PDPA Art. 7 — "consent" must be a separate, informed declaration
//     of agreement (書面同意 / 單獨之意思表示). When bundled with other
//     declarations in the same document, the data subject must be made
//     specifically aware and confirm. This is the "express, separate
//     written consent" baseline.
//   * PDPA Art. 19 — non-public-agency collection requires a lawful
//     basis (consent, contract, public interest, etc.).
//   * PDPA Art. 20(1) — use of personal data must be within the scope
//     of the originally specified purpose, unless an exception applies
//     (incl. consent of the data subject) → secondary use for marketing
//     requires fresh consent.
//   * PDPA Art. 20(2)–(3) — when a non-public agency uses personal data
//     for MARKETING, the data subject may at any time express refusal;
//     upon first marketing use, the agency must provide the data subject
//     with a means to refuse and bear the costs of doing so. Once refusal
//     is expressed, marketing must cease immediately.
//
// Scope: PDPA Art. 2(1) defines personal data as data of a natural
// person — legal-person / corporate identifiers (incl. generic role
// inboxes such as info@, sales@) fall outside the Act. B2B email to a
// named individual at a company IS personal data and in scope.
export const TW: CountryData = {
  code: "TW",
  regime: "PDPA",
  defaults: {
    canCollectForMarketing: true,
    // PDPA Art. 7 + Art. 20(1) exception (6): marketing reuse of personal
    // data requires a separate, informed declaration of agreement —
    // i.e., express written consent. Pre-ticked or bundled consent is
    // not a valid "separate declaration" under Art. 7.
    optIn: "express",
    checkboxRequired: true,
    bundlingAllowed: false,
    prechecking: "forbidden",
    channels: ["email"],
    // Art. 20(3): the controller must provide a no-cost refusal channel
    // on first marketing contact and on every subsequent communication.
    unsubscribeMechanism: "one-click",
    // No statutory soft opt-in / existing-customer carve-out under PDPA.
    // The only relief Art. 20 grants is that the FIRST marketing contact
    // is permissible if a refusal mechanism is offered — but the lawful
    // basis for the underlying use still has to exist under Art. 5/19/20.
    softOptInAvailable: false,
    softOptInScope: "none",
    requiresCallerSimilarityAssertion: false,
    impliedConsentTtlMonths: null,
    // PDPA applies to natural persons only (Art. 2(1)). Generic legal-
    // person mailboxes (info@, contact@) are not personal data. Named
    // individuals at companies remain in scope.
    b2bExemption: {
      regime: "none",
      conditions: [
        "PDPA Art. 2(1): 'personal data' = data of a natural person",
        "Generic role/legal-person email addresses are out of scope",
        "Named individual business contacts remain in scope",
      ],
    },
    // Mandarin Chinese (Traditional, 繁體中文) is the official language
    // of Taiwan; consent notices to TW data subjects should be in
    // Traditional Chinese to satisfy the Art. 8 / Art. 7 informed-
    // consent requirement.
    consentLanguage: { required: ["zh-TW"], mustMatchUserLocale: true },
    dataResidency: { storageRegion: "any", crossBorderTransferMechanism: "scc" },
    consentRecordRetentionMonths: 60,
    sensitiveDataFlags: {
      // PDPA Art. 6 — "special" personal data (medical, genetic, sexual
      // life, health exam, criminal record) cannot be collected/used
      // for marketing absent narrow statutory exceptions + written
      // consent. Political opinion is not enumerated as Art. 6 special
      // data but is sensitive in practice.
      healthMarketingBlocked: true,
      politicalMarketingBlocked: true,
      childrenBlocked: true,
    },
    preferenceCenter: { granularityRequired: "purpose", perEmailUnsubAlsoRequired: true },
    // Art. 8 disclosures on first collection: identity of the controller,
    // purpose, categories, period, recipients, and subject rights — and
    // Art. 20(3) requires that every marketing message offer a refusal
    // method at no cost to the recipient.
    senderIdentity: {
      physicalAddressRequired: true,
      legalEntityNameRequired: true,
      representativeRequired: false,
    },
    reConsentTriggerMonths: 24,
    // ROC Civil Code limited capacity threshold was lowered from 20 to
    // 18 with effect from 1 Jan 2023 (民法 §12). Under-18s require
    // statutory-agent (parental) consent; PDPA itself does not set a
    // distinct digital age, so general civil-capacity rules apply.
    childAgeOfConsent: 18,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Personal Data Protection Act (個人資料保護法, PDPA), promulgated 1995 as Computer-Processed Personal Data Protection Act, fully revised 2010, last amended 2023; Enforcement Rules of the Personal Data Protection Act (個人資料保護法施行細則)",
      url: "https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=I0050021",
      jurisdiction: "TW",
      subRegime: "TW-PDPA",
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
    // No statutory soft opt-in under PDPA; existing-customer relationship
    // does NOT relax Art. 7 written-consent requirement for marketing
    // reuse beyond the original collection purpose.
    "existing-customer": {
      softOptInAvailable: false,
      softOptInScope: "none",
      requiresCallerSimilarityAssertion: false,
    },
  },
}
