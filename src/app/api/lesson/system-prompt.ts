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


  return `

Generate a language learning conversation similar to ChinesePod format, designed for ${difficulty} level non-native speakers learning ${language}. The conversation topic should be ${topic}.

Instructions:

1. Create a podcast-like format with a Tutor and Student discussing a short dialogue.
2. The Tutor-Student discussion should be in ${nativeLanguage} (the learner's native language).
3. ONLY the main conversation between two people should be in ${language} (the target language being learned).
4. The main conversation should be shorter based on the difficulty level:
   - Beginner: 4-6 exchanges
   - Intermediate: 6-8 exchanges
   - Advanced: 8-10 exchanges
   - Business/Professional: 8-10 exchanges with specialized vocabulary

Example Structure:

[Title in ${language}] / [Title in ${nativeLanguage}]

<Tutor Voice="Voice1">Hello friends! This is ${language}Pod coming to you from [location], and today we're going to listen to a conversation about ${topic}. Let's listen to it.</Tutor>

<Pause Duration="1"/>

<CONVERSATION>
<PersonA Voice="Voice1">[Line in ${language}]</PersonA>
<Pause Duration="0.5"/>
<PersonB Voice="Voice2">[Response in ${language}]</PersonB>
<Pause Duration="0.5"/>
[Continue with short dialogue in ${language}...]
</CONVERSATION>

<Pause Duration="1"/>

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
1. [Word/Phrase in ${language}] - [Translation in ${nativeLanguage}] - [Example]
2. [Word/Phrase in ${language}] - [Translation in ${nativeLanguage}] - [Example]
[Continue with 3-5 key vocabulary items]</Tutor>

<Student Voice="Voice2">How would local people typically handle this situation?</Student>

<Tutor Voice="Voice1">[Cultural information about how natives approach the situation]</Tutor>

<Tutor Voice="Voice1">Now, let's practice! Try to [suggested practice activity related to the conversation].</Tutor>

Level Guidelines:
- Beginner: Simple greetings, basic needs, everyday objects, simple present tense
- Intermediate: Past tense, future plans, opinions, descriptions, common idioms
- Advanced: Hypotheticals, complex opinions, idioms, cultural nuances, professional scenarios
- Business/Professional: Field-specific terminology, formal language, negotiations, presentations

Sample Topics:
- Ordering food at a restaurant
- Asking for directions
- Shopping for clothes
- Making an appointment
- Discussing hobbies
- Talking about family
- Weather and seasons
- Travel plans
- Work and office life
- Housing and accommodation`;
}


