"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

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
import { demos } from "@/lib/demos";
import Twemoji from "./common/Twemoji";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown, Plus } from "lucide-react";
import { Lesson } from "@prisma/client";
import { useFindManyUser } from "@/hooks/zenstack";
import { useAuth } from "@clerk/nextjs";
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  courseId?: string;
  courseName?: string;
  lessons?: Lesson[];
}

export function AppSidebar({
  courseId,
  courseName,
  lessons,
  ...props
}: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { userId } = useAuth();
  const { data: user } = useFindManyUser({
    where: {
      clerkId: userId ?? "",
    },
    select: {
      studentCourses: {
        include: {
          nativeLanguage: true,
          targetLanguage: true,
        },
      },
    },
  });

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
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full bg-sidebar-accent border-none p-3 rounded-md flex items-center justify-between">
                      {courseName || "Select a course"}
                      <ChevronDown className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      {user?.[0]?.studentCourses?.map((course) => (
                        <DropdownMenuItem
                          key={course.id}
                          onClick={() => router.push(`/course/${course.id}`)}
                        >
                          <div className="flex items-center gap-2">
                            <Twemoji emoji={course.targetLanguage.code} />
                            <span>
                              {course.targetLanguage.name} ({course.level})
                            </span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <Link href="/courses" className="block">
                        <DropdownMenuItem>
                          <div className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            <span>Add a new course</span>
                          </div>
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {courseId && lessons && (
          <SidebarGroup>
            <SidebarGroupLabel>Lessons</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {lessons.map((lesson) => (
                  <SidebarMenuItem key={lesson.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        pathname === `/course/${courseId}/lesson/${lesson.id}`
                      }
                    >
                      <Link href={`/course/${courseId}/lesson/${lesson.id}`}>
                        {lesson.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

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
          <RedirectToSignIn redirectUrl={"/"} />
        </SignedOut>
        <SignedIn>
          <UserButton
            showName
            appearance={{
              elements: {
                userButtonBox:
                  "flex !flex-row-reverse !justify-end !w-full gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition",
                rootBox: "!w-full",
                userButtonTrigger: "!w-full",
                userButtonOuterIdentifier__open: "!bg-red-100",
              },
            }}
          />
        </SignedIn>
      </SidebarFooter>
    </Sidebar>
  );
}
