import { startTestServer, stopTestServer } from "./server";
import { mockEpisodes } from "./mocks";

let url: string;

beforeAll(async () => {
  ({ url } = await startTestServer());
});

afterAll(async () => {
  await stopTestServer();
});

describe("query episode", () => {
  test("episode base fields", async () => {
    const query = `
      query ($id: ID!) {
        episode(id: $id) {
          id
          title
          synopsis
          durationMinutes
          number
        }
      }
    `;

    const variables = { id: mockEpisodes[0].id };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const { data, errors } = await response.json();

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.episode).toBeDefined();
    expect(data.episode.id).toBe(mockEpisodes[0].id);
    expect(data.episode.title).toBe(mockEpisodes[0].title);
    expect(data.episode.synopsis).toBe(mockEpisodes[0].synopsis);
    expect(data.episode.durationMinutes).toBe(mockEpisodes[0].durationMinutes);
    expect(data.episode.number).toBe(mockEpisodes[0].number);
  });

  describe("field resolvers", () => {
    test("season field resolver for episode", async () => {
      const query = `
        query ($id: ID!) {
          episode(id: $id) {
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

      const variables = { id: mockEpisodes[0].id };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });

      const { data, errors } = await response.json();

      expect(errors).toBeUndefined();
      expect(data).toBeDefined();
      expect(data.episode.season).toBeDefined();
      expect(data.episode.season.id).toBeDefined();
      expect(data.episode.season.number).toBeDefined();
      expect(["U", "PG", "_12", "_15", "_18"]).toContain(
        data.episode.season.ageRating
      );
      expect(data.episode.season.releaseYear).toBeDefined();
    });
  });
});
