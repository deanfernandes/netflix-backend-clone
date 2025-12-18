import IDbClient from "../../db/IDbClient.js";

export const AccountProfile = {
  account: async (
    parent: { accountId: string },
    _args: any,
    { db }: { db: IDbClient }
  ) => {
    return await db.getAccountById(parent.accountId);
  },

  hasPin: (parent: { pinHash: string | null }): boolean => {
    return !!parent.pinHash;
  },
};
