import { VoiceProvider } from "@/lib/voice-providers";

interface AudioSegment {
  text: string;
  audio: string; // base64 encoded audio
  voice: string;
  isPause?: boolean;
  duration?: number;
  isMusic?: boolean;
}

export class VoiceGenerator {
  // Default voice mapping
  private static defaultVoiceMap: Record<string, string> = {
    "Voice1": "9BWtsMINqrJLrRacOk9x",
    "Voice2": "CwhRBWXzGAHq8TQ4Fs17",
    "Voice3": "XB0fDUnXU5powFXDhCwa",
  };

  private voiceMap: Record<string, string>;

  constructor(
    private voiceProvider: VoiceProvider,
    private speechSettings?: {
      stability: number;
      similarity: number;
    },
    voiceMap?: Record<string, string>
  ) {
    // Use provided voice map or fall back to defaults
    this.voiceMap = voiceMap || VoiceGenerator.defaultVoiceMap;
  }

  async generateAudioSegments(conversation: string): Promise<AudioSegment[]> {
    const segments: AudioSegment[] = [];
    
    // Updated regex to match voice tags (including the new Dialogue tag) and pause tags.
    const pattern = /<(?:(\w+)\s+Voice="(Voice\d+)">([\s\S]*?)<\/\1|Pause\s+Duration="(\d*\.?\d+)"\/?>)/g;
    let match;

    while ((match = pattern.exec(conversation)) !== null) {
      if (match[4]) { // Pause segment detected
        console.log("Processing pause segment");
        const duration = parseFloat(match[4]);
        // Request silence audio using the voice provider.
        const silenceAudio = await this.voiceProvider.generateSilence(duration);
        segments.push({
          text: "",
          audio: silenceAudio,
          voice: "",
          isPause: true,
          duration
        });
      } else { // Voice segment detected
        console.log("Processing voice segment:", match[3]?.slice(0, 50));
        const [_, persona, voice, text] = match;
        try {
          // Pass speech settings to voice provider
          const audio = await this.voiceProvider.generateAudio(
            text, 
            this.voiceMap[voice],
            this.speechSettings
          );
          segments.push({
            text,
            audio,
            voice,
            isPause: false
          });
        } catch (error) {
          console.error(`Failed to generate audio for segment: ${text}`, error);
        }
      }
    }

    console.log(`Generated ${segments.length} audio segments`);
    return segments;
  }
} 