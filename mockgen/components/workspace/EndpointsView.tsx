'use client';

import React, { useState } from 'react';
import { Search, Plus, List, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader } from '@/components/ui/card';
import { useEndpoints } from '@/hooks/useEndpoints';
import { CreateEndpointModal } from '@/components/endpoint/CreateEndpointModal';

interface EndpointsViewProps {
    workspaceId: string;
}

export function EndpointsView({ workspaceId }: EndpointsViewProps) {
    const [viewMode, setViewMode] = useState<'list' | 'table'>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [methodFilter, setMethodFilter] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data: endpoints, isLoading } = useEndpoints(workspaceId);

    const filteredEndpoints = endpoints?.filter(endpoint => {
        const matchesSearch = endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
            endpoint.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMethod = !methodFilter || endpoint.method === methodFilter;
        return matchesSearch && matchesMethod;
    });

    return (
        <div className="p-6 space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search endpoints..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        {['GET', 'POST', 'PUT', 'DELETE'].map(method => (
                            <Button
                                key={method}
                                variant={methodFilter === method ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setMethodFilter(methodFilter === method ? null : method)}
                            >
                                {method}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="icon"
                        onClick={() => setViewMode('list')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'table' ? 'default' : 'ghost'}
                        size="icon"
                        onClick={() => setViewMode('table')}
                    >
                        <Table className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Endpoint
                    </Button>
                </div>
            </div>

            {/* Endpoints List */}
            {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading endpoints...</div>
            ) : filteredEndpoints && filteredEndpoints.length > 0 ? (
                <div className="space-y-2">
                    {filteredEndpoints.map((endpoint) => (
                        <Card key={endpoint.id} className="cursor-pointer hover:border-primary transition-colors">
                            <CardHeader className="py-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded ${endpoint.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                                            endpoint.method === 'POST' ? 'bg-green-100 text-green-700' :
                                                endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {endpoint.method}
                                        </span>
                                        <span className="font-mono text-sm">{endpoint.path}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{endpoint.statusCode}</span>
                                </div>
                                {endpoint.description && (
                                    <p className="text-sm text-muted-foreground mt-2">{endpoint.description}</p>
                                )}
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-muted-foreground">
                    No endpoints found. Click &quot;New Endpoint&quot; to create one.
                </div>
            )}
            <CreateEndpointModal
                workspaceId={workspaceId}
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            />
        </div>
    );
}
