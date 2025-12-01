import type { Resolvers } from "./generated/graphql";

export const resolvers: Resolvers = {
  Query: {
    account: async (_, { id }, context) => {
      // TODO: fetch account by id from DB
      return null;
    },
    accounts: async (_, __, context) => {
      // TODO: fetch all accounts
      return [];
    },
    film: async (_, { id }, context) => {
      // TODO: fetch film by id
      return null;
    },
    films: async (_, args, context) => {
      // TODO: fetch list of films
      return [];
    },
    // add other Query resolvers here
  },
  Mutation: {
    addFilmToWatchlist: async (_, { profileId, filmId }, context) => {
      // TODO: add film to watchlist
      return null;
    },
    removeFilmFromWatchlist: async (_, { profileId, filmId }, context) => {
      // TODO: remove film from watchlist
      return null;
    },
    // add other Mutation resolvers here
  },
  Account: {
    profiles: async (parent, _, context) => {
      // TODO: fetch profiles for account
      return [];
    },
    memberships: async (parent, _, context) => {
      // TODO: fetch memberships for account
      return [];
    },
  },
  AccountProfile: {
    account: async (parent, _, context) => {
      // TODO: fetch parent account
      return null;
    },
  },
  AccountMembership: {
    account: async (parent, _, context) => {
      return null;
    },
    accountMembershipPlan: async (parent, _, context) => {
      return null;
    },
  },
  Film: {
    genres: async (parent, _, context) => {
      return [];
    },
    castMembers: async (parent, _, context) => {
      return [];
    },
  },
  Series: {
    genres: async (parent, _, context) => {
      return [];
    },
    castMembers: async (parent, _, context) => {
      return [];
    },
    seasons: async (parent, _, context) => {
      return [];
    },
  },
  Season: {
    series: async (parent, _, context) => {
      return null;
    },
    episodes: async (parent, _, context) => {
      return [];
    },
  },
  Episode: {
    season: async (parent, _, context) => {
      return null;
    },
  },
  Watchlist: {
    films: async (parent, _, context) => {
      return [];
    },
    series: async (parent, _, context) => {
      return [];
    },
  },
};
