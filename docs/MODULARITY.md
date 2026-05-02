# Modularity

m24t's primary design constraint is that **regulators will keep adding rules forever**. New laws, new amendments, new case law, new state-level acts. The library has to absorb that without forcing every consumer onto a new major version.

This doc lists the rules each module commits to, the boundaries between them, and the things that can change without breaking the API.

---

## The four modules

```
   ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌──────────┐
   │   core   │  │   data   │  │   adapters   │  │  audit   │
   └──────────┘  └──────────┘  └──────────────┘  └──────────┘
   pure          versioned     country/region    stateless
   function      separately    detection         serializer
   • types       from lib      • vercel          • ISO 27560
   • rules eval  • per-country • cloudflare      • no I/O
                  JSON         • header
                              • maxmind
                              • static (test)

                    ┌──────────────────┐
                    │   integrations   │
                    └──────────────────┘
                    one per ESP
                    • brevo
                    • mailchimp
                    • klaviyo
                    • resend
```

Each is independently extensible without touching the others.

---

## Versioning rules

The library has **two version axes**:

1. **Library SemVer** — code surface (function signatures, types, module paths).
2. **`consentDataVersion`** — legal data shipped in `m24t/data`. Versioned **separately** from the library, mirrors how `tzdata` decouples from libc.

Why two axes:

- A new German court ruling that changes how `DE` is classified is **not** a library change. It bumps `consentDataVersion`. Apps update at their own pace.
- A new field on `EmailRules` (e.g. China-specific `crossBorderTransferMechanism: "explicit-consent"` value) **is** a library change. Apps explicitly opt in by upgrading.

Apps pin the data version explicitly:

```ts
import { configure } from "m24t"
configure({ consentDataVersion: "2026-Q2" })  // pinned
```

Auto-update on minor library upgrades is opt-in (`consentDataVersion: "latest"`), never default. Silent regulatory data drift is a compliance risk, not a feature.

---

## What each module guarantees

### core

- **Pure.** No I/O. No globals beyond `configure()`. Same input → same output.
- **Edge-safe.** Runs on Vercel Edge, Cloudflare Workers, Deno. No Node APIs.
- **Sync.** `getEmailRules()` is synchronous. Always.
- **Throws on unknown country by default.** No silent permissive fallback.
- **Stable types.** `EmailRules` fields can be **added** in minor versions, **removed only in major**. Adding values to discriminated unions (e.g. a new `optIn: "implied"`) is a major bump.

### data

- **JSON, not code.** Per-country files in `m24t/data/countries/{ISO3166-1}.json`.
- **Tree-shakable per country.** Apps that operate in 5 markets ship 5 country files.
- **Carries metadata per record:** `code`, `regime`, `subRegime`, `statute`, `url`, `lastReviewed`, `confidence`, `extraterritorialReach`.
- **Rolling reviews.** Each country has a `lastReviewed` date. Library logs a console warning in dev when a queried country's data is >12 months old.
- **No code in data.** Functions like `buildAuditRecord` live in core, not data. Data is purely declarative.

### adapters (country detection)

- **Single contract:**
  ```ts
  type CountryDetection = {
    country: string | null              // ISO 3166-1 alpha-2
    region: string | null               // ISO 3166-2
    source: "header" | "geoip" | "self-declared" | "static"
    confidence: "high" | "low"
  }
  ```
- Anything that produces this shape plugs in. Vercel adapter reads `x-vercel-ip-country`. Cloudflare reads `cf-ipcountry`. MaxMind is async. Static is for tests.
- **No detection adapter is mandatory.** Apps can pass `{ country: "DE" }` directly.
- Future detection sources (a Vercel-native integration, a header from a different CDN, a self-declared profile field) are **new adapter packages, not core changes**.

### integrations (ESPs)

- **Single contract per direction:**
  ```ts
  type EspBinding = {
    routeForOptIn(rules: EmailRules, contact: Contact): EspApiCall
    exportAuditTrail(date: Date): AsyncIterable<AuditRecord>
  }
  ```
- Each ESP integration emits the right shape for that ESP (Brevo `/contacts/doi` vs `/contacts`; Mailchimp `double_optin` flag) **and** a portable AuditRecord export so the snapshot strategy in [CONSENT_STORAGE.md](./CONSENT_STORAGE.md) is one line.
- **Adding a new ESP is a new package, not a core change.** Pattern is fixed; volume is open-ended.

### audit

- **Stateless serializer.** No I/O. No DB. No connection pools.
- **ISO/IEC TS 27560:2023 aligned.** `serializeISO27560(record)` produces a strict-schema consent receipt.
- Audit records are **portable JSON documents**. Storage is the caller's problem; the library never recommends one.

---

## Extension points (no major bump needed)

The following can be added without breaking the API:

| Change | Where | Bump |
|---|---|---|
| New country | `m24t/data/countries/XX.json` | data version only |
| New subRegime under existing country | same JSON | data version only |
| Updated `lastReviewed` / `confidence` | same JSON | data version only |
| New context (e.g. `"abandoned-cart"`) | core types + per-country mapping | minor library |
| New adapter (e.g. AWS CloudFront geo) | new package `m24t-adapter-cloudfront` | independent |
| New ESP integration | new package `m24t-integration-X` | independent |
| New optional field on `EmailRules` | core types | minor library |
| New value in a discriminated union (e.g. `optIn: "implied-30day"`) | core types | **major library** |

The major-bump line is deliberate: anything that changes the **shape of an exhaustive switch** in consumer code requires explicit consent, and that's what major version bumps are for.

---

## What forks and downstream layers can do

Some companies will need rules m24t doesn't ship — internal legal interpretations, jurisdiction-specific carve-outs, niche regulators (Channel Islands, Faroe Islands, Vatican). m24t supports this without forking:

```ts
import { getEmailRules, registerCountry } from "m24t"

registerCountry({
  code: "GG",                        // Guernsey, not in default data
  regime: "DPA-2017",
  ...
})

const rules = getEmailRules({ country: "GG", context: "newsletter-signup", relationship: "none" })
```

Custom-registered countries override the bundled data. Diff-able, testable, lawyer-reviewable per company.

---

## Things that will NOT change

These guarantees are load-bearing and won't move without a major version bump and a long deprecation window:

1. `getEmailRules()` is sync.
2. The input triple is `(country, context, relationship)`. `region` is optional. Anything else is in `configure()` or per-call options.
3. `AuditRecord` is JSON-serializable, has a `schemaVersion`, and is a superset of ISO 27560.
4. Core has zero runtime dependencies.
5. The library never opens a database, file, or network connection.
6. `unknownCountryPolicy: "throw"` is the default. Permissive defaults are opt-in.

---

## Things that probably WILL change

Be ready for these in the first 12 months post-v1:

- Additional contexts as we discover real-world miscategorisations (especially around B2B and event-driven flows).
- More granular `senderIdentity` requirements (Quebec, Catalonia, Italy Garante).
- A `tcpa-sms` shadow output for SMS use cases — likely a sister library `m24t-sms` rather than a core change.
- A consent-receipt verification helper (`verifyAuditRecord(record, publicKey)`) once Kantara publishes a standard signing scheme.
