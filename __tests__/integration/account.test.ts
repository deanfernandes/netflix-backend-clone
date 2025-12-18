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
     VALUES ($1, $2, $3, $4, NOW())`,
    [1, "test@example.com", "hashedpass123", "1234567890"]
  );

  await dbClient.query(
    `INSERT INTO account_profiles (id, name, profile_image_url, pin_hash, account_id)
     VALUES ($1, $2, $3, $4, $5)`,
    [1, "Test Profile", "https://example.com/avatar.png", "hashedpin123", 1]
  );

  await dbClient.query(
    `INSERT INTO account_membership_plans (id, name, monthly_price)
     VALUES ($1, $2, $3)`,
    [1, "Standard", 15.99]
  );

  await dbClient.query(
    `INSERT INTO account_memberships 
      (id, start_date, end_date, status, auto_renew, account_id, account_membership_plan_id, account_membership_price)
     VALUES ($1, NOW(), NOW() + interval '30 days', $2, $3, $4, $5, $6)`,
    [1, "active", true, 1, 1, 15.99]
  );
});

afterAll(async () => {
  await stopTestServer();

  await dbClient.query(
    `TRUNCATE account_memberships, account_membership_plans, account_profiles, accounts 
     RESTART IDENTITY CASCADE`
  );

  await dbClient.close();
});

describe("query", () => {
  test("account all fields", async () => {
    const query = `
    query ($accountId: ID!) {
      account(id: $accountId) {
        createdAt
        email
        id
        mobileNumber
      }
    }
  `;

    const variables = { accountId: "1" };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const { data, errors } = await response.json();
  });

  describe("field resolvers", () => {
    test("profiles all fields", async () => {
      const query = `
    query ($accountId: ID!) {
      account(id: $accountId) {
        profiles {
          hasPin
          id
          name
          profileImageUrl
        }
      }
    }
  `;

      const variables = { accountId: "1" };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });

      const { data, errors } = await response.json();
    });

    test("memberships all fields", async () => {
      const query = `
    query ($accountId: ID!) {
      account(id: $accountId) {
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

      const variables = { accountId: "1" };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });

      const { data, errors } = await response.json();
    });
  });
});
