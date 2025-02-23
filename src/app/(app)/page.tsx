"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUserCourses } from "@/hooks/useUserCourses";
import { LanguageSelector } from "@/components/language-selector";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

export default function Page() {
  const { data: user, isLoading } = useUserCourses();

  if (isLoading) {
    return (
      <div className="space-y-8 p-3.5 lg:p-6">
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!user?.[0]?.studentCourses?.length) {
    return (
      <div className="container max-w-2xl py-10">
        <LanguageSelector />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-3.5 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">My Courses</h1>
        <Link href="/courses">
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {user[0].studentCourses.map((course) => (
          <Link href={`/course/${course.id}`} key={course.id}>
            <Card className="rounded-lg p-px shadow-lg">
              <div className="bg-card hover:bg-accent group rounded-lg">
                <div className="block space-y-1.5 px-5 py-3">
                  <div className="font-bold">
                    {course.nativeLanguage.name} → {course.targetLanguage.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Level: {course.level}
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
