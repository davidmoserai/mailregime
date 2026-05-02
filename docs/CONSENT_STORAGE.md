# Do I need a consent database?

**Short answer:** No. But "the ESP keeps the record" is materially weaker than "the ESP keeps the record AND I have a periodic export." For most small companies, the cheapest defensible position is ESP-of-record + scheduled snapshot to your own storage. You do *not* need a real-time consent database.

This document is a focused answer to the most common question developers will ask m24t.

---

## What the law actually demands

Across every major regime the obligation is "**you must be able to demonstrate consent**." None of them say "you must run a separate consent database." The risk is operational, not literal: the audit trail has to survive ESP outages, account terminations, and data-subject access requests on *your* timeline, not your processor's.

| Regime | What's required | ESP-only defensible? |
|---|---|---|
| **GDPR / UK GDPR** (Art. 7(1)) | Controller "shall be able to demonstrate" consent. EDPB Guidelines 05/2020 + ICO list 5 fields: who, when, what told, how, withdrawal. | Yes IF your DPA covers retention + export AND you've actually exported at least once. |
| **CASL (Canada)** | CRTC 2016 Enforcement Advisory: keep all evidence of express *and* implied consent, methods, policies, unsubscribe actions. **3-year retention after EBR ends.** Onus on sender (s. 13). | Risky. CASL is the strictest written rule on records. Mirror to your storage. |
| **Quebec Law 25** | Stricter than PIPEDA — consent must be "manifest, free, enlightened, specific." French-language consent for Quebec residents (Bill 96). | No, if your ESP only keeps English-language records. Mirror with locale. |
| **CAN-SPAM (US)** | No consent record requirement. Must honour opt-outs within 10 business days. | Yes. CAN-SPAM is opt-out; ESP suppression list is enough. |
| **State privacy laws** (CCPA/CPRA, VCDPA, CPA, CTDPA, UCPA, TX TDPSA, OR OCPA, MT, TN, DE, etc.) | Right-to-know + right-to-delete obligations against the **controller**. Don't directly mandate consent records but do require you to respond to verifiable requests. | Yes for marketing consent itself. Insufficient for verifiable-request response. |
| **Australia Spam Act** | Express or inferred consent; sender bears burden. ACMA enforcement consistently turns on missing/ambiguous records (DoorDash AUD 2M, Commonwealth Bank, Kmart). | Yes; ESP records are accepted in practice. |
| **DPDP India 2023** (Rules 2025, full enforcement May 2027) | Formal Consent Manager role (registered intermediary). **7-year retention.** Cryptographic proof contemplated. | Risky after May 2027. Architecture explicitly contemplates controller- or Consent-Manager-held audit trail. |
| **LGPD Brazil** (Art. 8 §2) | Controller bears burden of proving consent. ANPD (independent agency since Feb 2026) prioritising advertising data audits. | Risky. Statutory language closer to GDPR than CAN-SPAM. |
| **APPI Japan** | Purpose-limitation focused. Record-keeping focus is on third-party transfers (Art. 29/30), not consent itself. | Yes. |

---

## What "good enough" looks like for a small company

Three things, in order of importance:

1. **DPA with your ESP that explicitly covers retention and export of consent metadata.** If you can't pull consent records on demand, you don't have an audit trail — you have someone else's audit trail.

2. **Scheduled export.** Cron-job dumps the ESP's consent records (DOI confirmations, list memberships, opt-out timestamps) into your own storage (S3, R2, anywhere). Monthly is fine. The point is that the export *exists* and is provably current; the data lives nowhere else important.

3. **Consent-record schema you can read without the ESP's help.** ISO/IEC TS 27560:2023 (Kantara Consent Receipt v1.1) is the de facto interop format. m24t's `AuditRecord` will be a superset of it. Use it.

That's it. You don't need a database, you don't need a consent-management platform, you don't need a CMS — you need a JSON file per consent in object storage and a contract with your ESP.

---

## When the ESP-only path actually breaks

Several real failure modes that aren't theoretical:

- **ESP terminates your account** (TOS violation, payment dispute, acquisition wind-down). You have 30 days at best to export. If you find out late, the records are gone.
- **ESP changes export format** in a major version bump and old records become unparseable. Happens.
- **Data-subject access request (Art. 15)** lands on a Friday and your ESP's support is closed until Monday. You have 30 days to respond, but a regulator-followed timeline starts when the request lands, not when you can act.
- **Litigation hold / discovery.** Opposing counsel subpoenas your consent records. "We use Brevo" is not an answer; you need to produce.
- **ESP migration.** You decide to switch from Brevo to Resend in 2027. The historical consent chain has to come with you, or every contact has to re-consent.

A monthly snapshot to your own bucket fixes all five.

---

## What m24t will provide

- `m24t/audit` will export an ISO 27560-aligned `AuditRecord` shape that is portable, hashable, and serializable as a single JSON document per consent event.
- `m24t/audit` will include a stateless serializer — there is **no built-in storage** and m24t never opens a database connection. You can store the records in R2, S3, Postgres, a flat file, your ESP, or all of the above.
- `m24t/integrations/*` will provide ESP-specific exporters that take an ESP's native consent log and emit the canonical AuditRecord shape, so the snapshot is a one-liner regardless of which ESP you're on.

The library does not require, recommend, or assume a consent database. It does recommend that whatever you store satisfies the schema.

---

## Caveats for lawyer review

- The "ESP-as-record sufficient" claim is unsettled — no DPA has ruled directly on it under GDPR.
- DPDP Rules 2025 enforcement specifics around non-Consent-Manager record-keeping are not yet tested.
- Quebec Law 25's interaction with CASL implied consent is asserted by Quebec privacy practitioners (e.g. Cyberimpact) but not adjudicated.
- The Feb 2026 EU ePrivacy withdrawal and ANPD independence dates are sourced from current reporting; reconfirm against primary EU/Brazilian government releases before relying.

---

## Citations

- [EDPB Guidelines 05/2020 on consent](https://www.edpb.europa.eu/sites/default/files/files/file1/edpb_guidelines_202005_consent_en.pdf)
- [GDPR Art. 7](https://gdpr-info.eu/art-7-gdpr/)
- [ICO Consent guidance (UK GDPR)](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/consent/)
- [CRTC Enforcement Advisory: Keeping Records of Consent under CASL](https://www.canada.ca/en/radio-television-telecommunications/news/2016/07/enforcement-advisory-notice-for-businesses-and-individuals-on-how-to-keep-records-of-consent.html)
- [DPDP Act 2023 (MeitY)](https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf)
- [LGPD Art. 8](https://lgpd-brazil.info/chapter_02/article_08)
- [ISO/IEC 29184:2020 Online privacy notices and consent](https://www.iso.org/standard/70331.html)
- [ISO/IEC TS 27560:2023 Consent record information structure](https://www.iso.org/standard/80392.html)
