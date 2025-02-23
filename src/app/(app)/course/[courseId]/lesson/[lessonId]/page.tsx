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
import { generateLessonContent } from "@/app/actions/lesson";
import { Button } from "@/components/ui/button";

interface LessonWithRelations extends Lesson {
  course: Course & {
    nativeLanguage: Language;
    targetLanguage: Language;
    userCourses: { userId: string }[];
  };
}

export default function LessonPage() {
  const { courseId, lessonId } = useParams();
  const { userId } = useAuth();
  const { updateSidebarInfo } = useSidebar();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioSources, setAudioSources] = useState<string[]>([]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);

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

  // Handle audio segment completion and play next
  const handleAudioEnded = () => {
    if (currentAudioIndex < audioSources.length - 1) {
      setCurrentAudioIndex((prev) => prev + 1);
    }
  };

  // Update audio sources when lesson data changes
  useEffect(() => {
    if (lesson) {
      // Handle both old and new audio storage formats
      const sources = lesson.audioUrls?.length
        ? lesson.audioUrls
        : lesson.audioUrl
          ? [lesson.audioUrl]
          : [];
      setAudioSources(sources);
      setCurrentAudioIndex(0);
    }
  }, [lesson]);

  // Update audio source when currentAudioIndex changes
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
          <div className="mt-4">
            {audioSources.length > 0 ? (
              <div className="space-y-2">
                <audio
                  ref={audioRef}
                  controls
                  onEnded={handleAudioEnded}
                  className="w-full"
                />
                {audioSources.length > 1 && (
                  <div className="text-sm text-muted-foreground">
                    Playing segment {currentAudioIndex + 1} of{" "}
                    {audioSources.length}
                  </div>
                )}
              </div>
            ) : isGenerating ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                Generating lesson audio...
              </div>
            ) : (
              <Button onClick={handleGenerateLesson} className="w-full">
                Generate Lesson Audio
              </Button>
            )}
          </div>
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
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Pod feature coming soon
            </div>
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
