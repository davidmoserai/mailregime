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

`v0.1.0` — early. Public API may change in any minor version (standard 0.x contract). Pin a version, read diffs.

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

Zero runtime dependencies. ESM only. Edge-runtime safe.

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
- [x] Seed data: US, GB, DE, CA (incl. Quebec), AU
- [x] ISO/IEC TS 27560:2023 audit-record serializer
- [x] Vercel adapter
- [x] Cloudflare Workers adapter
- [x] Static + generic-header adapters
- [x] Tests + CI
- [ ] Seed data: FR, BR, IN, JP (next batch)
- [ ] Brevo integration
- [ ] Resend integration
- [ ] v0.1 publish to npm

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Contributions licensed under MIT with the [DISCLAIMER](DISCLAIMER.md). Country data PRs without primary-source citations will be closed.

## License

MIT — but read the **additional disclaimer** in [LICENSE](./LICENSE). It is binding on every user.
