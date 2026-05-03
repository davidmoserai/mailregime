# mailregime — Design

> Working design doc.
>
> **⚠ Read the [DISCLAIMER](../DISCLAIMER.md) before relying on anything in this document.** mailregime is informational only, not legal advice. Maintainers carry zero liability.
>
> **Companion docs:** [CONSENT_STORAGE.md](./CONSENT_STORAGE.md) (do I need a consent DB?), [MODULARITY.md](./MODULARITY.md) (how to extend without a major version bump).

## Mental model

Three inputs, three outputs.

```
  3 inputs:  WHERE   country code (+ optional ISO 3166-2 region for US states,
                                    Quebec, German Länder if ever needed)
             WHY     context (newsletter-signup | lead-magnet | account-signup
                              | purchase | transactional | drip-onboarding
                              | abandoned-cart | referral | co-registration
                              | event-registration | channel-migration
                              | win-back)
             WHO     relationship (none | existing-customer | former-customer
                                   | inquirer | donor | member
                                   | publicly-listed-business | b2b-cold)

  3 outputs: CAN I?  canCollectForMarketing: boolean
             HOW?    optIn + checkbox + bundling + language + residency + ...
             PROVE   AuditRecord (ISO/IEC TS 27560-aligned)
```

Everything else is a helper or an integration.

## Why context matters as much as country

A US user signing up for a newsletter and a US user submitting their email to download a lead magnet are governed by the same statute (CAN-SPAM) but the audit trail and disclosure requirements differ. An EU user in those two situations has very different rules — the lead-magnet case requires a separate unticked checkbox; the newsletter case can be a primary submit-as-consent flow with a DOI confirmation.

Country alone isn't enough. `(country, context, relationship)` is the minimum viable input triple.

## Decision matrix (illustrative — not the full set)

```
┌──────────────────┬──────────┬──────────────────────────────────────────────────────┐
│ CONTEXT          │ COUNTRY  │ REQUIRED CONSENT SHAPE                               │
├──────────────────┼──────────┼──────────────────────────────────────────────────────┤
│ newsletter       │ US       │ submit-as-consent OK; unsubscribe + identity req.   │
│ -signup          │ EU/UK/CH │ DOI required, no pre-checked, granular              │
│                  │ CA       │ express consent + record (CASL)                      │
│                  │ AU       │ express OR inferred + functional unsubscribe         │
│                  │ IN/BR/KR │ DOI safest (opt-in regimes, vague "express")         │
├──────────────────┼──────────┼──────────────────────────────────────────────────────┤
│ lead-magnet      │ US       │ submit-as-consent OK if disclosed at point of entry │
│ (THE LANDMINE)   │ EU/UK    │ ❌ CANNOT auto-add. Separate unticked checkbox      │
│                  │          │    REQUIRED. Service must work without checkbox.    │
│                  │ CA       │ ❌ CANNOT auto-add. Separate express consent.       │
│                  │ AU       │ Disclosure + checkbox safer; soft opt-in possible    │
│                  │ IN/BR    │ ❌ Separate consent (purpose limitation principle)  │
├──────────────────┼──────────┼──────────────────────────────────────────────────────┤
│ referral         │ CA       │ CASL §6(2)(b): single message, 6mo window, must     │
│ (refer-a-friend) │          │ identify referrer. Hard limit, not best-practice.   │
│                  │ EU/UK    │ Generally treated as marketing; needs sender        │
│                  │          │ consent (the referrer's friend hasn't consented).   │
│                  │ US       │ Allowed if disclosed; FTC has fined deceptive       │
│                  │          │ refer-a-friend flows (Lord & Taylor 2016).          │
├──────────────────┼──────────┼──────────────────────────────────────────────────────┤
│ event-           │ EU/UK    │ Purpose limitation (GDPR Art. 5(1)(b)) — cannot     │
│ registration     │          │ drip-market off it without separate consent.        │
├──────────────────┼──────────┼──────────────────────────────────────────────────────┤
│ abandoned-cart   │ US       │ Existing-customer-ish; CAN-SPAM allows.             │
│                  │ EU/UK    │ Marketing under PECR — needs prior consent.         │
│                  │ CA       │ CEM under CASL — express or implied consent.        │
├──────────────────┼──────────┼──────────────────────────────────────────────────────┤
│ channel-         │ ALL      │ Channel-specific consent. Email consent ≠ SMS       │
│ migration        │          │ consent. TCPA, GDPR, CASL all enforce this.         │
├──────────────────┼──────────┼──────────────────────────────────────────────────────┤
│ win-back /       │ EU/UK    │ ICO 24-mo inactivity guidance — reconfirm.          │
│ re-engagement    │ CA       │ CASL implied consent: 24mo from purchase, 6mo from │
│                  │          │ inquiry.                                            │
├──────────────────┼──────────┼──────────────────────────────────────────────────────┤
│ account-signup   │ ALL      │ Marketing ALWAYS separate from ToS acceptance.      │
│                  │ US       │ Optional checkbox or post-signup welcome opt-in     │
│                  │ EU/UK    │ Unticked checkbox at signup OR post-signup DOI      │
│                  │          │ (NEVER bundled with ToS — Planet49 ruling)          │
├──────────────────┼──────────┼──────────────────────────────────────────────────────┤
│ purchase         │ US       │ Existing-customer, free reign within CAN-SPAM       │
│ (soft opt-in     │ EU/UK    │ PECR soft opt-in: similar products, opt-out at      │
│  unlocks)        │          │ point of sale + every email.                        │
│                  │ CA       │ Implied consent 24mo from purchase (CASL)            │
│                  │ AU       │ Inferred consent from existing business rel.         │
├──────────────────┼──────────┼──────────────────────────────────────────────────────┤
│ transactional    │ ALL      │ No marketing consent needed. But: don't sneak       │
│                  │          │ marketing copy into transactional (illegal stuffing)│
└──────────────────┴──────────┴──────────────────────────────────────────────────────┘
```

