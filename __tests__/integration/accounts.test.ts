import PgDbClient from "../../src/db/PgDbClient";
import { startTestServer, stopTestServer } from "./server";

let url: string;
let dbClient: PgDbClient;

beforeAll(async () => {
  const res = await startTestServer();
  url = res.url;
  dbClient = res.dbClient;

  await dbClient.query(
    `TRUNCATE account_memberships, account_membership_plans, account_profiles, accounts 
     RESTART IDENTITY CASCADE`
  );

  await dbClient.query(
    `INSERT INTO accounts (id, email, password_hash, mobile_number, created_at)
     VALUES ($1, $2, $3, $4, NOW()), ($5, $6, $7, $8, NOW())`,
    [
      1,
      "test1@example.com",
      "hash1",
      "1111111111",
      2,
      "test2@example.com",
      "hash2",
      "2222222222",
    ]
  );

  await dbClient.query(
    `INSERT INTO account_profiles (id, name, profile_image_url, pin_hash, account_id)
     VALUES ($1, $2, $3, $4, $5), ($6, $7, $8, $9, $10)`,
    [
      1,
      "Profile 1",
      "https://example.com/1.png",
      "pin1",
      1,
      2,
      "Profile 2",
      "https://example.com/2.png",
      "pin2",
      2,
    ]
  );

  await dbClient.query(
    `INSERT INTO account_membership_plans (id, name, monthly_price)
     VALUES ($1, $2, $3)`,
    [1, "Standard", 15.99]
  );

  await dbClient.query(
    `INSERT INTO account_memberships 
      (id, start_date, end_date, status, auto_renew, account_id, account_membership_plan_id, account_membership_price)
     VALUES ($1, NOW(), NOW() + interval '30 days', $2, $3, $4, $5, $6),
            ($7, NOW(), NOW() + interval '30 days', $8, $9, $10, $11, $12)`,
    [1, "active", true, 1, 1, 15.99, 2, "active", false, 2, 1, 15.99]
  );
});

afterAll(async () => {
  await dbClient.query(
    `TRUNCATE account_memberships, account_membership_plans, account_profiles, accounts 
     RESTART IDENTITY CASCADE`
  );
  await dbClient.close();
  await stopTestServer();
});

describe("Accounts Query", () => {
  test("accounts all fields", async () => {
    const query = `
      query {
        accounts {
          email
          createdAt
          id
          mobileNumber
        }
      }
    `;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const { data, errors } = await res.json();
  });

  describe("field resolvers", () => {
    test("accounts profiles", async () => {
      const query = `
        query {
          accounts {
            id
            profiles {
              id
              name
              profileImageUrl
              hasPin
            }
          }
        }
      `;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const { data, errors } = await res.json();
    });

    test("accounts memberships", async () => {
      const query = `
        query {
          accounts {
            id
            memberships {
              id
              status
              startDate
              endDate
              accountMembershipPrice
              autoRenew
            }
          }
        }
      `;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const { data, errors } = await res.json();
    });
  });
});
