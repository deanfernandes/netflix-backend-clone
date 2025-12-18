import * as dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

import { startStandaloneServer } from "@apollo/server/standalone";
import { createApolloServer } from "../../src/server.js";
import { ApolloServer } from "@apollo/server";
import PgDbClient from "../../src/db/PgDbClient.js";

let server: ApolloServer;
let url: string;

export const startTestServer = async () => {
  const dbClient = new PgDbClient();

  server = createApolloServer();

  const res = await startStandaloneServer(server, {
    context: async () => ({
      db: dbClient,
      currentAccountProfileId: "1", // TODO: rm
    }),
    listen: { port: 0 },
  });

  url = res.url;

  return { server, url, dbClient };
};

export const stopTestServer = async () => {
  if (server) {
    await server.stop();
  }
};
