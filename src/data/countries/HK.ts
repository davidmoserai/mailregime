import type { CountryData } from "../../types.js"

// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Hong Kong: Personal Data (Privacy) Ordinance Cap. 486 (PDPO) Part VIA
// (Direct Marketing, ss.35A–35M) + Unsolicited Electronic Messages
// Ordinance Cap. 593 (UEMO). Regulator: Office of the Privacy
// Commissioner for Personal Data (PCPD).
//
// PDPO Part VIA requires a data user to obtain the data subject's
// "consent" (express indication of no objection) BEFORE using personal
// data in direct marketing — opt-out is NOT sufficient under PDPO once
// personal data is involved. Notice must be in a manner "easily
// understandable and, if in writing, easily readable". Breach is a
// criminal offence (fines up to HK$500,000 + 3 years; HK$1,000,000 + 5
// years for use for gain).
// PDPO ss.35A–35M: https://www.elegislation.gov.hk/hk/cap486!en?xpid=ID_1438403547997_001
// PCPD New Guidance on Direct Marketing (Apr 2013):
//   https://www.pcpd.org.hk/english/resources_centre/publications/files/GN_DM_e.pdf
//
// UEMO Cap. 593 governs the SENDING of commercial electronic messages
// (email, SMS, fax, pre-recorded voice) with a Hong Kong link. UEMO is
// opt-out: senders must include accurate sender info, clear unsubscribe
// facility, honour unsubscribe within 10 working days, and not send to
// numbers on the Do-not-call Registers. UEMO does NOT displace PDPO —
// when personal data is used, PDPO Part VIA consent is also required.
// UEMO Cap. 593: https://www.elegislation.gov.hk/hk/cap593!en
// OFCA UEMO guidance: https://www.ofca.gov.hk/en/regulatory_framework/uemo/
export const HK: CountryData = {
  code: "HK",
  regime: "PDPO+UEMO",
  defaults: {
    canCollectForMarketing: true,
    // PDPO Part VIA requires explicit prior consent for using personal
    // data in direct marketing (s.35C). Combined with UEMO opt-out for
    // the message itself, the binding floor when personal data is used
    // is express opt-in.
    optIn: "express",
    checkboxRequired: true,
    bundlingAllowed: false,
    // PCPD guidance: consent must be a separate, affirmative response;
    // pre-ticked boxes do not constitute "an indication of no objection".
    prechecking: "forbidden",
    channels: ["email"],
    // UEMO s.8 requires an unsubscribe facility in every commercial
    // electronic message; sender must honour within 10 working days (s.9).
    unsubscribeMechanism: "link",
    // PDPO has no soft opt-in / household exemption. Every reuse of
    // personal data for direct marketing requires prior s.35C consent.
    softOptInAvailable: false,
    softOptInScope: "none",
    requiresCallerSimilarityAssertion: false,
    impliedConsentTtlMonths: null,
    b2bExemption: {
      // UEMO applies to all commercial electronic messages regardless of
      // recipient type; PDPO applies whenever personal data is used. No
      // B2B carve-out.
      regime: "none",
      conditions: [
        "UEMO Cap. 593 applies to all commercial electronic messages with a HK link, B2B included",
        "PDPO Part VIA applies whenever personal data (incl. business contacts that identify a living individual) is used for direct marketing",
      ],
    },
    consentLanguage: {
      // PDPO s.35C(2)(b): notice must be "easily understandable and, if
      // in writing, easily readable".
      required: ["easily understandable", "easily readable"],
      mustMatchUserLocale: false,
    },
    dataResidency: {
      // PDPO s.33 (cross-border transfer) is enacted but not yet in force;
      // outbound transfers are not currently gated by statute.
      storageRegion: "any",
      crossBorderTransferMechanism: "none-required",
    },
    consentRecordRetentionMonths: 60,
    sensitiveDataFlags: {
      healthMarketingBlocked: false,
      politicalMarketingBlocked: false,
      childrenBlocked: true,
    },
    preferenceCenter: {
      // PDPO s.35E requires the data user to specify the classes of
      // marketing subjects and classes of personal data to be used —
      // implies purpose-level granularity at consent time.
      granularityRequired: "purpose",
      perEmailUnsubAlsoRequired: true,
    },
    senderIdentity: {
      // UEMO s.7: every commercial electronic message must include
      // accurate sender information and a HK address (postal/email) at
      // which the sender can be readily contacted.
      physicalAddressRequired: true,
      legalEntityNameRequired: true,
      representativeRequired: false,
    },
    reConsentTriggerMonths: 24,
    // PDPO does not set a digital age of consent. Default to 18, the
    // age of majority in HK common law.
    childAgeOfConsent: 18,
    parentalVerificationRequired: false,
    proofRequired: ["timestamp", "ip", "source", "wording", "ua"],
    basis: {
      statute:
        "Personal Data (Privacy) Ordinance (Cap. 486) Part VIA (Direct Marketing, ss.35A–35M) + Unsolicited Electronic Messages Ordinance (Cap. 593)",
      url: "https://www.elegislation.gov.hk/hk/cap486!en?xpid=ID_1438403547997_001",
      jurisdiction: "HK",
      subRegime: "HK-PDPO-VIA",
      dataLastUpdated: "2026-05-03",
      confidence: "medium",
      extraterritorialReach: false,
      lawyerAttestation: null,
    },
    suggestedTemplate: "double-opt-in",
  },
  byContext: {
    "lead-magnet": { canCollectForMarketing: false, optIn: "blocked", suggestedTemplate: "blocked" },
    transactional: { proofRequired: [] },
  },
  byRelationship: {
    // PDPO has no statutory soft opt-in for existing customers — s.35C
    // consent is required for every use of personal data in direct
    // marketing, irrespective of prior commercial relationship.
    "existing-customer": {},
  },
}
