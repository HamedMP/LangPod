"use client";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import { env } from "@/env.mjs";
import PostHogPageView from "@/app/PostHogPageView";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
      ui_host: "https://eu.posthog.com",
      person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
    });
  }, []);

  return (
    <PHProvider client={posthog}>
      {children}
      <PostHogPageView />
    </PHProvider>
  );
}
