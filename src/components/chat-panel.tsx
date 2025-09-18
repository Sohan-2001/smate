
"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, User, Zap, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateText } from "@/ai/flows/generate-text-from-prompt";
import { database } from "@/lib/firebase";
import { ref, set } from "firebase/database";
import { useUser } from "@/context/user-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type Message = {
  role: "user" | "ai";
  content: string;
};

type UserData = {
    subscription: 'free' | 'paid';
    chatCount: number;
    lastChatDate: string; // YYYY-MM-DD
};

interface ChatPanelProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onApplyToEditor: (content: string) => void;
  userData: UserData | null;
  onUpgrade: () => void;
}

const initialMessage: Message = { role: "ai", content: "Hello! How can I assist you today?" };

export function ChatPanel({ messages, setMessages, onApplyToEditor, userData, onUpgrade }: ChatPanelProps) {
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showClearConfirmDialog, setShowClearConfirmDialog] = useState(false);
  const { user } = useUser();
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);
  
  const isDeveloper = user?.email === 'sohan.karfa@gmail.com';
  const chatLimit = (userData?.subscription === 'paid' || isDeveloper) ? 100 : 3;
  const chatsRemaining = userData ? Math.max(0, chatLimit - userData.chatCount) : 0;
  const hasReachedLimit = userData ? userData.chatCount >= chatLimit && !isDeveloper : false;

  useEffect(() => {
    const viewport = scrollAreaViewportRef.current;
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages]);


  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading || !user || !userData) return;
    
    if (hasReachedLimit) {
        const limitMessage: Message = {
          role: "ai",
          content: "You have reached your daily limit of 3 free chats. Kindly subscribe to continue chatting, or wait for the next day. Current quota 3 per day."
        };
        setMessages((prev) => [...prev, limitMessage]);
        return;
    }


    const userMessage: Message = { role: "user", content: chatInput };
    setMessages((prev) => [...prev, userMessage]);
    const currentChatInput = chatInput;
    setChatInput("");
    setIsLoading(true);

    try {
      if (!isDeveloper) {
        // Increment chat count in Firebase for non-dev users
        const userUsageRef = ref(database, `users/${user.uid}/usage`);
        await set(userUsageRef, { ...userData, chatCount: userData.chatCount + 1 });
      }
      
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

  const handleClearChat = () => {
    setMessages([initialMessage]);
    setShowClearConfirmDialog(false);
    if (user) {
        const userChatRef = ref(database, `users/${user.uid}/chatMessages`);
        set(userChatRef, [initialMessage]);
    }
  };

  const handleDeleteMessage = (index: number) => {
    setMessages((prevMessages) => prevMessages.filter((_, i) => i !== index));
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
           <MessageSquare /> AI Assistant
          </div>
          <div className="flex items-center gap-1">
             {messages.length > 1 && (
              <Button variant="ghost" size="icon" onClick={() => setShowClearConfirmDialog(true)} className="h-7 w-7">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Clear Chat</span>
              </Button>
            )}
            <div className="text-sm font-normal text-muted-foreground">
              {isDeveloper ? '∞' : `${chatsRemaining} / ${chatLimit}`}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <ScrollArea className="flex-1" viewportRef={scrollAreaViewportRef}>
        <div className="space-y-4 px-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`group relative flex items-start gap-3 ${
                msg.role === "user" ? "justify-end" : ""
              }`}
            >
              {index > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={`absolute top-1/2 -translate-y-1/2 h-6 w-6 opacity-0 group-hover:opacity-100 ${
                    msg.role === "user" ? "left-0" : "right-0"
                  }`}
                  onClick={() => handleDeleteMessage(index)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Delete message</span>
                </Button>
              )}
              {msg.role === "ai" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <MessageSquare className="h-5 w-5" />
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
                <MessageSquare className="h-5 w-5" />
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
              disabled={isLoading || hasReachedLimit}
              className="focus-visible:ring-primary"
          />
          <Button
              type="submit"
              size="icon"
              disabled={isLoading || !chatInput.trim() || hasReachedLimit}
          >
              <Send className="h-4 w-4" />
          </Button>
          </form>
           {hasReachedLimit && (
            <p className="text-center text-xs text-muted-foreground mt-2">
              Today's quota is over. Please subscribe for more.
            </p>
          )}
      </div>
      <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Free Tier Limit Reached</AlertDialogTitle>
            <AlertDialogDescription>
              You've used all your free chats for today. Please upgrade to a Pro plan for unlimited access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setShowUpgradeDialog(false);
              onUpgrade();
            }}>
              <Zap className="mr-2 h-4 w-4" />
              Upgrade to Pro
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showClearConfirmDialog} onOpenChange={setShowClearConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Chat History?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all messages? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearChat}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
