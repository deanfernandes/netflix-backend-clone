import { startStandaloneServer } from "@apollo/server/standalone";
import { createApolloServer } from "./server.js";
import PgDbClient from "./db/PgDbClient.js";

const dbClient = new PgDbClient();

const server = createApolloServer();

const { url } = await startStandaloneServer(server, {
  context: async () => ({
    db: dbClient,
    currentAccountProfileId: "1", //TODO: rm
  }),
});

console.log(`Server running at ${url}`);
