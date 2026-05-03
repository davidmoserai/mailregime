import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// 2025 LFPDPPP (Ley Federal de Protección de Datos Personales en
// Posesión de los Particulares) — NEW law published DOF 20 March
// 2025, in force 21 March 2025. Replaced the 2010 LFPDPPP entirely.
// INAI dissolved; Secretaría Anticorrupción y Buen Gobierno is
// successor enforcement authority. Implementing Reglamento for the
// new law not yet published as of mid-2026 — 2011 Reglamento applies
// transitionally where compatible. Adds AI/automated-decision rules,
// simplified privacy notice, blocking-with-retention.
//
// CONFIDENCE: low. Article numbering below maps to the 2010 law and
// will be re-mapped when the new Reglamento and authoritative
// consolidated text become available.
export const MX: CountryData = {
  code: "MX",
  regime: "LFPDPPP",
  defaults: {
    canCollectForMarketing: true,
    optIn: "single",
    checkboxRequired: false,
    bundlingAllowed: true,
    prechecking: "allowed",
    channels: ["email"],
    unsubscribeMechanism: "any",
    softOptInAvailable: true,
    softOptInScope: "any",
    requiresCallerSimilarityAssertion: false,
    impliedConsentTtlMonths: null,
    b2bExemption: {
      regime: "none",
      conditions: [
        "Art. 5 carves out data of individuals acting in business capacity (limited)",
      ],
    },
    consentLanguage: { required: ["es-MX"], mustMatchUserLocale: true },
    dataResidency: { storageRegion: "any", crossBorderTransferMechanism: "scc" },
    consentRecordRetentionMonths: 60,
    sensitiveDataFlags: {
      healthMarketingBlocked: true,
      politicalMarketingBlocked: true,
      childrenBlocked: true,
    },
    preferenceCenter: { granularityRequired: "channel", perEmailUnsubAlsoRequired: true },
    senderIdentity: {
      physicalAddressRequired: true,
      legalEntityNameRequired: true,
      representativeRequired: false,
    },
    reConsentTriggerMonths: null,
    childAgeOfConsent: 18,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "source"],
    basis: {
      statute: "LFPDPPP 2025 (DOF 20 March 2025, in force 21 March 2025) — replaces 2010 LFPDPPP. New Reglamento pending; 2011 Reglamento applies transitionally. INAI dissolved; Secretaría Anticorrupción y Buen Gobierno is enforcement authority.",
      url: "https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf",
      jurisdiction: "MX",
      subRegime: "LFPDPPP-2025",
      dataLastUpdated: "2026-05-03",
      confidence: "low",
      extraterritorialReach: false,
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
  },
}
