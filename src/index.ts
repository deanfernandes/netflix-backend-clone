import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";
import { gql } from "graphql-tag";
import {
  Query,
  Mutation,
  Account,
  AccountProfile,
  AccountMembership,
  Film,
  Series,
  Season,
  Episode,
  Watchlist,
  WatchlistFilm,
  WatchlistSeries,
} from "./resolvers/index.js";

const resolvers = {
  Query,
  Mutation,
  Account,
  AccountProfile,
  AccountMembership,
  Film,
  Series,
  Season,
  Episode,
  Watchlist,
  WatchlistFilm,
  WatchlistSeries,
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const typeDefs = gql(
  readFileSync(path.resolve(__dirname, "../src/schema.graphql"), {
    encoding: "utf-8",
  })
);

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers: {} });
  const { url } = await startStandaloneServer(server);
  console.log(`
    Server is running!
    Query at ${url}
  `);
}

startApolloServer();
