import {
  mockFilms,
  mockSeriesList,
  mockWatchlistFilms,
  mockWatchlistSeries,
} from "./mocks";
import { startTestServer, stopTestServer } from "./server";

let url: string;

beforeAll(async () => {
  ({ url } = await startTestServer());
});

afterAll(async () => {
  await stopTestServer();
});

describe("query and fields resolver", () => {
  test("watchlist films and series and the title", async () => {
    const query = `
    query ($profileId: ID!) {
  watchlist(profileId: $profileId) {
    films {
      addedAt
      film {
        title
      }
    }
    series {
      addedAt
      series {
        title
      }
    }
  }
}
  `;

    const variables = { profileId: "1" };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const { data, errors } = await response.json();

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.watchlist).toBeDefined();

    // Films
    expect(data.watchlist.films).toHaveLength(mockWatchlistFilms.length);
    data.watchlist.films.forEach((wf: any, index: number) => {
      const mockFilm = mockFilms.find(
        (f) => f.id === mockWatchlistFilms[index].filmId.toString()
      );
      expect(wf.addedAt).toBeDefined();
      expect(wf.film).toBeDefined();
      expect(wf.film.title).toEqual(mockFilm?.title);
    });

    // Series
    expect(data.watchlist.series).toHaveLength(mockWatchlistSeries.length);
    data.watchlist.series.forEach((ws: any, index: number) => {
      const mockSeries = mockSeriesList.find(
        (s) => s.id === mockWatchlistSeries[index].seriesId.toString()
      );
      expect(ws.addedAt).toBeDefined();
      expect(ws.series).toBeDefined();
      expect(ws.series.title).toEqual(mockSeries?.title);
    });
  });
});
