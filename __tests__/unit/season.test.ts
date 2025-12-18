import { startTestServer, stopTestServer } from "./server";
import { mockSeasons } from "./mocks";

let url: string;

beforeAll(async () => {
  ({ url } = await startTestServer());
});

afterAll(async () => {
  await stopTestServer();
});

describe("query season", () => {
  test("season base fields", async () => {
    const query = `
      query ($id: ID!) {
        season(id: $id) {
          id
          number
          ageRating
          releaseYear
        }
      }
    `;

    const variables = { id: mockSeasons[0].id };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const { data, errors } = await response.json();

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.season).toBeDefined();
    expect(data.season.id).toBe(mockSeasons[0].id);
    expect(data.season.number).toBe(mockSeasons[0].number);
    expect(["U", "PG", "_12", "_15", "_18"]).toContain(data.season.ageRating);
    expect(data.season.releaseYear).toBe(mockSeasons[0].releaseYear);
  });

  describe("field resolvers", () => {
    test("series field resolver", async () => {
      const query = `
        query ($id: ID!) {
          season(id: $id) {
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

      const variables = { id: mockSeasons[0].id };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });

      const { data, errors } = await response.json();

      expect(errors).toBeUndefined();
      expect(data.season.series).toBeDefined();
      expect(data.season.series.id).toBeDefined();
      expect(data.season.series.title).toBeDefined();
      expect(["U", "PG", "_12", "_15", "_18"]).toContain(
        data.season.series.ageRating
      );
      expect(data.season.series.hasUserWatched).toBeNull();
      expect(data.season.series.userRating).toBeNull();
    });

    test("episodes field resolver", async () => {
      const query = `
        query ($id: ID!) {
          season(id: $id) {
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

      const variables = { id: mockSeasons[0].id };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });

      const { data, errors } = await response.json();

      expect(errors).toBeUndefined();
      expect(Array.isArray(data.season.episodes)).toBe(true);

      data.season.episodes.forEach((ep: any) => {
        expect(ep.id).toBeDefined();
        expect(ep.title).toBeDefined();
        expect(ep.synopsis).toBeDefined();
        expect(ep.durationMinutes).toBeDefined();
        expect(ep.number).toBeDefined();
      });
    });
  });
});
