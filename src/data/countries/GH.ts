import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Ghana Data Protection Act, 2012 (Act 843), enforced by the Data
// Protection Commission (DPC, dataprotection.org.gh).
// - s. 20: requires consent / lawful basis for processing personal data.
// - s. 22: children require parental consent (minor = under 18).
// - s. 40: direct marketing — opt-out regime. A data controller may
//   send direct marketing to a data subject who has been given prior
//   notice and an opportunity to object; the data subject may object
//   ("opt out") at any time, free of charge.
// Because s. 40 is structured as opt-out (not prior express consent),
// classification here is "single" opt-in with soft opt-out available.
export const GH: CountryData = {
  code: "GH",
  regime: "DPA-2012",
  defaults: {
    canCollectForMarketing: true,
    optIn: "single",
    checkboxRequired: false,
    bundlingAllowed: true,
    prechecking: "allowed",
    channels: ["email"],
    unsubscribeMechanism: "one-click",
    softOptInAvailable: true,
    softOptInScope: "any",
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
    suggestedTemplate: "single-opt-in",
  },
  byContext: {
    "lead-magnet": { canCollectForMarketing: true, optIn: "single", suggestedTemplate: "single-opt-in" },
    transactional: { proofRequired: [] },
  },
  byRelationship: {
    "existing-customer": {
      softOptInAvailable: true,
      softOptInScope: "any",
      requiresCallerSimilarityAssertion: false,
    },
  },
}
