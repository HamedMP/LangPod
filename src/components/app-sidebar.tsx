"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { SignedIn, SignedOut, SignInButton, useClerk, useUser } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { demos } from "@/lib/demos";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { openSignIn } = useClerk();
  const { user } = useUser();

  return (
    <Sidebar {...props} className="bg-background">
      <SidebarHeader className="h-[60px] px-[21px]">
        <div className="flex h-full items-center justify-between px-1 pl-0">
          <Link href="/" className="flex flex-row items-center gap-2">
            <p className="text-xl font-bold text-primary">LangPod</p>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-background px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Select>
                    <SelectTrigger className="w-full bg-sidebar-accent border-none ">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                      <SelectItem value="fr">🇫🇷 French</SelectItem>
                      <SelectItem value="de">🇩🇪 German</SelectItem>
                      <SelectItem value="it">🇮🇹 Italian</SelectItem>
                      <SelectItem value="ja">🇯🇵 Japanese</SelectItem>
                      <SelectItem value="zh">🇨🇳 Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {demos.map((demo) => (
          <SidebarGroup key={demo.name}>
            <SidebarGroupLabel>{demo.name}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {demo.items.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === `/${item.slug}`}
                    >
                      <a href={`/${item.slug}`}>
                        {item.icon && (
                          <item.icon className="!h-[18px] !w-[18px] stroke-[2]" />
                        )}
                        {item.name}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        
        <SignedIn>
          <button 
            onClick={() => openSignIn()}
            className="flex w-full items-center gap-3 rounded-md p-2 hover:bg-muted"
          >
            <Avatar>
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/50">
                {user?.firstName?.[0] || user?.username?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
            <span className="flex-1 text-sm font-medium">
              {user?.fullName || user?.username}
            </span>
          </button>
        </SignedIn>
      </SidebarFooter>
    </Sidebar>
  );
}
