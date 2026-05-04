import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Latvia: GDPR + Informācijas sabiedrības pakalpojumu likums (Law on
// Information Society Services, "ISPL") + Elektronisko sakaru likums
// (Electronic Communications Law). Direct marketing by email requires
// PRIOR CONSENT under ISPL §9 (express opt-in). Soft opt-in carve-out
// exists in ISPL §9(2) for own similar products/services to existing
// customers who were given a clear free-of-charge objection option at
// the moment of address collection and in every message. Regulator:
// Datu valsts inspekcija (DVI). ISPL §9(6) explicitly limits the
// §9(1)-(3) restrictions to natural persons ("attiecas uz komerciālu
// paziņojumu sūtīšanu fiziskajām personām"), so commercial messages
// to legal persons fall outside the ISPL ePrivacy regime — though GDPR
// still applies whenever the recipient address is personal data
// (e.g. firstname.lastname@company.lv). GDPR child age of consent for
// information society services is set at 13 by the Personal Data
// Processing Law (Fizisko personu datu apstrādes likums) §33.
export const LV: CountryData = {
  code: "LV",
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
      // ISPL §9(6): "Šā panta pirmajā, otrajā un trešajā daļā noteiktie
      // aizliegumi un ierobežojumi attiecas uz komerciālu paziņojumu
      // sūtīšanu fiziskajām personām." The ePrivacy prior-consent rule
      // therefore does NOT apply to commercial messages sent to legal
      // persons. GDPR still applies if the address is personal data
      // (e.g. firstname.lastname@company.lv); generic role addresses
      // (info@, sales@) sit fully outside both regimes.
      regime: "function-address",
      conditions: [
        "ISPL §9(6) limits the §9(1)-(3) prior-consent rule to natural persons; legal persons are outside the ePrivacy regime",
        "Personalised business addresses (firstname.lastname@company.lv) remain personal data under GDPR — lawful basis still required",
        "Generic role addresses (info@, sales@) fall outside both ISPL §9 and GDPR personal-data scope",
      ],
    },
    consentLanguage: {
      // Consumer-facing notices generally must be available in Latvian
      // under the State Language Law (Valsts valodas likums); consent
      // wording should be presented in the user's locale.
      required: ["lv"],
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
      representativeRequired: false,
    },
    reConsentTriggerMonths: 24,
    // Personal Data Processing Law §33 sets the child age of consent
    // for information society services at 13 (Latvia exercised the
    // GDPR Art. 8(1) derogation downward from 16).
    childAgeOfConsent: 13,
    parentalVerificationRequired: false,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "GDPR (Reg. 2016/679) + Informācijas sabiedrības pakalpojumu likums §9 + Elektronisko sakaru likums + Fizisko personu datu apstrādes likums §33",
      url: "https://likumi.lv/ta/id/96619-informacijas-sabiedribas-pakalpojumu-likums",
      jurisdiction: "LV",
      subRegime: "LV-EPRIVACY",
      dataLastUpdated: "2026-05-04",
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
      // ISPL §9(2) soft opt-in: own similar goods/services, address
      // obtained in context of a sale, free objection option offered
      // at collection and in every subsequent message.
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
      optIn: "single",
      suggestedTemplate: "single-opt-in",
    },
  },
}
