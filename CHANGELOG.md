# Changelog

All notable changes to mailregime will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Note that **0.x releases may include breaking changes in any minor version** — this is the conventional pre-1.0 contract.

## [0.2.0] - 2026-05-03

### Added — enricher pattern

`mailregime/enrichers/*` — per-jurisdiction region refinement for sub-national regions that CDN headers can't surface (no ISO 3166-2 code, or just not exposed by the edge). Pure functions, same `CountryDetection` shape as adapters, opt-in per import, tree-shakeable.

First shipped enricher: **`mailregime/enrichers/be`** — refines a Belgian detection to `BE-DG` (Deutschsprachige Gemeinschaft) when the caller provides a postal code, declared locale, or billing city signal. End-to-end test verifies a German-speaking Belgian gets `de-BE` consent language instead of the default `fr-BE`/`nl-BE`.

See [docs/MODULARITY.md](docs/MODULARITY.md) for the contract.

### Added — 22 new jurisdictions (Tier 2)

Total country count now **27**. New records cover most of the major
markets a small-to-mid app would need:

- **EU/EEA core:** FR (LCEN), IT (Garante / D.Lgs. 196/2003 + Cassazione 2025 soft-spam ruling), ES (LSSI), NL (Telecommunicatiewet), BE (CDE Art. XII.13 + `BE-DG` German-speaking Community region override), IE (S.I. 336/2011), AT (TKG 2021), PL (PKE 2024 — strictest, no soft opt-in), SE (MFL §19), DK (MFL §10)
- **EFTA / non-EU Europe:** CH (FADP + UWG), NO (MFL §15)
- **APAC:** JP (Specified Electronic Mail Act + APPI), KR (Network Act §50 — must subject-prefix "(광고)"), SG (PDPA + Spam Control Act), IN (DPDP 2023 + Rules 2025, no soft opt-in, age 18, ₹250cr penalties), NZ (UEMA, deemed B2B consent)
- **LatAm:** BR (LGPD + Lei 15.211/2025 children), MX (LFPDPPP, tacit consent permitted)
- **MENA + Africa:** AE (PDPL + TDRA SPAM Policy, Arabic+English required), IL (PPL + Comm Law §30A, "פרסומת" subject prefix), ZA (POPIA §69, one-shot rule)

Every record carries primary-source citations (statute + regulator
URL). All new records ship at `confidence: "medium"` until lawyer
review.

### Changed (BREAKING)

- `EmailRulesData.suggestedTemplate`: renamed value `"brevo-doi"` →
  `"double-opt-in"`. ESP-agnostic.

  **Migration:** in your codebase, run
  `git grep -l '"brevo-doi"' | xargs sed -i '' 's/"brevo-doi"/"double-opt-in"/g'`
  (drop the `''` after `-i` on Linux). Or just match on
  `rules.optIn === "double"` instead — they're equivalent.

- `B2BExemption.regime` widened with `"publicly-disclosed"` and
  `"function-address"` values. Existing values unchanged.

### Notes

- Engines remain `>=20`; CI matrix Node 20+22.
- 36 tests now passing (added per-country smoke tests for FR, IN, PL,
  NZ, BE region override, and Tier-2 registry membership).
- The default policy for unknown countries is still `"throw"` —
  expanding the bundled set does NOT change behavior for callers
  who pass an unbundled country code.

[0.2.0]: https://github.com/davidmoserai/mailregime/releases/tag/v0.2.0

## [0.1.2] - 2026-05-03

### Changed

- Bumped `engines.node` to `>=20`. Node 18 doesn't have `crypto` as a global (it became one in Node 19+), which broke the audit module. Dropped Node 18 from the CI matrix.

[0.1.2]: https://github.com/davidmoserai/mailregime/releases/tag/v0.1.2

## [0.1.1] - 2026-05-03

### Added

- npm Trusted Publishers (OIDC) — releases now publish via GitHub Actions on tag push, with verified provenance badge on npmjs.com. No NPM_TOKEN secret. No manual OTP.

[0.1.1]: https://github.com/davidmoserai/mailregime/releases/tag/v0.1.1

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
