"use client";

import {
  Book,
  CheckCircle2,
  FileText,
  MessageSquare,
  Pen,
  Square,
  Type,
} from "lucide-react";

export const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden">
      <div className="absolute inset-0 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background/80 to-background"></div>

      {/* Icons */}
      <Pen className="absolute top-[10%] left-[15%] h-8 w-8 text-foreground/20 -rotate-12" />
      <Book className="absolute top-[15%] right-[20%] h-8 w-8 text-foreground/20 rotate-6" />
      <MessageSquare className="absolute bottom-[25%] left-[10%] h-8 w-8 text-foreground/20 rotate-12" />
      <Type className="absolute top-[55%] left-[25%] h-8 w-8 text-foreground/20" />
      <FileText className="absolute bottom-[10%] left-[25%] h-8 w-8 text-foreground/20" />
      <CheckCircle2 className="absolute top-[30%] right-[10%] h-12 w-12 text-green-500/50" />
      <CheckCircle2 className="absolute bottom-[5%] right-[15%] h-10 w-10 text-primary/30" />
      <Square className="absolute bottom-[15%] right-[5%] h-6 w-6 text-foreground/10" />

      {/* Shapes */}
      <div className="absolute top-[5%] left-[5%] h-6 w-6 rounded-full border-2 border-primary/30"></div>
      <div className="absolute top-[20%] left-[30%] h-4 w-4 rounded-full bg-primary/40"></div>
      <div className="absolute top-[50%] left-[15%] h-10 w-10 rounded-full bg-primary/20"></div>
      <div className="absolute bottom-[20%] left-[40%] h-5 w-5 rounded-full bg-primary/30"></div>
      <div className="absolute top-[10%] right-[5%] h-8 w-8 rounded-md border-2 border-foreground/20"></div>
      <div className="absolute top-[45%] right-[15%] h-12 w-12 rounded-full border-2 border-primary/30"></div>
      <div className="absolute bottom-[10%] right-[30%] h-8 w-8 rounded-full bg-primary/20"></div>
    </div>
  );
};
