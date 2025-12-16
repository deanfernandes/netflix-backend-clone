import IDbClient from "../../db/IDbClient.js";
import { mapContentAgeRating, mapContentRating } from "../../utils/enumMaps.js";
import {
  ContentAgeRating,
  ContentRating,
  Series,
} from "../generated/graphql.js";

export const Query = {
  account: async (
    _parent: unknown,
    args: { id: string },
    ctx: { db: IDbClient }
  ) => {
    return await ctx.db.getAccountById(args.id);
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
      ageRating: mapContentAgeRating(film.ageRating) as ContentAgeRating,
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
      ageRating: mapContentAgeRating(f.ageRating) as ContentAgeRating,
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
      ageRating: mapContentAgeRating(f.ageRating) as ContentAgeRating,
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
      ageRating: mapContentAgeRating(f.ageRating) as ContentAgeRating,
      hasUserWatched: null,
      userRating: null,
      genres: [],
      castMembers: [],
    }));
  },
  series: async (
    _parent: unknown,
    args: { id: string },
    ctx: { db: IDbClient; currentAccountProfileId?: string }
  ) => {
    const series = await ctx.db.getSeriesById(args.id);
    if (!series) return null;

    let hasUserWatched: boolean | undefined = undefined;
    let userRating: ContentRating | null = null;

    if (ctx.currentAccountProfileId) {
      hasUserWatched = await ctx.db.hasUserWatchedSeries(
        series.id,
        ctx.currentAccountProfileId
      );
      const dbRating = await ctx.db.getUserSeriesRating(
        series.id,
        ctx.currentAccountProfileId
      );
      if (dbRating) userRating = mapContentRating(dbRating);
    }

    return {
      ...series,
      ageRating: mapContentAgeRating(series.ageRating),
      hasUserWatched,
      userRating,
      seasons: [],
      genres: [],
      castMembers: [],
    };
  },
  seriesList: async (
    _parent: unknown,
    args: { limit?: number; offset?: number },
    ctx: { db: IDbClient }
  ): Promise<Series[]> => {
    const limit = args.limit ?? 50;
    const offset = args.offset ?? 0;

    const seriesList = await ctx.db.getSeriesList(limit, offset);

    return seriesList.map((series) => ({
      ...series,
      ageRating: mapContentAgeRating(series.ageRating) as ContentAgeRating,
      createdAt: series.createdAt.toISOString(),
      hasUserWatched: null,
      userRating: series.userRating
        ? mapContentRating(series.userRating)
        : null,
      seasons: [],
      genres: [],
      castMembers: [],
    }));
  },
  newSeries: async (
    _parent: unknown,
    args: { limit?: number; offset?: number },
    ctx: { db: IDbClient }
  ): Promise<Series[]> => {
    const limit = args.limit ?? 50;
    const offset = args.offset ?? 0;

    const seriesList = await ctx.db.getNewSeries(limit, offset);

    return seriesList.map((series) => ({
      ...series,
      ageRating: mapContentAgeRating(series.ageRating) as ContentAgeRating,
      createdAt: series.createdAt.toISOString(),
      hasUserWatched: null,
      userRating: null,
      seasons: [],
      genres: [],
      castMembers: [],
    }));
  },
  popularSeries: async (
    _parent: unknown,
    args: { limit?: number; offset?: number },
    ctx: { db: IDbClient }
  ): Promise<Series[]> => {
    const limit = args.limit ?? 50;
    const offset = args.offset ?? 0;

    const seriesList = await ctx.db.getPopularSeries(limit, offset);

    return seriesList.map((series) => ({
      ...series,
      ageRating: mapContentAgeRating(series.ageRating) as ContentAgeRating,
      createdAt: series.createdAt.toISOString(),
      hasUserWatched: null,
      userRating: null,
      seasons: [],
      genres: [],
      castMembers: [],
    }));
  },
  season: () => {},
  seasons: () => {},
  episode: () => {},
  episodes: () => {},

  watchlist: () => {},
};
