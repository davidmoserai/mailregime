# Changelog

All notable changes to mailregime will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Note that **0.x releases may include breaking changes in any minor version** — this is the conventional pre-1.0 contract.

## [0.3.3] - 2026-05-03

### Removed

- **`routines/` directory** (introduced in v0.3.2) — scheduled prompts belong on the maintainer's Claude account via `/schedule`, not in the repo. Versioning the prompt twice (account + file) creates a drift risk for no benefit. Source-of-truth for the verification routine is now the maintainer's account; users with no schedule run nothing, which is fine — DISCLAIMER's "best effort, no timeliness promise" already covers it.

### Changed

- **DISCLAIMER.md + COLLABORATION.md** — verification cadence wording updated `typically weekly` → `typically monthly`. Honest match to the actual cadence we'll run. Email-marketing law doesn't change weekly across 27 jurisdictions; weekly verification was aspirational and would burn subscription quota for ~99% no-op runs.

### Note on v0.3.2

v0.3.2 shipped `routines/` as a package directory. It has zero runtime impact (no code touched the runtime library), so installs of v0.3.2 are safe to keep. v0.3.3 supersedes it cleanly.

[0.3.3]: https://github.com/davidmoserai/mailregime/releases/tag/v0.3.3

## [0.3.2] - 2026-05-03

### Added (later removed in v0.3.3)

- `routines/` directory — superseded by maintaining the prompt on the Claude account directly. See v0.3.3 for the rationale.

[0.3.2]: https://github.com/davidmoserai/mailregime/releases/tag/v0.3.2

## [0.3.1] - 2026-05-03

Audit-driven hardening of the v0.3.0 storage layer. No public API changes; safe upgrade.

### Fixed

- **`PostgresStore.migrate()` race + idempotency** — wraps the per-migration apply loop in a transaction with `pg_advisory_xact_lock` so concurrent app boots serialise on the migration step. Bookkeeping table is created outside the lock with `CREATE TABLE IF NOT EXISTS`. Inline SQL no longer self-bookkeeps; the loop owns it. Reconciled the inline SQL with the canonical `schemas/postgres/0001_init.sql` so the two paths produce identical schema.
- **`PostgresStore.sweep()`** — now bounded by `{ limit }` (default 10,000) using a `consent_id IN (SELECT … LIMIT n)` subquery to avoid huge transactions locking the table. Call again until `deleted < limit`.
- **`PostgresStore.findBySubject()`** — now rejects empty / whitespace-only `subjectId` rather than silently returning all anonymous (NULL) receipts. Matches GDPR Art. 15 semantics: anonymous receipts cannot be queried by subject.
- **`PostgresStore.withdraw()` / `purgeOnWithdrawal()`** — JSDoc clarifies they apply different Art. 17 interpretations and shouldn't be chained on the same row.
- **`toRow()` JSDoc** — explicitly documents that `delete_after` is FROZEN at insert time. If a country later extends its retention rule, callers wanting "longest applicable retention" semantics must run their own UPDATE batch.
- **`addMonths()` comment** — clarified JS Date month-end rollover behaviour (Jan 31 + 1 month → Mar 3); softened editorial wording.
- **CLI `init`** — now warns when an existing template file is skipped instead of silently skipping.
- **Schema-divergence test** — new `tests/schema-divergence.test.ts` asserts the inline migration SQL in `src/store/postgres.ts` matches `schemas/postgres/0001_init.sql`. Prevents silent drift if a maintainer edits one and forgets the other.

### Tests

53/53 pass (was 50). Added 5 store tests (round-trip, leap-year, month-end), 1 schema-divergence test. Deep end-to-end exercise of every public surface (44/44) against a fresh install from the package tarball.

[0.3.1]: https://github.com/davidmoserai/mailregime/releases/tag/v0.3.1

## [0.3.0] - 2026-05-03

### Added — self-host consent-receipt storage

Optional, opt-in only. Library core stays stateless and offline; the storage helper is a separate sub-import that opens a connection to **your** Postgres database with **your** connection string and writes receipts to **your** schema. mailregime does not host data, does not run a service, and does not phone home. See updated [DISCLAIMER.md](DISCLAIMER.md).

