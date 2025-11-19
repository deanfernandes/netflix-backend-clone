BEGIN;

ALTER TABLE film_views RENAME TO account_profile_film_views;

ALTER TABLE account_profile_film_views DROP CONSTRAINT film_views_account_id_fkey;

ALTER TABLE account_profile_film_views
    RENAME COLUMN account_id TO account_profile_id;

ALTER TABLE account_profile_film_views
    ADD CONSTRAINT account_profile_film_views_account_profile_id_fkey
    FOREIGN KEY (account_profile_id) REFERENCES account_profiles(id) ON DELETE CASCADE;

ALTER TABLE account_profile_film_views
    DROP CONSTRAINT film_views_film_id_account_id_key,
    ADD CONSTRAINT account_profile_film_views_unique
    UNIQUE (film_id, account_profile_id);

ALTER TABLE film_ratings RENAME TO account_profile_film_ratings;

ALTER TABLE account_profile_film_ratings DROP CONSTRAINT film_ratings_account_id_fkey;

ALTER TABLE account_profile_film_ratings
    RENAME COLUMN account_id TO account_profile_id;

ALTER TABLE account_profile_film_ratings
    ADD CONSTRAINT account_profile_film_ratings_account_profile_id_fkey
    FOREIGN KEY (account_profile_id) REFERENCES account_profiles(id) ON DELETE CASCADE;

ALTER TABLE account_profile_film_ratings
    DROP CONSTRAINT film_ratings_film_id_account_id_key,
    ADD CONSTRAINT account_profile_film_ratings_unique
    UNIQUE (film_id, account_profile_id);

ALTER TABLE series_views RENAME TO account_profile_series_views;

ALTER TABLE account_profile_series_views DROP CONSTRAINT series_views_account_id_fkey;

ALTER TABLE account_profile_series_views
    RENAME COLUMN account_id TO account_profile_id;

ALTER TABLE account_profile_series_views
    ADD CONSTRAINT account_profile_series_views_account_profile_id_fkey
    FOREIGN KEY (account_profile_id) REFERENCES account_profiles(id) ON DELETE CASCADE;

ALTER TABLE account_profile_series_views
    DROP CONSTRAINT series_views_series_id_account_id_key,
    ADD CONSTRAINT account_profile_series_views_unique
    UNIQUE (series_id, account_profile_id);

ALTER TABLE series_ratings RENAME TO account_profile_series_ratings;

ALTER TABLE account_profile_series_ratings DROP CONSTRAINT series_ratings_account_id_fkey;

ALTER TABLE account_profile_series_ratings
    RENAME COLUMN account_id TO account_profile_id;

ALTER TABLE account_profile_series_ratings
    ADD CONSTRAINT account_profile_series_ratings_account_profile_id_fkey
    FOREIGN KEY (account_profile_id) REFERENCES account_profiles(id) ON DELETE CASCADE;

ALTER TABLE account_profile_series_ratings
    DROP CONSTRAINT series_ratings_series_id_account_id_key,
    ADD CONSTRAINT account_profile_series_ratings_unique
    UNIQUE (series_id, account_profile_id);

COMMIT;