import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    ELEVENLABS_API_KEY: z.string().min(1, "ElevenLabs API key is required"),
    CLERK_SECRET_KEY: z.string().min(1, "Clerk secret key is required"),
    DATABASE_URL: z.string().min(1, "Database URL is required"),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
      .string()
      .min(1, "Clerk publishable key is required"),
  },
  runtimeEnv: {
    ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
  },
});
