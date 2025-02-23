"use server";

import { put } from "@vercel/blob";
import { inngest } from "@/inngest/client";
import { prisma as db } from "@/db/client";

export async function generateLessonContent(lessonId: string) {
  // Get lesson details from DB
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: {
      course: {
        include: {
          nativeLanguage: true,
          targetLanguage: true,
        },
      },
    },
  });

  if (!lesson) throw new Error("Lesson not found");

  // Queue the background job
  await inngest.send({
    name: "lesson.generate",
    data: {
      lessonId,
      topic: lesson.title,
      language: lesson.course.targetLanguage.name,
      nativeLanguage: lesson.course.nativeLanguage.name,
      difficulty: lesson.course.level,
    },
  });

  return { queued: true };
}
