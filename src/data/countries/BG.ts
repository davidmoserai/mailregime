import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Bulgaria: GDPR + ePrivacy (Dir. 2002/58/EC) transposed via the
// Electronic Commerce Act (ZET) Art. 6 (unsolicited commercial
// communications) and the Personal Data Protection Act (ZZLD).
// Regulator: KZLD (cpdp.bg). Express prior consent required for
// e-marketing to natural persons; soft opt-in available for existing
// customers re: similar own products/services (ZET Art. 6(2)).
export const BG: CountryData = {
  code: "BG",
  regime: "GDPR+ePrivacy",
  defaults: {
    canCollectForMarketing: true,
    // ZET Art. 6(1) requires prior express consent of the recipient
    // for unsolicited commercial e-communications.
    // https://lex.bg/laws/ldoc/2135530547
    optIn: "express",
    checkboxRequired: true,
    // GDPR Art. 7(2) + EDPB guidance — consent must be unbundled.
    bundlingAllowed: false,
    // CJEU Planet49; GDPR Recital 32 — pre-ticked boxes invalid.
    prechecking: "forbidden",
    channels: ["email"],
    unsubscribeMechanism: "one-click",
    softOptInAvailable: false,
    softOptInScope: "none",
    requiresCallerSimilarityAssertion: false,
    impliedConsentTtlMonths: null,
    b2bExemption: {
      // ZET Art. 6 applies to "recipients" without distinguishing legal
      // and natural persons in practice; KZLD treats employee mailboxes
      // at legal persons as personal data under GDPR. Generic role
      // addresses (info@, sales@) commonly handled under LIA.
      regime: "gdpr-lia",
      conditions: [
        "ZET Art. 6 covers commercial communications generally",
        "Role/function addresses (info@, sales@) typically under GDPR LIA",
        "Employee personal work addresses still require GDPR basis",
      ],
    },
    // KZLD guidance: consent and notices must be in clear language
    // understandable to the data subject; Bulgarian required where
    // the service targets the Bulgarian market.
    // https://www.cpdp.bg/
    consentLanguage: { required: ["bg"], mustMatchUserLocale: true },
    dataResidency: { storageRegion: "eu", crossBorderTransferMechanism: "scc" },
    consentRecordRetentionMonths: 36,
    sensitiveDataFlags: {
      healthMarketingBlocked: true,
      politicalMarketingBlocked: true,
      childrenBlocked: true,
    },
    preferenceCenter: { granularityRequired: "purpose", perEmailUnsubAlsoRequired: true },
    // ZET Art. 4 (information society services) — provider identity,
    // registered seat / address, contact details must be made available.
    senderIdentity: {
      physicalAddressRequired: true,
      legalEntityNameRequired: true,
      representativeRequired: false,
    },
    reConsentTriggerMonths: 24,
    // ZZLD Art. 25c — Bulgaria sets the GDPR Art. 8 digital age of
    // consent at 14. https://lex.bg/laws/ldoc/2132268033
    childAgeOfConsent: 14,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Regulation (EU) 2016/679 (GDPR) + Directive 2002/58/EC (ePrivacy) + Bulgarian Electronic Commerce Act (ZET) Art. 6 + Personal Data Protection Act (ZZLD)",
      url: "https://www.cpdp.bg/en/",
      jurisdiction: "BG",
      subRegime: "BG-ZET",
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
    // ZET Art. 6(2) — soft opt-in: a trader who obtained an electronic
    // contact from a customer in connection with a sale may use it to
    // market its own similar products/services, with opt-out at each
    // message and at collection.
    "existing-customer": {
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
    },
  },
}
