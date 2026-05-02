import { test } from "node:test"
import assert from "node:assert/strict"
import { fromVercelRequest } from "../src/adapters/vercel.js"
import { fromCloudflareRequest } from "../src/adapters/cloudflare.js"
import { fromHeader } from "../src/adapters/header.js"
import { fromStatic, mergeDetections } from "../src/adapters/static.js"

function reqWith(headers: Record<string, string>): Request {
  return new Request("https://example.com/", { headers })
}

test("vercel adapter — extracts country and region", () => {
  const result = fromVercelRequest(
    reqWith({ "x-vercel-ip-country": "de", "x-vercel-ip-country-region": "BY" }),
  )
  assert.equal(result.country, "DE")
  assert.equal(result.region, "DE-BY")
  assert.equal(result.source, "header")
  assert.equal(result.confidence, "high")
})

test("vercel adapter — missing header → unknown / low", () => {
  const result = fromVercelRequest(reqWith({}))
  assert.equal(result.country, null)
  assert.equal(result.source, "unknown")
  assert.equal(result.confidence, "low")
})

test("cloudflare adapter — extracts cf-ipcountry + cf-region-code", () => {
  const result = fromCloudflareRequest(
    reqWith({ "cf-ipcountry": "ca", "cf-region-code": "qc" }),
  )
  assert.equal(result.country, "CA")
  assert.equal(result.region, "CA-QC")
})

test("header adapter — custom header name", () => {
  const result = fromHeader(reqWith({ "x-my-country": "gb" }), {
    countryHeader: "x-my-country",
  })
  assert.equal(result.country, "GB")
})

test("static adapter — passes through", () => {
  const result = fromStatic("us", "us-ca")
  assert.equal(result.country, "US")
  assert.equal(result.region, "US-CA")
  assert.equal(result.source, "static")
})

test("static adapter — null in, null out", () => {
  const result = fromStatic(null)
  assert.equal(result.country, null)
  assert.equal(result.source, "unknown")
})

test("mergeDetections — last-non-null-wins (strictness ordering left to caller)", () => {
  const merged = mergeDetections(
    fromStatic(null),
    fromStatic("US"),
    fromStatic("DE"), // billing addr — caller asserts this is most authoritative
  )
  assert.equal(merged.country, "DE")
})
