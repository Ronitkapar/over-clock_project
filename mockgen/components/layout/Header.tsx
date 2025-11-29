'use client';

import React from 'react';
import { Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Header() {
    return (
        <header className="h-16 border-b bg-background flex items-center px-6 justify-between">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">MG</span>
                    </div>
                    <span className="font-semibold text-lg">MockGen</span>
                </div>

                <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search endpoints, workspaces..."
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                </Button>
            </div>
        </header>
    );
}
