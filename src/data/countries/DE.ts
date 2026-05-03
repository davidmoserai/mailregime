import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// GDPR + UWG §7 Abs. 2 Nr. 2 (Gesetz gegen den unlauteren Wettbewerb) —
// "Werbung unter Verwendung ... elektronischer Post, ohne dass eine
// vorherige ausdrückliche Einwilligung des Adressaten vorliegt".
// Bestandskundenausnahme in §7 Abs. 3 (4 kumulative Voraussetzungen).
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
    // German required at point of collection — UWG §7 case law looks at
    // whether the consent was understandable to the recipient.
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
      statute: "GDPR Art. 6(1)(a) + Art. 7 + UWG §7 Abs. 2 Nr. 2 (+ Abs. 3 soft opt-in)",
      url: "https://www.gesetze-im-internet.de/uwg_2004/__7.html",
      jurisdiction: "EU",
      subRegime: "DE-UWG",
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
      // No statutory hard limit but UWG case law treats long inactivity
      // as undermining "reasonable expectation"; ~24mo is industry baseline.
      impliedConsentTtlMonths: 24,
    },
  },
}
