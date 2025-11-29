import { create } from 'zustand';
import { Endpoint } from '@/types/endpoint';

interface EndpointStore {
    endpoints: Endpoint[];
    currentEndpoint: Endpoint | null;
    isLoading: boolean;

    setEndpoints: (endpoints: Endpoint[]) => void;
    setCurrentEndpoint: (endpoint: Endpoint | null) => void;
    setLoading: (loading: boolean) => void;
    addEndpoint: (endpoint: Endpoint) => void;
    updateEndpoint: (id: string, data: Partial<Endpoint>) => void;
    removeEndpoint: (id: string) => void;
}

export const useEndpointStore = create<EndpointStore>((set) => ({
    endpoints: [],
    currentEndpoint: null,
    isLoading: false,

    setEndpoints: (endpoints) => set({ endpoints }),
    setCurrentEndpoint: (endpoint) => set({ currentEndpoint: endpoint }),
    setLoading: (isLoading) => set({ isLoading }),

    addEndpoint: (endpoint) => set((state) => ({
        endpoints: [...state.endpoints, endpoint]
    })),

    updateEndpoint: (id, data) => set((state) => ({
        endpoints: state.endpoints.map((e) =>
            e.id === id ? { ...e, ...data } : e
        ),
        currentEndpoint: state.currentEndpoint?.id === id
            ? { ...state.currentEndpoint, ...data }
            : state.currentEndpoint
    })),

    removeEndpoint: (id) => set((state) => ({
        endpoints: state.endpoints.filter((e) => e.id !== id),
        currentEndpoint: state.currentEndpoint?.id === id ? null : state.currentEndpoint
    })),
}));
