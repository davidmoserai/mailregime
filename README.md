# m24t

> The c15t for email marketing law.

`m24t` (short for **marketing consent management** — `m` + 24 letters + `t`) is a country-code → email-marketing-consent-rules library.

You give it where the user is, why you're collecting their email, and what your relationship with them is. It tells you whether you can email them, what kind of opt-in is required, what the audit trail must contain, and which statute it's referring to.

---

## ⚠️ READ FIRST — DISCLAIMER

**This software is informational only. It is not legal advice.** It does not create an attorney–client relationship. The bundled data may be wrong, out of date, incomplete, or inapplicable to your facts. Use of m24t is entirely at your own risk. The maintainers carry **zero liability** for any consequence of your use, including regulatory fines, litigation, or business loss. You **must** retain qualified counsel for your specific use case. Full terms in [LICENSE](./LICENSE), [DISCLAIMER.md](./DISCLAIMER.md), [CONTRIBUTING.md](./CONTRIBUTING.md). **By using this software you agree to those terms.**

---

## Status

🚧 **Design + early implementation phase.** Public API is not stable. Do not use in production.

- [docs/DESIGN.md](docs/DESIGN.md) — full API, decision matrix, edge cases, architecture.
- [docs/CONSENT_STORAGE.md](docs/CONSENT_STORAGE.md) — do I need a consent database? (short answer: no, but).
- [docs/MODULARITY.md](docs/MODULARITY.md) — what each module guarantees and how to extend without a major bump.
- [DISCLAIMER.md](DISCLAIMER.md) — full disclaimer.

## Why this exists

Cookie consent has [c15t](https://c15t.com). Email marketing law has nothing equivalent.

ESP SDKs (Brevo, Mailchimp, Klaviyo, Resend) handle the *mechanics* of double opt-in but punt the legal "which country requires what" decision to the developer. Existing country-set libraries (`eu-countries`, c15t's classifier, etc.) are built for cookie/tracking law — a meaningfully different scope from email marketing law.

The result: every app that does email marketing across borders re-implements the same jurisdiction switch, usually wrong, usually with a TODO comment about "fix this later when we expand."

`m24t` aims to be the shared, citation-backed source of truth.

## Planned shape

```ts
import { getEmailRules } from "m24t"
import { fromVercelRequest } from "m24t/adapters/vercel"

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
- **Not a consent database.** See [docs/CONSENT_STORAGE.md](docs/CONSENT_STORAGE.md). m24t is stateless and never opens a connection to anything.

## Roadmap

- [x] Design doc
- [x] Consent-storage doc
- [x] Modularity contract
- [x] Liability shields (LICENSE, DISCLAIMER, CONTRIBUTING)
- [ ] Core API + types
- [ ] Seed data: US, GB, DE, FR, CA (incl. Quebec), AU, BR, IN, JP
- [ ] ISO/IEC TS 27560:2023 audit-record serializer
- [ ] Vercel adapter
- [ ] Cloudflare Workers adapter
- [ ] Brevo integration
- [ ] Resend integration
- [ ] v0.1 publish to npm (gated on disclaimer review)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Contributions licensed under MIT with the [DISCLAIMER](DISCLAIMER.md). Country data PRs without primary-source citations will be closed.

## License

MIT — but read the **additional disclaimer** in [LICENSE](./LICENSE). It is binding on every user.
