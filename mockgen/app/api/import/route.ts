import { NextRequest, NextResponse } from 'next/server';
import { MockStore } from '@/lib/storage/mockStore';

/**
 * POST /api/import
 * Import mock definitions from a JSON file
 */
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const workspaceId = formData.get('workspace_id') as string;

        if (!file || !workspaceId) {
            return NextResponse.json(
                { error: 'file and workspace_id are required' },
                { status: 400 }
            );
        }

        const text = await file.text();
        const importData = JSON.parse(text);

        if (!importData.mocks || !Array.isArray(importData.mocks)) {
            return NextResponse.json(
                { error: 'Invalid import file format' },
                { status: 400 }
            );
        }

        // Import each mock
        const imported = [];
        for (const mockData of importData.mocks) {
            const mock = await MockStore.createMock({
                ...mockData,
                workspace_id: workspaceId,
            });
            imported.push(mock);
        }

        return NextResponse.json({
            success: true,
            count: imported.length,
        }, { status: 200 });
    } catch (error: any) {
        console.error('Import error:', error);
        return NextResponse.json(
            { error: error.message || 'Import failed' },
            { status: 500 }
        );
    }
}
