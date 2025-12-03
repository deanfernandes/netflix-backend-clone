import IDbClient from "../../db/IDbClient.js";

export const createQueryResolvers = (db: IDbClient) => ({
  account: async (_parent: any, { id }: { id: string }) => {
    const account = await db.getAccountById(id);
    if (!account) return null;

    return {
      id: account.id,
      email: account.email,
      mobileNumber: account.mobile_number,
      createdAt: account.created_at,
    };
  },

  accounts: async (
    _parent: any,
    { limit, offset }: { limit?: number; offset?: number }
  ) => {
    const rows = await db.getAccounts(limit, offset);

    return rows.map((account) => ({
      id: account.id,
      email: account.email,
      mobileNumber: account.mobile_number,
      createdAt: account.created_at,
    }));
  },

  accountProfile: async (_parent: any, { id }: { id: string }) => {
    const profile = await db.getAccountProfileById(id);
    if (!profile) return null;

    return {
      id: profile.id,
      name: profile.name,
      profileImageUrl: profile.profile_image_url ?? null,
      pinHash: profile.pin_hash ?? null,
      accountId: profile.account_id,
    };
  },

  accountProfiles: async (
    _parent: any,
    { accountId }: { accountId: string }
  ) => {
    const profiles = await db.getAccountProfilesByAccountId(accountId);
    return (profiles ?? []).map((profile) => ({
      id: profile.id,
      name: profile.name,
      profileImageUrl: profile.profile_image_url ?? null,
      hasPin: !!profile.pin_hash,
      accountId: profile.account_id,
    }));
  },

  accountMembership: () => {},
  accountMemberships: () => {},

  film: () => {},
  films: () => {},
  newFilms: () => {},
  popularFilms: () => {},

  series: () => {},
  seriesList: () => {},
  newSeries: () => {},
  popularSeries: () => {},

  season: () => {},
  seasons: () => {},

  episode: () => {},
  episodes: () => {},

  watchlist: () => {},
});
