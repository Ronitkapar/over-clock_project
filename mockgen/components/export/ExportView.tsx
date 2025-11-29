'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileJson, FileCode } from 'lucide-react';

interface ExportViewProps {
    workspaceId: string;
}

export function ExportView({ workspaceId }: ExportViewProps) {
    const [format, setFormat] = useState('json');
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const response = await fetch(`/api/export?workspaceId=${workspaceId}&format=${format}`);

            if (!response.ok) {
                throw new Error('Export failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `workspace-${workspaceId}-export.${format === 'openapi' ? 'json' : 'json'}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            // toast.success('Export successful');
            alert('Export successful');
        } catch (error) {
            console.error('Export error:', error);
            // toast.error('Failed to export configuration');
            alert('Failed to export configuration');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Export API Configuration</CardTitle>
                    <CardDescription>
                        Download your API endpoints and configurations in various formats.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Export Format</label>
                        <Select value={format} onValueChange={setFormat}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="json">
                                    <div className="flex items-center gap-2">
                                        <FileJson className="h-4 w-4" />
                                        <span>Raw JSON</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="openapi">
                                    <div className="flex items-center gap-2">
                                        <FileCode className="h-4 w-4" />
                                        <span>OpenAPI 3.0 (JSON)</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
                        {format === 'json' && (
                            <p>Exports a raw JSON array of all your endpoint configurations, including schemas and sample responses. Useful for backups or importing into another MockGen instance.</p>
                        )}
                        {format === 'openapi' && (
                            <p>Generates a standard OpenAPI 3.0 specification file. Compatible with tools like Swagger UI, Postman, and various code generators.</p>
                        )}
                    </div>

                    <Button onClick={handleExport} disabled={isExporting} className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        {isExporting ? 'Exporting...' : 'Download Export'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