## Edge cases

### Spatial / identity
- **VPN users** — header says US, user is in DE. Library uses header best-effort. If the app later self-declares EU (locale, billing addr), it should *upgrade* the regime, never downgrade. **Take the stricter of header and self-declared.**
- **Travelers** — same fix as VPN.
- **Missing country header** — no silent default. Throw, or apply caller-configured `unknownCountryPolicy`.
- **US state laws** — CCPA/CPRA, VCDPA, CPA, CTDPA, UCPA + 2024–2026 additions (TX TDPSA, OR OCPA, MT MCDPA, TN TIPA, DE DPDPA). Mostly affect data sale/share, not email marketing per se. Library accepts an optional ISO 3166-2 `region` and returns layered `subRegimes`.
- **UK post-Brexit + Data (Use and Access) Act 2025** — UK is **not** a GDPR alias. Modelled as its own country record. UK DUAA softens some GDPR-derived obligations.
- **Quebec Law 25 + Bill 96** — French-language consent for Quebec residents. `consentLanguage.required: ["fr-CA"]` for `region: "CA-QC"`.
- **Children** — COPPA <13 in US (verifiable parental consent — different from age threshold). GDPR varies 13–16 by member state. Library exposes both `childAgeOfConsent` and `parentalVerificationRequired`.
- **EU citizen abroad** — GDPR applies if they're "in the Union" at data collection. Library uses location, not citizenship. Documented boundary.
- **Extraterritorial reach** — China PIPL, EU GDPR Art. 3(2), DPDP India, all reach non-resident senders to data subjects in their territory. Library exposes `extraterritorialReach: boolean` so non-EU senders know they're caught.

### Consent mechanics
- **Pre-checked boxes** — illegal under GDPR (Planet49 C-673/17, 2019), CASL, AU, IN. `prechecking: "forbidden" | "allowed"`.
- **Bundled consent** — illegal under GDPR. `bundling: "forbidden"`.
- **Granular consent** — GDPR + CASL want separate channels (email, SMS, postal). Caller asks per channel.
- **Withdrawal must be "as easy as giving"** — RFC 8058 one-click unsubscribe is now table-stakes for Gmail/Yahoo bulk-sender rules anyway.
- **Re-consent / consent expiry**:
  - GDPR: no fixed expiry; ICO suggests 24mo of inactivity as a reconfirmation trigger.
  - CASL implied consent: 24mo from last transaction, 6mo from inquiry.
  - Library returns `reConsentTriggerMonths: number | null`.
