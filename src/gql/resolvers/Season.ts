import IDbClient from "../../db/IDbClient.js";
import { mapContentAgeRating } from "../../utils/enumMaps.js";
import {
  ContentAgeRating,
  Episode,
  Season,
  Series,
} from "../generated/graphql.js";

export const SeasonResolver = {
  series: async (
    season: Season & { _seriesId: string },
    _args: any,
    ctx: { db: IDbClient }
  ): Promise<Series> => {
    const series = await ctx.db.getSeriesById(season._seriesId);
    if (!series) throw new Error(`Series not found for season ${season.id}`);

    return {
      __typename: "Series",
      ...series,
      ageRating: mapContentAgeRating(series.ageRating) as ContentAgeRating,
      createdAt: series.createdAt.toISOString(),
      hasUserWatched: null,
      userRating: null,
      seasons: [],
      genres: [],
      castMembers: [],
    };
  },
  episodes: async (
    season: Season & { _seasonId?: string },
    _args: any,
    ctx: { db: IDbClient }
  ): Promise<Episode[]> => {
    const seasonId = season._seasonId ?? season.id;
    const dbEpisodes = await ctx.db.getEpisodesBySeasonId(seasonId);

    return dbEpisodes.map((ep) => ({
      __typename: "Episode",
      id: ep.id,
      title: ep.title,
      synopsis: ep.synopsis,
      durationMinutes: ep.durationMinutes,
      number: ep.number,
      season: season,
    }));
  },
};
