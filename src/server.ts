// src/server.ts
import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createResolvers } from "./resolvers/index.js";
import IDbClient from "./db/IDbClient.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApolloServer(dbClient: IDbClient) {
  const typeDefs = gql(
    readFileSync(path.resolve(__dirname, "./schema.graphql"), "utf-8")
  );

  const resolvers = createResolvers(dbClient);

  const server = new ApolloServer({ typeDefs, resolvers });

  return server;
}
