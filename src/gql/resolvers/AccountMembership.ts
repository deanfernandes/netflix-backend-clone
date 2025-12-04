import IDbClient from "../../db/IDbClient.js";

export const AccountMembership = {
  account: async (parent: any, _args: any, ctx: { db: IDbClient }) => {
    return await ctx.db.getAccountById(parent.accountId);
  },
  accountMembershipPlan: async (
    parent: any,
    _args: any,
    ctx: { db: IDbClient }
  ) => {
    return await ctx.db.getAccountMembershipPlanById(
      parent.accountMembershipPlanId
    );
  },
};
