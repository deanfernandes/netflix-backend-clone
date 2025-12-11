import { startTestServer, stopTestServer } from "./server";
import { mockAccounts, mockMemberships } from "./mocks";

let url: string;

beforeAll(async () => {
  ({ url } = await startTestServer());
});

afterAll(async () => {
  await stopTestServer();
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

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.account).toBeDefined();
    expect(data.account.id).toBe("1");
    expect(data.account.email).toBe(mockAccounts[0].email);
    expect(data.account.mobileNumber).toBe(mockAccounts[0].mobileNumber);
    expect(new Date(data.account.createdAt)).toBeInstanceOf(Date);
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

      expect(errors).toBeUndefined();
      expect(data).toBeDefined();
      expect(data.account).toBeDefined();
      expect(Array.isArray(data.account.profiles)).toBe(true);
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

      expect(errors).toBeUndefined();
      expect(data).toBeDefined();
      expect(data.account).toBeDefined();
      expect(Array.isArray(data.account.memberships)).toBe(true);
      expect(data.account.memberships.length).toBe(mockMemberships.length);
      expect(data.account.memberships[0].status).toBe("ACTIVE");
    });
  });
});
