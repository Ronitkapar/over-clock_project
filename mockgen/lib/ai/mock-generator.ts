import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import type { MockDefinition } from '@/lib/storage/mockStore';

const mockDefinitionSchema = z.object({
    name: z.string().describe('Short descriptive name for the mock endpoint'),
    description: z.string().optional().describe('Detailed description of what this endpoint does'),
    method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).describe('HTTP method'),
    path: z.string().describe('API path, e.g., /users/:id'),
    request_schema: z.any().optional().describe('JSON schema for request body validation'),
    response_schema: z.any().optional().describe('JSON schema for the response structure'),
    response_data: z.any().describe('Sample response data matching the response schema'),
    status_code: z.number().default(200).describe('HTTP status code to return'),
    delay_ms: z.number().default(0).describe('Simulated delay in milliseconds'),
    error_rate: z.number().min(0).max(1).default(0).describe('Probability of returning an error (0-1)'),
});

export interface GenerateMockInput {
    prompt: string;
    workspace_id: string;
}

/**
 * Generate a complete mock definition from a natural language prompt using AI
 */
export async function generateMockFromPrompt(input: GenerateMockInput) {
    const systemPrompt = `You are an expert API designer. Generate realistic and well-structured mock API endpoints.

Guidelines:
- Create proper REST-style paths with parameters when needed (e.g., /users/:id)
- Generate realistic sample data that matches the schema
- Include appropriate request schemas for POST/PUT/PATCH methods
- Use standard HTTP status codes (200, 201, 204, 400, 404, etc.)
- Keep response data simple but realistic
- For arrays, include 3-5 sample items
- Use common data types: string, number, boolean, object, array
- For user data, include realistic names, emails, etc.
- For timestamps, use ISO 8601 format
- For IDs, use UUIDs or sequential integers

Examples:
- "user endpoint" → GET /users, returns array of users with id, name, email
- "create post" → POST /posts, accepts title & content, returns created post
- "product detail" → GET /products/:id, returns single product with details`;

    try {
        const result = await generateObject({
            model: openai('gpt-4o'),
            schema: mockDefinitionSchema,
            system: systemPrompt,
            prompt: `Create a mock API endpoint for: ${input.prompt}`,
        });

        return {
            ...result.object,
            workspace_id: input.workspace_id,
            is_active: true,
        };
    } catch (error) {
        console.error('AI mock generation error:', error);
        throw new Error('Failed to generate mock from AI');
    }
}

/**
 * Generate realistic sample data based on a JSON schema
 */
export async function generateSampleData(schema: any) {
    const systemPrompt = `You are a data generator. Create realistic sample data that matches the given JSON schema.
  
Guidelines:
- Use realistic values (real-looking names, emails, addresses, etc.)
- For arrays, generate 3-5 items
- For dates, use ISO 8601 format
- For IDs, use UUIDs or sequential integers
- Keep data simple and clean`;

    try {
        const result = await generateObject({
            model: openai('gpt-4o'),
            schema: z.object({
                data: z.any().describe('Sample data matching the provided schema'),
            }),
            system: systemPrompt,
            prompt: `Generate sample data for this schema: ${JSON.stringify(schema, null, 2)}`,
        });

        return result.object.data;
    } catch (error) {
        console.error('Sample data generation error:', error);
        throw new Error('Failed to generate sample data');
    }
}
