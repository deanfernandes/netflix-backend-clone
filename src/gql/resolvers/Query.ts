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

  films: async (
    _parent: any,
    args: {
      genreIds?: string[] | null;
      ageRating?: string | null;
      search?: string | null;
      limit?: number | null;
      offset?: number | null;
    },
    ctx: { db: IDbClient; currentAccountProfileId: string }
  ) => {
    const films = await ctx.db.getFilms({
      genreIds: args.genreIds ?? null,
      ageRating: args.ageRating ?? null,
      search: args.search ?? null,
      limit: args.limit ?? 20,
      offset: args.offset ?? 0,
    });

    return films.map((f) => ({
      ...f,
      ageRating: ageRatingMap[f.ageRating],
      hasUserWatched: null,
      userRating: null,
      genres: [],
      castMembers: [],
    }));
  },

  newFilms: async (
    _parent: any,
    args: { limit?: number | null; offset?: number | null },
    ctx: { db: IDbClient }
  ) => {
    const films = await ctx.db.getNewFilms(args.limit ?? 20);
    return films.map((f) => ({
      ...f,
      ageRating: ageRatingMap[f.ageRating],
      hasUserWatched: null,
      userRating: null,
      genres: [],
      castMembers: [],
    }));
  },

  popularFilms: async (
    _parent: any,
    args: { limit?: number | null; offset?: number | null },
    ctx: { db: IDbClient }
  ) => {
    const films = await ctx.db.getPopularFilms(args.limit ?? 20);
    return films.map((f) => ({
      ...f,
      ageRating: ageRatingMap[f.ageRating],
      hasUserWatched: null,
      userRating: null,
      genres: [],
      castMembers: [],
    }));
  },

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
