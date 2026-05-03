import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Ghana Data Protection Act, 2012 (Act 843), enforced by the Data
// Protection Commission (DPC, dataprotection.org.gh).
// - s. 20: requires consent / lawful basis for processing personal data.
// - s. 22: children require parental consent (minor = under 18).
// - s. 40: direct marketing — opt-in regime. A data controller shall
//   not use personal data for direct marketing purposes without the
//   prior written consent of the data subject. The data subject may
//   withdraw consent / object at any time, free of charge.
// Because s. 40 requires prior written (express) consent, classification
//   here is "express" opt-in. No soft opt-in carve-out exists in Act 843.
export const GH: CountryData = {
  code: "GH",
  regime: "DPA-2012",
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
        "Act 843 protects natural persons; B2B communications to identifiable individuals are still in scope",
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
      representativeRequired: false,
    },
    reConsentTriggerMonths: 24,
    // Act 843 s. 22 — a child is a person under 18; processing of a child's
    // personal data requires consent of a parent or legal guardian.
    childAgeOfConsent: 18,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording"],
    basis: {
      statute: "Ghana Data Protection Act, 2012 (Act 843), ss. 20, 22, 40",
      url: "https://www.dataprotection.org.gh/data-protection/data-protection-acts-2012",
      jurisdiction: "GH",
      subRegime: "GH-DPA",
      dataLastUpdated: "2026-05-03",
      confidence: "medium",
      extraterritorialReach: true,
      lawyerAttestation: null,
    },
    suggestedTemplate: "double-opt-in",
  },
  byContext: {
    "lead-magnet": { canCollectForMarketing: true, optIn: "express", suggestedTemplate: "double-opt-in" },
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
