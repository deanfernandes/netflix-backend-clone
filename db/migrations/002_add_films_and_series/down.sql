BEGIN;

DROP INDEX IF EXISTS idx_films_title_trgm;
DROP INDEX IF EXISTS idx_films_release_year;
DROP INDEX IF EXISTS idx_films_release_year_desc;
DROP INDEX IF EXISTS idx_films_age_rating;
DROP INDEX IF EXISTS idx_films_created_at;
DROP INDEX IF EXISTS idx_film_views_account_id;
DROP INDEX IF EXISTS idx_film_views_film_id;
DROP INDEX IF EXISTS idx_film_ratings_film_id_rating;
DROP INDEX IF EXISTS idx_series_title_trgm;
DROP INDEX IF EXISTS idx_series_release_year;
DROP INDEX IF EXISTS idx_series_release_year_desc;
DROP INDEX IF EXISTS idx_series_age_rating;
DROP INDEX IF EXISTS idx_series_created_at;

DROP TABLE IF EXISTS series_cast_members;
DROP TABLE IF EXISTS film_cast_members;
DROP TABLE IF EXISTS cast_members;
DROP TABLE IF EXISTS series_genres;
DROP TABLE IF EXISTS film_genres;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS series_ratings;
DROP TABLE IF EXISTS series_views;
DROP TABLE IF EXISTS episodes;
DROP TABLE IF EXISTS seasons;
DROP TABLE IF EXISTS series;
DROP TABLE IF EXISTS film_ratings;
DROP TABLE IF EXISTS film_views;
DROP TABLE IF EXISTS films;

DROP TYPE IF EXISTS content_rating;
DROP TYPE IF EXISTS content_age_rating;

COMMIT;
