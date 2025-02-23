import { config } from 'dotenv';
import fs from 'fs';

// Load .env.local file
config({ path: '.env.local' });

async function test() {
  // Mock request body with custom voice IDs
  const mockBody = {
    topic: "ordering food",
    language: "chinese",
    nativeLanguage: "english",
    difficulty: "beginner",
    // Add custom voice mapping
    voiceMap: {
      "Voice1": "LcfcDJNUP1GQjkzn1xUU", // Example ElevenLabs voice ID
      "Voice2": "jBpfuIE2acCO8z3wKNLl", // Example ElevenLabs voice ID
      "Voice3": "MF3mGyEYCl7XYWbV9V6O"  // Example ElevenLabs voice ID
    }
  };

  // Create a mock Request object
  const request = new Request('http://localhost:3000/api/lesson', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mockBody),
  });

  // Import route handler dynamically to avoid Next.js build issues
  const { POST } = await import('../route');
  
  // Call the route handler
  const response = await POST(request);
  const data = await response.json();

  // Save the complete response
  fs.writeFileSync('test-response.json', JSON.stringify(data, null, 2));
  
  // Save the combined audio file
  if (data.audio) {
    const audioBuffer = Buffer.from(data.audio, 'base64');
    fs.writeFileSync('test-route-audio.mp3', audioBuffer);
    console.log('Saved combined audio to test-route-audio.mp3');
  }

  console.log('Response saved to test-response.json');
  console.log('Conversation:', data.conversation?.slice(0, 100) + '...');
}

test().catch(console.error); 