import { Film } from "../generated/graphql.js";

export const WatchlistFilm = {
  film: async (
    parent: { _filmId: string; addedAt: string },
    _args: any,
    ctx: any
  ): Promise<Film> => {
    const film = await ctx.db.getFilmById(parent._filmId);
    if (!film) throw new Error("Film not found");

    return film;
  },
};
