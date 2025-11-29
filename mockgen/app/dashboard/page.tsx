'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/dashboard/workspaces');
    }, [router]);

    return (
        <div className="flex items-center justify-center h-full">
            <div className="text-muted-foreground">Redirecting to workspaces...</div>
        </div>
    );
}
