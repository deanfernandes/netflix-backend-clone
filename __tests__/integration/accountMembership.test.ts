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
    [1, "user1@example.com", "hashedpass123", "5550000001"]
  );

  await dbClient.query(
    `INSERT INTO account_membership_plans (id, name, monthly_price)
     VALUES ($1, $2, $3)`,
    [101, "Standard", 9.99]
  );

  await dbClient.query(
    `INSERT INTO account_memberships
      (id, start_date, end_date, status, auto_renew, account_id, account_membership_plan_id, account_membership_price)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      1,
      "2025-01-01T00:00:00.000Z",
      "2025-12-31T23:59:59.999Z",
      "active",
      true,
      1,
      101,
      9.99,
    ]
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

describe("Account Membership Query", () => {
  test("account membership all fields", async () => {
    const query = `
      query ($accountMembershipId: ID!) {
        accountMembership(id: $accountMembershipId) {
          accountMembershipPrice
          autoRenew
          endDate
          id
          startDate
          status
        }
      }
    `;

    const variables = { accountMembershipId: "1" };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const { data, errors } = await response.json();
  });

  describe("field resolvers", () => {
    test("account fields", async () => {
      const query = `
        query ($accountMembershipId: ID!) {
          accountMembership(id: $accountMembershipId) {
            account {
              createdAt
              email
              id
              mobileNumber
            }
          }
        }
      `;

      const variables = { accountMembershipId: "1" };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });

      const { data, errors } = await response.json();
    });

    test("account membership plan fields", async () => {
      const query = `
        query ($accountMembershipId: ID!) {
          accountMembership(id: $accountMembershipId) {
            accountMembershipPlan {
              id
              name
              monthlyPrice
            }
          }
        }
      `;

      const variables = { accountMembershipId: "1" };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });

      const { data, errors } = await response.json();
    });
  });
});
