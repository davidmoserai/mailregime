# m24t

> The c15t for email marketing law.

`m24t` (short for **marketing consent management** — `m` + 24 letters + `t`) is a country-code → email-marketing-consent-rules library.

You give it where the user is, why you're collecting their email, and what your relationship with them is. It tells you whether you can email them, what kind of opt-in is required, what the audit trail must contain, and which statute you're relying on.

## Status

🚧 **Design phase. No implementation yet.** This repo is currently just a design doc and a placeholder. See [docs/DESIGN.md](docs/DESIGN.md) for the planned API and rationale.

## Why this exists

Cookie consent has [c15t](https://c15t.com). Email marketing law has nothing equivalent.

ESP SDKs (Brevo, Mailchimp, Klaviyo, Resend) handle the *mechanics* of double opt-in but punt the legal "which country requires what" decision to the developer. Existing country-set libraries (`eu-countries`, c15t's classifier, etc.) are built for cookie/tracking law — a meaningfully different scope from email marketing law.

The result: every app that does email marketing across borders re-implements the same jurisdiction switch, usually wrong, usually with a TODO comment about "fix this later when we expand."

`m24t` aims to be the shared, citation-backed, lawyer-reviewed source of truth.

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
  relationship: "none",       // none | existing-customer | b2b-cold
})

if (!rules.canCollectForMarketing) {
  // strict regime + lead-magnet → cannot auto-add to newsletter
}

if (rules.optIn === "double") {
  // trigger DOI flow
}
```

See [docs/DESIGN.md](docs/DESIGN.md) for the full output shape, edge cases, and architecture.

## Non-goals

- **Not legal advice.** Ship-grade compliance still needs a lawyer for your specific use case.
- **Not a consent UI library.** Bring your own checkbox.
- **Not an ESP wrapper.** Integrations are thin adapters that emit the right shape for each ESP; the ESP itself does the sending.
- **Not a cookie banner.** That's c15t.

## Roadmap

- [ ] Design doc (in progress)
- [ ] Core API + types
- [ ] Seed data: US, GB, DE, FR, CA, AU, BR, IN, JP (the markets that move first)
- [ ] Vercel adapter
- [ ] Cloudflare Workers adapter
- [ ] Brevo integration
- [ ] Resend integration
- [ ] Lawyer review of seed data
- [ ] v0.1 publish to npm

## Contributing

Once the design stabilises, contributions will be gated on:

1. A statute citation per rule.
2. A `lastReviewed` date.
3. A confidence rating (`high` / `medium` / `low`).
4. Ideally, a note from a privacy lawyer in the relevant jurisdiction.

## License

MIT (planned).

## Disclaimer

**This library is informational, not legal advice.** Email marketing law is fact-specific and changes faster than open-source data. Pin a version, review changes, and have your own counsel sign off on your specific use case. Maintainers accept no liability for downstream compliance decisions.
