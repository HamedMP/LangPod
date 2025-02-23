"use client";

import { useParams } from "next/navigation";
import { useFindUniqueCourse } from "@/hooks/zenstack";
import { Skeleton } from "@/components/ui/skeleton";
import { AppSidebar } from "@/components/app-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CoursePage() {
  const { courseId } = useParams();
  const { data: course, isLoading } = useFindUniqueCourse({
    where: { id: courseId as string },
    include: {
      nativeLanguage: true,
      targetLanguage: true,
      lessons: {
        include: {
          user: true,
        },
      },
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <AppSidebar className="w-[270px]" />
        <div className="flex-1 p-6">
          <Skeleton className="h-8 w-[200px] mb-6" />
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex h-screen">
        <AppSidebar className="w-[270px]" />
        <div className="flex-1 p-6">
          <div className="text-lg text-muted-foreground">Course not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <AppSidebar
        className="w-[270px]"
        courseId={courseId as string}
        courseName={`${course.targetLanguage.name} (${course.level})`}
        lessons={course.lessons}
      />
      <ScrollArea className="flex-1">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              {course.targetLanguage.name} Course
            </h1>
            <p className="text-muted-foreground">
              Learning in {course.nativeLanguage.name} • Level {course.level}
            </p>
          </div>

          {course.lessons.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No lessons yet</h3>
              <p className="text-muted-foreground">
                Your lessons will appear here once they are generated
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {course.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <h3 className="font-medium mb-1">{lesson.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {lesson.scenarioContext}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
