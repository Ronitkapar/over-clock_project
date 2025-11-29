import { create } from 'zustand';
import { Workspace } from '@/types/workspace';

interface WorkspaceStore {
    workspaces: Workspace[];
    currentWorkspace: Workspace | null;
    isLoading: boolean;

    setWorkspaces: (workspaces: Workspace[]) => void;
    setCurrentWorkspace: (workspace: Workspace | null) => void;
    setLoading: (loading: boolean) => void;
    addWorkspace: (workspace: Workspace) => void;
    updateWorkspace: (id: string, data: Partial<Workspace>) => void;
    removeWorkspace: (id: string) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
    workspaces: [],
    currentWorkspace: null,
    isLoading: false,

    setWorkspaces: (workspaces) => set({ workspaces }),
    setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
    setLoading: (isLoading) => set({ isLoading }),

    addWorkspace: (workspace) => set((state) => ({
        workspaces: [...state.workspaces, workspace]
    })),

    updateWorkspace: (id, data) => set((state) => ({
        workspaces: state.workspaces.map((w) =>
            w.id === id ? { ...w, ...data } : w
        ),
        currentWorkspace: state.currentWorkspace?.id === id
            ? { ...state.currentWorkspace, ...data }
            : state.currentWorkspace
    })),

    removeWorkspace: (id) => set((state) => ({
        workspaces: state.workspaces.filter((w) => w.id !== id),
        currentWorkspace: state.currentWorkspace?.id === id ? null : state.currentWorkspace
    })),
}));
