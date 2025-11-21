BEGIN;

CREATE TABLE account_profile_watchlist_films (
    account_profile_id BIGINT NOT NULL REFERENCES account_profiles(id) ON DELETE CASCADE,
    film_id BIGINT NOT NULL REFERENCES films(id) ON DELETE CASCADE,
    PRIMARY KEY (account_profile_id, film_id)
);

CREATE TABLE account_profile_watchlist_series (
    account_profile_id BIGINT NOT NULL REFERENCES account_profiles(id) ON DELETE CASCADE,
    series_id BIGINT NOT NULL REFERENCES series(id) ON DELETE CASCADE,
    PRIMARY KEY (account_profile_id, series_id)
);

COMMIT;