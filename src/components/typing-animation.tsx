"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const TypingAnimation = () => {
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCorrecting, setIsCorrecting] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const incorrectWord = "Right";
    const correctWord = "Write";
    const sentenceSuffix = " confidently, mistakes - we take care of that";
    const typingSpeed = 150;
    const deletingSpeed = 100;
    const pauseBeforeDelete = 2000;
    const pauseAfterCorrect = 3000;

    useEffect(() => {
        if (isFinished) return;
        let typingTimeout: NodeJS.Timeout;

        const handleTyping = () => {
            if (isDeleting) {
                // Deleting "Right"
                if (text.length > 0) {
                    setText(currentText => currentText.substring(0, currentText.length - 1));
                } else {
                    setIsDeleting(false);
                    setIsCorrecting(true);
                }
            } else if (isCorrecting) {
                 // Typing "Write"
                if (text.length < correctWord.length) {
                    setText(correctWord.substring(0, text.length + 1));
                } else {
                     // Pause after correcting then finish
                     setTimeout(() => {
                        setIsFinished(true);
                    }, pauseAfterCorrect);
                }
            }
            else {
                // Typing "Right"
                if (text.length < incorrectWord.length) {
                    setText(incorrectWord.substring(0, text.length + 1));
                } else {
                    // Pause before deleting
                    setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
                }
            }
        };
        
        const speed = isDeleting ? deletingSpeed : typingSpeed;
        typingTimeout = setTimeout(handleTyping, speed);

        return () => clearTimeout(typingTimeout);
    }, [text, isDeleting, isCorrecting, isFinished]);
    

    const displayText = isFinished ? correctWord : text;

    return (
        <p className="text-lg text-foreground/90">
            <span className={cn(
                "font-medium transition-colors duration-300",
                isCorrecting || isFinished ? "text-green-500" : "text-red-500",
                !isFinished && "highlighter-shadow"
            )}>
                 {displayText}
                 {!isFinished && <span className="animate-pulse">|</span>}
            </span>
            {sentenceSuffix}
        </p>
    );
};
