import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Query } from "./gql/resolvers/index.js";
import { AccountProfile } from "./gql/resolvers/AccountProfile.js";
import { AccountMembership } from "./gql/resolvers/index.js";
import { Film } from "./gql/resolvers/Film.js";
import { Account } from "./gql/resolvers/Account.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApolloServer() {
  const typeDefs = gql(
    readFileSync(path.resolve(__dirname, "../src/gql/schema.graphql"), "utf-8")
  );

  const resolvers = {
    Query,
    Account,
    AccountProfile,
    AccountMembership,
    Film,
  };

  const server = new ApolloServer({ typeDefs, resolvers });

  return server;
}
