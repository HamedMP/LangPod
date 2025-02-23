import type { NextRequest } from "next/server";
import { NextRequestHandler } from "@zenstackhq/server/next";
import { enhance } from "@zenstackhq/runtime";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/db/client";
import { env } from "@/env.mjs";

const environment = process.env.NODE_ENV;

async function getPrisma(req: NextRequest) {
  const { userId: id, sessionId } = getAuth(req);

  if (environment === "development" && id) {
  }
  // create a wrapper of Prisma client that enforces access policy,
  // data validation, and @password, @omit behaviors
  return enhance(
    prisma,
    {
      user: id
        ? {
            id,
            sessionId,
          }
        : undefined,
    },
    { logPrismaQuery: true }
  );
}

const handler = NextRequestHandler({ getPrisma, useAppDir: true });

export {
  handler as DELETE,
  handler as GET,
  handler as PATCH,
  handler as POST,
  handler as PUT,
};
