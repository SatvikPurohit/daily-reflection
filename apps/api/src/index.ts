import Hapi from "@hapi/hapi";
import { ApolloServer } from "@apollo/server";
import { hapiApollo } from "@as-integrations/hapi";
import { PrismaClient } from "@prisma/client";
import { typeDefs } from "./graphql/schema";
import { createResolvers } from "./graphql/resolvers";

const APP_PORT = parseInt(process.env.APP_PORT ?? "8080", 10);

async function start() {
  const prisma = new PrismaClient();

  const server = Hapi.server({
    host: "0.0.0.0",
    port: APP_PORT,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  const apollo = new ApolloServer({
    typeDefs,
    resolvers: createResolvers(prisma),
  });

  await apollo.start();

  await server.register({
    plugin: hapiApollo,
    options: {
      apolloServer: apollo,
      path: "/graphql",
    },
  });

  // Health check
  server.route({
    method: "GET",
    path: "/health",
    handler: () => ({ status: "ok", timestamp: new Date().toISOString() }),
  });

  await server.start();
  console.log(`🚀 API server running at http://localhost:${APP_PORT}/graphql`);

  process.on("SIGTERM", async () => {
    await server.stop();
    await prisma.$disconnect();
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
