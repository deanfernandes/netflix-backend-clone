import PgDbClient from "../../src/db/PgDbClient";
import { startTestServer, stopTestServer } from "./server";

let url: string;
let dbClient: PgDbClient;

beforeAll(async () => {
  const res = await startTestServer();
  url = res.url;
  dbClient = res.dbClient;

  await dbClient.query(
    `TRUNCATE account_profiles, accounts 
     RESTART IDENTITY CASCADE`
  );

  await dbClient.query(
    `INSERT INTO accounts (id, email, password_hash, mobile_number, created_at)
     VALUES ($1, $2, $3, $4, NOW())`,
    [1, "test@example.com", "hashedpass123", "1234567890"]
  );

  await dbClient.query(
    `INSERT INTO account_profiles (id, name, profile_image_url, pin_hash, account_id)
     VALUES ($1, $2, $3, $4, $5)`,
    [1, "Test Profile", "https://example.com/avatar.png", "hashedpin123", 1]
  );
});

afterAll(async () => {
  await dbClient.query(
    `TRUNCATE account_profiles, accounts 
     RESTART IDENTITY CASCADE`
  );
  await dbClient.close();
  await stopTestServer();
});

describe("Account Profile Query", () => {
  test("account profile all fields", async () => {
    const query = `
      query ($accountProfileId: ID!) {
        accountProfile(id: $accountProfileId) {
          hasPin
          id
          name
          profileImageUrl
        }
      }
    `;

    const variables = { accountProfileId: "1" };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const { data, errors } = await response.json();
  });
});
