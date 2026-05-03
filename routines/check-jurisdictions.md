# Routine: weekly jurisdiction verification

You are mailregime's weekly legal-data verification routine. Run from the repo root.

## What you do

1. List every file in `src/data/countries/*.ts` — that's the set of bundled countries.

2. **For each country, spawn a `general-purpose` subagent in parallel** (use the Agent tool, run them concurrently in batches of ~5 to avoid overwhelming the network). Give each subagent the exact prompt below, with `<CODE>` substituted for the country code.

   > ## Subagent prompt
   >
   > Verification pass for ONE country: `<CODE>`.
   >
   > 1. Read `src/data/countries/<CODE>.ts` from the mailregime repo.
   > 2. Re-verify the cited statute, opt-in default, soft-opt-in scope, B2B exemption, language requirement, and child age of consent against current primary sources (regulator portal, official legislation site, court rulings 2024–2026). Web fetch + web search allowed.
   > 3. **Primary sources only** — official statutes, regulator (DPA/IR/CAI/CRTC/CNIL/ICO/etc.) guidance, EUR-Lex, court rulings. NO blog posts, NO law-firm marketing pages, NO AI summaries.
   > 4. Output one of:
   >    ```
   >    <CODE>: OK
   >    ```
   >    or:
   >    ```
   >    <CODE>: ISSUES
   >    - <field-path>: <current> → <correct> [primary-source URL]
   >    - …
   >    NEW SINCE FILE'S dataLastUpdated:
   >    - <statute / guidance / ruling> [URL]
   >    ```
   > 5. Be terse. Don't restate what's already correct. Cite primary sources for every claimed correction.
   > 6. Aim for under 250 words.

3. Collect all subagent outputs.

## What you do with the findings

- **All countries return `OK`** → post a comment on the latest commit summarising what was checked and concluded. Format: `[mailregime weekly scan YYYY-MM-DD] checked {N} countries, no material changes.` Stop.

- **Any country returns `ISSUES`** → open ONE pull request titled `weekly: legal-data scan YYYY-MM-DD` against `main`, with:
  - One commit per country that has corrections, body listing the field path + from→to + primary-source citation
  - Updates to `src/data/countries/<CODE>.ts` reflecting the corrections
  - Bump `dataLastUpdated` on each updated record
  - PR description listing every change with citations
  - Label `legal-correction`

## Hard rules

- **Read `AGENTS.md` and `CONTRIBUTING.md` before any edit.**
- Primary sources only.
- Do NOT raise `confidence` higher than `"medium"` (only the maintainer does that, and only with a `lawyerAttestation`).
- Do NOT remove or weaken any disclaimer language anywhere.
- Do NOT touch the `mailregime_consent_receipts` schema, audit-record types, or anything outside `src/data/countries/`.
- If you can't reach a primary source for a field, leave it untouched and note the gap in the PR.

## When in doubt

Skip the change and note it as `UNCERTAIN` in the PR. Better to flag uncertainty than ship a confident-looking-but-wrong correction.
