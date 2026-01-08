BEGIN;

ALTER TABLE accounts
ADD COLUMN deleted_at TIMESTAMPTZ NULL;

ALTER TABLE accounts DROP CONSTRAINT IF EXISTS accounts_email_key;
ALTER TABLE accounts DROP CONSTRAINT IF EXISTS accounts_mobile_number_key;

CREATE UNIQUE INDEX ux_accounts_email_active
ON accounts (email)
WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX ux_accounts_mobile_active
ON accounts (mobile_number)
WHERE deleted_at IS NULL;

CREATE INDEX idx_accounts_deleted_at
ON accounts (deleted_at);

COMMIT;