import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const workspaceId = searchParams.get('workspaceId');
    const format = searchParams.get('format') || 'json';

    if (!workspaceId) {
        return NextResponse.json({ error: 'Workspace ID is required' }, { status: 400 });
    }

    try {
        const supabase = await createClient();
        const { data: endpoints, error } = await supabase
            .from('endpoints')
            .select('*')
            .eq('workspace_id', workspaceId);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (format === 'openapi') {
            interface OpenAPISpec {
                openapi: string;
                info: { title: string; version: string };
                paths: Record<string, any>;
            }

            // Basic OpenAPI generation
            const openApiSpec: OpenAPISpec = {
                openapi: '3.0.0',
                info: {
                    title: 'Mock API Export',
                    version: '1.0.0',
                },
                paths: {},
            };

            endpoints?.forEach((endpoint) => {
                const path = endpoint.path;
                const method = endpoint.method.toLowerCase();

                if (!openApiSpec.paths[path]) {
                    openApiSpec.paths[path] = {};
                }

                openApiSpec.paths[path][method] = {
                    description: endpoint.description,
                    responses: {
                        [endpoint.status_code]: {
                            description: 'Sample response',
                            content: {
                                'application/json': {
                                    schema: endpoint.response_schema || {},
                                    example: endpoint.sample_response,
                                },
                            },
                        },
                    },
                };
            });

            return NextResponse.json(openApiSpec);
        }

        // Default to raw JSON export of endpoints
        return NextResponse.json(endpoints);

    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
