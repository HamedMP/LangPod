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
import { useEffect } from "react";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown, Plus, ArrowRight, HelpCircle } from "lucide-react";
import { Lesson } from "@prisma/client";
import { useFindManyUser } from "@/hooks/zenstack";
import { useAuth } from "@clerk/nextjs";
import { getCountryCode } from "@/lib/utils";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

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

  const currentCourse = user?.[0]?.studentCourses?.find(
    (course) => course.id === courseId
  );

  // Group courses by native language
  const coursesByNativeLanguage = React.useMemo(() => {
    if (!user?.[0]?.studentCourses) return {};
    return user[0].studentCourses.reduce(
      (acc, course) => {
        const key = course.nativeLanguage.code;
        if (!acc[key]) {
          acc[key] = {
            name: course.nativeLanguage.name,
            code: course.nativeLanguage.code,
            courses: [],
          };
        }
        acc[key].courses.push(course);
        return acc;
      },
      {} as Record<
        string,
        {
          name: string;
          code: string;
          courses: (typeof user)[0]["studentCourses"];
        }
      >
    );
  }, [user]);

  useEffect(() => {
    if (courseId) {
      localStorage.setItem("lastActiveCourse", courseId);
    }
  }, [courseId]);

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
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger className="w-full bg-sidebar-accent border-none p-3 rounded-md">
                            {currentCourse ? (
                              <div className="flex items-center justify-between w-full group">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">
                                    {getUnicodeFlagIcon(
                                      getCountryCode(
                                        currentCourse.targetLanguage.code
                                      )
                                    )}
                                  </span>
                                  <div className="flex flex-col items-start">
                                    <span className="font-semibold">
                                      {currentCourse.targetLanguage.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                      Level {currentCourse.level}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                  <ChevronDown className="h-4 w-4" />
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between w-full">
                                <span>Select a course</span>
                                <ChevronDown className="h-4 w-4" />
                              </div>
                            )}
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-[300px]">
                          <p>
                            Your active language learning course. The flag shows
                            the language you're learning.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <DropdownMenuContent
                      className="w-72"
                      align="start"
                      sideOffset={8}
                    >
                      {Object.values(coursesByNativeLanguage).map((group) => (
                        <React.Fragment key={group.code}>
                          <DropdownMenuLabel className="flex items-center gap-2 text-xs text-muted-foreground px-3 pt-3 pb-2">
                            <span className="text-base">
                              {getUnicodeFlagIcon(getCountryCode(group.code))}
                            </span>
                            <span>Native {group.name} Speaker</span>
                          </DropdownMenuLabel>
                          {group.courses.map((course) => (
                            <DropdownMenuItem
                              key={course.id}
                              onClick={() =>
                                router.push(`/course/${course.id}`)
                              }
                              className="px-3"
                            >
                              <div className="flex items-center gap-3 w-full py-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">
                                    {getUnicodeFlagIcon(
                                      getCountryCode(course.targetLanguage.code)
                                    )}
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-base">
                                    {course.targetLanguage.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    Level {course.level}
                                  </span>
                                </div>
                              </div>
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator className="my-2" />
                        </React.Fragment>
                      ))}
                      <Link href="/?new=true" className="block">
                        <DropdownMenuItem className="px-3">
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
