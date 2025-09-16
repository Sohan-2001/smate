
"use client";

import {
  useState,
  type MouseEvent,
  TouchEvent,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { Bot, LogOut, Redo, Undo, Wand2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateText } from "@/ai/flows/generate-text-from-prompt";
import { improveWritingStyle } from "@/ai/flows/improve-writing-style";
import { summarizeSelectedText } from "@/ai/flows/summarize-selected-text";
import {
  checkSpelling,
  type CheckSpellingOutput,
} from "@/ai/flows/check-spelling";
import { withAuth } from "@/components/with-auth";
import { useUser } from "@/context/user-context";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { database } from "@/lib/firebase";
import { ref, onValue, set, off } from "firebase/database";

import { FloatingToolbar } from "@/components/floating-toolbar";
import { PreviewModal } from "@/components/preview-modal";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { ChatPanel, type Message } from "@/components/chat-panel";
import { LoaderOverlay } from "@/components/loader-overlay";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEditorHistory } from "@/hooks/use-editor-history";
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

type Selection = {
  start: number;
  end: number;
  text: string;
};

type Preview = {
  original: string;
  suggestion: string;
  selection: Selection;
  corrections?: CheckSpellingOutput["corrections"];
};

type UserData = {
    subscription: 'free' | 'paid';
    chatCount: number;
    lastChatDate: string; // YYYY-MM-DD
};


const placeholderContent = `Start writing...`;

