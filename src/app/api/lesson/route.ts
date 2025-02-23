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

    // Initialize AI provider without passing the API key
    const aiProvider = new OpenAIProvider();

    // First LLM call: Generate the conversation content.
    let content = await aiProvider.generateCompletion([
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

      // Second LLM call to generate translations.
      const translationResponse = await aiProvider
        .generateCompletion([
          { role: "system", content: "You are a translation assistant." },
          { role: "user", content: translationPrompt },
        ])
        .catch((error) => {
          console.error("Translation LLM Error:", error);
          // Fallback JSON if the translation call fails.
          return `{"first": "Dialogue, first time", "second": "Dialogue, second time", "third": "Dialogue, third time"}`;
        });

      // Parse the JSON response.
      let translations;
      try {
        translations = JSON.parse(translationResponse || "");
      } catch (e) {
        console.error("Error parsing translation response, using default labels", e);
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

    // Initialize voice generator with ElevenLabs provider
    const voiceProvider = new ElevenLabsVoiceProvider(env.ELEVENLABS_API_KEY);
    const voiceGenerator = new VoiceGenerator(voiceProvider);

    // Generate audio segments for the final content.
    const audioSegments = await voiceGenerator.generateAudioSegments(finalContent);

    // Concatenate all audio segments into one buffer
    const combinedAudio = await concatenateAudio(audioSegments.map(segment => 
      Buffer.from(segment.audio, "base64")
    ));

    return new Response(JSON.stringify({
      conversation: finalContent,
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
