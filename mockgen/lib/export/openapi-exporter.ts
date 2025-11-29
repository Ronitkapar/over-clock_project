import { Endpoint } from '@/types/endpoint';
import { OpenAPISpec } from '@/types/export';

interface APIBlueprint {
    name: string;
    description: string;
    baseUrl: string;
    endpoints: Endpoint[];
    models?: any[];
}

export function generateOpenAPISpec(blueprint: APIBlueprint): OpenAPISpec {
    const paths: Record<string, any> = {};

    blueprint.endpoints.forEach(endpoint => {
        if (!paths[endpoint.path]) {
            paths[endpoint.path] = {};
        }

        const method = endpoint.method.toLowerCase();

        paths[endpoint.path][method] = {
            summary: endpoint.description || `${endpoint.method} ${endpoint.path}`,
            responses: {
                [endpoint.statusCode]: {
                    description: 'Successful response',
                    content: {
                        'application/json': {
                            schema: endpoint.responseSchema || {},
                            example: endpoint.sampleResponse
                        }
                    }
                }
            }
        };

        if (endpoint.requestSchema && ['post', 'put', 'patch'].includes(method)) {
            paths[endpoint.path][method].requestBody = {
                content: {
                    'application/json': {
                        schema: endpoint.requestSchema
                    }
                }
            };
        }
    });

    return {
        openapi: '3.0.0',
        info: {
            title: blueprint.name,
            description: blueprint.description,
            version: '1.0.0'
        },
        servers: [{ url: blueprint.baseUrl }],
        paths: paths,
        components: {
            schemas: {} // TODO: Populate if models are provided
        }
    };
}
