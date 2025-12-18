import { startTestServer, stopTestServer } from "./server";
import { mockFilms, mockGenres, mockCastMembers } from "./mocks";

let url: string;

beforeAll(async () => {
  ({ url } = await startTestServer({
    context: {
      db: require("./mocks").mockDb,
      currentAccountProfileId: "1",
    },
  }));
});

afterAll(async () => {
  await stopTestServer();
});

describe("query", () => {
  test("film all base fields", async () => {
    const query = `
      query ($filmId: ID!) {
        film(id: $filmId) {
          id
          title
          ageRating
          hasUserWatched
          userRating
        }
      }
    `;

    const variables = { filmId: "1" };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const { data, errors } = await response.json();

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.film).toBeDefined();
    expect(data.film.id).toBe("1");
    expect(data.film.title).toBe(mockFilms[0].title);
  });

  describe("field resolvers", () => {
    test("genres all fields", async () => {
      const query = `
        query ($filmId: ID!) {
          film(id: $filmId) {
            genres {
              id
              name
            }
          }
        }
      `;

      const variables = { filmId: "1" };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });

      const { data, errors } = await response.json();

      expect(errors).toBeUndefined();
      expect(data).toBeDefined();
      expect(data.film).toBeDefined();
      expect(Array.isArray(data.film.genres)).toBe(true);
      expect(data.film.genres.length).toBe(mockGenres.length);
    });

    test("castMembers all fields", async () => {
      const query = `
        query ($filmId: ID!) {
          film(id: $filmId) {
            castMembers {
              id
              name
            }
          }
        }
      `;

      const variables = { filmId: "1" };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });

      const { data, errors } = await response.json();

      expect(errors).toBeUndefined();
      expect(data).toBeDefined();
      expect(data.film).toBeDefined();
      expect(Array.isArray(data.film.castMembers)).toBe(true);
      expect(data.film.castMembers.length).toBe(mockCastMembers.length);
    });
  });
});
