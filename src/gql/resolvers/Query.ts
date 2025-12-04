import IDbClient from "../../db/IDbClient.js";

export const Query = {
  account: async (
    _parent: any,
    { id }: { id: string },
    ctx: { db: IDbClient }
  ) => {
    const account = await ctx.db.getAccountById(id);
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
    { limit, offset }: { limit?: number; offset?: number },
    ctx: { db: IDbClient }
  ) => {
    const rows = await ctx.db.getAccounts(limit, offset);

    return rows.map((account) => ({
      id: account.id,
      email: account.email,
      mobileNumber: account.mobile_number,
      createdAt: account.created_at,
    }));
  },

  accountProfile: async (
    _parent: any,
    { id }: { id: string },
    ctx: { db: IDbClient }
  ) => {
    const profile = await ctx.db.getAccountProfileById(id);
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
    { accountId }: { accountId: string },
    ctx: { db: IDbClient }
  ) => {
    const profiles = await ctx.db.getAccountProfilesByAccountId(accountId);

    return (profiles ?? []).map((profile) => ({
      id: profile.id,
      name: profile.name,
      profileImageUrl: profile.profile_image_url ?? null,
      hasPin: !!profile.pin_hash,
      accountId: profile.account_id,
    }));
  },

  accountMembership: async (
    _parent: any,
    { id }: { id: string },
    ctx: { db: IDbClient }
  ) => {
    const m = await ctx.db.getAccountMembershipById(id);
    if (!m) return null;

    return {
      id: m.id,
      startDate: m.start_date,
      endDate: m.end_date,
      status: m.status.toUpperCase(),
      autoRenew: m.auto_renew,
      accountMembershipPrice: Number(m.account_membership_price),
      accountId: m.account_id,
      accountMembershipPlanId: m.account_membership_plan_id,
    };
  },

  accountMemberships: async (
    _parent: any,
    { accountId }: { accountId: string },
    ctx: { db: IDbClient }
  ) => {
    const memberships = await ctx.db.getAccountMembershipsByAccountId(
      accountId
    );

    return (memberships ?? []).map((m) => ({
      id: m.id,
      startDate: m.start_date,
      endDate: m.end_date,
      status: m.status.toUpperCase(),
      autoRenew: m.auto_renew,
      accountMembershipPrice: Number(m.account_membership_price),
      accountId: m.account_id,
      accountMembershipPlanId: m.account_membership_plan_id,
    }));
  },

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
};
