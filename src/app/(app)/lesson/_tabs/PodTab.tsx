"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface PodTabProps {
  audioUrls: string[];
  segments: Array<{ text: string; voice: string }>;
}

interface WordWithTiming {
  text: string;
  startTime: number;
  endTime: number;
}

export const PodTab = ({ audioUrls, segments }: PodTabProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [skipAutoPlay, setSkipAutoPlay] = useState(false);
  const [wordTimings, setWordTimings] = useState<WordWithTiming[]>([]);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get speaker name based on voice ID
  const getSpeakerName = (voice: string) => {
    switch (voice) {
      case "Voice1":
        return "Sofia";
      case "Voice2":
        return "Juan";
      case "Voice3":
        return "Teacher";
      default:
        return "Speaker";
    }
  };

  // Calculate word timings based on duration
  const calculateWordTimings = (text: string, totalDuration: number) => {
    const words = text.split(/\s+/);
    const timePerWord = totalDuration / words.length;

    return words.map((word, index) => ({
      text: word,
      startTime: index * timePerWord,
      endTime: (index + 1) * timePerWord,
    }));
  };

  // Get word opacity based on current time
  const getWordOpacity = (word: WordWithTiming, currentTime: number) => {
    if (currentTime < word.startTime) return 0.25;
    if (currentTime > word.endTime) return 1;

    // Transition during the word's time window
    const progress =
      (currentTime - word.startTime) / (word.endTime - word.startTime);
    return 0.25 + progress * 0.75;
  };

  // Add a useEffect to reset skipAutoPlay on mount
  useEffect(() => {
    setSkipAutoPlay(false);
  }, []);

  // Initialize audio when component mounts or segment changes
  useEffect(() => {
    if (audioUrls.length === 0) return;

    const audio = new Audio(audioUrls[currentSegmentIndex]);
    audioRef.current = audio;
    setIsAudioLoaded(false);

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsAudioLoaded(true);

      // Calculate word timings when audio duration is available
      const currentSegmentText = segments[currentSegmentIndex].text;
      setWordTimings(calculateWordTimings(currentSegmentText, audio.duration));

      // Clear any existing timeout
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }

      if (!skipAutoPlay) {
        autoPlayTimeoutRef.current = setTimeout(() => {
          audio.play().catch(console.error);
        }, 1000);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setSkipAutoPlay(false);
      if (currentSegmentIndex < audioUrls.length - 1) {
        setCurrentSegmentIndex((prev) => prev + 1);
      } else {
        setCurrentTime(0);
        audio.currentTime = 0;
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    audio.load();

    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.pause();
      audio.remove();
    };
  }, [audioUrls, currentSegmentIndex, skipAutoPlay, segments]);

  // Handle play/pause
  const togglePlayPause = async () => {
    if (!audioRef.current || !isAudioLoaded) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  // Handle segment navigation
  const skipForward = () => {
    if (currentSegmentIndex < audioUrls.length - 1) {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
      audioRef.current?.pause();
      setSkipAutoPlay(true); // Skip auto-play when using navigation buttons
      setCurrentSegmentIndex((prev) => prev + 1);
      setCurrentTime(0);
    }
  };

  const skipBackward = () => {
    if (currentSegmentIndex > 0) {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
      audioRef.current?.pause();
      setSkipAutoPlay(true); // Skip auto-play when using navigation buttons
      setCurrentSegmentIndex((prev) => prev - 1);
      setCurrentTime(0);
    }
  };

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    if (audioRef.current && duration) {
      const newTime = (value[0] / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (!audioUrls.length || !segments.length) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No audio content available
      </div>
    );
  }

  const currentSegment = segments[currentSegmentIndex];
  const speakerName = getSpeakerName(currentSegment.voice);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col bg-muted/50 rounded-lg overflow-hidden">
        {/* Audio controls - always visible */}
        <div className="border-t bg-background p-6 mt-3">
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[duration ? (currentTime / duration) * 100 : 0]}
                max={100}
                step={1}
                className="flex-1"
                onValueChange={handleSliderChange}
              />
              <span className="text-sm font-medium text-muted-foreground">
                {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center justify-center gap-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={skipBackward}
                disabled={currentSegmentIndex === 0}
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="default"
                onClick={togglePlayPause}
                disabled={!isAudioLoaded}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={skipForward}
                disabled={currentSegmentIndex === audioUrls.length - 1}
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        {/* Header with speaker info - always visible */}
        <div className="flex items-center gap-2 p-4 border-b bg-background/50">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-sm font-medium">{speakerName}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {currentSegmentIndex + 1} of {segments.length}
          </span>
        </div>

        {/* Scrollable transcription area */}
        <ScrollArea className="flex-1 p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-2xl font-medium text-center leading-relaxed break-words">
              {wordTimings.map((word, index) => (
                <span
                  key={index}
                  className="text-foreground"
                  style={{
                    opacity: getWordOpacity(word, currentTime),
                    transition: "opacity 0.2s linear",
                  }}
                >
                  {word.text}
                  {index < wordTimings.length - 1 ? " " : ""}
                </span>
              ))}
            </p>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
