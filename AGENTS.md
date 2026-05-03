# Agent guide for mailregime

This file is for AI coding agents (Claude Code, Cursor, Codex, Aider, Windsurf, Jules, Copilot, etc.). It's a sibling to `README.md` and tells you how to use mailregime correctly in someone else's codebase.

## What mailregime is

A country-code → email-marketing-consent-rules library. Pure function in, structured rules out. **Offline. Stateless. No I/O. No telemetry. No storage.** It tells the caller what kind of opt-in is required (single / double / express / blocked), what the audit-record shape must contain, and which statute applies. The caller still does the actual ESP API calls themselves.

**It is informational only, not legal advice.** Every code change you make on behalf of a user should preserve the disclaimer ring (see `DISCLAIMER.md`). Do not remove or weaken any disclaimer language.

## Install

```bash
npm install mailregime
```

Zero runtime dependencies. ESM only. Edge-runtime safe (Vercel Edge, Cloudflare Workers, Deno, Bun, Node ≥18).

## Minimum-viable wiring (the 90% case)

```ts
import { getEmailRules } from "mailregime"
import { fromVercelRequest } from "mailregime/adapters/vercel"

export async function POST(request: Request) {
  const { country, region } = fromVercelRequest(request)

  const rules = getEmailRules({
    country,                     // "DE" | "US" | null
    region,                      // optional ISO 3166-2 e.g. "CA-QC"
    context: "newsletter-signup",
    relationship: "none",
  })

  if (!rules.canCollectForMarketing) return Response.json({ ok: true, addedToList: false })
  if (rules.optIn === "double")      { /* trigger DOI flow */ }
  else if (rules.optIn === "single") { /* add to list directly */ }

  // Persist an audit record (storage is YOUR problem; mailregime never touches a DB)
  const record = await rules.buildAuditRecord({
    ip: request.headers.get("x-forwarded-for"),
    userAgent: request.headers.get("user-agent"),
    sourceUrl: request.url,
    wording: "exact text shown to the user, including the form label",
    formVersion: "v1",
    countrySource: "header",
  })
}
```

For Cloudflare Workers, swap `fromVercelRequest` for `fromCloudflareRequest` from `mailregime/adapters/cloudflare`. For other CDNs, use `fromHeader` with the country header name.

## Inputs you must pass

- **`country`** — ISO 3166-1 alpha-2, or `null`. If `null`, mailregime throws by default. Configure with `configure({ unknownCountryPolicy: "strict" | "permissive" })` to fall back instead.
- **`context`** — one of: `"newsletter-signup" | "lead-magnet" | "account-signup" | "purchase" | "transactional" | "drip-onboarding" | "abandoned-cart" | "referral" | "co-registration" | "event-registration" | "channel-migration" | "win-back"`. Pick the one that matches the *primary purpose* of the form. If a user is submitting their email to download a lead magnet, that's `"lead-magnet"`, not `"newsletter-signup"` — different rules apply.
- **`relationship`** — one of: `"none" | "existing-customer" | "former-customer" | "inquirer" | "donor" | "member" | "publicly-listed-business" | "b2b-cold"`. Default is `"none"`.
- **`region`** — optional ISO 3166-2 (e.g. `"CA-QC"` for Quebec, `"US-CA"` for California). Some rules vary by region.

## Outputs you should act on

- `canCollectForMarketing: boolean` — if false, do not add to any marketing list (lead-magnets in EU/UK/CA require a separate checkbox).
- `optIn: "single" | "double" | "express" | "blocked"` — how to wire the ESP.
- `checkboxRequired: boolean` — whether a separate consent checkbox must be shown.
- `bundlingAllowed: boolean` — whether marketing consent can share a checkbox with ToS acceptance (false in GDPR).
- `prechecking: "forbidden" | "allowed"` — whether the checkbox can be pre-checked.
- `consentLanguage.required: string[]` — locales that must be used (e.g. `["fr-CA"]` for Quebec).
- `senderIdentity.physicalAddressRequired` etc. — what disclosures the sender must include in every message.
- `basis.statute` + `basis.url` — for citation in privacy notices.

## Audit records

`rules.buildAuditRecord(ctx)` returns an ISO/IEC TS 27560:2023-aligned consent receipt. It is JSON-serialisable. **Store it somewhere the user controls** (R2, S3, Postgres, ESP, anywhere). mailregime never opens a connection.

`serializeISO27560(record)` projects to the strict standard format for interop. `redactReceipt(record)` produces an Art-17-erasure-compatible redacted version.

## Things you should NOT do as an agent

- Do not remove or modify any `// INFORMATIONAL ONLY — NOT LEGAL ADVICE` headers.
- Do not weaken disclaimers in `DISCLAIMER.md`, `LICENSE`, `README.md`, or any source-file header.
- Do not add a runtime dependency to the core (zero-dep is a load-bearing constraint).
- Do not store consent records inside mailregime — it's stateless by design.
- Do not edit country data files (`src/data/countries/*.ts`) without a primary-source citation in the commit message. See `CONTRIBUTING.md`.
- Do not silence the disclaimer console warning except via the documented `MAILREGIME_SILENCE_DISCLAIMER=1` env var.

## Things you SHOULD do as an agent

- Set `process.env.MAILREGIME_SILENCE_DISCLAIMER = "1"` in test files.
- When adding mailregime to a project, also add a comment in the calling route file noting that the consent records the developer chooses to persist are *their* GDPR audit trail, not mailregime's.
- When the user says "make this GDPR compliant," remind them mailregime is informational only and they need their own counsel for compliance signoff.

## Repo conventions

- Strict TypeScript. No `any`. No `as` casts without a comment.
- ESM only. Edge-runtime safe (no Node-only APIs in core).
- Tests via `node --test --import tsx`. Run `npm test`.
- Build with `npm run build` (tsc to dist/).
- Commits: conventional-commits style, lowercase scope.

## Useful files

- `README.md` — user-facing docs.
- `docs/DESIGN.md` — architecture, decision matrix, edge cases.
- `docs/MODULARITY.md` — versioning + extension contract.
- `docs/CONSENT_STORAGE.md` — "do I need a consent DB" answer.
- `DISCLAIMER.md` — the load-bearing legal disclaimer ring.
- `src/types.ts` — full type surface.
- `src/data/countries/*.ts` — per-country rules with statute citations.
- `examples/nextjs-route.ts` — reference shape for a Next.js handler.
