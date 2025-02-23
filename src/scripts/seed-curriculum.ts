import { prisma as db } from "@/db/client";
import curriculum from "@/db/curriculum.json";
import type { Prisma } from "@prisma/client";

const NATIVE_LANGUAGE_CODES = ["en", "sv", "es", "zh"] as const;
const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

// Set this to true if you want to drop all existing courses and lessons before seeding
const SHOULD_DROP_EXISTING = true;

async function seedCurriculum() {
  console.log("Seeding curriculum...");

  try {
    // Optionally drop existing data
    if (SHOULD_DROP_EXISTING) {
      console.log("Dropping existing lessons and courses...");
      // Delete in correct order due to foreign key constraints
      await db.lesson.deleteMany({});
      await db.userCourse.deleteMany({});
      await db.course.deleteMany({});
      console.log("Existing data dropped.");
    }

    // Get all languages from the database
    const languages = await db.language.findMany();
    const languageMap = new Map(languages.map((lang) => [lang.code, lang]));

    // Prepare data for bulk creation
    const coursesToCreate: Prisma.CourseCreateManyInput[] = [];
    const lessonsToCreate: Prisma.LessonCreateManyInput[] = [];

    // For each target language
    for (const targetLang of languages) {
      // For each native language we want to support
      for (const nativeLangCode of NATIVE_LANGUAGE_CODES) {
        const nativeLang = languageMap.get(nativeLangCode);
        if (!nativeLang) {
          console.log(
            `Skipping native language ${nativeLangCode} - not found in database`
          );
          continue;
        }

        // For each difficulty level
        for (const level of LEVELS) {
          const courseId =
            `${nativeLang.code}-${targetLang.code}-${level}`.toLowerCase();

          // Add course to creation list
          coursesToCreate.push({
            id: courseId,
            nativeLanguageId: nativeLang.id,
            targetLanguageId: targetLang.id,
            level,
          });

          // Get topics for this level and add lessons to creation list
          const levelTopics = curriculum[level]?.topics || [];
          levelTopics.forEach((topic, index) => {
            lessonsToCreate.push({
              id: `${courseId}-${index}`.toLowerCase(),
              title: topic.title,
              type: "catalog",
              scenarioContext: topic.description,
              courseId: courseId,
              progress: "NOT_STARTED",
            });
          });
        }
      }
    }

    // Bulk create all records
    console.log(`Creating ${coursesToCreate.length} courses...`);
    await db.course.createMany({
      data: coursesToCreate,
      skipDuplicates: true,
    });

    console.log(`Creating ${lessonsToCreate.length} lessons...`);
    await db.lesson.createMany({
      data: lessonsToCreate,
      skipDuplicates: true,
    });

    console.log("Successfully seeded curriculum!");
  } catch (error) {
    console.error("Error seeding curriculum:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Stack trace:", error.stack);
    }
  }
}

// Run the seed
seedCurriculum();
