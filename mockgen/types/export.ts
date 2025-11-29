export type ExportType = 'openapi' | 'express' | 'fastapi' | 'fiber' | 'json' | 'postman';

export interface ExportOptions {
    format: ExportType;
    includeMockData: boolean;
}

export interface OpenAPISpec {
    openapi: string;
    info: {
        title: string;
        description?: string;
        version: string;
    };
    servers: Array<{ url: string }>;
    paths: Record<string, any>;
    components?: {
        schemas?: Record<string, any>;
    };
}

export interface PostmanCollection {
    info: {
        name: string;
        description?: string;
        schema: string;
    };
    item: any[];
}
