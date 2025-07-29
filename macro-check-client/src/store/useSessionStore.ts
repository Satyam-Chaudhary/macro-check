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

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  theme: 'dark', // Default to dark mode
  
  setSession: (session) => set({ session }),
  
  clearSession: () => set({ session: null }),
  
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
}));