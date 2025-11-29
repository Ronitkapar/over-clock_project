import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

interface AuthStore {
    user: User | null;
    session: any | null;
    isLoading: boolean;

    setUser: (user: User | null) => void;
    setSession: (session: any | null) => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    session: null,
    isLoading: true,

    setUser: (user) => set({ user }),
    setSession: (session) => set({ session }),
    setLoading: (isLoading) => set({ isLoading }),
}));
