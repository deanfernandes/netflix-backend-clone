import IDbClient from "../../db/IDbClient.js";
import { mapContentAgeRating, mapContentRating } from "../../utils/enumMaps.js";
import {
  ContentAgeRating,
  ContentRating,
  Season,
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
    const membership = await ctx.db.getAccountMembershipById(id);
    if (!membership) return null;
    return { ...membership, status: membership.status.toUpperCase() };
  },

  accountMemberships: async (
    _parent: any,
    { accountId }: { accountId: string },
    ctx: { db: IDbClient }
  ) => {
    const memberships = await ctx.db.getAccountMembershipsByAccountId(
      accountId
    );
    return memberships.map((m) => ({
      ...m,
      status: m.status.toUpperCase(),
    }));
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
  season: async (
    _parent: unknown,
    args: { id: string },
    ctx: { db: IDbClient }
  ): Promise<Season | null> => {
    const season = await ctx.db.getSeasonById(args.id);
    if (!season) return null;

    return {
      __typename: "Season",
      id: season.id,
      number: season.number,
      ageRating: mapContentAgeRating(season.ageRating) as ContentAgeRating,
      releaseYear: season.releaseYear,
      episodes: [],
      series: {} as Series, // placeholder; will be replaced by field resolver
      _seriesId: season.seriesId,
    } as Season & { _seriesId: string };
  },
  seasons: async (
    _parent: unknown,
    { seriesId }: { seriesId: string },
    ctx: { db: IDbClient }
  ) => {
    const seasons = await ctx.db.getSeasonsBySeriesId(seriesId);

    return seasons.map((s) => ({
      id: s.id,
      number: s.number,
      ageRating: mapContentAgeRating(s.ageRating),
      releaseYear: s.releaseYear,
      _seriesId: s.seriesId,
    }));
  },
  episode: async (
    _parent: unknown,
    { id }: { id: string },
    ctx: { db: IDbClient }
  ) => {
    const episode = await ctx.db.getEpisodeById(id);
    if (!episode) return null;

    return {
      ...episode,
      __typename: "Episode",
      _seasonId: episode.seasonId,
    };
  },

  episodes: async (
    _parent: unknown,
    { seasonId }: { seasonId: string },
    ctx: { db: IDbClient }
  ) => {
    const episodes = await ctx.db.getEpisodesBySeasonId(seasonId);
    return episodes.map((ep) => ({
      ...ep,
      __typename: "Episode",
      _seasonId: ep.seasonId,
    }));
  },

  watchlist: () => {},
};
