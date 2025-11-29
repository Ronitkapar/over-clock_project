'use client';

import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="h-screen flex flex-col">
            <Header />
            <div className="flex-1 flex overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-auto bg-muted/10">
                    {children}
                </main>
            </div>
        </div>
    );
}
