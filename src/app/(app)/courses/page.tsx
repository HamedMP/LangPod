"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Twemoji from "@/components/common/Twemoji";
import { useFindManyLanguage, useCreateCourse } from "@/hooks/zenstack";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const levels = [
  { code: "A1", name: "Beginner", emoji: "🌱" },
  { code: "A2", name: "Elementary", emoji: "🎋" },
  { code: "B1", name: "Intermediate", emoji: "🌿" },
  { code: "B2", name: "Upper Intermediate", emoji: "🌳" },
  { code: "C1", name: "Advanced", emoji: "🌲" },
  { code: "C2", name: "Mastery", emoji: "🎄" },
];

export default function CoursesPage() {
  const router = useRouter();
  const { userId } = useAuth();
  const { data: languages, isLoading } = useFindManyLanguage();
  const createCourse = useCreateCourse();
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  const handleCreateCourse = async (nativeLanguageId: string) => {
    try {
      if (!userId || !selectedLanguage || !selectedLevel) {
        toast.error("Please select language and level first");
        return;
      }

      const result = await createCourse.mutateAsync({
        data: {
          student: {
            connect: {
              clerkId: userId,
            },
          },
          nativeLanguage: {
            connect: {
              id: nativeLanguageId,
            },
          },
          targetLanguage: {
            connect: {
              id: selectedLanguage,
            },
          },
          level: selectedLevel,
        },
      });

      if (result?.id) {
        toast.success("Course created successfully!");
        router.push(`/course/${result.id}`);
      }
    } catch (error) {
      console.error("Course creation error:", error);
      toast.error("Failed to create course");
    }
  };

  if (isLoading || !languages) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Language Courses
        </h1>
        <p className="text-muted-foreground mt-2">
          Select a language you want to learn
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {languages.map((lang) => (
          <Button
            key={lang.id}
            onClick={() => setSelectedLanguage(lang.id)}
            className={`py-8 group relative overflow-hidden transition-all duration-300 hover:shadow-lg h-fit ${
              selectedLanguage === lang.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-slate-50"
            }`}
            variant="outline"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="flex flex-col items-center text-center">
              <span className="mb-4 text-7xl">
                <Twemoji emoji={lang.code} className="w-16" />
              </span>
              <span className="text-lg font-bold">{lang.name}</span>
            </div>
          </Button>
        ))}
      </div>

      {selectedLanguage && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Choose Your Level</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {levels.map((level) => (
              <Button
                key={level.code}
                onClick={() => setSelectedLevel(level.code)}
                className={`h-auto py-4 ${
                  selectedLevel === level.code
                    ? "bg-primary text-primary-foreground"
                    : ""
                }`}
                variant="outline"
              >
                <div className="flex flex-col items-center gap-2">
                  <Twemoji emoji={level.emoji} />
                  <span className="font-medium">{level.name}</span>
                  <span className="text-xs opacity-70">{level.code}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {selectedLanguage && selectedLevel && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Select Your Language</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {languages.map((lang) => (
              <Button
                key={lang.id}
                onClick={() => handleCreateCourse(lang.id)}
                variant="outline"
                className="py-4 flex items-center gap-3"
              >
                <Twemoji emoji={lang.code} />
                <span>I speak {lang.name}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
