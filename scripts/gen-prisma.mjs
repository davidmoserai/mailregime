// One-shot helper: emit the fumadb-generated Prisma model for the
// consent-receipt table so we can paste it into getmatches' schema.
import { factory } from "../dist/store/store.js"

const out = factory.generateSchema("1.0.0", "prisma")
console.log("// path hint:", out.path)
console.log(out.code)
