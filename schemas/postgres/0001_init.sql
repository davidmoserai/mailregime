-- mailregime schema migration 0001 — initial table
-- INFORMATIONAL ONLY — NOT LEGAL ADVICE. See LICENSE and DISCLAIMER.md.
--
-- Stores ISO/IEC TS 27560:2023-aligned consent receipts.
--
-- Indexed columns are denormalized from the `receipt` JSONB for query
-- speed (subject_id lookup for GDPR Art. 15 access requests, retention
-- sweeps via delete_after, country/region filtering). The full receipt
-- stays in JSONB as the legally authoritative record.
--
-- This migration is idempotent — safe to re-run.

CREATE TABLE IF NOT EXISTS mailregime_consent_receipts (
  consent_id            TEXT        PRIMARY KEY,
  subject_id            TEXT,
  captured_at           TIMESTAMPTZ NOT NULL,
  -- delete_after = captured_at + retention_months. PostgresStore.save()
  -- computes this at insert time from the country's retention rule, so
  -- retention sweeps are a one-line indexed DELETE.
  delete_after          TIMESTAMPTZ NOT NULL,
  retention_months      INTEGER     NOT NULL,
  country               TEXT        NOT NULL,
  region                TEXT,
  country_source        TEXT        NOT NULL,
  context               TEXT        NOT NULL,
  relationship          TEXT        NOT NULL,
  statute               TEXT        NOT NULL,
  statute_url           TEXT        NOT NULL,
  statute_jurisdiction  TEXT        NOT NULL,
  data_last_updated     TEXT        NOT NULL,
  wording_hash          TEXT        NOT NULL,
  doi_confirmed_at      TIMESTAMPTZ,
  withdrawn_at          TIMESTAMPTZ,
  withdrawal_method     TEXT,
  receipt               JSONB       NOT NULL,
  schema_version        TEXT        NOT NULL DEFAULT 'mailregime/1'
);

CREATE INDEX IF NOT EXISTS idx_mr_subject       ON mailregime_consent_receipts (subject_id);
CREATE INDEX IF NOT EXISTS idx_mr_captured      ON mailregime_consent_receipts (captured_at);
CREATE INDEX IF NOT EXISTS idx_mr_delete_after  ON mailregime_consent_receipts (delete_after);
CREATE INDEX IF NOT EXISTS idx_mr_country       ON mailregime_consent_receipts (country, region);
CREATE INDEX IF NOT EXISTS idx_mr_withdrawn     ON mailregime_consent_receipts (withdrawn_at)
  WHERE withdrawn_at IS NOT NULL;

-- Bookkeeping table — tracks which migrations have been applied.
-- PostgresStore.migrate() reads this to skip already-applied scripts.
CREATE TABLE IF NOT EXISTS mailregime_migrations (
  id          TEXT        PRIMARY KEY,
  applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO mailregime_migrations (id) VALUES ('0001_init')
ON CONFLICT (id) DO NOTHING;
