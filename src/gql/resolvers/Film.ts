import IDbClient from "../../db/IDbClient.js";
import type { Film as FilmType } from "../../db/models/Film.js";

export const Film = {
  genres: async (parent: FilmType, _args: any, ctx: { db: IDbClient }) => {
    return await ctx.db.getFilmGenres(parent.id);
  },
  castMembers: async (parent: FilmType, _args: any, ctx: { db: IDbClient }) => {
    return await ctx.db.getFilmCastMembers(parent.id);
  },
};
