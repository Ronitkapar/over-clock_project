export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';

export interface Endpoint {
    id: string;
    workspaceId: string;
    blueprintId?: string;
    method: HTTPMethod;
    path: string;
    description?: string;
    requestSchema?: any;
    responseSchema?: any;
    sampleResponse?: any;
    statusCode: number;
    delayMs: number;
    errorRate: number;
    customHeaders: Record<string, string>;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
