"use client";

import { useState, type MouseEvent, TouchEvent, useRef } from "react";
import { Bot, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateText } from "@/ai/flows/generate-text-from-prompt";
import { improveWritingStyle } from "@/ai/flows/improve-writing-style";
import { summarizeSelectedText } from "@/ai/flows/summarize-selected-text";
import { checkSpelling, type CheckSpellingOutput } from "@/ai/flows/check-spelling";

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
import { ChatPanel } from "@/components/chat-panel";
import { LoaderOverlay } from "@/components/loader-overlay";

type Selection = {
  start: number;
  end: number;
  text: string;
};

type Preview = {
  original: string;
  suggestion: string;
  selection: Selection;
  corrections?: CheckSpellingOutput['corrections'];
};

const placeholderContent = `Welcome to CollabEdit AI! Start typing, or select text to see AI actions. You can also use the AI assistant on the right.`;

export default function Home() {
  const { toast } = useToast();
  const [editorContent, setEditorContent] = useState('');
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const [selection, setSelection] = useState<Selection | null>(null);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });

  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSelection = (
    e: MouseEvent<HTMLTextAreaElement> | TouchEvent<HTMLTextAreaElement>
  ) => {
    const target = e.currentTarget;
    const { selectionStart, selectionEnd } = target;
    const editor = editorRef.current;
    const isMobile = window.innerWidth < 768;

    if (selectionStart !== selectionEnd && editor) {
      const selectedText = target.value.substring(selectionStart, selectionEnd);
      setSelection({
        start: selectionStart,
        end: selectionEnd,
        text: selectedText,
      });

      const isTouchEvent = 'touches' in e;

      if (isMobile) {
        setToolbarPosition({ top: editor.clientHeight / 2, left: editor.clientWidth / 2 - 125 });
        return;
      }
      
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
      
      const editorRect = editor.getBoundingClientRect();
      const relativeTop = top + 15;
      const relativeLeft = left;

      setToolbarPosition({
          top: Math.min(relativeTop, editorRect.height - 60),
          left: Math.min(relativeLeft, editorRect.width - 250),
      });

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

  const handleToolbarAction = async (action: "improve" | "summarize" | "fix-grammar" | "check-spelling" | "fix-tone-professional" | "fix-tone-casual" | "fix-tone-confident" | "fix-tone-friendly" | "change-tense-present" | "change-tense-past" | "change-tense-future") => {
    if (!selection) return;
    setIsLoading(true);

    const currentSelection = selection;
    setSelection(null);

    try {
      let result;
      let prompt;
      let tone;
      switch (action) {
        case "improve":
          result = await improveWritingStyle({ text: currentSelection.text });
          setPreview({
            original: currentSelection.text,
            suggestion: result.improvedText,
            selection: currentSelection,
          });
          break;
        case "summarize":
          result = await summarizeSelectedText({ selectedText: currentSelection.text });
          setPreview({
            original: currentSelection.text,
            suggestion: result.summary,
            selection: currentSelection,
          });
          break;
        case "fix-grammar":
          prompt = `Fix the grammar and spelling for the following text: "${currentSelection.text}"`;
          result = await generateText({ prompt });
           setPreview({
            original: currentSelection.text,
            suggestion: result.generatedText,
            selection: currentSelection,
          });
          break;
        case "check-spelling":
          result = await checkSpelling({ text: currentSelection.text });
          if (!result.hasCorrections) {
            toast({
              title: "No Spelling Errors Found",
              description: "Everything looks correct!",
            });
          } else {
            setPreview({
              original: currentSelection.text,
              suggestion: result.correctedText,
              selection: currentSelection,
              corrections: result.corrections,
            });
          }
          break;
        case "fix-tone-professional":
        case "fix-tone-casual":
        case "fix-tone-confident":
        case "fix-tone-friendly":
           tone = action.split('-').pop();
           prompt = `Make the tone of the following text more ${tone}: "${currentSelection.text}"`;
           result = await generateText({ prompt });
           setPreview({
            original: currentSelection.text,
            suggestion: result.generatedText,
            selection: currentSelection,
          });
          break;
        case "change-tense-present":
           prompt = `Change the tense of the following text to present tense: "${currentSelection.text}"`;
           result = await generateText({ prompt });
           setPreview({
            original: currentSelection.text,
            suggestion: result.generatedText,
            selection: currentSelection,
          });
          break;
        case "change-tense-past":
           prompt = `Change the tense of the following text to past tense: "${currentSelection.text}"`;
           result = await generateText({ prompt });
           setPreview({
            original: currentSelection.text,
            suggestion: result.generatedText,
            selection: currentSelection,
          });
          break;
        case "change-tense-future":
           prompt = `Change the tense of the following text to future tense: "${currentSelection.text}"`;
           result = await generateText({ prompt });
           setPreview({
            original: currentSelection.text,
            suggestion: result.generatedText,
            selection: currentSelection,
          });
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: `Failed to ${action.replace('-', ' ')} text.`,
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

  const ChatPanelComponent = () => (
    <ChatPanel
        onApplyToEditor={handleApplyToEditor}
      />
  );
  

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      {isLoading && <LoaderOverlay />}
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
                      <ChatPanelComponent />
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
          <ChatPanelComponent />
        </aside>

        {preview && (
          <PreviewModal
            isOpen={!!preview}
            onClose={() => setPreview(null)}
            onConfirm={handleConfirmEdit}
            originalText={preview.original}
            suggestedText={preview.suggestion}
            corrections={preview.corrections}
          />
        )}
      </main>
    </div>
  );
}
