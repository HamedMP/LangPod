interface AudioSegment {
  text: string;
  audio: string; // base64 encoded audio
  voice: string;
  isPause?: boolean;
  duration?: number;
  isMusic?: boolean;
}

export class VoiceGenerator {
  private apiKey: string;
  private voiceMap: Record<string, string> = {
    'Voice1': '9BWtsMINqrJLrRacOk9x',
    'Voice2': 'CwhRBWXzGAHq8TQ4Fs17',
  };

  constructor() {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error('ELEVENLABS_API_KEY is not configured in environment');
    }
    this.apiKey = apiKey;
  }

  async generateAudioSegments(conversation: string): Promise<AudioSegment[]> {
    const segments: AudioSegment[] = [];
    
    // Updated regex to match voice tags and pause tags only (removing music tags)
    const pattern = /<(?:(\w+)\s+Voice="(Voice\d+)">([\s\S]*?)<\/\1|Pause\s+Duration="(\d*\.?\d+)"\/?>)/g;
    let match;

    while ((match = pattern.exec(conversation)) !== null) {
      if (match[4]) { // Pause segment
        console.log('Processing pause segment');
        const duration = parseFloat(match[4]);
        const silenceAudio = await this.generateSilence(duration);
        segments.push({
          text: '',
          audio: silenceAudio,
          voice: '',
          isPause: true,
          duration
        });
      } else { // Voice segment
        console.log('Processing voice segment:', match[3]?.slice(0, 50));
        const [_, persona, voice, text] = match;
        try {
          const audio = await this.generateAudio(text, this.voiceMap[voice]);
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

  private async generateSilence(duration: number): Promise<string> {
    const fs = require('fs').promises;
    const path = require('path');
    let silenceBuffer: Buffer;
    try {
      // Attempt to read the pre-generated 1-second silence WAV file
      const silencePath = path.join(process.cwd(), 'public', 'silence.wav');
      silenceBuffer = await fs.readFile(silencePath);
      console.log('Silence template file size:', silenceBuffer.length, 'bytes');
    } catch (err: any) {
      console.error('Error loading silence file:', err);
      return '';
    }
    
    // Determine how many seconds of silence are needed
    const seconds = Math.max(Math.round(duration), 1);
    console.log(`Generating ${seconds} seconds of silence`);
    
    const buffers: Buffer[] = [];
    for (let i = 0; i < seconds; i++) {
      buffers.push(silenceBuffer);
    }
    
    const combinedBuffer = Buffer.concat(buffers);
    console.log('Generated silence size:', combinedBuffer.length, 'bytes');
    return combinedBuffer.toString('base64');
  }

 
  private async generateAudio(text: string, voiceId: string): Promise<string> {
    const cleanedText = text
      .trim()
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .slice(0, 1000);

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/wav',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text: cleanedText,
          model_id: 'eleven_multilingual_v2',
          output_format: 'wav',
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.75,
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn(`Failed to generate audio for text: ${cleanedText.slice(0, 50)}...`, errorData);
        return '';
      }

      const audioBuffer = await response.arrayBuffer();
      return Buffer.from(audioBuffer).toString('base64');
    } catch (error) {
      console.error('Error generating audio:', error);
      return '';
    }
  }
} 