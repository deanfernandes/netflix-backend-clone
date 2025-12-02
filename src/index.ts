import { startStandaloneServer } from "@apollo/server/standalone";
import PgDbClient from "./db/PgDbClient.js";
import { createApolloServer } from "./server.js";

const dbClient = new PgDbClient();

const server = createApolloServer(dbClient);

const { url } = await startStandaloneServer(server);

console.log(`Server running at ${url}`);
