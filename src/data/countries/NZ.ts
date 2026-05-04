import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Unsolicited Electronic Messages Act 2007 (UEMA) + Privacy Act 2020.
// UEMA s.4 "consented to receiving" = express consent OR consent that
// can reasonably be inferred (incl. conspicuously published business
// addresses where message is relevant to role and no "no marketing"
// notice accompanies the publication) — most permissive B2B regime in
// this set. Unsubscribe takes effect 5 working days after use (s.9(2)).
export const NZ: CountryData = {
  code: "NZ",
  regime: "UEMA",
  defaults: {
    canCollectForMarketing: true,
    optIn: "express",
    checkboxRequired: false,
    bundlingAllowed: false,
    prechecking: "forbidden",
    channels: ["email"],
    unsubscribeMechanism: "any",
    softOptInAvailable: true,
    softOptInScope: "any",
    requiresCallerSimilarityAssertion: false,
    impliedConsentTtlMonths: null,
    b2bExemption: {
      regime: "publicly-disclosed",
      conditions: [
        "UEMA s.4 inferred consent: address conspicuously published in business/official capacity, message relevant to role, publication not accompanied by no-marketing notice",
      ],
    },
    consentLanguage: { required: [], mustMatchUserLocale: false },
    dataResidency: { storageRegion: "any", crossBorderTransferMechanism: "scc" },
    consentRecordRetentionMonths: 60,
    sensitiveDataFlags: {
      healthMarketingBlocked: false,
      politicalMarketingBlocked: false,
      childrenBlocked: true,
    },
    preferenceCenter: { granularityRequired: "channel", perEmailUnsubAlsoRequired: true },
    senderIdentity: {
      physicalAddressRequired: true,
      legalEntityNameRequired: true,
      representativeRequired: false,
    },
    reConsentTriggerMonths: null,
    childAgeOfConsent: 16,
    parentalVerificationRequired: false,
    proofRequired: ["timestamp", "source", "wording"],
    basis: {
      statute: "Unsolicited Electronic Messages Act 2007 (No. 7 of 2007) + Privacy Act 2020 (No. 31 of 2020)",
      url: "https://www.legislation.govt.nz/act/public/2007/0007/latest/whole.html",
      jurisdiction: "NZ",
      subRegime: "UEMA",
      dataLastUpdated: "2026-05-04",
      confidence: "medium",
      extraterritorialReach: true,
      lawyerAttestation: null,
    },
    suggestedTemplate: "single-opt-in",
  },
  byContext: {
    transactional: { proofRequired: [] },
  },
  byRelationship: {
    "existing-customer": {
      softOptInAvailable: true,
      softOptInScope: "any",
    },
    "publicly-listed-business": {
      // Deemed consent for B2B published addresses
      softOptInAvailable: true,
      softOptInScope: "any",
      optIn: "single",
    },
  },
}
