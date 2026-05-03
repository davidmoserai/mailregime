// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// `npx mailregime migrate` — applies pending mailregime migrations
// to a Postgres database. Reads the connection string from
// DATABASE_URL or --connection. Idempotent: tracks applied
// migrations in `mailregime_migrations`.

import * as p from "@clack/prompts"

export async function runMigrate(argv: string[]): Promise<void> {
  p.intro("mailregime migrate")

  let connectionString: string | undefined
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === "--connection" || a === "-c") {
      connectionString = argv[i + 1]
      i++
    } else if (a?.startsWith("--connection=")) {
      connectionString = a.slice("--connection=".length)
    }
  }
  if (!connectionString) connectionString = process.env["DATABASE_URL"]
  if (!connectionString) {
    p.cancel("No connection string. Set DATABASE_URL or pass --connection <url>.")
    process.exit(1)
  }

  const spin = p.spinner()
  spin.start("Applying migrations")
  try {
    const { PostgresStore } = await import("../../store/postgres.js")
    const store = new PostgresStore({ connectionString })
    const { applied } = await store.migrate()
    await store.close()
    spin.stop(applied.length > 0 ? `Applied: ${applied.join(", ")}` : "Already up to date")
    p.outro("Done.")
  } catch (err) {
    spin.stop("Migration failed")
    p.log.error(err instanceof Error ? err.message : String(err))
    process.exit(1)
  }
}
