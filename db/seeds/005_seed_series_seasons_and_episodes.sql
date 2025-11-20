BEGIN;

-- Seed 500 series
WITH series_seed AS (
    SELECT
        'Series ' || g AS title,
        'Synopsis for series ' || g AS synopsis,
        (1888 + floor(random() * (EXTRACT(YEAR FROM now())::int - 1888 + 1)))::smallint AS release_year,
        (ARRAY['U','PG','12','15','18'])[floor(random() * 5 + 1)]::content_age_rating AS age_rating
    FROM generate_series(1,500) g
)
INSERT INTO series (title, synopsis, release_year, age_rating)
SELECT title, synopsis, release_year, age_rating
FROM series_seed;

-- Capture series IDs and release_years
WITH series_ids AS (
    SELECT id, release_year, age_rating
    FROM series
),
-- Each series gets 1-10 seasons
season_expansion AS (
    SELECT
        s.id AS series_id,
        s.release_year AS series_release_year,
        s.age_rating AS series_age_rating,
        gs AS season_number
    FROM series_ids s
    JOIN generate_series(1, (floor(random()*10) + 1)::int) gs ON true
),
-- Assign random age_rating and release_year for each season
season_seed AS (
    SELECT
        se.series_id,
        se.season_number AS number,
        (ARRAY['U','PG','12','15','18'])[floor(random() * 5 + 1)]::content_age_rating AS age_rating,
        LEAST(se.series_release_year + se.season_number - 1, EXTRACT(YEAR FROM now())::smallint + 5)::smallint AS release_year
    FROM season_expansion se
)
INSERT INTO seasons (series_id, number, age_rating, release_year)
SELECT series_id, number, age_rating, release_year
FROM season_seed;

-- Capture season IDs and number
WITH season_ids AS (
    SELECT id, series_id, number AS season_number
    FROM seasons
),
-- Each season gets 1-20 episodes
episode_expansion AS (
    SELECT
        s.id AS season_id,
        gs AS episode_number
    FROM season_ids s
    JOIN generate_series(1, (floor(random()*20) + 1)::int) gs ON true
)
INSERT INTO episodes (season_id, number, title, synopsis, duration_minutes)
SELECT
    ee.season_id,
    ee.episode_number AS number,
    'Episode ' || ee.episode_number AS title,
    'Synopsis for episode ' || ee.episode_number AS synopsis,
    (20 + floor(random() * 41))::smallint AS duration_minutes  -- 20-60 minutes
FROM episode_expansion ee;

COMMIT;
