'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useWorkspaces, useCreateWorkspace } from '@/hooks/useWorkspaces';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Plus, ArrowRight } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function WorkspacesPage() {
    const { data: workspaces, isLoading } = useWorkspaces();
    const createWorkspace = useCreateWorkspace();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState('');

    const handleCreateWorkspace = async () => {
        if (!newWorkspaceName.trim()) return;

        try {
            await createWorkspace.mutateAsync({
                name: newWorkspaceName,
                description: 'New workspace',
            });
            setIsDialogOpen(false);
            setNewWorkspaceName('');
        } catch (error) {
            console.error('Failed to create workspace', error);
        }
    };

    if (isLoading) {
        return <div className="p-6">Loading workspaces...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Workspaces</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Workspace
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Workspace</DialogTitle>
                            <DialogDescription>
                                Create a new workspace to organize your mock APIs.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    value={newWorkspaceName}
                                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreateWorkspace} disabled={createWorkspace.isPending}>
                                {createWorkspace.isPending ? 'Creating...' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workspaces?.map((workspace) => (
                    <Card key={workspace.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle>{workspace.name}</CardTitle>
                            <CardDescription>{workspace.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href={`/dashboard/workspaces/${workspace.id}`}>
                                <Button variant="outline" className="w-full">
                                    Open Workspace
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
