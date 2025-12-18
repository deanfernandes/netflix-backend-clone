import { startTestServer, stopTestServer } from "./server";
import { mockProfiles } from "./mocks";

let baseUrl: string;

beforeAll(async () => {
  const res = await startTestServer();
  baseUrl = res.url;
});

afterAll(async () => {
  await stopTestServer();
});

describe("Account Profiles Query", () => {
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
