import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workspaceService } from '@/lib/workspace/workspace-service';
import { CreateWorkspaceInput, UpdateWorkspaceInput } from '@/types/workspace';

export function useWorkspaces() {
    return useQuery({
        queryKey: ['workspaces'],
        queryFn: workspaceService.getWorkspaces,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useCreateWorkspace() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateWorkspaceInput) => workspaceService.createWorkspace(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
        },
    });
}

export function useUpdateWorkspace() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateWorkspaceInput }) =>
            workspaceService.updateWorkspace(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
        },
    });
}

export function useDeleteWorkspace() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => workspaceService.deleteWorkspace(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
        },
    });
}
