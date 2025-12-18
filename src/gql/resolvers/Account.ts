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
    const memberships = await ctx.db.getAccountMembershipsByAccountId(
      parent.id
    );
    return memberships.map((m) => ({
      ...m,
      status: m.status.toUpperCase(),
      startDate: new Date(m.startDate).toISOString(),
      endDate: new Date(m.endDate).toISOString(),
      id: m.id.toString(),
      accountId: m.accountId.toString(),
      accountMembershipPlanId: m.accountMembershipPlanId.toString(),
    }));
  },
};
