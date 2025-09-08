"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Background } from "@/components/background";

const Typewriter = ({
  texts,
  className,
}: {
  texts: { text: string; pause: number; speed?: number; delete?: boolean }[];
  className?: string;
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhase = texts[currentTextIndex];
    const textToType = currentPhase.text;
    const typingSpeed = currentPhase.speed || 100;

    const handleTyping = () => {
      if (isDeleting) {
        if (charIndex > 0) {
          setDisplayText(textToType.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      } else {
        if (charIndex < textToType.length) {
          setDisplayText(textToType.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => {
            if (currentPhase.delete) {
              setIsDeleting(true);
            } else {
              setCharIndex(0);
              setCurrentTextIndex((prev) => (prev + 1) % texts.length);
            }
          }, currentPhase.pause);
        }
      }
    };

    const typingTimeout = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(typingTimeout);
  }, [charIndex, isDeleting, currentTextIndex, texts]);

  return <span className={className}>{displayText}</span>;
};

export default function LandingPage() {
  const typewriterTexts = [
    { text: "Right", pause: 500, delete: true },
    { text: "Write confidently, mistakes - we take care of that", pause: 5000, speed: 50 },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
      <Background />

      <main className="z-10 flex flex-col items-center justify-center text-center">
        <div className="glass-card flex flex-col items-center gap-6 p-8 sm:p-12 md:p-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Your Smart Mate for <span className="text-primary">Writing</span>
          </h1>

          <p className="max-w-xl text-lg text-foreground/80 md:text-xl">
             <Typewriter texts={typewriterTexts} />
          </p>

          <Link href="/editor">
            <Button size="lg" className="mt-4">
              Get Started
            </Button>
          </Link>
        </div>
        <p className="mt-8 text-sm text-foreground/60">
            Powered by AI. Built for writers.
        </p>
      </main>
    </div>
  );
}
