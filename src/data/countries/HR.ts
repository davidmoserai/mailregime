import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Croatia: GDPR (Regulation 2016/679) + Act on Implementation of GDPR
// (Zakon o provedbi Opće uredbe o zaštiti podataka, NN 42/2018) +
// Electronic Communications Act (Zakon o elektroničkim komunikacijama,
// "ZEK", NN 76/2022, with amendments NN 14/2024) which transposes the
// ePrivacy Directive 2002/58/EC. Regulator: AZOP (Agencija za zaštitu
// osobnih podataka). ZEK Art. 152 governs unsolicited electronic
// communications: prior express consent for natural persons; soft opt-in
// for existing customers re similar products/services with clear opt-out
// in every message. AZOP enforces consent + data protection; HAKOM
// (telecom regulator) co-supervises ZEK. The HR GDPR-impl Act sets the
// child age of consent for information society services at 16
// (Art. 19 of NN 42/2018).
export const HR: CountryData = {
  code: "HR",
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
      // ZEK Art. 152 protections in HR run to "subscribers" who are
      // natural persons. Legal-person addressees (companies) have
      // weaker statutory protection under ZEK but GDPR still applies
      // to any individual recipient (named role mailbox, employee).
      // Treat as GDPR-LIA with documented balancing test.
      regime: "gdpr-lia",
      conditions: [
        "ZEK Art. 152 express-consent rule applies to natural-person subscribers",
        "Legal persons (companies) outside ZEK Art. 152 scope but GDPR applies to any identifiable individual",
        "Generic role addresses (info@, sales@) treated lighter under HAKOM/AZOP practice; document LIA",
      ],
    },
    consentLanguage: {
      // AZOP requires consent and privacy notices to be intelligible to
      // the data subject. For HR-resident subjects, Croatian is expected
      // for B2C marketing; bilingual HR + EN acceptable.
      required: ["hr"],
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
    // HR Act on Implementation of GDPR Art. 19: child age of consent
    // for information society services set at 16 (NOT lowered to 13).
    childAgeOfConsent: 16,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Regulation (EU) 2016/679 (GDPR) + Zakon o provedbi Opće uredbe o zaštiti podataka (NN 42/2018) + Zakon o elektroničkim komunikacijama (NN 76/2022, NN 14/2024) Art. 152",
      url: "https://azop.hr/",
      jurisdiction: "HR",
      subRegime: "HR-ZEK",
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
      // ZEK Art. 152(2) soft opt-in: contact details obtained in the
      // context of a sale of a product/service may be used to market
      // similar own products/services, provided clear and free opt-out
      // is offered at collection and in every message.
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
    },
  },
}
