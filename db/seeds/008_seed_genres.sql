BEGIN;

INSERT INTO genres (name)
VALUES 
    ('Action'),
    ('Comedy'),
    ('Drama'),
    ('Thriller'),
    ('Romance'),
    ('Sci-Fi'),
    ('Horror'),
    ('Documentary'),
    ('Animation'),
    ('Fantasy')
ON CONFLICT (name) DO NOTHING;

WITH genre_ids AS (
    SELECT array_agg(id) AS ids FROM genres
),
film_genre_counts AS (
    SELECT
        f.id AS film_id,
        (floor(random() * 3) + 1)::int AS genre_count  -- 1–3 genres per film
    FROM films f
),
expanded AS (
    SELECT
        fgc.film_id,
        gs AS iteration
    FROM film_genre_counts fgc
    JOIN LATERAL generate_series(1, fgc.genre_count) gs ON true
),
randomized AS (
    SELECT
        e.film_id,
        (genre_ids.ids[ floor(random() * array_length(genre_ids.ids, 1)) + 1 ])::bigint AS genre_id
    FROM expanded e
    CROSS JOIN genre_ids
)
INSERT INTO film_genres (film_id, genre_id)
SELECT DISTINCT
    r.film_id,
    r.genre_id
FROM randomized r
ON CONFLICT (film_id, genre_id) DO NOTHING;

WITH genre_ids AS (
    SELECT array_agg(id) AS ids FROM genres
),
series_genre_counts AS (
    SELECT
        s.id AS series_id,
        (floor(random() * 3) + 1)::int AS genre_count  -- 1–3 genres per series
    FROM series s
),
expanded AS (
    SELECT
        sgc.series_id,
        gs AS iteration
    FROM series_genre_counts sgc
    JOIN LATERAL generate_series(1, sgc.genre_count) gs ON true
),
randomized AS (
    SELECT
        e.series_id,
        (genre_ids.ids[ floor(random() * array_length(genre_ids.ids, 1)) + 1 ])::bigint AS genre_id
    FROM expanded e
    CROSS JOIN genre_ids
)
INSERT INTO series_genres (series_id, genre_id)
SELECT DISTINCT
    r.series_id,
    r.genre_id
FROM randomized r
ON CONFLICT (series_id, genre_id) DO NOTHING;

COMMIT;
