import IDbClient from "../../db/IDbClient.js";

export const EpisodeResolver = {
  season: async (
    episode: { _seasonId: string },
    _args: unknown,
    ctx: { db: IDbClient }
  ) => {
    const season = await ctx.db.getSeasonById(episode._seasonId);
    if (!season) throw new Error("Season not found");

    return {
      __typename: "Season",
      id: season.id.toString(),
      number: season.number,
      releaseYear: season.releaseYear,
      ageRating: season.ageRating,
      episodes: [],
      series: null,
    };
  },
};
