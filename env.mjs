import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    ELEVENLABS_API_KEY: z.string().min(1, "ElevenLabs API key is required"),
    AGENT_ID: z.string().min(1, "Agent ID is required"),
    CLERK_SECRET_KEY: z.string().min(1, "Clerk secret key is required"),
    DATABASE_URL: z.string().min(1, "Database URL is required"),
    INNGEST_EVENT_KEY: z.string().min(1, "Inngest event key is required"),
    INNGEST_SIGNING_KEY: z.string().min(1, "Inngest signing key is required"),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
      .string()
      .min(1, "Clerk publishable key is required"),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1, "PostHog key is required"),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().min(1, "PostHog host is required"),
  },
  runtimeEnv: {
    ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
    AGENT_ID: process.env.AGENT_ID,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
    INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
  },
});
