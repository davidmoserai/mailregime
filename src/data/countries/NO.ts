import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Norwegian Marketing Control Act §15 (Markedsføringsloven) + GDPR
// via Personal Data Act 2018. EEA member — GDPR applies. Forbruker-
// tilsynet (Consumer Authority) issues administrative fines directly.
// Norwegian courts: free signup ≠ "customer relationship" → no soft
// opt-in via lead magnet.
export const NO: CountryData = {
  code: "NO",
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
        "MFL §15(1) applies to natural persons only",
        "B2B-to-legal-persons falls outside §15 — governed by GDPR LIA + ekomloven, with opt-out + clear sender ID",
      ],
    },
    consentLanguage: { required: ["nb-NO"], mustMatchUserLocale: true },
    dataResidency: { storageRegion: "eu", crossBorderTransferMechanism: "scc" },
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
    childAgeOfConsent: 13,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Lov om kontroll med markedsføring (markedsføringsloven) av 9. januar 2009 nr. 2, §15 + Personopplysningsloven 2018 (GDPR via EEA)",
      url: "https://lovdata.no/dokument/NL/lov/2009-01-09-2",
      jurisdiction: "EEA",
      subRegime: "NO-MFL",
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
      // Only genuine paid sale qualifies — courts have explicitly
      // ruled that free newsletter signup is not a customer relationship.
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
    },
  },
}
