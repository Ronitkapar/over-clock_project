import { Endpoint } from '@/types/endpoint';

export class EndpointMatcher {
    static match(endpoints: Endpoint[], method: string, path: string): Endpoint | null {
        // 1. Try exact match first
        const exactMatch = endpoints.find(
            (e) => e.method === method && e.path === path
        );
        if (exactMatch) return exactMatch;

        // 2. Try pattern match (simple implementation for now)
        // In a real app, we'd use path-to-regexp or similar
        return endpoints.find((e) => {
            if (e.method !== method) return false;

            // Convert endpoint path to regex
            // e.g., /users/:id -> /users/[^/]+
            const pattern = e.path.replace(/:[a-zA-Z0-9_]+/g, '[^/]+');
            const regex = new RegExp(`^${pattern}$`);

            return regex.test(path);
        }) || null;
    }
}
