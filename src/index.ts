import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { gql } from "graphql-tag";
import { resolvers } from "./resolvers.js";

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
