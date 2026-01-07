BEGIN;

ALTER TABLE accounts
ADD COLUMN stripe_customer_id TEXT UNIQUE;

ALTER TABLE account_membership_plans
ADD COLUMN stripe_price_id TEXT UNIQUE;

ALTER TABLE account_memberships
ADD COLUMN stripe_subscription_id TEXT UNIQUE,
ADD COLUMN current_period_start TIMESTAMPTZ,
ADD COLUMN current_period_end TIMESTAMPTZ,
ADD COLUMN cancel_at_period_end BOOLEAN DEFAULT false;

COMMIT;
