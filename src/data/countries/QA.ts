import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Qatar Law No. 13 of 2016 on Personal Data Privacy Protection (PDPPL).
// Regulator: Compliance and Data Protection Department (CDP) within
// MCIT / NCDPC (cdp.gov.qa). Art. 4 + 5 establish consent as the basis
// for processing personal data; Art. 18 governs direct marketing —
// requires explicit prior consent, sender identification, and a clear
// opt-out mechanism in every message. Art. 16 covers children's data
// and requires parental consent. The law applies to natural persons
// (no formal B2B carve-out). Arabic is the official language of Qatar
// and is required for legally effective consumer-facing notices.
export const QA: CountryData = {
  code: "QA",
  regime: "QA-PDPL",
  defaults: {
    canCollectForMarketing: true,
    // Art. 4 + 5: consent is the lawful basis. Art. 18: direct marketing
    // requires express prior consent (single opt-in is the statutory floor).
    optIn: "express",
    checkboxRequired: true,
    bundlingAllowed: false,
    prechecking: "forbidden",
    channels: ["email"],
    // Art. 18 mandates an effective opt-out mechanism in every message.
    unsubscribeMechanism: "one-click",
    // PDPPL provides no soft opt-in / existing-customer exemption.
    softOptInAvailable: false,
    softOptInScope: "none",
    requiresCallerSimilarityAssertion: false,
    impliedConsentTtlMonths: null,
    b2bExemption: {
      // PDPPL protects natural persons; corporate addresses fall outside
      // scope, but any identifiable individual at a business is covered.
      regime: "none",
      conditions: [
        "PDPPL applies to personal data of natural persons; no formal B2B exemption for individuals at corporate addresses",
      ],
    },
    // Arabic is the official language of Qatar; consumer-facing consent
    // notices must be available in Arabic to be considered informed.
    consentLanguage: { required: ["ar"], mustMatchUserLocale: true },
    dataResidency: { storageRegion: "any", crossBorderTransferMechanism: "explicit-consent" },
    consentRecordRetentionMonths: 60,
    sensitiveDataFlags: {
      // Art. 16 — children's personal data requires parental consent.
      healthMarketingBlocked: true,
      politicalMarketingBlocked: true,
      childrenBlocked: true,
    },
    preferenceCenter: { granularityRequired: "purpose", perEmailUnsubAlsoRequired: true },
    senderIdentity: {
      // Art. 18 — sender must be clearly identified in every direct
      // marketing message, with a working opt-out.
      physicalAddressRequired: true,
      legalEntityNameRequired: true,
      representativeRequired: false,
    },
    reConsentTriggerMonths: 24,
    // Art. 16 — processing children's data requires parental consent.
    // PDPPL does not set a statutory digital-consent age; default to 18
    // (age of majority in Qatar) for marketing purposes.
    childAgeOfConsent: 18,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Qatar Law No. 13 of 2016 on Personal Data Privacy Protection (PDPPL), Arts. 4, 5, 16, 18",
      url: "https://www.almeezan.qa/LawView.aspx?opt&LawID=7050&language=en",
      jurisdiction: "QA",
      subRegime: "QA-PDPL",
      dataLastUpdated: "2026-05-03",
      confidence: "medium",
      extraterritorialReach: false,
      lawyerAttestation: null,
    },
    suggestedTemplate: "double-opt-in",
  },
  byContext: {
    "lead-magnet": { canCollectForMarketing: false, optIn: "blocked", suggestedTemplate: "blocked" },
    transactional: { proofRequired: [] },
  },
  byRelationship: {
    // PDPPL provides no soft opt-in for existing customers — Art. 18
    // requires explicit prior consent regardless of prior relationship.
  },
}
