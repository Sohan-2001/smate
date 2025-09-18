"use client";

import { Sparkles } from "lucide-react";

export const LoaderOverlay = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-2 rounded-lg bg-card p-4 shadow-lg">
        <Sparkles className="h-6 w-6 animate-spin text-primary" />
        <span className="text-lg font-medium">Loading...</span>
      </div>
    </div>
  );
};
