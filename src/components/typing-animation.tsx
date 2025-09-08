"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const TypingAnimation = () => {
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCorrecting, setIsCorrecting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);

    const incorrectWord = "Right";
    const correctWord = "Write";
    const sentenceSuffix = " confidently, mistakes - we take care of that";
    const typingSpeed = 150;
    const deletingSpeed = 100;
    const pauseBeforeDelete = 2000;
    const pauseAfterCorrect = 3000;

    useEffect(() => {
        let typingTimeout: NodeJS.Timeout;

        const handleTyping = () => {
            const fullIncorrectSentence = incorrectWord + sentenceSuffix;
            const fullCorrectSentence = correctWord + sentenceSuffix;

            if (isDeleting) {
                // Deleting "Right"
                setText(currentText => currentText.substring(0, currentText.length - 1));
                if (text === "") {
                    setIsDeleting(false);
                    setIsCorrecting(true);
                }
            } else if (isCorrecting) {
                 // Typing "Write"
                if (text.length < correctWord.length) {
                    setText(correctWord.substring(0, text.length + 1));
                } else {
                     // Pause after correcting
                     setTimeout(() => {
                        setLoopNum(loopNum + 1); // This will trigger the reset useEffect
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
        
        const currentText = text;
        const speed = isDeleting ? deletingSpeed : typingSpeed;
        typingTimeout = setTimeout(handleTyping, speed);

        return () => clearTimeout(typingTimeout);
    }, [text, isDeleting, isCorrecting, loopNum]);
    
    useEffect(() => {
        // Reset for the next loop
        setText('');
        setIsDeleting(false);
        setIsCorrecting(false);
    }, [loopNum]);


    return (
        <p className="text-lg text-muted-foreground">
            <span className={cn(
                "font-medium transition-colors duration-300",
                isCorrecting ? "text-green-400" : "text-red-400"
            )}>
                 {text}
                 <span className="animate-pulse">|</span>
            </span>
            {isCorrecting ? sentenceSuffix : sentenceSuffix}
        </p>
    );
};
