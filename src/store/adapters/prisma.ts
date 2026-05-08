// Re-export of fumadb's prismaAdapter, mirroring the @c15t/backend
// pattern so users have one canonical import path inside mailregime.
//
//   import { prismaAdapter } from "mailregime/store/adapters/prisma"
//
// is identical to importing directly from fumadb. Provided purely for
// discoverability and to match c15t's UX.
export { prismaAdapter } from "fumadb/adapters/prisma"
