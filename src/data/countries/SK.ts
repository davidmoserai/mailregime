import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Slovakia: GDPR + Act No. 452/2021 Z. z. on Electronic Communications
// (§116 — Nevyžiadaná komunikácia / Unsolicited communication), in force
// since 1 February 2022 (replaces former Act 351/2011 §62, repealed).
// + Act No. 18/2018 Z. z. on Personal Data Protection. Regulator for
// data protection: Úrad na ochranu osobných údajov SR (ÚOOÚ); regulator
// for §116 enforcement: Úrad pre reguláciu elektronických komunikácií
// a poštových služieb (RÚ / teleoff.gov.sk).
//
// §116(3) requires "predchádzajúci preukázateľný súhlas" (prior provable
// consent) meeting GDPR requirements (§116(5) cross-references the GDPR
// for the standard) for marketing email/SMS/MMS to a subscriber/user.
// §116(15) provides a soft opt-in for own similar products/services
// where the contact was obtained in connection with the sale of goods
// or services, with a free, easy opt-out at collection and in every
// message. §116(15) also exempts marketing addressed to PUBLISHED
// contact data of a subscriber/user that is a sole-trader (fyzická
// osoba podnikateľ) or legal person — i.e. a "publicly-disclosed"
// business-address carve-out, not a generic role-address rule.
// §116(16) limits soft opt-in / business-address use to one year
// after the end of the contractual relationship.
// §116(5) requires the controller to retain the consent record on a
// durable medium for at least 4 years from withdrawal.
// Act 18/2018 §15 sets the digital age of consent at 16.
export const SK: CountryData = {
  code: "SK",
  regime: "GDPR+SK-452/2021",
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
      regime: "publicly-disclosed",
      conditions: [
        "Act 452/2021 §116(15) exempts direct marketing addressed to PUBLISHED contact data of a subscriber/user who is a sole-trader (fyzická osoba podnikateľ) or legal person from the prior-consent rule",
        "Free, easy opt-out must be offered at collection and in every message (§116(15))",
        "§116(16): contact data obtained in connection with sale of goods/services may be used under §116(14)–(15) for max 1 year after end of contractual relationship",
        "Named individuals at businesses still require GDPR Art. 6(1)(f) LIA + Art. 13/14 transparency",
      ],
    },
    consentLanguage: { required: ["sk"], mustMatchUserLocale: false },
    dataResidency: { storageRegion: "any", crossBorderTransferMechanism: "scc" },
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
      representativeRequired: true,
    },
    reConsentTriggerMonths: 24,
    childAgeOfConsent: 16,
    parentalVerificationRequired: false,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Regulation (EU) 2016/679 (GDPR) + Zákon č. 452/2021 Z. z. o elektronických komunikáciách §116 + Zákon č. 18/2018 Z. z. o ochrane osobných údajov §15",
      url: "https://www.slov-lex.sk/ezbierky/pravne-predpisy/SK/ZZ/2021/452/",
      jurisdiction: "SK",
      subRegime: "SK-452/2021",
      dataLastUpdated: "2026-05-04",
      confidence: "medium",
      extraterritorialReach: true,
      lawyerAttestation: null,
    },
    suggestedTemplate: "double-opt-in",
  },
  byContext: {
    "lead-magnet": { bundlingAllowed: false },
    transactional: { proofRequired: [] },
  },
  byRelationship: {
    "existing-customer": {
      // Act 452/2021 §116(15): a vendor that lawfully obtained the
      // recipient's electronic contact in connection with the sale of
      // goods or services may use it for direct marketing of own
      // similar products/services without prior consent, provided the
      // recipient is offered a free, easy opt-out at collection and in
      // every subsequent message. §116(16) caps such use at 1 year
      // after the end of the contractual relationship.
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
      optIn: "single",
      suggestedTemplate: "single-opt-in",
    },
  },
}
