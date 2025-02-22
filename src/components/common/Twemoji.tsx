import React, { FC, memo } from "react";
import twemoji from "twemoji";

const Twemoji: FC<{ emoji: string }> = ({ emoji }) => {
  const moji = twemoji.parse(emoji, {
    base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/",
    size: 72,
  });

  return (
    <span
      className="w-6 flex"
      dangerouslySetInnerHTML={{ __html: moji }}
    ></span>
  );
};

export default memo(Twemoji);
