import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';

const rootDir = process.cwd();
const hookScript = path.join(rootDir, '.claude/hooks/block-destructive-git.sh');
const commitMsgHook = path.join(rootDir, '.githooks/commit-msg');
const prePushHook = path.join(rootDir, '.githooks/pre-push');

function runClaudeHook(command: string) {
  const payload = JSON.stringify({
    tool_name: 'Bash',
    tool_input: { command },
  });
  return spawnSync('sh', [hookScript], {
    input: payload,
    encoding: 'utf8',
  });
}

describe('multi-agent repo structure and destructive git protections', () => {
  it('links CLAUDE.md to AGENTS.md and documents repo structure and short-commit policy', () => {
    assert.equal(
      existsSync(path.join(rootDir, 'CLAUDE.md')),
      true,
      'CLAUDE.md must exist',
    );
    const claudeMd = readFileSync(path.join(rootDir, 'CLAUDE.md'), 'utf8');
    assert.match(claudeMd, /@AGENTS\.md/);

    const agentsMd = readFileSync(path.join(rootDir, 'AGENTS.md'), 'utf8');
    assert.match(agentsMd, /## Repository structure/);
    assert.match(agentsMd, /## Multi-agent version control & short commits/);
    assert.match(agentsMd, /## Forbidden git & GitHub commands/);
  });

  it('configures Claude Code settings with explicit destructive git denials and PreToolUse hook', () => {
    const settingsPath = path.join(rootDir, '.claude/settings.json');
    assert.equal(
      existsSync(settingsPath),
      true,
      '.claude/settings.json must exist',
    );
    const settings = JSON.parse(readFileSync(settingsPath, 'utf8'));

    assert.ok(Array.isArray(settings.permissions?.deny));
    assert.ok(settings.permissions.deny.includes('Bash(git push --force:*)'));
    assert.ok(settings.permissions.deny.includes('Bash(git reset --hard:*)'));
    assert.ok(
      settings.permissions.deny.includes('Bash(gh pr merge --admin:*)'),
    );
    assert.ok(Array.isArray(settings.hooks?.PreToolUse));
  });

  it('blocks destructive git and gh commands in the PreToolUse hook while allowing safe workflow commands', () => {
    assert.equal(
      existsSync(hookScript),
      true,
      'block-destructive-git.sh must exist',
    );

    const blockedCommands = [
      'git push --force origin feat/test',
      'git push -f origin feat/test',
      'git push --force-with-lease origin feat/test',
      'git push origin main',
      'git push origin HEAD:main',
      'git reset --hard HEAD~1',
      'git clean -fd',
      'git checkout -- .',
      'git restore .',
      'git branch -D feat/other-agent',
      'gh pr merge 12 --admin',
      'gh repo delete Reakwind/tali-cukierman-yaffe',
    ];

    for (const cmd of blockedCommands) {
      const res = runClaudeHook(cmd);
      assert.notEqual(res.status, 0, `Expected command to be blocked: ${cmd}`);
      assert.match(res.stderr + res.stdout, /REFUSED/i);
    }

    const allowedCommands = [
      'git status -sb',
      'git checkout -b feat/new-section',
      'git commit -m "feat: add study summary"',
      'git push -u origin feat/new-section',
      'gh pr create --fill',
      'gh pr merge --squash --delete-branch',
      'npm run verify',
    ];

    for (const cmd of allowedCommands) {
      const res = runClaudeHook(cmd);
      assert.equal(
        res.status,
        0,
        `Expected safe command to be allowed: ${cmd}`,
      );
    }
  });

  it('enforces short conventional commit subject lines in .githooks/commit-msg', () => {
    assert.equal(
      existsSync(commitMsgHook),
      true,
      '.githooks/commit-msg must exist',
    );
    const tempDir = mkdtempSync(path.join(tmpdir(), 'commit-msg-test-'));
    try {
      const msgFile = path.join(tempDir, 'COMMIT_EDITMSG');

      writeFileSync(msgFile, 'feat: add methods scrollytelling section\n');
      const valid = spawnSync('sh', [commitMsgHook, msgFile], {
        encoding: 'utf8',
      });
      assert.equal(valid.status, 0, valid.stderr);

      writeFileSync(msgFile, 'updated some stuff without prefix\n');
      const missingPrefix = spawnSync('sh', [commitMsgHook, msgFile], {
        encoding: 'utf8',
      });
      assert.notEqual(missingPrefix.status, 0);

      writeFileSync(
        msgFile,
        'feat: this commit subject line is intentionally way over seventy two characters long so the hook rejects it\n',
      );
      const tooLong = spawnSync('sh', [commitMsgHook, msgFile], {
        encoding: 'utf8',
      });
      assert.notEqual(tooLong.status, 0);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('blocks direct pushes to main in .githooks/pre-push while allowing feature branch pushes', () => {
    assert.equal(
      existsSync(prePushHook),
      true,
      '.githooks/pre-push must exist',
    );

    const pushToMain = spawnSync(
      'sh',
      [
        prePushHook,
        'origin',
        'https://github.com/Reakwind/tali-cukierman-yaffe.git',
      ],
      {
        input:
          'refs/heads/main 1111111111111111111111111111111111111111 refs/heads/main 2222222222222222222222222222222222222222\n',
        encoding: 'utf8',
      },
    );
    assert.notEqual(pushToMain.status, 0);

    const pushFeature = spawnSync(
      'sh',
      [
        prePushHook,
        'origin',
        'https://github.com/Reakwind/tali-cukierman-yaffe.git',
      ],
      {
        input:
          'refs/heads/feat/methods 1111111111111111111111111111111111111111 refs/heads/feat/methods 0000000000000000000000000000000000000000\n',
        encoding: 'utf8',
      },
    );
    assert.equal(pushFeature.status, 0, pushFeature.stderr);
  });

  it('refuses a push when the remote tip has not been fetched, but allows fast-forwards', () => {
    // A throwaway repository with two commits, so the test does not depend
    // on how much history the surrounding checkout has (CI clones shallowly).
    const repo = mkdtempSync(path.join(tmpdir(), 'pre-push-test-'));
    const env = {
      ...process.env,
      GIT_CONFIG_GLOBAL: '/dev/null',
      GIT_CONFIG_NOSYSTEM: '1',
      GIT_AUTHOR_NAME: 'Test',
      GIT_AUTHOR_EMAIL: 'test@example.invalid',
      GIT_COMMITTER_NAME: 'Test',
      GIT_COMMITTER_EMAIL: 'test@example.invalid',
    };
    const git = (...args: string[]) =>
      spawnSync('git', args, {
        cwd: repo,
        env,
        encoding: 'utf8',
      }).stdout.trim();
    const push = (input: string) =>
      spawnSync(
        'sh',
        [prePushHook, 'origin', 'https://github.com/Reakwind/x.git'],
        { cwd: repo, env, input, encoding: 'utf8' },
      );
    try {
      git('init', '-q');
      git('commit', '-q', '--allow-empty', '-m', 'first');
      const first = git('rev-parse', 'HEAD');
      git('commit', '-q', '--allow-empty', '-m', 'second');
      const second = git('rev-parse', 'HEAD');

      // Someone else's commit we have never fetched: the ancestry check cannot
      // run, so a force push could silently overwrite their work.
      const unknown = push(
        `refs/heads/feat/x ${second} refs/heads/feat/x 3333333333333333333333333333333333333333\n`,
      );
      assert.notEqual(unknown.status, 0);
      assert.match(unknown.stderr, /fetch/i);

      const fastForward = push(
        `refs/heads/feat/x ${second} refs/heads/feat/x ${first}\n`,
      );
      assert.equal(fastForward.status, 0, fastForward.stderr);

      const rewind = push(
        `refs/heads/feat/x ${first} refs/heads/feat/x ${second}\n`,
      );
      assert.notEqual(rewind.status, 0, 'non-fast-forward is still refused');
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it('keeps the memory plugin state file out of git', () => {
    const ignored = spawnSync(
      'git',
      ['check-ignore', '--quiet', '.anchor/session-state.md'],
      { encoding: 'utf8' },
    );
    assert.equal(ignored.status, 0, '.anchor/ should be in .gitignore');
  });
});
