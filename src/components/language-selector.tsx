"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFindManyLanguage, useCreateCourse } from "@/hooks/zenstack";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Twemoji from "@/components/common/Twemoji";
import { ArrowLeft } from "lucide-react";

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

  const { data: languages } = useFindManyLanguage();
  const createCourse = useCreateCourse();

  const handleCreateCourse = async () => {
    try {
      if (!userId || !nativeLanguage || !targetLanguage || !level) {
        toast.error("Please complete all selections");
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
              id: nativeLanguage,
            },
          },
          targetLanguage: {
            connect: {
              id: targetLanguage,
            },
          },
          level,
        },
      });

      if (result?.id) {
        toast.success("Course created successfully!");
        router.push(`/course/${result.id}`);
      }
    } catch (error) {
      toast.error("Failed to create course");
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

  if (!languages) return null;

  return (
    <div className="container max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {step > 1 && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mb-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </motion.button>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-semibold">
                What language do you want to learn?
              </h2>
              <p className="text-xl text-muted-foreground">
                Choose your target language
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {languages.map((lang) => (
                <Button
                  key={lang.id}
                  onClick={() => {
                    setTargetLanguage(lang.id);
                    setStep(2);
                  }}
                  className="py-8 group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:bg-slate-50 h-fit"
                  variant="outline"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="flex flex-col items-center text-center">
                    <span className="mb-4 text-7xl">
                      <Twemoji emoji={lang.code} className="w-16" />
                    </span>
                    <span className="text-lg font-bold text-foreground/70">
                      {lang.name}
                    </span>
                  </div>
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
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-semibold">Choose your level</h2>
              <p className="text-xl text-muted-foreground">
                Select your starting point
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {levels.map((lvl) => (
                <Button
                  key={lvl.code}
                  onClick={() => {
                    setLevel(lvl.code);
                    setStep(3);
                  }}
                  className="py-8 group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:bg-slate-50 h-fit"
                  variant="outline"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="flex flex-col items-center text-center">
                    <span className="mb-4 text-7xl">
                      <Twemoji emoji={lvl.emoji} className="w-16" />
                    </span>
                    <span className="text-lg font-bold text-foreground/70">
                      {lvl.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {lvl.code}
                    </span>
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
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-semibold">
                What's your native language?
              </h2>
              <p className="text-xl text-muted-foreground">
                Select the language you speak
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {languages.map((lang) => (
                <Button
                  key={lang.id}
                  onClick={() => {
                    setNativeLanguage(lang.id);
                    handleCreateCourse();
                  }}
                  className="py-8 group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:bg-slate-50 h-fit"
                  variant="outline"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="flex flex-col items-center text-center">
                    <span className="mb-4 text-7xl">
                      <Twemoji emoji={lang.code} className="w-16" />
                    </span>
                    <span className="text-lg font-bold text-foreground/70">
                      {lang.name}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
