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

describe("query episodes by seasonId", () => {
  test("episodes all base fields", async () => {
    const query = `
      query ($seasonId: ID!) {
        episodes(seasonId: $seasonId) {
          id
          title
          synopsis
          durationMinutes
          number
        }
      }
    `;

    const variables = { seasonId: "1" };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const { data, errors } = await response.json();

    expect(errors).toBeUndefined();
    expect(data.episodes).toBeDefined();
    expect(Array.isArray(data.episodes)).toBe(true);
    expect(data.episodes.length).toBe(2);

    data.episodes.forEach((ep: any) => {
      expect(ep.id).toBeDefined();
      expect(ep.title).toBeDefined();
      expect(ep.synopsis).toBeDefined();
      expect(ep.durationMinutes).toBeDefined();
      expect(ep.number).toBeDefined();
    });
  });

  describe("field resolvers", () => {
    test("season field resolver for each episode", async () => {
      const query = `
        query ($seasonId: ID!) {
          episodes(seasonId: $seasonId) {
            id
            season {
              id
              number
              ageRating
              releaseYear
            }
          }
        }
      `;

      const variables = { seasonId: "1" };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });

      const { data, errors } = await response.json();

      expect(errors).toBeUndefined();
      expect(Array.isArray(data.episodes)).toBe(true);

      data.episodes.forEach((ep: any) => {
        expect(ep.season).toBeDefined();
        expect(ep.season.id).toBe("1");
        expect(ep.season.number).toBe(1);
        expect(["U", "PG", "_12", "_15", "_18"]).toContain(ep.season.ageRating);
        expect(ep.season.releaseYear).toBe(2023);
      });
    });
  });
});
