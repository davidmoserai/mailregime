import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// GDPR + Code de droit économique (CDE) / Wetboek van economisch recht
// (WER) Art. XII.13, §1: "Het gebruik van elektronische post voor reclame
// is verboden zonder de voorafgaande, vrije, specifieke en geïnformeerde
// toestemming van de geadresseerde" (express opt-in).
// Source: ejustice.just.fgov.be — Wet 15/12/2013 (Boek XII WER); FOD
// Economie consolidated text. Verified 2026-05-03.
//
// Soft opt-in + legal-entity carve-out: Koninklijk besluit 4 april 2003,
// Art. 1. Existing-customer exception requires (a) contact details
// obtained "in het kader van de verkoop van een product of een dienst",
// (b) used "uitsluitend voor soortgelijke producten of diensten",
// (c) opt-out at collection and in each message. Legal-entity exception:
// "bij rechtspersonen als de elektronische contactgegevens die hij met
// dat doel gebruikt onpersoonlijk zijn" (e.g. info@, contact@).
// Source: ejustice.just.fgov.be — KB 04/04/2003 (cn=2003040486).
//
// Child age of consent: 13 — Loi 30/07/2018 relative à la protection des
// personnes physiques à l'égard des traitements de données à caractère
// personnel (Belgian DPA), confirmed by APD/GBA. Verified 2026-05-03.
export const BE: CountryData = {
  code: "BE",
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
        "Royal Decree 4 Apr 2003 Art. 1: no opt-in for legal-entity generic addresses",
        "personal professional addresses still require consent",
      ],
    },
    // Belgian Linguistic Laws (1966) primarily bind public authorities;
    // private-sector marketing is governed by APD/CDE "understandable to
    // recipient" standard — language of the linguistic region. Default
    // to FR+NL (national default for BRU + most consumer-facing sites);
    // override per ISO 3166-2 region for VLG (nl-BE), WAL (fr-BE), or
    // the German-speaking Community via byRegion.
    consentLanguage: { required: ["fr-BE", "nl-BE"], mustMatchUserLocale: true },
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
    childAgeOfConsent: 13,
    parentalVerificationRequired: true,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute: "GDPR Art. 6(1)(a) + Art. 7 + Code de droit économique / WER Art. XII.13 §1 + Koninklijk besluit 4 april 2003 Art. 1 + Loi 30/07/2018 (Belgian DPA)",
      url: "http://www.ejustice.just.fgov.be/cgi_loi/change_lg.pl?language=nl&la=N&table_name=wet&cn=2003040486",
      jurisdiction: "EU",
      subRegime: "BE-CDE",
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
      softOptInAvailable: true,
      softOptInScope: "similar-products",
      requiresCallerSimilarityAssertion: true,
    },
  },
  byRegion: {
    // ISO 3166-2:BE only defines 3 regions (BRU/VLG/WAL) and 10
    // provinces. The Deutschsprachige Gemeinschaft has NO ISO code.
    // We use a non-ISO custom key so callers who detect a
    // German-speaking municipality (Eupen, St. Vith, Kelmis, etc.)
    // can override by passing region: "BE-DG".
    //
    // DETECTION: CDN headers can't distinguish DG from the rest of
    // Liège. Practical signals (caller's responsibility):
    //   - postal code in {4700, 4720, 4730, 4750, 4760, 4770, 4780,
    //     4782, 4784, 4790, 4791, 4960}
    //   - self-declared locale "de" + country BE
    //   - billing city in the 9 DG municipalities
    "BE-DG": {
      consentLanguage: { required: ["de-BE"], mustMatchUserLocale: true },
    },
    // Flanders region — Dutch only.
    "BE-VLG": {
      consentLanguage: { required: ["nl-BE"], mustMatchUserLocale: true },
    },
    // Walloon region — French only (excluding the German-speaking
    // municipalities, which the caller should map to BE-DG).
    "BE-WAL": {
      consentLanguage: { required: ["fr-BE"], mustMatchUserLocale: true },
    },
  },
}
