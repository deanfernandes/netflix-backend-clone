import { startTestServer, stopTestServer } from "./server";
import { mockSeasons } from "./mocks";

let url: string;

beforeAll(async () => {
  ({ url } = await startTestServer());
});

afterAll(async () => {
  await stopTestServer();
});

describe("query", () => {
  test("seasons all base fields", async () => {
    const query = `
      query ($seriesId: ID!) {
        seasons(seriesId: $seriesId) {
          id
          number
          ageRating
          releaseYear
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
    expect(Array.isArray(data.seasons)).toBe(true);
    expect(data.seasons.length).toBe(
      mockSeasons.filter((s) => s.seriesId === "1").length
    );
    data.seasons.forEach((season: any) => {
      expect(season.id).toBeDefined();
      expect(season.number).toBeDefined();
      expect(["U", "PG", "_12", "_15", "_18"]).toContain(season.ageRating);
      expect(season.releaseYear).toBeDefined();
    });
  });

  describe("field resolvers", () => {
    test("series field resolver for season", async () => {
      const query = `
    query ($seriesId: ID!) {
      seasons(seriesId: $seriesId) {
        id
        series {
          id
          title
          ageRating
          hasUserWatched
          userRating
        }
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
      expect(Array.isArray(data.seasons)).toBe(true);
      data.seasons.forEach((season: any) => {
        expect(season.series).toBeDefined();
        expect(season.series.id).toBeDefined();
        expect(season.series.title).toBeDefined();
        expect(["U", "PG", "_12", "_15", "_18"]).toContain(
          season.series.ageRating
        );
        expect(season.series.hasUserWatched).toBeNull();
        expect(season.series.userRating).toBeNull();
      });
    });

    test("episodes field resolver for season", async () => {
      const query = `
    query ($seriesId: ID!) {
      seasons(seriesId: $seriesId) {
        id
        episodes {
          id
          title
          synopsis
          durationMinutes
          number
        }
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
      expect(Array.isArray(data.seasons)).toBe(true);
      data.seasons.forEach((season: any) => {
        expect(Array.isArray(season.episodes)).toBe(true);
        season.episodes.forEach((ep: any) => {
          expect(ep.id).toBeDefined();
          expect(ep.title).toBeDefined();
          expect(ep.synopsis).toBeDefined();
          expect(ep.durationMinutes).toBeDefined();
          expect(ep.number).toBeDefined();
        });
      });
    });
  });
});
