import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Estonia: GDPR + Electronic Communications Act (Elektroonilise side
// seadus, ESS) §103¹ which transposes ePrivacy Directive 2002/58/EC
// Art. 13 + Personal Data Protection Act (Isikuandmete kaitse seadus,
// IKS). Regulator: Andmekaitse Inspektsioon (AKI). Per AKI guidance
// "Elektrooniliste kontaktandmete kasutamine otseturustuses" (updated
// 2015): prior consent is required for direct marketing to natural
// persons ("Füüsilise isiku elektrooniliste kontaktandmete kasutamine
// otseturustuseks on lubatud üksnes tema eelneval nõusolekul"); for
// legal persons no prior consent is required, only an opt-out
// possibility ("Kui otseturustuseks kasutatakse juriidilise isiku
// kontaktandmeid, siis eelneva nõusoleku omamise kohustust ei ole,
// kuid talle peab andma võimaluse keelata oma kontaktandmete edasine
// selline kasutamine"). Soft opt-in carve-out (ESS §103¹ lg 3) covers
// the same trader's "samasugused tooted või teenused" (similar goods
// or services) when contact data was obtained in the course of a sale.
// IKS §8: information society services consent age = 13.
export const EE: CountryData = {
  code: "EE",
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
      regime: "publicly-disclosed",
      conditions: [
        "Per AKI guidance: prior consent NOT required when sending to a legal person's contact data; opt-out mechanism still required in every message",
        "Generic role addresses (info@, ettevote@) treated as legal-person contacts needing no prior consent (AKI guidance §5)",
        "Personal-name addresses (firstname.lastname@company.ee) may still be natural-person data depending on the recipient's role and the relevance of the offer",
        "Legal-person addresses listed in the Äriregister (commercial register) are treated as legal-person contacts",
      ],
    },
    consentLanguage: { required: [], mustMatchUserLocale: true },
    dataResidency: { storageRegion: "eu", crossBorderTransferMechanism: "adequacy" },
    consentRecordRetentionMonths: 36,
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
    childAgeOfConsent: 13,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Elektroonilise side seadus (ESS) §103¹ + Isikuandmete kaitse seadus (IKS) §8 + Regulation (EU) 2016/679 (GDPR)",
      url: "https://www.riigiteataja.ee/akt/122052018003",
      jurisdiction: "EE",
      subRegime: "EE-ESS",
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
    "existing-customer": {
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
      optIn: "single",
      suggestedTemplate: "single-opt-in",
    },
  },
}
