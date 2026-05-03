import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// GDPR + TKG 2021 §174. Austria explicitly extends opt-in to LEGAL
// PERSONS — no B2B exemption. Mandatory RTR Robinson-list (ECG-Liste)
// check before any send. Fines up to €100K per violation.
export const AT: CountryData = {
  code: "AT",
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
      regime: "none",
      conditions: [
        "TKG §174(3) opt-in obligation explicitly covers legal persons",
        "TKG §174(4) similar-products soft opt-in available to business recipients on same conditions as B2C",
        "RTR ECG-Liste Robinson-list check mandatory before sending",
      ],
    },
    consentLanguage: { required: ["de-AT"], mustMatchUserLocale: true },
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
    childAgeOfConsent: 14,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "GDPR Art. 6(1)(a) + Art. 7 + Telekommunikationsgesetz 2021 (TKG 2021) §174(3) opt-in + §174(4) soft opt-in + DSG §4(4)",
      url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20011678",
      jurisdiction: "EU",
      subRegime: "AT-TKG-2021",
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
      // No statutory time limit — DSB practice ~12 months
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
      impliedConsentTtlMonths: 12,
    },
  },
}
