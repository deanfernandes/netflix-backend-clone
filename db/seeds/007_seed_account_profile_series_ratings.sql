BEGIN;

-- Weighted ratings
WITH weighted_ratings AS (
    SELECT ARRAY[
        'thumbs_up','thumbs_up','thumbs_up','thumbs_up','thumbs_up','thumbs_up','thumbs_up',
        'double_thumbs_up','double_thumbs_up',
        'thumbs_down'
    ]::content_rating[] AS ratings
),
profile_series_arrays AS (
    SELECT
        account_profile_id,
        array_agg(series_id) AS series_ids
    FROM account_profile_series_views
    GROUP BY account_profile_id
),
profile_rating_counts AS (
    SELECT
        ap.account_profile_id,
        (floor(random() * 6))::int AS rating_count
    FROM profile_series_arrays ap
),
expanded AS (
    SELECT
        prc.account_profile_id,
        gs AS iteration,
        psa.series_ids
    FROM profile_rating_counts prc
    JOIN profile_series_arrays psa USING (account_profile_id)
    JOIN LATERAL generate_series(1, prc.rating_count) gs ON true
),
randomized AS (
    SELECT
        e.account_profile_id,
        e.series_ids[ floor(random() * array_length(e.series_ids, 1)) + 1 ] AS series_id,
        wr.ratings[ floor(random() * array_length(wr.ratings, 1)) + 1 ]::content_rating AS rating
    FROM expanded e
    CROSS JOIN weighted_ratings wr
)
INSERT INTO account_profile_series_ratings (rating, series_id, account_profile_id)
SELECT DISTINCT
    r.rating,
    r.series_id,
    r.account_profile_id
FROM randomized r
WHERE r.series_id IS NOT NULL
ON CONFLICT (series_id, account_profile_id) DO NOTHING;

COMMIT;
