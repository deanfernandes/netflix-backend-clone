BEGIN;

-- 200 cast members
WITH cast_seed AS (
    SELECT
        'Actor ' || g AS name
    FROM generate_series(1,200) g
)
INSERT INTO cast_members (name)
SELECT name
FROM cast_seed
ON CONFLICT (name) DO NOTHING;

WITH cast_ids AS (
    SELECT array_agg(id) AS ids FROM cast_members
),
film_cast_counts AS (
    SELECT
        f.id AS film_id,
        (floor(random() * 11) + 5)::int AS cast_count  -- 5–15 cast members per film
    FROM films f
),
expanded AS (
    SELECT
        fcc.film_id,
        gs AS iteration
    FROM film_cast_counts fcc
    JOIN LATERAL generate_series(1, fcc.cast_count) gs ON true
),
randomized AS (
    SELECT
        e.film_id,
        (cast_ids.ids[ floor(random() * array_length(cast_ids.ids, 1)) + 1 ])::bigint AS cast_member_id
    FROM expanded e
    CROSS JOIN cast_ids
)
INSERT INTO film_cast_members (film_id, cast_member_id)
SELECT DISTINCT
    r.film_id,
    r.cast_member_id
FROM randomized r
ON CONFLICT (film_id, cast_member_id) DO NOTHING;

WITH cast_ids AS (
    SELECT array_agg(id) AS ids FROM cast_members
),
series_cast_counts AS (
    SELECT
        s.id AS series_id,
        (floor(random() * 11) + 5)::int AS cast_count  -- 5–15 cast members per series
    FROM series s
),
expanded AS (
    SELECT
        scc.series_id,
        gs AS iteration
    FROM series_cast_counts scc
    JOIN LATERAL generate_series(1, scc.cast_count) gs ON true
),
randomized AS (
    SELECT
        e.series_id,
        (cast_ids.ids[ floor(random() * array_length(cast_ids.ids, 1)) + 1 ])::bigint AS cast_member_id
    FROM expanded e
    CROSS JOIN cast_ids
)
INSERT INTO series_cast_members (series_id, cast_member_id)
SELECT DISTINCT
    r.series_id,
    r.cast_member_id
FROM randomized r
ON CONFLICT (series_id, cast_member_id) DO NOTHING;

COMMIT;
