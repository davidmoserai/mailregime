import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Thailand Personal Data Protection Act B.E. 2562 (2019) ("PDPA"),
// fully in force 1 June 2022. Regulator: Personal Data Protection
// Committee (PDPC), pdpc.or.th.
//
// Key provisions:
// - s. 19: consent must be freely given, specific, informed, and explicit;
//   request must be presented in a clearly distinguishable manner, in
//   easily accessible and intelligible form, using clear and plain language,
//   and not deceptive or misleading. Withdrawal must be as easy as giving.
// - s. 24: lawful bases for processing non-sensitive personal data. Direct
//   marketing is not listed as a standalone legitimate-interest carve-out
//   the way GDPR Recital 47 frames it; PDPC guidance treats marketing
//   communications as generally requiring consent under s. 19 unless a
//   narrow s. 24 base clearly applies. Practical posture: express consent.
// - s. 26: sensitive data requires explicit consent.
// - s. 20: a data subject under 10 requires parental consent for any
//   processing; ages 10–20 may consent themselves only where the act is
//   one a minor of that age can lawfully perform alone, otherwise parental
//   consent is required. Age of majority in Thailand is 20.
// - s. 23: notice / sender-identity duties (identity & contact of controller,
//   purposes, recipients, rights) at or before collection.
// - PDPA applies to "personal data" of natural persons only; data about
//   juristic persons (companies) is out of scope, so generic corporate
//   role addresses (info@, sales@) that do not identify a natural person
//   fall outside PDPA — but a named employee mailbox does not.
// - Language: PDPA does not mandate Thai for consent text, but PDPC
//   guidance and s. 19's "easily accessible and intelligible" standard
//   mean Thai is required in practice when the data subject is Thai-
//   speaking. Treat Thai as required.
export const TH: CountryData = {
  code: "TH",
  regime: "PDPA",
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
      // PDPA covers natural persons only. Generic corporate role addresses
      // that do not identify a natural person (info@, contact@) are not
      // personal data; named individual mailboxes (jane.doe@acme.co.th)
      // remain in scope.
      regime: "function-address",
      conditions: [
        "Address must be a generic corporate role mailbox (e.g. info@, sales@, contact@) that does not identify a natural person",
        "Named individual business addresses remain personal data under PDPA s. 6",
      ],
    },
    consentLanguage: { required: ["th"], mustMatchUserLocale: true },
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
      representativeRequired: true,
    },
    reConsentTriggerMonths: 24,
    // PDPA s. 20: under 10 requires parental consent in all cases.
    // 10–20 may self-consent only for acts a minor of that age may lawfully
    // perform alone; otherwise parental consent. Conservative floor: 10.
    childAgeOfConsent: 10,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Personal Data Protection Act B.E. 2562 (2019) (PDPA), in particular sections 19, 20, 23, 24, 26",
      url: "https://www.pdpc.or.th/",
      jurisdiction: "TH",
      subRegime: "TH-PDPA",
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
    // PDPA does not provide a clear soft opt-in / "similar products" carve-out
    // analogous to ePrivacy Art. 13(2). Existing customers still require
    // express consent for marketing communications.
  },
}
