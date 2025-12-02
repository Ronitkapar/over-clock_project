import { NextRequest, NextResponse } from 'next/server';
import { MockStore } from '@/lib/storage/mockStore';

/**
 * GET /api/mock-definitions
 * List all mock definitions for a workspace
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const workspaceId = searchParams.get('workspace_id');
        const activeOnly = searchParams.get('active_only') === 'true';

        if (!workspaceId) {
            return NextResponse.json(
                { error: 'workspace_id is required' },
                { status: 400 }
            );
        }

        const mocks = await MockStore.listMocks(workspaceId, activeOnly);
        return NextResponse.json({ mocks }, { status: 200 });
    } catch (error: any) {
        console.error('List mocks error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to list mocks' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/mock-definitions
 * Create a new mock definition
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validate required fields
        if (!body.workspace_id || !body.name || !body.method || !body.path) {
            return NextResponse.json(
                { error: 'Missing required fields: workspace_id, name, method, path' },
                { status: 400 }
            );
        }

        const mock = await MockStore.createMock(body);
        return NextResponse.json({ mock }, { status: 201 });
    } catch (error: any) {
        console.error('Create mock error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create mock' },
            { status: 500 }
        );
    }
}
