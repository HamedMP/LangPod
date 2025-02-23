"use client";

import { useParams } from "next/navigation";
import { useFindUniqueUserCourse } from "@/hooks/zenstack";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@clerk/nextjs";
import { useSidebar } from "@/contexts/sidebar-context";
import { useEffect } from "react";
import Link from "next/link";
import type {
  Course,
  Language,
  Lesson,
  User,
  UserCourse,
} from "@prisma/client";

interface UserCourseWithRelations extends UserCourse {
  course: Course & {
    nativeLanguage: Language;
    targetLanguage: Language;
    lessons: Lesson[];
  };
  user: User;
}

export default function CoursePage() {
  const { courseId } = useParams();
  const { userId } = useAuth();
  const { updateSidebarInfo } = useSidebar();

  const { data: userCourse, isLoading } = useFindUniqueUserCourse<{
    where: {
      id: string;
    };
    include: {
      course: {
        include: {
          nativeLanguage: true;
          targetLanguage: true;
          lessons: {
            orderBy: {
              createdAt: "asc";
            };
          };
        };
      };
      user: true;
    };
  }>({
    where: { id: courseId as string },
    include: {
      course: {
        include: {
          nativeLanguage: true,
          targetLanguage: true,
          lessons: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      },
      user: true,
    },
  });

  useEffect(() => {
    if (userCourse) {
      const course = userCourse.course;
      updateSidebarInfo({
        userCourseId: courseId as string,
        courseName: `${course.targetLanguage.name} (${course.level})`,
      });
    }

    // Cleanup when unmounting
    return () => {
      updateSidebarInfo({ userCourseId: undefined, courseName: undefined });
    };
  }, [userCourse, courseId, updateSidebarInfo]);

  if (isLoading) {
    return (
      <div className="flex h-screen">
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

  const typedUserCourse = userCourse as unknown as UserCourseWithRelations;

  console.log("Course Page Data:", {
    userCourseId: courseId,
    userCourse: typedUserCourse,
    lessons: typedUserCourse?.course?.lessons,
  });

  if (!typedUserCourse || typedUserCourse.user.clerkId !== userId) {
    return (
      <div className="flex h-screen">
        <div className="flex-1 p-6">
          <div className="text-lg text-muted-foreground">
            Course not found or you don't have access
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            {typedUserCourse.course.targetLanguage.name} Course
          </h1>
          <p className="text-muted-foreground">
            Learning in {typedUserCourse.course.nativeLanguage.name} • Level{" "}
            {typedUserCourse.course.level}
          </p>
        </div>

        {typedUserCourse.course.lessons.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No lessons yet</h3>
            <p className="text-muted-foreground">
              Your lessons will appear here once they are generated
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {typedUserCourse.course.lessons.map((lesson, index) => (
              <Link
                key={lesson.id}
                href={`/course/${courseId}/lesson/${lesson.id}`}
                className="block border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">
                    Lesson {index + 1}: {lesson.title}
                  </h3>
                  <Badge
                    variant={
                      lesson.progress === "COMPLETED" ? "default" : "secondary"
                    }
                  >
                    {lesson.progress.toLowerCase().replace("_", " ")}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {lesson.scenarioContext}
                </p>
                {lesson.type === "catalog" && (
                  <div className="mt-2">
                    <Badge variant="outline">Catalog Lesson</Badge>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
