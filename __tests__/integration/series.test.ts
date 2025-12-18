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
      series_cast_members,
      series_genres,
      account_profile_series_ratings,
      account_profile_series_views,
      cast_members,
      genres,
      episodes,
      seasons,
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
    `INSERT INTO series (id, title, synopsis, release_year, age_rating)
     VALUES ($1, $2, $3, $4, $5)`,
    [1, "Test Series", "Series synopsis", 2023, "PG"]
  );

  await dbClient.query(
    `INSERT INTO seasons (id, number, age_rating, release_year, series_id)
     VALUES ($1, $2, $3, $4, $5)`,
    [1, 1, "PG", 2023, 1]
  );

  await dbClient.query(`INSERT INTO genres (id, name) VALUES ($1, $2)`, [
    1,
    "Drama",
  ]);

  await dbClient.query(
    `INSERT INTO series_genres (series_id, genre_id) VALUES ($1, $2)`,
    [1, 1]
  );

  await dbClient.query(`INSERT INTO cast_members (id, name) VALUES ($1, $2)`, [
    1,
    "Actor 1",
  ]);

  await dbClient.query(
    `INSERT INTO series_cast_members (series_id, cast_member_id) VALUES ($1, $2)`,
    [1, 1]
  );

  await dbClient.query(
    `INSERT INTO account_profile_series_views (series_id, account_profile_id)
     VALUES ($1, $2)`,
    [1, 1]
  );

  await dbClient.query(
    `INSERT INTO account_profile_series_ratings (rating, series_id, account_profile_id)
     VALUES ($1, $2, $3)`,
    ["thumbs_up", 1, 1]
  );
});

afterAll(async () => {
  await stopTestServer();

  await dbClient.query(`
    TRUNCATE
      series_cast_members,
      series_genres,
      account_profile_series_ratings,
      account_profile_series_views,
      cast_members,
      genres,
      episodes,
      seasons,
      series,
      account_profiles,
      accounts
    RESTART IDENTITY CASCADE
  `);

  await dbClient.close();
});

describe("query", () => {
  test("series all base fields", async () => {
    const query = `
      query ($seriesId: ID!) {
        series(id: $seriesId) {
          id
          title
          ageRating
          hasUserWatched
          userRating
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
    expect(data).toBeDefined();
    expect(data.series).toBeDefined();
    expect(data.series.id).toBe("1");
    expect(data.series.title).toBe("Test Series");
    expect(data.series.ageRating).toBe("PG");
    expect(data.series.hasUserWatched).toBe(true);
    expect(data.series.userRating).toBe("THUMBS_UP");
  });

  describe("field resolvers", () => {
    test("seasons all fields", async () => {
      const query = `
        query {
          series(id: "1") {
            seasons {
              id
              number
              ageRating
              releaseYear
            }
          }
        }
      `;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const { data, errors } = await response.json();

      expect(errors).toBeUndefined();
      expect(data).toBeDefined();
      expect(Array.isArray(data.series.seasons)).toBe(true);
      data.series.seasons.forEach((season: any) => {
        expect(season.id).toBeDefined();
        expect(season.number).toBeDefined();
        expect(["U", "PG", "12", "15", "18"]).toContain(season.ageRating);
        expect(season.releaseYear).toBeDefined();
      });
    });

    test("genres all fields", async () => {
      const query = `
        query {
          series(id: "1") {
            genres {
              id
              name
            }
          }
        }
      `;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const { data, errors } = await response.json();

      expect(errors).toBeUndefined();
      expect(data).toBeDefined();
      expect(Array.isArray(data.series.genres)).toBe(true);
      data.series.genres.forEach((genre: any) => {
        expect(genre.id).toBeDefined();
        expect(genre.name).toBeDefined();
      });
    });

    test("castMembers all fields", async () => {
      const query = `
        query {
          series(id: "1") {
            castMembers {
              id
              name
            }
          }
        }
      `;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const { data, errors } = await response.json();

      expect(errors).toBeUndefined();
      expect(data).toBeDefined();
      expect(Array.isArray(data.series.castMembers)).toBe(true);
      data.series.castMembers.forEach((cast: any) => {
        expect(cast.id).toBeDefined();
        expect(cast.name).toBeDefined();
      });
    });
  });
});
