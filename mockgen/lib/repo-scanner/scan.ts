import { exec, ExecException } from 'child_process';
import { promisify } from 'util';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { rm } from 'fs/promises';
import { tmpdir } from 'os';

const execAsync = promisify(exec);

/**
 * Run a command inside a given working directory.
 * Timeout is set to 2 minutes to avoid runaway installs.
 */
async function runCmd(
    cmd: string,
    cwd: string,
    timeout = 120_000
): Promise<{ stdout: string; stderr: string }> {
    return execAsync(cmd, { cwd, timeout });
}

/**
 * Main entry – clones the repo, installs, lints, type-checks.
 * Returns a structured report.
 */
export async function scanRepository(repoUrl: string) {
    // 1. Validate URL (basic check – must be a public https GitHub URL)
    if (!/^https:\/\/github\.com\/[^/]+\/[^/]+(\.git)?$/.test(repoUrl)) {
        throw new Error('Only public GitHub HTTPS URLs are allowed.');
    }

    // 2. Create a unique temporary directory
    const scanId = randomUUID();
    const workDir = join(tmpdir(), `repo-scan-${scanId}`);
    await execAsync(`mkdir -p ${workDir}`);

    try {
        // 3. Clone the repo (shallow clone, depth 1)
        await runCmd(`git clone --depth 1 ${repoUrl} .`, workDir);

        // 4. Install dependencies (npm ci – fast, deterministic)
        // If the repo has no lockfile, fall back to npm install.
        try {
            await runCmd(`npm ci --silent --ignore-scripts`, workDir);
        } catch (_) {
            await runCmd(`npm install --silent --ignore-scripts`, workDir);
        }

        // 5. Run ESLint (if config exists)
        let lintResult = { stdout: '', stderr: '' };
        try {
            lintResult = await runCmd(`npm run lint --silent`, workDir);
        } catch (e: any) {
            // ESLint exits with non-zero when it finds problems – we still want output
            lintResult = { stdout: e.stdout ?? '', stderr: e.stderr ?? '' };
        }

        // 6. Run TypeScript compiler (no emit)
        let tscResult = { stdout: '', stderr: '' };
        try {
            tscResult = await runCmd(`npx tsc --noEmit`, workDir);
        } catch (e: any) {
            tscResult = { stdout: e.stdout ?? '', stderr: e.stderr ?? '' };
        }

        // 7. Parse the raw output into a friendly structure
        const parseOutput = (raw: string) => {
            const lines = raw.split('\n').filter(Boolean);
            const issues: { file: string; line: number; column: number; message: string; type: 'error' | 'warning' }[] = [];

            const eslintRegex = /^(.*?):(\d+):(\d+):\s+(.*?)(?:\s\[(error|warning)\])?$/;
            const tscRegex = /^(.*)\((\d+),(\d+)\):\s+(error|warning)\s+TS\d+:\s+(.*)$/;

            for (const line of lines) {
                let m = line.match(eslintRegex);
                if (m) {
                    const [, file, lineNum, colNum, msg, lvl] = m;
                    issues.push({
                        file,
                        line: Number(lineNum),
                        column: Number(colNum),
                        message: msg.trim(),
                        type: (lvl as any) === 'warning' ? 'warning' : 'error',
                    });
                    continue;
                }
                m = line.match(tscRegex);
                if (m) {
                    const [, file, lineNum, colNum, lvl, msg] = m;
                    issues.push({
                        file,
                        line: Number(lineNum),
                        column: Number(colNum),
                        message: msg.trim(),
                        type: lvl as any,
                    });
                }
            }
            return issues;
        };

        const lintIssues = parseOutput(lintResult.stdout + '\n' + lintResult.stderr);
        const tscIssues = parseOutput(tscResult.stdout + '\n' + tscResult.stderr);

        const allIssues = [...lintIssues, ...tscIssues];

        // 8. Return the report
        return {
            repo: repoUrl,
            scannedAt: new Date().toISOString(),
            issues: allIssues,
        };
    } finally {
        // 9. Clean up the temporary folder (best-effort)
        await rm(workDir, { recursive: true, force: true }).catch(() => { });
    }
}
