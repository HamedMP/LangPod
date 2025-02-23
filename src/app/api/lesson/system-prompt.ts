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
  difficulty: "beginner" | "intermediate" | "advanced" | "business/professional";
}) {

  // Define speech rate settings based on difficulty level
  const speechSettings = (() => {
    switch (difficulty) {
      case "beginner":
        return {
          stability: 0.85,      // More stable, clearer speech
          similarity: 0.85      // More consistent voice
        };
      case "intermediate":
        return {
          stability: 0.75,      // Moderate speech rate
          similarity: 0.75      // Balanced voice consistency
        };
      case "advanced":
        return {
          stability: 0.65,      // Faster, more natural speech
          similarity: 0.65      // More variation in voice
        };
      case "business/professional":
        return {
          stability: 0.70,      // Slightly faster than intermediate
          similarity: 0.70      // Professional tone
        };
      default:
        return {
          stability: 0.85,      // Default to beginner settings
          similarity: 0.85
        };
    }
  })();

  // Define dynamic pause durations based on the difficulty level.
  // For example, higher difficulty levels will have shorter pauses to help learners process information.
  const mainPause = (() => {
    switch (difficulty) {
      case "beginner":
        return "2";           // 2 seconds pause for beginner level
      case "intermediate":
        return "1.5";         // 1.5 seconds pause for intermediate level
      case "advanced":
        return "1";           // 1 second pause for advanced level
      case "business/professional":
        return "1.5";         // 1.5 seconds pause for business/professional level
      default:
        return "2";           // default fallback
    }
  })();

  // Define a shorter pause duration used within dialogue exchanges.
  // Typically set to about half of the main pause.
  const dialoguePause = (() => {
    switch (difficulty) {
      case "beginner":
        return "1";           // 1 second pause for beginner level
      case "intermediate":
        return "0.75";        // 0.75 seconds pause for intermediate level
      case "advanced":
        return "0.5";         // 0.5 second pause for advanced level
      case "business/professional":
        return "0.75";        // 0.75 seconds pause for business/professional level
      default:
        return "1";           // default fallback
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
5. The main conversation should be shorter based on the difficulty level:
   - Beginner: 4-6 exchanges
   - Intermediate: 6-8 exchanges
   - Advanced: 8-10 exchanges
   - Business/Professional: 8-10 exchanges with specialized vocabulary

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
- Beginner: Simple greetings, basic needs, everyday objects, simple present tense
- Intermediate: Past tense, future plans, opinions, descriptions, common idioms
- Advanced: Hypotheticals, complex opinions, idioms, cultural nuances, professional scenarios
- Business/Professional: Field-specific terminology, formal language, negotiations, presentations
`,
    speechSettings
  };
}


