'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface TestingViewProps {
    workspaceId?: string;
}

export function TestingView({ workspaceId }: TestingViewProps) {
    const [url, setUrl] = useState('');
    const [method, setMethod] = useState('GET');
    const [requestBody, setRequestBody] = useState('');
    const [response, setResponse] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendRequest = async () => {
        setIsLoading(true);
        try {
            // Construct the full URL for the mock API
            // If the user entered a full URL (http...), use it (though this is for mock testing, so maybe not?)
            // For now, let's assume relative paths target the mock API

            let targetUrl = url;
            if (!url.startsWith('http')) {
                // Ensure path starts with /
                const path = url.startsWith('/') ? url : `/${url}`;
                targetUrl = `/api/mock/${workspaceId}${path}`;
            }

            const options: RequestInit = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            if (['POST', 'PUT', 'PATCH'].includes(method) && requestBody) {
                try {
                    // Validate JSON
                    JSON.parse(requestBody);
                    options.body = requestBody;
                } catch (e) {
                    alert('Invalid JSON in request body');
                    setIsLoading(false);
                    return;
                }
            }

            const res = await fetch(targetUrl, options);

            const data = await res.json().catch(() => ({}));
            const headers: Record<string, string> = {};
            res.headers.forEach((value, key) => {
                headers[key] = value;
            });

            setResponse({
                status: res.status,
                statusText: res.statusText,
                data,
                headers
            });
        } catch (error) {
            console.error('Request failed:', error);
            setResponse({
                status: 0,
                statusText: 'Network Error',
                data: { error: String(error) },
                headers: {}
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="grid grid-cols-2 gap-6 h-[calc(100vh-200px)]">
                {/* Request Panel */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Request</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col space-y-4">
                        <div className="flex gap-2">
                            <select
                                className="px-3 py-2 border rounded-md"
                                value={method}
                                onChange={(e) => setMethod(e.target.value)}
                            >
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                                <option value="DELETE">DELETE</option>
                                <option value="PATCH">PATCH</option>
                            </select>
                            <Input
                                placeholder="Enter URL..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="flex-1"
                            />
                            <Button onClick={handleSendRequest} disabled={isLoading}>
                                <Send className="h-4 w-4 mr-2" />
                                {isLoading ? 'Sending...' : 'Send'}
                            </Button>
                        </div>

                        <Separator />

                        <Tabs defaultValue="body" className="flex-1 flex flex-col">
                            <TabsList>
                                <TabsTrigger value="body">Body</TabsTrigger>
                                <TabsTrigger value="headers">Headers</TabsTrigger>
                                <TabsTrigger value="params">Params</TabsTrigger>
                            </TabsList>

                            <TabsContent value="body" className="flex-1">
                                <Textarea
                                    placeholder="Enter request body (JSON)..."
                                    value={requestBody}
                                    onChange={(e) => setRequestBody(e.target.value)}
                                    className="h-full font-mono text-sm"
                                />
                            </TabsContent>

                            <TabsContent value="headers" className="flex-1">
                                <Textarea
                                    placeholder="Enter headers..."
                                    className="h-full font-mono text-sm"
                                />
                            </TabsContent>

                            <TabsContent value="params" className="flex-1">
                                <Textarea
                                    placeholder="Enter query parameters..."
                                    className="h-full font-mono text-sm"
                                />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Response Panel */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Response</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col space-y-4">
                        {response ? (
                            <>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 text-sm font-semibold rounded ${response.status < 300 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {response.status} {response.statusText}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {JSON.stringify(response.data).length} bytes
                                    </span>
                                </div>

                                <Separator />

                                <Tabs defaultValue="body" className="flex-1 flex flex-col">
                                    <TabsList>
                                        <TabsTrigger value="body">Body</TabsTrigger>
                                        <TabsTrigger value="headers">Headers</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="body" className="flex-1">
                                        <pre className="p-4 bg-muted rounded-lg h-full overflow-auto text-sm font-mono">
                                            {JSON.stringify(response.data, null, 2)}
                                        </pre>
                                    </TabsContent>

                                    <TabsContent value="headers" className="flex-1">
                                        <pre className="p-4 bg-muted rounded-lg h-full overflow-auto text-sm font-mono">
                                            {JSON.stringify(response.headers, null, 2)}
                                        </pre>
                                    </TabsContent>
                                </Tabs>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-muted-foreground">
                                Send a request to see the response
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
