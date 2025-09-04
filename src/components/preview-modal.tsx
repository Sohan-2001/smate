"use client";

import { type FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, X } from "lucide-react";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  originalText: string;
  suggestedText: string;
}

export const PreviewModal: FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  originalText,
  suggestedText,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>AI Suggestion</DialogTitle>
          <DialogDescription>
            Review the changes suggested by the AI before applying them.
          </DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-4 flex-1 overflow-y-auto p-1">
          <div>
            <h3 className="text-lg font-semibold mb-2">Original</h3>
            <div className="rounded-md border p-4 bg-muted/50 text-sm h-full whitespace-pre-wrap">
              {originalText}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary">Suggestion</h3>
            <div className="rounded-md border border-primary/50 p-4 bg-primary/10 text-sm h-full whitespace-pre-wrap">
              {suggestedText}
            </div>
          </div>
        </div>
        <Separator />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            <Check className="mr-2 h-4 w-4" />
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
