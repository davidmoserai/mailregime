import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Portugal: GDPR (Regulation (EU) 2016/679) + Lei n.º 41/2004 (ePrivacy
// transposition, as amended by Lei n.º 46/2012, which inserted articles
// 13.º-A through 13.º-D) + Lei n.º 58/2019 (national GDPR-implementing
// law). Regulator: CNPD (Comissão Nacional de Proteção de Dados).
// Article 13.º-A of Lei 41/2004 governs unsolicited communications
// ("comunicações não solicitadas") for direct marketing:
//   - Art. 13.º-A(1): "Está sujeito a consentimento prévio expresso do
//     assinante que seja pessoa singular, ou do utilizador, o envio de
//     comunicações não solicitadas para fins de marketing direto" via
//     automated calling, fax, or email (incl. SMS/EMS/MMS).
//   - Art. 13.º-A(2): legal persons (pessoas coletivas) are opt-out —
//     direct marketing is allowed until they object and register on the
//     national list maintained by Direção-Geral do Consumidor (DGC) per
//     Art. 13.º-B(2). (The legal-persons opt-out list is held by DGC,
//     NOT CNPD.)
//   - Art. 13.º-A(3): soft opt-in carve-out — a supplier who obtained an
//     email address "no contexto da venda de um produto ou serviço" may
//     market its OWN analogous products/services to that customer,
//     provided a clear, free, easy opt-out is offered (a) at collection
//     AND (b) in every subsequent message.
//   - Art. 13.º-A(4): no concealment of sender identity; valid contact
//     for opt-out must be provided in every message.
// Lei 58/2019 Art. 16.º sets the digital-services age of consent at 13
// (Portugal exercised the GDPR Art. 8(1) derogation).
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
      // Lei 41/2004 Art. 13.º-A(2): ePrivacy express-consent rule applies
      // only to "assinantes que sejam pessoas singulares" (natural-person
      // subscribers). Legal persons (pessoas coletivas) are opt-out —
      // marketable "até que os assinantes recusem futuras comunicações e
      // se inscrevam na lista prevista no n.º 2 do artigo 13.º-B".
      // That list of objecting legal persons is maintained by the
      // Direção-Geral do Consumidor (DGC), not by CNPD.
      regime: "publicly-disclosed",
      conditions: [
        "Lei 41/2004 Art. 13.º-A(2) — legal persons (pessoas coletivas) are opt-out, not opt-in",
        "Senders must consult the national opt-out list of legal persons maintained by Direção-Geral do Consumidor (DGC) per Art. 13.º-B(2)",
        "Each message must offer a free, simple objection mechanism and must not conceal sender identity (Art. 13.º-A(4))",
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
      // Lei 41/2004 Art. 13.º-A(4): prohibits concealing/disguising the
      // identity of the person on whose behalf the communication is sent
      // and requires "indicação de um meio de contacto válido para o qual
      // o destinatário possa enviar um pedido para pôr termo a essas
      // comunicações". GDPR Art. 13 transparency adds controller
      // identity + representative (where applicable).
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
      statute: "Lei n.º 41/2004, de 18 de agosto, arts. 13.º-A e 13.º-B (inseridos pela Lei n.º 46/2012, de 29 de agosto, transpondo a Diretiva 2009/136/CE que altera a Diretiva ePrivacy 2002/58/CE) + Lei n.º 58/2019, de 8 de agosto, art. 16.º (execução do RGPD)",
      url: "https://diariodarepublica.pt/dr/legislacao-consolidada/lei/2004-34528475",
      jurisdiction: "PT",
      subRegime: "PT-41/2004",
      dataLastUpdated: "2026-05-04",
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
      // Lei 41/2004 Art. 13.º-A(3) soft opt-in: same supplier, own
      // analogous ("análogos") products/services, address obtained "no
      // contexto da venda de um produto ou serviço", clear opt-out (a)
      // at collection and (b) in every subsequent message.
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
      optIn: "single",
      suggestedTemplate: "single-opt-in",
    },
  },
}
