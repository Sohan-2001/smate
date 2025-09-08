"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Wand2, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PreLoader } from "@/components/pre-loader";
import { ModeToggle } from "@/components/mode-toggle";
import { TypingAnimation } from "@/components/typing-animation";

export default function LandingPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulate loading time

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <PreLoader />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-6 bg-card">
        <div className="flex items-center gap-3">
          <Wand2 className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">SMATE</h1>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <div className="animate-in fade-in-50 zoom-in-95 duration-500">
          <div className="relative mb-8">
            <PenTool className="h-24 w-24 text-primary mx-auto" />
            <Wand2 className="absolute -top-2 -right-2 h-10 w-10 text-accent-foreground animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 aurora-text">
            Your Smart Mate for Writing
          </h2>
          <div className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8 min-h-[56px] flex items-center justify-center">
            <TypingAnimation />
          </div>
          <Link href="/editor">
            <Button size="lg">
              Get Started
            </Button>
          </Link>
        </div>
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>Powered by AI. Built for writers.</p>
      </footer>
    </div>
  );
}
