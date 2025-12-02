'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Copy } from 'lucide-react';
import type { MockDefinition } from '@/lib/storage/mockStore';

interface MockListProps {
    mocks: MockDefinition[];
    onEdit: (mock: MockDefinition) => void;
    onDelete: (id: string) => void;
}

export function MockList({ mocks, onEdit, onDelete }: MockListProps) {
    const methodColors: Record<string, string> = {
        GET: 'bg-blue-500',
        POST: 'bg-green-500',
        PUT: 'bg-yellow-500',
        PATCH: 'bg-orange-500',
        DELETE: 'bg-red-500',
    };

    const handleDuplicate = async (mock: MockDefinition) => {
        try {
            const res = await fetch('/api/mock-definitions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...mock,
                    id: undefined,
                    name: `${mock.name} (Copy)`,
                }),
            });

            if (res.ok) {
                window.location.reload();
            }
        } catch (error) {
            console.error('Duplicate failed:', error);
        }
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[200px]">Name</TableHead>
                        <TableHead className="w-[100px]">Method</TableHead>
                        <TableHead>Path</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                        <TableHead className="w-[80px]">Delay</TableHead>
                        <TableHead className="w-[150px] text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mocks.map((mock) => (
                        <TableRow key={mock.id}>
                            <TableCell className="font-medium">
                                <div>
                                    <div>{mock.name}</div>
                                    {mock.description && (
                                        <div className="text-xs text-muted-foreground truncate max-w-[180px]">
                                            {mock.description}
                                        </div>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    className={`${methodColors[mock.method]} text-white font-mono text-xs`}
                                >
                                    {mock.method}
                                </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-sm">{mock.path}</TableCell>
                            <TableCell>
                                <Badge variant={mock.is_active ? 'default' : 'secondary'}>
                                    {mock.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                                {mock.delay_ms}ms
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleDuplicate(mock)}
                                        title="Duplicate"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => onEdit(mock)}
                                        title="Edit"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-600 hover:text-red-700"
                                        onClick={() => onDelete(mock.id)}
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
