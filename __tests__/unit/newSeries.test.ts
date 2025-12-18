import { startTestServer, stopTestServer } from "./server";
import { mockNewSeriesList } from "./mocks";

let url: string;

beforeAll(async () => {
  ({ url } = await startTestServer());
});

afterAll(async () => {
  await stopTestServer();
});

describe("query", () => {
  test("newSeries all base fields", async () => {
    const query = `
      query ($limit: Int, $offset: Int) {
        newSeries(limit: $limit, offset: $offset) {
          id
          title
          ageRating
          hasUserWatched
          userRating
        }
      }
    `;

    const variables = { limit: 50, offset: 0 };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const { data, errors } = await response.json();

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(Array.isArray(data.newSeries)).toBe(true);
    expect(data.newSeries.length).toBe(mockNewSeriesList.length);
    expect(data.newSeries[0].id).toBe(mockNewSeriesList[0].id);
    expect(data.newSeries[0].title).toBe(mockNewSeriesList[0].title);
    expect(data.newSeries[0].ageRating).toBe(mockNewSeriesList[0].ageRating);
    expect(data.newSeries[0].hasUserWatched).toBeNull();
    expect(data.newSeries[0].userRating).toBeNull();
  });
});
