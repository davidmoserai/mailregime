# m24t — Design

> Working design doc. Nothing here is implemented yet. Discussion welcome via issues.

## Mental model

Three inputs, three outputs.

```
  3 inputs:  WHERE   country code
             WHY     context (newsletter-signup | lead-magnet | account-signup
                              | purchase | transactional | drip-onboarding)
             WHO     relationship (none | existing-customer | former-customer
                                   | b2b-cold)

  3 outputs: CAN I?  canCollectForMarketing: boolean
             HOW?    optIn + checkboxRequired + bundlingAllowed + ...
             PROVE   audit record builder + statute citation
```

That's it. Everything else is a helper or an integration.

## Why context matters as much as country

A US user signing up for a newsletter and a US user submitting their email to download a lead magnet are governed by the same statute (CAN-SPAM) but the audit trail and disclosure requirements differ. An EU user in those two situations has *very* different rules — the lead-magnet case requires a separate unticked checkbox; the newsletter case can be a primary submit-as-consent flow with a DOI confirmation.

Country alone isn't enough. `(country, context, relationship)` is the minimum viable input triple.

## The decision matrix

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
│ account-signup   │ ALL      │ Marketing ALWAYS separate from ToS acceptance.      │
│                  │ US       │ Optional checkbox or post-signup welcome opt-in     │
│                  │ EU/UK    │ Unticked checkbox at signup OR post-signup DOI      │
│                  │          │ (NEVER bundled with ToS — Planet49 ruling)          │
├──────────────────┼──────────┼──────────────────────────────────────────────────────┤
│ purchase         │ US       │ Existing-customer, free reign within CAN-SPAM       │
│ (soft opt-in     │ EU/UK    │ PECR soft opt-in: similar products, opt-out at      │
│  unlocks)        │          │ point of sale + every email. NOT for newsletter     │
│                  │          │ on unrelated topics.                                 │
│                  │ CA       │ Implied consent 24mo from purchase (CASL)            │
│                  │ AU       │ Inferred consent from existing business rel.         │
├──────────────────┼──────────┼──────────────────────────────────────────────────────┤
│ transactional    │ ALL      │ No marketing consent needed. But: don't sneak       │
│                  │          │ marketing copy into transactional (illegal stuffing)│
└──────────────────┴──────────┴──────────────────────────────────────────────────────┘
```

## Edge cases (non-exhaustive)

### Spatial / identity
- **VPN users**: header says US, user is in DE. Library uses header (best-effort), logs it for audit. If the app later self-declares EU (locale, billing addr), it should *upgrade* the regime, never downgrade.
- **Travelers**: same fix as VPN.
- **Missing country header**: no silent default. Throw, or apply the caller-configured `unknownCountryPolicy`.
- **US state laws** (CCPA/CPRA, VCDPA, CPA, CTDPA, UCPA): mostly affect data sale/share, not email marketing per se. Library returns `subRegimes: ["CAN-SPAM", "CCPA"]` for CA users.
- **UK post-Brexit**: not GDPR but UK-GDPR + PECR. Functionally identical for email; cite separately.
- **Children**: COPPA <13 in US; GDPR varies 13–16 by member state. Library exposes `childAgeOfConsent`. App must collect/verify age — library does not.
- **EU citizen abroad**: GDPR applies if they're "in the Union" at data collection. Library uses location, not citizenship.

### Consent mechanics
- **Pre-checked boxes**: ILLEGAL under GDPR (Planet49 C-673/17, 2019), CASL, AU, IN. Library returns `prechecking: "forbidden" | "allowed"`.
- **Bundled consent** (ToS + marketing in one box): ILLEGAL under GDPR. `bundling: "forbidden"`.
- **Granular consent**: GDPR + CASL want separate channels (email, SMS, postal). Caller asks per channel.
- **Withdrawal must be "as easy as giving"**: one-click unsubscribe (RFC 8058) is now table-stakes for Gmail/Yahoo bulk-sender rules anyway.
- **Re-consent / consent expiry**:
  - GDPR: no fixed expiry; ICO suggests 24mo of inactivity as a reconfirmation trigger.
  - CASL implied consent: 24mo from last transaction.
- **Suppression after unsubscribe**: once they unsub, do NOT re-add on next form submission without a fresh affirmative consent.

### Lead-magnet landmine
- **DOI email itself**: universally treated as service/transactional (the user requested it by submitting). Not "marketing" requiring prior consent.
- **Drip onboarding** (welcome → tips → upgrade): marketing or transactional? Gray. Library treats `drip-onboarding` as a context equivalent to `newsletter-signup` (conservative).

### B2B / outreach
- **Cold B2B email**: fine under CAN-SPAM (with unsub). Defensible under GDPR via legitimate interest (with an LIA). Under CASL, B2B is NOT exempt.
- Library returns `b2bExemption: "full" | "partial" | "none"`.

### Technical
- **Edge runtime**: pure data + pure function. <20kb gzipped. Zero deps.
- **Tree-shaking**: per-country JSON tree-shakable for apps that operate in N markets only.
- **Sync core**: detection adapters MAY be async; `getEmailRules` is always sync.
- **Audit trail shape**: GDPR Art. 7(1) "controller shall be able to demonstrate". Library exposes `buildAuditRecord(ctx)` returning a normalized object. Storage is the caller's.
- **Legal data drift**: each country record carries `lastReviewed: "YYYY-MM-DD"`. Console-warn in dev if >12mo old.
- **Confidence**: `meta.confidence: "high" | "medium" | "low"` per country. Low = "we have the statute but no case law tested this scenario".

## Architecture

```
                    ┌─────────────────────────────────────────┐
                    │         m24t (core, ~5kb gzipped)       │
                    │                                          │
                    │   getEmailRules({                        │
                    │     country, context, relationship       │
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
   │ m24t/data            │ │ m24t/adapters/*   │ │ m24t/integrations/*  │
   │                      │ │                   │ │                      │
   │ Country JSON files,  │ │ Detect country    │ │ Plug into ESPs:      │
   │ one per jurisdiction.│ │ from request:     │ │                      │
   │ Tree-shakable.       │ │   • vercel        │ │   • brevo            │
   │                      │ │   • cloudflare    │ │   • mailchimp        │
   │ Each record carries: │ │   • header        │ │   • klaviyo          │
   │   code, regime,      │ │   • maxmind       │ │   • resend           │
   │   statute, url,      │ │   • static        │ │                      │
   │   lastReviewed,      │ │     (testing)     │ │ Each emits the right │
   │   confidence         │ │                   │ │ shape for that ESP.  │
   └──────────────────────┘ └───────────────────┘ └──────────────────────┘
                │                      │                      │
                └──────────────────────┼──────────────────────┘
                                       │
                                       ▼
                    ┌─────────────────────────────────────────┐
                    │       m24t/audit (optional)             │
                    │                                          │
                    │   recordConsent(...) → AuditRecord       │
                    │   serializeForGDPR(record) → {...}       │
                    │   one-click unsub URL builder            │
                    └─────────────────────────────────────────┘
```

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
  impliedConsentTtlMonths: number | null

  // B2B
  b2bExemption: "full" | "partial" | "none"

  // Audit / proof
  proofRequired: ("timestamp" | "ip" | "source" | "wording" | "ua")[]
  buildAuditRecord: (ctx: AuditContext) => AuditRecord

  // Citation (lawyer-facing)
  basis: {
    statute: string                   // "GDPR Art. 6(1)(a)"
    url: string
    jurisdiction: string              // "EU"
    lastReviewed: string              // "2025-09-12"
    confidence: "high" | "medium" | "low"
  }

  // Children
  childAgeOfConsent: number

  // Suggested ESP wiring
  suggestedTemplate: "brevo-doi" | "single-opt-in" | "blocked"
}
```

## Open questions

1. **Data format for country records**: TS module, JSON, or YAML? JSON is most portable; TS gives type-checked statutes.
2. **Versioning model**: SemVer the library; pin a `consentDataVersion` separately so apps can update the library without inheriting new legal opinions silently?
3. **How granular for US states**: subRegimes only, or first-class context support for `state: "CA"`?
4. **Soft opt-in scoping under PECR**: "similar products" is fact-specific. Do we expose a boolean, or force the caller to assert similarity?
5. **Bundling integrations**: ship `m24t-brevo`, `m24t-resend` as separate npm packages, or sub-paths? Sub-paths win for discovery; separate packages win for tree-shaking and independent versioning.

## Non-goals (reiterated)

- Not legal advice.
- Not a consent UI library.
- Not an ESP wrapper.
- Not a cookie banner.
