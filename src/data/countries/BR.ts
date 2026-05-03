import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// LGPD (Lei nº 13.709/2018) + Marco Civil + CDC + ANPD Resoluções
// (esp. Res. CD/ANPD nº 4/2023 dosimetria + Res. nº 15/2024
// international transfers). Controller bears burden of proving
// consent (Art. 8 §2). LGPD Art. 14 §1: children under 12
// ("criança") require specific, prominent parental consent;
// 12-17 ("adolescente") follow best-interest analysis.
export const BR: CountryData = {
  code: "BR",
  regime: "LGPD",
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
      regime: "gdpr-lia",
      conditions: [
        "LGPD covers all natural-person data including employee personal emails",
        "corporate-only CNPJ data outside scope",
      ],
    },
    // Portuguese not statutorily required by LGPD Art. 9; CDC Art. 31
    // (consumer law) requires clear/comprehensible information for
    // Brazilian consumers, which in practice means Portuguese.
    consentLanguage: { required: ["pt-BR"], mustMatchUserLocale: true },
    dataResidency: { storageRegion: "any", crossBorderTransferMechanism: "scc" },
    consentRecordRetentionMonths: 60,
    sensitiveDataFlags: {
      healthMarketingBlocked: true,
      politicalMarketingBlocked: true,
      childrenBlocked: true,
    },
    preferenceCenter: { granularityRequired: "purpose", perEmailUnsubAlsoRequired: true },
    senderIdentity: {
      physicalAddressRequired: false,
      legalEntityNameRequired: true,
      representativeRequired: true,
    },
    reConsentTriggerMonths: 24,
    // 12 = "criança" (parental consent), 12-17 = "adolescente" (best interest)
    childAgeOfConsent: 12,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Lei nº 13.709/2018 (LGPD) Arts. 7-8, 10, 14, 23, 33, 52 + ANPD Resolução CD/ANPD nº 4/2023 (dosimetria) + Resolução nº 15/2024 (international transfers / SCCs)",
      url: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm",
      jurisdiction: "BR",
      subRegime: "LGPD",
      dataLastUpdated: "2026-05-03",
      confidence: "low",
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
    "existing-customer": {
      // LGPD Art. 10 legitimate interest may justify marketing to
      // existing customers with LIA + opt-out
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
    },
  },
}
