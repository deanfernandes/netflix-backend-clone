import IDbClient from "../../db/IDbClient.js";

export const AccountProfile = {
  account: async (parent: any, _args: any, { db }: { db: IDbClient }) => {
    const account = await db.getAccountById(parent.accountId);
    if (!account) return null;

    return {
      id: account.id,
      email: account.email,
      mobileNumber: account.mobile_number,
    };
  },
};
