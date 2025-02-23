import { createClerkClient } from "@clerk/backend";
import { prisma as db } from "@/db/client";

if (!process.env.CLERK_SECRET_KEY) {
  throw new Error("CLERK_SECRET_KEY is required");
}

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

async function syncClerkData() {
  console.log("Syncing Clerk data...");

  try {
    // 1. Get all users from Clerk
    const users = await clerk.users.getUserList();

    console.log(`Found ${users.data.length} users`);

    // 3. Create or update Organizations and get their members
    for (const user of users.data) {
      // Create/update user
      await db.user.upsert({
        where: { id: user.id },
        create: {
          id: user.id,
          clerkId: user.id,
          email: user.emailAddresses[0].emailAddress,
          name: `${user.firstName} ${user.lastName}`,
        },
        update: {
          email: user.emailAddresses[0].emailAddress,
          name: `${user.firstName} ${user.lastName}`,
        },
      });
      console.log(`User synced: ${user.emailAddresses[0].emailAddress}`);
    }
    console.log("Successfully synced all Clerk data to local database!");
  } catch (error) {
    console.error("Error syncing Clerk data:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Stack trace:", error.stack);
    }
  }
}

// Run the sync
syncClerkData();
