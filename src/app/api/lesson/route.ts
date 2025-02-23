import { generateSystemPrompt } from "./system-prompt";
import { VoiceGenerator } from "./voice-generator";
import { concatenateAudio } from "./audio-utils";
import { ElevenLabsVoiceProvider } from "@/lib/voice-providers";
import { AnthropicProvider } from "@/lib/ai-providers";
import { env } from "@/env.mjs";
import { put } from "@vercel/blob";

interface RequestBody {
  topic: string;
  language: string;
  nativeLanguage: string;
  difficulty: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  voiceMap: Record<string, string>;
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    console.log("Request body:", body);
    const { topic, language, nativeLanguage, difficulty, voiceMap } = body;

    // Validate required fields
    if (!topic || !language || !nativeLanguage || !difficulty) {
      console.error("Missing fields:", {
        topic,
        language,
        nativeLanguage,
        difficulty,
      });
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          received: { topic, language, nativeLanguage, difficulty },
        }),
        { status: 400 }
      );
    }

    // Initialize AI provider
    const aiProvider = new AnthropicProvider();
    console.log("Initialized AI provider");

    // Generate system prompt
    const { prompt, speechSettings } = generateSystemPrompt({
      language,
      nativeLanguage,
      topic,
      difficulty,
    });
    console.log("Generated system prompt");

    // First LLM call: Generate the conversation content
    console.log("Making LLM call...");
    let content;
    try {
      content = await aiProvider.generateCompletion([
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: `Create a conversation about ${topic} following the format specified.`,
        },
      ]);
      console.log("LLM call successful");
    } catch (error) {
      console.error("LLM call failed:", error);
      throw error;
    }

    if (!content) {
      console.error("No content received from Anthropic");
      throw new Error("No content received from Anthropic");
    }

    /////////////////////////////////
    // NEW: Process conversation repetition and dialogue label translation.
    let finalContent = content; // Default to original content.
    // Use regex to extract the <Dialogue> block.
    const dialogueRegex = /<Dialogue>([\s\S]*?)<\/Dialogue>/i;
    const dialogueMatch = dialogueRegex.exec(content);

    if (dialogueMatch) {
      console.log("Extracted dialogue block for repetition.");
      const dialogueContent = dialogueMatch[1]; // Actual dialogue inside tags.
      const dialogueStart = dialogueMatch.index;
      // Correct calculation of the end index of the match.
      const dialogueEnd = dialogueMatch.index + dialogueMatch[0].length;
      // Split the original content into intro and conclusion parts.
      const intro = content.slice(0, dialogueStart);
      const conclusion = content.slice(dialogueEnd);

      // Build a prompt for translation: these phrases will be spoken by a third voice.
      const translationPrompt = `Translate the following phrases into ${nativeLanguage}:
1. "Dialogue, first time"
2. "Dialogue, second time"
3. "Dialogue, third time"
Return them as a JSON object with keys "first", "second", "third".`;

      // Update the translation call to use simpler messages format
      const translationResponse = await aiProvider
        .generateCompletion([
          {
            role: "system",
            content:
              "You are a translation assistant. Respond with valid JSON only.",
          },
          {
            role: "user",
            content: translationPrompt,
          },
        ])
        .catch((error) => {
          console.error("Translation LLM Error:", error);
          return `{"first": "Dialogue, first time", "second": "Dialogue, second time", "third": "Dialogue, third time"}`;
        });

      // Log the translation response for debugging

      // Parse the JSON response.
      let translations;
      try {
        translations = JSON.parse(translationResponse || "");
      } catch (e) {
        console.error(
          "Error parsing translation response, using default labels",
          e
        );
        translations = {
          first: "Dialogue, first time",
          second: "Dialogue, second time",
          third: "Dialogue, third time",
        };
      }

      // Construct the repeated dialogue block with dialogue labels.
      const repeatedDialogue =
        `<Dialogue Voice="Voice3">${translations.first}</Dialogue>\n` +
        `<Dialogue>${dialogueContent}</Dialogue>\n` +
        `<Dialogue Voice="Voice3">${translations.second}</Dialogue>\n` +
        `<Dialogue>${dialogueContent}</Dialogue>\n` +
        `<Dialogue Voice="Voice3">${translations.third}</Dialogue>\n` +
        `<Dialogue>${dialogueContent}</Dialogue>\n`;

      // Reassemble the full content with the repeated dialogue inserted.
      finalContent = intro + repeatedDialogue + conclusion;
    } else {
      console.warn("No <Dialogue> block found; using original content.");
    }
    /////////////////////////////////

    // Initialize voice generator
    console.log("Initializing voice generator...");
    const voiceProvider = new ElevenLabsVoiceProvider({
      apiKey: env.ELEVENLABS_API_KEY,
    });
    const voiceGenerator = new VoiceGenerator(
      voiceProvider,
      speechSettings,
      voiceMap
    );

    // Generate audio segments
    console.log("Generating audio segments...");
    let audioSegments;
    try {
      audioSegments = await voiceGenerator.generateAudioSegments(finalContent);
      console.log(`Generated ${audioSegments.length} audio segments`);
    } catch (error) {
      console.error("Failed to generate audio segments:", error);
      throw error;
    }

    // Upload each audio segment to blob storage
    console.log("Uploading audio segments to blob storage...");
    let audioUrls;
    try {
      audioUrls = await Promise.all(
        audioSegments.map(async (segment, index) => {
          const audioBuffer = Buffer.from(segment.audio, "base64");
          const blob = await put(
            `temp/segment-${index}-${Date.now()}.mp3`,
            audioBuffer,
            {
              access: "public",
              contentType: "audio/mpeg",
              addRandomSuffix: true,
            }
          );
          return blob.url;
        })
      );
      console.log(`Uploaded ${audioUrls.length} audio segments`);
    } catch (error) {
      console.error("Failed to upload audio segments:", error);
      throw error;
    }

    const response = {
      conversation: finalContent,
      audioUrls,
      segments: audioSegments.map(({ text, voice }) => ({ text, voice })),
    };
    console.log("Sending successful response");

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating lesson:", error);
    // Enhanced error response
    return new Response(
      JSON.stringify({
        error: "Failed to generate lesson",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
