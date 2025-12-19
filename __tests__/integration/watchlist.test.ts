import PgDbClient from "../../src/db/PgDbClient";
import { startTestServer, stopTestServer } from "./server";

let url: string;
let dbClient: PgDbClient;

beforeAll(async () => {
  const res = await startTestServer();
  url = res.url;
  dbClient = res.dbClient;

  await dbClient.query(
    `TRUNCATE
      account_profile_watchlist_films,
      account_profile_watchlist_series,
      films,
      series,
      account_profiles,
      accounts
     RESTART IDENTITY CASCADE`
  );

  await dbClient.query(
    `INSERT INTO accounts (email, password_hash, mobile_number)
     VALUES ($1, $2, $3)`,
    ["test@example.com", "hashedpass", "1234567890"]
  );

  await dbClient.query(
    `INSERT INTO account_profiles (name, profile_image_url, pin_hash, account_id)
     VALUES ($1, $2, $3, $4)`,
    ["Test Profile", null, null, 1]
  );

  await dbClient.query(
    `INSERT INTO films (title, synopsis, release_year, age_rating)
     VALUES ($1, $2, $3, $4)`,
    ["Action Movie", "An action-packed movie", 2023, "PG"]
  );

  await dbClient.query(
    `INSERT INTO series (title, synopsis, release_year, age_rating)
     VALUES ($1, $2, $3, $4)`,
    ["Epic Adventure", "An epic journey across the world.", 2023, "PG"]
  );

  await dbClient.query(
    `INSERT INTO account_profile_watchlist_films (account_profile_id, film_id)
     VALUES ($1, $2)`,
    [1, 1]
  );

  await dbClient.query(
    `INSERT INTO account_profile_watchlist_series (account_profile_id, series_id)
     VALUES ($1, $2)`,
    [1, 1]
  );
});

afterAll(async () => {
  await stopTestServer();

  await dbClient.query(
    `TRUNCATE
      account_profile_watchlist_films,
      account_profile_watchlist_series,
      films,
      series,
      account_profiles,
      accounts
     RESTART IDENTITY CASCADE`
  );

  await dbClient.close();
});

describe("query and fields resolver", () => {
  test("watchlist films and series and the title", async () => {
    const query = `
      query ($profileId: ID!) {
        watchlist(profileId: $profileId) {
          films {
            addedAt
            film {
              title
            }
          }
          series {
            addedAt
            series {
              title
            }
          }
        }
      }
    `;

    const variables = { profileId: "1" };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const { data, errors } = await response.json();

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.watchlist).toBeDefined();

    expect(data.watchlist.films).toHaveLength(1);
    expect(data.watchlist.films[0].addedAt).toBeDefined();
    expect(data.watchlist.films[0].film.title).toBe("Action Movie");

    expect(data.watchlist.series).toHaveLength(1);
    expect(data.watchlist.series[0].addedAt).toBeDefined();
    expect(data.watchlist.series[0].series.title).toBe("Epic Adventure");
  });
});
