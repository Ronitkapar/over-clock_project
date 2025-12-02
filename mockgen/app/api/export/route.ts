import { NextRequest, NextResponse } from 'next/server';
import { MockStore } from '@/lib/storage/mockStore';

/**
 * GET /api/export
 * Export all mock definitions for a workspace as JSON
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const workspaceId = searchParams.get('workspace_id');

        if (!workspaceId) {
            return NextResponse.json(
                { error: 'workspace_id is required' },
                { status: 400 }
            );
        }

        const mocks = await MockStore.listMocks(workspaceId);

        const exportData = {
            version: '1.0',
            exported_at: new Date().toISOString(),
            workspace_id: workspaceId,
            mocks: mocks.map(({ id, created_at, updated_at, ...rest }) => rest),
        };

        return new NextResponse(JSON.stringify(exportData, null, 2), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="mocks-${workspaceId}-${Date.now()}.json"`,
            },
        });
    } catch (error: any) {
        console.error('Export error:', error);
        return NextResponse.json(
            { error: error.message || 'Export failed' },
            { status: 500 }
        );
    }
}
