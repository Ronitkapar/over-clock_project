import { Endpoint } from '@/types/endpoint';
import { PostmanCollection } from '@/types/export';

interface APIBlueprint {
    name: string;
    description: string;
    baseUrl: string;
    endpoints: Endpoint[];
}

export function generatePostmanCollection(blueprint: APIBlueprint): PostmanCollection {
    return {
        info: {
            name: blueprint.name,
            description: blueprint.description,
            schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
        },
        item: blueprint.endpoints.map(endpoint => ({
            name: endpoint.description || `${endpoint.method} ${endpoint.path}`,
            request: {
                method: endpoint.method,
                header: Object.entries(endpoint.customHeaders || {}).map(([key, value]) => ({
                    key,
                    value,
                    type: 'text'
                })),
                url: {
                    raw: `${blueprint.baseUrl}${endpoint.path}`,
                    host: [blueprint.baseUrl],
                    path: endpoint.path.split('/').filter(Boolean)
                },
                body: endpoint.requestSchema ? {
                    mode: 'raw',
                    raw: JSON.stringify(endpoint.sampleResponse, null, 2), // Using sample response as body placeholder for now
                    options: {
                        raw: {
                            language: 'json'
                        }
                    }
                } : undefined
            },
            response: [
                {
                    name: 'Example Response',
                    originalRequest: {
                        method: endpoint.method,
                        header: [],
                        url: {
                            raw: `${blueprint.baseUrl}${endpoint.path}`,
                            host: [blueprint.baseUrl],
                            path: endpoint.path.split('/').filter(Boolean)
                        }
                    },
                    status: 'OK',
                    code: endpoint.statusCode,
                    _postman_previewlanguage: 'json',
                    header: [],
                    cookie: [],
                    body: JSON.stringify(endpoint.sampleResponse, null, 2)
                }
            ]
        }))
    };
}
