'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload } from 'lucide-react';
import { MockList } from '@/components/dashboard/MockList';
import { MockEditor } from '@/components/dashboard/MockEditor';
import type { MockDefinition } from '@/lib/storage/mockStore';

export default function DashboardPage() {
    const [mocks, setMocks] = useState<MockDefinition[]>([]);
    const [loading, setLoading] = useState(true);
    const [editorOpen, setEditorOpen] = useState(false);
    const [selectedMock, setSelectedMock] = useState<MockDefinition | null>(null);
    const [workspaceId, setWorkspaceId] = useState<string>('');

    // Load workspace from localStorage or default
    useEffect(() => {
        const savedWorkspace = localStorage.getItem('currentWorkspaceId');
        if (savedWorkspace) {
            setWorkspaceId(savedWorkspace);
            fetchMocks(savedWorkspace);
        } else {
            // Create a default workspace ID
            const defaultId = crypto.randomUUID();
            localStorage.setItem('currentWorkspaceId', defaultId);
            setWorkspaceId(defaultId);
            setLoading(false);
        }
    }, []);

    const fetchMocks = async (wsId: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/mock-definitions?workspace_id=${wsId}`);
            const data = await res.json();
            setMocks(data.mocks || []);
        } catch (error) {
            console.error('Failed to fetch mocks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedMock(null);
        setEditorOpen(true);
    };

    const handleEdit = (mock: MockDefinition) => {
        setSelectedMock(mock);
        setEditorOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this mock?')) return;

        try {
            const res = await fetch(`/api/mock-definitions/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchMocks(workspaceId);
            }
        } catch (error) {
            console.error('Failed to delete mock:', error);
        }
    };

    const handleSave = () => {
        fetchMocks(workspaceId);
        setEditorOpen(false);
    };

    const handleExport = async () => {
        try {
            const res = await fetch(`/api/export?workspace_id=${workspaceId}`);
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `mocks-${Date.now()}.json`;
            a.click();
        } catch (error) {
            console.error('Export failed:', error);
        }
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e: any) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);
            formData.append('workspace_id', workspaceId);

            try {
                const res = await fetch('/api/import', {
                    method: 'POST',
                    body: formData,
                });

                if (res.ok) {
                    fetchMocks(workspaceId);
                }
            } catch (error) {
                console.error('Import failed:', error);
            }
        };
        input.click();
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-2xl font-bold">Mock Endpoints</CardTitle>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleExport}>
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleImport}>
                            <Upload className="h-4 w-4 mr-2" />
                            Import
                        </Button>
                        <Button onClick={handleCreate}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Mock
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-12 text-muted-foreground">
                            Loading mocks...
                        </div>
                    ) : mocks.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <p className="mb-4">No mock endpoints yet.</p>
                            <Button onClick={handleCreate}>Create your first mock</Button>
                        </div>
                    ) : (
                        <MockList
                            mocks={mocks}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                </CardContent>
            </Card>

            <MockEditor
                open={editorOpen}
                mock={selectedMock}
                workspaceId={workspaceId}
                onClose={() => setEditorOpen(false)}
                onSave={handleSave}
            />
        </div>
    );
}
