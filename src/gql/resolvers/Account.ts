import IDbClient from "../../db/IDbClient.js";

export const Account = {
  profiles: async (
    parent: { id: string },
    _args: unknown,
    ctx: { db: IDbClient }
  ) => {
    return await ctx.db.getAccountProfilesByAccountId(parent.id);
  },
  memberships: async (
    parent: { id: string },
    _args: unknown,
    ctx: { db: IDbClient }
  ) => {
    return ctx.db.getAccountMembershipsByAccountId(parent.id);
  },
};
