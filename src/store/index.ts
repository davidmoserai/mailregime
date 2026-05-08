// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Public entry for `mailregime/store`. The actual implementation lives
// in store.ts (factory + ConsentStore wrapper over fumadb) and schema.ts
// (the fumadb schema definition). Adapters are re-exported under
// `mailregime/store/adapters/<orm>` for discoverability.

export { factory, consentStore, ConsentStore } from "./store.js"
export type { FumaDBClient, SweepResult } from "./store.js"
export { v1 as schemaV1 } from "./schema.js"
