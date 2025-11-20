BEGIN;

WITH weighted_ratings AS (
    SELECT
        ARRAY[
            'thumbs_up','thumbs_up','thumbs_up','thumbs_up','thumbs_up','thumbs_up','thumbs_up',
            'double_thumbs_up','double_thumbs_up',
            'thumbs_down'
        ]::content_rating[] AS ratings
),
account_rating_counts AS (
    SELECT
        a.id AS account_id,
        (floor(random() * 6))::int AS rating_count  -- 0–5 ratings per account
    FROM accounts a
),
expanded AS (
    SELECT
        arc.account_id,
        gs AS iteration
    FROM account_rating_counts arc
    JOIN LATERAL generate_series(1, arc.rating_count) gs ON true
)
INSERT INTO account_profile_film_ratings (rating, film_id, account_profile_id)
SELECT DISTINCT
    weighted_ratings.ratings[
        floor(random() * array_length(weighted_ratings.ratings, 1)) + 1
    ]::content_rating AS rating,
    av.film_id,
    ap.id AS account_profile_id
FROM expanded e
JOIN account_profiles ap ON ap.account_id = e.account_id
JOIN LATERAL (
    SELECT av.film_id
    FROM account_profile_film_views av
    WHERE av.account_profile_id = ap.id
    ORDER BY random()
    LIMIT 1
) AS av ON true
CROSS JOIN weighted_ratings
ON CONFLICT (film_id, account_profile_id) DO NOTHING;

COMMIT;
