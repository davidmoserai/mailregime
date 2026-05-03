import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// GDPR + ePrivacy Regulations 2011 (S.I. 336/2011), Reg. 13. Criminal
// offence: up to €5K per email (summary) / €250K (indictment, body
// corporate). DPC enforcement among the most active in the EU. Soft
// opt-in window: 12 months from last sale.
export const IE: CountryData = {
  code: "IE",
  regime: "GDPR",
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
      regime: "gdpr-lia",
      conditions: [
        "Reg. 13 + DPC corporate-subscriber guidance: corporate subscribers may receive marketing on opt-out basis",
        "valid opt-out + sender ID required in every message",
        "must consult Reg. 13 opt-out registers",
      ],
    },
    consentLanguage: { required: [], mustMatchUserLocale: false },
    dataResidency: { storageRegion: "any", crossBorderTransferMechanism: "scc" },
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
    childAgeOfConsent: 16,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "GDPR Art. 6(1)(a) + Art. 7 + ePrivacy Regulations 2011 (S.I. 336/2011) Reg. 13 (esp. 13(1) opt-in, 13(11) soft opt-in) + Data Protection Act 2018 §31",
      url: "https://www.dataprotection.ie/en/organisations/rules-electronic-and-direct-marketing",
      jurisdiction: "EU",
      subRegime: "IE-ePR-2011",
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
      // 12 months from last sale per DPC guidance
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
      impliedConsentTtlMonths: 12,
    },
  },
}
