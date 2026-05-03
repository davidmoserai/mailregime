import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Chile — Ley N° 19.628 sobre Protección de la Vida Privada (1999, as amended).
// Current law (in force on 2026-05-03) is opt-out based for direct marketing:
// Art. 4 allows processing of personal data from publicly available sources or
// with consent; Art. 3 bis (added by Ley 19.812) requires that direct marketing
// communications offer the data subject a free mechanism to request removal /
// blocking from the database. There is no statutory double-opt-in requirement.
//
// TRANSITION: Ley N° 21.719 (signed 13 Dec 2024, published in Diario Oficial)
// overhauls the regime to a GDPR-style model with express, specific, informed
// consent, creates the Agencia de Protección de Datos Personales, and introduces
// administrative fines. Per its transitory articles, the bulk of substantive
// obligations enter into force 24 months after publication (≈ Dec 2026), with
// the Agencia ramping up earlier. As of 2026-05-03, Ley 19.628 still governs;
// senders preparing for 21.719 should already migrate to express opt-in,
// granular consent, and full proof logs. Sources: bcn.cl / leychile.cl.
export const CL: CountryData = {
  code: "CL",
  regime: "LEY-19628",
  defaults: {
    canCollectForMarketing: true,
    // Ley 19.628 Art. 3 bis: opt-out model for direct marketing. Implied / single
    // opt-in is sufficient today; Ley 21.719 will require express consent once
    // its substantive provisions enter into force (target ≈ Dec 2026).
    optIn: "single",
    checkboxRequired: false,
    bundlingAllowed: true,
    prechecking: "allowed",
    channels: ["email"],
    // Free, accessible removal mechanism mandated by Art. 3 bis.
    unsubscribeMechanism: "one-click",
    // No statutory soft opt-in concept; Ley 19.628 is opt-out for everyone.
    // Ley 21.719 will tighten this — existing-customer marketing will need
    // either express consent or a documented legitimate-interest assessment.
    softOptInAvailable: true,
    softOptInScope: "similar-products",
    requiresCallerSimilarityAssertion: false,
    impliedConsentTtlMonths: null,
    b2bExemption: {
      // Ley 19.628 protects "datos de carácter personal" of natural persons.
      // Legal entities are out of scope; role-based addresses (info@, ventas@)
      // are generally treated as non-personal. Ley 21.719 keeps the same
      // natural-person scope.
      regime: "none",
      conditions: [
        "Ley 19.628 covers personal data of natural persons only; legal-entity contact data is out of scope",
        "Personal contact data of employees at a business address remains in scope",
        "Ley 21.719 (incoming) preserves the natural-person scope",
      ],
    },
    consentLanguage: { required: ["es"], mustMatchUserLocale: false },
    dataResidency: { storageRegion: "any", crossBorderTransferMechanism: "explicit-consent" },
    consentRecordRetentionMonths: 36,
    sensitiveDataFlags: {
      // "Datos sensibles" under Art. 2(g) Ley 19.628 require express written
      // consent; Ley 21.719 expands the catalogue and tightens the regime.
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
    // Ley 21.719 introduces a digital age of consent. Pending final SERNAC /
    // Agencia guidance the working assumption is 14 (aligned with Chilean
    // civil capacity thresholds and the Council for Transparency's draft
    // criteria). Verify once the Agencia publishes its reglamento.
    childAgeOfConsent: 14,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording"],
    basis: {
      statute:
        "Ley N° 19.628 sobre Protección de la Vida Privada (1999, as amended by Ley 19.812 — Art. 3 bis direct marketing opt-out). Ley N° 21.719 (2024) overhauls the regime; substantive provisions enter into force ~24 months after publication.",
      url: "https://www.bcn.cl/leychile/navegar?idNorma=141599",
      jurisdiction: "CL",
      subRegime: "CL-19628",
      dataLastUpdated: "2026-05-03",
      confidence: "medium",
      extraterritorialReach: false,
      lawyerAttestation: null,
    },
    suggestedTemplate: "single-opt-in",
  },
  byContext: {
    "lead-magnet": { optIn: "express", checkboxRequired: true, suggestedTemplate: "single-opt-in" },
    transactional: { proofRequired: [] },
  },
  byRelationship: {
    "existing-customer": {
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
    },
  },
}
