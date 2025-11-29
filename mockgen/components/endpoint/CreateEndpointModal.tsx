'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useCreateEndpoint } from '@/hooks/useEndpoints';
import { HTTPMethod } from '@/types/endpoint';

interface CreateEndpointModalProps {
    workspaceId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateEndpointModal({ workspaceId, open, onOpenChange }: CreateEndpointModalProps) {
    const [method, setMethod] = useState<HTTPMethod>('GET');
    const [path, setPath] = useState('');
    const [description, setDescription] = useState('');
    const [statusCode, setStatusCode] = useState('200');
    const [responseBody, setResponseBody] = useState('{}');

    const createEndpoint = useCreateEndpoint();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const parsedResponse = JSON.parse(responseBody);

            await createEndpoint.mutateAsync({
                workspaceId,
                method,
                path,
                description,
                statusCode: parseInt(statusCode),
                delayMs: 0,
                errorRate: 0,
                customHeaders: {},
                isActive: true,
                sampleResponse: parsedResponse,
                responseSchema: {},
            });

            // Reset form and close modal
            setPath('');
            setDescription('');
            setResponseBody('{}');
            setStatusCode('200');
            setMethod('GET');
            onOpenChange(false);
        } catch (error) {
            console.error('Error creating endpoint:', error);
            const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
            alert(`Error creating endpoint: ${errorMessage}`);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create New Endpoint</DialogTitle>
                    <DialogDescription>
                        Add a new mock API endpoint to your workspace.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="method">HTTP Method</Label>
                            <Select value={method} onValueChange={(value) => setMethod(value as HTTPMethod)}>
                                <SelectTrigger id="method">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="GET">GET</SelectItem>
                                    <SelectItem value="POST">POST</SelectItem>
                                    <SelectItem value="PUT">PUT</SelectItem>
                                    <SelectItem value="DELETE">DELETE</SelectItem>
                                    <SelectItem value="PATCH">PATCH</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="statusCode">Status Code</Label>
                            <Input
                                id="statusCode"
                                type="number"
                                value={statusCode}
                                onChange={(e) => setStatusCode(e.target.value)}
                                placeholder="200"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="path">Path</Label>
                        <Input
                            id="path"
                            value={path}
                            onChange={(e) => {
                                const val = e.target.value;
                                setPath(val.startsWith('/') ? val : '/' + val);
                            }}
                            placeholder="/users"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description (optional)</Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Get all users"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="responseBody">Response Body (JSON)</Label>
                        <Textarea
                            id="responseBody"
                            value={responseBody}
                            onChange={(e) => setResponseBody(e.target.value)}
                            placeholder='{ "id": 1, "name": "John" }'
                            className="font-mono text-sm"
                            rows={8}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createEndpoint.isPending}>
                            {createEndpoint.isPending ? 'Creating...' : 'Create Endpoint'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
