"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  useFindManyLanguage,
  useFindManyUserCourse,
  useCreateUserCourse,
  useFindManyCourse,
} from "@/hooks/zenstack";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Twemoji from "@/components/common/Twemoji";
import { ArrowLeft } from "lucide-react";
import { getCountryCode } from "@/lib/utils";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

const levels = [
  { code: "A1", name: "Beginner", emoji: "🌱" },
  { code: "A2", name: "Elementary", emoji: "🎋" },
  { code: "B1", name: "Intermediate", emoji: "🌿" },
  { code: "B2", name: "Upper Intermediate", emoji: "🌳" },
  { code: "C1", name: "Advanced", emoji: "🌲" },
  { code: "C2", name: "Mastery", emoji: "🎄" },
];

export function LanguageSelector() {
  const router = useRouter();
  const { userId } = useAuth();
  const [step, setStep] = useState(1);
  const [targetLanguage, setTargetLanguage] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState("");
  const [level, setLevel] = useState("");

  const { data: languages, isLoading } = useFindManyLanguage();
  const createUserCourse = useCreateUserCourse();

  const selectedTargetLanguage = languages?.find(
    (l) => l.id === targetLanguage
  );
  const selectedNativeLanguage = languages?.find(
    (l) => l.id === nativeLanguage
  );
  const selectedLevel = levels.find((l) => l.code === level);

  // Get the language codes for constructing the course ID
  const targetLangCode = selectedTargetLanguage?.code;
  const nativeLangCode = languages?.find((l) => l.id === nativeLanguage)?.code;

  // Update the courses query to use the correct ID format
  const { data: courses } = useFindManyCourse({
    where: {
      id:
        nativeLangCode && targetLangCode && level
          ? `${nativeLangCode}-${targetLangCode}-${level}`.toLowerCase()
          : undefined,
    },
  });

  // Check if user already has this course
  const { data: existingUserCourses } = useFindManyUserCourse({
    where: {
      user: {
        clerkId: userId ?? "",
      },
      course: {
        id:
          nativeLangCode && targetLangCode && level
            ? `${nativeLangCode}-${targetLangCode}-${level}`.toLowerCase()
            : undefined,
      },
    },
  });

  const handleLanguageSelect = async (nativeLangId: string) => {
    setNativeLanguage(nativeLangId);

    try {
      if (!userId) {
        toast.error("Please sign in first");
        return;
      }

      if (!targetLanguage || !level) {
        toast.error("Please select target language and level first");
        return;
      }

      const nativeLangCode = languages?.find(
        (l) => l.id === nativeLangId
      )?.code;
      const targetLangCode = selectedTargetLanguage?.code;

      if (!nativeLangCode || !targetLangCode) {
        toast.error("Invalid language selection");
        return;
      }

      const courseId =
        `${nativeLangCode}-${targetLangCode}-${level}`.toLowerCase();

      // Create the user-course relationship
      const userCourse = await createUserCourse.mutateAsync({
        data: {
          user: {
            connect: {
              clerkId: userId,
            },
          },
          course: {
            connect: {
              id: courseId,
            },
          },
          role: "STUDENT",
        },
      });

      if (!userCourse) {
        throw new Error("Failed to create user course relationship");
      }

      toast.success("Course added successfully!");
      router.push(`/course/${userCourse.id}`);
    } catch (error) {
      console.error("Course creation error:", error);
      toast.error("Failed to add course");
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setTargetLanguage("");
      setStep(1);
    } else if (step === 3) {
      setLevel("");
      setStep(2);
    }
  };

  if (isLoading || !languages) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">
          Loading languages...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {step > 1 && selectedTargetLanguage && (
        <div className="mb-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl text-muted-foreground"
          >
            I want to learn{" "}
            <span className="inline-flex items-center gap-1.5 text-foreground font-medium">
              <span className="text-2xl">
                {getUnicodeFlagIcon(
                  getCountryCode(selectedTargetLanguage.code)
                )}
              </span>
              {selectedTargetLanguage.name}
            </span>
            {step > 2 && selectedLevel && (
              <>
                {" "}
                at{" "}
                <span className="inline-flex items-center gap-1.5 text-foreground font-medium">
                  <span>{selectedLevel.emoji}</span>
                  {selectedLevel.code}
                </span>{" "}
                level
              </>
            )}
            {step > 2 && selectedNativeLanguage && (
              <>
                {" "}
                in{" "}
                <span className="inline-flex items-center gap-1.5 text-foreground font-medium">
                  <span className="text-2xl">
                    {getUnicodeFlagIcon(
                      getCountryCode(selectedNativeLanguage.code)
                    )}
                  </span>
                  {selectedNativeLanguage.name}
                </span>
              </>
            )}
          </motion.p>
        </div>
      )}

      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-3">
          {step === 1
            ? "Choose Language to Learn"
            : step === 2
              ? "Select Your Level"
              : "What's Your Native Language?"}
        </h1>
        <p className="text-lg text-muted-foreground">
          {step === 1
            ? "Pick a language you want to master"
            : step === 2
              ? "Choose your starting point"
              : "Select the language you're most comfortable with"}
        </p>
      </div>

      {step > 1 && (
        <Button
          variant="ghost"
          className="absolute top-4 left-4 flex items-center gap-2"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {languages.map((lang) => (
                <Button
                  key={lang.id}
                  onClick={() => {
                    setTargetLanguage(lang.id);
                    setStep(2);
                  }}
                  className={`group relative flex h-32 flex-col items-center justify-center gap-3 p-6 transition-all duration-300 ${
                    targetLanguage === lang.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent/50"
                  }`}
                  variant="outline"
                >
                  <span className="text-3xl">
                    {getUnicodeFlagIcon(getCountryCode(lang.code))}
                  </span>
                  <span className="text-lg font-medium">{lang.name}</span>
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl mx-auto w-full"
          >
            <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
              {levels.map((lvl) => (
                <Button
                  key={lvl.code}
                  onClick={() => {
                    setLevel(lvl.code);
                    setStep(3);
                  }}
                  className={`flex h-32 w-32 flex-col items-center justify-center gap-3 ${
                    level === lvl.code
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent/50"
                  }`}
                  variant="outline"
                >
                  <span className="text-3xl">{lvl.emoji}</span>
                  <div className="text-center">
                    <div className="font-medium">{lvl.code}</div>
                    <div className="text-xs text-muted-foreground">
                      {lvl.name}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {languages.map((lang) => (
                <Button
                  key={lang.id}
                  onClick={() => handleLanguageSelect(lang.id)}
                  className={`group relative flex h-32 flex-col items-center justify-center gap-3 p-6 transition-all duration-300 ${
                    nativeLanguage === lang.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent/50"
                  }`}
                  variant="outline"
                >
                  <span className="text-3xl">
                    {getUnicodeFlagIcon(getCountryCode(lang.code))}
                  </span>
                  <span className="text-lg font-medium">{lang.name}</span>
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
