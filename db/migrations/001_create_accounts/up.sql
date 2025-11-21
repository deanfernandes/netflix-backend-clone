BEGIN;

CREATE TYPE membership_status AS ENUM ('active', 'expired', 'cancelled');

CREATE TABLE accounts (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    mobile_number TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE account_profiles (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    profile_image_url TEXT,
    pin_hash TEXT,
    account_id BIGINT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    UNIQUE(account_id, name)
);

CREATE TABLE account_membership_plans (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    monthly_price NUMERIC(12, 2) CHECK(monthly_price > 0)
);

CREATE TABLE account_memberships (
    id BIGSERIAL PRIMARY KEY,
    start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    end_date TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 days'),
    status membership_status NOT NULL,
    auto_renew BOOLEAN NOT NULL,
    account_id BIGINT NOT NULL REFERENCES accounts(id),
    account_membership_plan_id BIGINT NOT NULL REFERENCES account_membership_plans(id),
    account_membership_price NUMERIC(12, 2) NOT NULL
);

CREATE UNIQUE INDEX one_active_membership_per_account
ON account_memberships (account_id)
WHERE status = 'active';

CREATE INDEX idx_account_memberships_account_id
ON account_memberships(account_id);

CREATE INDEX idx_account_memberships_account_id_status
ON account_memberships(account_id, status);

COMMIT;