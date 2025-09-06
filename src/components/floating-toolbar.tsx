"use client";

import { type FC } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wand2, BookText, MoreVertical, CheckCheck, Mic, VenetianMask } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FloatingToolbarProps {
  position: { top: number; left: number };
  onAction: (
    action: "improve" | "summarize" | "fix-grammar" | "fix-tone" | "change-tense"
  ) => void;
}

export const FloatingToolbar: FC<FloatingToolbarProps> = ({
  position,
  onAction,
}) => {
  return (
    <Card
      className="absolute z-10 shadow-lg animate-in fade-in zoom-in-95"
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onAction("fix-grammar")}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Fix Grammar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction("fix-tone")}>
              <VenetianMask className="mr-2 h-4 w-4" />
              Fix Tone
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction("change-tense")}>
              <Mic className="mr-2 h-4 w-4" />
              Change Tense
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
};
