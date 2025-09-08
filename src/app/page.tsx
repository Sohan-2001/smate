"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Background } from "@/components/background";

const Typewriter = ({
  texts,
  className,
}: {
  texts: { text: string; pause: number; speed?: number; deleteChars?: number; insert?: string }[];
  className?: string;
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isInserting, setIsInserting] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated && texts.length > 1) return;

    const currentPhase = texts[currentTextIndex];
    const textToAnimate = currentPhase.text;
    const typingSpeed = currentPhase.speed || 100;

    const handleTyping = () => {
      // Typing out initial text
      if (!isDeleting && !isInserting && charIndex < textToAnimate.length) {
        setDisplayText(textToAnimate.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
        return;
      }
      
      // Pause after typing
      if (!isDeleting && !isInserting && charIndex === textToAnimate.length) {
         setTimeout(() => {
          if (currentPhase.deleteChars && currentPhase.deleteChars > 0) {
            setIsDeleting(true);
          } else if (currentTextIndex < texts.length - 1) {
            setCurrentTextIndex(prev => prev + 1);
            setCharIndex(0);
          } else {
            setHasAnimated(true);
          }
        }, currentPhase.pause);
        return;
      }
      
      // Deleting characters
      if (isDeleting) {
        if (charIndex > textToAnimate.length - currentPhase.deleteChars!) {
          setDisplayText(displayText.slice(0, -1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setIsInserting(true);
          setCharIndex(0); 
        }
        return;
      }

      // Inserting characters
      if (isInserting) {
        const textToInsert = currentPhase.insert || '';
        if (charIndex < textToInsert.length) {
           setDisplayText(prev => prev + textToInsert[charIndex]);
           setCharIndex(charIndex + 1);
        } else {
           setIsInserting(false);
           if (currentTextIndex < texts.length - 1) {
              setCurrentTextIndex(prev => prev + 1);
              setCharIndex(0);
           } else {
              setHasAnimated(true);
           }
        }
      }
    };

    const typingTimeout = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(typingTimeout);

  }, [charIndex, isDeleting, isInserting, currentTextIndex, texts, displayText, hasAnimated]);


  return <span className={className}>{displayText}</span>;
};


export default function LandingPage() {
  const typewriterTexts = [
    { text: "Right confidently, mistakes - we take care of that", pause: 1000, speed: 50, deleteChars: 5, insert: 'Write' },
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
