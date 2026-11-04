import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import {
  chmodSync,
  copyFileSync,
  existsSync,
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
const pkg = JSON.parse(read('package.json'));

describe('cloud environment setup script', () => {
  const setup = read('scripts/cloud-setup.sh');

  it('holds no versions, so it never needs pasting again', () => {
    assert.doesNotMatch(setup, /\b\d+\.\d+\.\d+\b/);
    assert.doesNotMatch(setup, /NODE_VERSION=|PLAYWRIGHT_VERSION=/);
  });

  it('installs what main pins, through the repository toolchain script', () => {
    assert.match(
      setup,
      /https:\/\/raw\.githubusercontent\.com\/Reakwind\/tali-cukierman-yaffe\/main\/scripts\/toolchain\.sh/,
    );
    assert.match(setup, /--from-main/);
    // A failed install must not stop the session from starting: the
    // SessionStart hook repairs the toolchain once the session is up.
    assert.match(setup, /\|\| echo /);
  });

  it('is valid bash', () => {
    execFileSync('bash', ['-n', join(root, 'scripts/cloud-setup.sh')]);
  });
});

describe('toolchain script', () => {
  const toolchain = read('scripts/toolchain.sh');

  it('reads the versions this checkout pins', () => {
    const out = execFileSync('bash', [
      join(root, 'scripts/toolchain.sh'),
      'versions',
    ]).toString();
    assert.equal(
      out.trim(),
      `node=${read('.node-version').trim()} playwright=${pkg.devDependencies['@playwright/test']}`,
    );
  });

  it('follows the files when the pins change', () => {
    const dir = mkdtempSync(join(tmpdir(), 'tcy-toolchain-'));
    try {
      mkdirSync(join(dir, 'scripts'));
      copyFileSync(
        join(root, 'scripts/toolchain.sh'),
        join(dir, 'scripts/toolchain.sh'),
      );
      writeFileSync(join(dir, '.node-version'), '24.30.1\n');
      writeFileSync(
        join(dir, 'package.json'),
        JSON.stringify({ devDependencies: { '@playwright/test': '1.66.0' } }),
      );
      const out = execFileSync('bash', [
        join(dir, 'scripts/toolchain.sh'),
        'versions',
      ]).toString();
      assert.equal(out.trim(), 'node=24.30.1 playwright=1.66.0');
      // Anything that is not a plain version is refused before use.
      writeFileSync(join(dir, '.node-version'), '24.30.1; rm -rf /\n');
      const bad = spawnSync('bash', [
        join(dir, 'scripts/toolchain.sh'),
        'versions',
      ]);
      assert.notEqual(bad.status, 0);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('reports which pinned browsers are missing', () => {
    const dir = mkdtempSync(join(tmpdir(), 'tcy-browsers-'));
    try {
      const core = join(dir, 'node_modules/playwright-core');
      mkdirSync(core, { recursive: true });
      writeFileSync(
        join(core, 'browsers.json'),
        JSON.stringify({
          browsers: [
            { name: 'chromium', revision: '1' },
            { name: 'chromium-headless-shell', revision: '1' },
            { name: 'firefox', revision: '2' },
            { name: 'webkit', revision: '3' },
            { name: 'ffmpeg', revision: '9' },
          ],
        }),
      );
      const browsers = join(dir, 'browsers');
      for (const name of [
        'chromium-1',
        'chromium_headless_shell-1',
        'webkit-3',
      ]) {
        mkdirSync(join(browsers, name), { recursive: true });
        writeFileSync(join(browsers, name, 'INSTALLATION_COMPLETE'), '');
      }
      mkdirSync(join(dir, 'scripts'));
      copyFileSync(
        join(root, 'scripts/toolchain.sh'),
        join(dir, 'scripts/toolchain.sh'),
      );
      writeFileSync(join(dir, '.node-version'), '24.22.2\n');
      writeFileSync(
        join(dir, 'package.json'),
        JSON.stringify({ devDependencies: { '@playwright/test': '1.64.1' } }),
      );
      const check = (env: NodeJS.ProcessEnv) =>
        spawnSync(
          'bash',
          [join(dir, 'scripts/toolchain.sh'), 'check-browsers'],
          {
            env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: browsers, ...env },
            encoding: 'utf8',
          },
        );
      const missing = check({});
      assert.equal(missing.status, 1);
      assert.match(missing.stdout, /firefox-2/);
      mkdirSync(join(browsers, 'firefox-2'));
      writeFileSync(join(browsers, 'firefox-2', 'INSTALLATION_COMPLETE'), '');
      assert.equal(check({}).status, 0);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('installs Node from nodejs.org, checked against its published checksums', () => {
    assert.doesNotMatch(toolchain, /nvm/);
    assert.match(toolchain, /https:\/\/nodejs\.org\/dist\/v\$NODE_VERSION\//);
    assert.match(toolchain, /SHASUMS256\.txt/);
    assert.match(toolchain, /sha256sum --check/);
    // ~/.local/bin precedes the image's Node on PATH, for shells and hooks.
    assert.match(toolchain, /\$HOME\/\.local\/bin/);
  });

  it('is valid bash', () => {
    execFileSync('bash', ['-n', join(root, 'scripts/toolchain.sh')]);
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

  /** Runs the hook in a scratch project with stub node, npm and toolchain. */
  const run = (options: {
    remote: boolean;
    node: string;
    installed: 'none' | 'stale' | 'fresh';
    // What the stub toolchain does when asked to install Node.
    nodeInstall?: 'works' | 'fails';
    browsers?: 'present' | 'missing';
  }) => {
    const dir = mkdtempSync(join(tmpdir(), 'tcy-session-start-'));
    try {
      const bin = join(dir, 'bin');
      mkdirSync(bin);
      mkdirSync(join(dir, 'scripts'));
      writeFileSync(join(dir, '.node-version'), '24.22.2\n');
      writeFileSync(join(dir, 'package-lock.json'), '{}\n');
      const stub = (path: string, body: string) => {
        writeFileSync(path, `#!/bin/sh\n${body}\n`);
        chmodSync(path, 0o755);
      };
      stub(join(bin, 'node'), `echo ${options.node}`);
      stub(join(bin, 'npm'), `echo "$@" >> "${join(dir, 'npm-calls')}"`);
      const log = join(dir, 'toolchain-calls');
      stub(
        join(dir, 'scripts/toolchain.sh'),
        [
          `echo "$@" >> "${log}"`,
          'case "$1" in',
          options.nodeInstall === 'works'
            ? `  node) printf '#!/bin/sh\\necho v24.22.2\\n' > "${join(bin, 'node')}" ;;`
            : '  node) exit 1 ;;',
          options.browsers === 'missing'
            ? '  check-browsers) [ -f "$0.done" ] || exit 1 ;;\n  browsers) touch "$0.done" ;;'
            : '  check-browsers) exit 0 ;;',
          'esac',
        ].join('\n'),
      );
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
      const calls = (file: string) =>
        existsSync(file) ? readFileSync(file, 'utf8') : '';
      return {
        status: result.status,
        stdout: result.stdout,
        npm: calls(join(dir, 'npm-calls')),
        toolchain: calls(log),
      };
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  };

  it('does nothing outside cloud sessions', () => {
    const result = run({ remote: false, node: 'v22.0.0', installed: 'none' });
    assert.deepEqual(result, { status: 0, stdout: '', npm: '', toolchain: '' });
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
    assert.equal(result.status, 0);
    assert.equal(result.stdout, '');
    assert.equal(result.npm, '');
    assert.doesNotMatch(result.toolchain, /^(node|browsers)$/m);
  });

  it('installs the pinned Node when another one is running', () => {
    const result = run({
      remote: true,
      node: 'v22.23.4',
      installed: 'fresh',
      nodeInstall: 'works',
    });
    assert.equal(result.status, 0);
    assert.match(result.toolchain, /^node$/m);
    assert.match(result.stdout, /Installed Node v24\.22\.2/);
  });

  it('installs the pinned browsers when they are missing', () => {
    const result = run({
      remote: true,
      node: 'v24.22.2',
      installed: 'fresh',
      browsers: 'missing',
    });
    assert.equal(result.status, 0);
    assert.match(result.toolchain, /^browsers$/m);
    assert.match(result.stdout, /Installed the Playwright browsers/);
  });

  it('tells the agent when the pinned Node cannot be installed', () => {
    const result = run({
      remote: true,
      node: 'v22.23.4',
      installed: 'fresh',
      nodeInstall: 'fails',
    });
    assert.equal(result.status, 0);
    assert.match(result.stdout, /v22\.23\.4/);
    assert.match(result.stdout, /24\.22\.2/);
    assert.match(result.stdout, /docs\/operations\.md/);
  });
});
