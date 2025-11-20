BEGIN;

WITH profile_film_counts AS (
    SELECT ap.id AS account_profile_id,
           (floor(random() * 11))::int AS watch_count
    FROM account_profiles ap
),
expanded_films AS (
    SELECT account_profile_id,
           (SELECT id FROM films ORDER BY random() LIMIT 1) AS film_id
    FROM profile_film_counts
    CROSS JOIN generate_series(1, watch_count)
)
INSERT INTO account_profile_watchlist_films (account_profile_id, film_id)
SELECT DISTINCT account_profile_id, film_id
FROM expanded_films
ON CONFLICT (account_profile_id, film_id) DO NOTHING;

WITH profile_series_counts AS (
    SELECT ap.id AS account_profile_id,
           (floor(random() * 6))::int AS watch_count
    FROM account_profiles ap
),
expanded_series AS (
    SELECT account_profile_id,
           (SELECT id FROM series ORDER BY random() LIMIT 1) AS series_id
    FROM profile_series_counts
    CROSS JOIN generate_series(1, watch_count)
)
INSERT INTO account_profile_watchlist_series (account_profile_id, series_id)
SELECT DISTINCT account_profile_id, series_id
FROM expanded_series
ON CONFLICT (account_profile_id, series_id) DO NOTHING;

COMMIT;
