# Collaboration

mailregime is open source, AI-assisted, and not lawyer-maintained. Contributions from people who know the law are how the library gets better. This doc is the inbound path.

> **Note on relationship:** Filing an issue, submitting a PR, joining a discussion, or being credited as a contributor does NOT create an attorney–client relationship between you and any user of mailregime, between you and any maintainer, or between any maintainer and any user. By contributing you accept the terms in [CONTRIBUTING.md](./CONTRIBUTING.md) and [DISCLAIMER.md](./DISCLAIMER.md). You take on no liability for downstream use, and the project takes on no liability for your contribution.

## Who we want to hear from

- **Privacy lawyers and DPOs** who can spot errors in the country data — wrong statute citation, wrong threshold, missing exemption, outdated guidance, misclassified context.
- **Developers** who use the library and find bugs, type-safety holes, or rough edges in the API.
- **Regulators or regulator-staff** willing to comment unofficially on whether a country record reflects current enforcement practice.
- **Translators** who can produce native-counsel-reviewed wording per (jurisdiction, language) pair (future).
- **Maintainers of related libraries** (c15t, ESP SDKs, consent-management tools) interested in interop.

## How to contribute

### Spotted a legal data error

Open a [Legal Correction issue](https://github.com/davidmoserai/mailregime/issues/new?template=legal_correction.md). Include:

1. Country code (and region if applicable).
2. The field you believe is wrong (e.g. `byContext.lead-magnet.canCollectForMarketing`).
3. The current value vs. what you believe it should be.
4. A primary-source citation — statute, regulation, regulator guidance, or court ruling — with a working URL.
5. A short note on why the citation supports the change. Counter-arguments and unsettled-law caveats are welcome.

A PR is even better than an issue. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the data-PR format.

### Spotted a bug

Open a [Bug Report](https://github.com/davidmoserai/mailregime/issues/new?template=bug.md). Code reproduction is helpful.

### Want to be a maintainer

Open a discussion or email the maintainer. Track record of relevant data PRs is the main signal.

### Want to add a country

Country data PRs are welcome. They must follow [CONTRIBUTING.md](./CONTRIBUTING.md) — primary-source citations on every field, no secondary-source citations, no marketing claims about correctness. Land at `confidence: "medium"` by default. Only the maintainer promotes records to `"high"`, and only when the citation depth justifies it.

### Want to attest to a country record (lawyer)

If you are a qualified lawyer in a relevant jurisdiction and you want to be named in a country record's `lawyerAttestation` field, see CONTRIBUTING.md §"Country data PRs" for the verification process. Attestation is a transparency signal — see [DISCLAIMER.md](./DISCLAIMER.md) for what it does and does not mean.

## What is NOT a contribution

- "I think this should be true because [vibes]." Without a citation, no.
- "ChatGPT/Claude told me this." AI output with no primary source is not a contribution.
- Marketing claims about correctness, compliance, or fitness.
- Removal of any disclaimer language.
- Pull requests that add a runtime dependency to the core (zero-dep is a load-bearing constraint).

## Maintenance cadence

We run an AI-assisted research routine periodically (typically monthly) to scan for legal changes — new statutes, regulator guidance, court rulings, amendments, repeals — and incorporate findings into country records as data PRs. Findings are surfaced in commit messages with citations.

**This is best-effort. We promise nothing about timeliness, completeness, or correctness of the routine's output.** It is run by an AI agent and reviewed by a non-lawyer maintainer. It will miss things. It will sometimes get things wrong. The library is provided AS-IS.

If you spot something we missed, please open an issue or PR — that is much faster than waiting for the next routine.

## Maintainer response time

Best effort. There is no SLA. Issues may go unanswered. PRs may sit. The project is provided AS-IS by volunteers and may be archived without notice. See [DISCLAIMER.md](./DISCLAIMER.md).

## Code of conduct

Be civil. Disagreements about legal interpretation are welcome and expected; personal attacks are not.

## Languages

English in issues, PRs, and code. Country data citations may be in the source language of the statute (e.g. UWG citations in German, Law 25 citations in French) — but the human-readable summary in the data file should also be available in English.
