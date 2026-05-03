import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Slovakia: GDPR + Act No. 351/2011 Coll. on Electronic Communications
// (§62 — unsolicited communications) + Act No. 18/2018 Coll. on Personal
// Data Protection. Regulator: Úrad na ochranu osobných údajov SR (ÚOOÚ).
// §62(2) requires express prior consent for marketing email to natural
// persons. §62(3) provides a soft opt-in carve-out for existing customers
// for similar own products/services with a clear opt-out at collection
// and in every message. SK Act 18/2018 §15 sets the digital age of
// consent at 16. §62 applies to "účastník" (subscriber) — covers natural
// persons; legal persons / business addresses fall outside the strict
// §62(2) consent requirement but GDPR LIA still applies for any personal
// data (named recipients).
export const SK: CountryData = {
  code: "SK",
  regime: "GDPR+SK-351/2011",
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
      regime: "function-address",
      conditions: [
        "SK Act 351/2011 §62(2) targets natural-person subscribers; generic legal-person / role addresses (info@, sales@) fall outside the strict consent rule",
        "Named individuals at businesses still require GDPR Art. 6(1)(f) LIA + Art. 14 transparency",
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
      statute: "Regulation (EU) 2016/679 (GDPR) + Zákon č. 351/2011 Z. z. o elektronických komunikáciách §62 + Zákon č. 18/2018 Z. z. o ochrane osobných údajov §15",
      url: "https://dataprotection.gov.sk/",
      jurisdiction: "SK",
      subRegime: "SK-351/2011",
      dataLastUpdated: "2026-05-03",
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
      // SK Act 351/2011 §62(3): a vendor that lawfully obtained an
      // electronic contact in connection with the sale of a product/
      // service may use it for direct marketing of similar own products,
      // provided the customer was given a clear, free opt-out at
      // collection and in every subsequent message.
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
      optIn: "single",
      suggestedTemplate: "single-opt-in",
    },
  },
}
