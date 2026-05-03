import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Bulgaria: GDPR + ePrivacy (Dir. 2002/58/EC) transposed via the
// Electronic Commerce Act (ZET) Art. 6 (unsolicited commercial
// communications) and the Personal Data Protection Act (ZZLD).
// Regulator: KZLD (cpdp.bg). Express prior consent required for
// e-marketing to consumers (ZET чл. 6 ал. 4: "Забранява се
// изпращането на непоискани търговски съобщения на потребители без
// предварителното им съгласие"). Bulgaria did NOT transpose the
// ePrivacy Art. 13(2) soft opt-in carve-out into ZET — there is no
// statutory existing-customer / similar-products exception. For legal
// persons, ZET чл. 6 ал. 2-3 establishes an opt-out register
// maintained by the Commission for Consumer Protection (КЗП).
// Source: https://exlege.bg/normi/zet (fetched 2026-05-03).
export const BG: CountryData = {
  code: "BG",
  regime: "GDPR+ePrivacy",
  defaults: {
    canCollectForMarketing: true,
    // ZET чл. 6 ал. 4 (verbatim, fetched 2026-05-03):
    // "Забранява се изпращането на непоискани търговски съобщения на
    //  потребители без предварителното им съгласие."
    // (Sending unsolicited commercial messages to consumers without
    //  their prior consent is prohibited.)
    // https://exlege.bg/normi/zet
    optIn: "express",
    checkboxRequired: true,
    // GDPR Art. 7(2) + EDPB guidance — consent must be unbundled.
    bundlingAllowed: false,
    // CJEU Planet49; GDPR Recital 32 — pre-ticked boxes invalid.
    prechecking: "forbidden",
    channels: ["email"],
    unsubscribeMechanism: "one-click",
    softOptInAvailable: false,
    softOptInScope: "none",
    requiresCallerSimilarityAssertion: false,
    impliedConsentTtlMonths: null,
    b2bExemption: {
      // ZET чл. 6 ал. 2 (verbatim, fetched 2026-05-03):
      // "Комисията за защита на потребителите води електронен регистър
      //  на електронните адреси на юридическите лица, които не желаят
      //  да получават непоискани търговски съобщения, по ред, определен
      //  с наредба на Министерския съвет."
      // ал. 3: "Забранява се изпращането на непоискани търговски
      //  съобщения на електронни адреси, вписани в регистъра по ал. 2."
      // → Statutory opt-out register at КЗП (Commission for Consumer
      //   Protection) for legal persons. Employee personal work
      //   mailboxes remain personal data under GDPR.
      // https://exlege.bg/normi/zet
      regime: "publicly-disclosed",
      conditions: [
        "Legal persons may register email addresses with КЗП to refuse unsolicited commercial communications (ZET чл. 6 ал. 2)",
        "Sending to addresses on the КЗП register is prohibited (ZET чл. 6 ал. 3)",
        "Employee personal work addresses still require a GDPR basis",
      ],
    },
    // No primary-source quote located for a Bulgarian-language
    // requirement specific to e-marketing consent; GDPR Art. 12
    // (intelligible language) applies. Marked best-effort.
    consentLanguage: { required: ["bg"], mustMatchUserLocale: true },
    dataResidency: { storageRegion: "eu", crossBorderTransferMechanism: "scc" },
    consentRecordRetentionMonths: 36,
    sensitiveDataFlags: {
      healthMarketingBlocked: true,
      politicalMarketingBlocked: true,
      childrenBlocked: true,
    },
    preferenceCenter: { granularityRequired: "purpose", perEmailUnsubAlsoRequired: true },
    // ZET Art. 4 (information society services) — provider identity,
    // registered seat / address, contact details must be made available.
    senderIdentity: {
      physicalAddressRequired: true,
      legalEntityNameRequired: true,
      representativeRequired: false,
    },
    reConsentTriggerMonths: 24,
    // ZZLD чл. 25в (verbatim, fetched 2026-05-03):
    // "Обработването на данни на субект на данни - лице, ненавършило
    //  14 години, въз основа на съгласие по смисъла на чл. 4, т. 11
    //  от Регламент (ЕС) 2016/679 ... е законосъобразно само ако
    //  съгласието е дадено от упражняващия родителски права родител
    //  или от настойника на субекта на данните."
    // → Bulgaria's GDPR Art. 8 digital age of consent = 14.
    // https://exlege.bg/normi/zzld
    childAgeOfConsent: 14,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "Regulation (EU) 2016/679 (GDPR) + Directive 2002/58/EC (ePrivacy) + Bulgarian Electronic Commerce Act (ZET) Art. 6 + Personal Data Protection Act (ZZLD)",
      url: "https://www.cpdp.bg/en/",
      jurisdiction: "BG",
      subRegime: "BG-ZET",
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
    // Bulgaria did NOT transpose ePrivacy Art. 13(2) soft opt-in into
    // ZET. ZET чл. 6 ал. 4 requires prior consent for any unsolicited
    // commercial email to consumers, with no statutory carve-out for
    // existing customers / similar own products. Relationship therefore
    // does not unlock soft opt-in. (Verified against exlege.bg 2026-05-03.)
  },
}
