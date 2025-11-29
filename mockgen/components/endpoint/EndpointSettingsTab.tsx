import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import Editor from '@monaco-editor/react';

interface EndpointSettingsTabProps {
    delay: number;
    setDelay: (value: number) => void;
    errorRate: number;
    setErrorRate: (value: number) => void;
    statusCode: number;
    setStatusCode: (value: number) => void;
    customHeaders: string;
    setCustomHeaders: (value: string | undefined) => void;
}

export function EndpointSettingsTab({
    delay,
    setDelay,
    errorRate,
    setErrorRate,
    statusCode,
    setStatusCode,
    customHeaders,
    setCustomHeaders,
}: EndpointSettingsTabProps) {
    return (
        <div className="space-y-6 p-4">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="delay">Response Delay (ms)</Label>
                    <Input
                        id="delay"
                        type="number"
                        min="0"
                        value={delay}
                        onChange={(e) => setDelay(parseInt(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground">
                        Simulate network latency in milliseconds.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="errorRate">Error Rate (0.0 - 1.0)</Label>
                    <Input
                        id="errorRate"
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={errorRate}
                        onChange={(e) => setErrorRate(parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground">
                        Probability of returning an error response.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="statusCode">Status Code</Label>
                    <Input
                        id="statusCode"
                        type="number"
                        value={statusCode}
                        onChange={(e) => setStatusCode(parseInt(e.target.value) || 200)}
                    />
                    <p className="text-xs text-muted-foreground">
                        HTTP status code to return.
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Custom Headers (JSON)</Label>
                <div className="h-[200px] border rounded-md overflow-hidden">
                    <Editor
                        height="100%"
                        defaultLanguage="json"
                        value={customHeaders}
                        onChange={setCustomHeaders}
                        options={{
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            fontSize: 14,
                            automaticLayout: true,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
