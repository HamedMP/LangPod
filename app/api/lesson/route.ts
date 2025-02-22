import {OpenAI } from 'openai';
import { generateSystemPrompt } from './system-prompt';
import { VoiceGenerator } from './voice-generator';
import { concatenateAudio } from './audio-utils';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure to add this to .env.local
});

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { topic, language, nativeLanguage, difficulty } = body;

    // Validate required fields
    if (!topic || !language || !nativeLanguage || !difficulty) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields' 
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

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Use the appropriate model
      max_tokens: 1500,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Create a conversation about ${topic} following the format specified.`,
        },
      ],
    });

    // Initialize voice generator
    const voiceGenerator = new VoiceGenerator();

    // Parse the conversation and generate audio for each part
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }
    const audioSegments = await voiceGenerator.generateAudioSegments(content);

    // Concatenate all audio segments into one buffer
    const combinedAudio = await concatenateAudio(audioSegments.map(segment => 
      Buffer.from(segment.audio, 'base64')
    ));

    return new Response(JSON.stringify({
      conversation: content,
      audio: combinedAudio.toString('base64'),
      segments: audioSegments.map(({ text, voice }) => ({ text, voice }))
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error generating lesson:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate lesson',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500 
    });
  }
}
