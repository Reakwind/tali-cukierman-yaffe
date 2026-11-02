import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';

const script = path.join(process.cwd(), 'scripts/session.ts');
const DATE = '2026-11-02';
const env = {
  ...process.env,
  GIT_CONFIG_GLOBAL: '/dev/null',
  GIT_CONFIG_NOSYSTEM: '1',
  GIT_AUTHOR_NAME: 'Test',
  GIT_AUTHOR_EMAIL: 'test@example.invalid',
  GIT_COMMITTER_NAME: 'Test',
  GIT_COMMITTER_EMAIL: 'test@example.invalid',
  SESSION_DATE: DATE,
  SESSION_NO_PR: '1',
};

let base: string;
let root: string;
let origin: string;
let worktrees: string;

function git(cwd: string, ...args: string[]) {
  const res = spawnSync('git', args, { cwd, env, encoding: 'utf8' });
  assert.equal(res.status, 0, `git ${args.join(' ')}: ${res.stderr}`);
  return res.stdout.trim();
}

function session(cwd: string, ...args: string[]) {
  return spawnSync('node', [script, ...args], { cwd, env, encoding: 'utf8' });
}

function commitFile(cwd: string, file: string, text: string, msg: string) {
  writeFileSync(path.join(cwd, file), text);
  git(cwd, 'add', file);
  git(cwd, 'commit', '-q', '-m', msg);
}

/** A second clone standing in for GitHub and other contributors. */
function remoteClone() {
  const merger = path.join(base, 'merger');
  if (!existsSync(merger)) git(base, 'clone', '-q', origin, merger);
  git(merger, 'pull', '-q', '--ff-only');
  return merger;
}

/** Imitates GitHub's squash merge of `branch` into origin/main. */
function squashMerge(branch: string) {
  const merger = remoteClone();
  git(merger, 'fetch', '-q', 'origin', branch);
  git(merger, 'merge', '-q', '--squash', 'FETCH_HEAD');
  git(merger, 'commit', '-q', '-m', `feat: squash ${branch}`);
  git(merger, 'push', '-q', 'origin', 'main');
}

beforeEach(() => {
  base = mkdtempSync(path.join(tmpdir(), 'session-workflow-'));
  origin = path.join(base, 'origin.git');
  root = path.join(base, 'site');
  worktrees = path.join(base, 'site.worktrees');
  git(base, 'init', '-q', '--bare', '-b', 'main', origin);
  git(base, 'clone', '-q', origin, root);
  git(root, 'switch', '-q', '-c', 'main');
  commitFile(root, 'README.md', 'start\n', 'chore: seed');
  git(root, 'push', '-q', '-u', 'origin', 'main');
});

afterEach(() => rmSync(base, { recursive: true, force: true }));

