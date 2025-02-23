"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Twemoji from "@/components/common/Twemoji";
import { Button } from "@/components/ui/button";

const languages = [
  {
    name: "Spanish",
    flag: "🇪🇸",
  },
  {
    name: "Japanese",
    flag: "🇯🇵",
  },
  {
    name: "Chinese",
    flag: "🇨🇳",
  },
];

const nativeLanguages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "sv", name: "Swedish", flag: "🇸🇪" },
];

const Index = () => {
  const [spokenLanguage, setSpokenLanguage] = useState("en");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const handleLanguageSelect = (language: string) => {
    setSelectedCourse(language);
    console.log(`Starting ${language} course for ${spokenLanguage} speaker`);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Language Courses
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">I speak:</span>
          <Select
            value={spokenLanguage}
            onValueChange={(value) => setSpokenLanguage(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {nativeLanguages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <div className="flex items-center gap-2">
                    <span>
                      <Twemoji emoji={lang.flag} />
                    </span>
                    <span>{lang.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {languages.map((lang) => (
          <Button
            key={lang.name}
            onClick={() => handleLanguageSelect(lang.name)}
            className="py-8 group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:bg-slate-50 h-fit"
            variant="outline"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="flex flex-col items-center text-center">
              <span className="mb-4 text-7xl">
                <Twemoji emoji={lang.flag} className="w-16" />
              </span>
              <span className="text-lg font-bold text-foreground/70">
                {lang.name}
              </span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Index;
