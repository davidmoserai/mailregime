# mailregime — schemas

Static schema templates for self-hosting consent receipts.

> INFORMATIONAL ONLY — NOT LEGAL ADVICE. See [LICENSE](../LICENSE) and [DISCLAIMER.md](../DISCLAIMER.md).

## What's here

| File | What it is | Who uses it |
|---|---|---|
| `postgres/0001_init.sql` | Canonical Postgres DDL — `CREATE TABLE` + indexes | Anyone applying migrations with `psql`, `atlas`, `sqitch`, `dbmate`, raw SQL — and the `PostgresStore.migrate()` method |
| `drizzle/schema.ts` | Drizzle table fragment | Drizzle users — paste/import then `drizzle-kit push` |
| `prisma/schema.prisma` | Prisma model fragment | Prisma users — append then `prisma migrate dev` |
| `kysely/types.ts` | Kysely TS types | Kysely users — extend your `Database` interface |

All four describe the **same table** (`mailregime_consent_receipts`) with the same columns and indexes. Pick the one that fits your stack.

## Pick by your tooling

```
   Drizzle user        → drizzle/schema.ts        + drizzle-kit push
   Prisma user         → prisma/schema.prisma     + prisma migrate dev
   Kysely user         → kysely/types.ts          + apply 0001_init.sql via your tool
   No ORM              → schemas/postgres/...sql  + npx mailregime init (we run it)
   Already on Atlas /  → postgres/0001_init.sql   + your existing tool
   sqitch / dbmate
```

## What if I update mailregime?

When `AuditRecord` evolves, mailregime ships new versioned migrations (`0002_*.sql`, `0003_*.sql`, etc.). Apply them with the same tool you used for `0001`. Existing receipts stay valid — the schema only adds, never breaks.

The `mailregime_migrations` table tracks which migrations have run. `PostgresStore.migrate()` and `npx mailregime migrate` both consult it before applying anything.
