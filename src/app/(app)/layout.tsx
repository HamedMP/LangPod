"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const queryClient = new QueryClient();

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-1">
          <header className="relative flex h-[60px] shrink-0 items-center justify-center">
            <SidebarTrigger className="absolute left-3" />
            {/* Hero */}
          </header>
          <div className="flex flex-1 h-full w-full lg:mx-auto max-w-4xl space-y-3 px-2 pt-20 lg:px-8 lg:py-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </QueryClientProvider>
  );
}
