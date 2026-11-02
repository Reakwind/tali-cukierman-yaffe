// Session worktrees and the daily pull request (see AGENTS.md).
//
//   start <slug>  fetch, trim finished work, fast-forward root main, then add
//                 a worktree on session/<date>-<slug> beside the root checkout.
//   finish        merge the day's session branches into day/<date>, push it
//                 and open one draft PR (squash-merged once checks pass).
//                 --only <branch> limits the merge; --include <ref> adds one
//                 (for example a cloud session's origin/claude/... branch).
//   cleanup       remove worktrees and session/day branches whose changes are
//                 already on origin/main, then fast-forward root main.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

type Worktree = { path: string; branch: string };

function fail(message: string): never {
  console.error(`session: ${message}`);
  process.exit(1);
}

function run(cwd: string, cmd: string, args: string[], allowFail = false) {
  const res = spawnSync(cmd, args, { cwd, encoding: 'utf8' });
  if (res.status !== 0 && !allowFail) {
    fail(`${cmd} ${args.join(' ')} failed:\n${res.stderr || res.stdout}`);
  }
  return { ok: res.status === 0, out: (res.stdout ?? '').trim() };
}

const git = (cwd: string, ...args: string[]) => run(cwd, 'git', args).out;
const gitOk = (cwd: string, ...args: string[]) =>
  run(cwd, 'git', args, true).ok;

const today =
  process.env['SESSION_DATE'] ??
  new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

// The root is the main worktree, wherever this command is run from.
const commonDir = git(
  process.cwd(),
  'rev-parse',
  '--path-format=absolute',
  '--git-common-dir',
);
const root = path.dirname(commonDir);
const worktreesDir = path.join(
  path.dirname(root),
  `${path.basename(root)}.worktrees`,
);

const isClean = (dir: string) => git(dir, 'status', '--porcelain') === '';

function worktrees(): Worktree[] {
  const list: Worktree[] = [];
  let current = '';
  for (const line of git(root, 'worktree', 'list', '--porcelain').split('\n')) {
    if (line.startsWith('worktree ')) current = line.slice(9);
    if (line.startsWith('branch refs/heads/')) {
      list.push({ path: current, branch: line.slice(18) });
    }
  }
  return list;
}

function localBranches(pattern: string) {
  const out = git(
    root,
    'for-each-ref',
    '--format=%(refname:short)',
    `refs/heads/${pattern}`,
  );
  return out ? out.split('\n') : [];
}

/** True when merging `ref` into origin/main would change nothing. */
function onMain(ref: string) {
  const merged = run(
    root,
    'git',
    ['merge-tree', '--write-tree', 'origin/main', ref],
    true,
  );
  const tree = merged.out.split('\n')[0];
  return merged.ok && tree === git(root, 'rev-parse', 'origin/main^{tree}');
}

const ahead = (ref: string) =>
  Number(git(root, 'rev-list', '--count', `origin/main..${ref}`));

function fastForwardRoot() {
  if (git(root, 'branch', '--show-current') !== 'main' || !isClean(root)) {
    console.warn('session: root is not a clean main checkout; not updated.');
    return;
  }
  git(root, 'merge', '--ff-only', '--quiet', 'origin/main');
}

function cleanup() {
  git(root, 'fetch', '--prune', '--quiet', 'origin');
  const attached = worktrees();
  const here = git(process.cwd(), 'rev-parse', '--show-toplevel');
  for (const branch of [
    ...localBranches('session/**'),
    ...localBranches('day/**'),
  ]) {
    // A branch with no commits of its own is a session that has not started.
    if (ahead(branch) === 0 || !onMain(branch)) continue;
    const wt = attached.find((w) => w.branch === branch);
    if (wt) {
      if (wt.path === here) {
        console.warn(`session: kept ${wt.path} (current directory).`);
        continue;
      }
      if (!isClean(wt.path)) {
        console.warn(`session: kept ${wt.path}: it has uncommitted changes.`);
        continue;
      }
      git(root, 'worktree', 'remove', wt.path);
    }
    // Safe: every change on this branch is already on origin/main.
    git(root, 'branch', '-D', '--quiet', branch);
    console.log(`session: trimmed ${branch}`);
  }
  git(root, 'worktree', 'prune');
  fastForwardRoot();
}

