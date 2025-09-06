"use client";

import { type FC } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wand2, BookText } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingToolbarProps {
  position: { top: number; left: number };
  onAction: (action: "improve" | "summarize") => void;
}

export const FloatingToolbar: FC<FloatingToolbarProps> = ({
  position,
  onAction,
}) => {
  return (
    <Card
      className={cn(
        "absolute z-10 shadow-lg animate-in fade-in zoom-in-95",
        "md:top-auto md:left-auto",
        "max-md:left-1/2 max-md:-translate-x-1/2 max-md:top-1/2 max-md:-translate-y-1/2"
      )}
      style={{ top: position.top, left: position.left }}
    >
      <CardContent className="p-1 flex gap-1 justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction("improve")}
        >
          <Wand2 className="h-4 w-4 mr-2 text-primary" />
          Improve
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction("summarize")}
        >
          <BookText className="h-4 w-4 mr-2 text-accent-foreground" />
          Summarize
        </Button>
      </CardContent>
    </Card>
  );
};
