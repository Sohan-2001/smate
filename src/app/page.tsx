"use client";

import { useState, type MouseEvent, TouchEvent, useRef } from "react";
import { Bot, Send, Sparkles, User, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateText } from "@/ai/flows/generate-text-from-prompt";
import { improveWritingStyle } from "@/ai/flows/improve-writing-style";
import { summarizeSelectedText } from "@/ai/flows/summarize-selected-text";

import { FloatingToolbar } from "@/components/floating-toolbar";
import { PreviewModal } from "@/components/preview-modal";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/mode-toggle";

type Message = {
  role: "user" | "ai";
  content: string;
};

type Selection = {
  start: number;
  end: number;
  text: string;
};

type Preview = {
  original: string;
  suggestion: string;
  selection: Selection;
};

const placeholderContent = `Welcome to CollabEdit AI! Start typing, or select text to see AI actions. You can also use the AI assistant on the right.`;

export default function Home() {
  const { toast } = useToast();
  const [editorContent, setEditorContent] = useState('');
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const [selection, setSelection] = useState<Selection | null>(null);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });

  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hello! How can I assist you today?" },
  ]);
  const [chatInput, setChatInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSelection = (
    e: MouseEvent<HTMLTextAreaElement> | TouchEvent<HTMLTextAreaElement>
  ) => {
    const target = e.currentTarget;
    const { selectionStart, selectionEnd } = target;

    if (selectionStart !== selectionEnd) {
      const selectedText = target.value.substring(selectionStart, selectionEnd);
      setSelection({
        start: selectionStart,
        end: selectionEnd,
        text: selectedText,
      });
      
      const isTouchEvent = 'touches' in e;

      if (!isTouchEvent && editorRef.current) {
        const rect = editorRef.current.getBoundingClientRect();
        
        // The following logic is based on https://github.com/dianagu/get-cursor-position
        const properties = ['direction', 'boxSizing', 'width', 'height', 'overflowX', 'overflowY', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize', 'fontSizeAdjust', 'lineHeight', 'fontFamily', 'textAlign', 'textTransform', 'textIndent', 'textDecoration', 'letterSpacing', 'wordSpacing', 'tabSize', 'MozTabSize'];
        const isFirefox = typeof (window as any).mozInnerScreenX !== 'undefined';
        
        const div = document.createElement('div');
        div.id = 'input-textarea-caret-position-mirror-div';
        document.body.appendChild(div);
        
        const style = div.style;
        const computed = window.getComputedStyle ? window.getComputedStyle(target) : (target as any).currentStyle;
        const isInput = target.nodeName === 'INPUT';
        
        style.whiteSpace = 'pre-wrap';
        if (!isInput) {
            style.wordWrap = 'break-word';
        }
        
        style.position = 'absolute';
        style.visibility = 'hidden';
        
        properties.forEach(function (prop) {
            style[prop as any] = computed[prop as any];
        });

        if (isFirefox) {
            if (target.scrollHeight > parseInt(computed.height))
                style.overflowY = 'scroll';
        } else {
            style.overflow = 'hidden';
        }
        
        div.textContent = target.value.substring(0, selectionStart);
        
        if (isInput) {
            div.textContent = div.textContent!.replace(/\s/g, '\u00a0');
        }

        const span = document.createElement('span');
        span.textContent = target.value.substring(selectionStart) || '.';
        div.appendChild(span);
        
        const { x, y } = target.getBoundingClientRect();
        const top = span.offsetTop + parseInt(computed['borderTopWidth']) - target.scrollTop;
        const left = span.offsetLeft + parseInt(computed['borderLeftWidth']);
        
        document.body.removeChild(div);
        
        setToolbarPosition({
            top: top + 15,
            left: left > rect.width ? rect.width : left,
        });
      }

    } else {
      setSelection(null);
    }
  };


  const handleMouseUp = (e: MouseEvent<HTMLTextAreaElement>) => {
    handleSelection(e);
  };

  const handleTouchEnd = (e: TouchEvent<HTMLTextAreaElement>) => {
    handleSelection(e);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: chatInput };
    setMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsLoading(true);

    try {
      const response = await generateText({ prompt: chatInput });
      const aiMessage: Message = { role: "ai", content: response.generatedText };
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

  const handleToolbarAction = async (action: "improve" | "summarize") => {
    if (!selection || isLoading) return;
    setIsLoading(true);

    const currentSelection = selection;
    setSelection(null);

    try {
      let result;
      if (action === "improve") {
        result = await improveWritingStyle({ text: currentSelection.text });
        setPreview({
          original: currentSelection.text,
          suggestion: result.improvedText,
          selection: currentSelection,
        });
      } else if (action === "summarize") {
        result = await summarizeSelectedText({ selectedText: currentSelection.text });
        setPreview({
          original: currentSelection.text,
          suggestion: result.summary,
          selection: currentSelection,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: `Failed to ${action} text.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmEdit = () => {
    if (!preview) return;
    const { suggestion, selection: editSelection } = preview;
    const newContent =
      editorContent.substring(0, editSelection.start) +
      suggestion +
      editorContent.substring(editSelection.end);
    setEditorContent(newContent);
    setPreview(null);
  };

  const handleApplyToEditor = (content: string) => {
    setEditorContent((prevContent) => prevContent + "\n\n" + content);
  };
  
  const ChatPanel = () => (
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
                    className="w-full justify-start mt-2"
                    onClick={() => handleApplyToEditor(msg.content)}
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

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-6 bg-card">
        <div className="flex items-center gap-3">
          <Wand2 className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">CollabEdit AI</h1>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <div className="md:hidden">
              <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
                  <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                          <Bot className="h-6 w-6" />
                          <span className="sr-only">Toggle AI Assistant</span>
                      </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full max-w-sm p-0 flex flex-col" side="right">
                      <SheetHeader className="p-4 border-b">
                          <SheetTitle className="flex items-center gap-2 text-lg">
                             <Bot /> AI Assistant
                          </SheetTitle>
                      </SheetHeader>
                      <ChatPanel />
                  </SheetContent>
              </Sheet>
          </div>
        </div>
      </header>
      <main className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative p-4 md:p-6">
          <Textarea
            ref={editorRef}
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            onMouseUp={handleMouseUp}
            onTouchEnd={handleTouchEnd}
            placeholder={placeholderContent}
            className="h-full w-full resize-none rounded-lg border bg-card p-4 text-base shadow-sm focus-visible:ring-primary"
          />
          {selection && (
            <FloatingToolbar
              position={toolbarPosition}
              onAction={handleToolbarAction}
            />
          )}
        </div>

        <aside className="w-full max-w-sm border-l flex-col bg-card hidden md:flex">
          <ChatPanel />
        </aside>

        {preview && (
          <PreviewModal
            isOpen={!!preview}
            onClose={() => setPreview(null)}
            onConfirm={handleConfirmEdit}
            originalText={preview.original}
            suggestedText={preview.suggestion}
          />
        )}
      </main>
    </div>
  );
}
