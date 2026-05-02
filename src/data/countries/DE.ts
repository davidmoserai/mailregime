import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// GDPR + UWG §7 Abs. 2 Nr. 3 (Gesetz gegen den unlauteren Wettbewerb).
// Germany applies a stricter "Bestandskundenausnahme" — soft opt-in is
// available only for similar products, the customer must have been told
// about marketing use at point of sale, and the unsubscribe link must
// appear in every message.
export const DE: CountryData = {
  code: "DE",
  regime: "GDPR",
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
        "UWG §7 case law generally requires consent even for B2B",
      ],
    },
    consentLanguage: { required: ["de-DE"], mustMatchUserLocale: true },
    dataResidency: {
      storageRegion: "any",
      crossBorderTransferMechanism: "scc",
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
    childAgeOfConsent: 16,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "GDPR Art. 6(1)(a) + Art. 7 + UWG §7 Abs. 2 Nr. 3",
      url: "https://gdpr-info.eu/art-6-gdpr/",
      jurisdiction: "EU",
      subRegime: "DE-UWG",
      dataLastUpdated: "2026-05-02",
      confidence: "medium",
      extraterritorialReach: true,
      lawyerAttestation: null,
    },
    suggestedTemplate: "brevo-doi",
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
  },
}
