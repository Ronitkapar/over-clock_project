'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader';
import { EndpointsView } from '@/components/workspace/EndpointsView';
import { TestingView } from '@/components/workspace/TestingView';
import { ExportView } from '@/components/export/ExportView';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useWorkspaces } from '@/hooks/useWorkspaces';

export default function WorkspaceDetailPage() {
    const params = useParams();
    const workspaceId = params.workspaceId as string;
    const [activeTab, setActiveTab] = useState('endpoints');
    const { data: workspaces, isLoading } = useWorkspaces();

    const activeWorkspace = workspaces?.find(w => w.id === workspaceId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground">Loading workspace...</div>
            </div>
        );
    }

    if (!activeWorkspace) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="text-muted-foreground">Workspace not found.</div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <WorkspaceHeader
                    workspaceName={activeWorkspace.name}
                    workspaceDescription={activeWorkspace.description || ''}
                />

                <TabsContent value="endpoints" className="flex-1 m-0">
                    <EndpointsView workspaceId={activeWorkspace.id} />
                </TabsContent>

                <TabsContent value="testing" className="flex-1 m-0">
                    <TestingView workspaceId={activeWorkspace.id} />
                </TabsContent>

                <TabsContent value="export" className="flex-1 m-0">
                    <ExportView workspaceId={activeWorkspace.id} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
