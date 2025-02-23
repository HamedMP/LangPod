// This function generates a system prompt for language learning conversations in a podcast format
export function generateSystemPrompt({
  language,
  nativeLanguage,
  topic,
  difficulty
}: {
  language: string;
  nativeLanguage: string;
  topic: string;
  difficulty: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
}) {

  // Define speech rate settings based on CEFR level
  const speechSettings = (() => {
    switch (difficulty) {
      case "A1":
        return {
          stability: 0.85,      // Very clear, slow speech
          similarity: 0.85      // Highly consistent voice
        };
      case "A2":
        return {
          stability: 0.80,      // Clear, measured speech
          similarity: 0.80      // Consistent voice
        };
      case "B1":
        return {
          stability: 0.75,      // Moderate speech rate
          similarity: 0.75      // Balanced voice consistency
        };
      case "B2":
        return {
          stability: 0.70,      // Natural speech rate
          similarity: 0.70      // Natural voice variation
        };
      case "C1":
        return {
          stability: 0.65,      // Fast, natural speech
          similarity: 0.65      // More variation in voice
        };
      case "C2":
        return {
          stability: 0.60,      // Native-like speech rate
          similarity: 0.60      // Full voice variation
        };

      default:
        return {
          stability: 0.85,      // Default to A1 settings
          similarity: 0.85
        };
    }
  })();

  // Update pause durations for CEFR levels
  const mainPause = (() => {
    switch (difficulty) {
      case "A1": return "2.5";    // Longest pause for beginners
      case "A2": return "2";
      case "B1": return "1.5";
      case "B2": return "1.25";
      case "C1": return "1";
      case "C2": return "0.75";   // Shortest pause for advanced
      default: return "2.5";
    }
  })();

  // Update dialogue pauses for CEFR levels
  const dialoguePause = (() => {
    switch (difficulty) {
      case "A1": return "1.25";
      case "A2": return "1";
      case "B1": return "0.75";
      case "B2": return "0.6";
      case "C1": return "0.5";
      case "C2": return "0.4";
      default: return "1.25";
    }
  })();

  // Return both the prompt and settings
  return {
    prompt: `
Generate a language learning conversation, designed for ${difficulty} level non-native speakers learning ${language}. The conversation topic should be ${topic}. 
The name of the podcast should be LangPod.

Instructions:

1. Create a podcast-like format with a female Tutor (give her a common female name from ${language}-speaking regions) and a male Student (give him a common male name from ${nativeLanguage}-speaking regions) discussing a short dialogue.
2. Start by having both characters introduce themselves naturally in their respective languages.
3. The Tutor-Student discussion should be in ${nativeLanguage} (the learner's native language).
4. ONLY the main conversation between two people should be in ${language} (the target language being learned).
5. When talking about new vocabulary or phrases in a non-latin language, do not write the pinyin or respective romanization in parentheses.
   DO NOT write like this: "请问您想点什么？(Qǐng wèn nín xiǎng diǎn shénme?)"
   Instead write like this:
   <Tutor Voice="Voice1">请问您想点什么？</Tutor>
   <Tutor Voice="Voice1">This means "What would you like to order?"</Tutor>
5. The main conversation should be shorter based on the CEFR level:
   - A1 (Beginner): 3-4 exchanges with basic phrases
   - A2 (Elementary): 4-6 exchanges
   - B1 (Intermediate): 6-8 exchanges
   - B2 (Upper Intermediate): 8-10 exchanges
   - C1 (Advanced): 10-12 exchanges
   - C2 (Mastery): 12-15 exchanges

Additionally, adjust the pause durations in the conversation to help the listener process the information:
- Use a main pause of ${mainPause} seconds at key breaks.
- Use a shorter pause of ${dialoguePause} seconds between dialogue lines.

The introduction should be in ${nativeLanguage}.

Example Structure:

[Title in ${language}] / [Title in ${nativeLanguage}]
 
<Tutor Voice="Voice1">Hello everyone! My name is [Female name common in ${language}-speaking regions], and welcome to LangPod coming to you from [location]. Today we're going to listen to a conversation about ${topic}. I'll also teach you how to say my name in ${language}. In ${language}, I'm called: [Name in ${language}].</Tutor>

<Student Voice="Voice2">Hi everyone! I'm [Male name common in ${nativeLanguage}-speaking regions], and like you, I'm learning ${language}. I'm excited to learn with you today!</Student>

<Tutor Voice="Voice1">Before we start our conversation in ${language}, let me explain what we'll be learning today. We'll hear a dialogue about ${topic}, and I'll help break down the important phrases and cultural context.</Tutor>

<Pause Duration="${mainPause}"/>

<Tutor Voice="Voice1">Now, let's listen to our conversation in ${language}.</Tutor>

<Dialogue>
  <Pause Duration="${mainPause}"/>
  <PersonA Voice="Voice1">[Line in ${language}]</PersonA>
  <Pause Duration="${dialoguePause}"/>
  <PersonB Voice="Voice2">[Response in ${language}]</PersonB>
  <Pause Duration="${dialoguePause}"/>
  [Continue with short dialogue in ${language}...]
    <Pause Duration="${mainPause}"/>
</Dialogue>

<Pause Duration="${mainPause}"/>

<Tutor Voice="Voice1">This was a useful conversation! What did you find hardest about understanding it?</Tutor>

<Student Voice="Voice2">[Comment about a challenging aspect of the conversation]</Student>

<Tutor Voice="Voice1">[Explanation addressing the student's difficulty]</Tutor>

<Student Voice="Voice2">I noticed they used [specific phrase in ${language}]. What does that mean exactly?</Student>

<Tutor Voice="Voice1">[Explanation of the phrase with translation and cultural context]</Tutor>

<Student Voice="Voice2">How would I use that in a different situation?</Student>

<Tutor Voice="Voice1">[Examples of using the phrase in different contexts, with translations]</Tutor>

<Student Voice="Voice2">What about [grammar point from conversation]?</Student>

<Tutor Voice="Voice1">[Explanation of grammar point with additional examples]</Tutor>

<Student Voice="Voice2">Could you break down some of the key vocabulary?</Student>

<Tutor Voice="Voice1">Sure! Let's look at these important words and phrases:
1. [Word/Phrase in ${language}]
   [Translation in ${nativeLanguage}]
   [Example usage]
2. [Word/Phrase in ${language}]
   [Translation in ${nativeLanguage}]
   [Example usage]
[Continue with 3-5 key vocabulary items]</Tutor>

<Student Voice="Voice2">How would local people typically handle this situation?</Student>

<Tutor Voice="Voice1">[Cultural information about how natives approach the situation]</Tutor>

<Tutor Voice="Voice1">Now, let's practice! Try to [suggested practice activity related to the conversation].</Tutor>

Level Guidelines:
- A1: Basic phrases, greetings, personal information, simple present tense
- A2: Simple past, basic needs, daily routines, simple descriptions
- B1: Past tense, future plans, opinions, feelings, common situations
- B2: Hypotheticals, detailed opinions, some idioms, current events
- C1: Complex topics, abstract ideas, professional contexts, most idioms
- C2: Native-like fluency, nuanced expression, cultural references
`,
    speechSettings
  };
}


