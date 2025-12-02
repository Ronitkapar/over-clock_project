import { NextRequest, NextResponse } from 'next/server';
import { generateMockFromPrompt } from '@/lib/ai/mock-generator';
import { MockStore } from '@/lib/storage/mockStore';

export const maxDuration = 30;

/**
 * POST /api/generate-mock
 * Generate a mock definition from a natural language prompt using AI
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { prompt, workspace_id, save = false } = body;

        if (!prompt || !workspace_id) {
            return NextResponse.json(
                { error: 'prompt and workspace_id are required' },
                { status: 400 }
            );
        }

        // Generate mock definition using AI
        const mockDefinition = await generateMockFromPrompt({
            prompt,
            workspace_id,
        });

        // Optionally save to database
        let savedMock = null;
        if (save) {
            savedMock = await MockStore.createMock(mockDefinition);
        }

        return NextResponse.json({
            mock: savedMock || mockDefinition,
            saved: !!savedMock,
        }, { status: 200 });
    } catch (error: any) {
        console.error('Generate mock error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate mock' },
            { status: 500 }
        );
    }
}
