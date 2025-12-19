import IDbClient from "../../db/IDbClient.js";

export const WatchlistFilmResolver = {
  film: async (
    parent: { _filmId: number; addedAt: string },
    _args: any,
    ctx: { db: IDbClient }
  ) => {
    const film = await ctx.db.getFilmById(parent._filmId.toString());
    if (!film) throw new Error(`Film not found`);
    return { ...film, castMembers: [], genres: [] };
  },
};

export const WatchlistSeriesResolver = {
  series: async (
    parent: { _seriesId: number; addedAt: string },
    _args: any,
    ctx: { db: IDbClient }
  ) => {
    const seriesObj = await ctx.db.getSeriesById(parent._seriesId.toString());
    if (!seriesObj) throw new Error(`Series not found`);
    return { ...seriesObj, castMembers: [], genres: [] };
  },
};
