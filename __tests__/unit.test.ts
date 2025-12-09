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
      },
      currentAccountProfileId: "1", // TODO: rm
    }),
  });

  baseUrl = url;
});

afterAll(async () => {
  server.stop();
});

describe("query", () => {
  test.only("account all fields", async () => {
    const query = `
    query {
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
});
