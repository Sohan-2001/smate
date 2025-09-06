"use client";

import { type FC } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Wand2,
  BookText,
  MoreVertical,
  CheckCheck,
  VenetianMask,
  Clock,
  CircleArrowRight,
  History,
  AlarmClock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FloatingToolbarProps {
  position: { top: number; left: number };
  onAction: (
    action:
      | "improve"
      | "summarize"
      | "fix-grammar"
      | "fix-tone"
      | "change-tense-present"
      | "change-tense-past"
      | "change-tense-future"
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
        <Button variant="ghost" size="sm" onClick={() => onAction("improve")}>
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
              Professional Tone
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Clock className="mr-2 h-4 w-4" />
                Change Tense
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => onAction("change-tense-present")}
                >
                  <AlarmClock className="mr-2 h-4 w-4" />
                  Present
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onAction("change-tense-past")}
                >
                  <History className="mr-2 h-4 w-4" />
                  Past
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onAction("change-tense-future")}
                >
                  <CircleArrowRight className="mr-2 h-4 w-4" />
                  Future
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
};
