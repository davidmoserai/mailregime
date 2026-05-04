import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Peru — Ley N° 29733 (Ley de Protección de Datos Personales, 2011)
// + Reglamento (Decreto Supremo N° 016-2024-JUS, in force 31 March 2025;
// replaces the prior DS 003-2013-JUS).
// Regulator: Autoridad Nacional de Protección de Datos Personales (ANPD),
// under the Ministerio de Justicia y Derechos Humanos (MINJUSDH).
//
// Marketing consent basis:
// - Ley 29733 Art. 13(5): consent must be prior, free, express, unequivocal
//   and informed. "Express" — single opt-in is the statutory floor (no DOI mandate).
// - Ley 29733 Art. 18: information duties (purpose, recipients, rights, transfers)
//   must be satisfied at the moment consent is collected.
// - Art. 14 lists narrow exceptions to consent (publicly available data,
//   contractual necessity, etc.) — these do NOT create a soft opt-in for
//   cold marketing; scope is "none" for our purposes.
// - Reglamento DS 016-2024-JUS Arts. 22 and 25: minors under 14 require
//   parental consent; minors aged 14–18 may consent themselves if the
//   information is presented in language comprehensible to them. We use 14
//   as childAgeOfConsent and require parental verification for under-14.
// - Right to object (derecho de oposición / cancelación) — Ley 29733 Arts. 22–23
//   — every marketing email must offer a working opt-out.
// - Sender identity & information duty (Art. 18) require identifying the
//   data controller (legal name + contact) at collection and in messages.
// - Ley 29733 Art. 5 + Reglamento Art. 9: consent and information must be
//   given in a language the data subject understands — in practice Spanish.
export const PE: CountryData = {
  code: "PE",
  regime: "LPDP",
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
        "Ley 29733 protects personal data of natural persons regardless of B2B/B2C context; corporate role addresses tied to an identifiable person are still personal data",
      ],
    },
    consentLanguage: { required: ["es"], mustMatchUserLocale: true },
    dataResidency: { storageRegion: "any", crossBorderTransferMechanism: "explicit-consent" },
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
    // Reglamento DS 016-2024-JUS Arts. 22 and 25: <14 needs parental consent;
    // 14–18 may consent themselves if the information is comprehensible.
    childAgeOfConsent: 14,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Ley N° 29733 (Ley de Protección de Datos Personales) + Reglamento aprobado por Decreto Supremo N° 016-2024-JUS (vigente desde el 31 de marzo de 2025), plus ANPD resoluciones",
      url: "https://www.gob.pe/anpd",
      jurisdiction: "PE",
      subRegime: "PE-29733",
      dataLastUpdated: "2026-05-04",
      confidence: "medium",
      extraterritorialReach: true,
      lawyerAttestation: null,
    },
    suggestedTemplate: "single-opt-in",
  },
  byContext: {
    "lead-magnet": { canCollectForMarketing: false, optIn: "blocked", suggestedTemplate: "blocked" },
    transactional: { proofRequired: [] },
  },
  byRelationship: {
    "existing-customer": {
      // Ley 29733 has no statutory soft opt-in; existing customer relationship
      // does not waive Art. 13(5) express consent for marketing.
      softOptInAvailable: false,
      softOptInScope: "none",
      requiresCallerSimilarityAssertion: false,
    },
  },
}
