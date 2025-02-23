"use client";

import { useAuth } from "@clerk/nextjs";
import { useFindManyUser } from "@/hooks/zenstack";
import type { Course, Language } from "@prisma/client";

interface UserWithCourses {
  studentCourses: (Course & {
    nativeLanguage: Language;
    targetLanguage: Language;
  })[];
}

export function useUserCourses() {
  const { userId } = useAuth();

  return useFindManyUser({
    where: userId
      ? {
          clerkId: userId,
        }
      : undefined,
    select: {
      studentCourses: {
        include: {
          nativeLanguage: true,
          targetLanguage: true,
        },
      },
    },
  });
}

// Type helper for the returned courses
export type UserCourse = Course & {
  nativeLanguage: { name: string };
  targetLanguage: { name: string };
};