- **`mailregime/store/postgres`** — `PostgresStore` class with:
  - `migrate()` — idempotent migration runner
  - `save(record, rules)` — INSERT a consent receipt; computes `delete_after` from the country's retention rule so retention sweeps are a single indexed DELETE
  - `findBySubject(subjectId)` — GDPR Art. 15 access-request helper
  - `withdraw(consentId, method)` — keeps row until original `delete_after`
  - `purgeOnWithdrawal(consentId, method)` — strict-erasure variant (advances `delete_after` to NOW())
  - `sweep()` — daily-cron retention sweep
- **`mailregime/store`** — `toRow(record, rules)` and `fromRow(row)` pure mapping functions for users with their own ORM client (Drizzle, Prisma, Kysely, raw pg)
- **`schemas/`** — canonical SQL DDL + ORM fragments shipped in the package:
  - `postgres/0001_init.sql` — apply with any tool (`psql`, `atlas`, `sqitch`, `dbmate`, raw)
  - `drizzle/schema.ts` — Drizzle table fragment
  - `prisma/schema.prisma` — Prisma model fragment
  - `kysely/types.ts` — Kysely TS types
- **`npx mailregime init`** — interactive setup. Prompts for SQL flavor and ORM, copies the matching schema fragment into your repo, optionally runs the migration against a connection string you provide.
- **`npx mailregime migrate`** — non-interactive. Reads `DATABASE_URL` (or `--connection`) and applies pending migrations.

The schema includes a `delete_after` column computed at insert time from the country's `consentRecordRetentionMonths`. Retention sweeps run as one indexed DELETE — no JSONB extraction, no full table scans.

### Changed

- **DISCLAIMER.md** — clarified that "offline" applies to the rules engine; the optional storage helper opens a connection to your DB only when you explicitly import it.
- **package.json** — adds `bin: { mailregime }`, sub-path exports for `./store` and `./store/postgres`, optional `postgres` peer dependency, `@clack/prompts` for the CLI.

### Honest tradeoffs

- The CLI runs at developer-machine setup time. The runtime library never imports it.
- `postgres` is a peer dependency — install it only if you use `PostgresStore`. Tree-shaking ensures core users don't pull it.
- MySQL / SQLite / MongoDB adapters are not yet shipped. Add when a user files an issue. The canonical SQL DDL is a starting point for non-Postgres users.

[0.3.0]: https://github.com/davidmoserai/mailregime/releases/tag/v0.3.0

## [0.2.1] - 2026-05-03

Verification pass on the original 5 countries (US, GB, DE, CA, AU) — same primary-source spot-check process applied to Tier-2 in v0.2.0. CA + AU verified clean. Three corrections applied:

### Changed

- **DE** — `basis.url` switched from third-party `gdpr-info.eu` to primary source `gesetze-im-internet.de/uwg_2004/__7.html`. Comment on `impliedConsentTtlMonths: 24` clarifies it's industry baseline, not statutory.
- **GB** — header comment updated to reflect Data (Use and Access) Act 2025 (Royal Assent 19 June 2025): DUAA softens some GDPR-derived obligations, raises PECR fines to UK GDPR levels (£17.5m / 4%), adds a charity soft opt-in to PECR Reg 22 commencing early 2026. The `donor` relationship now grants soft opt-in. `dataResidency.crossBorderTransferMechanism` corrected from `"scc"` to `"idta"` (UK uses IDTA / UK Addendum to EU SCCs, not raw EU SCCs). `optIn: "double"` retained but documented as ICO best-practice / evidentiary standard, not statute.
- **US** — header comment expanded to acknowledge the 2023-2026 wave of state privacy laws (TX TDPSA, OR OCPA, MT MCDPA, TN TIPA, DE DPDPA, IA, NH, NJ, MN, MD MODPA, RI, IN, KY) plus the California Delete Act / DROP (operative 1 Aug 2026). Comment on `consentRecordRetentionMonths: 60` clarifies it's a maintainer heuristic, not a CAN-SPAM rule.
- **types.ts** — `dataResidency.crossBorderTransferMechanism` enum widened with `"idta"` for UK transfers.

### Why this matters

The verification pass against primary sources caught real currency drift — the same kind of drift that v0.2.0's pass caught in the new 22 countries (BR fabricated laws, MX 2025 reform, KR repealed re-consent rule). Now all 27 bundled countries have been spot-checked.

[0.2.1]: https://github.com/davidmoserai/mailregime/releases/tag/v0.2.1

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
