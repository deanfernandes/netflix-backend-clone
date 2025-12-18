import { startTestServer, stopTestServer } from "./server";
import { mockPopularSeriesList } from "./mocks";

let url: string;

beforeAll(async () => {
  ({ url } = await startTestServer());
});

afterAll(async () => {
  await stopTestServer();
});

describe("query", () => {
  test("popularSeries all base fields", async () => {
    const query = `
      query ($limit: Int, $offset: Int) {
        popularSeries(limit: $limit, offset: $offset) {
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
    expect(Array.isArray(data.popularSeries)).toBe(true);
    expect(data.popularSeries.length).toBe(mockPopularSeriesList.length);
    expect(data.popularSeries[0].id).toBe(mockPopularSeriesList[0].id);
    expect(data.popularSeries[0].title).toBe(mockPopularSeriesList[0].title);
    expect(data.popularSeries[0].ageRating).toBe(
      mockPopularSeriesList[0].ageRating
    );
    expect(data.popularSeries[0].hasUserWatched).toBeNull();
    expect(data.popularSeries[0].userRating).toBeNull();
  });
});
