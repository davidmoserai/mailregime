import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// CASL (Canada's Anti-Spam Legislation, S.C. 2010, c. 23) + PIPEDA.
// Express consent regime. Implied consent narrowly available (existing
// business relationship 24mo from purchase, 6mo from inquiry).
//
// Quebec layers Law 25 + Bill 96 — see byRegion["CA-QC"].
export const CA: CountryData = {
  code: "CA",
  regime: "CASL",
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
    impliedConsentTtlMonths: 24,
    b2bExemption: {
      regime: "casl-intra-org",
      conditions: [
        "intra-org messages between employees of orgs with EBR",
        "no general B2B exemption",
      ],
    },
    consentLanguage: { required: [], mustMatchUserLocale: false },
    dataResidency: {
      storageRegion: "any",
      crossBorderTransferMechanism: "none-required",
    },
    consentRecordRetentionMonths: 36,
    sensitiveDataFlags: {
      healthMarketingBlocked: false,
      politicalMarketingBlocked: false,
      childrenBlocked: true,
    },
    preferenceCenter: {
      granularityRequired: "channel",
      perEmailUnsubAlsoRequired: true,
    },
    senderIdentity: {
      physicalAddressRequired: true,
      legalEntityNameRequired: true,
      representativeRequired: false,
    },
    reConsentTriggerMonths: null,
    childAgeOfConsent: 13,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording"],
    basis: {
      statute: "CASL S.C. 2010, c. 23 + PIPEDA + CRTC Enforcement Advisory 2016",
      url: "https://crtc.gc.ca/eng/com500/guide.htm",
      jurisdiction: "CA",
      subRegime: null,
      dataLastUpdated: "2026-05-02",
      confidence: "medium",
      extraterritorialReach: true,
      lawyerAttestation: null,
    },
    suggestedTemplate: "brevo-doi",
  },
  byContext: {
    "lead-magnet": {
      canCollectForMarketing: false,
      optIn: "blocked",
      suggestedTemplate: "blocked",
    },
    referral: {
      // CASL §6(2)(b): single referral message permitted, 6mo window,
      // referrer must be identified. Hard limit, not best practice.
      impliedConsentTtlMonths: 6,
    },
    transactional: {
      proofRequired: [],
    },
  },
  byRelationship: {
    "existing-customer": {
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
      impliedConsentTtlMonths: 24,
    },
    inquirer: {
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
      impliedConsentTtlMonths: 6,
    },
  },
  byRegion: {
    // Quebec — Law 25 + Bill 96 (Charter of the French Language).
    // French-language consent required. Stricter consent quality
    // ("manifest, free, enlightened, specific").
    "CA-QC": {
      consentLanguage: { required: ["fr-CA"], mustMatchUserLocale: true },
      basis: {
        statute:
          "CASL + PIPEDA + Quebec Law 25 (Act respecting the protection of personal information in the private sector) + Bill 96 (Charter of the French Language)",
        url: "https://www.cai.gouv.qc.ca/",
        jurisdiction: "CA",
        subRegime: "QC-Law-25",
        dataLastUpdated: "2026-05-02",
        confidence: "medium",
        extraterritorialReach: true,
        lawyerAttestation: null,
      },
    },
  },
}
