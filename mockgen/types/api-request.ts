export interface APIRequest {
    id: string;
    workspaceId: string;
    endpointId?: string;
    method: string;
    url: string;
    headers?: Record<string, string>;
    body?: any;
    responseBody?: any;
    responseStatus?: number;
    responseTimeMs?: number;
    createdAt: string;
}
