import IDbClient from "../../db/IDbClient.js";
import { mapContentAgeRating } from "../../utils/enumMaps.js";
import {
  Series,
  Season,
  ContentAgeRating,
  Genre,
  CastMember,
} from "../generated/graphql.js";

export const SeriesResolver = {
  seasons: async (
    series: Series,
    _args: any,
    ctx: { db: IDbClient }
  ): Promise<Season[]> => {
    const dbSeasons = await ctx.db.getSeasonsBySeriesId(series.id);
    return dbSeasons.map((season) => ({
      __typename: "Season",
      id: season.id,
      number: season.number,
      ageRating: mapContentAgeRating(season.ageRating) as ContentAgeRating,
      releaseYear: season.releaseYear,
      series: {
        ...series,
        seasons: [],
        genres: [],
        castMembers: [],
      },
      episodes: [],
    }));
  },
  genres: async (
    series: Series,
    _args: any,
    ctx: { db: IDbClient }
  ): Promise<Genre[]> => {
    return await ctx.db.getGenresBySeriesId(series.id);
  },
  castMembers: async (
    series: Series,
    _args: any,
    ctx: { db: IDbClient }
  ): Promise<CastMember[]> => {
    return await ctx.db.getCastMembersBySeriesId(series.id);
  },
};
