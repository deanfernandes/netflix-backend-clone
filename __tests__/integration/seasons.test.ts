import PgDbClient from "../../src/db/PgDbClient";
import { startTestServer, stopTestServer } from "./server";

let url: string;
let dbClient: PgDbClient;

beforeAll(async () => {
  const res = await startTestServer();
  url = res.url;
  dbClient = res.dbClient;

  await dbClient.query(`
    TRUNCATE
      episodes,
      seasons,
      series_cast_members,
      series_genres,
      account_profile_series_ratings,
      account_profile_series_views,
      cast_members,
      genres,
      series,
      account_profiles,
      accounts
    RESTART IDENTITY CASCADE
  `);

  await dbClient.query(
    `INSERT INTO accounts (id, email, password_hash, mobile_number, created_at)
     VALUES ($1, $2, $3, $4, NOW())`,
    [1, "test@example.com", "hashedpass", "1234567890"]
  );

  await dbClient.query(
    `INSERT INTO account_profiles (id, name, account_id)
     VALUES ($1, $2, $3)`,
    [1, "Main Profile", 1]
  );

  await dbClient.query(
    `INSERT INTO series (id, title, synopsis, release_year, age_rating, created_at)
     VALUES ($1, $2, $3, $4, $5, NOW())`,
    [1, "Series 1", "Synopsis 1", 2023, "PG"]
  );

  await dbClient.query(
    `INSERT INTO seasons (id, number, age_rating, release_year, series_id)
     VALUES ($1, $2, $3, $4, $5), ($6, $7, $8, $9, $10)`,
    [1, 1, "PG", 2023, 1, 2, 2, "12", 2023, 1]
  );

  await dbClient.query(
    `INSERT INTO episodes (id, title, synopsis, duration_minutes, number, season_id)
     VALUES
       ($1, $2, $3, $4, $5, $6),
       ($7, $8, $9, $10, $11, $12)`,
    [
      1,
      "Episode 1",
      "Episode 1 synopsis",
      45,
      1,
      1,
      2,
      "Episode 2",
      "Episode 2 synopsis",
      50,
      2,
      1,
    ]
  );

  await dbClient.query(
    `INSERT INTO genres (id, name) VALUES ($1, $2), ($3, $4)`,
    [1, "Drama", 2, "Action"]
  );

  await dbClient.query(
    `INSERT INTO series_genres (series_id, genre_id) VALUES ($1, $2), ($3, $4)`,
    [1, 1, 1, 2]
  );

  await dbClient.query(
    `INSERT INTO cast_members (id, name) VALUES ($1, $2), ($3, $4)`,
    [1, "Actor 1", 2, "Actor 2"]
  );

  await dbClient.query(
    `INSERT INTO series_cast_members (series_id, cast_member_id) VALUES ($1, $2), ($3, $4)`,
    [1, 1, 1, 2]
  );
});

afterAll(async () => {
  await stopTestServer();

  await dbClient.query(`
    TRUNCATE
      episodes,
      seasons,
      series_cast_members,
      series_genres,
      account_profile_series_ratings,
      account_profile_series_views,
      cast_members,
      genres,
      series,
      account_profiles,
      accounts
    RESTART IDENTITY CASCADE
  `);

  await dbClient.close();
});

describe("query", () => {
  test("seasons all base fields", async () => {
    const query = `
      query ($seriesId: ID!) {
        seasons(seriesId: $seriesId) {
          id
          number
          ageRating
          releaseYear
        }
      }
    `;

    const variables = { seriesId: "1" };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const { data, errors } = await response.json();

    expect(errors).toBeUndefined();
    expect(Array.isArray(data.seasons)).toBe(true);
    expect(data.seasons.length).toBeGreaterThan(0);
    data.seasons.forEach((season: any) => {
      expect(season.id).toBeDefined();
      expect(season.number).toBeDefined();
      expect(["U", "PG", "_12", "_15", "_18"]).toContain(season.ageRating);
      expect(season.releaseYear).toBeDefined();
    });
  });

  describe("field resolvers", () => {
    test("series field resolver for season", async () => {
      const query = `
        query ($seriesId: ID!) {
          seasons(seriesId: $seriesId) {
            id
            series {
              id
              title
              ageRating
              hasUserWatched
              userRating
            }
          }
        }
      `;

      const variables = { seriesId: "1" };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });

      const { data, errors } = await response.json();

      expect(errors).toBeUndefined();
      data.seasons.forEach((season: any) => {
        expect(season.series).toBeDefined();
        expect(season.series.id).toBeDefined();
        expect(season.series.title).toBeDefined();
        expect(["U", "PG", "12", "15", "18"]).toContain(
          season.series.ageRating
        );
        expect(season.series.hasUserWatched).toBeNull();
        expect(season.series.userRating).toBeNull();
      });
    });

    test("episodes field resolver for season", async () => {
      const query = `
        query ($seriesId: ID!) {
          seasons(seriesId: $seriesId) {
            id
            episodes {
              id
              title
              synopsis
              durationMinutes
              number
            }
          }
        }
      `;

      const variables = { seriesId: "1" };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });

      const { data, errors } = await response.json();

      expect(errors).toBeUndefined();
      data.seasons.forEach((season: any) => {
        expect(Array.isArray(season.episodes)).toBe(true);
        season.episodes.forEach((ep: any) => {
          expect(ep.id).toBeDefined();
          expect(ep.title).toBeDefined();
          expect(ep.synopsis).toBeDefined();
          expect(ep.durationMinutes).toBeDefined();
          expect(ep.number).toBeDefined();
        });
      });
    });
  });
});
