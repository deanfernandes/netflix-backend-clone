import { startStandaloneServer } from "@apollo/server/standalone";
import { createApolloServer } from "./server.js";
import PgDbClient from "./db/PgDbClient.js";

const dbClient = new PgDbClient();

const server = createApolloServer();

const { url } = await startStandaloneServer(server, {
  context: async () => ({ db: dbClient }),
});

console.log(`Server running at ${url}`);
