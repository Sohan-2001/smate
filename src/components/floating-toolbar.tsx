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
        "fixed z-10 shadow-lg animate-in fade-in zoom-in-95",
        "md:absolute",
        "bottom-4 left-4 right-4 md:bottom-auto md:left-auto md:right-auto"
      )}
      style={{ top: position.top, left: position.left }}
    >
      <CardContent className="p-1 flex gap-1 justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction("improve")}
          className="flex-1 md:flex-initial"
        >
          <Wand2 className="h-4 w-4 mr-2 text-primary" />
          Improve
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction("summarize")}
          className="flex-1 md:flex-initial"
        >
          <BookText className="h-4 w-4 mr-2 text-accent-foreground" />
          Summarize
        </Button>
      </CardContent>
    </Card>
  );
};
