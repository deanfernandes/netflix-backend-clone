import { startTestServer, stopTestServer } from "./server";
import { mockCastMembers, mockGenres, mockSeriesList } from "./mocks";

let url: string;

beforeAll(async () => {
  ({ url } = await startTestServer());
});

afterAll(async () => {
  await stopTestServer();
});

describe("query", () => {
  test("seriesList all base fields", async () => {
    const query = `
      query ($limit: Int, $offset: Int) {
        seriesList(limit: $limit, offset: $offset) {
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
    expect(Array.isArray(data.seriesList)).toBe(true);
    expect(data.seriesList.length).toBe(mockSeriesList.length);
    expect(data.seriesList[0].id).toBe(mockSeriesList[0].id);
    expect(data.seriesList[0].title).toBe(mockSeriesList[0].title);
    expect(data.seriesList[0].ageRating).toBe(mockSeriesList[0].ageRating);
    expect(data.seriesList[0].hasUserWatched).toBeNull();
    expect(data.seriesList[0].userRating).toBe(
      mockSeriesList[0].userRating.toUpperCase()
    );
  });

  describe("field resolvers", () => {
    test("seasons all fields", async () => {
      const query = `
    query {
      seriesList(limit: 1) {
        id
        seasons {
          id
          number
          ageRating
          releaseYear
        }
      }
    }
  `;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const { data, errors } = await response.json();

      expect(errors).toBeUndefined();
      expect(data).toBeDefined();
      expect(Array.isArray(data.seriesList)).toBe(true);
      expect(Array.isArray(data.seriesList[0].seasons)).toBe(true);
      data.seriesList[0].seasons.forEach((season: any) => {
        expect(season.id).toBeDefined();
        expect(season.number).toBeDefined();
        expect(["U", "PG", "_12", "_15", "_18"]).toContain(season.ageRating);
        expect(season.releaseYear).toBeDefined();
      });
    });

    test("genres all fields", async () => {
      const query = `
    query {
      seriesList(limit: 1) {
        id
        genres {
          id
          name
        }
      }
    }
  `;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const { data, errors } = await response.json();

      expect(errors).toBeUndefined();
      expect(data).toBeDefined();
      expect(Array.isArray(data.seriesList)).toBe(true);
      expect(Array.isArray(data.seriesList[0].genres)).toBe(true);
      expect(data.seriesList[0].genres.length).toBe(mockGenres.length);
      data.seriesList[0].genres.forEach((genre: any) => {
        expect(genre.id).toBeDefined();
        expect(genre.name).toBeDefined();
      });
    });

    test("castMembers all fields", async () => {
      const query = `
    query {
      seriesList(limit: 1) {
        id
        castMembers {
          id
          name
        }
      }
    }
  `;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const { data, errors } = await response.json();

      expect(errors).toBeUndefined();
      expect(data).toBeDefined();
      expect(Array.isArray(data.seriesList)).toBe(true);
      expect(Array.isArray(data.seriesList[0].castMembers)).toBe(true);
      expect(data.seriesList[0].castMembers.length).toBe(
        mockCastMembers.length
      );
      data.seriesList[0].castMembers.forEach((cast: any) => {
        expect(cast.id).toBeDefined();
        expect(cast.name).toBeDefined();
      });
    });
  });
});
