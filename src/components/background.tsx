"use client";
import React, { useMemo, useState, useEffect } from 'react';
import { Book, MessageSquare, Pen, Type, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const icons = [Book, MessageSquare, Pen, Type, FileText];

const Background = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden" />
    );
};

export { Background };
