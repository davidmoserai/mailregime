import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Ghana Data Protection Act, 2012 (Act 843), enforced by the Data
// Protection Commission (DPC, dataprotection.org.gh).
// - s. 20: "A person shall not process personal data without the prior
//   consent of the data subject" unless one of the listed lawful bases
//   applies (contract, law, vital/legitimate interest, statutory duty).
// - s. 37(1)(a): processing of personal data of "a child who is under
//   parental control in accordance with the law" is prohibited unless
//   processing is necessary or the data subject consents (s. 37(2)).
//   Act 843 does not fix a numerical age; the under-18 threshold comes
//   from Ghana's Children's Act 1998 (Act 560) and Constitution art. 28.
// - s. 40(1): "A data controller shall not provide, use, obtain,
//   procure or provide information related to a data subject for the
//   purposes of direct marketing without the prior written consent of
//   the data subject." s. 40(2) adds a standing opt-out right by
//   written notice. Therefore classification here is "express" opt-in.
// No soft opt-in carve-out exists in Act 843.
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
    // Act 843 s. 37(1)(a) prohibits processing data of "a child who is
    // under parental control in accordance with the law". Act 843 does
    // not state a numerical age; under-18 is taken from Ghana's
    // Children's Act 1998 (Act 560) and Constitution art. 28.
    childAgeOfConsent: 18,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording"],
    basis: {
      statute: "Ghana Data Protection Act, 2012 (Act 843), ss. 20, 37, 40",
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
