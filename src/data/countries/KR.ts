import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// PIPA + Network Act Art. 50. Among the strictest regimes globally.
// Subject line MUST begin with "(광고)". Night-time rule (21:00–08:00
// KST) requires SEPARATE consent. Consent must be re-confirmed every
// 2 years.
export const KR: CountryData = {
  code: "KR",
  regime: "PIPA",
  defaults: {
    canCollectForMarketing: true,
    optIn: "express",
    checkboxRequired: true,
    bundlingAllowed: false,
    prechecking: "forbidden",
    channels: ["email"],
    unsubscribeMechanism: "link",
    softOptInAvailable: false,
    softOptInScope: "none",
    requiresCallerSimilarityAssertion: false,
    impliedConsentTtlMonths: null,
    b2bExemption: {
      regime: "none",
      conditions: [
        "Network Act applies to all electronic transmission of for-profit ads regardless of recipient type",
      ],
    },
    consentLanguage: { required: ["ko-KR"], mustMatchUserLocale: true },
    dataResidency: { storageRegion: "any", crossBorderTransferMechanism: "explicit-consent" },
    consentRecordRetentionMonths: 24,
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
    // The 2-year periodic re-consent rule (former Network Act Art. 50-8 /
    // PIPA OSP special provisions) was REPEALED by the Sept 15, 2023 PIPA
    // amendment. Re-confirmation is now best practice, not statutory.
    reConsentTriggerMonths: null,
    childAgeOfConsent: 14,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Personal Information Protection Act (PIPA, Act No. 10465 of 2011, amended 2020/2023 — Sept 2023 amendment repealed OSP special provisions including biennial re-consent) + Act on Promotion of Information and Communications Network Utilization and Information Protection ('Network Act') Art. 50 (Art. 50(7) amended July 2024 to require notification of night-time consent outcomes)",
      url: "https://elaw.klri.re.kr/eng_service/lawView.do?hseq=58898&lang=ENG",
      jurisdiction: "KR",
      subRegime: "KR-NETACT",
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
      // 6-month window after transaction, same/similar own products only
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
      impliedConsentTtlMonths: 6,
    },
  },
}
