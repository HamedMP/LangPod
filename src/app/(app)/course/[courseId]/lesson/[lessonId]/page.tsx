"use client";

import { useParams } from "next/navigation";
import { useFindUniqueLesson } from "@/hooks/zenstack";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConversationTab } from "@/app/(app)/lesson/_tabs/ConversationTab";
import { CoachTab } from "@/app/(app)/lesson/_tabs/CoachTab";
import { useAuth } from "@clerk/nextjs";
import { useSidebar } from "@/contexts/sidebar-context";
import { useEffect, useRef, useState } from "react";
import type { Course, Language, Lesson } from "@prisma/client";
import type { JsonValue } from "@prisma/client/runtime/library";
import { generateLessonContent } from "@/app/actions/lesson";
import { Button } from "@/components/ui/button";
import { PodTab } from "@/app/(app)/lesson/_tabs/PodTab";

interface LessonWithRelations extends Omit<Lesson, "segments"> {
  course: Course & {
    nativeLanguage: Language;
    targetLanguage: Language;
    userCourses: { userId: string }[];
  };
  segments: JsonValue;
}

export default function LessonPage() {
  const { courseId, lessonId } = useParams();
  const { userId } = useAuth();
  const { updateSidebarInfo } = useSidebar();
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    data: lesson,
    isLoading,
    refetch,
  } = useFindUniqueLesson<{
    where: { id: string };
    include: {
      course: {
        include: {
          nativeLanguage: true;
          targetLanguage: true;
          userCourses: {
            select: { userId: true };
            where: { userId: string };
          };
        };
      };
    };
  }>({
    where: { id: lessonId as string },
    include: {
      course: {
        include: {
          nativeLanguage: true,
          targetLanguage: true,
          userCourses: {
            select: { userId: true },
            where: { userId: userId as string },
          },
        },
      },
    },
  });

  useEffect(() => {
    if (lesson && isGenerating) {
      const interval = setInterval(() => {
        refetch();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [lesson, refetch, isGenerating]);

  useEffect(() => {
    if (lesson) {
      const course = lesson.course;
      updateSidebarInfo({
        userCourseId: courseId as string,
        courseName: `${course.targetLanguage.name} (${course.level})`,
      });
    }

    return () => {
      updateSidebarInfo({ userCourseId: undefined, courseName: undefined });
    };
  }, [lesson, courseId, updateSidebarInfo]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioSources, setAudioSources] = useState<string[]>([]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);

  useEffect(() => {
    if (lesson) {
      const sources = lesson.audioUrls?.length
        ? lesson.audioUrls
        : lesson.audioUrl
          ? [lesson.audioUrl]
          : [];
      setAudioSources(sources);
      setCurrentAudioIndex(0);
    }
  }, [lesson]);

  useEffect(() => {
    if (audioRef.current && audioSources[currentAudioIndex]) {
      audioRef.current.src = audioSources[currentAudioIndex];
      audioRef.current.play().catch(console.error);
    }
  }, [currentAudioIndex, audioSources]);

  const handleGenerateLesson = async () => {
    if (!lesson) return;

    setIsGenerating(true);
    try {
      await generateLessonContent(lesson.id);
      refetch();
    } catch (error) {
      console.error("Failed to generate lesson:", error);
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <div className="flex-1 p-6">
          <Skeleton className="h-8 w-[200px] mb-6" />
          <Skeleton className="h-[500px]" />
        </div>
      </div>
    );
  }

  const typedLesson = lesson as unknown as LessonWithRelations;

  if (!typedLesson || !typedLesson.course.userCourses.length) {
    return (
      <div className="flex h-screen">
        <div className="flex-1 p-6">
          <div className="text-lg text-muted-foreground">
            Lesson not found or you don't have access
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b">
        <div className="container py-4">
          <h1 className="text-2xl font-bold mb-1">{typedLesson.title}</h1>
          <p className="text-muted-foreground">
            {typedLesson.course.targetLanguage.name} • Level{" "}
            {typedLesson.course.level}
          </p>
        </div>
      </div>

      <div className="flex-1 container py-6">
        <Tabs defaultValue="pod" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pod">Pod</TabsTrigger>
            <TabsTrigger value="conversation">Conversation</TabsTrigger>
            <TabsTrigger value="coach">Coach</TabsTrigger>
          </TabsList>
          <TabsContent value="pod" className="h-[600px]">
            <PodTab
              audioUrls={
                typedLesson.audioUrls.length > 0
                  ? typedLesson.audioUrls
                  : typedLesson.audioUrl
                    ? [typedLesson.audioUrl]
                    : []
              }
              segments={
                (typedLesson.segments as Array<{
                  text: string;
                  voice: string;
                }>) || []
              }
              onGenerateLesson={handleGenerateLesson}
              isGenerating={isGenerating}
            />
          </TabsContent>
          <TabsContent value="conversation" className="h-[600px]">
            <ConversationTab />
          </TabsContent>
          <TabsContent value="coach" className="h-[600px]">
            <CoachTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
