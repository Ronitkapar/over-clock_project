import { NextRequest, NextResponse } from 'next/server';
import { MockStore } from '@/lib/storage/mockStore';

/**
 * GET /api/mock-definitions/[id]
 * Get a single mock definition
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const mock = await MockStore.getMock(id);

        if (!mock) {
            return NextResponse.json(
                { error: 'Mock not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ mock }, { status: 200 });
    } catch (error: any) {
        console.error('Get mock error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to get mock' },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/mock-definitions/[id]
 * Update a mock definition
 */
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const mock = await MockStore.updateMock(id, body);

        return NextResponse.json({ mock }, { status: 200 });
    } catch (error: any) {
        console.error('Update mock error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update mock' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/mock-definitions/[id]
 * Delete a mock definition
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await MockStore.deleteMock(id);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error('Delete mock error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete mock' },
            { status: 500 }
        );
    }
}
