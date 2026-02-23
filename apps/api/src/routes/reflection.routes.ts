import { Server } from "hapi";

const prisma = new PrismaClient();

export function reflectionRoutes(): Server {
  const server = new Server({
    host: "localhost",
    port: process.env.APP_PORT || 8080,
  });

  /**
   * POST /api/reflections
   * Create new reflection entry
   *
   * Flow:
   * 1. Validate request
   * 2. Call reflectionService.createEntry()
   * 3. Trigger pattern detection (async)
   * 4. Return entry
   */

  return server; // server.start()
}
