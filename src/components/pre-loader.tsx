"use client";

import { Wand2 } from "lucide-react";

export const PreLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-24 w-24 rounded-full border-4 border-primary/20"></div>
        <div className="absolute h-32 w-32 rounded-full border-4 border-primary/20 animate-spin-slow"></div>
        <Wand2 className="h-12 w-12 text-primary animate-pulse" />
      </div>
    </div>
  );
};

declare module 'tailwindcss/types/config' {
  interface ThemeConfig {
    extend: {
      animation: {
        'spin-slow': string;
      }
    }
  }
}
