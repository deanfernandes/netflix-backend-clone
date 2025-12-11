import { startTestServer, stopTestServer } from "./server";
import { mockAccounts } from "./mocks";

let baseUrl: string;

beforeAll(async () => {
  const res = await startTestServer();
  baseUrl = res.url;
});

afterAll(async () => {
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
