import { startStandaloneServer } from "@apollo/server/standalone";
import { createApolloServer } from "../src/server.js";
import { ApolloServer } from "@apollo/server";

let server: ApolloServer;
let baseUrl: string;

const mockAccount = {
  id: "1",
  email: "user1@example.com",
  passwordHash: "hashedpassword",
  mobileNumber: "5550000001",
  createdAt: new Date().toISOString(),
};
const mockAccounts = [
  {
    id: "1",
    email: "user1@example.com",
    passwordHash: "hash1",
    mobileNumber: "5550000001",
    createdAt: new Date(),
  },
  {
    id: "2",
    email: "user2@example.com",
    passwordHash: "hash2",
    mobileNumber: "5550000002",
    createdAt: new Date(),
  },
];
const mockProfiles = [
  {
    id: "1",
    accountId: "1",
    name: "Profile 1",
    profileImageUrl: "https://example.com/profile1.png",
    hasPin: false,
  },
  {
    id: "2",
    accountId: "1",
    name: "Profile 2",
    profileImageUrl: "https://example.com/profile2.png",
    hasPin: true,
  },
  {
    id: "3",
    accountId: "2",
    name: "Other Account Profile",
    profileImageUrl: "https://example.com/profile3.png",
    hasPin: false,
  },
];
const mockMemberships = [
  {
    id: "1",
    accountId: "1",
    accountMembershipPlanId: "101",
    accountMembershipPrice: 9.99,
    startDate: "2025-01-01T00:00:00.000Z",
    endDate: "2025-12-31T23:59:59.999Z",
    status: "ACTIVE",
    autoRenew: true,
  },
  {
    id: "2",
    accountId: "1",
    accountMembershipPlanId: "102",
    accountMembershipPrice: 19.99,
    startDate: "2025-01-01T00:00:00.000Z",
    endDate: "2025-12-31T23:59:59.999Z",
    status: "EXPIRED",
    autoRenew: false,
  },
];

beforeAll(async () => {
  server = createApolloServer();

  const { url } = await startStandaloneServer(server, {
    context: async () => ({
      db: {
        getAccounts: jest.fn((limit?: number, offset?: number) => {
          const start = offset ?? 0;
          const end = limit != null ? start + limit : mockAccounts.length;
          return Promise.resolve(mockAccounts.slice(start, end));
        }),
        getAccountById: jest.fn((id: string) => {
          if (id === mockAccount.id) return Promise.resolve(mockAccount);
          return Promise.resolve(null);
        }),
        getAccountProfilesByAccountId: jest.fn((accountId: string) => {
          return Promise.resolve(
            mockProfiles.filter((p) => p.accountId === accountId)
          );
        }),
        getAccountMembershipsByAccountId: jest.fn((accountId: string) => {
          return Promise.resolve(
            mockMemberships.filter((m) => m.accountId === accountId)
          );
        }),
        getAccountProfileById: (id: string) => {
          return Promise.resolve(mockProfiles.find((p) => p.id === id) ?? null);
        },
      },
      currentAccountProfileId: "1", //TODO: rm
    }),
  });

  baseUrl = url;
});

afterAll(async () => {
  server.stop();
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

    const response = await fetch(baseUrl, {
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

    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const { data, errors } = await response.json();

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.accounts).toHaveLength(mockAccounts.length);
    expect(data.accounts[0].email).toBe(mockAccounts[0].email);
  });

  describe("account field resolvers", () => {
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

      const response = await fetch(baseUrl, {
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

      const response = await fetch(baseUrl, {
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

    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const { data, errors } = await response.json();

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.accountProfile).toBeDefined();
    expect(data.accountProfile.id).toBe("1");
    expect(data.accountProfile.name).toBe(mockProfiles[0].name);
    expect(data.accountProfile.profileImageUrl).toBe(
      mockProfiles[0].profileImageUrl
    );
    expect(typeof data.accountProfile.hasPin).toBe("boolean");
  });

  test("account profile all fields", async () => {
    const query = `
      query ($accountId: ID!) {
        accountProfiles(accountId: $accountId) {
          hasPin
          id
          name
          profileImageUrl
        }
      }
    `;

    const variables = { accountId: "1" };

    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const { data, errors } = await response.json();

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(Array.isArray(data.accountProfiles)).toBe(true);
    expect(data.accountProfiles.length).toBeGreaterThan(0);

    data.accountProfiles.forEach((profile: any, index: number) => {
      expect(profile.id).toBe(mockProfiles[index].id);
      expect(profile.name).toBe(mockProfiles[index].name);
      expect(profile.profileImageUrl).toBe(mockProfiles[index].profileImageUrl);
      expect(typeof profile.hasPin).toBe("boolean");
    });
  });
});
