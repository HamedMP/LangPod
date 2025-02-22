import type { Metadata } from "next";

import { getApiKey } from "@/app/actions";
import { AppSidebar } from "@/components/app-sidebar";
import { Byline } from "@/components/by-line";
import { KeyProvider } from "@/components/key-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Card } from "@/components/ui/card";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import { PostHogProvider } from "@/providers/PosthogProvider";

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
    images: [`/api/og?title=LangPod`],
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
      <html lang="en" suppressHydrationWarning className="dark">
        <body>
          <PostHogProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              forcedTheme="dark"
              disableTransitionOnChange
            >
              <KeyProvider apiKey={apiKey}>
                <SidebarProvider>
                  <AppSidebar />
                  <SidebarInset className="background-gradient">
                    <header className="relative flex h-[60px] shrink-0 items-center justify-center">
                      <SidebarTrigger className="absolute left-3" />
                      <SignedOut>
                        <SignInButton />
                      </SignedOut>
                      <SignedIn>
                        <UserButton />
                      </SignedIn>
                    </header>
                    <div className="p-4">
                      <div className="mx-auto max-w-4xl space-y-3 px-2 pt-20 lg:px-8 lg:py-8">
                        <Byline />
                        <Card className="border-gradient rounded-lg p-px shadow-lg">
                          <div className="bg-card rounded-lg">{children}</div>
                        </Card>
                      </div>
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
