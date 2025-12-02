import IDbClient from "../db/IDbClient.js";

export const createQueryResolvers = (db: IDbClient) => ({
  account: async (_parent: any, { id }: { id: string }) => {
    return db.getAccountById(id);
  },
  accounts: () => {},

  accountProfile: () => {},
  accountProfiles: () => {},

  accountMembership: () => {},
  accountMemberships: () => {},

  film: () => {},
  films: () => {},
  newFilms: () => {},
  popularFilms: () => {},

  series: () => {},
  seriesList: () => {},
  newSeries: () => {},
  popularSeries: () => {},

  season: () => {},
  seasons: () => {},

  episode: () => {},
  episodes: () => {},

  watchlist: () => {},
});
