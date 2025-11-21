BEGIN;

WITH profile_view_counts AS (
    SELECT
        ap.id AS account_profile_id,
        (floor(random() * 26))::int AS view_count   -- 0–25 views
    FROM account_profiles ap
),
expanded_views AS (
    SELECT
        pvc.account_profile_id
    FROM profile_view_counts pvc
    JOIN LATERAL generate_series(1, pvc.view_count) gs ON true
)
INSERT INTO account_profile_film_views (film_id, account_profile_id)
SELECT DISTINCT
    (
        SELECT id
        FROM films
        ORDER BY random()
        LIMIT 1
    ) AS film_id,
    ev.account_profile_id
FROM expanded_views ev
ON CONFLICT (film_id, account_profile_id) DO NOTHING;

COMMIT;
