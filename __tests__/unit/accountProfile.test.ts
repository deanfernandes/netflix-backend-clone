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

describe("Account Profile Query", () => {
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
});
