"use client";

import { useState } from "react";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateText } from "@/ai/flows/generate-text-from-prompt";

type Message = {
  role: "user" | "ai";
  content: string;
};

interface ChatPanelProps {
  onApplyToEditor: (content: string) => void;
}

export function ChatPanel({ onApplyToEditor }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hello! How can I assist you today?" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: chatInput };
    setMessages((prev) => [...prev, userMessage]);
    const currentChatInput = chatInput;
    setChatInput("");
    setIsLoading(true);

    try {
      const response = await generateText({ prompt: currentChatInput });
      const aiMessage: Message = {
        role: "ai",
        content: response.generatedText,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const aiErrorMessage: Message = {
        role: "ai",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, aiErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot /> AI Assistant
        </CardTitle>
      </CardHeader>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "justify-end" : ""
              }`}
            >
              {msg.role === "ai" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Bot className="h-5 w-5" />
                </div>
              )}
              <div
                className={`max-w-xs rounded-lg p-3 text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {msg.content}
                {msg.role === "ai" && index > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full justify-start mt-2 border"
                    onClick={() => onApplyToEditor(msg.content)}
                  >
                    Apply to editor
                  </Button>
                )}
              </div>
              {msg.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent-foreground">
                  <User className="h-5 w-5" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Bot className="h-5 w-5" />
              </div>
              <div className="rounded-lg bg-muted p-3 text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 animate-spin" /> Thinking...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <form onSubmit={handleChatSubmit} className="flex gap-2">
          <Input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask AI..."
            disabled={isLoading}
            className="focus-visible:ring-primary"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !chatInput.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </>
  );
}
