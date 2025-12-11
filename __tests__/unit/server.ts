import { startStandaloneServer } from "@apollo/server/standalone";
import { createApolloServer } from "../../src/server.js";
import { ApolloServer } from "@apollo/server";
import { dbMocks } from "./mocks";

let server: ApolloServer;
let url: string;

export const startTestServer = async () => {
  server = createApolloServer();

  const res = await startStandaloneServer(server, {
    context: async () => ({
      db: dbMocks,
      currentAccountProfileId: "1",
    }),
  });

  url = res.url;

  return { server, url };
};

export const stopTestServer = async () => {
  if (server) {
    await server.stop();
  }
};
