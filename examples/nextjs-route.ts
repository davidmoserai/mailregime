// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// Reference shape for a Next.js / edge-runtime POST handler that uses
// mailregime to gate email collection. NOT a complete app — illustrative only.

import { getEmailRules } from "mailregime"
import { fromVercelRequest } from "mailregime/adapters/vercel"

type Body = { email: string; marketingOptIn?: boolean }

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as Body
  const { country, region } = fromVercelRequest(request)

  const rules = getEmailRules({
    country,
    region,
    context: "lead-magnet",
    relationship: "none",
  })

  if (!rules.canCollectForMarketing) {
    // Strict regime + lead-magnet → cannot auto-add to newsletter.
    // Deliver the lead-magnet and stop.
    return Response.json({ ok: true, addedToList: false })
  }

  if (rules.checkboxRequired && body.marketingOptIn !== true) {
    return Response.json({ ok: true, addedToList: false })
  }

  if (rules.optIn === "double") {
    // Trigger your DOI flow (e.g. Brevo /contacts/doi).
    // await brevo.createDoiContact(body.email, ...)
  } else if (rules.optIn === "single") {
    // await brevo.createContact(body.email, ...)
  } else {
    return Response.json({ ok: true, addedToList: false })
  }

  const record = await rules.buildAuditRecord({
    ip: request.headers.get("x-forwarded-for"),
    userAgent: request.headers.get("user-agent"),
    sourceUrl: request.url,
    wording: "Send me marketing emails about similar products.",
    formVersion: "v3",
    subjectId: null, // hash the email here once you have a stable id
  })

  // Persist `record` wherever you keep audit trails (R2, S3, Postgres, ...).
  // mailregime never opens a connection — storage is your problem.
  void record

  return Response.json({ ok: true, addedToList: true })
}
