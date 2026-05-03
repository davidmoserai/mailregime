// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// `npx mailregime init` — interactive setup. Asks the dev which SQL
// flavor + ORM helpers they want, copies the right templates into
// ./mailregime/, optionally runs the migration against a connection
// they provide.

import * as p from "@clack/prompts"
import { promises as fs } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

type SqlFlavor = "postgres"
type OrmTemplate = "drizzle" | "prisma" | "kysely" | "none"

// At runtime this file lives at dist/bin/commands/init.js, so
// schemas/ is three levels up (dist/bin/commands/ → dist/bin/ →
// dist/ → package root).
const SCHEMAS_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "schemas")
const OUT_DIR = "./mailregime"

export async function runInit(_argv: string[]): Promise<void> {
  p.intro("mailregime — initialise consent receipt store")

  const sqlFlavor = (await p.select({
    message: "Which database?",
    options: [
      { value: "postgres", label: "PostgreSQL", hint: "Supabase, Neon, RDS, self-hosted, etc." },
      // mysql/sqlite added in a later release; currently postgres-only
    ],
  })) as SqlFlavor | symbol
  if (p.isCancel(sqlFlavor)) cancelOut()

  const ormTemplate = (await p.select({
    message: "Which ORM helpers do you want shipped to ./mailregime?",
    options: [
      { value: "drizzle", label: "Drizzle", hint: "TypeScript-native, type-safe queries" },
      { value: "prisma", label: "Prisma", hint: "drop into your schema.prisma" },
      { value: "kysely", label: "Kysely", hint: "TS types for your Database interface" },
      { value: "none", label: "None / raw SQL only", hint: "use the SQL DDL directly" },
    ],
  })) as OrmTemplate | symbol
  if (p.isCancel(ormTemplate)) cancelOut()

  const applyNow = (await p.confirm({
    message: "Apply the migration to your database now?",
    initialValue: false,
  })) as boolean | symbol
  if (p.isCancel(applyNow)) cancelOut()

  let connectionString: string | undefined
  if (applyNow === true) {
    const where = (await p.select({
      message: "Where is the connection string?",
      options: [
        { value: "env", label: "Environment variable", hint: "DATABASE_URL or similar" },
        { value: "paste", label: "Paste it now", hint: "testing only — won't be saved" },
      ],
    })) as "env" | "paste" | symbol
    if (p.isCancel(where)) cancelOut()

    if (where === "env") {
      const varName = (await p.text({
        message: "Env var name?",
        placeholder: "DATABASE_URL",
        defaultValue: "DATABASE_URL",
      })) as string | symbol
      if (p.isCancel(varName)) cancelOut()
      const v = process.env[String(varName)]
      if (!v) {
        p.note(`Env var ${String(varName)} is not set in this shell. Skipping migration. Run \`npx mailregime migrate\` later with the var set.`)
      } else {
        connectionString = v
      }
    } else {
      const pasted = (await p.password({ message: "Paste connection string:" })) as string | symbol
      if (p.isCancel(pasted)) cancelOut()
      connectionString = String(pasted)
    }
  }

  const spin = p.spinner()
  spin.start("Writing templates")
  await fs.mkdir(OUT_DIR, { recursive: true })
  await fs.mkdir(join(OUT_DIR, "migrations"), { recursive: true })

  const written: string[] = []

  // Always copy the canonical SQL — useful even for ORM users for
  // tooling that operates at the DDL layer (atlas, sqitch, raw psql).
  const sqlFile = join(SCHEMAS_DIR, sqlFlavor as SqlFlavor, "0001_init.sql")
  const sqlOut = join(OUT_DIR, "migrations", "0001_init.sql")
  await copyIfMissing(sqlFile, sqlOut, written)

  // ORM-specific template
  if (ormTemplate === "drizzle") {
    await copyIfMissing(join(SCHEMAS_DIR, "drizzle", "schema.ts"), join(OUT_DIR, "schema.ts"), written)
  } else if (ormTemplate === "prisma") {
    await copyIfMissing(join(SCHEMAS_DIR, "prisma", "schema.prisma"), join(OUT_DIR, "schema.prisma"), written)
  } else if (ormTemplate === "kysely") {
    await copyIfMissing(join(SCHEMAS_DIR, "kysely", "types.ts"), join(OUT_DIR, "types.ts"), written)
  }

  spin.stop(`Wrote ${written.length} file${written.length === 1 ? "" : "s"} to ${OUT_DIR}/`)
  for (const f of written) p.log.info(`  ${f}`)

  if (connectionString) {
    spin.start("Applying migration")
    try {
      const { PostgresStore } = await import("../../store/postgres.js")
      const store = new PostgresStore({ connectionString })
      const { applied } = await store.migrate()
      await store.close()
      spin.stop(applied.length > 0 ? `Applied: ${applied.join(", ")}` : "Already up to date")
    } catch (err) {
      spin.stop("Migration failed")
      p.log.error(err instanceof Error ? err.message : String(err))
      process.exitCode = 1
    }
  }

  p.note(buildNextSteps(ormTemplate as OrmTemplate, connectionString != null))
  p.outro("Done.")
}

async function copyIfMissing(src: string, dest: string, written: string[]): Promise<void> {
  try {
    await fs.access(dest)
    return
  } catch {
    /* not present, copy */
  }
  await fs.copyFile(src, dest)
  written.push(dest)
}

function buildNextSteps(orm: OrmTemplate, alreadyMigrated: boolean): string {
  const lines: string[] = []
  if (!alreadyMigrated) {
    lines.push("1. Apply the migration with your tool:")
    if (orm === "drizzle") {
      lines.push("     npx drizzle-kit push")
    } else if (orm === "prisma") {
      lines.push("     npx prisma migrate dev --name mailregime_consent_init")
      lines.push("     (after appending mailregime/schema.prisma to your prisma/schema.prisma)")
    } else {
      lines.push("     npx mailregime migrate          # set DATABASE_URL first")
      lines.push("     # or:")
      lines.push("     psql $DATABASE_URL -f ./mailregime/migrations/0001_init.sql")
    }
    lines.push("")
  }
  lines.push("2. In your code:")
  lines.push("")
  lines.push("     import { getEmailRules } from \"mailregime\"")
  lines.push("     import { PostgresStore } from \"mailregime/store/postgres\"")
  lines.push("")
  lines.push("     const store = new PostgresStore({ connectionString: process.env.DATABASE_URL! })")
  lines.push("")
  lines.push("     const rules  = getEmailRules({ country, context, relationship })")
  lines.push("     const record = await rules.buildAuditRecord({ ip, userAgent, sourceUrl, wording, formVersion })")
  lines.push("     await store.save(record, rules)")
  return lines.join("\n")
}

function cancelOut(): never {
  p.cancel("Cancelled.")
  process.exit(0)
}
