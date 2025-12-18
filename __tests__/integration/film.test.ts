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
      film_cast_members,
      film_genres,
      account_profile_film_ratings,
      account_profile_film_views,
      cast_members,
      genres,
      films,
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
    `INSERT INTO films (id, title, synopsis, release_year, age_rating)
     VALUES ($1, $2, $3, $4, $5)`,
    [1, "Test Film", "Test synopsis", 2023, "PG"]
  );

  await dbClient.query(
    `INSERT INTO genres (id, name)
     VALUES ($1, $2)`,
    [1, "Action"]
  );

  await dbClient.query(
    `INSERT INTO film_genres (film_id, genre_id)
     VALUES ($1, $2)`,
    [1, 1]
  );

  await dbClient.query(
    `INSERT INTO cast_members (id, name)
     VALUES ($1, $2)`,
    [1, "Test Actor"]
  );

  await dbClient.query(
    `INSERT INTO film_cast_members (film_id, cast_member_id)
     VALUES ($1, $2)`,
    [1, 1]
  );

  await dbClient.query(
    `INSERT INTO account_profile_film_views (film_id, account_profile_id)
     VALUES ($1, $2)`,
    [1, 1]
  );

  await dbClient.query(
    `INSERT INTO account_profile_film_ratings (rating, film_id, account_profile_id)
     VALUES ($1, $2, $3)`,
    ["thumbs_up", 1, 1]
  );
});

afterAll(async () => {
  await stopTestServer();

  await dbClient.query(`
    TRUNCATE
      film_cast_members,
      film_genres,
      account_profile_film_ratings,
      account_profile_film_views,
      cast_members,
      genres,
      films,
      account_profiles,
      accounts
    RESTART IDENTITY CASCADE
  `);

  await dbClient.close();
});

describe("query", () => {
  test("film all base fields", async () => {
    const query = `
      query ($filmId: ID!) {
        film(id: $filmId) {
          id
          title
          ageRating
          hasUserWatched
          userRating
        }
      }
    `;

    const variables = { filmId: "1" };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const { data, errors } = await response.json();

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.film).toBeDefined();
  });

  describe("field resolvers", () => {
    test("genres all fields", async () => {
      const query = `
        query ($filmId: ID!) {
          film(id: $filmId) {
            genres {
              id
              name
            }
          }
        }
      `;

      const variables = { filmId: "1" };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });

      const { data, errors } = await response.json();

      expect(errors).toBeUndefined();
      expect(data).toBeDefined();
      expect(data.film).toBeDefined();
      expect(Array.isArray(data.film.genres)).toBe(true);
    });

    test("castMembers all fields", async () => {
      const query = `
        query ($filmId: ID!) {
          film(id: $filmId) {
            castMembers {
              id
              name
            }
          }
        }
      `;

      const variables = { filmId: "1" };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });

      const { data, errors } = await response.json();

      expect(errors).toBeUndefined();
      expect(data).toBeDefined();
      expect(data.film).toBeDefined();
      expect(Array.isArray(data.film.castMembers)).toBe(true);
    });
  });
});
