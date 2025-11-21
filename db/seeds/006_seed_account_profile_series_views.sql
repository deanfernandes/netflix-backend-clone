BEGIN;

-- Collect all series IDs into an array
WITH series_ids AS (
    SELECT array_agg(id) AS series
    FROM series
),
-- Determine 0–5 views per profile
profile_view_counts AS (
    SELECT
        ap.id AS account_profile_id,
        (floor(random() * 6))::int AS view_count   -- 0–5 views
    FROM account_profiles ap
),
-- Expand each profile into N rows (N = number of views)
expanded AS (
    SELECT
        pvc.account_profile_id,
        gs AS iteration
    FROM profile_view_counts pvc
    JOIN LATERAL generate_series(1, pvc.view_count) gs ON true
),
-- Assign a random series_id to each row
randomized AS (
    SELECT
        e.account_profile_id,
        (series_ids.series[ floor(random() * array_length(series_ids.series, 1)) + 1 ])::bigint AS series_id
    FROM expanded e
    CROSS JOIN series_ids
)
INSERT INTO account_profile_series_views (series_id, account_profile_id)
SELECT DISTINCT
    r.series_id,
    r.account_profile_id
FROM randomized r
ON CONFLICT (series_id, account_profile_id) DO NOTHING;

COMMIT;
