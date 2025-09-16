"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { database } from '@/lib/firebase';
import { ref, onValue, set, off } from 'firebase/database';

type HistoryState = {
  past: string[];
  present: string;
  future: string[];
};

const getLocalStorageKey = (userId: string) => `editorHistory_${userId}`;

export const useEditorHistory = ({ userId }: { userId?: string }) => {
  const [state, setState] = useState<HistoryState>({
    past: [],
    present: '',
    future: [],
  });
  const [isLoaded, setIsLoaded] = useState(false);

  const localStateRef = useRef<HistoryState | null>(null);

  // Load from localStorage on initial render
  useEffect(() => {
    if (!userId) return;
    try {
      const savedStateJSON = localStorage.getItem(getLocalStorageKey(userId));
      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);
        // We store it in a ref to avoid re-triggering effects,
        // and apply it after Firebase data is loaded.
        localStateRef.current = savedState;
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
    }
  }, [userId]);


  // Load data from Firebase
  useEffect(() => {
    if (!userId) return;
    
    const userEditorRef = ref(database, `users/${userId}/editorContent`);
    const onDataChange = (snapshot: any) => {
        let firebaseContent: string | null = null;
        if (snapshot.exists()) {
            firebaseContent = snapshot.val();
        }

        if (localStateRef.current) {
            // If local state is more recent, we might want to ask the user
            // For now, let's just use the local state as it includes history
            setState(localStateRef.current);
        } else if (firebaseContent !== null) {
            setState(s => ({...s, present: firebaseContent}));
        }
        setIsLoaded(true);
    };

    onValue(userEditorRef, onDataChange, { onlyOnce: true }); // Load only once

    return () => {
      off(userEditorRef, 'value', onDataChange);
    };
  }, [userId]);


  // Save content to Firebase (debounced)
  useEffect(() => {
    if (!userId || !isLoaded) return;
    
    const handler = setTimeout(() => {
        const userEditorRef = ref(database, `users/${userId}/editorContent`);
        set(userEditorRef, state.present);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [state.present, userId, isLoaded]);

  // Save history to localStorage
  useEffect(() => {
    if (!userId || !isLoaded) return;
    try {
        localStorage.setItem(getLocalStorageKey(userId), JSON.stringify(state));
    } catch (error) {
        console.error("Failed to save state to localStorage", error);
    }
  }, [state, userId, isLoaded]);


  const setContent = useCallback((newPresent: string) => {
    setState(currentState => {
      if (newPresent === currentState.present) {
        return currentState;
      }
      return {
        past: [...currentState.past, currentState.present],
        present: newPresent,
        future: [],
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState(currentState => {
      const { past, present, future } = currentState;
      if (past.length === 0) {
        return currentState;
      }
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState(currentState => {
      const { past, present, future } = currentState;
      if (future.length === 0) {
        return currentState;
      }
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  return {
    content: state.present,
    setContent,
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
};
