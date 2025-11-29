import { create } from 'zustand';

interface UIStore {
    isSidebarOpen: boolean;
    activeTab: string;
    theme: 'light' | 'dark' | 'system';

    toggleSidebar: () => void;
    setSidebarOpen: (isOpen: boolean) => void;
    setActiveTab: (tab: string) => void;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useUIStore = create<UIStore>((set) => ({
    isSidebarOpen: true,
    activeTab: 'dashboard',
    theme: 'system',

    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
    setActiveTab: (tab) => set({ activeTab: tab }),
    setTheme: (theme) => set({ theme }),
}));
