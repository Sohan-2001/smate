"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Background } from "@/components/background";

const Typewriter = ({
  texts,
  className,
}: {
  texts: { text: string; pause: number; speed?: number; deleteChars?: number; insert?: string; deleteFromStart?: boolean }[];
  className?: string;
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState(texts.length > 0 ? texts[0].text : "");
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isInserting, setIsInserting] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // A one-time effect to kick off the animation after the initial text is shown.
  useEffect(() => {
    if (hasAnimated || texts.length === 0) return;

    const currentPhase = texts[currentTextIndex];
    
    const initialPauseTimeout = setTimeout(() => {
        if (currentPhase.deleteChars && currentPhase.deleteChars > 0) {
            setIsDeleting(true);
        }
    }, currentPhase.pause);

    return () => clearTimeout(initialPauseTimeout);
  }, [hasAnimated, texts, currentTextIndex]);


  useEffect(() => {
    if (hasAnimated) return;

    const currentPhase = texts[currentTextIndex];
    let timeoutSpeed = 50;

    const handleAnimation = () => {
      // Deleting characters
      if (isDeleting) {
        timeoutSpeed = 150;
        const charsToDelete = currentPhase.deleteChars!;
        
        if (charIndex < charsToDelete) {
            setDisplayText(prev => prev.slice(1));
            setCharIndex(charIndex + 1);
        } else {
            setIsDeleting(false);
            setIsInserting(true);
            setCharIndex(0); // Reset for insertion
        }
        return;
      }

      // Inserting characters
      if (isInserting) {
        timeoutSpeed = 150;
        const textToInsert = currentPhase.insert || '';
        const remainingText = currentPhase.text.substring(currentPhase.deleteChars || 0);

        if (charIndex < textToInsert.length) {
            setDisplayText(textToInsert.substring(0, charIndex + 1) + remainingText);
            setCharIndex(charIndex + 1);
        } else {
           setIsInserting(false);
           setHasAnimated(true); // Animation is done.
        }
      }
    };

    if (isDeleting || isInserting) {
        const animationTimeout = setTimeout(handleAnimation, timeoutSpeed);
        return () => clearTimeout(animationTimeout);
    }

  }, [charIndex, isDeleting, isInserting, currentTextIndex, texts, hasAnimated]);


  return <span className={className}>{displayText}</span>;
};


export default function LandingPage() {
  const typewriterTexts = [
    { 
      text: "Right confidently, mistakes - we take care of that", 
      pause: 1000,
      deleteChars: 5, 
      insert: 'Write',
      deleteFromStart: true 
    },
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
