import { generateSystemPrompt } from "./system-prompt";
import { VoiceGenerator } from "./voice-generator";
import { concatenateAudio } from "./audio-utils";
import { ElevenLabsVoiceProvider } from "@/lib/voice-providers";
import { OpenAIProvider } from "@/lib/ai-providers";
import { env } from "@/env.mjs";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { topic, language, nativeLanguage, difficulty } = body;

    // Validate required fields
    if (!topic || !language || !nativeLanguage || !difficulty) {
      return new Response(JSON.stringify({ 
        error: "Missing required fields" 
      }), { 
        status: 400 
      });
    }

    // Generate system prompt
    const systemPrompt = generateSystemPrompt({
      language,
      nativeLanguage,
      topic,
      difficulty,
    });

    // Initialize AI provider
    const aiProvider = new OpenAIProvider(env.OPENAI_API_KEY);

    // Call OpenAI API with error handling
    const content = await aiProvider.generateCompletion([
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `Create a conversation about ${topic} following the format specified.`,
      },
    ]).catch((error) => {
      // Log the specific error for debugging
      console.error("OpenAI API Error:", error);
      throw new Error(`OpenAI API error: ${error.message}`);
    });

    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    // Initialize voice generator with ElevenLabs provider
    const voiceProvider = new ElevenLabsVoiceProvider(env.ELEVENLABS_API_KEY);
    const voiceGenerator = new VoiceGenerator(voiceProvider);

    // Generate audio segments
    const audioSegments = await voiceGenerator.generateAudioSegments(content);

    // Concatenate all audio segments into one buffer
    const combinedAudio = await concatenateAudio(audioSegments.map(segment => 
      Buffer.from(segment.audio, "base64")
    ));

    return new Response(JSON.stringify({
      conversation: content,
      audio: combinedAudio.toString("base64"),
      segments: audioSegments.map(({ text, voice }) => ({ text, voice }))
    }), {
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error("Error generating lesson:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to generate lesson",
      details: error instanceof Error ? error.message : "Unknown error"
    }), { 
      status: 500 
    });
  }
}
