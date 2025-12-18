import { startTestServer, stopTestServer } from "./server";
import { mockFilms, mockGenres, mockCastMembers } from "./mocks";

let url: string;

beforeAll(async () => {
  ({ url } = await startTestServer());
});

afterAll(async () => {
  await stopTestServer();
});

describe("query", () => {
  test("films all base fields", async () => {
    const query = `
      query ($limit: Int, $offset: Int) {
        films(limit: $limit, offset: $offset) {
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
    expect(Array.isArray(data.films)).toBe(true);
    expect(data.films.length).toBe(mockFilms.length);
    expect(data.films[0].id).toBe(mockFilms[0].id);
    expect(data.films[0].title).toBe(mockFilms[0].title);
  });

  describe("field resolvers", () => {
    test("genres all fields", async () => {
      const query = `
        query ($limit: Int, $offset: Int) {
          films(limit: $limit, offset: $offset) {
            genres {
              id
              name
            }
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
      expect(Array.isArray(data.films)).toBe(true);
      expect(Array.isArray(data.films[0].genres)).toBe(true);
      expect(data.films[0].genres.length).toBe(mockGenres.length);
    });

    test("castMembers all fields", async () => {
      const query = `
        query ($limit: Int, $offset: Int) {
          films(limit: $limit, offset: $offset) {
            castMembers {
              id
              name
            }
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
      expect(Array.isArray(data.films)).toBe(true);
      expect(Array.isArray(data.films[0].castMembers)).toBe(true);
      expect(data.films[0].castMembers.length).toBe(mockCastMembers.length);
    });
  });
});
