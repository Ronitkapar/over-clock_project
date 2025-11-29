'use client';

import React, { useState, useEffect } from 'react';
import { Send, Clock, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { createClient } from '@/lib/supabase/client';

interface TestingViewProps {
    workspaceId?: string;
}

export function TestingView({ workspaceId }: TestingViewProps) {
    const [url, setUrl] = useState('');
    const [method, setMethod] = useState('GET');
    const [requestBody, setRequestBody] = useState('');
    const [response, setResponse] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const supabase = createClient();

    useEffect(() => {
        if (workspaceId) {
            fetchHistory();
        }
    }, [workspaceId]);

    const fetchHistory = async () => {
        if (!workspaceId) return;
        const { data } = await supabase
            .from('request_history')
            .select('*')
            .eq('workspace_id', workspaceId)
            .order('created_at', { ascending: false })
            .limit(50);
        if (data) setHistory(data);
    };

    const loadHistoryItem = (item: any) => {
        setMethod(item.method);
        setUrl(item.url);
        setRequestBody(item.body ? JSON.stringify(item.body, null, 2) : '');
        if (item.response_body) {
            setResponse({
                status: item.response_status,
                statusText: 'Loaded from History',
                data: item.response_body,
                headers: {}
            });
        }
    };

    const handleSendRequest = async () => {
        setIsLoading(true);
        try {
            let targetUrl = url;
            if (!url.startsWith('http')) {
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

            setTimeout(fetchHistory, 1000);

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
        <div className="p-6 h-[calc(100vh-60px)] flex gap-6">
            {/* History Sidebar */}
            <Card className="w-64 flex flex-col h-full">
                <CardHeader className="py-4 px-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            History
                        </CardTitle>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={fetchHistory}>
                            <RotateCcw className="h-3 w-3" />
                        </Button>
                    </div>
                </CardHeader>
                <Separator />
                <div className="flex-1 overflow-auto">
                    <div className="p-2 space-y-2">
                        {history.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => loadHistoryItem(item)}
                                className="p-2 hover:bg-muted rounded-md cursor-pointer text-xs border"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`font-bold ${item.method === 'GET' ? 'text-blue-500' :
                                            item.method === 'POST' ? 'text-green-500' :
                                                item.method === 'DELETE' ? 'text-red-500' : 'text-orange-500'
                                        }`}>{item.method}</span>
                                    <span className={`px-1.5 py-0.5 rounded ${item.response_status < 300 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {item.response_status}
                                    </span>
                                </div>
                                <div className="truncate text-muted-foreground" title={item.url}>
                                    {item.url}
                                </div>
                                <div className="text-[10px] text-muted-foreground mt-1 text-right">
                                    {new Date(item.created_at).toLocaleTimeString()}
                                </div>
                            </div>
                        ))}
                        {history.length === 0 && (
                            <div className="text-center text-muted-foreground text-xs py-4">
                                No history yet
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* Main Content */}
            <div className="flex-1 grid grid-cols-2 gap-6 h-full">
                {/* Request Panel */}
                <Card className="flex flex-col h-full">
                    <CardHeader className="py-4">
                        <CardTitle>Request</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
                        <div className="flex gap-2">
                            <select
                                className="px-3 py-2 border rounded-md w-24"
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
                                placeholder="Enter endpoint path (e.g. /users)"
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

                        <Tabs defaultValue="body" className="flex-1 flex flex-col overflow-hidden">
                            <TabsList>
                                <TabsTrigger value="body">Body</TabsTrigger>
                                <TabsTrigger value="headers">Headers</TabsTrigger>
                                <TabsTrigger value="params">Params</TabsTrigger>
                            </TabsList>

                            <TabsContent value="body" className="flex-1 mt-2 h-full">
                                <Textarea
                                    placeholder="Enter request body (JSON)..."
                                    value={requestBody}
                                    onChange={(e) => setRequestBody(e.target.value)}
                                    className="h-full font-mono text-sm resize-none"
                                />
                            </TabsContent>

                            <TabsContent value="headers" className="flex-1 mt-2 h-full">
                                <Textarea
                                    placeholder="Enter headers..."
                                    className="h-full font-mono text-sm resize-none"
                                />
                            </TabsContent>

                            <TabsContent value="params" className="flex-1 mt-2 h-full">
                                <Textarea
                                    placeholder="Enter query parameters..."
                                    className="h-full font-mono text-sm resize-none"
                                />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Response Panel */}
                <Card className="flex flex-col h-full">
                    <CardHeader className="py-4">
                        <CardTitle>Response</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
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

                                <Tabs defaultValue="body" className="flex-1 flex flex-col overflow-hidden">
                                    <TabsList>
                                        <TabsTrigger value="body">Body</TabsTrigger>
                                        <TabsTrigger value="headers">Headers</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="body" className="flex-1 mt-2 h-full overflow-hidden">
                                        <div className="h-full w-full rounded-md border bg-muted p-4 overflow-auto">
                                            <pre className="text-sm font-mono">
                                                {JSON.stringify(response.data, null, 2)}
                                            </pre>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="headers" className="flex-1 mt-2 h-full overflow-hidden">
                                        <div className="h-full w-full rounded-md border bg-muted p-4 overflow-auto">
                                            <pre className="text-sm font-mono">
                                                {JSON.stringify(response.headers, null, 2)}
                                            </pre>
                                        </div>
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
