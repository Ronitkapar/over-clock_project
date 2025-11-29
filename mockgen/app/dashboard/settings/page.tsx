'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Global application settings will appear here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
