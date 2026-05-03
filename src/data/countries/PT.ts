import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Portugal: GDPR (Regulation (EU) 2016/679) + Lei n.º 41/2004 (ePrivacy
// transposition, as amended by Lei n.º 46/2012) + Lei n.º 58/2019 (national
// GDPR-implementing law). Regulator: CNPD (Comissão Nacional de Proteção
// de Dados). Article 13.º of Lei 41/2004 governs unsolicited
// communications ("comunicações não solicitadas"):
//   - Art. 13.º(1): express prior consent required for natural persons
//     for marketing by automated calling, fax, or email (incl. SMS/MMS).
//   - Art. 13.º(2): soft opt-in carve-out — a supplier who obtained an
//     email address "no contexto da venda de um produto ou serviço" may
//     market its OWN similar products/services to that customer, provided
//     a clear opt-out is offered at collection AND in every message.
//   - Art. 13.º(4): legal persons (companies) are opt-out — direct
//     marketing to legal persons is allowed unless they have registered
//     objection (CNPD maintains the "Lista Robinson" / opt-out registry).
// Lei 58/2019 Art. 16.º sets the digital-services age of consent at 13.
export const PT: CountryData = {
  code: "PT",
  regime: "GDPR+ePrivacy",
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
      // Lei 41/2004 Art. 13.º(4): ePrivacy consent rules apply to
      // "assinantes que sejam pessoas singulares" (natural-person
      // subscribers). Legal persons are opt-out — marketable until they
      // object (e.g. via CNPD's opt-out list).
      regime: "publicly-disclosed",
      conditions: [
        "Lei 41/2004 Art. 13.º(4) — legal persons (pessoas colectivas) are opt-out, not opt-in",
        "Recipient must still be offered a free, simple objection mechanism in every message",
        "GDPR still applies if the recipient is an identifiable natural person at the company",
      ],
    },
    consentLanguage: { required: ["pt"], mustMatchUserLocale: false },
    dataResidency: { storageRegion: "eu", crossBorderTransferMechanism: "scc" },
    consentRecordRetentionMonths: 60,
    sensitiveDataFlags: {
      healthMarketingBlocked: true,
      politicalMarketingBlocked: true,
      childrenBlocked: true,
    },
    preferenceCenter: { granularityRequired: "purpose", perEmailUnsubAlsoRequired: true },
    senderIdentity: {
      // Lei 41/2004 Art. 13.º-A: sender must be clearly identifiable and
      // provide a valid address for objection. GDPR Art. 13 transparency
      // adds controller identity + representative (where applicable).
      physicalAddressRequired: true,
      legalEntityNameRequired: true,
      representativeRequired: true,
    },
    reConsentTriggerMonths: 24,
    // Lei 58/2019 Art. 16.º — Portugal exercised the GDPR Art. 8(1)
    // derogation and set the digital age of consent at 13.
    childAgeOfConsent: 13,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Lei n.º 41/2004, de 18 de agosto, art. 13.º (transposição da Diretiva ePrivacy 2002/58/CE, alterada pela Lei n.º 46/2012) + Lei n.º 58/2019, de 8 de agosto (execução do RGPD)",
      url: "https://diariodarepublica.pt/dr/legislacao-consolidada/lei/2004-34528475",
      jurisdiction: "PT",
      subRegime: "PT-41/2004",
      dataLastUpdated: "2026-05-03",
      confidence: "medium",
      extraterritorialReach: true,
      lawyerAttestation: null,
    },
    suggestedTemplate: "double-opt-in",
  },
  byContext: {
    "lead-magnet": { bundlingAllowed: false, prechecking: "forbidden" },
    transactional: { proofRequired: [] },
  },
  byRelationship: {
    "existing-customer": {
      // Lei 41/2004 Art. 13.º(2) soft opt-in: same supplier, own similar
      // products/services, address obtained in context of a sale, clear
      // opt-out at collection and in every message.
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
      optIn: "single",
      suggestedTemplate: "single-opt-in",
    },
  },
}
