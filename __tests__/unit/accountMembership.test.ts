import { startTestServer, stopTestServer } from "./server";

let url: string;

beforeAll(async () => {
  ({ url } = await startTestServer());
});

afterAll(async () => {
  await stopTestServer();
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

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.accountMembership).toBeDefined();

    const membership = data.accountMembership;

    expect(membership.id).toBe("1");
    expect(membership.accountMembershipPrice).toBe(9.99);
    expect(membership.autoRenew).toBe(true);
    expect(membership.status).toBe("ACTIVE");
    expect(membership.startDate).toBe("2025-01-01T00:00:00.000Z");
    expect(membership.endDate).toBe("2025-12-31T23:59:59.999Z");
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

      expect(errors).toBeUndefined();
      expect(data).toBeDefined();
      expect(data.accountMembership).toBeDefined();
      expect(data.accountMembership.account).toBeDefined();

      const account = data.accountMembership.account;

      expect(account.id).toBe("1");
      expect(account.email).toBe("user1@example.com");
      expect(account.mobileNumber).toBe("5550000001");
      expect(new Date(account.createdAt)).toBeInstanceOf(Date);
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

      expect(errors).toBeUndefined();
      expect(data).toBeDefined();
      expect(data.accountMembership).toBeDefined();
      expect(data.accountMembership.accountMembershipPlan).toBeDefined();

      const plan = data.accountMembership.accountMembershipPlan;

      expect(plan.id).toBe("101");
      expect(plan.name).toBe("Standard");
      expect(plan.monthlyPrice).toBe(9.99);
    });
  });
});
