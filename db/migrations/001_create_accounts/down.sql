BEGIN;

DROP INDEX IF EXISTS one_active_membership_per_account;
DROP INDEX IF EXISTS idx_account_memberships_account_id;
DROP INDEX IF EXISTS idx_account_memberships_account_id_status;

DROP TABLE IF EXISTS account_memberships;
DROP TABLE IF EXISTS account_membership_plans;
DROP TABLE IF EXISTS account_profiles;
DROP TABLE IF EXISTS accounts;

DROP TYPE IF EXISTS membership_status;

COMMIT;
