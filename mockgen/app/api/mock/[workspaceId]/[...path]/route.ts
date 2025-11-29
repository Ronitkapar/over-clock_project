import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

    try {
        // Get endpoint from database
        const supabase = await createClient();
        const { data: endpoint, error } = await supabase
            .from('endpoints')
            .select('*')
            .eq('workspace_id', workspaceId)
            .eq('method', method)
            .eq('path', requestPath)
            .eq('is_active', true)
            .single();

        if (error || !endpoint) {
            return NextResponse.json(
                {
                    error: 'Endpoint not found',
                    message: `No active endpoint found for ${method} ${requestPath} in workspace ${workspaceId}`
                },
                { status: 404 }
            );
        }

        // Simulate delay if configured
        if (endpoint.delay_ms > 0) {
            await new Promise(resolve => setTimeout(resolve, endpoint.delay_ms));
        }

        // Simulate error if configured
        if (endpoint.error_rate > 0) {
            const shouldError = Math.random() < (endpoint.error_rate / 100);
            if (shouldError) {
                return NextResponse.json(
                    { error: 'Simulated error', message: 'This error was configured for testing' },
                    { status: 500 }
                );
            }
        }

        // Return mock response
        return NextResponse.json(
            endpoint.sample_response || { message: 'No sample response configured' },
            {
                status: endpoint.status_code || 200,
                headers: endpoint.custom_headers || {}
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
