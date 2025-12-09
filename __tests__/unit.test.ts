import { startStandaloneServer } from "@apollo/server/standalone";
import { createApolloServer } from "../src/server.js";
import { ApolloServer } from "@apollo/server";

let server: ApolloServer;
let baseUrl: string;
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
  test("accounts", async () => {
    const query = `
    query {
      accounts {
        email
      }
    }
  `;

    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    //const data = await response.json();
  });
});
