"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquare, Edit, MousePointerClick, ArrowRight } from "lucide-react";
import { ThemeSwitch } from "@/components/theme-switch";
import Image from 'next/image';

export default function LandingPage() {

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-20 flex h-20 items-center justify-between px-6 bg-background/50 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">SMATE</h1>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeSwitch />
        </div>
      </header>

      <main className="flex-1">
        <section className="flex flex-col items-center justify-center text-center py-20 px-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Unlock Your Best Writing
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-foreground/80 md:text-xl">
            SMATE is your intelligent writing partner. Edit documents, get AI assistance, and refine your text with powerful, intuitive tools.
          </p>
          <Link href="/auth">
            <Button size="lg" className="mt-8">
              Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </section>

        <section className="w-full py-16 bg-muted/40">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
                A simple, three-step process to elevate your writing.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">1</div>
                <div className="flex items-center gap-4 mb-4">
                  <Edit className="h-8 w-8 text-primary" />
                  <h3 className="text-2xl font-bold">Write & Edit</h3>
                </div>
                <p className="text-foreground/80">
                  Start writing in our clean, real-time editor. Your content is automatically saved, and your edit history is preserved so you never lose your work.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">2</div>
                <div className="flex items-center gap-4 mb-4">
                  <MousePointerClick className="h-8 w-8 text-primary" />
                  <h3 className="text-2xl font-bold">Use AI Actions</h3>
                </div>
                <p className="text-foreground/80">
                  Select any piece of text to bring up a contextual menu. Improve writing, fix grammar, change tone, summarize, and more with a single click.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">3</div>
                <div className="flex items-center gap-4 mb-4">
                  <MessageSquare className="h-8 w-8 text-primary" />
                  <h3 className="text-2xl font-bold">Chat with AI</h3>
                </div>
                <p className="text-foreground/80">
                  Use the AI assistant sidebar to ask questions, brainstorm ideas, or generate content from a prompt, then apply it directly to your editor.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Ready to Start Writing?
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
                Create an account and experience the future of writing.
            </p>
            <Link href="/auth">
                <Button size="lg" className="mt-8">
                Sign Up Now
                </Button>
            </Link>
        </section>
      </main>
    </div>
  );
}
