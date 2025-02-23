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
  private voiceMap: Record<string, string> = {
    "Voice1": "9BWtsMINqrJLrRacOk9x",
    "Voice2": "CwhRBWXzGAHq8TQ4Fs17",
  };

  constructor(private voiceProvider: VoiceProvider) {}

  async generateAudioSegments(conversation: string): Promise<AudioSegment[]> {
    const segments: AudioSegment[] = [];
    
    // Updated regex to match voice tags and pause tags only (removing music tags)
    const pattern = /<(?:(\w+)\s+Voice="(Voice\d+)">([\s\S]*?)<\/\1|Pause\s+Duration="(\d*\.?\d+)"\/?>)/g;
    let match;

    while ((match = pattern.exec(conversation)) !== null) {
      if (match[4]) { // Pause segment
        console.log("Processing pause segment");
        const duration = parseFloat(match[4]);
        const silenceAudio = await this.voiceProvider.generateSilence(duration);
        segments.push({
          text: "",
          audio: silenceAudio,
          voice: "",
          isPause: true,
          duration
        });
      } else { // Voice segment
        console.log("Processing voice segment:", match[3]?.slice(0, 50));
        const [_, persona, voice, text] = match;
        try {
          const audio = await this.voiceProvider.generateAudio(text, this.voiceMap[voice]);
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