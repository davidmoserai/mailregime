import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// UK GDPR + PECR (Privacy and Electronic Communications Regulations 2003)
// + Data (Use and Access) Act 2025 (Royal Assent 19 June 2025). Post-
// Brexit. NOT a GDPR alias — UK divergence is widening: DUAA softens
// some GDPR-derived obligations, recognises a list of legitimate
// interests, and raises PECR fines to UK GDPR levels (£17.5m / 4%).
// Charity soft opt-in added to PECR Reg 22 by DUAA, commencing early
// 2026 — track via byRelationship: "donor" if you target charities.
//
// Note: optIn: "double" is ICO best-practice / evidentiary standard
// under UK GDPR Art. 7 accountability — single opt-in is statutorily
// sufficient under PECR Reg 22 but does not robustly evidence consent
// quality. We default to double and let callers downshift via
// configure().
export const GB: CountryData = {
  code: "GB",
  regime: "UK-GDPR",
  defaults: {
    canCollectForMarketing: true,
    optIn: "double",
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
        "legitimate interest assessment required",
        "B2B corporate subscribers (companies, LLPs) have weaker PECR protections than sole traders / partnerships",
      ],
    },
    consentLanguage: { required: [], mustMatchUserLocale: false },
    dataResidency: {
      storageRegion: "any",
      // UK uses IDTA or the UK Addendum to EU SCCs, not raw EU SCCs.
      crossBorderTransferMechanism: "idta",
    },
    consentRecordRetentionMonths: 60,
    sensitiveDataFlags: {
      healthMarketingBlocked: true,
      politicalMarketingBlocked: true,
      childrenBlocked: true,
    },
    preferenceCenter: {
      granularityRequired: "purpose",
      perEmailUnsubAlsoRequired: true,
    },
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
      statute:
        "UK GDPR + PECR (Privacy and Electronic Communications Regulations 2003) Reg. 22 + Data (Use and Access) Act 2025 (Royal Assent 19 June 2025) + Data Protection Act 2018 §9 (age 13)",
      url: "https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/consent/",
      jurisdiction: "UK",
      subRegime: "PECR",
      dataLastUpdated: "2026-05-03",
      confidence: "medium",
      extraterritorialReach: true,
      lawyerAttestation: null,
    },
    suggestedTemplate: "double-opt-in",
  },
  byContext: {
    "lead-magnet": {
      canCollectForMarketing: false,
      optIn: "blocked",
      suggestedTemplate: "blocked",
    },
    transactional: {
      proofRequired: [],
    },
  },
  byRelationship: {
    "existing-customer": {
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
    },
    // PECR Reg 22 soft opt-in extended to registered charities by
    // DUAA 2025 (commencement early 2026). Charity furthering its
    // charitable purposes may use the soft opt-in route.
    donor: {
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
    },
  },
}
