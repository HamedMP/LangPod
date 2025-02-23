# LangPod - Schema Structure & Routing

## Database Schema Overview

The database schema has been restructured to support a more flexible and scalable language learning platform. Here's a detailed breakdown of each model and its purpose:

### User Model

- Represents both students and tutors (users can be both)
- Core fields:
  - id: Unique identifier
  - clerkId: Authentication ID from Clerk
  - createdAt: Timestamp
- Relations:
  - studentCourses: Courses where user is a student
  - tutorCourses: Courses where user is a tutor
  - lessons: User-generated lessons
  - progress: Learning progress records

### Course Model

- Represents a language learning course
- Core fields:
  - nativeLanguage: Language used for explanations
  - targetLanguage: Language being learned
  - level: Proficiency level (A1-C2)
  - createdAt: Timestamp
- Relations:
  - student: User taking the course
  - tutor: Optional tutor assigned to the course
  - lessons: Course lessons

### Lesson Model

- Represents individual learning sessions
- Core fields:
  - title: Lesson title
  - type: 'catalog' or 'user_generated'
  - scenarioContext: Learning context
  - difficultyLevel: Lesson difficulty
  - conversationText: For user-generated content
  - audioUrl: For user-generated content
  - createdAt: Timestamp
- Relations:
  - course: Parent course
  - catalogLesson: Reference to catalog lesson (if type is 'catalog')
  - user: Lesson creator
  - progress: Learning progress records

### LessonCatalog Model

- Stores pre-defined lesson templates
- Core fields:
  - nativeLanguage: Explanation language
  - targetLanguage: Language being taught
  - content: JSON structure containing:
    ```typescript
    {
      lessons: [
        {
          index: number,
          title: string,
          description: string,
          text: string,
          audioUrl: string,
          imageUrl: string,
          difficulty: string,
        },
      ];
    }
    ```
- Relations:
  - lessons: Instances of catalog lessons

### Progress Model

- Tracks user progress in lessons
- Core fields:
  - completionStatus: Progress status
  - timeSpent: Time spent in seconds
  - createdAt: Timestamp
- Relations:
  - user: User making progress
  - lesson: Related lesson

## Routing Structure

### Main Routes

1. Home Page (`/`)

   - Default landing page
   - If user has no courses:
     - Shows language selection interface
     - Allows selection of:
       - Native language
       - Target language
       - Difficulty level (optional)
   - If user has courses:
     - Redirects to default course page

2. Course Page (`/course/[courseId]`)
   - Shows course lessons
   - Displays:
     - Lesson list
     - Progress tracking
     - Learning statistics
   - Default route after course creation

### Additional Routes

3. Lesson Page (`/course/[courseId]/lesson/[lessonId]`)

   - Individual lesson interface
   - Shows:
     - Lesson content
     - Audio player
     - Progress tracking

4. Profile Page (`/profile`)

   - User profile management
   - Course management
   - Progress overview

5. Catalog Page (`/catalog`)
   - Browse pre-defined lessons
   - Filter by:
     - Language pairs
     - Difficulty levels
     - Topics

## Key Changes from Original Schema

1. Removed from User model:

   - targetLanguage
   - proficiencyLevel
   - learningGoals
   - vocabulary

2. Added Course model to handle:

   - Language pairs
   - Proficiency levels
   - Student-tutor relationships

3. Enhanced Lesson model with:

   - Type differentiation (catalog vs. user-generated)
   - Direct course relationship
   - Catalog lesson reference

4. Added LessonCatalog model for:
   - Pre-defined content management
   - Structured lesson templates
   - Multi-difficulty support

These changes provide:

- Better separation of concerns
- More flexible user roles
- Improved content management
- Scalable lesson organization
- Clear progression tracking
