"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const TypingAnimation = () => {
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCorrecting, setIsCorrecting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);

    const incorrectWord = "Their";
    const correctWord = "They're";
    const sentenceSuffix = " going to the store.";
    const typingSpeed = 150;
    const deletingSpeed = 100;
    const pauseBeforeDelete = 2000;
    const pauseAfterCorrect = 3000;

    useEffect(() => {
        let typingTimeout: NodeJS.Timeout;

        const handleTyping = () => {
            const currentWord = isCorrecting ? correctWord : incorrectWord;

            if (isDeleting) {
                // Deleting incorrect word
                setText(currentWord.substring(0, text.length - 1));
                if (text === "") {
                    setIsDeleting(false);
                    setIsCorrecting(true); // Start correcting
                }
            } else {
                // Typing incorrect or correct word
                setText(currentWord.substring(0, text.length + 1));

                // Finished typing word
                if (text === currentWord) {
                    if (isCorrecting) {
                        // Paused after correcting
                        setTimeout(() => {
                           // Reset for next loop
                           setIsCorrecting(false);
                           setLoopNum(loopNum + 1);
                        }, pauseAfterCorrect);
                    } else {
                        // Paused before deleting
                        setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
                    }
                }
            }
        };
        
        // This sets the speed of typing/deleting
        typingTimeout = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);

        return () => clearTimeout(typingTimeout);
    }, [text, isDeleting, isCorrecting, loopNum]);
    
    useEffect(() => {
        // Initial state for each loop
        setText('');
        setIsDeleting(false);
        setIsCorrecting(false);
    }, [loopNum]);


    return (
        <p className="text-lg text-muted-foreground">
            Turn{" "}
            <span className={cn(
                "font-medium transition-colors duration-300",
                isCorrecting ? "text-green-400" : "text-red-400"
            )}>
                 &quot;{text}<span className="animate-pulse">|</span>{sentenceSuffix}&quot;
            </span>
            {" "}
            into the right one with a single click.
        </p>
    );
};
