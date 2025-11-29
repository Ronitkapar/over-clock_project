'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FolderOpen, Settings, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/store/ui-store';

const navItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Workspaces', href: '/dashboard/workspaces', icon: FolderOpen },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { isSidebarOpen, toggleSidebar } = useUIStore();

    return (
        <aside
            className={cn(
                "border-r bg-background transition-all duration-300",
                isSidebarOpen ? "w-64" : "w-16"
            )}
        >
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-end p-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                    >
                        <ChevronLeft className={cn(
                            "h-5 w-5 transition-transform",
                            !isSidebarOpen && "rotate-180"
                        )} />
                    </Button>
                </div>

                <nav className="flex-1 px-3 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-accent",
                                    !isSidebarOpen && "justify-center"
                                )}
                            >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                {isSidebarOpen && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
