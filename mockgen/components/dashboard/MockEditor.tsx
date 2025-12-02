'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { MockDefinition } from '@/lib/storage/mockStore';

interface MockEditorProps {
    open: boolean;
    mock: MockDefinition | null;
    workspaceId: string;
    onClose: () => void;
    onSave: () => void;
}

export function MockEditor({ open, mock, workspaceId, onClose, onSave }: MockEditorProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [method, setMethod] = useState<string>('GET');
    const [path, setPath] = useState('');
    const [statusCode, setStatusCode] = useState(200);
    const [delayMs, setDelayMs] = useState(0);
    const [errorRate, setErrorRate] = useState(0);
    const [responseData, setResponseData] = useState('{}');

    useEffect(() => {
        if (mock) {
            setName(mock.name);
            setDescription(mock.description || '');
            setMethod(mock.method);
            setPath(mock.path);
            setStatusCode(mock.status_code);
            setDelayMs(mock.delay_ms);
            setErrorRate(mock.error_rate);
            setResponseData(JSON.stringify(mock.response_data || {}, null, 2));
        } else {
            // Reset for new mock
            setName('');
            setDescription('');
            setMethod('GET');
            setPath('/');
            setStatusCode(200);
            setDelayMs(0);
            setErrorRate(0);
            setResponseData('{}');
        }
    }, [mock, open]);

    const handleSave = async () => {
        try {
            const url = mock
                ? `/api/mock-definitions/${mock.id}`
                : '/api/mock-definitions';

            const method_http = mock ? 'PUT' : 'POST';

            const body = {
                workspace_id: workspaceId,
                name,
                description,
                method,
                path,
                status_code: statusCode,
                delay_ms: delayMs,
                error_rate: errorRate,
                response_data: JSON.parse(responseData),
            };

            const res = await fetch(url, {
                method: method_http,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                onSave();
            } else {
                alert('Failed to save mock');
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('Invalid JSON in response data');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{mock ? 'Edit Mock' : 'Create Mock'}</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="basic" className="mt-4">
                    <TabsList>
                        <TabsTrigger value="basic">Basic</TabsTrigger>
                        <TabsTrigger value="response">Response</TabsTrigger>
                        <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Get Users"
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Optional description"
                            />
                        </div>

                        <div>
                            <Label htmlFor="method">Method *</Label>
                            <Select value={method} onValueChange={setMethod}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="GET">GET</SelectItem>
                                    <SelectItem value="POST">POST</SelectItem>
                                    <SelectItem value="PUT">PUT</SelectItem>
                                    <SelectItem value="PATCH">PATCH</SelectItem>
                                    <SelectItem value="DELETE">DELETE</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="path">Path *</Label>
                            <Input
                                id="path"
                                value={path}
                                onChange={(e) => setPath(e.target.value)}
                                placeholder="/api/users/:id"
                                className="font-mono"
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="response" className="space-y-4">
                        <div>
                            <Label htmlFor="statusCode">Status Code</Label>
                            <Input
                                id="statusCode"
                                type="number"
                                value={statusCode}
                                onChange={(e) => setStatusCode(parseInt(e.target.value))}
                            />
                        </div>

                        <div>
                            <Label htmlFor="responseData">Response Data (JSON)</Label>
                            <textarea
                                id="responseData"
                                value={responseData}
                                onChange={(e) => setResponseData(e.target.value)}
                                className="w-full h-64 p-2 border rounded font-mono text-sm"
                                placeholder='{}'
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-4">
                        <div>
                            <Label htmlFor="delayMs">Delay (ms)</Label>
                            <Input
                                id="delayMs"
                                type="number"
                                value={delayMs}
                                onChange={(e) => setDelayMs(parseInt(e.target.value))}
                            />
                        </div>

                        <div>
                            <Label htmlFor="errorRate">Error Rate (0-1)</Label>
                            <Input
                                id="errorRate"
                                type="number"
                                step="0.1"
                                min="0"
                                max="1"
                                value={errorRate}
                                onChange={(e) => setErrorRate(parseFloat(e.target.value))}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Probability of returning an error (0 = never, 1 = always)
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>Save</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
