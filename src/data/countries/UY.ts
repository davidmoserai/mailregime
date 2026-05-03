import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Uruguay: Ley N° 18.331 (Protección de Datos Personales, 2008) +
// Decreto 414/009 (reglamentación) + Ley N° 19.670 Art. 37
// (extraterritorial scope, 2018). Regulator: URCDP (Unidad Reguladora
// y de Control de Datos Personales). EU adequacy decision since 2012.
//
// Art. 9 of Ley 18.331 requires informed, free, and EXPRESS consent
// for processing — for direct marketing this means a single express
// opt-in (not double). Art. 21 grants data subjects the right to
// opt out of marketing processing at any time; there is no formal
// "soft opt-in" carve-out for existing customers under Uruguayan law.
// The law applies to natural persons only (legal entities not covered
// → effective B2B leniency for company-to-company contact data, but
// any natural-person contact data remains in scope).
export const UY: CountryData = {
  code: "UY",
  regime: "Ley 18.331",
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
      // Ley 18.331 Art. 2 — protects natural persons only.
      // Legal-entity contact data (generic role addresses) falls outside
      // the law's scope, but any identifiable natural person remains covered.
      regime: "none",
      conditions: [
        "Ley 18.331 Art. 2 — applies to natural persons only; legal entities outside scope",
        "Any identifiable natural-person contact (named employee email) remains fully in scope",
      ],
    },
    consentLanguage: { required: ["es"], mustMatchUserLocale: true },
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
    // Ley 18.331 + Código Civil treat under-18 as minors; URCDP guidance
    // generally recognizes ~13–14 as the threshold for autonomous consent
    // for everyday digital services, with parental involvement otherwise.
    childAgeOfConsent: 13,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Ley N° 18.331 (Protección de Datos Personales, 2008) + Decreto 414/009 + Ley N° 19.670 Art. 37 (extraterritorial scope)",
      url: "https://www.gub.uy/unidad-reguladora-control-datos-personales",
      jurisdiction: "UY",
      subRegime: "UY-18331",
      dataLastUpdated: "2026-05-03",
      confidence: "medium",
      // Ley 19.670 Art. 37 extends Ley 18.331 to controllers/processors
      // outside Uruguay when processing targets data subjects in Uruguay
      // or uses means located in Uruguay.
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
    // Ley 18.331 Art. 21 — data subject may opt out at any time.
    // No formal soft opt-in carve-out exists, so existing-customer
    // status does not relax the express-consent requirement.
    "existing-customer": {
      softOptInAvailable: false,
      softOptInScope: "none",
      requiresCallerSimilarityAssertion: false,
    },
  },
}