- **Suppression after unsubscribe** — once they unsub, do not re-add on next form submission without a fresh affirmative consent.

### Lead-magnet landmine
- **DOI email itself** — universally treated as service/transactional (the user requested it by submitting). Not marketing requiring prior consent.
- **Drip onboarding** (welcome → tips → upgrade) — gray. Library treats as marketing context equivalent to `newsletter-signup` (conservative).

### B2B / outreach
- **Cold B2B email**:
  - CAN-SPAM: fine with unsub.
  - GDPR: defensible via legitimate interest (with an LIA).
  - CASL: **no general B2B exemption.** Narrow §3(a)(ii) exemption only between employees of orgs with an existing business relationship.
- Library returns:
  ```ts
  b2bExemption: {
    regime: "casl-intra-org" | "gdpr-lia" | "can-spam-default" | "none"
    conditions: string[]
  }
  ```

### Sensitive / special-category data
- Health, political affiliation, sexual orientation, religion → GDPR Art. 9 special category, treated separately. Library exposes `sensitiveDataFlags` so apps don't accidentally drop a "vegan recipes" newsletter into a religious-marketing audit.

## Architecture

```
                    ┌─────────────────────────────────────────┐
                    │         mailregime (core, ~5kb gzipped)       │
                    │                                          │
                    │   getEmailRules({                        │
                    │     country, region?, context,           │
                    │     relationship                         │
                    │   }) → EmailRules                        │
                    │                                          │
                    │   • Pure function. Edge-safe.            │
                    │   • Zero deps.                           │
                    │   • Throws on unknown country by default.│
                    └─────────────────────────────────────────┘
                                       │
                ┌──────────────────────┼──────────────────────┐
                │                      │                      │
                ▼                      ▼                      ▼
   ┌──────────────────────┐ ┌───────────────────┐ ┌──────────────────────┐
   │ mailregime/data            │ │ mailregime/adapters/*   │ │ mailregime/integrations/*  │
   │                      │ │                   │ │ (planned)            │
   │ TS files, one per    │ │ Detect country    │ │                      │
   │ jurisdiction. Tree-  │ │ from request:     │ │ ESP plug-ins:        │
   │ shakable. Each       │ │   • vercel        │ │   • brevo            │
   │ record carries:      │ │   • cloudflare    │ │   • mailchimp        │
   │   code, regime,      │ │   • header        │ │   • klaviyo          │
   │   subRegime, statute,│ │   • static        │ │   • resend           │
   │   url, dataLastUpd., │ │   • maxmind       │ │                      │
   │   confidence         │ │     (planned)     │ │ Each emits the right │
   │                      │ │                   │ │ shape for that ESP   │
   │ Versioned separately │ │                   │ │ AND a portable       │
   │ from library SemVer  │ │                   │ │ AuditRecord export.  │
   │ (consentDataVersion).│ │                   │ │                      │
   └──────────────────────┘ └───────────────────┘ └──────────────────────┘
                │                      │                      │
                └──────────────────────┼──────────────────────┘
                                       │
                                       ▼
                    ┌─────────────────────────────────────────┐
                    │       mailregime/audit (optional)             │
                    │                                          │
                    │   buildAuditRecord(...) → AuditRecord    │
                    │   serializeISO27560(record) → JSON       │
                    │   one-click unsub URL builder            │
                    │                                          │
                    │   STATELESS. No DB. No I/O.              │
                    └─────────────────────────────────────────┘
```

The split between **data**, **adapters**, **integrations**, **audit** is the modularity story. See [MODULARITY.md](./MODULARITY.md) for the rules each module commits to.

## API sketch

