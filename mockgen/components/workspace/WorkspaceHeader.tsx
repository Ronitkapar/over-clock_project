'use client';

import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WorkspaceHeaderProps {
    workspaceName: string;
    workspaceDescription?: string;
}

export function WorkspaceHeader({ workspaceName, workspaceDescription }: WorkspaceHeaderProps) {
    return (
        <div className="border-b bg-background">
            <div className="px-6 py-4">
                <h1 className="text-2xl font-bold">{workspaceName}</h1>
                {workspaceDescription && (
                    <p className="text-sm text-muted-foreground mt-1">{workspaceDescription}</p>
                )}
            </div>

            <div className="px-6">
                <TabsList>
                    <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
                    <TabsTrigger value="testing">Testing</TabsTrigger>
                    <TabsTrigger value="export">Export</TabsTrigger>
                </TabsList>
            </div>
        </div>
    );
}
