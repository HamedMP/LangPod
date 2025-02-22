import type { Metadata } from "next";
import { Onest } from "next/font/google";

import { getApiKey } from "@/app/actions";
import { AppSidebar } from "@/components/app-sidebar";
import { KeyProvider } from "@/components/key-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

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
              <KeyProvider apiKey={apiKey}>
                <SidebarProvider>
                  <AppSidebar />
                  <SidebarInset className="flex flex-1">
                    <header className="relative flex h-[60px] shrink-0 items-center justify-center">
                      <SidebarTrigger className="absolute left-3" />
                      Hero
                    </header>
                    <div className="flex flex-1 h-full w-full lg:mx-auto max-w-4xl space-y-3 px-2 pt-20 lg:px-8 lg:py-8">
                      {children}
                    </div>
                  </SidebarInset>
                </SidebarProvider>
              </KeyProvider>
              <Toaster />
            </ThemeProvider>
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
