"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFindManyUserCourse } from "@/hooks/zenstack";
import { LanguageSelector } from "@/components/language-selector";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { getCountryCode } from "@/lib/utils";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import type { Course, Language, UserCourse } from "@prisma/client";

interface UserCourseWithRelations extends UserCourse {
  course: Course & {
    nativeLanguage: Language;
    targetLanguage: Language;
  };
}

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userId } = useAuth();
  const showWizard = searchParams.get("new") === "true";
  const viewAll = searchParams.get("view") === "all";

  const { data: userCourses, isLoading } = useFindManyUserCourse<{
    include: {
      course: {
        include: {
          nativeLanguage: true;
          targetLanguage: true;
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
        },
      },
    },
  });

  useEffect(() => {
    if (!isLoading && !showWizard && !viewAll && userCourses?.length) {
      const lastActiveUserCourse = localStorage.getItem("lastActiveUserCourse");
      if (lastActiveUserCourse) {
        router.push(`/course/${lastActiveUserCourse}`);
      } else {
        // If no last active course, use the first course
        router.push(`/course/${userCourses[0].id}`);
      }
    }
  }, [isLoading, userCourses, router, showWizard, viewAll]);

  if (isLoading) {
    return (
      <div className="p-4">
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  // Show wizard if explicitly requested or if user has no courses
  if (showWizard || !userCourses?.length) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <LanguageSelector />
      </div>
    );
  }

  const typedUserCourses = userCourses as unknown as UserCourseWithRelations[];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-bold">My Courses</h1>
          <span className="text-muted-foreground">
            {typedUserCourses.length} courses
          </span>
        </div>
        <Link href="/?new=true">
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {typedUserCourses.map((userCourse) => (
          <Link href={`/course/${userCourse.id}`} key={userCourse.id}>
            <Card className="group hover:shadow-lg transition-all duration-200">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl">
                    {getUnicodeFlagIcon(
                      getCountryCode(userCourse.course.targetLanguage.code)
                    )}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {userCourse.course.targetLanguage.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <span>from</span>
                      <span className="text-xl">
                        {getUnicodeFlagIcon(
                          getCountryCode(userCourse.course.nativeLanguage.code)
                        )}
                      </span>
                      <span>{userCourse.course.nativeLanguage.name}</span>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <div className="text-sm font-medium px-3 py-1.5 rounded-md bg-primary/10 text-primary">
                      Level {userCourse.course.level}
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t flex items-center justify-between text-sm text-muted-foreground">
                  <span>0 lessons completed</span>
                  <span>0% complete</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
