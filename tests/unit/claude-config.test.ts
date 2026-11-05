import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';

const rootDir = process.cwd();
const read = (file: string) => readFileSync(path.join(rootDir, file), 'utf8');
const settings = () => JSON.parse(read('.claude/settings.json'));

describe('Claude Code permissions', () => {
  it('asks the owner before Claude opens or merges a pull request', () => {
    const { allow, ask } = settings().permissions;
    for (const rule of [
      'Bash(gh pr create:*)',
      'Bash(gh pr merge --squash:*)',
      'Bash(npm run day:finish:*)',
      'mcp__github__create_pull_request',
      'mcp__github__merge_pull_request',
    ]) {
      assert.ok(ask?.includes(rule), `${rule} should be an ask rule`);
      assert.ok(!allow.includes(rule), `${rule} should not be pre-approved`);
    }
  });

  it('pre-approves no command of the retired Astro draft', () => {
    const { allow } = settings().permissions;
    assert.deepEqual(
      allow.filter((rule: string) => rule.includes('astro')),
      [],
    );
  });
});

const hook = (name: string) => path.join(rootDir, '.claude/hooks', name);

const runHook = (
  name: string,
  payload: unknown,
  env: Record<string, string> = {},
) =>
  spawnSync('sh', [hook(name)], {
    input: JSON.stringify(payload),
    env: { ...process.env, ...env },
    encoding: 'utf8',
  });

describe('Claude Code formatting hook', () => {
  it('runs after every Edit and Write', () => {
    const entries = settings().hooks?.PostToolUse ?? [];
    const entry = entries.find((e: { hooks: { command: string }[] }) =>
      e.hooks.some((h) => h.command.includes('format-edited-file.sh')),
    );
    assert.ok(entry, 'PostToolUse should run format-edited-file.sh');
    for (const tool of ['Edit', 'Write']) {
      assert.match(entry.matcher, new RegExp(`\\b${tool}\\b`));
    }
  });

  it('formats an edited project file and leaves files outside alone', () => {
    const project = mkdtempSync(path.join(tmpdir(), 'format-hook-'));
    const outside = mkdtempSync(path.join(tmpdir(), 'format-hook-out-'));
    const messy = 'const  a   =  {b:1}\n';
    try {
      const inside = path.join(project, 'example.ts');
      const elsewhere = path.join(outside, 'example.ts');
      writeFileSync(inside, messy);
      writeFileSync(elsewhere, messy);
      const env = { CLAUDE_PROJECT_DIR: project };

      const formatted = runHook(
        'format-edited-file.sh',
        { tool_name: 'Edit', tool_input: { file_path: inside } },
        env,
      );
      assert.equal(formatted.status, 0, formatted.stderr);
      assert.equal(readFileSync(inside, 'utf8'), 'const a = { b: 1 };\n');

      const skipped = runHook(
        'format-edited-file.sh',
        { tool_name: 'Write', tool_input: { file_path: elsewhere } },
        env,
      );
      assert.equal(skipped.status, 0, skipped.stderr);
      assert.equal(readFileSync(elsewhere, 'utf8'), messy);
    } finally {
      rmSync(project, { recursive: true, force: true });
      rmSync(outside, { recursive: true, force: true });
    }
  });
});

describe('Claude Code check before finishing', () => {
  it('runs when Claude tries to end its turn', () => {
    const commands = (settings().hooks?.Stop ?? []).flatMap(
      (e: { hooks: { command: string }[] }) => e.hooks.map((h) => h.command),
    );
    assert.ok(
      commands.some((c: string) => c.includes('check-before-stop.sh')),
      'Stop should run check-before-stop.sh',
    );
  });

  it('sends Claude back on a failing check and skips a state that passed', () => {
    const repo = mkdtempSync(path.join(tmpdir(), 'stop-hook-'));
    const env = (check: string) => ({
      CLAUDE_PROJECT_DIR: repo,
      CLAUDE_STOP_CHECK: check,
      GIT_CONFIG_GLOBAL: '/dev/null',
      GIT_CONFIG_NOSYSTEM: '1',
    });
    const stop = (check: string) =>
      runHook('check-before-stop.sh', { hook_event_name: 'Stop' }, env(check));
    const failing = 'echo lint found a problem >&2; exit 1';
    try {
      spawnSync('git', ['init', '-q'], { cwd: repo, env: env('true') });
      writeFileSync(path.join(repo, 'page.html'), '<p>one</p>\n');

      const blocked = stop(failing);
      assert.equal(blocked.status, 2, 'a failing check blocks the stop');
      assert.match(blocked.stderr, /lint found a problem/);

      assert.equal(stop('true').status, 0, 'a passing check lets it stop');
      assert.equal(
        stop(failing).status,
        0,
        'an unchanged state that passed is not checked again',
      );

      writeFileSync(path.join(repo, 'page.html'), '<p>two</p>\n');
      assert.equal(stop(failing).status, 2, 'a changed state is checked');
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });
});
