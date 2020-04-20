import "@babel/polyfill";
import { GraphQLServer, PubSub } from "graphql-yoga";
import db from "./db";
import prisma from "./prisma";
import { resolvers, fragmentReplacements } from "./resolvers/index";
const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: resolvers,
  context(req) {
    return {
      db,
      pubsub,
      prisma,
      req,
    };
  },
  fragmentReplacements,
});

server.start({ port: process.env.PORT || 4000 }, () => {
  console.log("The server is up!");
});
