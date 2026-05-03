import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Argentina — Ley 25.326 de Protección de los Datos Personales (2000)
// enforced by AAIP (Agencia de Acceso a la Información Pública).
// Argentina has held EU adequacy since 2003 (Decision 2003/490/EC).
//
// Marketing-specific rule: Art. 27 Ley 25.326 permits processing of
// personal data for direct marketing without prior consent IF the data
// is from publicly accessible sources. Effectively a "single opt-in /
// opt-out" regime: collection from public sources is allowed, but the
// data subject must be able to opt out at any time and every
// communication MUST disclose this right (Art. 27(3)).
// See also Decreto 1558/2001 (reglamentación) and AAIP Resoluciones
// (e.g. Res. 4/2019 on consent, Res. 47/2018 on security measures).
//
// B2B: Ley 25.326 protects "personas físicas" (natural persons) and,
// under Art. 1, also extends some protections to legal persons —
// however AAIP enforcement of marketing complaints concentrates on
// natural persons. Treat legal-person marketing as effectively exempt
// from consent but still subject to opt-out at every contact.
//
// Children: Civil and Commercial Code (CCyC) defines minors as under
// 18; AAIP guidance ("Guía de buenas prácticas") suggests parental
// consent for children under 13 by analogy with international norms.
//
// Pending reform: A new Personal Data Protection bill (Proyecto de Ley
// de Protección de Datos Personales, modeled on the GDPR) was
// reintroduced by the Executive in 2023 and remains under
// parliamentary review as of 2026-05-03. It would replace Ley 25.326
// and tighten consent rules — verify current status before relying on
// the old regime for new launches.
export const AR: CountryData = {
  code: "AR",
  regime: "LEY-25326",
  defaults: {
    canCollectForMarketing: true,
    // Art. 27 — public-source data may be used; data subject opt-out
    // must be honored. No prior express consent required for
    // marketing if data is from publicly accessible sources.
    optIn: "single",
    checkboxRequired: false,
    bundlingAllowed: false,
    prechecking: "forbidden",
    channels: ["email"],
    unsubscribeMechanism: "one-click",
    // Art. 27(3) — opt-out is the primary mechanism; no formal
    // soft-opt-in carve-out comparable to EU ePrivacy.
    softOptInAvailable: false,
    softOptInScope: "none",
    requiresCallerSimilarityAssertion: false,
    impliedConsentTtlMonths: null,
    b2bExemption: {
      // Ley 25.326 covers natural persons primarily; legal persons
      // are not protected for marketing purposes in practice.
      regime: "can-spam-default",
      conditions: [
        "Ley 25.326 protects natural persons; legal-person contacts (info@company) treated as outside scope",
        "Opt-out at every contact still recommended as best practice",
      ],
    },
    consentLanguage: { required: ["es"], mustMatchUserLocale: false },
    // Argentina holds EU adequacy (Dec. 2003/490/EC); cross-border
    // transfers from Argentina governed by Art. 12 Ley 25.326 +
    // AAIP Disposición 60-E/2016.
    dataResidency: { storageRegion: "any", crossBorderTransferMechanism: "adequacy" },
    consentRecordRetentionMonths: 60,
    sensitiveDataFlags: {
      // Art. 7 — datos sensibles (health, political opinions, etc.)
      // require express written consent and are barred from
      // direct-marketing public-source exemption.
      healthMarketingBlocked: true,
      politicalMarketingBlocked: true,
      childrenBlocked: true,
    },
    preferenceCenter: { granularityRequired: "purpose", perEmailUnsubAlsoRequired: true },
    senderIdentity: {
      // Art. 27(3) — every marketing contact must identify the
      // sender (responsable) and disclose the right to opt out
      // ("retiro o bloqueo total o parcial").
      physicalAddressRequired: true,
      legalEntityNameRequired: true,
      representativeRequired: false,
    },
    reConsentTriggerMonths: 24,
    // CCyC: minors are under 18; AAIP guidance suggests parental
    // consent for under-13s. Use 13 as the practical floor for
    // independent consent in marketing contexts.
    childAgeOfConsent: 13,
    parentalVerificationRequired: false,
    proofRequired: ["timestamp", "source", "wording"],
    basis: {
      statute: "Ley 25.326 de Protección de los Datos Personales (2000) + Decreto 1558/2001 + AAIP Resoluciones (Res. 4/2019, Res. 47/2018)",
      url: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/60000-64999/64790/norma.htm",
      jurisdiction: "AR",
      subRegime: "AR-25326",
      dataLastUpdated: "2026-05-03",
      confidence: "medium",
      extraterritorialReach: false,
      lawyerAttestation: null,
    },
    suggestedTemplate: "single-opt-in",
  },
  byContext: {
    "lead-magnet": { canCollectForMarketing: true, optIn: "single", suggestedTemplate: "single-opt-in" },
    transactional: { proofRequired: [] },
  },
  byRelationship: {
    "existing-customer": {
      // No formal soft-opt-in regime; opt-out remains the mechanism.
      softOptInAvailable: false,
      softOptInScope: "none",
      requiresCallerSimilarityAssertion: false,
    },
  },
}
