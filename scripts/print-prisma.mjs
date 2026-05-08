import { factory } from "/Users/davidmoser/Desktop/Unternehmen/mailregime/dist/store/store.js"
import { prismaAdapter } from "fumadb/adapters/prisma"
const db = factory.client(prismaAdapter({ prisma: {}, provider: "postgresql" }))
console.log(db.generateSchema("1.0.0", "prisma").code)
