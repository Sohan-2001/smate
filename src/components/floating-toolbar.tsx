"use client";

import { type FC } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wand2, BookText } from "lucide-react";

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
      className="fixed z-10 shadow-lg animate-in fade-in zoom-in-95"
      style={{ top: position.top, left: position.left }}
    >
      <CardContent className="p-1 flex gap-1">
        <Button variant="ghost" size="sm" onClick={() => onAction("improve")}>
          <Wand2 className="h-4 w-4 mr-2 text-primary" />
          Improve
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onAction("summarize")}>
          <BookText className="h-4 w-4 mr-2 text-accent-foreground" />
          Summarize
        </Button>
      </CardContent>
    </Card>
  );
};
