# LangPod - Product Requirements Document

## Product Overview

LangPod is an AI-powered language learning platform that creates personalized, scenario-based lessons using ElevenLabs' voice technology. The platform generates dynamic, contextual learning experiences tailored to each user's interests, proficiency level, and learning goals.

## Technical Stack

- Frontend: Next.js deployed on Vercel
- Authentication: Clerk
- Analytics: PostHog
- Database: Neon (PostgreSQL)
- Voice Generation: ElevenLabs API

## Core Features for MVP (Hackathon Version)

### 1. User Authentication & Onboarding

- Implement Clerk for user authentication
- Required user information:
  - Target language
  - Current proficiency level (A1-C2)
  - Learning goals (casual, business, academic)
  - Preferred topics/scenarios

### 2. Lesson Generation System

- Generate conversation scenarios using structured prompts
- Components:
  - Scenario context
  - Character roles (student + AI tutor)
  - Conversation script
  - Key vocabulary
  - Grammar points
- Store generated content in Neon DB

### 3. Voice Interaction System

- Integration with ElevenLabs API
- Features:
  - Dynamic voice generation for AI responses
  - Multiple character voices for role-play
  - Voice speed control
  - Conversation playback

### 4. Progress Tracking

- PostHog integration for:
  - User engagement metrics
  - Lesson completion rates
  - Time spent per lesson
  - Feature usage analytics
- Store user progress in Neon DB:
  - Completed lessons
  - Vocabulary mastered
  - Time spent learning
  - Proficiency improvements

## Database Schema (ZenStack)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

plugin guard {
  provider = "guard"
}

model User {
  id              String    @id @default(uuid())
  clerkId         String    @unique
  targetLanguage  String
  proficiencyLevel String
  learningGoals   String[]
  createdAt       DateTime  @default(now())

  // Relations
  progress        Progress[]
  vocabulary      Vocabulary[]
  lessons         Lesson[]

  // Access policies
  @@allow('read,create', true)
  @@allow('update,delete', auth() == this)
}

model Lesson {
  id               String    @id @default(uuid())
  title            String
  scenarioContext  String
  difficultyLevel  String
  conversationScript Json
  vocabulary       Json
  grammarPoints    Json?
  createdAt        DateTime  @default(now())

  // Relations
  user             User      @relation(fields: [userId], references: [id])
  userId           String
  progress         Progress[]

  // Access policies
  @@allow('read', true)
  @@allow('create,update,delete', auth() == user)
}

model Progress {
  id               String    @id @default(uuid())
  completionStatus String
  timeSpent        Int      // in seconds
  createdAt        DateTime  @default(now())

  // Relations
  user             User      @relation(fields: [userId], references: [id])
  userId           String
  lesson           Lesson    @relation(fields: [lessonId], references: [id])
  lessonId         String

  // Access policies
  @@allow('read,create,update,delete', auth() == user)
}

model Vocabulary {
  id               String    @id @default(uuid())
  word             String
  translation      String
  masteryLevel     Int      @default(0)
  lastReviewed     DateTime?

  // Relations
  user             User      @relation(fields: [userId], references: [id])
  userId           String

  // Access policies
  @@allow('read,create,update,delete', auth() == user)
}
```

## API Endpoints

### Authentication (Clerk)

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout

### Lessons

- POST /api/lessons/generate
  - Generates new lesson based on user preferences
- GET /api/lessons/{id}
  - Retrieves specific lesson
- GET /api/lessons/user/{userId}
  - Lists user's lessons
- POST /api/lessons/{id}/complete
  - Marks lesson as complete

### Voice Generation (ElevenLabs)

- POST /api/voice/generate
  - Generates voice for conversation parts
- POST /api/voice/stream
  - Streams voice response

### Progress Tracking

- GET /api/progress/{userId}
  - Retrieves user progress
- POST /api/progress/update
  - Updates progress metrics

## Frontend Components

### Pages

1. Landing Page

   - Features overview
   - Login/Register buttons
   - Demo section

2. Dashboard

   - Progress overview
   - Lesson recommendations
   - Quick start section

3. Lesson Interface
   - Scenario context display
   - Interactive conversation area
   - Voice playback controls
   - Progress indicators

### Components

1. LessonCard

   - Display lesson preview
   - Progress indicator
   - Difficulty badge
   - Time estimate

2. VoicePlayer

   - Play/pause controls
   - Speed adjustment
   - Replay button
   - Voice selection

3. ProgressChart
   - Learning streak
   - Completion rates
   - Time spent learning
   - Level progress

## Analytics Implementation (PostHog)

### Event Tracking

```javascript
// User events
posthog.capture('user_registered', {
    target_language: string,
    proficiency_level: string,
    learning_goals: string[]
});

// Lesson events
posthog.capture('lesson_started', {
    lesson_id: string,
    difficulty_level: string,
    scenario_type: string
});

posthog.capture('lesson_completed', {
    lesson_id: string,
    time_spent: number,
    accuracy_rate: number
});

// Voice interaction events
posthog.capture('voice_generated', {
    lesson_id: string,
    character_id: string,
    duration: number
});
```

### Metrics to Track

1. Engagement

   - Daily active users
   - Average session duration
   - Lessons completed per user
   - Return rate

2. Performance

   - Voice generation latency
   - Lesson completion rates
   - Error rates in voice generation
   - API response times

3. Learning Progress
   - Time to level completion
   - Vocabulary acquisition rate
   - Grammar improvement metrics
   - Speaking confidence scores

## Development Phases

### Phase 1 (Day 1 Morning)

- Set up Next.js project with Vercel deployment
- Configure Clerk authentication
- Initialize Neon database
- Set up PostHog tracking

### Phase 2 (Day 1 Afternoon)

- Implement core database schema
- Create basic lesson generation system
- Set up ElevenLabs API integration
- Develop basic frontend components

### Phase 3 (Day 2 Morning)

- Implement voice interaction system
- Create progress tracking system
- Develop user dashboard
- Implement analytics events

### Phase 4 (Day 2 Afternoon)

- Polish UI/UX
- Add final features
- Conduct testing
- Prepare demo video

## Testing Requirements

- User authentication flow
- Lesson generation pipeline
- Voice synthesis quality
- Progress tracking accuracy
- Analytics event capturing
- Database performance
- API endpoint functionality

## Demo Requirements

1. Working registration/login
2. Lesson generation example
3. Voice interaction demo
4. Progress tracking visualization
5. Analytics dashboard

## Success Metrics

- Functional user authentication
- Successful lesson generation
- Clear voice output
- Accurate progress tracking
- Comprehensive analytics data

## ZenStack Features

### Type Safety

- Automatically generated TypeScript types for all models
- Type-safe database queries
- End-to-end type safety from database to frontend

### Security Policies

- User-level access control
- Row-level security
- Automatic policy enforcement

### API Generation

- Auto-generated CRUD endpoints
- Type-safe API routes
- Built-in validation

### Development Workflow

1. Update schema.zmodel
2. Run ZenStack CLI to generate Prisma schema
3. Generate and apply migrations
4. Use generated types and helpers in the application

## Notes for Engineers

- Prioritize core functionality over feature completeness
- Focus on smooth user experience
- Ensure error handling for API calls
- Maintain clean, documented code
- Use TypeScript for better type safety
- Follow Next.js best practices
- Implement proper error boundaries
- Use environment variables for sensitive data
