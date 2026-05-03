import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Romania: GDPR (Reg. (EU) 2016/679) + Law 506/2004 on processing of
// personal data and protection of privacy in the electronic communications
// sector (ePrivacy transposition) + Law 190/2018 (national GDPR
// implementing law). Regulator: ANSPDCP (Autoritatea Națională de
// Supraveghere a Prelucrării Datelor cu Caracter Personal).
//
// Law 506/2004 art. 12(1) requires PRIOR EXPRESS CONSENT for unsolicited
// commercial communications by electronic mail (express opt-in). Art. 12(2)
// carves out a soft opt-in for existing customers for similar products /
// services where the customer was given a clear/free opt-out at point of
// collection and in every subsequent message. No general B2B exemption —
// art. 12 applies to natural persons; legal-person mailboxes fall under
// GDPR LIA only when the address is not personal data. Conservative
// default: treat B2B role addresses as gdpr-lia and document.
//
// Law 190/2018 art. 8 sets the child age of consent for information
// society services at 16 (Romania did not lower below GDPR default).
export const RO: CountryData = {
  code: "RO",
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
        "Law 506/2004 art. 12 protects natural persons; legal-person role addresses (info@, sales@) may be processed under GDPR Art. 6(1)(f) legitimate interest with documented LIA",
        "Personal business addresses (firstname.lastname@company.ro) remain personal data — express consent still required",
      ],
    },
    consentLanguage: { required: ["ro"], mustMatchUserLocale: true },
    dataResidency: { storageRegion: "eu", crossBorderTransferMechanism: "scc" },
    consentRecordRetentionMonths: 36,
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
    childAgeOfConsent: 16,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Regulation (EU) 2016/679 (GDPR) + Legea nr. 506/2004 privind prelucrarea datelor cu caracter personal și protecția vieții private în sectorul comunicațiilor electronice, art. 12 + Legea nr. 190/2018 privind măsuri de punere în aplicare a Regulamentului (UE) 2016/679, art. 8",
      url: "https://www.dataprotection.ro/?page=Legea_nr_506_2004",
      jurisdiction: "RO",
      subRegime: "RO-506/2004",
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
      // Law 506/2004 art. 12(2) soft opt-in: similar products/services,
      // collected during sale, clear free opt-out at collection AND in
      // every subsequent message.
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
      optIn: "single",
      suggestedTemplate: "single-opt-in",
    },
  },
}
