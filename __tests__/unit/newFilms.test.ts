import { startTestServer, stopTestServer } from "./server";
import { mockFilms } from "./mocks";

let url: string;

beforeAll(async () => {
  ({ url } = await startTestServer());
});

afterAll(async () => {
  await stopTestServer();
});

describe("query", () => {
  test("newFilms all base fields", async () => {
    const query = `
      query ($limit: Int, $offset: Int) {
        newFilms(limit: $limit, offset: $offset) {
          id
          title
          ageRating
          hasUserWatched
          userRating
        }
      }
    `;

    const variables = { limit: 20, offset: 0 };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const { data, errors } = await response.json();

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(Array.isArray(data.newFilms)).toBe(true);
    expect(data.newFilms.length).toBe(mockFilms.length);
    expect(data.newFilms[0].id).toBe(mockFilms[0].id);
    expect(data.newFilms[0].title).toBe(mockFilms[0].title);
  });
});
