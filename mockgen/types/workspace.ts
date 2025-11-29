export interface Workspace {
    id: string;
    userId: string;
    name: string;
    description?: string;
    settings: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export interface CreateWorkspaceInput {
    name: string;
    description?: string;
}

export interface UpdateWorkspaceInput {
    name?: string;
    description?: string;
    settings?: Record<string, any>;
}
