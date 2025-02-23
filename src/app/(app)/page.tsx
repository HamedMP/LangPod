"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUserCourses } from "@/hooks/useUserCourses";
import { LanguageSelector } from "@/components/language-selector";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import Twemoji from "@/components/common/Twemoji";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showWizard = searchParams.get("new") === "true";
  const { data: user, isLoading } = useUserCourses();

  useEffect(() => {
    if (!isLoading && !showWizard && user?.[0]?.studentCourses?.length) {
      const lastActiveCourse = localStorage.getItem("lastActiveCourse");
      if (lastActiveCourse) {
        router.push(`/course/${lastActiveCourse}`);
      } else {
        // If no last active course, use the first course
        router.push(`/course/${user[0].studentCourses[0].id}`);
      }
    }
  }, [isLoading, user, router, showWizard]);

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
  if (showWizard || !user?.[0]?.studentCourses?.length) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <LanguageSelector />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-bold">My Courses</h1>
          <span className="text-muted-foreground">
            {user[0].studentCourses.length} courses
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
        {user[0].studentCourses.map((course) => (
          <Link href={`/course/${course.id}`} key={course.id}>
            <Card className="group hover:shadow-lg transition-all duration-200">
              <div className="relative p-5">
                <div className="absolute top-3 right-3 opacity-10 scale-[2]">
                  <Twemoji emoji={course.targetLanguage.code} />
                </div>
                <div className="flex items-start gap-4">
                  <Twemoji
                    emoji={course.targetLanguage.code}
                    className="w-12 h-12"
                  />
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between mb-2">
                      <div className="font-medium text-lg group-hover:text-primary transition-colors">
                        {course.targetLanguage.name}
                      </div>
                      <div className="text-sm font-medium px-2 py-1 rounded-md bg-primary/10 text-primary">
                        {course.level}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>from</span>
                      <Twemoji
                        emoji={course.nativeLanguage.code}
                        className="w-4 h-4"
                      />
                      <span>{course.nativeLanguage.name}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm text-muted-foreground">
                      <span>0 lessons completed</span>
                      <span>0% complete</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
