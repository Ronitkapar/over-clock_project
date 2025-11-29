import { createClient } from '@/lib/supabase/client';
import { Endpoint } from '@/types/endpoint';

export const endpointService = {
    async getEndpoints(workspaceId: string): Promise<Endpoint[]> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('endpoints')
            .select('*')
            .eq('workspace_id', workspaceId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async createEndpoint(endpoint: Omit<Endpoint, 'id' | 'createdAt' | 'updatedAt'>): Promise<Endpoint> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('endpoints')
            .insert([{
                workspace_id: endpoint.workspaceId,
                method: endpoint.method,
                path: endpoint.path,
                description: endpoint.description,
                status_code: endpoint.statusCode,
                delay_ms: endpoint.delayMs,
                error_rate: endpoint.errorRate,
                custom_headers: endpoint.customHeaders,
                is_active: endpoint.isActive,
                sample_response: endpoint.sampleResponse,
                response_schema: endpoint.responseSchema,
                request_schema: endpoint.requestSchema,
            }])
            .select()
            .single();

        if (error) {
            console.error('Supabase createEndpoint error:', error);
            throw error;
        }
        return data;
    },

    async updateEndpoint(id: string, updates: Partial<Endpoint>): Promise<Endpoint> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('endpoints')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteEndpoint(id: string): Promise<void> {
        const supabase = createClient();
        const { error } = await supabase
            .from('endpoints')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};
