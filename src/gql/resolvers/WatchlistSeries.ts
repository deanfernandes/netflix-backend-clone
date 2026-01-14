import { Series } from "../generated/graphql.js";

export const WatchlistSeries = {
  series: async (
    parent: { _seriesId: string; addedAt: string },
    _args: any,
    ctx: any
  ): Promise<Series> => {
    const series = await ctx.db.getSeriesById(parent._seriesId);
    if (!series) throw new Error("Series not found");

    return series;
  },
};
