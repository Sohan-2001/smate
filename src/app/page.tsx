"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PreLoader } from "@/components/pre-loader";
import { ModeToggle } from "@/components/mode-toggle";
import { TypingAnimation } from "@/components/typing-animation";
import { Background } from "@/components/background";

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
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Background />
      <header className="fixed top-0 left-0 right-0 z-50 flex h-20 items-center justify-between px-6 bg-transparent">
        <Link href="/" className="flex items-center gap-3">
          <Wand2 className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">SMATE</h1>
        </Link>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6 relative z-10">
        <div className="animate-in fade-in-50 zoom-in-95 duration-700 w-full max-w-2xl">
          <div className="relative bg-card/60 backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-2xl border border-white/10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-12 border-t-2 border-l-2 border-r-2 border-primary/50 rounded-t-full o" />
            
            <h2 className="text-4xl font-bold tracking-tighter mb-4">
              Your Smart Mate for <span className="text-primary">Writing</span>
            </h2>
            <div className="text-lg text-muted-foreground mb-8 min-h-[28px] flex items-center justify-center">
              <TypingAnimation />
            </div>
            <Link href="/editor">
              <Button size="lg" className="px-10 py-6 text-lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <footer className="relative z-10 py-4 text-center text-sm text-muted-foreground">
        <p>Powered by AI. Built for writers.</p>
      </footer>
    </div>
  );
}
