import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Czech Republic: GDPR + Act No. 480/2004 Coll. on Certain Information
// Society Services (transposes ePrivacy Art. 13) + Act No. 110/2019 Coll.
// on Personal Data Processing. Regulator: Úřad pro ochranu osobních
// údajů (ÚOOÚ). 480/2004 §7 requires prior express consent for commercial
// communications, with a narrow soft opt-in for existing customers
// (similar products/services + clear opt-out at collection and in every
// message). 480/2004 §6 requires clear sender identification and a valid
// return/unsubscribe address. Czech ePrivacy regime applies to BOTH
// natural persons AND legal persons (entrepreneurs/sole traders) — there
// is no general B2B exemption; addresses of legal entities are still
// covered when the recipient is identifiable. Child age of consent under
// 110/2019 §7 is 15.
// Sources:
//   https://www.zakonyprolidi.cz/cs/2004-480 (Act 480/2004)
//   https://www.zakonyprolidi.cz/cs/2019-110 (Act 110/2019)
//   https://www.uoou.gov.cz/ (ÚOOÚ regulator)
export const CZ: CountryData = {
  code: "CZ",
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
      regime: "none",
      conditions: [
        "Act 480/2004 §2(b) defines electronic contact regardless of natural/legal person — legal entities are NOT exempt",
        "ÚOOÚ guidance: B2B addresses identifying a person (jan.novak@firma.cz) still require consent or soft opt-in",
        "Generic role addresses (info@, sales@) may fall outside personal-data scope but 480/2004 still applies to commercial communications",
      ],
    },
    consentLanguage: { required: ["cs"], mustMatchUserLocale: true },
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
    childAgeOfConsent: 15,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Regulation (EU) 2016/679 (GDPR) + Act No. 480/2004 Coll. on Certain Information Society Services §7 (prior consent for commercial communications) and §6 (sender identification) + Act No. 110/2019 Coll. on Personal Data Processing §7 (child age of consent: 15)",
      url: "https://www.zakonyprolidi.cz/cs/2004-480",
      jurisdiction: "CZ",
      subRegime: "CZ-480",
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
      // Act 480/2004 §7(3) soft opt-in: address obtained in connection with
      // sale of product/service, similar products only, clear opt-out at
      // each message and at collection.
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
      optIn: "single",
      suggestedTemplate: "single-opt-in",
    },
  },
}