describe('session worktrees and the daily pull request', () => {
  it('starts each session in its own worktree from the latest main', () => {
    const other = remoteClone(); // main moves on while root is behind
    commitFile(other, 'news.txt', 'news\n', 'docs: add news');
    git(other, 'push', '-q', 'origin', 'main');
    const res = session(root, 'start', 'skip-link');
    assert.equal(res.status, 0, res.stderr);
    const wt = path.join(worktrees, `${DATE}-skip-link`);
    assert.equal(
      git(wt, 'branch', '--show-current'),
      `session/${DATE}-skip-link`,
    );
    assert.equal(
      git(wt, 'rev-parse', 'HEAD'),
      git(root, 'rev-parse', 'origin/main'),
    );
    assert.equal(
      git(root, 'rev-parse', 'main'),
      git(root, 'rev-parse', 'origin/main'),
    );
    assert.equal(git(root, 'branch', '--show-current'), 'main');
    assert.match(res.stdout, new RegExp(wt.replaceAll('\\', '\\\\')));
  });

  it('refuses to start when the root is not a clean main checkout', () => {
    writeFileSync(path.join(root, 'stray.txt'), 'uncommitted\n');
    const res = session(root, 'start', 'anything');
    assert.notEqual(res.status, 0);
    assert.match(res.stderr, /root/i);
  });

  it('combines the day’s sessions into one pushed day branch', () => {
    assert.equal(session(root, 'start', 'one').status, 0);
    assert.equal(session(root, 'start', 'two').status, 0);
    commitFile(
      path.join(worktrees, `${DATE}-one`),
      'a.txt',
      'a\n',
      'docs: add a',
    );
    commitFile(
      path.join(worktrees, `${DATE}-two`),
      'b.txt',
      'b\n',
      'fix: add b',
    );
    const res = session(root, 'finish');
    assert.equal(res.status, 0, res.stderr);
    const remote = git(root, 'ls-remote', 'origin', `refs/heads/day/${DATE}`);
    assert.ok(remote, 'day branch should be pushed');
    const subjects = git(
      root,
      'log',
      '--no-merges',
      '--format=%s',
      `origin/main..origin/day/${DATE}`,
    );
    assert.deepEqual(subjects.split('\n').sort(), [
      'docs: add a',
      'fix: add b',
    ]);
  });

  it('will not finish the day while a session has uncommitted work', () => {
    assert.equal(session(root, 'start', 'busy').status, 0);
    const wt = path.join(worktrees, `${DATE}-busy`);
    commitFile(wt, 'a.txt', 'a\n', 'docs: add a');
    writeFileSync(path.join(wt, 'draft.txt'), 'not committed\n');
    const res = session(root, 'finish');
    assert.notEqual(res.status, 0);
    assert.match(res.stderr, /uncommitted/i);
  });

  it('after the squash merge, trims finished worktrees and fast-forwards root', () => {
    assert.equal(session(root, 'start', 'done').status, 0);
    commitFile(
      path.join(worktrees, `${DATE}-done`),
      'a.txt',
      'a\n',
      'docs: add a',
    );
    assert.equal(session(root, 'start', 'unmerged').status, 0);
    commitFile(
      path.join(worktrees, `${DATE}-unmerged`),
      'u.txt',
      'u\n',
      'feat: add u',
    );
    assert.equal(session(root, 'start', 'fresh').status, 0); // no commits yet
    assert.equal(
      session(root, 'finish', '--only', `session/${DATE}-done`).status,
      0,
    );
    squashMerge(`day/${DATE}`);

    const res = session(root, 'cleanup');
    assert.equal(res.status, 0, res.stderr);
    assert.equal(existsSync(path.join(worktrees, `${DATE}-done`)), false);
    assert.equal(existsSync(path.join(worktrees, `day-${DATE}`)), false);
    const branches = git(root, 'branch', '--format=%(refname:short)').split(
      '\n',
    );
    assert.ok(!branches.includes(`session/${DATE}-done`));
    assert.ok(!branches.includes(`day/${DATE}`));
    // Work that is not on main, or not started, is never trimmed.
    assert.ok(branches.includes(`session/${DATE}-unmerged`));
    assert.ok(existsSync(path.join(worktrees, `${DATE}-unmerged`)));
    assert.ok(branches.includes(`session/${DATE}-fresh`));
    assert.equal(
      git(root, 'rev-parse', 'main'),
      git(root, 'rev-parse', 'origin/main'),
    );
  });

  it('keeps a merged worktree that has uncommitted changes', () => {
    assert.equal(session(root, 'start', 'dirty').status, 0);
    const wt = path.join(worktrees, `${DATE}-dirty`);
    commitFile(wt, 'a.txt', 'a\n', 'docs: add a');
    assert.equal(session(root, 'finish').status, 0);
    squashMerge(`day/${DATE}`);
    writeFileSync(path.join(wt, 'later.txt'), 'new idea\n');
    const res = session(root, 'cleanup');
    assert.equal(res.status, 0, res.stderr);
    assert.ok(existsSync(path.join(wt, 'later.txt')));
    assert.match(res.stdout + res.stderr, /uncommitted/i);
  });

  it('trims merged work even after main later edits the same files', () => {
    assert.equal(session(root, 'start', 'early').status, 0);
    const wt = path.join(worktrees, `${DATE}-early`);
    commitFile(wt, 'a.txt', 'a\n', 'docs: add a');
    assert.equal(session(root, 'finish').status, 0);
    squashMerge(`day/${DATE}`);
    const other = remoteClone(); // the next day's work extends the same file
    commitFile(other, 'a.txt', 'a\nmore\n', 'docs: extend a');
    git(other, 'push', '-q', 'origin', 'main');

    const res = session(root, 'cleanup');
    assert.equal(res.status, 0, res.stderr);
    assert.equal(existsSync(wt), false);
    const branches = git(root, 'branch', '--format=%(refname:short)');
    assert.doesNotMatch(branches, /session\/|day\//);
  });

  it('trims sessions whose conflict was resolved on the day branch', () => {
    assert.equal(session(root, 'start', 'left').status, 0);
    assert.equal(session(root, 'start', 'right').status, 0);
    const left = path.join(worktrees, `${DATE}-left`);
    const right = path.join(worktrees, `${DATE}-right`);
    commitFile(left, 'README.md', 'left\n', 'docs: say left');
    commitFile(right, 'README.md', 'right\n', 'docs: say right');
    const conflicted = session(root, 'finish');
    assert.notEqual(conflicted.status, 0);
    assert.match(conflicted.stderr, /conflict/i);
    const day = path.join(worktrees, `day-${DATE}`);
    commitFile(day, 'README.md', 'left and right\n', 'docs: combine both');
    assert.equal(session(root, 'finish').status, 0);
    squashMerge(`day/${DATE}`);

    const res = session(root, 'cleanup');
    assert.equal(res.status, 0, res.stderr);
    assert.equal(existsSync(left), false);
    assert.equal(existsSync(right), false);
    const branches = git(root, 'branch', '--format=%(refname:short)');
    assert.doesNotMatch(branches, /session\/|day\//);
  });

  it('trims a conflict-resolved session once its temporary changes are gone', () => {
    assert.equal(session(root, 'start', 'left').status, 0);
    assert.equal(session(root, 'start', 'right').status, 0);
    const left = path.join(worktrees, `${DATE}-left`);
    const right = path.join(worktrees, `${DATE}-right`);
    commitFile(left, 'README.md', 'left\n', 'docs: say left');
    commitFile(right, 'README.md', 'right\n', 'docs: say right');
    assert.notEqual(session(root, 'finish').status, 0);
    const day = path.join(worktrees, `day-${DATE}`);
    commitFile(day, 'README.md', 'left and right\n', 'docs: combine both');
    assert.equal(session(root, 'finish').status, 0);
    squashMerge(`day/${DATE}`);

    writeFileSync(path.join(right, 'scratch.txt'), 'temporary\n');
    assert.equal(session(root, 'cleanup').status, 0);
    assert.ok(existsSync(right), 'a dirty worktree is kept');
    rmSync(path.join(right, 'scratch.txt'));

    const res = session(root, 'cleanup');
    assert.equal(res.status, 0, res.stderr);
    assert.equal(existsSync(right), false);
    const branches = git(root, 'branch', '--format=%(refname:short)');
    assert.doesNotMatch(branches, /session\/|day\//);
  });

  it('keeps a branch that gained commits after its squash merge', () => {
    assert.equal(session(root, 'start', 'ongoing').status, 0);
    const wt = path.join(worktrees, `${DATE}-ongoing`);
    commitFile(wt, 'a.txt', 'a\n', 'docs: add a');
    assert.equal(session(root, 'finish').status, 0);
    squashMerge(`day/${DATE}`);
    commitFile(wt, 'b.txt', 'b\n', 'docs: add b after the merge');

    const res = session(root, 'cleanup');
    assert.equal(res.status, 0, res.stderr);
    assert.ok(existsSync(path.join(wt, 'b.txt')));
    const branches = git(root, 'branch', '--format=%(refname:short)');
    assert.match(branches, new RegExp(`session/${DATE}-ongoing`));
  });
});
