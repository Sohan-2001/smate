"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const TypingAnimation = () => {
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const incorrectWord = "Right";
    const correctWord = "Write";
    const sentenceSuffix = " confidently, mistakes - we take care of that";
    const typingSpeed = 150;
    const deletingSpeed = 100;
    const pauseBeforeDelete = 1500;
    const pauseAfterCorrect = 2000;

    useEffect(() => {
        if (isFinished) return;

        const handleTyping = () => {
            if (!isDeleting && text.length < incorrectWord.length) {
                // Typing "Right"
                setText(incorrectWord.substring(0, text.length + 1));
            } else if (!isDeleting && text.length === incorrectWord.length) {
                // Pause before deleting
                setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
            } else if (isDeleting && text.length > 0) {
                // Deleting "Right"
                setText(currentText => currentText.substring(0, currentText.length - 1));
            } else if (isDeleting && text.length === 0) {
                // Start typing "Write"
                setIsDeleting(false);
            } else if (!isDeleting && text.length < correctWord.length) {
                // Typing "Write"
                setText(correctWord.substring(0, text.length + 1));
            } else if (!isDeleting && text.length === correctWord.length) {
                // Pause after correcting then finish
                 setTimeout(() => {
                    setIsFinished(true);
                }, pauseAfterCorrect);
            }
        };

        const speed = isDeleting ? deletingSpeed : typingSpeed;
        const timeout = setTimeout(handleTyping, speed);

        return () => clearTimeout(timeout);
    }, [text, isDeleting, isFinished]);
    

    const displayText = text;
    const isCorrecting = !isDeleting && text.length === 0 || (text.length > 0 && correctWord.startsWith(text));

    return (
        <p className="text-lg text-foreground/90">
            <span className={cn(
                "font-medium transition-colors duration-300",
                isCorrecting || isFinished ? "text-green-500" : "text-red-500",
                !isFinished && "highlighter-shadow"
            )}>
                 {isFinished ? correctWord : displayText}
                 {!isFinished && <span className="animate-pulse">|</span>}
            </span>
            {sentenceSuffix}
        </p>
    );
};
