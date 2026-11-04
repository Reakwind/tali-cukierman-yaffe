import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import {
  chmodSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  utimesSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const root = new URL('../../', import.meta.url).pathname;
const read = (path: string) => readFileSync(join(root, path), 'utf8');
const setup = read('scripts/cloud-setup.sh');
const pkg = JSON.parse(read('package.json'));
const pinned = (name: string) =>
  setup.match(new RegExp(`^${name}=(\\S+)$`, 'm'))?.[1];

describe('cloud environment setup script', () => {
  it('installs the Node and Playwright versions the project pins', () => {
    assert.equal(pinned('NODE_VERSION'), read('.node-version').trim());
    assert.equal(
      pinned('PLAYWRIGHT_VERSION'),
      pkg.devDependencies['@playwright/test'],
    );
  });

  it('installs Node from nodejs.org, checked against its published checksums', () => {
    // Cloud images no longer ship nvm, so the script must not rely on it.
    assert.doesNotMatch(setup, /nvm/);
    assert.match(setup, /https:\/\/nodejs\.org\/dist\/v\$NODE_VERSION\//);
    assert.match(setup, /SHASUMS256\.txt/);
    assert.match(setup, /sha256sum --check/);
    // ~/.local/bin precedes the image's own Node on PATH, for shells and hooks.
    assert.match(setup, /\$HOME\/\.local\/bin/);
  });

  it('is valid bash', () => {
    execFileSync('bash', ['-n', join(root, 'scripts/cloud-setup.sh')]);
  });
});

describe('SessionStart hook', () => {
  const settings = JSON.parse(read('.claude/settings.json'));
  const hook = join(root, '.claude/hooks/session-start.sh');

  it('is registered for every session start', () => {
    const commands = (settings.hooks?.SessionStart ?? []).flatMap(
      (entry: { hooks: { command: string }[] }) =>
        entry.hooks.map((h) => h.command),
    );
    assert.deepEqual(commands, ['sh .claude/hooks/session-start.sh']);
  });

  /** Runs the hook in a scratch project with stub node and npm on PATH. */
  const run = (options: {
    remote: boolean;
    node: string;
    installed: 'none' | 'stale' | 'fresh';
  }) => {
    const dir = mkdtempSync(join(tmpdir(), 'tcy-session-start-'));
    try {
      const bin = join(dir, 'bin');
      mkdirSync(bin);
      writeFileSync(join(dir, '.node-version'), '24.22.2\n');
      writeFileSync(join(dir, 'package-lock.json'), '{}\n');
      const stub = (name: string, body: string) => {
        writeFileSync(join(bin, name), `#!/bin/sh\n${body}\n`);
        chmodSync(join(bin, name), 0o755);
      };
      stub('node', `echo ${options.node}`);
      stub('npm', `echo "$@" >> "${join(dir, 'npm-calls')}"`);
      if (options.installed !== 'none') {
        mkdirSync(join(dir, 'node_modules'));
        const marker = join(dir, 'node_modules/.package-lock.json');
        writeFileSync(marker, '{}\n');
        const age = options.installed === 'stale' ? -60 : 60;
        const when = new Date(Date.now() + age * 1000);
        utimesSync(marker, when, when);
      }
      const env: NodeJS.ProcessEnv = {
        PATH: `${bin}:/usr/bin:/bin`,
        HOME: dir,
      };
      if (options.remote) env['CLAUDE_CODE_REMOTE'] = 'true';
      const result = spawnSync('sh', [hook], {
        cwd: dir,
        env,
        encoding: 'utf8',
      });
      let npm = '';
      try {
        npm = readFileSync(join(dir, 'npm-calls'), 'utf8');
      } catch {
        // npm was not called.
      }
      return { status: result.status, stdout: result.stdout, npm };
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  };

  it('does nothing outside cloud sessions', () => {
    const result = run({ remote: false, node: 'v22.0.0', installed: 'none' });
    assert.deepEqual(result, { status: 0, stdout: '', npm: '' });
  });

  it('installs dependencies in a cloud session when none are installed', () => {
    const result = run({ remote: true, node: 'v24.22.2', installed: 'none' });
    assert.equal(result.status, 0);
    assert.match(result.npm, /^ci\b/);
  });

  it('reinstalls when the lockfile is newer than the installed modules', () => {
    const result = run({ remote: true, node: 'v24.22.2', installed: 'stale' });
    assert.match(result.npm, /^ci\b/);
  });

  it('stays quiet when the toolchain and modules are current', () => {
    const result = run({ remote: true, node: 'v24.22.2', installed: 'fresh' });
    assert.deepEqual(result, { status: 0, stdout: '', npm: '' });
  });

  it('tells the agent when the pinned Node is missing', () => {
    const result = run({ remote: true, node: 'v22.23.4', installed: 'fresh' });
    assert.equal(result.status, 0);
    assert.match(result.stdout, /v22\.23\.4/);
    assert.match(result.stdout, /24\.22\.2/);
    assert.match(result.stdout, /docs\/operations\.md/);
  });
});
