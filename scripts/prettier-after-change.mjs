#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function run(cmd, args, opts = {}) {
    return execFileSync(cmd, args, { stdio: 'pipe', encoding: 'utf8', ...opts }).trim();
}

function fileExists(p) {
    try {
        fs.accessSync(p, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

function getRepoRoot() {
    try {
        return run('git', ['rev-parse', '--show-toplevel']);
    } catch {
        return process.cwd();
    }
}

function getChangedFiles(repoRoot) {
    try {
        // Files added/copied/modified/renamed/etc (matches the bash version’s intent)
        const out = run('git', ['diff', '--name-only', '--diff-filter=ACMRTUXB']);
        return out ? out.split('\n').filter(Boolean) : [];
    } catch {
        return [];
    }
}

const PRETTIER_EXT_RE = /\.(js|jsx|ts|tsx|mjs|cjs|json|css|scss|md|mdx|yml|yaml|html)$/i;

function filterPrettierFiles(files) {
    return files.filter((f) => PRETTIER_EXT_RE.test(f));
}

function pickPrettierCommand(repoRoot) {
    // Prefer local package manager binaries if available
    const pnpmLock = path.join(repoRoot, 'pnpm-lock.yaml');

    if (fileExists(pnpmLock)) return { cmd: 'pnpm', argsPrefix: ['prettier', '--write'] };

    // Fallback to npx (uses local prettier if installed, else downloads)
    return { cmd: 'npx', argsPrefix: ['prettier', '--write'] };
}

// --- main ---
const repoRoot = getRepoRoot();
process.chdir(repoRoot);

const changed = getChangedFiles(repoRoot);
const targets = filterPrettierFiles(changed);

if (targets.length === 0) {
    process.exit(0);
}

// Guard against accidental re-entrancy if your hook system can retrigger on writes.
// (If your Claude hook runner already prevents this, it’s still harmless.)
if (process.env.CLAUDE_PRETTIER_HOOK_RUNNING === '1') {
    process.exit(0);
}
process.env.CLAUDE_PRETTIER_HOOK_RUNNING = '1';

console.log('Running Prettier on changed files:');
for (const f of targets) console.log(`- ${f}`);

const { cmd, argsPrefix } = pickPrettierCommand(repoRoot);

try {
    execFileSync(cmd, [...argsPrefix, ...targets], { stdio: 'inherit' });
} catch (err) {
    // Don’t hide errors; fail the hook so you notice formatting problems quickly.
    process.exit(typeof err?.status === 'number' ? err.status : 1);
}
