import {
  clerkMiddleware,
  createRouteMatcher,
  currentUser,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([""]);

export default clerkMiddleware(
  async (auth, request) => {
    if (isProtectedRoute(request)) {
      auth.protect();
    }
    return NextResponse.next();
  },
  { debug: false }
);

export const config = {
  matcher: [
    // Skip Next.js internals, static files, and specific routes
    "/((?!_next|ingest|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Only run for API routes except inngest
    "/(api/(?!inngest).*|trpc)(.*)",
  ],
};
