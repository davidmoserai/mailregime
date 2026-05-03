import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Indonesia Personal Data Protection Law (UU PDP) No. 27/2022,
// fully effective October 2024. GDPR-style framework. Regulator
// is the PDP Agency (still in formation; MOCI/Kominfo currently
// supervises). Art. 20 requires consent to be explicit, valid,
// voluntary, specific, and informed — for direct marketing this
// means express (single) opt-in. Art. 25 requires parental
// consent for processing data of children under 18. UU PDP
// covers natural persons only (no legal-entity B2B carve-out
// for marketing purposes). Bahasa Indonesia is required for
// consent language used with Indonesian data subjects.
export const ID: CountryData = {
  code: "ID",
  regime: "UU-PDP",
  defaults: {
    canCollectForMarketing: true,
    // UU PDP Art. 20 — consent must be explicit, valid, voluntary,
    // specific, and informed. For direct marketing: express (single).
    optIn: "express",
    checkboxRequired: true,
    bundlingAllowed: false,
    prechecking: "forbidden",
    channels: ["email"],
    unsubscribeMechanism: "one-click",
    // UU PDP has limited carve-outs for legitimate interests;
    // direct marketing generally requires express consent.
    softOptInAvailable: false,
    softOptInScope: "none",
    requiresCallerSimilarityAssertion: false,
    impliedConsentTtlMonths: null,
    // UU PDP covers natural persons only — no B2B legal-entity
    // carve-out for marketing to individuals at companies.
    b2bExemption: {
      regime: "none",
      conditions: [
        "UU PDP covers natural persons only; marketing to individual employees still requires express consent",
      ],
    },
    // Bahasa Indonesia required for consent presented to
    // Indonesian data subjects.
    consentLanguage: { required: ["id"], mustMatchUserLocale: true },
    dataResidency: { storageRegion: "any", crossBorderTransferMechanism: "adequacy" },
    consentRecordRetentionMonths: 60,
    sensitiveDataFlags: {
      healthMarketingBlocked: true,
      politicalMarketingBlocked: true,
      childrenBlocked: true,
    },
    preferenceCenter: { granularityRequired: "purpose", perEmailUnsubAlsoRequired: true },
    // Sender identity + functioning opt-out required for
    // commercial communications.
    senderIdentity: {
      physicalAddressRequired: true,
      legalEntityNameRequired: true,
      representativeRequired: true,
    },
    reConsentTriggerMonths: 24,
    // UU PDP Art. 25 — under 18 requires parental consent.
    childAgeOfConsent: 18,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Indonesia Personal Data Protection Law (UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi), fully effective October 2024",
      url: "https://peraturan.bpk.go.id/Details/229798/uu-no-27-tahun-2022",
      jurisdiction: "ID",
      subRegime: "ID-UUPDP",
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
      softOptInAvailable: false,
      softOptInScope: "none",
      requiresCallerSimilarityAssertion: false,
    },
  },
}
