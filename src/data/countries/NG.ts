import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Nigeria Data Protection Act 2023 (NDPA) + General Application and
// Implementation Directive 2025 (GAID). Regulator: Nigeria Data Protection
// Commission (NDPC, ndpc.gov.ng).
//
// NDPA s. 25: consent must be freely given, specific, informed, and
// unambiguous, by a clear affirmative act. For direct marketing, NDPC
// guidance treats this as "express" (single opt-in) — pre-ticked boxes,
// silence, or bundled consent are invalid.
// NDPA s. 36: data subjects have an unconditional right to object to
// processing for direct marketing at any time, free of charge — opt-out
// must be available at every contact.
// NDPA s. 31: where the data subject is a child (defined as under 18,
// aligning with Nigeria's Child Rights Act), the controller must obtain
// consent from the parent or legal guardian. This raised the threshold
// from the previous NDPR 2019 (which used 13) — under NDPA 2023 there is
// no direct-consent window between 13 and 18. FPF analysis confirms:
// "A 'child' is defined as a person under 18 years old, aligning with
// Nigeria's Child Rights Act rather than the previous 13-year threshold."
// NDPA covers natural persons only — pure B2B (role-based corporate
// addresses, no identifiable individual) sits outside scope, but most
// named-person business emails remain in scope.
// Soft opt-in is NOT codified in NDPA/GAID; lawful interest under s. 25(1)(f)
// could in principle support marketing to existing customers, but NDPC has
// not blessed a UK-style PECR soft opt-in regime, so we do not enable it.
export const NG: CountryData = {
  code: "NG",
  regime: "NDPA",
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
        "NDPA applies to all natural persons; no general B2B carve-out for named-individual business addresses",
      ],
    },
    consentLanguage: { required: ["en"], mustMatchUserLocale: false },
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
    // NDPA s. 31: parental consent required for all data subjects under 18.
    childAgeOfConsent: 18,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Nigeria Data Protection Act 2023 (NDPA) + NDPC General Application and Implementation Directive 2025 (GAID)",
      url: "https://ndpc.gov.ng/",
      jurisdiction: "NG",
      subRegime: "NG-NDPA",
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
      // NDPA right to object (s. 36) applies regardless of relationship;
      // no codified soft opt-in, so existing customers still need express consent.
      softOptInAvailable: false,
      softOptInScope: "none",
    },
  },
}
