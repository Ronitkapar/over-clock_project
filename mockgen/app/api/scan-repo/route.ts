import { NextRequest, NextResponse } from 'next/server';
import { scanRepository } from '@/lib/repo-scanner/scan';
import { RateLimiter } from '@/lib/rate-limit/rate-limiter';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { repoUrl } = body;

        if (!repoUrl) {
            return NextResponse.json(
                { error: 'repoUrl is required in request body' },
                { status: 400 }
            );
        }

        // Rate Limit: 5 scans per minute per IP to prevent abuse
        const rateLimitResult = await RateLimiter.check(req, {
            capacity: 5,
            refillRate: 0.083, // ~5 per minute (5/60)
            cost: 1
        });

        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                { error: 'Too many scans. Please try again later.' },
                { status: 429 }
            );
        }

        const report = await scanRepository(repoUrl);
        return NextResponse.json(report, { status: 200 });
    } catch (err: any) {
        console.error('Repo scan error:', err);
        return NextResponse.json(
            { error: err?.message ?? 'Unexpected error' },
            { status: 500 }
        );
    }
}
