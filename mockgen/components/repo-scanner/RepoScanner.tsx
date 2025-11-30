'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface Issue {
    file: string;
    line: number;
    column: number;
    message: string;
    type: 'error' | 'warning';
}

export function RepoScanner() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState<{ repo: string; issues: Issue[] } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleScan = async () => {
        setLoading(true);
        setError(null);
        setReport(null);
        try {
            const res = await fetch('/api/scan-repo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repoUrl: url.trim() })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Scan failed');
            }

            setReport(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-4xl mx-auto my-8">
            <CardHeader>
                <CardTitle>GitHub Repo Scanner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="https://github.com/user/project.git"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        disabled={loading}
                    />
                    <Button onClick={handleScan} disabled={loading || !url}>
                        {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                        {loading ? 'Scanning...' : 'Scan'}
                    </Button>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        {error}
                    </div>
                )}

                {report && (
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-lg">Results for <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{report.repo}</span></h3>
                            <span className="text-xs text-muted-foreground">
                                {new Date().toLocaleTimeString()}
                            </span>
                        </div>

                        {report.issues.length === 0 ? (
                            <div className="p-8 text-center bg-green-50 text-green-700 rounded-md border border-green-200">
                                <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p className="font-medium">No lint or TypeScript errors found!</p>
                                <p className="text-sm opacity-80">Great job keeping your code clean.</p>
                            </div>
                        ) : (
                            <div className="border rounded-md overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="p-3 text-left font-medium">Type</th>
                                            <th className="p-3 text-left font-medium">File</th>
                                            <th className="p-3 text-left font-medium">Location</th>
                                            <th className="p-3 text-left font-medium">Message</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {report.issues.map((i, idx) => (
                                            <tr key={idx} className={i.type === 'error' ? 'bg-red-50/50 hover:bg-red-50' : 'bg-yellow-50/50 hover:bg-yellow-50'}>
                                                <td className="p-3">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${i.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {i.type}
                                                    </span>
                                                </td>
                                                <td className="p-3 font-mono text-xs">{i.file}</td>
                                                <td className="p-3 font-mono text-xs whitespace-nowrap">{i.line}:{i.column}</td>
                                                <td className="p-3">{i.message}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
