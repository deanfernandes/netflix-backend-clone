// src/server.ts
import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import IDbClient from "./db/IDbClient.js";
import { createQueryResolvers } from "./gql/resolvers/index.js";
import { AccountProfile } from "./gql/resolvers/AccountProfile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApolloServer(dbClient: IDbClient) {
  const typeDefs = gql(
    readFileSync(path.resolve(__dirname, "../src/gql/schema.graphql"), "utf-8")
  );

  const resolvers = {
    Query: createQueryResolvers(dbClient),
    AccountProfile: AccountProfile,
  };

  const server = new ApolloServer({ typeDefs, resolvers });

  return server;
}
