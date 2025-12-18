import { startTestServer, stopTestServer } from "./server";
import { mockEpisodes } from "./mocks";

let url: string;

beforeAll(async () => {
  ({ url } = await startTestServer());
});

afterAll(async () => {
  await stopTestServer();
});

describe("query", () => {
  test("episodes all base fields", async () => {
    const query = `
      query ($seasonId: ID!) {
        episodes(seasonId: $seasonId) {
          id
          title
          synopsis
          durationMinutes
          number
        }
      }
    `;

    const variables = { seasonId: "1" };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const { data, errors } = await response.json();

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(Array.isArray(data.episodes)).toBe(true);
    expect(data.episodes.length).toBe(mockEpisodes.length);
    data.episodes.forEach((ep: any) => {
      expect(ep.id).toBeDefined();
      expect(ep.title).toBeDefined();
      expect(ep.synopsis).toBeDefined();
      expect(ep.durationMinutes).toBeDefined();
      expect(ep.number).toBeDefined();
    });
  });

  describe("field resolvers", () => {
    test("season field resolver for episode", async () => {
      const query = `
    query ($seasonId: ID!) {
      episodes(seasonId: $seasonId) {
        id
        season {
          id
          number
          ageRating
          releaseYear
        }
      }
    }
  `;

      const variables = { seasonId: "1" };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });

      const { data, errors } = await response.json();

      expect(errors).toBeUndefined();
      expect(data).toBeDefined();
      expect(Array.isArray(data.episodes)).toBe(true);
      data.episodes.forEach((ep: any) => {
        expect(ep.season).toBeDefined();
        expect(ep.season.id).toBeDefined();
        expect(ep.season.number).toBeDefined();
        expect(["U", "PG", "_12", "_15", "_18"]).toContain(ep.season.ageRating);
        expect(ep.season.releaseYear).toBeDefined();
      });
    });
  });
});
