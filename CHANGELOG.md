# Changelog

All notable changes to mailregime will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Note that **0.x releases may include breaking changes in any minor version** — this is the conventional pre-1.0 contract.

## [0.1.0] - 2026-05-03

Initial public release.

### Added

- **Core API** — `getEmailRules({ country, region?, context, relationship })` returns structured email-marketing-consent rules (single/double/express/blocked opt-in, checkbox requirements, consent language, statute citation).
- **5 bundled country regimes** — `US` (CAN-SPAM), `GB` (UK GDPR + PECR), `DE` (GDPR + UWG §7), `CA` (CASL + PIPEDA), `AU` (Spam Act 2003). Quebec (Law 25 + Bill 96) as a region override on `CA`.
- **12 contexts** — newsletter-signup, lead-magnet, account-signup, purchase, transactional, drip-onboarding, abandoned-cart, referral, co-registration, event-registration, channel-migration, win-back.
- **8 relationship states** — including CASL-specific `inquirer`, `donor`, `member`, `publicly-listed-business`, and `b2b-cold`.
- **Adapters** — `mailregime/adapters/vercel`, `mailregime/adapters/cloudflare`, `mailregime/adapters/header` (generic), `mailregime/adapters/static` (testing + non-header sources). `mergeDetections()` for combining multiple sources.
- **Audit module** — `buildAuditRecord(ctx)` returns ISO/IEC TS 27560:2023-aligned consent receipts. `serializeISO27560()` projects to the standard format. `redactReceipt()` produces an Art-17-erasure-compatible redacted version.
- **Configuration** — `configure({ unknownCountryPolicy: "throw" | "strict" | "permissive", consentDataVersion, staleDataWarnAfterMonths })`.
- **Custom country support** — `registerCountry(data)` lets callers add their own jurisdictions or override bundled records.
- **Liability ring** — LICENSE with extensive additional disclaimer, DISCLAIMER.md, CONTRIBUTING.md, COLLABORATION.md, SECURITY.md, GitHub issue/PR templates.
- **Agent docs** — AGENTS.md, llms.txt for AI-coding-agent integration.
- **Tests** — 30 unit tests + e2e install verification.
- **CI** — GitHub Actions matrix on Node 18/20/22.

### Disclaimers

- Informational only, not legal advice. See [DISCLAIMER.md](./DISCLAIMER.md).
- AI-assisted authorship (Claude Code).
- No lawyer reviews this software or its data.
- Country records carry `confidence: "medium"` until independently reviewed.

[0.1.0]: https://github.com/davidmoserai/mailregime/releases/tag/v0.1.0
