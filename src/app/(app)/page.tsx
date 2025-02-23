"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFindManyUserCourse } from "@/hooks/zenstack";
import { LanguageSelector } from "@/components/language-selector";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, ChevronRight, Trophy, BookOpen } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { getCountryCode } from "@/lib/utils";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import { motion } from "framer-motion";
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
      <div className="container max-w-7xl mx-auto py-8">
        <Skeleton className="h-12 w-48 mb-6" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
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

  // Group courses by level
  const coursesByLevel = typedUserCourses.reduce(
    (acc, course) => {
      const level = course.course.level;
      if (!acc[level]) acc[level] = [];
      acc[level].push(course);
      return acc;
    },
    {} as Record<string, UserCourseWithRelations[]>
  );

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Language Journey</h1>
          <p className="text-muted-foreground text-lg">
            You're learning {typedUserCourses.length} language
            {typedUserCourses.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/?new=true">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Start New Language
          </Button>
        </Link>
      </div>

      <div className="space-y-10">
        {Object.entries(coursesByLevel).map(([level, courses], levelIndex) => (
          <motion.div
            key={level}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: levelIndex * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Level {level}</h2>
              <span className="text-muted-foreground">
                ({courses.length} courses)
              </span>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {courses.map((userCourse, index) => (
                <motion.div
                  key={userCourse.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/course/${userCourse.id}`}>
                    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className="relative">
                        <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.03] pointer-events-none">
                          <span className="text-[80px] transform rotate-12 block">
                            {getUnicodeFlagIcon(
                              getCountryCode(
                                userCourse.course.targetLanguage.code
                              )
                            )}
                          </span>
                        </div>
                        <div className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-3xl transform group-hover:scale-110 transition-transform">
                                  {getUnicodeFlagIcon(
                                    getCountryCode(
                                      userCourse.course.targetLanguage.code
                                    )
                                  )}
                                </span>
                                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                  {userCourse.course.targetLanguage.name}
                                </h3>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                <span>Learning from</span>
                                <span className="text-lg">
                                  {getUnicodeFlagIcon(
                                    getCountryCode(
                                      userCourse.course.nativeLanguage.code
                                    )
                                  )}
                                </span>
                                <span>
                                  {userCourse.course.nativeLanguage.name}
                                </span>
                              </div>
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                                  <span>0 lessons completed</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                                  <div className="h-full w-0 bg-primary rounded-full transition-all" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border-t bg-muted/30 flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Continue Learning
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
