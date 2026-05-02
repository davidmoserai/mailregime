// INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
//
// ISO/IEC TS 27560:2023-aligned consent receipts. Stateless. No I/O.
// Storage is the caller's problem; m24t never opens a connection.

import type {
  AuditContext,
  AuditRecord,
  EmailRulesData,
  GetEmailRulesInput,
} from "../types.js"

const SCHEMA_VERSION = "m24t/1" as const
const ISO27560_VERSION = "1.0" as const

// Crockford-base32 time-prefix + 16 random chars. ULID-shaped — not a
// strict ULID-spec implementation. Time-sortable, ~80 bits of entropy,
// no external dep. Sufficient for consent-receipt identity.
const ULID_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"

function ulid(time: number = Date.now()): string {
  let timeStr = ""
  let t = time
  for (let i = 0; i < 10; i++) {
    timeStr = ULID_ALPHABET[t % 32]! + timeStr
    t = Math.floor(t / 32)
  }
  let randStr = ""
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  for (let i = 0; i < 16; i++) {
    randStr += ULID_ALPHABET[bytes[i]! % 32]!
  }
  return timeStr + randStr
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest("SHA-256", data)
  const bytes = new Uint8Array(digest)
  let out = ""
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i]!.toString(16).padStart(2, "0")
  }
  return out
}

export async function buildAuditRecord(
  input: GetEmailRulesInput,
  rules: EmailRulesData,
  ctx: AuditContext,
): Promise<AuditRecord> {
  const wordingHash = await sha256Hex(ctx.wording)
  return {
    schemaVersion: SCHEMA_VERSION,
    iso27560Version: ISO27560_VERSION,
    consentId: ulid(),
    subjectId: ctx.subjectId ?? null,
    capturedAt: new Date().toISOString(),
    ip: ctx.ip,
    userAgent: ctx.userAgent,
    country: input.country ?? "UNKNOWN",
    region: input.region ?? null,
    countrySource: ctx.countrySource ?? (input.country ? "static" : "unknown"),
    context: input.context,
    relationship: input.relationship,
    channels: rules.channels.slice(),
    wording: ctx.wording,
    wordingHash,
    formUrl: ctx.sourceUrl,
    formVersion: ctx.formVersion,
    doiConfirmedAt: ctx.doiConfirmedAt ?? null,
    basis: {
      statute: rules.basis.statute,
      url: rules.basis.url,
      jurisdiction: rules.basis.jurisdiction,
      dataLastUpdated: rules.basis.dataLastUpdated,
    },
    withdrawnAt: ctx.withdrawnAt ?? null,
    withdrawalMethod: ctx.withdrawalMethod ?? null,
  }
}

// Strict ISO/IEC TS 27560:2023 consent-receipt projection. m24t's record
// is a superset; this projection drops m24t-specific fields and emits
// only the standard structure for interop with other tooling.
export function serializeISO27560(record: AuditRecord): Record<string, unknown> {
  return {
    version: record.iso27560Version,
    jurisdiction: record.basis.jurisdiction,
    consentTimestamp: record.capturedAt,
    collectionMethod: record.countrySource,
    consentReceiptID: record.consentId,
    publicKey: null,
    language: null,
    piiPrincipalId: record.subjectId,
    services: [
      {
        service: "email-marketing",
        purposes: [
          {
            purpose: record.context,
            consentType: "EXPLICIT",
            piiCategory: ["email"],
            primaryPurpose: true,
            termination: record.withdrawnAt ?? "ongoing",
            thirdPartyDisclosure: false,
          },
        ],
      },
    ],
    sensitive: false,
    spiCat: [],
    legalBasis: record.basis.statute,
  }
}

// Designed to preserve evidentiary structure (consent ID, timestamp,
// statute, withdrawal record) while removing direct identifiers. Whether
// this satisfies right-to-erasure under any specific regime is the
// caller's call — verify against your regulator's current guidance and
// your own counsel.
export function redactReceipt(record: AuditRecord): AuditRecord {
  return {
    ...record,
    subjectId: null,
    ip: null,
    userAgent: null,
    wording: "[redacted]",
    withdrawnAt: record.withdrawnAt ?? new Date().toISOString(),
    withdrawalMethod: record.withdrawalMethod ?? "erasure-request",
  }
}
