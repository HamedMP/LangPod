import type { Metadata } from "next";
import { Onest } from "next/font/google";

import { getApiKey } from "@/app/actions";
import { KeyProvider } from "@/components/key-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

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
        <body className={onest.className}>
          <PostHogProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              forcedTheme="light"
              disableTransitionOnChange
            >
              <KeyProvider apiKey={apiKey}>{children}</KeyProvider>
              <Toaster />
            </ThemeProvider>
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
