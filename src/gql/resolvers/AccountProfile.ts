import IDbClient from "../../db/IDbClient.js";

export const AccountProfile = {
  account: async (parent: any, _args: any, { db }: { db: IDbClient }) => {
    return await db.getAccountById(parent.accountId);
  },
};
