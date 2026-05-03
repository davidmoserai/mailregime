# Contributing

Thanks for considering a contribution. Read this first.

## By submitting a contribution, you agree:

1. **You license your contribution under the project's MIT License**, including the additional disclaimer in [LICENSE](./LICENSE) and [DISCLAIMER.md](./DISCLAIMER.md).
2. **You assume no responsibility, warranty, or liability** for downstream use of your contribution. You are not anyone's lawyer.
3. **You confirm you have the right to submit the contribution** — it is your original work, or you have permission to submit it under MIT.
4. **You are not creating an attorney–client relationship** with anyone via your contribution. You are not giving legal advice. You are submitting code or descriptive metadata to an open-source project.
5. **You agree your contribution may be modified, removed, or rejected** at the maintainers' sole discretion, without compensation or recourse.

If you do not accept these terms, do not submit a contribution.

## What contributions are welcome

- Bug fixes in the core, adapters, or audit module.
- New country data files following the schema in `src/types.ts`. **Each rule must include a primary-source citation** (statute, regulation, regulator guidance, or court ruling) with a working URL. PRs without citations will be closed.
- New adapters (CDN/header sources for jurisdiction detection).
- New ESP integrations.
- Documentation improvements.
- Test cases — especially conformance tests with citations.

## What is NOT welcome

- Removal of the LICENSE, DISCLAIMER, or any disclaimer text.
- Marketing claims about correctness, compliance, or fitness for purpose.
- Statements that imply mailregime is a substitute for legal advice.
- Country data without citations.
- Country data citing only secondary sources (blog posts, marketing pages, ChatGPT output) — primary sources only.

## Country data PRs

Every field change in a country data file must include in the PR description:

1. The statute, regulation, or guidance you're citing.
2. A direct URL to the primary source.
3. A short note on what the citation says and why it supports the field value.
4. Any known counter-arguments or unsettled questions, flagged honestly.

If a `lawyerAttestation` is being added, the PR must include a written confirmation from the named lawyer (uploaded as a PDF, linked, or otherwise verifiable) that they consent to being named and to the date and scope of the attestation. The maintainers reserve the right to reject attestations that cannot be verified.

## Code style

- TypeScript strict mode. No `any`. No `as` casts without a comment explaining why.
- Zero runtime dependencies in the core package.
- ESM only. Edge-runtime safe (no Node-only APIs in core).
- Each module documents what it commits to in [docs/MODULARITY.md](./docs/MODULARITY.md).

## Code of conduct

Be civil. Disagreements about legal interpretation are welcome and expected; personal attacks are not. Maintainers may close discussions and ban users at their discretion.

## Final reminder

You are contributing to a project explicitly disclaimed as informational, not legal advice. Do not represent yourself, your contribution, or the project as providing legal advice. Do not let users assume otherwise.
