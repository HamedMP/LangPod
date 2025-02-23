// "use client";

// import { Button } from "@/components/ui/button";
// import { Slider } from "@/components/ui/slider";
// import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
// import { useQuery } from "@tanstack/react-query";
// import { createLesson, AudioSegment } from "@/lib/api/lesson";
// import { useEffect, useRef, useState } from "react";
// import { ScrollArea } from "@/components/ui/scroll-area";

// // this looks ait with full-width too, if u set min-w-fit on parent
// // I will fix this when the endpoint loads faster
// export const PodTab = () => {
//   const audioRef = useRef<HTMLAudioElement | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
//   const [segmentStartTimes, setSegmentStartTimes] = useState<number[]>([]);

//   const lessonQuery = useQuery({
//     queryKey: ["lesson"],
//     queryFn: () => createLesson({
//       topic: "travel",
//       language: "Spanish",
//       nativeLanguage: "English",
//       difficulty: "intermediate"
//     }),
//     // Disable automatic refetching
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//     refetchOnReconnect: false,
//   });

//   useEffect(() => {
//     if (lessonQuery.data?.audio) {
//       const audio = new Audio(`data:audio/mp3;base64,${lessonQuery.data.audio}`);
//       audioRef.current = audio;

//       console.log("Audio loaded");

//       // Calculate segment start times based on duration
//       audio.addEventListener("loadedmetadata", () => {
//         const segmentCount = lessonQuery.data.segments.length;
//         const segmentDuration = audio.duration / segmentCount;
//         const startTimes = Array.from({ length: segmentCount }, (_, i) => i * segmentDuration);
//         console.log("Calculated start times:", startTimes);
//         setSegmentStartTimes(startTimes);
//         setDuration(audio.duration);
//       });

//       const handleTimeUpdate = () => {
//         if (!audioRef.current) return;

//         setCurrentTime(audioRef.current.currentTime);

//         console.log({
//           currentTime: audioRef.current.currentTime,
//           duration: audioRef.current.duration,
//           segmentStartTimes,
//           currentSegmentIndex
//         });

//         // Find current segment based on time
//         const currentSegment = segmentStartTimes.findIndex((startTime, index) => {
//           const endTime = index < segmentStartTimes.length - 1
//             ? segmentStartTimes[index + 1]
//             : audioRef.current!.duration;

//           console.log(`Segment ${index}:`, { startTime, endTime, currentTime: audioRef.current!.currentTime });

//           return audioRef.current!.currentTime >= startTime && audioRef.current!.currentTime < endTime;
//         });

//         console.log("Found segment:", currentSegment);

//         // If we're at the end of a segment, move to the next one
//         if (currentSegment === -1 && audioRef.current.currentTime < audioRef.current.duration) {
//           console.log("Between segments, trying to move to next");
//           const nextSegmentIndex = currentSegmentIndex + 1;
//           if (nextSegmentIndex < segmentStartTimes.length) {
//             audioRef.current.currentTime = segmentStartTimes[nextSegmentIndex];
//             setCurrentSegmentIndex(nextSegmentIndex);
//           }
//         } else if (currentSegment !== -1 && currentSegment !== currentSegmentIndex) {
//           console.log("Updating segment index:", currentSegment);
//           setCurrentSegmentIndex(currentSegment);
//         }
//       };

//       const handleEnded = () => {
//         console.log("Audio ended");
//         setIsPlaying(false);
//         setCurrentSegmentIndex(0);
//         audio.currentTime = 0;
//       };

//       audio.addEventListener("timeupdate", handleTimeUpdate);
//       audio.addEventListener("ended", handleEnded);

//       return () => {
//         audio.removeEventListener("timeupdate", handleTimeUpdate);
//         audio.removeEventListener("ended", handleEnded);
//         audio.pause();
//         audio.remove();
//         console.log("Audio cleanup");

//       };
//     }
//   }, [lessonQuery.data, currentSegmentIndex, segmentStartTimes]);

//   const togglePlayPause = () => {
//     if (audioRef.current) {
//       if (isPlaying) {
//         audioRef.current.pause();
//       } else {
//         audioRef.current.play();
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   const skipForward = () => {
//     if (audioRef.current && currentSegmentIndex < (lessonQuery.data?.segments.length || 0) - 1) {
//       const nextSegmentTime = segmentStartTimes[currentSegmentIndex + 1];
//       audioRef.current.currentTime = nextSegmentTime;
//       setCurrentSegmentIndex(currentSegmentIndex + 1);
//     }
//   };

//   const skipBackward = () => {
//     if (audioRef.current && currentSegmentIndex > 0) {
//       const previousSegmentTime = segmentStartTimes[currentSegmentIndex - 1];
//       audioRef.current.currentTime = previousSegmentTime;
//       setCurrentSegmentIndex(currentSegmentIndex - 1);
//     }
//   };

//   const handleSliderChange = (value: number[]) => {
//     if (audioRef.current && duration) {
//       const newTime = (value[0] / 100) * duration;
//       audioRef.current.currentTime = newTime;
//     }
//   };

//   if (lessonQuery.isLoading) {
//     return <div className="flex items-center justify-center h-full">Loading...</div>;
//   }

//   if (lessonQuery.isError) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         Error loading lesson: {(lessonQuery.error as Error)?.message}
//       </div>
//     );
//   }

//   const formatTime = (seconds: number) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = Math.floor(seconds % 60);
//     return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <ScrollArea className="flex-1 p-8 bg-muted/50 rounded-lg max-h-96">
//         {lessonQuery.data?.segments.map((segment: AudioSegment, index: number) => (
//           <p
//             key={index}
//             className={`text-4xl font-semibold text-center leading-relaxed mb-4 transition-colors duration-200 ${
//               currentSegmentIndex === index
//                 ? "text-primary"
//                 : "text-foreground/80"
//             }`}
//           >
//             {segment.text}
//           </p>
//         ))}
//       </ScrollArea>

//       <div className="border-t bg-background p-6 mt-3">
//         <div className="mx-auto max-w-3xl space-y-4">
//           <div className="flex items-center gap-2">
//             <span className="text-sm font-medium text-muted-foreground">
//               {formatTime(currentTime)}
//             </span>
//             <Slider
//               value={[duration ? (currentTime / duration) * 100 : 0]}
//               max={100}
//               step={1}
//               className="flex-1"
//               onValueChange={handleSliderChange}
//             />
//             <span className="text-sm font-medium text-muted-foreground">
//               {formatTime(duration)}
//             </span>
//           </div>

//           <div className="flex items-center justify-center gap-6">
//             <Button variant="ghost" size="icon" onClick={skipBackward}>
//               <SkipBack className="h-5 w-5" />
//             </Button>
//             <Button size="icon" variant="default" onClick={togglePlayPause}>
//               {isPlaying ? (
//                 <Pause className="h-5 w-5" />
//               ) : (
//                 <Play className="h-5 w-5" />
//               )}
//             </Button>
//             <Button variant="ghost" size="icon" onClick={skipForward}>
//               <SkipForward className="h-5 w-5" />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
