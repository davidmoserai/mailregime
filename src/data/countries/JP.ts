import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Specified Electronic Mail Act (特定電子メール法, Act No. 26 of 2002,
// 2008 amendment) + APPI. Express opt-in since 2008. B2B exempt for
// publicly disclosed business addresses. Sender ID + opt-out URL +
// postal address mandatory in every commercial email.
export const JP: CountryData = {
  code: "JP",
  regime: "ACPT",
  defaults: {
    canCollectForMarketing: true,
    optIn: "express",
    checkboxRequired: true,
    bundlingAllowed: false,
    prechecking: "forbidden",
    channels: ["email"],
    unsubscribeMechanism: "link",
    softOptInAvailable: false,
    softOptInScope: "none",
    requiresCallerSimilarityAssertion: false,
    impliedConsentTtlMonths: null,
    b2bExemption: {
      regime: "publicly-disclosed",
      conditions: [
        "Emails to publicly disclosed business email addresses by corporations exempt from ACPT opt-in",
        "still subject to opt-out, false-header bans, sender display rules",
      ],
    },
    consentLanguage: { required: ["ja-JP"], mustMatchUserLocale: false },
    dataResidency: { storageRegion: "any", crossBorderTransferMechanism: "adequacy" },
    consentRecordRetentionMonths: 12,
    sensitiveDataFlags: {
      healthMarketingBlocked: false,
      politicalMarketingBlocked: false,
      childrenBlocked: true,
    },
    preferenceCenter: { granularityRequired: "channel", perEmailUnsubAlsoRequired: true },
    senderIdentity: {
      physicalAddressRequired: true,
      legalEntityNameRequired: true,
      representativeRequired: false,
    },
    reConsentTriggerMonths: null,
    childAgeOfConsent: 16,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording"],
    basis: {
      statute: "Act on Regulation of Transmission of Specified Electronic Mail (特定電子メール法, Act No. 26 of 2002, amended 2008) + Act on the Protection of Personal Information (APPI, Act No. 57 of 2003, amended 2020/2022)",
      url: "https://www.japaneselawtranslation.go.jp/en/laws/view/3767/en",
      jurisdiction: "JP",
      subRegime: "JP-ACPT",
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
      // Address provided in transaction context — soft opt-in OK
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
    },
  },
}
