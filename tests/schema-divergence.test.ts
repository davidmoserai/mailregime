import { test } from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

// Asserts that the canonical SQL file shipped in schemas/ and the
// inline migration SQL in src/store/postgres.ts describe the same
// table. Without this test, a maintainer could update one and forget
// the other, leaving callers who use different paths with divergent
// schemas silently.

const root = join(dirname(fileURLToPath(import.meta.url)), "..")

test("inline migration SQL matches schemas/postgres/0001_init.sql", async () => {
  const file = await readFile(join(root, "schemas/postgres/0001_init.sql"), "utf8")
  const inline = await readFile(join(root, "src/store/postgres.ts"), "utf8")

  // Pull the migration SQL out of postgres.ts via the marker comment
  // and the closing back-tick.
  const inlineMatch = inline.match(/id: "0001_init",\s*sql: `([\s\S]*?)`,/)
  assert.ok(inlineMatch, "could not locate inline 0001_init SQL block in postgres.ts")
  const inlineSql = inlineMatch[1]!

  // Both contain the same DDL — table + indexes. The SQL file ALSO
  // contains the bookkeeping table + leading comments. Normalise both:
  // strip comments, collapse whitespace, lowercase.
  const normalize = (s: string): string =>
    s
      .replace(/--[^\n]*/g, "")          // single-line comments
      .replace(/\s+/g, " ")              // collapse whitespace
      .toLowerCase()
      .trim()

  const fileNorm = normalize(file)
  const inlineNorm = normalize(inlineSql)

  // The inline SQL must be a contiguous substring of the file SQL
  // (the file is a superset because it also contains the bookkeeping
  // table at the bottom; the inline form doesn't carry that since
  // PostgresStore.migrate() creates the bookkeeping table itself).
  assert.ok(
    fileNorm.includes(inlineNorm),
    "inline migration SQL drifted from schemas/postgres/0001_init.sql — keep them in sync",
  )
})
