import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Ukraine — Law on Personal Data Protection (Law No. 2297-VI of 1 June 2010,
// "ЗУ Про захист персональних даних") + Law on Advertising
// (Law No. 270/96-VR, "ЗУ Про рекламу"). Regulator: Verkhovna Rada
// Commissioner for Human Rights (Ombudsman, ombudsman.gov.ua).
//
// Key bases:
// - Law 2297-VI Art. 11: processing of personal data requires consent of
//   the data subject (one of the listed legal grounds).
// - Law on Advertising Art. 21: direct advertising via electronic means
//   (telecom, including email) is prohibited without prior consent of the
//   recipient; recipient must be able to refuse further mailings.
// - Civil Code of Ukraine: minors aged 14+ have partial civil capacity;
//   below 14 ("malolitni") parental consent is required.
//
// NOTE: Ukraine has an ongoing PDP-law reform aligning with GDPR
// (Draft Law 8153 / new Law on Personal Data Protection). When enacted,
// regime, subRegime, lawful bases, and child age of consent must be revisited.
export const UA: CountryData = {
  code: "UA",
  regime: "Law-2297-VI",
  defaults: {
    canCollectForMarketing: true,
    // Law on Advertising Art. 21 — prior consent required for electronic
    // direct advertising; Law 2297-VI Art. 11 — consent must be voluntary,
    // informed, and documented (single express act).
    optIn: "express",
    checkboxRequired: true,
    bundlingAllowed: false,
    prechecking: "forbidden",
    channels: ["email"],
    // Recipient must be able to refuse further mailings at any time
    // (Law on Advertising Art. 21(2)).
    unsubscribeMechanism: "one-click",
    softOptInAvailable: false,
    softOptInScope: "none",
    requiresCallerSimilarityAssertion: false,
    impliedConsentTtlMonths: null,
    // Law 2297-VI applies to personal data of natural persons; legal-entity
    // contact data is outside scope, but Art. 21 of Law on Advertising
    // still restricts unsolicited electronic advertising regardless.
    b2bExemption: {
      regime: "none",
      conditions: [
        "Law 2297-VI covers natural persons; B2B role-based addresses out of scope",
        "Law on Advertising Art. 21 still requires consent for electronic direct advertising",
      ],
    },
    // Ukrainian is the state language; consumer-facing communications and
    // consent wording must be available in Ukrainian (Law on Ensuring the
    // Functioning of Ukrainian as the State Language, No. 2704-VIII).
    consentLanguage: { required: ["uk"], mustMatchUserLocale: true },
    dataResidency: { storageRegion: "any", crossBorderTransferMechanism: "explicit-consent" },
    consentRecordRetentionMonths: 36,
    sensitiveDataFlags: {
      healthMarketingBlocked: true,
      politicalMarketingBlocked: true,
      childrenBlocked: true,
    },
    preferenceCenter: { granularityRequired: "purpose", perEmailUnsubAlsoRequired: true },
    // Sender identity + opt-out path required by Law on Advertising Art. 21
    // (recipient must be able to identify advertiser and refuse).
    senderIdentity: {
      physicalAddressRequired: true,
      legalEntityNameRequired: true,
      representativeRequired: false,
    },
    reConsentTriggerMonths: 24,
    // Civil Code of Ukraine Arts. 31–32: minors below 14 ("malolitni")
    // act through parents; 14+ have partial civil capacity. Conservative
    // floor for marketing-data consent set at 14; below requires parental.
    childAgeOfConsent: 14,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Law of Ukraine No. 2297-VI of 1 June 2010 'On Personal Data Protection' + Law of Ukraine No. 270/96-VR 'On Advertising' Art. 21",
      url: "https://zakon.rada.gov.ua/laws/show/2297-17",
      jurisdiction: "UA",
      subRegime: "UA-2297",
      dataLastUpdated: "2026-05-03",
      // medium confidence: pending PDP reform (Draft Law 8153) aligning
      // Ukraine with GDPR may change regime, child age, and lawful bases.
      confidence: "medium",
      extraterritorialReach: false,
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
      // No statutory soft opt-in under current Law 2297-VI / Law on Advertising;
      // express prior consent still required, but opt-out must always be honored.
      softOptInAvailable: false,
      softOptInScope: "none",
      requiresCallerSimilarityAssertion: false,
    },
  },
}
