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
     VALUES ($1, $2, $3, $4, $5)`,
    [1, 1, "PG", 2023, 1]
  );

  await dbClient.query(
    `INSERT INTO episodes (id, title, synopsis, duration_minutes, number, season_id)
     VALUES ($1, $2, $3, $4, $5, $6),
            ($7, $8, $9, $10, $11, $12)`,
    [
      1,
      "Episode 1",
      "Synopsis 1",
      45,
      1,
      1,
      2,
      "Episode 2",
      "Synopsis 2",
      50,
      2,
      1,
    ]
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

describe("query season", () => {
  test("season base fields", async () => {
    const query = `
      query ($id: ID!) {
        season(id: $id) {
          id
          number
          ageRating
          releaseYear
        }
      }
    `;

    const variables = { id: "1" };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const { data, errors } = await response.json();

    expect(errors).toBeUndefined();
    expect(data.season).toBeDefined();
    expect(data.season.id).toBe("1");
    expect(data.season.number).toBe(1);
    expect(["U", "PG", "_12", "_15", "_18"]).toContain(data.season.ageRating);
    expect(data.season.releaseYear).toBe(2023);
  });

  describe("field resolvers", () => {
    test("series field resolver", async () => {
      const query = `
        query ($id: ID!) {
          season(id: $id) {
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

      const variables = { id: "1" };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });

      const { data, errors } = await response.json();

      expect(errors).toBeUndefined();
      expect(data.season.series).toBeDefined();
      expect(data.season.series.id).toBe("1");
      expect(data.season.series.title).toBe("Series 1");
      expect(["U", "PG", "_12", "_15", "_18"]).toContain(
        data.season.series.ageRating
      );
      expect(data.season.series.hasUserWatched).toBeNull();
      expect(data.season.series.userRating).toBeNull();
    });

    test("episodes field resolver", async () => {
      const query = `
        query ($id: ID!) {
          season(id: $id) {
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

      const variables = { id: "1" };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });

      const { data, errors } = await response.json();

      expect(errors).toBeUndefined();
      expect(Array.isArray(data.season.episodes)).toBe(true);
      expect(data.season.episodes.length).toBe(2);

      data.season.episodes.forEach((ep: any) => {
        expect(ep.id).toBeDefined();
        expect(ep.title).toBeDefined();
        expect(ep.synopsis).toBeDefined();
        expect(ep.durationMinutes).toBeDefined();
        expect(ep.number).toBeDefined();
      });
    });
  });
});
