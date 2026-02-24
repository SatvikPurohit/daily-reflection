import { Server } from "hapi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const APP_PORT = 8080;

export function reflectionRoutes(): Server {
  const server = new Server({
    host: "localhost",
    port: process.env.APP_PORT || APP_PORT,
    // routes: [],
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
