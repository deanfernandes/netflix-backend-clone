import { mapContentRatingToDb } from "../../utils/enumMaps.js";
import {
  MutationAddFilmToWatchlistArgs,
  MutationAddSeriesToWatchlistArgs,
  MutationCancelMembershipArgs,
  MutationCreateProfileArgs,
  MutationDeleteProfileArgs,
  MutationDeleteProfilePinArgs,
  MutationRateFilmArgs,
  MutationRateSeriesArgs,
  MutationRemoveFilmFromWatchlistArgs,
  MutationRemoveFilmRatingArgs,
  MutationRemoveSeriesFromWatchlistArgs,
  MutationRemoveSeriesRatingArgs,
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

  addFilmToWatchlist: async (
    _,
    args: RequireFields<MutationAddFilmToWatchlistArgs, "profileId" | "filmId">,
    context: any
  ): Promise<ResolversTypes["WatchlistFilm"]> => {
    await context.db.addFilmToWatchlist(args.profileId, args.filmId);

    return {
      film: undefined as any,
      addedAt: new Date().toISOString(), //TODO: add db migration
      _filmId: args.filmId,
    } as unknown as ResolversTypes["WatchlistFilm"];
  },
  removeFilmFromWatchlist: async (
    _,
    args: RequireFields<
      MutationRemoveFilmFromWatchlistArgs,
      "profileId" | "filmId"
    >,
    context: any
  ): Promise<ResolversTypes["Film"]> => {
    await context.db.removeFilmFromWatchlist(args.profileId, args.filmId);

    const film = await context.db.getFilmById(args.filmId);
    if (!film) throw new Error("Film not found");

    return film;
  },
  addSeriesToWatchlist: async (
    _,
    args: RequireFields<
      MutationAddSeriesToWatchlistArgs,
      "profileId" | "seriesId"
    >,
    context: any
  ): Promise<ResolversTypes["WatchlistSeries"]> => {
    await context.db.addSeriesToWatchlist(args.profileId, args.seriesId);

    return {
      _seriesId: args.seriesId,
      addedAt: new Date().toISOString(), //TODO: db migration
      series: undefined as any,
    } as unknown as ResolversTypes["WatchlistSeries"];
  },
  removeSeriesFromWatchlist: async (
    _,
    args: RequireFields<
      MutationRemoveSeriesFromWatchlistArgs,
      "profileId" | "seriesId"
    >,
    context: any
  ): Promise<ResolversTypes["Series"]> => {
    await context.db.removeSeriesFromWatchlist(args.profileId, args.seriesId);

    const series = await context.db.getSeriesById(args.seriesId);
    if (!series) throw new Error("Series not found");

    return series;
  },

  rateFilm: async (
    _,
    args: RequireFields<
      MutationRateFilmArgs,
      "profileId" | "filmId" | "rating"
    >,
    context: any
  ): Promise<ResolversTypes["Film"]> => {
    const dbRating = mapContentRatingToDb(args.rating);

    await context.db.rateFilm(args.profileId, args.filmId, dbRating);

    const film = await context.db.getFilmById(args.filmId);
    if (!film) throw new Error("Film not found");

    return film;
  },
  removeFilmRating: async (
    _,
    args: RequireFields<MutationRemoveFilmRatingArgs, "profileId" | "filmId">,
    context: any
  ): Promise<ResolversTypes["Film"]> => {
    await context.db.removeFilmRating(args.profileId, args.filmId);

    const film = await context.db.getFilmById(args.filmId);
    if (!film) throw new Error("Film not found");

    return film;
  },
  rateSeries: async (
    _,
    args: RequireFields<
      MutationRateSeriesArgs,
      "profileId" | "seriesId" | "rating"
    >,
    context: any
  ): Promise<ResolversTypes["Series"]> => {
    const dbRating = mapContentRatingToDb(args.rating);

    await context.db.rateSeries(args.profileId, args.seriesId, dbRating);

    const series = await context.db.getSeriesById(args.seriesId);
    if (!series) throw new Error("Series not found");

    return series;
  },
  removeSeriesRating: async (
    _,
    args: RequireFields<
      MutationRemoveSeriesRatingArgs,
      "profileId" | "seriesId"
    >,
    context: any
  ): Promise<ResolversTypes["Series"]> => {
    await context.db.removeSeriesRating(args.profileId, args.seriesId);

    const series = await context.db.getSeriesById(args.seriesId);
    if (!series) throw new Error("Series not found");

    return series;
  },
};

//TODO:
/*
  markFilmWatched: () => {},
  markFilmUnwatched: () => {},
  markSeriesWatched: () => {},
  markSeriesUnwatched: () => {},
};
*/
