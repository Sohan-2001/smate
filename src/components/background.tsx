"use client";
import React, { useMemo } from 'react';
import { Book, MessageSquare, Pen, Type, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const icons = [Book, MessageSquare, Pen, Type, FileText];

const Background = () => {
    const particles = useMemo(() => {
        return Array.from({ length: 30 }).map((_, i) => {
            const Icon = icons[Math.floor(Math.random() * icons.length)];
            const size = Math.floor(Math.random() * 40) + 20;
            const duration = Math.random() * 20 + 20;
            const delay = Math.random() * 10;
            const startX = Math.random() * 100;
            const startY = Math.random() * 100;
            const endX = Math.random() * 100;
            const endY = Math.random() * 100;

            return (
                <div
                    key={i}
                    className="absolute text-foreground/10"
                    style={
                        {
                            '--size': `${size}px`,
                            '--duration': `${duration}s`,
                            '--delay': `${delay}s`,
                            '--start-x': `${startX}vw`,
                            '--start-y': `${startY}vh`,
                            '--end-x': `${endX}vw`,
                            '--end-y': `${endY}vh`,
                            animation: `move var(--duration) linear infinite var(--delay)`,
                        } as React.CSSProperties
                    }
                >
                    <Icon style={{ width: 'var(--size)', height: 'var(--size)' }} />
                </div>
            );
        });
    }, []);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            <style jsx>{`
                @keyframes move {
                    from {
                        transform: translate(var(--start-x), var(--start-y));
                        opacity: 0;
                    }
                    25% {
                      opacity: 1;
                    }
                    75% {
                      opacity: 1;
                    }
                    to {
                        transform: translate(var(--end-x), var(--end-y));
                        opacity: 0;
                    }
                }
            `}</style>
            {particles}
        </div>
    );
};

export { Background };
