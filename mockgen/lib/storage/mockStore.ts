import { createClient } from '@/lib/supabase/client';

export interface MockDefinition {
    id: string;
    workspace_id: string;
    name: string;
    description?: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';
    path: string;
    request_schema?: any;
    response_schema?: any;
    response_data?: any;
    status_code: number;
    delay_ms: number;
    error_rate: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateMockInput {
    workspace_id: string;
    name: string;
    description?: string;
    method: MockDefinition['method'];
    path: string;
    request_schema?: any;
    response_schema?: any;
    response_data?: any;
    status_code?: number;
    delay_ms?: number;
    error_rate?: number;
    is_active?: boolean;
}

export interface UpdateMockInput {
    name?: string;
    description?: string;
    method?: MockDefinition['method'];
    path?: string;
    request_schema?: any;
    response_schema?: any;
    response_data?: any;
    status_code?: number;
    delay_ms?: number;
    error_rate?: number;
    is_active?: boolean;
}

export class MockStore {
    /**
     * Create a new mock definition
     */
    static async createMock(input: CreateMockInput): Promise<MockDefinition> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('mock_definitions')
            .insert(input)
            .select()
            .single();

        if (error) throw new Error(`Failed to create mock: ${error.message}`);
        return data;
    }

    /**
     * Get a single mock definition by ID
     */
    static async getMock(id: string): Promise<MockDefinition | null> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('mock_definitions')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            throw new Error(`Failed to get mock: ${error.message}`);
        }
        return data;
    }

    /**
     * List all mock definitions for a workspace
     */
    static async listMocks(workspaceId: string, activeOnly = false): Promise<MockDefinition[]> {
        const supabase = createClient();
        let query = supabase
            .from('mock_definitions')
            .select('*')
            .eq('workspace_id', workspaceId)
            .order('created_at', { ascending: false });

        if (activeOnly) {
            query = query.eq('is_active', true);
        }

        const { data, error } = await query;

        if (error) throw new Error(`Failed to list mocks: ${error.message}`);
        return data || [];
    }

    /**
     * Update a mock definition
     */
    static async updateMock(id: string, input: UpdateMockInput): Promise<MockDefinition> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('mock_definitions')
            .update(input)
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(`Failed to update mock: ${error.message}`);
        return data;
    }

    /**
     * Delete a mock definition
     */
    static async deleteMock(id: string): Promise<void> {
        const supabase = createClient();
        const { error } = await supabase
            .from('mock_definitions')
            .delete()
            .eq('id', id);

        if (error) throw new Error(`Failed to delete mock: ${error.message}`);
    }

    /**
     * Duplicate a mock definition
     */
    static async duplicateMock(id: string): Promise<MockDefinition> {
        const original = await this.getMock(id);
        if (!original) throw new Error('Mock not found');

        const { id: _, created_at: __, updated_at: ___, ...mockData } = original;
        const duplicate = await this.createMock({
            ...mockData,
            name: `${mockData.name} (Copy)`,
        });

        return duplicate;
    }

    /**
     * Find mocks matching a specific path and method for routing
     */
    static async findMatchingMocks(
        workspaceId: string,
        method: string,
        path: string
    ): Promise<MockDefinition[]> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('mock_definitions')
            .select('*')
            .eq('workspace_id', workspaceId)
            .eq('method', method)
            .eq('is_active', true);

        if (error) throw new Error(`Failed to find matching mocks: ${error.message}`);
        return data || [];
    }
}
