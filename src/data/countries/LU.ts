import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Luxembourg: GDPR (Regulation (EU) 2016/679) + Loi du 30 mai 2005
// concernant la protection de la vie privée dans le secteur des
// communications électroniques (LU ePrivacy transposition) +
// Loi du 1er août 2018 portant organisation de la Commission nationale
// pour la protection des données (CNPD).
//
// Article 11 of the 30 May 2005 law: unsolicited electronic
// communications for direct marketing purposes require PRIOR
// CONSENT of the recipient (express opt-in). Soft opt-in carve-out
// exists for existing customers when the address was obtained in
// the context of a sale, marketing concerns similar products/services
// of the same controller, and the recipient was given a clear and
// distinct opportunity to object (free of charge) at collection and
// in every subsequent message.
//
// Luxembourg is officially trilingual (French, German, Luxembourgish);
// CNPD does not mandate a single specific language for consent wording,
// but consent must be intelligible to the data subject (GDPR Art. 7(2)
// — "clear and plain language"). In practice marketers default to
// French; German and Luxembourgish are equally acceptable.
//
// Child age of consent for information society services: 16 (Luxembourg
// did not lower the GDPR Art. 8 default; confirmed via CNPD guidance
// on minors).
export const LU: CountryData = {
  code: "LU",
  regime: "GDPR",
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
        "Loi du 30 mai 2005 Art. 11 applies to natural persons; B2B to legal-person addresses (info@, contact@) may rely on GDPR Art. 6(1)(f) legitimate interest with a documented LIA",
        "Personal corporate addresses (firstname.lastname@company.lu) are still personal data — express consent or LIA with strict balancing required",
      ],
    },
    consentLanguage: {
      // CNPD does not impose a single mandated language; FR/DE/LB are
      // all official. GDPR Art. 7(2) requires the wording be intelligible
      // to the subject — match the user's locale where possible.
      required: [],
      mustMatchUserLocale: true,
    },
    dataResidency: { storageRegion: "eu", crossBorderTransferMechanism: "scc" },
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
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Règlement (UE) 2016/679 (RGPD) + Loi du 30 mai 2005 concernant la protection de la vie privée dans le secteur des communications électroniques, Art. 11 + Loi du 1er août 2018 portant organisation de la CNPD",
      url: "https://cnpd.public.lu/fr/professionnels/obligations/prospection.html",
      jurisdiction: "LU",
      subRegime: "LU-EPRIVACY",
      dataLastUpdated: "2026-05-03",
      confidence: "medium",
      extraterritorialReach: true,
      lawyerAttestation: null,
    },
    suggestedTemplate: "double-opt-in",
  },
  byContext: {
    "lead-magnet": { bundlingAllowed: false, checkboxRequired: true },
    transactional: { proofRequired: [] },
  },
  byRelationship: {
    "existing-customer": {
      // Soft opt-in carve-out under Art. 11(2) of the 30 May 2005 law:
      // address obtained in the context of a sale, similar products/
      // services of same controller, clear opt-out at collection and
      // in every message.
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
      optIn: "single",
      checkboxRequired: false,
    },
  },
}
