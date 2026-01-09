import {
  MutationCancelMembershipArgs,
  MutationCreateProfileArgs,
  MutationDeleteProfileArgs,
  MutationDeleteProfilePinArgs,
  MutationResolvers,
  MutationSetProfilePinArgs,
  MutationUpdateMembershipAutoRenewArgs,
  MutationUpdateProfileArgs,
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
  cancelMembership: async (
    _,
    args: RequireFields<MutationCancelMembershipArgs, "accountMembershipId">,
    context: any
  ): Promise<ResolversTypes["AccountMembership"]> => {
    const cancelledMembership = await context.db.cancelMembership(
      args.accountMembershipId
    );
    if (!cancelledMembership) throw new Error("Account membership not found");
    return cancelledMembership;
  },

  createProfile: async (
    _,
    args: RequireFields<MutationCreateProfileArgs, "accountId" | "name">,
    context: any
  ): Promise<ResolversTypes["AccountProfile"]> => {
    const profile = await context.db.createProfile(
      args.accountId,
      args.name,
      args.profileImageUrl,
      args.pin
    );
    if (!profile) throw new Error("Failed to create profile");
    return profile;
  },
  updateProfile: async (
    _,
    args: RequireFields<MutationUpdateProfileArgs, "profileId">,
    context: any
  ): Promise<ResolversTypes["AccountProfile"]> => {
    const profile = await context.db.updateProfile(
      args.profileId,
      args.name,
      args.profileImageUrl,
      args.pin
    );
    if (!profile) throw new Error("Profile not found");
    return profile;
  },
  deleteProfile: async (
    _,
    args: RequireFields<MutationDeleteProfileArgs, "profileId">,
    context: any
  ): Promise<boolean> => {
    const success = await context.db.deleteProfile(args.profileId);
    if (!success) throw new Error("Profile not found");
    return success;
  },

  setProfilePin: async (
    _,
    args: RequireFields<MutationSetProfilePinArgs, "profileId" | "pin">,
    context: any
  ): Promise<ResolversTypes["AccountProfile"]> => {
    const profile = await context.db.setProfilePin(args.profileId, args.pin);
    if (!profile) throw new Error("Profile not found");
    return profile;
  },
  deleteProfilePin: async (
    _,
    args: RequireFields<MutationDeleteProfilePinArgs, "profileId">,
    context: any
  ): Promise<ResolversTypes["AccountProfile"]> => {
    const profile = await context.db.deleteProfilePin(args.profileId);
    if (!profile) throw new Error("Profile not found");
    return profile;
  },
};

//TODO:
/*
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
