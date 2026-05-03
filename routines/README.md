# Routines — scheduled legal-data verification

Prompts in this directory are designed to run as **Claude Code Routines** — scheduled agents that execute on Anthropic-managed infra, billed against the maintainer's Claude subscription (Pro / Max / Team), no API key needed.

> The DISCLAIMER promises only **best-effort, no timeliness guarantee.** These routines are how that promise is operationalised. They may miss things, mis-summarise things, or apply changes incorrectly. They are run by an AI agent. They are not a substitute for a lawyer.

## Recommended schedule

| Routine | Interval | Why |
|---|---|---|
| [`check-jurisdictions.md`](./check-jurisdictions.md) | **Weekly** (Mondays 09:00 UTC) | Matches the cadence committed in [DISCLAIMER.md](../DISCLAIMER.md). Catches new statutes, regulator guidance, court rulings before drift compounds. |

## How it works (subagent pattern)

The master prompt instructs the agent to spawn one subagent per bundled country:

```
                  ┌─────────────────────────────┐
                  │  Master agent (the routine) │
                  │                              │
                  │  Reads src/data/countries/*  │
                  │  Spawns N subagents          │
                  └─────────────────────────────┘
                            │
        ┌───────────────────┼─────────────────────┐
        ▼                   ▼                     ▼
   ┌──────────┐       ┌──────────┐         ┌──────────┐
   │ Subagent │       │ Subagent │  ...    │ Subagent │
   │   US     │       │   GB     │  ×27    │   ZA     │
   │          │       │          │         │          │
   │ Clean    │       │ Clean    │         │ Clean    │
   │ context  │       │ context  │         │ context  │
   │ verifies │       │ verifies │         │ verifies │
   │ primary  │       │ primary  │         │ primary  │
   │ sources  │       │ sources  │         │ sources  │
   └────┬─────┘       └────┬─────┘         └────┬─────┘
        │                  │                    │
        └──────────────────┼────────────────────┘
                           ▼
                  ┌─────────────────────────────┐
                  │  Master aggregates findings │
                  │  → no changes: post comment │
                  │  → changes: open a PR with  │
                  │    primary-source citations │
                  │    labelled `legal-correction`│
                  └─────────────────────────────┘
```

Why subagents:
- **Clean context** per country — each gets only that country file + research, no cross-pollination
- **Parallel** — runs faster than serial
- **Scales** — adding the 100th country doesn't break the master's context window
- **Failure isolation** — one country's research failure doesn't kill the whole run

## How to install (one-time)

In Claude Code on your machine, run:

```bash
/schedule
```

When prompted:

```
Cron:    0 9 * * 1                  # Mondays 09:00 UTC
Prompt:  paste the contents of routines/check-jurisdictions.md
Repo:    davidmoserai/mailregime    # so it can open PRs
```

Confirm. The routine is now registered on your Claude account and will fire on the schedule.

To pause / edit / delete: re-run `/schedule` and pick the management option.

## How to run manually

```bash
# Inside the mailregime repo:
claude  # or whatever launches Claude Code

> Run the routine in routines/check-jurisdictions.md
```

Useful before a release to verify nothing has drifted.

## What if the routine costs subscription quota I don't want to spend?

Pause it via `/schedule`. The DISCLAIMER's "best effort, no timeliness promise" already covers the case where verification gaps lapse. Manual runs before each release are sufficient for a small project.
