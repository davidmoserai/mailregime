import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Philippines Data Privacy Act of 2012 (Republic Act No. 10173, "DPA")
// and its Implementing Rules and Regulations (IRR), enforced by the
// National Privacy Commission (NPC). DPA s. 12 lists lawful bases for
// processing personal information; consent (s. 12(a)) is the typical
// basis for direct marketing and must be "freely given, specific,
// informed" and evidenced by written, electronic or recorded means
// (s. 3(b)). Legitimate interests (s. 12(f)) is narrowly construed by
// NPC for unsolicited marketing. The DPA protects natural persons —
// purely legal-person contact data is outside scope, but care is needed
// where role addresses identify a natural person. Penalties under
// ss. 25–34 include imprisonment and fines up to PHP 5,000,000.
export const PH: CountryData = {
  code: "PH",
  regime: "PH-DPA",
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
        "DPA covers personal information of natural persons; data identifying only a juridical/legal person is outside scope (RA 10173 s. 3(g))",
        "Role-based addresses that still identify an identifiable individual remain personal information",
      ],
    },
    consentLanguage: { required: ["en", "fil"], mustMatchUserLocale: false },
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
      representativeRequired: false,
    },
    reConsentTriggerMonths: 24,
    childAgeOfConsent: 18,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Republic Act No. 10173 (Data Privacy Act of 2012) and its IRR; NPC Circulars (e.g. NPC Circular 16-01, 18-01) issued by the National Privacy Commission",
      url: "https://privacy.gov.ph/data-privacy-act/",
      jurisdiction: "PH",
      subRegime: "PH-DPA",
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
      softOptInAvailable: false,
      softOptInScope: "none",
      requiresCallerSimilarityAssertion: false,
    },
  },
}
