import { cn } from "@/lib/utils";
import React, { FC, memo } from "react";
import twemoji from "twemoji";

interface TwemojiProps {
  emoji: string;
  className?: string;
}

export default function Twemoji({ emoji, className = "" }: TwemojiProps) {
  const moji = twemoji.parse(emoji, {
    base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/",
    size: 72,
  });

  return (
    <span
      className={cn("w-6 flex", className)}
      dangerouslySetInnerHTML={{ __html: moji }}
    ></span>
  );
}
