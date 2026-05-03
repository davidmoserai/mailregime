import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Hungary: GDPR + Act CVIII of 2001 on Electronic Commerce Services
// (Ekertv.) + Act XLVIII of 2008 on Essential Conditions and Certain
// Limitations of Business Communication (Grtv.) + Act CXII of 2011 on
// the Right of Informational Self-Determination and Freedom of
// Information (Infotv.). Direct marketing email requires express prior
// consent under Grtv. §6(1)–(2). NAIH is the supervisory authority and
// has issued repeated decisions confirming opt-in is mandatory and
// pre-checked boxes are invalid (NAIH/2024/* lines). Grtv. §6(3)
// requires every commercial communication to clearly identify the
// sender and be unambiguously recognisable as advertising. Infotv. §6
// fixes the digital age of consent at 16 (Hungary did not lower it from
// the GDPR default).
export const HU: CountryData = {
  code: "HU",
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
      // Grtv. §6(4): direct marketing to a natural person — including a
      // sole trader or named employee at a business address — requires
      // the same prior consent as to any consumer. Generic role
      // addresses (info@, sales@) at a registered legal entity fall
      // outside Grtv.'s "natural person" scope and are commonly handled
      // under GDPR legitimate interest with a clear opt-out.
      regime: "function-address",
      conditions: [
        "Grtv. §6(4): named natural persons (incl. sole traders, employees) require prior express consent regardless of business context",
        "Generic role addresses at legal entities may rely on GDPR Art. 6(1)(f) legitimate interest with documented LIA and clear opt-out",
      ],
    },
    consentLanguage: { required: ["hu"], mustMatchUserLocale: false },
    dataResidency: { storageRegion: "eu", crossBorderTransferMechanism: "scc" },
    consentRecordRetentionMonths: 60,
    sensitiveDataFlags: {
      healthMarketingBlocked: true,
      politicalMarketingBlocked: true,
      childrenBlocked: true,
    },
    preferenceCenter: { granularityRequired: "purpose", perEmailUnsubAlsoRequired: true },
    senderIdentity: {
      // Grtv. §6(3) + Ekertv. §4: every commercial communication must
      // unambiguously identify the natural or legal person on whose
      // behalf it is sent and be clearly recognisable as advertising.
      physicalAddressRequired: true,
      legalEntityNameRequired: true,
      representativeRequired: false,
    },
    reConsentTriggerMonths: 24,
    // Infotv. §6(3) — Hungary kept the GDPR default age of 16 for
    // information-society services; no lowering decree was issued.
    childAgeOfConsent: 16,
    parentalVerificationRequired: false,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Act CVIII of 2001 (Ekertv.) + Act XLVIII of 2008 (Grtv.) §6 + Act CXII of 2011 (Infotv.) §6 + Regulation (EU) 2016/679 (GDPR)",
      url: "https://njt.hu/jogszabaly/2008-48-00-00",
      jurisdiction: "HU",
      subRegime: "HU-GRTV",
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
    // Grtv. has NO general soft opt-in for existing customers — unlike
    // PECR/UK or many EU member states' ePrivacy implementations,
    // Hungary requires fresh express consent under §6(1) for every
    // direct marketing message to a natural person, regardless of
    // prior commercial relationship. Existing customers therefore
    // collapse back to the default express-consent regime.
    "existing-customer": {
      softOptInAvailable: false,
      softOptInScope: "none",
      requiresCallerSimilarityAssertion: false,
    },
  },
}
