import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { endpointService } from '@/lib/workspace/endpoint-service';
import { Endpoint } from '@/types/endpoint';

export function useEndpoints(workspaceId: string) {
    return useQuery({
        queryKey: ['endpoints', workspaceId],
        queryFn: () => endpointService.getEndpoints(workspaceId),
        enabled: !!workspaceId,
    });
}

export function useCreateEndpoint() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (endpoint: Omit<Endpoint, 'id' | 'createdAt' | 'updatedAt'>) =>
            endpointService.createEndpoint(endpoint),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['endpoints', data.workspaceId] });
        },
    });
}

export function useUpdateEndpoint() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Endpoint> }) =>
            endpointService.updateEndpoint(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['endpoints', data.workspaceId] });
        },
    });
}

export function useDeleteEndpoint() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, workspaceId }: { id: string; workspaceId: string }) =>
            endpointService.deleteEndpoint(id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['endpoints', variables.workspaceId] });
        },
    });
}
