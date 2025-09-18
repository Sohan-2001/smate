"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MessageSquare, Edit, MousePointerClick, ArrowRight } from "lucide-react";
import { ThemeSwitch } from "@/components/theme-switch";
import { useUser } from "@/context/user-context";
import { LoaderOverlay } from "@/components/loader-overlay";

export default function LandingPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/editor");
    }
  }, [user, loading, router]);

  if (loading || user) {
    return <LoaderOverlay />;
  }

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
            
            <div className="flex justify-center">
              <Image 
                src="/how_to_use_smate.gif" 
                alt="How to use SMATE instruction GIF" 
                width={800} 
                height={600} 
                unoptimized
                className="rounded-lg shadow-2xl border"
              />
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
