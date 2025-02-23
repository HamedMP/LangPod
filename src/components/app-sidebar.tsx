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
import { useSidebar } from "@/contexts/sidebar-context";

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
import { ChevronDown, Plus, HelpCircle } from "lucide-react";
import { Course, Language, Lesson, UserCourse } from "@prisma/client";
import { useFindManyUserCourse } from "@/hooks/zenstack";
import { useAuth } from "@clerk/nextjs";
import { getCountryCode } from "@/lib/utils";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userCourseId?: string;
  courseName?: string;
  lessons?: Lesson[];
}

interface UserCourseWithRelations extends UserCourse {
  course: Course & {
    nativeLanguage: Language;
    targetLanguage: Language;
    lessons: Lesson[];
  };
}

export function AppSidebar({
  ...props
}: Omit<AppSidebarProps, "userCourseId" | "courseName" | "lessons">) {
  const pathname = usePathname();
  const router = useRouter();
  const { userId } = useAuth();
  const { userCourseId, courseName } = useSidebar();

  const { data: userCourses } = useFindManyUserCourse<{
    include: {
      course: {
        include: {
          nativeLanguage: true;
          targetLanguage: true;
          lessons: {
            // orderBy: {
            //   createdAt: "asc";
            // };
          };
        };
      };
    };
    where: {
      user: {
        clerkId: string;
      };
      role: "STUDENT";
    };
  }>({
    where: {
      user: {
        clerkId: userId ?? "",
      },
      role: "STUDENT",
    },
    include: {
      course: {
        include: {
          nativeLanguage: true,
          targetLanguage: true,
          lessons: {
            // orderBy: {
            //   createdAt: "asc",
            // },
          },
        },
      },
    },
  });

  const typedUserCourses = userCourses as unknown as UserCourseWithRelations[];
  const currentUserCourse = typedUserCourses?.find(
    (uc) => uc.id === userCourseId
  );

  console.log("Sidebar Data:", {
    userCourseId,
    currentUserCourse,
    lessons: currentUserCourse?.course?.lessons,
    allUserCourses: typedUserCourses?.map((uc) => ({
      id: uc.id,
      courseId: uc.courseId,
      lessonCount: uc.course.lessons?.length,
    })),
  });

  // Group courses by native language
  const coursesByNativeLanguage = React.useMemo(() => {
    if (!typedUserCourses) return {};
    return typedUserCourses.reduce(
      (acc, userCourse) => {
        const key = userCourse.course.nativeLanguage.code;
        if (!acc[key]) {
          acc[key] = {
            name: userCourse.course.nativeLanguage.name,
            code: userCourse.course.nativeLanguage.code,
            userCourses: [],
          };
        }
        acc[key].userCourses.push(userCourse);
        return acc;
      },
      {} as Record<
        string,
        {
          name: string;
          code: string;
          userCourses: UserCourseWithRelations[];
        }
      >
    );
  }, [typedUserCourses]);

  return (
    <Sidebar {...props} className="bg-background">
      <SidebarHeader className="h-[60px] px-[21px]">
        <div className="flex h-full items-center justify-between px-1 pl-0">
          <Link href="/" className="flex flex-row items-center gap-2">
            <p className="text-xl font-bold text-primary">LangPods</p>
          </Link>
          <Link
            href="/?view=all"
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            (all courses)
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
                            {currentUserCourse ? (
                              <div className="flex items-center justify-between w-full group">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">
                                    {getUnicodeFlagIcon(
                                      getCountryCode(
                                        currentUserCourse.course.targetLanguage
                                          .code
                                      )
                                    )}
                                  </span>
                                  <div className="flex flex-col items-start">
                                    <span className="font-semibold">
                                      {
                                        currentUserCourse.course.targetLanguage
                                          .name
                                      }
                                    </span>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                      Level {currentUserCourse.course.level}
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
                          {group.userCourses.map((userCourse) => (
                            <DropdownMenuItem
                              key={userCourse.id}
                              onClick={() =>
                                router.push(`/course/${userCourse.id}`)
                              }
                              className="px-3"
                            >
                              <div className="flex items-center gap-3 w-full py-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">
                                    {getUnicodeFlagIcon(
                                      getCountryCode(
                                        userCourse.course.targetLanguage.code
                                      )
                                    )}
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-base">
                                    {userCourse.course.targetLanguage.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    Level {userCourse.course.level}
                                  </span>
                                </div>
                              </div>
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator className="my-2" />
                        </React.Fragment>
                      ))}
                      <DropdownMenuItem
                        className="px-3"
                        onClick={() => router.push("/?view=all")}
                      >
                        <div className="flex items-center gap-2">
                          <span>View All Courses</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-2" />
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

        {userCourseId && currentUserCourse && (
          <SidebarGroup>
            <SidebarGroupLabel>Lessons</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {currentUserCourse.course.lessons.map((lesson) => (
                  <SidebarMenuItem key={lesson.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        pathname ===
                        `/course/${userCourseId}/lesson/${lesson.id}`
                      }
                    >
                      <Link
                        href={`/course/${userCourseId}/lesson/${lesson.id}`}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        {lesson.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="p-2 flex flex-col gap-4">
        <Link
          href="/marketing"
          className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 p-2 rounded-lg hover:bg-sidebar-accent"
        >
          <HelpCircle className="h-4 w-4" />
          About LangPods
        </Link>
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
