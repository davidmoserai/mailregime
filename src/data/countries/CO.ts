import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Colombia — Ley Estatutaria 1581 de 2012 (Régimen General de Protección
// de Datos Personales) + Decreto Reglamentario 1377 de 2013. Regulator:
// Superintendencia de Industria y Comercio (SIC), Delegatura para la
// Protección de Datos Personales.
//
// Key points:
// - Ley 1581 Art. 9: prior, express and informed authorization required
//   for any processing of personal data. SIC interprets "express" strictly
//   for marketing — single opt-in (no soft opt-in equivalent).
// - Decreto 1377 Art. 5: authorization may be obtained in writing, orally,
//   or via unequivocal conduct, but the data controller must be able to
//   PROVE consent. Pre-ticked boxes / silence are not valid.
// - Decreto 1377 Art. 12: processing of children's and adolescents' data
//   is generally restricted; requires representative/parental consent and
//   must respect the minor's best interests. Ley 1581 protects under-18s.
// - Law applies to natural persons only (Ley 1581 Art. 2) — pure B2B data
//   about juridical persons is outside scope, but contact data of natural
//   persons (even at a company) IS in scope.
// - Authorization must be in Spanish for Colombian data subjects.
// - Sender must be identifiable; data subject has right to revoke consent
//   and request deletion at any time (Art. 8, Ley 1581).
export const CO: CountryData = {
  code: "CO",
  regime: "Ley 1581 / Decreto 1377",
  defaults: {
    canCollectForMarketing: true,
    // Ley 1581 Art. 9 — prior, express, informed authorization
    optIn: "express",
    checkboxRequired: true,
    bundlingAllowed: false,
    // Decreto 1377 Art. 7 — pre-ticked boxes and silence are not valid consent
    prechecking: "forbidden",
    channels: ["email"],
    unsubscribeMechanism: "one-click",
    // SIC interprets Ley 1581 strictly — no soft opt-in regime exists
    softOptInAvailable: false,
    softOptInScope: "none",
    requiresCallerSimilarityAssertion: false,
    impliedConsentTtlMonths: null,
    b2bExemption: {
      // Ley 1581 Art. 2 — applies to natural persons only; juridical persons
      // are out of scope, but personal contact data of employees IS covered
      regime: "none",
      conditions: [
        "Ley 1581 covers natural persons; data about juridical persons is out of scope",
        "Personal contact data of employees at a company remains in scope",
      ],
    },
    consentLanguage: { required: ["es"], mustMatchUserLocale: true },
    // Decreto 1377 Art. 26 — international transfers require adequacy
    // determination by SIC or data subject's express authorization
    dataResidency: { storageRegion: "any", crossBorderTransferMechanism: "adequacy" },
    consentRecordRetentionMonths: 60,
    sensitiveDataFlags: {
      // Ley 1581 Art. 5–6 — datos sensibles include health, political views,
      // and require explicit, separate authorization
      healthMarketingBlocked: true,
      politicalMarketingBlocked: true,
      childrenBlocked: true,
    },
    preferenceCenter: { granularityRequired: "purpose", perEmailUnsubAlsoRequired: true },
    senderIdentity: {
      physicalAddressRequired: true,
      legalEntityNameRequired: true,
      representativeRequired: true,
    },
    reConsentTriggerMonths: 24,
    // Decreto 1377 Art. 12 — children/adolescents require representative
    // (parental) consent; Ley 1581 protects all minors under 18
    childAgeOfConsent: 18,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Ley Estatutaria 1581 de 2012 + Decreto Reglamentario 1377 de 2013 + Circulares SIC",
      url: "https://www.sic.gov.co/proteccion-de-datos-personales",
      jurisdiction: "CO",
      subRegime: "CO-1581",
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
    // No statutory soft opt-in — existing customer relationship does not
    // remove the express authorization requirement under Ley 1581 Art. 9
    "existing-customer": {
      softOptInAvailable: false,
      softOptInScope: "none",
      requiresCallerSimilarityAssertion: false,
    },
  },
}
