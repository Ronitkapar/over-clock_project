import { generateOpenAPISpec } from '../lib/export/openapi-exporter';
import { generateExpressRoutes } from '../lib/export/code-generator/express-generator';
import { generateFastAPIRoutes } from '../lib/export/code-generator/fastapi-generator';
import { generateFiberRoutes } from '../lib/export/code-generator/fiber-generator';
import { generateJSONExport } from '../lib/export/json-exporter';
import { generatePostmanCollection } from '../lib/export/postman-exporter';
import { Endpoint } from '../types/endpoint';

const mockEndpoints: Endpoint[] = [
    {
        id: '1',
        workspaceId: 'ws-1',
        method: 'GET',
        path: '/users',
        description: 'Get all users',
        statusCode: 200,
        delayMs: 0,
        errorRate: 0,
        customHeaders: {},
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sampleResponse: [{ id: 1, name: 'John Doe' }],
        responseSchema: { type: 'array', items: { type: 'object' } }
    },
    {
        id: '2',
        workspaceId: 'ws-1',
        method: 'POST',
        path: '/users',
        description: 'Create a user',
        statusCode: 201,
        delayMs: 0,
        errorRate: 0,
        customHeaders: {},
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sampleResponse: { id: 2, name: 'Jane Doe' },
        requestSchema: { type: 'object', properties: { name: { type: 'string' } } },
        responseSchema: { type: 'object' }
    }
];

const mockBlueprint = {
    name: 'Test API',
    description: 'A test API for verification',
    baseUrl: 'https://api.example.com',
    endpoints: mockEndpoints
};

async function runTests() {
    console.log('--- Testing OpenAPI Export ---');
    console.log(JSON.stringify(generateOpenAPISpec(mockBlueprint), null, 2));

    console.log('\n--- Testing Express Export ---');
    console.log(generateExpressRoutes(mockEndpoints));

    console.log('\n--- Testing FastAPI Export ---');
    console.log(generateFastAPIRoutes(mockEndpoints));

    console.log('\n--- Testing Fiber Export ---');
    console.log(generateFiberRoutes(mockEndpoints));

    console.log('\n--- Testing JSON Export ---');
    console.log(generateJSONExport(mockBlueprint));

    console.log('\n--- Testing Postman Export ---');
    console.log(JSON.stringify(generatePostmanCollection(mockBlueprint), null, 2));
}

runTests().catch(console.error);
