import {
  MutationResolvers,
  MutationUpdateMembershipAutoRenewArgs,
  RequireFields,
  ResolversTypes,
} from "../generated/graphql.js";

export const Mutation: MutationResolvers = {
  updateMembershipAutoRenew: async (
    _,
    args: RequireFields<
      MutationUpdateMembershipAutoRenewArgs,
      "accountMembershipId" | "autoRenew"
    >,
    context: any
  ): Promise<ResolversTypes["AccountMembership"]> => {
    const updatedMembership = await context.db.updateMembershipAutoRenew(
      args.accountMembershipId,
      args.autoRenew
    );

    if (updatedMembership === null) {
      throw new Error("Account membership not found");
    }

    return updatedMembership;
  },
};

//TODO:
/*
  updateMembershipAutoRenew: () => {},
  cancelMembership: () => {},

  createProfile: () => {},
  updateProfile: () => {},
  deleteProfile: () => {},

  setProfilePin: () => {},
  deleteProfilePin: () => {},

  addFilmToWatchlist: () => {},
  removeFilmFromWatchlist: () => {},
  addSeriesToWatchlist: () => {},
  removeSeriesFromWatchlist: () => {},

  rateFilm: () => {},
  removeFilmRating: () => {},
  rateSeries: () => {},
  removeSeriesRating: () => {},

  markFilmWatched: () => {},
  markFilmUnwatched: () => {},
  markSeriesWatched: () => {},
  markSeriesUnwatched: () => {},
};
*/
