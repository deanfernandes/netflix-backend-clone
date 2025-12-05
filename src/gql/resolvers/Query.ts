import IDbClient from "../../db/IDbClient.js";

export const Query = {
  account: async (
    _parent: any,
    { id }: { id: string },
    ctx: { db: IDbClient }
  ) => {
    return await ctx.db.getAccountById(id);
  },

  accounts: async (
    _parent: any,
    { limit, offset }: { limit?: number; offset?: number },
    ctx: { db: IDbClient }
  ) => {
    return await ctx.db.getAccounts(limit, offset);
  },

  accountProfile: async (
    _parent: any,
    { id }: { id: string },
    ctx: { db: IDbClient }
  ) => {
    return await ctx.db.getAccountProfileById(id);
  },

  accountProfiles: async (
    _parent: any,
    { accountId }: { accountId: string },
    ctx: { db: IDbClient }
  ) => {
    return await ctx.db.getAccountProfilesByAccountId(accountId);
  },

  accountMembership: async (
    _parent: any,
    { id }: { id: string },
    ctx: { db: IDbClient }
  ) => {
    return await ctx.db.getAccountMembershipById(id);
  },

  accountMemberships: async (
    _parent: any,
    { accountId }: { accountId: string },
    ctx: { db: IDbClient }
  ) => {
    return await ctx.db.getAccountMembershipsByAccountId(accountId);
  },

  film: async (
    _parent: any,
    { id }: { id: string },
    ctx: { db: IDbClient }
  ) => {
    const film = await ctx.db.getFilmById(id);
    if (!film) return null;

    return {
      ...film,
      hasUserWatched: false,
      userRating: null,
      genres: [],
      castMembers: [],
    };
  },

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
};
