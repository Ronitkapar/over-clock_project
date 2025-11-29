import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export interface RateLimitConfig {
    capacity: number;      // Max tokens in bucket
    refillRate: number;    // Tokens per second
    cost?: number;         // Cost per request (default: 1)
}

export interface RateLimitResult {
    allowed: boolean;
    remaining?: number;
    retryAfter?: number;
}

/**
 * Rate limiter using Token Bucket algorithm via Supabase function.
 * 
 * Default config: 60 requests per minute (capacity: 60, refillRate: 1/sec)
 */
export class RateLimiter {
    private static DEFAULT_CONFIG: RateLimitConfig = {
        capacity: 60,
        refillRate: 1, // 1 token per second = 60 per minute
        cost: 1
    };

    /**
     * Check if a request should be rate limited.
     * 
     * @param request - The Next.js request object
     * @param config - Rate limit configuration
     * @param identifier - Optional custom identifier (defaults to IP address)
     * @returns Promise<RateLimitResult>
     */
    static async check(
        request: NextRequest,
        config: Partial<RateLimitConfig> = {},
        identifier?: string
    ): Promise<RateLimitResult> {
        const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
        const key = identifier || this.getClientIdentifier(request);

        try {
            const supabase = await createClient();

            // Call the Postgres function
            const { data, error } = await supabase.rpc('check_rate_limit', {
                request_key: key,
                cost: finalConfig.cost!,
                capacity: finalConfig.capacity,
                refill_rate: finalConfig.refillRate
            });

            if (error) {
                console.error('Rate limit check error:', error);
                // Fail open: allow request if rate limiting fails
                return { allowed: true };
            }

            // data is a boolean
            const allowed = data as boolean;

            if (!allowed) {
                // Calculate retry-after in seconds
                // If we're at 0 tokens, it takes (cost / refillRate) seconds to refill
                const retryAfter = Math.ceil(finalConfig.cost! / finalConfig.refillRate);
                return {
                    allowed: false,
                    retryAfter
                };
            }

            return { allowed: true };
        } catch (error) {
            console.error('Rate limiter error:', error);
            // Fail open
            return { allowed: true };
        }
    }

    /**
     * Get client identifier from request (IP address or user ID).
     */
    private static getClientIdentifier(request: NextRequest): string {
        // Try to get real IP from headers (for when behind a proxy/CDN)
        const forwardedFor = request.headers.get('x-forwarded-for');
        const realIp = request.headers.get('x-real-ip');

        if (forwardedFor) {
            // x-forwarded-for can be a comma-separated list
            return forwardedFor.split(',')[0].trim();
        }

        if (realIp) {
            return realIp;
        }

        // Fallback: In production (Vercel), IP is in headers. Locally, may not be available.
        return 'unknown';
    }

    /**
     * Workspace-specific rate limiting.
     * Uses workspace ID as part of the key.
     */
    static async checkWorkspace(
        request: NextRequest,
        workspaceId: string,
        config: Partial<RateLimitConfig> = {}
    ): Promise<RateLimitResult> {
        const clientId = this.getClientIdentifier(request);
        const key = `workspace:${workspaceId}:${clientId}`;
        return this.check(request, config, key);
    }
}