function EditorPage() {
  const { toast } = useToast();
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useUser();

  const {
    content,
    setContent,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useEditorHistory({ userId: user?.uid });

  const [selection, setSelection] = useState<Selection | null>(null);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });

  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);


  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hello! How can I assist you today?" },
  ]);

  // Load chat messages from Firebase
  useEffect(() => {
    if (user) {
      const userChatRef = ref(database, `users/${user.uid}/chatMessages`);
      const onDataChange = (snapshot: any) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setMessages(
            data || [{ role: "ai", content: "Hello! How can I assist you today?" }]
          );
        }
      };
      onValue(userChatRef, onDataChange);

      return () => {
        off(userChatRef, "value", onDataChange);
      };
    }
  }, [user]);

  // Save chat messages to Firebase
  useEffect(() => {
    if (user && messages.length > 1) {
      // Avoid saving initial message
      const messagesRef = ref(database, `users/${user.uid}/chatMessages`);
      set(messagesRef, messages);
    }
  }, [messages, user]);

  useEffect(() => {
    if (!user) return;
    const userRef = ref(database, `users/${user.uid}/usage`);
    const onDataChange = (snapshot: any) => {
      const today = new Date().toISOString().split('T')[0];
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.lastChatDate !== today) {
          // Reset daily count if it's a new day
          const newUserData = { ...data, chatCount: 0, lastChatDate: today };
          set(userRef, newUserData);
          setUserData(newUserData);
        } else {
          setUserData(data);
        }
      } else {
        // Initialize user data
        const newUserData: UserData = { subscription: 'free', chatCount: 0, lastChatDate: today };
        set(userRef, newUserData);
        setUserData(newUserData);
      }
    };
    onValue(userRef, onDataChange);
    return () => off(userRef, 'value', onDataChange);
  }, [user]);


  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      router.push("/auth");
    } catch (error) {
      console.error("Sign out error", error);
      toast({
        variant: "destructive",
        title: "Sign Out Error",
        description: "Failed to sign out. Please try again.",
      });
    }
  };

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

      const isTouchEvent = "touches" in e;

      if (isMobile) {
        setToolbarPosition({
          top: editor.clientHeight / 2,
          left: editor.clientWidth / 2 - 125,
        });
        return;
      }

      const properties = [
        "direction",
        "boxSizing",
        "width",
        "height",
        "overflowX",
        "overflowY",
        "borderTopWidth",
        "borderRightWidth",
        "borderBottomWidth",
        "borderLeftWidth",
        "paddingTop",
        "paddingRight",
        "paddingBottom",
        "paddingLeft",
        "fontStyle",
        "fontVariant",
        "fontWeight",
        "fontStretch",
        "fontSize",
        "fontSizeAdjust",
        "lineHeight",
        "fontFamily",
        "textAlign",
        "textTransform",
        "textIndent",
        "textDecoration",
        "letterSpacing",
        "wordSpacing",
        "tabSize",
        "MozTabSize",
      ];
      const isFirefox = typeof (window as any).mozInnerScreenX !== "undefined";

      const div = document.createElement("div");
      div.id = "input-textarea-caret-position-mirror-div";
      document.body.appendChild(div);

      const style = div.style;
      const computed = window.getComputedStyle
        ? window.getComputedStyle(target)
        : (target as any).currentStyle;
      const isInput = target.nodeName === "INPUT";

      style.whiteSpace = "pre-wrap";
      if (!isInput) {
        style.wordWrap = "break-word";
      }

      style.position = "absolute";
      style.visibility = "hidden";

      properties.forEach(function (prop) {
        style[prop as any] = computed[prop as any];
      });

      if (isFirefox) {
        if (target.scrollHeight > parseInt(computed.height))
          style.overflowY = "scroll";
      } else {
        style.overflow = "hidden";
      }

      div.textContent = target.value.substring(0, selectionStart);

      if (isInput) {
        div.textContent = div.textContent!.replace(/\s/g, "\u00a0");
      }

      const span = document.createElement("span");
      span.textContent = target.value.substring(selectionStart) || ".";
      div.appendChild(span);

      const { x, y } = target.getBoundingClientRect();
      const top =
        span.offsetTop + parseInt(computed["borderTopWidth"]) - target.scrollTop;
      const left = span.offsetLeft + parseInt(computed["borderLeftWidth"]);

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

  const handleToolbarAction = async (
    action:
      | "improve"
      | "summarize"
      | "fix-grammar"
      | "check-spelling"
      | "fix-tone-professional"
      | "fix-tone-casual"
      | "fix-tone-confident"
      | "fix-tone-friendly"
      | "change-tense-present"
      | "change-tense-past"
      | "change-tense-future"
  ) => {
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
          result = await summarizeSelectedText({
            selectedText: currentSelection.text,
          });
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
          tone = action.split("-").pop();
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
        description: `Failed to ${action.replace("-", " ")} text.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmEdit = () => {
    if (!preview) return;
    const { suggestion, selection: editSelection } = preview;
    const newContent =
      content.substring(0, editSelection.start) +
      suggestion +
      content.substring(editSelection.end);
    setContent(newContent);
    setPreview(null);
  };

  const handleApplyToEditor = (newContent: string) => {
    setContent((prevContent) => prevContent + "\n\n" + newContent);
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    },
    [undo, redo]
  );
  
   const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user!.uid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create subscription.');

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: data.subscriptionId,
        name: 'SMATE Pro',
        description: 'Unlimited AI chat access.',
        handler: async function (response: any) {
          toast({ title: 'Payment Successful!', description: 'Your subscription is now active.' });
        },
        prefill: {
          name: user?.displayName || '',
          email: user?.email || '',
        },
        theme: {
          color: '#6366f1',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Subscription Error', description: error.message });
    } finally {
      setIsLoading(false);
    }
  };
  
    // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleChatPanelUpgrade = () => {
    setShowUpgradeDialog(true);
  };

  const ChatPanelComponent = () => (
    <ChatPanel
      messages={messages}
      setMessages={setMessages}
      onApplyToEditor={handleApplyToEditor}
      userData={userData}
      onUpgrade={handleChatPanelUpgrade}
    />
  );

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      {isLoading && <LoaderOverlay />}
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-6 bg-card">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Wand2 className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">SMATE</h1>
          </Link>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo} aria-label="Undo">
                <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo} aria-label="Redo">
                <Redo className="h-4 w-4" />
            </Button>
        </div>
        <div className="flex items-center gap-4">
          {userData?.subscription === 'free' && (
            <Button onClick={() => setShowUpgradeDialog(true)} size="sm">
              <Zap className="mr-2 h-4 w-4" />
              Subscribe
            </Button>
          )}
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user?.photoURL || ""}
                    alt={user?.displayName || ""}
                  />
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.displayName || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="md:hidden">
            <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Bot className="h-6 w-6" />
                  <span className="sr-only">Toggle AI Assistant</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                className="w-full max-w-sm p-0 flex flex-col"
                side="right"
              >
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
            value={content || ''}
            onChange={(e) => setContent(e.target.value)}
            onMouseUp={handleMouseUp}
            onTouchEnd={handleTouchEnd}
            onKeyDown={handleKeyDown}
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
      <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Upgrade to Pro</AlertDialogTitle>
            <AlertDialogDescription>
              You've reached the limit of the free plan. Upgrade to a Pro plan for unlimited access and more features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setShowUpgradeDialog(false);
              handleUpgrade();
            }}>
              <Zap className="mr-2 h-4 w-4" />
              Upgrade
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default withAuth(EditorPage);

    
    