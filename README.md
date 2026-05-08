# mailregime

> The c15t for email marketing law.

`mailregime` is a country-code → email-marketing-consent-rules library. Inspired by [c15t](https://c15t.com) (which solved the same problem for cookie banners), but for email opt-in / opt-out law instead.

You give it where the user is, why you're collecting their email, and what your relationship with them is. It tells you whether you can email them, what kind of opt-in is required, what the audit trail must contain, and which statute it's referring to.

---

## ⚠️ READ FIRST — DISCLAIMER

**This software is informational only. It is not legal advice.** It does not create an attorney–client relationship. The bundled data may be wrong, out of date, incomplete, or inapplicable to your facts. Use of mailregime is entirely at your own risk. The maintainers carry **zero liability** for any consequence of your use, including regulatory fines, litigation, or business loss. You **must** retain qualified counsel for your specific use case.

**Three things you should know before installing:**

1. **mailregime was written largely with an AI coding assistant.** Bugs are expected. Pin a version, read diffs, verify outputs.
2. **No lawyer reviews this software or its data.** The maintainers are not lawyers and do not retain lawyers to vet what ships. If you are an expert in privacy law and you spot a mistake, please [open an issue or a PR](./COLLABORATION.md) — that is how the data gets better.
3. **mailregime is offline.** It runs in your process, returns data, opens no network connections, stores nothing, transmits nothing. Inputs stay with you.

Full terms in [LICENSE](./LICENSE), [DISCLAIMER.md](./DISCLAIMER.md), [CONTRIBUTING.md](./CONTRIBUTING.md), [COLLABORATION.md](./COLLABORATION.md). **By using this software you agree to those terms.**

---

## Status

`v0.5.0` — 67 countries bundled. Storage layer rebuilt on top of [`fumadb`](https://www.npmjs.com/package/fumadb) so you bring your own ORM client (Prisma, Drizzle, Kysely, TypeORM, MongoDB). The bundled `PostgresStore` and `npx mailregime` CLI shipped in `v0.4.x` were removed — see the migration note below. Public API may change in any minor version (standard 0.x contract). Pin a version, read diffs.

- [docs/DESIGN.md](docs/DESIGN.md) — full API, decision matrix, edge cases, architecture.
- [docs/CONSENT_STORAGE.md](docs/CONSENT_STORAGE.md) — do I need a consent database? (short answer: no, but).
- [docs/MODULARITY.md](docs/MODULARITY.md) — what each module guarantees and how to extend without a major bump.
- [AGENTS.md](AGENTS.md) — guidance for AI coding agents integrating mailregime.
- [CHANGELOG.md](CHANGELOG.md) — release notes.
- [DISCLAIMER.md](DISCLAIMER.md) — full disclaimer.

## Install

```bash
npm install mailregime
# or: pnpm add mailregime  /  yarn add mailregime  /  bun add mailregime
```

Zero runtime dependencies for the rules engine. ESM only. Edge-runtime safe.

## Self-host audit trail (optional)

If you want mailregime to handle consent-receipt storage for you (still in **your** database — we never host data), you bring your own ORM client and mailregime wraps it. Same pattern as [`@c15t/backend`](https://www.npmjs.com/package/@c15t/backend); under the hood both libraries use [fumadb](https://www.npmjs.com/package/fumadb) to translate one schema into per-ORM queries, so users get c15t-style "drop in your existing client and it just works" UX.

### 1. Install peer deps

```bash
# core + the fumadb runtime that the storage layer is built on
npm install mailregime fumadb
```

### 2. Generate the schema for your ORM

The shape mailregime expects is exposed via the standard fumadb codegen flow. Pick the adapter for your stack and run once:

```ts
// scripts/print-mailregime-schema.ts
import { factory } from "mailregime/store"
import { prismaAdapter } from "mailregime/store/adapters/prisma"
//   or: drizzleAdapter / kyselyAdapter / typeormAdapter / mongoAdapter

const db = factory.client(prismaAdapter({ prisma: {} as never, provider: "postgresql" }))
console.log(db.generateSchema("1.0.0", "prisma").code)
```

Run it (`tsx scripts/print-mailregime-schema.ts`) and paste the output into your `prisma/schema.prisma` (or `drizzle/schema.ts`, etc.). Then run your ORM's migration tool — `prisma migrate dev`, `drizzle-kit push`, etc. The canonical SQL table name is `mailregime_consent_receipts`; if you applied an older mailregime SQL migration, the new schema is identical and there is nothing to migrate.

### 3. Use it in your route handler

```ts
import { getEmailRules } from "mailregime"
import { consentStore } from "mailregime/store"
import { prismaAdapter } from "mailregime/store/adapters/prisma"
import { prisma } from "@/lib/prisma" // your existing Prisma client

const store = consentStore({
  database: prismaAdapter({ prisma, provider: "postgresql" }),
})

const rules  = getEmailRules({ country, context: "newsletter-signup", relationship: "none" })
const record = await rules.buildAuditRecord({ ip, userAgent, sourceUrl, wording, formVersion })
await store.save(record, rules)

// GDPR Art. 15 access request
const history = await store.findBySubject(userIdHash)

// On unsubscribe
await store.withdraw(consentId, "one-click-unsub")

// Cron sweep — deletes receipts past their retention window
await store.sweep({ limit: 1000 })
```

Don't want the storage helper? **Skip it.** Importing `mailregime` alone never touches a database; the storage layer only loads when you import from `mailregime/store`.

### Migrating from `v0.4.x` PostgresStore

`v0.4.x` shipped a `PostgresStore` that opened its own pg connection and a `npx mailregime` CLI for migrations. Both are gone in `v0.5.0`:

- Replace `new PostgresStore({ connectionString })` with `consentStore({ database: <fumadb adapter> })` as shown above. The wire is now whatever your ORM client is configured against — managed-Postgres SSL just works.
- Replace `npx mailregime init / migrate` with the codegen + your-ORM-migrate flow above.
- Drop the `postgres` peer dep — mailregime no longer needs it.
- The SQL table (`mailregime_consent_receipts`) and column names are unchanged. No data migration required.

## Install with an AI agent

If you use Claude Code, Cursor, Codex, Aider, Windsurf, or similar — paste this prompt:

````markdown
Install and wire up the `mailregime` library in this project.

Steps:
1. `npm install mailregime`
2. Read https://github.com/davidmoserai/mailregime/blob/main/AGENTS.md for integration guidance.
3. In every API route that collects an email for marketing purposes:
   - import { getEmailRules } from "mailregime"
   - import the matching adapter (vercel, cloudflare, or header)
   - call getEmailRules({ country, region, context, relationship })
   - branch on rules.canCollectForMarketing and rules.optIn
   - persist rules.buildAuditRecord({...}) to whatever storage I already use
4. Add `process.env.MAILREGIME_SILENCE_DISCLAIMER = "1"` in test files.
5. Do NOT remove or modify any disclaimer language anywhere.
6. mailregime is informational only, not legal advice — preserve that posture
   in any code comments you add.
````

mailregime ships an [`AGENTS.md`](./AGENTS.md) and an [`llms.txt`](./llms.txt) so agents can fetch full context in one request.

## Why this exists

Cookie consent has [c15t](https://c15t.com). Email marketing law has nothing equivalent.

ESP SDKs (Brevo, Mailchimp, Klaviyo, Resend) handle the *mechanics* of double opt-in but punt the legal "which country requires what" decision to the developer. Existing country-set libraries (`eu-countries`, c15t's classifier, etc.) are built for cookie/tracking law — a meaningfully different scope from email marketing law.

The result: every app that does email marketing across borders re-implements the same jurisdiction switch, usually wrong, usually with a TODO comment about "fix this later when we expand."

`mailregime` aims to be the shared, citation-backed source of truth.

## Quickstart

```ts
import { getEmailRules } from "mailregime"
import { fromVercelRequest } from "mailregime/adapters/vercel"

const { country } = fromVercelRequest(request)

const rules = getEmailRules({
  country,                    // "DE" | "US" | null
  context: "lead-magnet",     // newsletter-signup | lead-magnet
                              // | account-signup | purchase
                              // | transactional | drip-onboarding
                              // | abandoned-cart | referral
                              // | co-registration | event-registration
                              // | channel-migration | win-back
  relationship: "none",       // none | existing-customer | former-customer
                              // | inquirer | donor | member
                              // | publicly-listed-business | b2b-cold
})

if (!rules.canCollectForMarketing) {
  // strict regime + lead-magnet → cannot auto-add to newsletter
}

if (rules.optIn === "double") {
  // trigger DOI flow
}

const auditRecord = await rules.buildAuditRecord({
  ip, userAgent, sourceUrl, wording, formVersion,
})
// → ISO/IEC TS 27560:2023-aligned consent receipt. Persist anywhere.
```

See [docs/DESIGN.md](docs/DESIGN.md) for the full output shape, edge cases, and architecture.

## Non-goals

- **Not legal advice.** See [DISCLAIMER.md](DISCLAIMER.md).
- **Not a consent UI library.** Bring your own checkbox.
- **Not an ESP wrapper.** Integrations are thin adapters that emit the right shape for each ESP; the ESP itself does the sending.
- **Not a cookie banner.** That's c15t.
- **Not a consent database.** See [docs/CONSENT_STORAGE.md](docs/CONSENT_STORAGE.md). mailregime is stateless and never opens a connection to anything.

## Roadmap

- [x] Design doc
- [x] Consent-storage doc
- [x] Modularity contract
- [x] Liability shields (LICENSE, DISCLAIMER, CONTRIBUTING, SECURITY, COLLABORATION + GitHub issue/PR templates)
- [x] Core API + types
- [x] ISO/IEC TS 27560:2023 audit-record serializer
- [x] Vercel adapter
- [x] Cloudflare Workers adapter
- [x] Static + generic-header adapters
- [x] Tests + CI
- [x] **67 bundled countries** — full EU/EEA, Anglo, key APAC + LATAM + MENA + ZA + RU + UA. See [`src/data/countries/`](src/data/countries/).
- [x] npm publish with verified provenance (OIDC trusted publisher)
- [x] **fumadb-based storage** — bring-your-own ORM (Prisma, Drizzle, Kysely, TypeORM, MongoDB) — replaces the v0.4 bundled PostgresStore + CLI
- [ ] Brevo integration
- [ ] Resend integration

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Contributions licensed under MIT with the [DISCLAIMER](DISCLAIMER.md). Country data PRs without primary-source citations will be closed.

## License

MIT — but read the **additional disclaimer** in [LICENSE](./LICENSE). It is binding on every user.
