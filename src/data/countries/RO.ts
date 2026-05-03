import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Romania: GDPR (Reg. (EU) 2016/679) + Law 506/2004 on processing of
// personal data and protection of privacy in the electronic communications
// sector (ePrivacy transposition) + Law 190/2018 (national GDPR
// implementing law). Regulator: ANSPDCP (Autoritatea Națională de
// Supraveghere a Prelucrării Datelor cu Caracter Personal).
//
// Law 506/2004 art. 12(1) requires PRIOR EXPRESS CONSENT ("consimțământul
// expres") for unsolicited commercial communications by electronic mail
// (express opt-in). Art. 12(2) carves out a soft opt-in for existing
// customers for similar products/services where the customer was given a
// clear/free opt-out at point of collection and in every subsequent
// message. Art. 12(4) explicitly extends paragraphs (1) and (3) to
// LEGAL-PERSON SUBSCRIBERS — i.e. B2B mailboxes are also protected by
// the express-consent rule under Law 506/2004. Any B2B sending must
// therefore satisfy either Art. 12(2) soft opt-in or rely on GDPR
// Art. 6(1)(f) LIA where the address is not personal data (generic role
// addresses) AND ePrivacy art. 12 is treated as not applicable to that
// specific address — a narrow, fact-specific theory. Conservative
// default: treat B2B addresses as requiring express consent and document
// any LIA reliance.
//
// Romania did not legislate a national lower age under GDPR Art. 8(1) in
// Law 190/2018, so the child age of consent for information society
// services defaults to 16 (the GDPR baseline).
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
        "Law 506/2004 art. 12(4) extends the express-consent rule of art. 12(1) to legal-person subscribers — Romania has NO general B2B carve-out from ePrivacy",
        "Personal business addresses (firstname.lastname@company.ro) are personal data — express consent under art. 12(1) is required",
        "Generic role addresses (info@, sales@) may in narrow cases be sent under GDPR Art. 6(1)(f) LIA where the address is not personal data; document the LIA and the art. 12(4) analysis",
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
      statute: "Regulation (EU) 2016/679 (GDPR), Art. 8 (children's consent — Romania did not lower from default 16) + Legea nr. 506/2004 privind prelucrarea datelor cu caracter personal și protecția vieții private în sectorul comunicațiilor electronice, art. 12 (consimțământ prealabil expres; alin. (4) extinde regula la abonați persoane juridice) + Legea nr. 190/2018 privind măsuri de punere în aplicare a Regulamentului (UE) 2016/679",
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
