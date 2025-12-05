import IDbClient from "../../db/IDbClient.js";
import { ContentAgeRating } from "../../db/models/Content.js";

const ageRatingMap: Record<ContentAgeRating, string> = {
  U: "U",
  PG: "PG",
  "12": "_12",
  "15": "_15",
  "18": "_18",
};

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
    ctx: { db: IDbClient; currentAccountProfileId: string }
  ) => {
    const film = await ctx.db.getFilmById(id);
    if (!film) return null;

    const hasUserWatched = await ctx.db.hasProfileWatchedFilm(
      ctx.currentAccountProfileId,
      film.id
    );

    const userRating = await ctx.db.getProfileFilmRating(
      ctx.currentAccountProfileId,
      film.id
    );

    return {
      ...film,
      ageRating: ageRatingMap[film.ageRating],
      hasUserWatched,
      userRating,
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
