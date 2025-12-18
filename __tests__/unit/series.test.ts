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
  test("series all base fields", async () => {
    const query = `
      query ($seriesId: ID!) {
        series(id: $seriesId) {
          id
          title
          ageRating
          hasUserWatched
          userRating
        }
      }
    `;

    const variables = { seriesId: "1" };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const { data, errors } = await response.json();

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.series).toBeDefined();
    expect(data.series.id).toBe(mockSeriesList[0].id);
    expect(data.series.title).toBe(mockSeriesList[0].title);
    expect(data.series.ageRating).toBe(mockSeriesList[0].ageRating);
    expect(data.series.hasUserWatched).toBe(false);
    expect(data.series.userRating).toBe(
      mockSeriesList[0].userRating.toUpperCase()
    );
  });

  describe("field resolvers", () => {
    test("seasons all fields", async () => {
      const query = `
        query {
          series(id: "1") {
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
      expect(Array.isArray(data.series.seasons)).toBe(true);
      data.series.seasons.forEach((season: any) => {
        expect(season.id).toBeDefined();
        expect(season.number).toBeDefined();
        expect(["U", "PG", "_12", "_15", "_18"]).toContain(season.ageRating);
        expect(season.releaseYear).toBeDefined();
      });
    });

    test("genres all fields", async () => {
      const query = `
        query {
          series(id: "1") {
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
      expect(Array.isArray(data.series.genres)).toBe(true);
      expect(data.series.genres.length).toBe(mockGenres.length);
      data.series.genres.forEach((genre: any) => {
        expect(genre.id).toBeDefined();
        expect(genre.name).toBeDefined();
      });
    });

    test("castMembers all fields", async () => {
      const query = `
        query {
          series(id: "1") {
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
      expect(Array.isArray(data.series.castMembers)).toBe(true);
      expect(data.series.castMembers.length).toBe(mockCastMembers.length);
      data.series.castMembers.forEach((cast: any) => {
        expect(cast.id).toBeDefined();
        expect(cast.name).toBeDefined();
      });
    });
  });
});