```ts
type EmailRules = {
  // What the developer needs to DO
  canCollectForMarketing: boolean
  optIn: "single" | "double" | "express" | "blocked"
  checkboxRequired: boolean
  bundlingAllowed: boolean
  prechecking: "forbidden" | "allowed"
  channels: ("email" | "sms" | "postal")[]
  unsubscribeMechanism: "one-click" | "link" | "any"

  // Soft opt-in eligibility (purchase context)
  softOptInAvailable: boolean
  softOptInScope: "similar-products" | "any" | "none"
  requiresCallerSimilarityAssertion: boolean   // PECR similarity is fact-specific
  impliedConsentTtlMonths: number | null

  // B2B
  b2bExemption: {
    regime: "casl-intra-org" | "gdpr-lia" | "can-spam-default" | "none"
    conditions: string[]
  }

  // Language / locale obligations (Quebec Bill 96, Belgium DPA, Catalonia)
  consentLanguage: {
    required: string[]                  // ["fr-CA"] for Quebec residents
    mustMatchUserLocale: boolean
  }

  // Data residency / cross-border transfer
  dataResidency: {
    storageRegion: "any" | "eu" | "local"
    crossBorderTransferMechanism:
      | "none-required"
      | "scc"                            // EU SCCs
      | "adequacy"
      | "explicit-consent"               // DPDP India, China PIPL
      | "blocked"
  }

  // Retention
  consentRecordRetentionMonths: number   // CASL: 36 after EBR ends; DPDP: 84

  // Sensitive / special category
  sensitiveDataFlags: {
    healthMarketingBlocked: boolean
    politicalMarketingBlocked: boolean
    childrenBlocked: boolean
  }

  // Preference center expectations
  preferenceCenter: {
    granularityRequired: "none" | "channel" | "purpose" | "topic"
    perEmailUnsubAlsoRequired: boolean
  }

  // Identity / sender disclosure
  senderIdentity: {
    physicalAddressRequired: boolean
    legalEntityNameRequired: boolean
    representativeRequired: boolean       // GDPR Art. 27 EU-rep for non-EU senders
  }

  // Re-consent / refresh
  reConsentTriggerMonths: number | null

  // Children
  childAgeOfConsent: number
  parentalVerificationRequired: boolean

  // Audit / proof
  proofRequired: ("timestamp" | "ip" | "source" | "wording" | "ua")[]
  buildAuditRecord: (ctx: AuditContext) => Promise<AuditRecord>   // async — uses crypto.subtle for SHA-256

  // Citation (lawyer-facing)
  basis: {
    statute: string                       // "GDPR Art. 6(1)(a)"
    url: string
    jurisdiction: string                  // "EU"
    subRegime: string | null              // "DE-UWG-7" — per-member-state divergence
    dataLastUpdated: string               // "2025-09-12" — maintainer's last edit, NOT a lawyer review date
    lawyerAttestation: null | { lawyer, firm, jurisdiction, date, attestationUrl }
    confidence: "high" | "medium" | "low"
    extraterritorialReach: boolean
  }

  // Suggested ESP wiring
  suggestedTemplate: "double-opt-in" | "single-opt-in" | "blocked"
}
```

### AuditRecord (ISO/IEC TS 27560:2023 aligned)

```ts
type AuditRecord = {
  schemaVersion: "mailregime/1"                 // mailregime schema version
  iso27560Version: "1.0"                  // Kantara consent receipt version
  consentId: string                       // ULID
  subjectId: string                       // hashed email or pseudonymous ID
  capturedAt: string                      // ISO8601 + tz
  ip: string | null
  userAgent: string | null
  country: string                         // detected
  region: string | null                   // ISO 3166-2 (e.g. "US-CA", "CA-QC")
  countrySource: "header" | "self-declared" | "billing" | "static" | "unknown"
  context: Context
  relationship: Relationship
  channels: Channel[]
  wording: string                         // exact text shown
  wordingHash: string                     // sha256 — survives DB compaction
  formUrl: string
  formVersion: string
  doiConfirmedAt: string | null
  basis: {
    statute: string
    url: string
    jurisdiction: string
    dataLastUpdated: string
  }
  withdrawnAt: string | null
  withdrawalMethod: string | null
}
```

This is a **superset** of the ISO 27560 consent receipt. `serializeISO27560(record)` produces a strict-schema receipt for interop.

