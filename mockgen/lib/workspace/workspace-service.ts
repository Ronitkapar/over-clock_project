import { createClient } from '@/lib/supabase/client';
import { Workspace, CreateWorkspaceInput, UpdateWorkspaceInput } from '@/types/workspace';

export const workspaceService = {
    async getWorkspaces(): Promise<Workspace[]> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('workspaces')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async createWorkspace(input: CreateWorkspaceInput): Promise<Workspace> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('workspaces')
            .insert([{
                name: input.name,
                description: input.description,
                settings: {},
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateWorkspace(id: string, input: UpdateWorkspaceInput): Promise<Workspace> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('workspaces')
            .update(input)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteWorkspace(id: string): Promise<void> {
        const supabase = createClient();
        const { error } = await supabase
            .from('workspaces')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};
