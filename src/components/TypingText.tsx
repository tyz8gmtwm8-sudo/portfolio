"use client";

// 文字を1文字ずつ打ち込んで、消して、次の言葉へ…を繰り返すアニメーション
import { useEffect, useState } from "react";

export default function TypingText({ words }: { words: string[] }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIndex];
    let delay = deleting ? 45 : 90;

    if (!deleting && text === word) delay = 1600; // 打ち終わったら少し待つ

    const timer = setTimeout(() => {
      if (!deleting && text === word) {
        setDeleting(true);
      } else if (deleting && text === "") {
        setDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      } else {
        setText(word.slice(0, text.length + (deleting ? -1 : 1)));
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [text, deleting, wordIndex, words]);

  return (
    <span className="typing">
      {text}
      <span className="caret" aria-hidden="true" />
    </span>
  );
}
