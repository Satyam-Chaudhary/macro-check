import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';

type Theme = 'light' | 'dark';

interface SessionState {
    session: Session | null;
    theme: Theme;
    setSession: (session: Session | null) => void;
    clearSession: () => void;
    toggleTheme: () => void;
}

// Create the store
export const useSessionStore = create<SessionState>((set) => ({
    // Initial state
    session: null,

    theme: 'dark',
    // Action to update the session
    setSession: (session) => set({ session }),

    // Action to clear the session (for logout)
    clearSession: () => set({ session: null }),

    toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
}));