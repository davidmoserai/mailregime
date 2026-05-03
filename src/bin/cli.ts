#!/usr/bin/env node
// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// mailregime CLI — opt-in developer tool for self-hosting consent
// receipts. Runs at setup time on the developer's machine; the
// runtime library never imports this file. The CLI may open
// connections, install dependencies, and write to the filesystem
// — all explicitly initiated by the developer.

import { runInit } from "./commands/init.js"
import { runMigrate } from "./commands/migrate.js"

async function main(): Promise<void> {
  const cmd = process.argv[2]
  switch (cmd) {
    case "init":
      await runInit(process.argv.slice(3))
      return
    case "migrate":
      await runMigrate(process.argv.slice(3))
      return
    case "--version":
    case "-v":
    case "version":
      await printVersion()
      return
    case "--help":
    case "-h":
    case "help":
    case undefined:
      printHelp()
      return
    default:
      console.error(`Unknown command: ${cmd}`)
      printHelp()
      process.exit(1)
  }
}

function printHelp(): void {
  console.log(`mailregime — country-code → email-marketing-consent rules

Usage:
  npx mailregime <command>

Commands:
  init       Interactive setup. Prompts for SQL flavor + ORM,
             writes schema templates, optionally applies the
             migration to your database.

  migrate    Apply pending migrations to a Postgres database
             (reads DATABASE_URL or --connection).

  version    Print the installed version.

For more: https://github.com/davidmoserai/mailregime`)
}

async function printVersion(): Promise<void> {
  // dist/bin/cli.js → ../../package.json
  const url = new URL("../../package.json", import.meta.url)
  const fs = await import("node:fs/promises")
  const pkg = JSON.parse(await fs.readFile(url, "utf8")) as { version: string }
  console.log(pkg.version)
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
