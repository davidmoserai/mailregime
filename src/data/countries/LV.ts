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
// Datu valsts inspekcija (DVI). ISPL §9 applies regardless of whether
// the recipient is a natural or legal person — there is NO general B2B
// carve-out under Latvian ePrivacy. GDPR child age of consent for
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
      // ISPL §9 covers commercial communications to "addressee" without
      // distinguishing natural vs. legal persons. DVI guidance treats
      // emails to identifiable individuals at a company (firstname.lastname@)
      // as personal data under GDPR; only generic role addresses
      // (info@, sales@) sit in a lighter zone.
      regime: "function-address",
      conditions: [
        "ISPL §9 requires prior consent for commercial communications regardless of recipient type",
        "Personalised business addresses (firstname.lastname@company.lv) are personal data — full GDPR + ePrivacy applies",
        "Generic role addresses (info@, sales@) face lighter scrutiny but are not formally exempt",
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
