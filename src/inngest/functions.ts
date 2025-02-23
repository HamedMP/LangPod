import { inngest } from "./client";
import { prisma as db } from "@/db/client";
import { put, PutBlobResult } from "@vercel/blob";

interface LessonResponse {
  conversation: string;
  audioUrls: string[];
  segments: Array<{ text: string; voice: string }>;
}

export const generateLesson = inngest.createFunction(
  { id: "generate-lesson" },
  { event: "lesson.generate" },
  async ({ event, step }) => {
    const { lessonId, ...lessonParams } = event.data;

    // Generate lesson content
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : process.env.APP_URL
        : "http://localhost:3000";

    const response = await step.run("generate-content", async () => {
      const res = await fetch(`${baseUrl}/api/lesson`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lessonParams),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("API Error Response:", errorData);
        throw new Error(
          `API request failed: ${res.statusText}\nDetails: ${JSON.stringify(errorData, null, 2)}`
        );
      }

      return res.json() as Promise<LessonResponse>;
    });

    // Upload audio segments to blob storage in parallel
    const audioBlobs = await step.run("upload-audio-segments", async () => {
      console.log(
        `Attempting to process ${response.audioUrls.length} audio URLs`
      );

      const uploadPromises: Promise<PutBlobResult>[] = response.audioUrls.map(
        async (url, index) => {
          console.log(`Fetching audio segment ${index} from ${url}`);
          const audioRes = await fetch(url);

          if (!audioRes.ok || !audioRes.body) {
            throw new Error(
              `Failed to fetch audio segment ${index} from ${url}: ${audioRes.statusText}`
            );
          }

          const blobPath = `lessons/${lessonId}/segment-${index}.mp3`;
          console.log(`Uploading to blob storage: ${blobPath}`);

          return put(blobPath, audioRes.body, {
            access: "public",
            contentType: "audio/mpeg",
            addRandomSuffix: false,
          });
        }
      );

      return Promise.all(uploadPromises);
    });

    // Update lesson in database with all audio URLs
    await step.run("update-lesson", async () => {
      console.log("Updating lesson in database", {
        lessonId,
        audioUrlsCount: audioBlobs.length,
        segmentsCount: response.segments.length,
      });

      await db.lesson.update({
        where: { id: lessonId },
        data: {
          lessonJson: response.conversation,
          audioUrls: audioBlobs.map((blob) => blob.url),
          segments: response.segments,
        },
      });
    });

    return { success: true };
  }
);

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);
