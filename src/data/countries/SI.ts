import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Slovenia: GDPR + Electronic Communications Act (ZEKom-2, in force
// 10 Nov 2022) + Personal Data Protection Act (ZVOP-2, in force
// 26 Jan 2023). Regulator: Informacijski pooblaščenec (IP RS).
//
// ZEKom-2 Art. 226 transposes ePrivacy Art. 13: unsolicited
// electronic mail for direct marketing requires PRIOR EXPRESS consent
// of the subscriber (natural OR legal person — Slovenia did NOT use
// the Member State option to limit Art. 13(5) to naturals, so the
// consent requirement covers B2B as well). A narrow soft opt-in
// carve-out exists where the address was obtained in the context of
// a sale of own similar products/services and the customer was given
// a free, easy refusal option at the time of collection and in every
// message.
//
// ZVOP-2 Art. 7 sets the child age of consent for information society
// services at 15 (Slovenia exercised the GDPR Art. 8 derogation
// downward from 16).
export const SI: CountryData = {
  code: "SI",
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
      // ZEKom-2 Art. 226 applies the consent rule to "subscribers",
      // and Slovenian transposition does not limit this to natural
      // persons — IP RS guidance treats legal persons as protected
      // too. No general B2B carve-out.
      regime: "none",
      conditions: [
        "ZEKom-2 Art. 226 consent requirement covers natural and legal persons",
        "Generic role addresses (info@, sales@) still need a lawful basis under GDPR; IP RS treats them cautiously",
      ],
    },
    consentLanguage: { required: ["sl"], mustMatchUserLocale: true },
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
    // ZVOP-2 Art. 7 — Slovenia set the GDPR Art. 8 child age at 15.
    childAgeOfConsent: 15,
    parentalVerificationRequired: false,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Zakon o elektronskih komunikacijah (ZEKom-2) Art. 226 + Zakon o varstvu osebnih podatkov (ZVOP-2) + Regulation (EU) 2016/679 (GDPR)",
      url: "https://www.ip-rs.si/varstvo-osebnih-podatkov/obveznosti-upravljavcev/neposredno-trzenje",
      jurisdiction: "SI",
      subRegime: "SI-ZEKom",
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
    // ZEKom-2 Art. 226(3) soft opt-in: own similar products/services,
    // address obtained at point of sale, easy free refusal offered
    // at collection and in every subsequent message.
    "existing-customer": {
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
    },
  },
}
