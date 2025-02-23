import { prisma as db } from "@/db/client";

const languages = [
  { name: "English", code: "en" },
  { name: "Spanish", code: "es" },
  { name: "Chinese", code: "zh" },
  { name: "Swedish", code: "sv" },
  { name: "Russian", code: "ru" },
  { name: "Finnish", code: "fi" },
  { name: "French", code: "fr" },
  { name: "German", code: "de" },
  { name: "Dutch", code: "nl" },
  { name: "Japanese", code: "ja" },
  { name: "Arabic", code: "ar" },
  { name: "Portuguese", code: "pt" },
] as const;

async function seedLanguages() {
  console.log("Seeding languages...");

  try {
    for (const language of languages) {
      // First try to find existing language
      const existingLanguage = await db.language.findUnique({
        where: { code: language.code },
      });

      if (existingLanguage) {
        // Update if exists
        await db.language.update({
          where: { id: existingLanguage.id },
          data: { name: language.name },
        });
      } else {
        // Create if doesn't exist
        await db.language.create({
          data: {
            name: language.name,
            code: language.code,
          },
        });
      }
      console.log(`Language synced: ${language.name} (${language.code})`);
    }

    console.log("Successfully seeded all languages!");
  } catch (error) {
    console.error("Error seeding languages:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Stack trace:", error.stack);
    }
  }
}

// Run the seed
seedLanguages();
