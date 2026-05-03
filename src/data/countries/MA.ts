import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Morocco — Loi n° 09-08 relative à la protection des personnes physiques
// à l'égard du traitement des données à caractère personnel (2009).
// Regulator: CNDP (Commission Nationale de contrôle de la protection des
// Données à caractère Personnel) — cndp.ma.
//
// Art. 4: lawful processing requires the data subject's indubitable consent.
// Art. 10: "prospection directe" by email/fax/automated means requires
// the express prior consent of the natural person recipient. Existing-customer
// carve-out for similar products/services is permitted, with a clear
// opt-out offered free of charge at the time of collection AND at every
// subsequent message. Sender identity must not be concealed and a valid
// reply address for opt-out is mandatory.
// Loi 09-08 covers natural persons only — legal-person business addresses
// (info@, contact@) fall outside the scope of Art. 10.
export const MA: CountryData = {
  code: "MA",
  regime: "Loi 09-08",
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
        "Loi 09-08 protects natural persons; generic legal-person mailboxes (info@, contact@) fall outside Art. 10",
        "Any message addressed to a named individual at a company is in scope and requires express prior consent",
      ],
    },
    consentLanguage: { required: ["ar", "fr"], mustMatchUserLocale: true },
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
    // Civil majority in Morocco is 18 (Code de la Famille / Moudawana).
    // Loi 09-08 does not set a separate digital-consent age; CNDP guidance
    // requires verification of legal capacity / parental authorization for minors.
    childAgeOfConsent: 18,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Loi n° 09-08 du 18 février 2009 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel + Décret n° 2-09-165",
      url: "https://www.cndp.ma/",
      jurisdiction: "MA",
      subRegime: "MA-09-08",
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
    // Art. 10 existing-customer carve-out: similar products/services from same
    // controller, with free opt-out offered at collection and at every message.
    "existing-customer": {
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
    },
  },
}
