BEGIN;

DROP INDEX IF EXISTS ux_accounts_email_active;
DROP INDEX IF EXISTS ux_accounts_mobile_active;
DROP INDEX IF EXISTS idx_accounts_deleted_at;

ALTER TABLE accounts ADD CONSTRAINT accounts_email_key UNIQUE (email);
ALTER TABLE accounts ADD CONSTRAINT accounts_mobile_number_key UNIQUE (mobile_number);

ALTER TABLE accounts
DROP COLUMN deleted_at;

COMMIT;