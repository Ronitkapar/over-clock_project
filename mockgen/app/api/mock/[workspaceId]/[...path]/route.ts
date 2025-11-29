import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { EndpointMatcher } from '@/lib/mock-server/matcher';
import { RequestValidator } from '@/lib/validation/request-validator';
import { ResponseSimulator } from '@/lib/mock-server/simulator';
import { RateLimiter } from '@/lib/rate-limit/rate-limiter';
import { Endpoint } from '@/types/endpoint';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ workspaceId: string; path: string[] }> }
) {
    const resolvedParams = await params;
    return handleMockRequest(request, resolvedParams, 'GET');
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ workspaceId: string; path: string[] }> }
) {
    const resolvedParams = await params;
    return handleMockRequest(request, resolvedParams, 'POST');
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ workspaceId: string; path: string[] }> }
) {
    const resolvedParams = await params;
    return handleMockRequest(request, resolvedParams, 'PUT');
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ workspaceId: string; path: string[] }> }
) {
    const resolvedParams = await params;
    return handleMockRequest(request, resolvedParams, 'DELETE');
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ workspaceId: string; path: string[] }> }
) {
    const resolvedParams = await params;
    return handleMockRequest(request, resolvedParams, 'PATCH');
}

async function handleMockRequest(
    request: NextRequest,
    params: { workspaceId: string; path: string[] },
    method: string
) {
    const { workspaceId, path } = params;
    const requestPath = '/' + path.join('/');
    const supabase = await createClient();
    const startTime = Date.now();

    try {
        // 0. Rate Limiting Check
        const rateLimitResult = await RateLimiter.checkWorkspace(request, workspaceId, {
            capacity: 100,      // 100 requests
            refillRate: 1.67,   // ~100 per minute (100/60 = 1.67/sec)
            cost: 1
        });

        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                {
                    error: 'Rate Limit Exceeded',
                    message: 'Too many requests. Please try again later.',
                    retryAfter: rateLimitResult.retryAfter
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(rateLimitResult.retryAfter || 60)
                    }
                }
            );
        }

        // 1. Fetch all active endpoints for this workspace and method
        const { data: dbEndpoints, error } = await supabase
            .from('endpoints')
            .select('*')
            .eq('workspace_id', workspaceId)
            .eq('method', method)
            .eq('is_active', true);

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json(
                { error: 'Database error', message: error.message },
                { status: 500 }
            );
        }

        // Map DB result to Endpoint type
        const endpoints: Endpoint[] = (dbEndpoints || []).map((e: any) => ({
            id: e.id,
            workspaceId: e.workspace_id,
            blueprintId: e.blueprint_id,
            method: e.method,
            path: e.path,
            description: e.description,
            requestSchema: e.request_schema,
            responseSchema: e.response_schema,
            sampleResponse: e.sample_response,
            statusCode: e.status_code,
            delayMs: e.delay_ms,
            errorRate: e.error_rate,
            customHeaders: e.custom_headers,
            isActive: e.is_active,
            createdAt: e.created_at,
            updatedAt: e.updated_at
        }));

        // 2. Find matching endpoint
        const endpoint = EndpointMatcher.match(endpoints, method, requestPath);

        if (!endpoint) {
            return NextResponse.json(
                {
                    error: 'Endpoint not found',
                    message: `No active endpoint found for ${method} ${requestPath} in workspace ${workspaceId}`
                },
                { status: 404 }
            );
        }

        // 3. Validate Request Body (for POST/PUT/PATCH)
        let requestBody = null;
        if (['POST', 'PUT', 'PATCH'].includes(method)) {
            try {
                const text = await request.text();
                if (text) {
                    requestBody = JSON.parse(text);
                }
            } catch (e) {
                if (endpoint.requestSchema) {
                    return NextResponse.json(
                        { error: 'Invalid JSON body' },
                        { status: 400 }
                    );
                }
            }

            if (endpoint.requestSchema && requestBody) {
                const validation = RequestValidator.validate(requestBody, endpoint.requestSchema);
                if (!validation.valid) {
                    return NextResponse.json(
                        {
                            error: 'Validation Error',
                            details: validation.errors
                        },
                        { status: 400 }
                    );
                }
            }
        }

        // 4. Simulate Response (Delay & Error)
        const simulation = await ResponseSimulator.simulate(endpoint);

        let responseBody = simulation.response;
        let responseStatus = simulation.status;

        if (!simulation.isError) {
            responseBody = endpoint.sampleResponse || { message: 'No sample response configured' };
            responseStatus = endpoint.statusCode || 200;
        }

        // 5. Log Request
        const endTime = Date.now();
        const duration = endTime - startTime;

        // Fire and forget logging
        // We don't await this to avoid slowing down the response
        supabase.from('request_history').insert({
            workspace_id: workspaceId,
            endpoint_id: endpoint.id,
            method: method,
            url: requestPath,
            headers: Object.fromEntries(request.headers),
            body: requestBody,
            response_body: responseBody,
            response_status: responseStatus,
            response_time_ms: duration
        }).then(({ error }) => {
            if (error) console.error('Failed to log request:', error);
        });

        return NextResponse.json(
            responseBody,
            {
                status: responseStatus,
                headers: endpoint.customHeaders || {}
            }
        );

    } catch (error) {
        console.error('Mock server error:', error);
        return NextResponse.json(
            { error: 'Internal server error', message: String(error) },
            { status: 500 }
        );
    }
}
