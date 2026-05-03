import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Russian Federation marketing email regime:
//   - Federal Law No. 152-FZ "On Personal Data" (Art. 9 — written/electronic
//     consent for processing personal data; consent must be specific,
//     informed, and conscious; minors require legal-representative consent).
//   - Federal Law No. 38-FZ "On Advertising" (Art. 18 — distribution of
//     advertising via telecommunications networks (incl. email) is allowed
//     only with the PRIOR EXPRESS CONSENT of the subscriber/addressee.
//     Burden of proof of consent is on the advertiser. Advertiser must
//     immediately stop distribution upon recipient request.).
//   - Federal Law No. 242-FZ — data localization: personal data of Russian
//     citizens must be recorded, systematized, accumulated, stored, updated
//     and retrieved using databases located on the territory of the Russian
//     Federation.
// Regulator: Roskomnadzor (rkn.gov.ru). 38-FZ enforced by FAS Russia.
// 38-FZ applies to all advertising regardless of recipient — no B2B carve-out.
// "Express" consent here is strong: written/electronic consent under 152-FZ
// Art. 9 plus prior advertising-specific consent under 38-FZ Art. 18 —
// in practice this approaches a double-opt-in pattern. Use a clear,
// unbundled, unchecked checkbox with explicit advertising language.
export const RU: CountryData = {
  code: "RU",
  regime: "RU-152FZ",
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
        "38-FZ Art. 18 applies to all advertising via telecommunications networks regardless of recipient type — legal persons and sole traders are also covered",
      ],
    },
    // 152-FZ Art. 9 consent must be in a form accessible to the data subject;
    // in practice Russian-language consent text is required for Russian users.
    consentLanguage: { required: ["ru"], mustMatchUserLocale: true },
    // 242-FZ data localization: Russian citizens' personal data must be
    // stored on databases located within the Russian Federation.
    dataResidency: { storageRegion: "local", crossBorderTransferMechanism: "explicit-consent" },
    consentRecordRetentionMonths: 60,
    sensitiveDataFlags: {
      healthMarketingBlocked: true,
      politicalMarketingBlocked: true,
      childrenBlocked: true,
    },
    preferenceCenter: { granularityRequired: "purpose", perEmailUnsubAlsoRequired: true },
    // 38-FZ Art. 18 requires advertiser to be identifiable and to immediately
    // cease distribution upon recipient demand — sender identity is mandatory.
    senderIdentity: {
      physicalAddressRequired: true,
      legalEntityNameRequired: true,
      representativeRequired: true,
    },
    reConsentTriggerMonths: 24,
    // 152-FZ Art. 9: minors' personal data processing requires consent of
    // legal representative. Russian Civil Code distinguishes under-14
    // (full legal-rep consent) and 14-18 (limited capacity); for marketing
    // purposes treat 18 as the safe threshold and require parental verification.
    childAgeOfConsent: 18,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Federal Law No. 152-FZ 'On Personal Data' (Art. 9) + Federal Law No. 38-FZ 'On Advertising' (Art. 18) + Federal Law No. 242-FZ (data localization amendments to 152-FZ)",
      url: "http://pravo.gov.ru/proxy/ips/?docbody=&nd=102108261",
      jurisdiction: "RU",
      subRegime: "RU-152FZ",
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
    // No soft opt-in under 38-FZ — even existing-customer relationships
    // require prior express advertising consent.
    "existing-customer": {
      softOptInAvailable: false,
      softOptInScope: "none",
      requiresCallerSimilarityAssertion: false,
    },
  },
}
