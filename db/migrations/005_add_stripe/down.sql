BEGIN;

ALTER TABLE account_memberships
DROP COLUMN IF EXISTS stripe_subscription_id,
DROP COLUMN IF EXISTS current_period_start,
DROP COLUMN IF EXISTS current_period_end,
DROP COLUMN IF EXISTS cancel_at_period_end;

ALTER TABLE account_membership_plans
DROP COLUMN IF EXISTS stripe_price_id;

ALTER TABLE accounts
DROP COLUMN IF EXISTS stripe_customer_id;

COMMIT;
