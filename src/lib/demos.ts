import { Sparkles, IceCreamBowl, Navigation, ShoppingBag } from "lucide-react";
import type { ComponentType } from "react";

export type Item = {
  name: string;
  slug: string;
  disabled?: boolean;
  icon?: ComponentType<{ className?: string }>;
  description?: string;
};

export const demos: { name: string; items: Item[] }[] = [
  {
    name: "Recommended lessons",
    items: [
      {
        name: "Ordering food",
        icon: IceCreamBowl,
        slug: "lesson",
        description: "order food in a restaurant.",
      },
      {
        name: "Asking for directions",
        icon: Navigation,
        slug: "lesson2",
        description: "Ask for directions in a foreign city.",
      },
      {
        name: "Shopping",
        icon: ShoppingBag,
        slug: "lesson3",
        description: "Shop for clothes in a foreign country.",
      }
    ],
  },
  {
    name: "Capabilities",
    items: [
      {
        name: "Sound effects",
        icon: Sparkles,
        slug: "sound-effects",
        description: "Turn text into cinematic sound effects.",
      },
      {
        name: "Conversational AI",
        icon: Sparkles,
        slug: "conversation",
        description: "Turn text into cinematic sound effects.",
      },
    ],
  },
];

export function findDemoBySlug(
  slug: string
): (Item & { category: string }) | undefined {
  for (const section of demos) {
    const item = section.items.find((item) => item.slug === slug);
    if (item) {
      return { ...item, category: section.name };
    }
  }
  return undefined;
}
