import type { Metadata } from "next";
import { Onest } from "next/font/google";
import Script from "next/script";

import { getApiKey } from "@/app/actions";
import { KeyProvider } from "@/components/key-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/env.mjs";

import "./globals.css";
import { PostHogProvider } from "@/providers/PosthogProvider";

const onest = Onest({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LangPod",
    template: "%s | LangPod",
  },
  metadataBase: new URL("https://langpod.ai"),
  description: "A Next.JS playground to explore ElevenLabs capabilities.",
  openGraph: {
    title: "LangPod",
    description: "A playground to explore ElevenLabs capabilities.",
    images: ["/api/og?title=LangPod"],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const apiKeyResult = await getApiKey();
  const apiKey = apiKeyResult.ok ? apiKeyResult.value : null;

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className="">
        <head>
          <Script src="https://elevenlabs.io/convai-widget/index.js" async />
        </head>
        <body className={onest.className}>
          <PostHogProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              forcedTheme="light"
              disableTransitionOnChange
            >
              <KeyProvider apiKey={apiKey}>
                {children}
                <elevenlabs-convai
                  agent-id={env.NEXT_PUBLIC_AGENT_ID}
                  action-text="Need a language lesson?"
                  start-call-text="Begin conversation"
                  end-call-text="End call"
                  expand-text="Open chat"
                  listening-text="Listening..."
                  speaking-text="Assistant speaking"
                />
              </KeyProvider>
              <Toaster />
            </ThemeProvider>
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
