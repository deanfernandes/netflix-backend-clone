import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";
import { readFileSync } from "fs";
import * as path from "path";
import { Query } from "./gql/resolvers/index.js";
import { Account } from "./gql/resolvers/Account.js";
import { AccountProfile } from "./gql/resolvers/AccountProfile.js";
import { AccountMembership } from "./gql/resolvers/index.js";
import { FilmResolver } from "./gql/resolvers/Film.js";
import { SeriesResolver } from "./gql/resolvers/index.js";
import { SeasonResolver } from "./gql/resolvers/index.js";
import { EpisodeResolver } from "./gql/resolvers/Episode.js";
import {
  WatchlistFilmResolver,
  WatchlistSeriesResolver,
} from "./gql/resolvers/Watchlist.js";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";

export function createApolloServer() {
  const __dirname = process.cwd();

  const typeDefs = gql(
    readFileSync(path.resolve(__dirname, "dist/gql/schema.graphql"), "utf-8")
  );

  const resolvers = {
    Query,
    Account,
    AccountProfile,
    AccountMembership,
    Film: FilmResolver,
    Series: SeriesResolver,
    Season: SeasonResolver,
    Episode: EpisodeResolver,
    WatchlistFilm: WatchlistFilmResolver,
    WatchlistSeries: WatchlistSeriesResolver,
  };

  return new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  });
}
