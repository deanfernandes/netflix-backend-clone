BEGIN;

INSERT INTO account_membership_plans (name, monthly_price)
VALUES 
    ('Standard', 12.99),
    ('Premium', 18.99)
ON CONFLICT (name) DO NOTHING;

WITH seed_accounts AS (
    SELECT
        g AS id,
        'user' || g || '@example.com' AS email,
        '$2b$10$CwTycUXWue0Thq9StjUM0uJ8CkUyQSXHZoGXAF6ucpkECJu3p6gyy' AS password_hash,
        '555' || lpad(g::text, 7, '0') AS mobile_number
    FROM generate_series(1, 1000000) g
)
INSERT INTO accounts (email, password_hash, mobile_number)
SELECT email, password_hash, mobile_number
FROM seed_accounts;

WITH profile_seed AS (
    SELECT 
        a.id AS account_id,
        'Profile ' || n AS name
    FROM accounts a
    CROSS JOIN generate_series(1, 4) AS n
    WHERE n <= (floor(random()*4) + 1)  -- random 1–4 profiles per account
)
INSERT INTO account_profiles (name, profile_image_url, pin_hash, account_id)
SELECT
    ps.name,
    NULL AS profile_image_url,
    NULL AS pin_hash,
    ps.account_id
FROM profile_seed ps;

WITH membership_seed AS (
    SELECT
        a.id AS account_id,
        floor(random() * 4) AS membership_count,
        (random() < 0.5)::int AS has_active
    FROM accounts a
),
expanded AS (
    SELECT
        ms.account_id,
        gs AS iteration,
        ms.has_active
    FROM membership_seed ms
    JOIN generate_series(1, 3) gs ON gs <= ms.membership_count
),
final_memberships AS (
    SELECT
        e.account_id,
        floor(random() * 2 + 1)::int AS plan_id,
        CASE 
            WHEN e.has_active = 1 AND e.iteration = 1 THEN 'active'::membership_status
            ELSE (ARRAY['expired'::membership_status, 'cancelled'::membership_status])[floor(random()*2 + 1)]
        END AS status,
        (random() < 0.6) AS auto_renew,
        (now() - (floor(random() * 1095) || ' days')::interval) AS start_date
    FROM expanded e
)
INSERT INTO account_memberships (
    start_date,
    end_date,
    status,
    auto_renew,
    account_id,
    account_membership_plan_id,
    account_membership_price
)
SELECT
    fm.start_date,
    fm.start_date + interval '30 days' AS end_date,
    fm.status,
    fm.auto_renew,
    fm.account_id,
    p.id AS plan_id,
    p.monthly_price
FROM final_memberships fm
JOIN account_membership_plans p ON p.id = fm.plan_id;

COMMIT;
