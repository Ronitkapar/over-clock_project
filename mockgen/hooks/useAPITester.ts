import { useState } from 'react';
import { APIRequest } from '@/types/api-request';

export interface RequestState {
    method: string;
    url: string;
    headers: { key: string; value: string }[];
    body: string;
}

export interface ResponseState {
    status: number | null;
    statusText: string | null;
    body: any | null;
    headers: Record<string, string> | null;
    time: number | null;
    size: number | null;
}

export function useAPITester() {
    const [request, setRequest] = useState<RequestState>({
        method: 'GET',
        url: '',
        headers: [{ key: '', value: '' }],
        body: '{}',
    });

    const [response, setResponse] = useState<ResponseState | null>(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<APIRequest[]>([]);

    const sendRequest = async () => {
        setLoading(true);
        setResponse(null);
        const startTime = performance.now();

        try {
            // Prepare headers
            const headersInit: HeadersInit = {};
            request.headers.forEach(h => {
                if (h.key) headersInit[h.key] = h.value;
            });

            // Prepare body
            let body = undefined;
            if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
                try {
                    // Validate JSON
                    JSON.parse(request.body);
                    body = request.body;
                    if (!headersInit['Content-Type']) {
                        headersInit['Content-Type'] = 'application/json';
                    }
                } catch (e) {
                    // If not valid JSON, send as text? Or throw?
                    // For now, let's assume JSON
                    console.warn('Invalid JSON body');
                }
            }

            const res = await fetch(request.url, {
                method: request.method,
                headers: headersInit,
                body,
            });

            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);

            const contentType = res.headers.get('content-type');
            let responseBody;
            if (contentType && contentType.includes('application/json')) {
                responseBody = await res.json();
            } else {
                responseBody = await res.text();
            }

            const responseHeaders: Record<string, string> = {};
            res.headers.forEach((val, key) => {
                responseHeaders[key] = val;
            });

            const newResponse: ResponseState = {
                status: res.status,
                statusText: res.statusText,
                body: responseBody,
                headers: responseHeaders,
                time: responseTime,
                size: new Blob([typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody)]).size,
            };

            setResponse(newResponse);

            // Add to history
            const historyItem: APIRequest = {
                id: crypto.randomUUID(),
                workspaceId: 'temp', // TODO: Get actual workspace ID
                method: request.method,
                url: request.url,
                headers: headersInit as Record<string, string>,
                body: body ? JSON.parse(body) : undefined,
                responseStatus: res.status,
                responseTimeMs: responseTime,
                createdAt: new Date().toISOString(),
            };

            setHistory(prev => [historyItem, ...prev].slice(0, 50));

        } catch (error) {
            const endTime = performance.now();
            setResponse({
                status: 0,
                statusText: 'Network Error',
                body: (error as Error).message,
                headers: null,
                time: Math.round(endTime - startTime),
                size: 0,
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        request,
        setRequest,
        response,
        loading,
        history,
        sendRequest,
    };
}