## 2026–2028 future-proofing

Specific regulatory items the schema must accommodate without breaking changes:

| Item | Status | Schema impact |
|---|---|---|
| **EU ePrivacy Regulation** | **Withdrawn Feb 2026.** Email rules continue under 27 national transpositions of Directive 2002/58 + GDPR. | Per-member-state divergence is permanent. `subRegime` field non-negotiable. Don't assume harmonisation. |
| **Canada Bill C-27 / CPPA** | Dead. PIPEDA + CASL + Quebec Law 25 remain. | No CPPA fields pre-baked. |
| **DPDP India Rules 2025** | Notified Nov 2025; full enforcement May 2027. | `consentManager: boolean` per country (whether jurisdiction recognises a registered consent-manager intermediary). India is first; EU may follow. |
| **UK Data (Use and Access) Act 2025** | Softens some GDPR-derived obligations. | UK modelled as its own country record, not a GDPR alias. |
| **California Delete Act / DROP** | Effective Aug 2026. | `bulkDeleteMechanism: "drop" | "none"` for US-CA region. |
| **China PIPL** | In force; extraterritorial. | `extraterritorialReach: boolean` on each country. |
| **Saudi PDPL, UAE PDPL, Israel Amendment 13** | All consent-based, modelled on GDPR. | Add as country records with `confidence: "medium"` until case law develops. |

## Standards alignment

| Standard | Aligned? | Why |
|---|---|---|
| **ISO/IEC 29184:2020** (Online privacy notices and consent) | **Yes.** | Defines the structure of a consent notice. `wording` and `formVersion` map to its §5 elements. |
| **ISO/IEC TS 27560:2023** (Kantara Consent Receipt) | **Yes.** | De facto interop format for portable consent records. `AuditRecord` is a superset. |
| **ISO/IEC 27701** (Privacy info management) | Compatible, not aligned. | Org-level standard, not record-level. |
| **IAB TCF v2.2** | **No.** | Adtech-only; would over-constrain email collection. Out of scope. |
| **Global Privacy Control** | Recommendation only. | Browser signal for sale/share opt-out (CCPA). Not consent-grant. Library exposes `respectGpc: boolean` for US states. |

## `unknownCountryPolicy` values

When `getEmailRules` is called with `country: null`, the configured policy decides:

| Policy | Behaviour |
|---|---|
| `"throw"` (default) | Throws an error. Forces the caller to handle missing-country explicitly. |
| `"strict"` | Returns the strictest known regime (currently the GDPR baseline). For apps that prefer to over-block rather than crash. |
| `"permissive"` | Returns the most permissive regime (currently CAN-SPAM). **Footgun. Discouraged.** Permissive defaults from unknown geographies have caused real fines. |

## Open questions

1. **Data format**: TS for both types and data (with a `consentDataVersion` independent of library SemVer) — picked over JSON-with-a-build-step to keep authoring strongly typed at compile time. Mirrors how `tzdata` decouples from libc.
2. **US states**: full first-class jurisdictions, accepted via optional `region: ISO3166-2` input. Layered `subRegimes` on output.
3. **PECR similar-products**: expose both `softOptInScope: "similar-products"` and `requiresCallerSimilarityAssertion: true` so the API forces the developer to confirm fact-specific similarity.
4. **Integrations packaging**: sub-paths (`mailregime/integrations/brevo`) over separate npm packages. Version coupling is a feature for consent-data correctness.
5. **Region-only tree-shaking**: ship per-country JSON imports for apps that operate in N markets, e.g. `import { US, GB, DE } from "mailregime/data/countries"`.

## Non-goals (reiterated)

- **Not legal advice.** Ship-grade compliance still needs a lawyer for your specific use case.
- **Not a consent UI library.** Bring your own checkbox.
- **Not an ESP wrapper.** Integrations are thin adapters; the ESP does the sending.
- **Not a cookie banner.** That's c15t.
- **Not a consent database.** See [CONSENT_STORAGE.md](./CONSENT_STORAGE.md). mailregime is stateless and never opens a connection to anything.