function start(slug: string | undefined) {
  if (!slug || !/^[a-z0-9][a-z0-9-]{0,40}$/.test(slug)) {
    fail('usage: start <slug> (lowercase letters, digits and dashes)');
  }
  if (git(root, 'branch', '--show-current') !== 'main' || !isClean(root)) {
    fail(`the root checkout ${root} must be a clean main; work in worktrees.`);
  }
  cleanup();
  const branch = `session/${today}-${slug}`;
  const dir = path.join(worktreesDir, `${today}-${slug}`);
  if (existsSync(dir) || localBranches(branch).length) {
    fail(`${branch} already exists at ${dir}.`);
  }
  git(
    root,
    'worktree',
    'add',
    '--quiet',
    '--no-track',
    '-b',
    branch,
    dir,
    'origin/main',
  );
  console.log(`Session worktree: ${dir}\nBranch: ${branch}\n`);
  console.log(git(root, 'log', '--oneline', '-n', '10', 'origin/main'));
  const open = worktrees().filter((w) => w.path !== root && w.path !== dir);
  if (open.length) {
    console.log('\nOther open worktrees:');
    for (const w of open) console.log(`  ${w.branch}  ${w.path}`);
  }
}

function finish(args: string[]) {
  const only: string[] = [];
  const include: string[] = [];
  for (let i = 0; i < args.length; i += 2) {
    const value = args[i + 1];
    if (!value) fail(`missing value after ${args[i]}`);
    if (args[i] === '--only') only.push(value);
    else if (args[i] === '--include') include.push(value);
    else fail(`unknown option ${args[i]}`);
  }
  git(root, 'fetch', '--prune', '--quiet', 'origin');
  const sessions = only.length ? only : localBranches(`session/${today}-*`);
  const refs = [...sessions, ...include].filter((ref) => ahead(ref) > 0);
  if (!refs.length) fail(`no session commits for ${today} to finish.`);

  const dirty = worktrees().filter(
    (w) => sessions.includes(w.branch) && !isClean(w.path),
  );
  if (dirty.length) {
    fail(
      `commit or set aside uncommitted work first:\n${dirty
        .map((w) => `  ${w.path}`)
        .join('\n')}`,
    );
  }

  const day = `day/${today}`;
  const dayDir = path.join(worktreesDir, `day-${today}`);
  if (!existsSync(dayDir)) {
    if (localBranches(day).length) git(root, 'worktree', 'add', dayDir, day);
    else {
      git(
        root,
        'worktree',
        'add',
        '--quiet',
        '--no-track',
        '-b',
        day,
        dayDir,
        'origin/main',
      );
    }
  }
  for (const ref of refs) {
    if (!gitOk(dayDir, 'merge', '--no-ff', '--no-edit', '--quiet', ref)) {
      fail(
        `merging ${ref} into ${day} conflicts. Resolve in ${dayDir}, ` +
          'commit, then run finish again.',
      );
    }
  }
  git(dayDir, 'push', '--quiet', '-u', 'origin', day);
  const changes = git(
    dayDir,
    'log',
    '--no-merges',
    '--reverse',
    '--format=- %s',
    `origin/main..${day}`,
  );
  console.log(`Pushed ${day}:\n${changes}`);

  if (process.env['SESSION_NO_PR']) return;
  const existing = run(
    dayDir,
    'gh',
    [
      'pr',
      'list',
      '--head',
      day,
      '--state',
      'open',
      '--json',
      'url',
      '-q',
      '.[].url',
    ],
    true,
  );
  if (existing.out) {
    console.log(`Updated the open PR: ${existing.out}`);
    return;
  }
  const body = [
    '## Why',
    '',
    `Changes from the ${today} sessions.`,
    '',
    '## What changed',
    '',
    changes,
    '',
    '## Verification',
    '',
    '- Red/green evidence: see each commit.',
    '',
    '## Limits / approvals needed',
    '',
    '- [ ] No patient data, secrets, unsupported claims, or unapproved live recruitment.',
    '- [ ] Required checks pass for this exact revision; ready for agent squash merge.',
  ].join('\n');
  const pr = run(
    dayDir,
    'gh',
    [
      'pr',
      'create',
      '--draft',
      '--base',
      'main',
      '--head',
      day,
      '--title',
      `chore: session work for ${today}`,
      '--body',
      body,
    ],
    true,
  );
  console.log(
    pr.ok
      ? `Draft PR: ${pr.out}`
      : 'gh is unavailable; open the PR for this branch on GitHub.',
  );
}

const [command, ...rest] = process.argv.slice(2);
if (command === 'start') start(rest[0]);
else if (command === 'finish') finish(rest);
else if (command === 'cleanup') cleanup();
else {
  console.error(
    'usage: node scripts/session.ts start <slug> | finish | cleanup',
  );
  process.exit(2);
}
