BEGIN;

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TYPE content_age_rating AS ENUM ('U', 'PG', '12', '15', '18');
CREATE TYPE content_rating AS ENUM ('thumbs_up', 'thumbs_down', 'double_thumbs_up');

CREATE TABLE films (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL UNIQUE,
    synopsis TEXT NOT NULL,
    release_year SMALLINT NOT NULL CHECK (release_year >= 1888 AND release_year <= EXTRACT(YEAR FROM now())::SMALLINT + 5),
    age_rating content_age_rating NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE film_views (
    id BIGSERIAL PRIMARY KEY,
    film_id BIGINT NOT NULL REFERENCES films(id) ON DELETE CASCADE,
    account_id BIGINT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    UNIQUE (film_id, account_id)
);

CREATE TABLE film_ratings (
    id BIGSERIAL PRIMARY KEY,
    rating content_rating NOT NULL,
    film_id BIGINT NOT NULL REFERENCES films(id) ON DELETE CASCADE,
    account_id BIGINT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    UNIQUE (film_id, account_id)
);

CREATE TABLE series (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL UNIQUE,
    synopsis TEXT NOT NULL,
    release_year SMALLINT NOT NULL CHECK (release_year >= 1888 AND release_year <= EXTRACT(YEAR FROM now())::SMALLINT + 5),
    age_rating content_age_rating NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE seasons (
    id BIGSERIAL PRIMARY KEY,
    number SMALLINT NOT NULL CHECK (number > 0),
    age_rating content_age_rating NOT NULL,
    release_year SMALLINT NOT NULL CHECK (release_year >= 1888 AND release_year <= EXTRACT(YEAR FROM now())::SMALLINT + 5),
    series_id BIGINT NOT NULL REFERENCES series(id) ON DELETE CASCADE,
    UNIQUE (series_id, number)
);

CREATE TABLE episodes (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    synopsis TEXT NOT NULL,
    duration_minutes SMALLINT NOT NULL CHECK (duration_minutes > 0),
    number SMALLINT NOT NULL CHECK (number > 0),
    season_id BIGINT NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
    UNIQUE (season_id, number)
);

CREATE TABLE series_views (
    id BIGSERIAL PRIMARY KEY,
    series_id BIGINT NOT NULL REFERENCES series(id) ON DELETE CASCADE,
    account_id BIGINT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    UNIQUE (series_id, account_id)
);

CREATE TABLE series_ratings (
    id BIGSERIAL PRIMARY KEY,
    rating content_rating NOT NULL,
    series_id BIGINT NOT NULL REFERENCES series(id) ON DELETE CASCADE,
    account_id BIGINT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    UNIQUE (series_id, account_id)
);

CREATE TABLE genres (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE film_genres (
    film_id BIGINT NOT NULL REFERENCES films(id) ON DELETE CASCADE,
    genre_id BIGINT NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (film_id, genre_id)
);

CREATE TABLE series_genres (
    series_id BIGINT NOT NULL REFERENCES series(id) ON DELETE CASCADE,
    genre_id BIGINT NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (series_id, genre_id)
);

CREATE TABLE cast_members (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE film_cast_members (
    film_id BIGINT NOT NULL REFERENCES films(id) ON DELETE CASCADE,
    cast_member_id BIGINT NOT NULL REFERENCES cast_members(id) ON DELETE CASCADE,
    PRIMARY KEY (film_id, cast_member_id)
);

CREATE TABLE series_cast_members (
    series_id BIGINT NOT NULL REFERENCES series(id) ON DELETE CASCADE,
    cast_member_id BIGINT NOT NULL REFERENCES cast_members(id) ON DELETE CASCADE,
    PRIMARY KEY (series_id, cast_member_id)
);

CREATE INDEX idx_films_title_trgm ON films USING gin (title gin_trgm_ops);
CREATE INDEX idx_films_release_year ON films (release_year);
CREATE INDEX idx_films_release_year_desc ON films (release_year DESC);
CREATE INDEX idx_films_age_rating ON films(age_rating);
CREATE INDEX idx_films_created_at ON films(created_at);

CREATE INDEX idx_film_views_account_id ON film_views(account_id);
CREATE INDEX idx_film_views_film_id ON film_views(film_id);

CREATE INDEX idx_film_ratings_film_id_rating ON film_ratings(film_id, rating);

CREATE INDEX idx_series_title_trgm ON series USING gin (title gin_trgm_ops);
CREATE INDEX idx_series_release_year ON series(release_year);
CREATE INDEX idx_series_release_year_desc ON series(release_year DESC);
CREATE INDEX idx_series_age_rating ON series(age_rating);
CREATE INDEX idx_series_created_at ON series(created_at);

COMMIT;