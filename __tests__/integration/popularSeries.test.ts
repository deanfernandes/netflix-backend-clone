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
     VALUES ($1, $2, $3, $4, NOW()), ($5, $6, $7, $8, NOW())`,
    [
      1,
      "user1@example.com",
      "pass",
      "1234567890",
      2,
      "user2@example.com",
      "pass",
      "0987654321",
    ]
  );

  await dbClient.query(
    `INSERT INTO account_profiles (id, name, account_id)
     VALUES ($1, $2, $3), ($4, $5, $6)`,
    [1, "Profile 1", 1, 2, "Profile 2", 2]
  );

  await dbClient.query(
    `INSERT INTO series (id, title, synopsis, release_year, age_rating, created_at)
     VALUES
       ($1, $2, $3, $4, $5, NOW() - interval '10 days'),
       ($6, $7, $8, $9, $10, NOW() - interval '5 days')`,
    [
      1,
      "Popular Series 1",
      "Synopsis 1",
      2023,
      "PG",
      2,
      "Popular Series 2",
      "Synopsis 2",
      2022,
      "12",
    ]
  );

  await dbClient.query(
    `INSERT INTO genres (id, name) VALUES ($1, $2), ($3, $4)`,
    [1, "Drama", 2, "Action"]
  );

  await dbClient.query(
    `INSERT INTO series_genres (series_id, genre_id) VALUES ($1, $2), ($3, $4)`,
    [1, 1, 2, 2]
  );

  await dbClient.query(
    `INSERT INTO cast_members (id, name) VALUES ($1, $2), ($3, $4)`,
    [1, "Actor 1", 2, "Actor 2"]
  );

  await dbClient.query(
    `INSERT INTO series_cast_members (series_id, cast_member_id) VALUES ($1, $2), ($3, $4)`,
    [1, 1, 2, 2]
  );

  await dbClient.query(
    `INSERT INTO account_profile_series_views (series_id, account_profile_id)
     VALUES ($1, $2), ($3, $4), ($5, $6)`,
    [1, 1, 1, 2, 2, 1]
  );

  await dbClient.query(
    `INSERT INTO account_profile_series_ratings (rating, series_id, account_profile_id)
     VALUES ($1, $2, $3), ($4, $5, $6)`,
    ["thumbs_up", 1, 1, "double_thumbs_up", 2, 2]
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
  test("popularSeries all base fields", async () => {
    const query = `
      query ($limit: Int, $offset: Int) {
        popularSeries(limit: $limit, offset: $offset) {
          id
          title
          ageRating
          hasUserWatched
          userRating
        }
      }
    `;

    const variables = { limit: 50, offset: 0 };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const { data, errors } = await response.json();

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(Array.isArray(data.popularSeries)).toBe(true);
    expect(data.popularSeries.length).toBeGreaterThan(0);
    expect(data.popularSeries[0].id).toBeDefined();
    expect(data.popularSeries[0].title).toBeDefined();
    expect(data.popularSeries[0].ageRating).toBeDefined();
  });
});
