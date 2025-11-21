BEGIN;

ALTER TABLE account_profile_film_views DROP CONSTRAINT account_profile_film_views_account_profile_id_fkey;
ALTER TABLE account_profile_film_views
    RENAME COLUMN account_profile_id TO account_id;
ALTER TABLE account_profile_film_views
    ADD CONSTRAINT film_views_account_id_fkey
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE;
ALTER TABLE account_profile_film_views
    DROP CONSTRAINT account_profile_film_views_unique,
    ADD CONSTRAINT film_views_film_id_account_id_key
    UNIQUE (film_id, account_id);
ALTER TABLE account_profile_film_views RENAME TO film_views;

ALTER TABLE account_profile_film_ratings DROP CONSTRAINT account_profile_film_ratings_account_profile_id_fkey;
ALTER TABLE account_profile_film_ratings
    RENAME COLUMN account_profile_id TO account_id;
ALTER TABLE account_profile_film_ratings
    ADD CONSTRAINT film_ratings_account_id_fkey
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE;
ALTER TABLE account_profile_film_ratings
    DROP CONSTRAINT account_profile_film_ratings_unique,
    ADD CONSTRAINT film_ratings_film_id_account_id_key
    UNIQUE (film_id, account_id);
ALTER TABLE account_profile_film_ratings RENAME TO film_ratings;

ALTER TABLE account_profile_series_views DROP CONSTRAINT account_profile_series_views_account_profile_id_fkey;
ALTER TABLE account_profile_series_views
    RENAME COLUMN account_profile_id TO account_id;
ALTER TABLE account_profile_series_views
    ADD CONSTRAINT series_views_account_id_fkey
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE;
ALTER TABLE account_profile_series_views
    DROP CONSTRAINT account_profile_series_views_unique,
    ADD CONSTRAINT series_views_series_id_account_id_key
    UNIQUE (series_id, account_id);
ALTER TABLE account_profile_series_views RENAME TO series_views;

ALTER TABLE account_profile_series_ratings DROP CONSTRAINT account_profile_series_ratings_account_profile_id_fkey;
ALTER TABLE account_profile_series_ratings
    RENAME COLUMN account_profile_id TO account_id;
ALTER TABLE account_profile_series_ratings
    ADD CONSTRAINT series_ratings_account_id_fkey
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE;
ALTER TABLE account_profile_series_ratings
    DROP CONSTRAINT account_profile_series_ratings_unique,
    ADD CONSTRAINT series_ratings_series_id_account_id_key
    UNIQUE (series_id, account_id);
ALTER TABLE account_profile_series_ratings RENAME TO series_ratings;

COMMIT;