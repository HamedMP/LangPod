// Define an interface for voice providers
export interface VoiceProvider {
  generateAudio(
    text: string, 
    voiceId: string,
    settings?: {
      stability: number;
      similarity: number;
    }
  ): Promise<string>;
  generateSilence(duration: number): Promise<string>;
}

// ElevenLabs Voice Provider
export class ElevenLabsVoiceProvider implements VoiceProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("ElevenLabs API key is required");
    }
    this.apiKey = apiKey;
  }

  async generateAudio(
    text: string, 
    voiceId: string,
    settings?: {
      stability: number;
      similarity: number;
    }
  ): Promise<string> {
    const cleanedText = text
      .trim()
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .slice(0, 1000);

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
          "Accept": "audio/wav",
          "Content-Type": "application/json",
          "xi-api-key": this.apiKey,
        },
        body: JSON.stringify({
          text: cleanedText,
          model_id: "eleven_multilingual_v2",
          output_format: "wav",
          voice_settings: {
            stability: settings?.stability ?? 0.75,
            similarity_boost: settings?.similarity ?? 0.75,
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn(`Failed to generate audio for text: ${cleanedText.slice(0, 50)}...`, errorData);
        return "";
      }

      const audioBuffer = await response.arrayBuffer();
      return Buffer.from(audioBuffer).toString("base64");
    } catch (error) {
      console.error("Error generating audio:", error);
      return "";
    }
  }

  async generateSilence(duration: number): Promise<string> {
    const fs = require("fs").promises;
    const path = require("path");
    let silenceBuffer: Buffer;
    try {
      // Attempt to read the pre-generated 1-second silence WAV file
      const silencePath = path.join(process.cwd(), "public", "silence.wav");
      silenceBuffer = await fs.readFile(silencePath);
      console.log("Silence template file size:", silenceBuffer.length, "bytes");
    } catch (err: any) {
      console.error("Error loading silence file:", err);
      return "";
    }
    
    // Determine how many seconds of silence are needed
    const seconds = Math.max(Math.round(duration), 1);
    console.log(`Generating ${seconds} seconds of silence`);
    
    const buffers: Buffer[] = [];
    for (let i = 0; i < seconds; i++) {
      buffers.push(silenceBuffer);
    }
    
    const combinedBuffer = Buffer.concat(buffers);
    console.log("Generated silence size:", combinedBuffer.length, "bytes");
    return combinedBuffer.toString("base64");
  }
} 