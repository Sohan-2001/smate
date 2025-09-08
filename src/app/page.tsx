"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Background } from "@/components/background";
import { Bot, Edit, MousePointerClick, Wand2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";

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
        
        if (displayText.length > (currentPhase.text.length - charsToDelete)) {
            setDisplayText(prev => prev.slice(0, -1));
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

    if ((isDeleting || isInserting) && !hasAnimated) {
        const animationTimeout = setTimeout(handleAnimation, timeoutSpeed);
        return () => clearTimeout(animationTimeout);
    }

  }, [displayText, charIndex, isDeleting, isInserting, currentTextIndex, texts, hasAnimated]);


  return <span className={className}>{displayText}</span>;
};


export default function LandingPage() {
  const typewriterTexts = [
    { 
      text: "Right confidently, mistakes - we take care of that", 
      pause: 1000,
      deleteChars: 5, 
      insert: 'Write',
    },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
      <Background />
      <header className="fixed top-0 left-0 right-0 z-20 flex h-20 items-center justify-between px-6 bg-background/50 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-3">
            <Wand2 className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">SMATE</h1>
        </Link>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Link href="/editor">
            <Button>
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      <main className="z-10 flex flex-col items-center justify-center text-center p-4 mt-20">
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

      <section className="z-10 w-full max-w-5xl px-4 py-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Features
        </h2>
        <p className="mt-4 text-lg text-foreground/80">
          Everything you need to write better, faster.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card className="glass-card text-left">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Edit className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">Real-time Editor</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">
                Write and edit your documents seamlessly with a clean, intuitive, and powerful editor. Focus on your words, we'll handle the rest.
              </p>
            </CardContent>
          </Card>
          <Card className="glass-card text-left">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">AI Chat Assistant</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">
                Get help, ask questions, or generate content using the chat sidebar. Your creative partner is always just a click away.
              </p>
            </CardContent>
          </Card>
          <Card className="glass-card text-left">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MousePointerClick className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">Contextual AI Actions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">
                Select any piece of text to bring up a floating toolbar with AI-powered editing options like improving, summarizing, and more.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
