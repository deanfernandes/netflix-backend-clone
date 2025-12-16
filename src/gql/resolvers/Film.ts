import IDbClient from "../../db/IDbClient.js";
import type { Film as Film } from "../../db/models/Film.js";

export const FilmResolver = {
  genres: async (parent: Film, _args: any, ctx: { db: IDbClient }) => {
    return await ctx.db.getFilmGenres(parent.id);
  },
  castMembers: async (parent: Film, _args: any, ctx: { db: IDbClient }) => {
    return await ctx.db.getFilmCastMembers(parent.id);
  },
};
