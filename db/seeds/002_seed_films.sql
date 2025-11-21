BEGIN;

WITH film_seed AS (
    SELECT
        'Film ' || g AS title,
        'Synopsis for film ' || g AS synopsis,
        (1888 + floor(random() * (EXTRACT(YEAR FROM now())::int - 1888 + 1)))::smallint AS release_year,
        (ARRAY['U','PG','12','15','18'])[floor(random() * 5 + 1)]::content_age_rating AS age_rating
    FROM generate_series(1,1000) g
)
INSERT INTO films (title, synopsis, release_year, age_rating)
SELECT title, synopsis, release_year, age_rating
FROM film_seed;

COMMIT;
