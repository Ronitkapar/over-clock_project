import { RepoScanner } from '@/components/repo-scanner/RepoScanner';

export default function ScanPage() {
    return (
        <main className="p-6">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Repository Scanner</h1>
                <p className="text-muted-foreground">
                    Analyze your frontend codebase for linting and TypeScript errors.
                </p>
            </div>
            <RepoScanner />
        </main>
    );
}
