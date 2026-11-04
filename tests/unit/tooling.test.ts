import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import test from 'node:test';
import { ESLint } from 'eslint';
import ts from 'typescript';

const readJson = async (path: string) =>
  JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));

const atLeast = (version: string, minimum: string) => {
  const [a, b] = [version, minimum].map((v) => v.split('.').map(Number));
  for (let i = 0; i < 3; i += 1) {
    if (a![i]! !== b![i]!) return a![i]! > b![i]!;
  }
  return true;
};

test('the lockfile resolves no minimatch affected by GHSA-g3hv-75wg-m249', async () => {
  const lock = await readJson('../../package-lock.json');
  const resolved = Object.entries(
    lock.packages as Record<string, { version: string }>,
  )
    .filter(([path]) => path.endsWith('node_modules/minimatch'))
    .map(([path, entry]) => [path, entry.version] as const);
  assert.ok(resolved.length > 0, 'minimatch should be in the dependency tree');
  for (const [path, version] of resolved) {
    assert.ok(atLeast(version, '11.0.1'), `${path} resolves ${version}`);
  }
});

test('a dependency audit script fails on moderate or worse advisories', async () => {
  const pkg = await readJson('../../package.json');
  assert.equal(
    pkg.scripts['check:dependencies'],
    'npm audit --audit-level=moderate',
  );
});

const linter = new ESLint();

test('lint still checks TypeScript and build scripts', async () => {
  for (const [filePath, source] of [
    ['scripts/example.ts', 'const unusedValue: number = 1;'],
    ['example.mjs', 'const unusedValue = 1;'],
  ] as const) {
    const [result] = await linter.lintText(source, { filePath });
    assert.ok(
      result?.messages.some((m) => m.ruleId?.endsWith('no-unused-vars')),
      `lint skipped ${filePath}`,
    );
  }
});

const generated = [
  'dist/example.js',
  '.wrangler/tmp/example.js',
  'test-results/example.js',
  'playwright-report/example.js',
  'coverage/example.js',
  'blob-report/example.js',
];

test('lint ignores generated sites, types and browser artifacts', async () => {
  for (const filePath of generated) {
    assert.equal(await linter.isPathIgnored(filePath), true, filePath);
  }
});

test('type checks ignore generated browser reports and coverage', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'tcy-type-check-'));
  try {
    const config = await readJson('../../tsconfig.json');
    for (const filePath of [
      'scripts/example.ts',
      '.wrangler/tmp/example.js',
      'playwright-report/trace/example.js',
      'test-results/example.ts',
      'coverage/example.js',
      'blob-report/example.ts',
    ]) {
      await mkdir(dirname(join(dir, filePath)), { recursive: true });
      await writeFile(join(dir, filePath), 'export const example = 1;');
    }
    const parsed = ts.parseJsonConfigFileContent(
      {
        include: config.include,
        exclude: config.exclude,
        compilerOptions: { allowJs: true },
      },
      ts.sys,
      dir,
    );
    assert.deepEqual(parsed.errors, []);
    assert.deepEqual(
      parsed.fileNames.map((f) => relative(dir, f)),
      ['scripts/example.ts'],
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

const readWorkflow = () =>
  readFile(new URL('../../.github/workflows/ci.yml', import.meta.url), 'utf8');

/** The lines of one top-level job, from its key to the next job's key. */
const job = (workflow: string, name: string) => {
  const start = workflow.search(new RegExp(`^  ${name}:$`, 'm'));
  assert.notEqual(start, -1, `CI has no ${name} job`);
  const rest = workflow.slice(start + 1);
  const end = rest.search(/^ {2}[\w-]+:$/m);
  return end === -1 ? rest : rest.slice(0, end);
};

test('CI runs every step of npm run verify', async () => {
  const workflow = await readWorkflow();
  const pkg = await readJson('../../package.json');
  const steps = (pkg.scripts.verify as string)
    .split('&&')
    .map((part) => part.trim().replace(/^npm (run )?/, ''))
    .flatMap((name) =>
      name === 'test'
        ? (pkg.scripts.test as string)
            .split('&&')
            .map((part) => part.trim().replace(/^npm run /, ''))
        : [name],
    );
  assert.ok(steps.includes('test:e2e'), 'verify should include browser tests');
  for (const step of steps.filter((s) => s !== 'test:e2e')) {
    assert.match(
      job(workflow, 'checks'),
      new RegExp(`run: npm run ${step}$`, 'm'),
    );
  }
  assert.match(job(workflow, 'checks'), /run: npm run check:dependencies$/m);
  assert.match(job(workflow, 'checks'), /run: npm run build$/m);
});

test('CI runs each browser project in its own job in the pinned Playwright image', async () => {
  const workflow = await readWorkflow();
  const browsers = job(workflow, 'browsers');
  const { default: config } = await import('../../playwright.config.ts');
  const projects = (config.projects ?? []).map((p) => p.name);
  const matrix = browsers.match(/project: \[([^\]]+)\]/)?.[1];
  assert.ok(matrix, 'browsers job should have a project matrix');
  assert.deepEqual(
    matrix.split(',').map((p) => p.trim()),
    projects,
    'one job per Playwright project',
  );
  assert.match(
    browsers,
    /run: npx playwright test --project=\$\{\{ matrix\.project \}\}$/m,
  );

  // Browsers and their system libraries come from Microsoft's image for the
  // exact Playwright version, pinned by digest; no apt install on the runner.
  const pkg = await readJson('../../package.json');
  const version = pkg.devDependencies['@playwright/test'];
  assert.match(
    browsers,
    new RegExp(
      `image: mcr\\.microsoft\\.com/playwright:v${version.replaceAll('.', '\\.')}-noble@sha256:[0-9a-f]{64}$`,
      'm',
    ),
    'container image should match @playwright/test and be pinned by digest',
  );
  assert.match(
    browsers,
    /options: --user 1001$/m,
    'Firefox needs a non-root user',
  );
  assert.doesNotMatch(workflow, /playwright install/);
});

test('the required quality check passes only when every CI job passed', async () => {
  const quality = job(await readWorkflow(), 'quality');
  assert.match(quality, /needs: \[checks, browsers\]$/m);
  assert.match(quality, /if: always\(\)$/m, 'report even when a job failed');
  assert.match(
    quality,
    /contains\(needs\.\*\.result, 'failure'\) \|\| contains\(needs\.\*\.result, 'cancelled'\)/,
  );
});

test('Dependabot keeps @types/node on the Node major the project runs', async () => {
  const config = await readFile(
    new URL('../../.github/dependabot.yml', import.meta.url),
    'utf8',
  );
  const nodeMajor = (
    await readFile(new URL('../../.node-version', import.meta.url), 'utf8')
  ).split('.')[0];
  const pkg = await readJson('../../package.json');
  assert.equal(
    pkg.devDependencies['@types/node'].split('.')[0],
    nodeMajor,
    '@types/node should match .node-version',
  );
  assert.match(
    config,
    /ignore:\s*\n\s*- dependency-name: '@types\/node'\s*\n\s*update-types: \['version-update:semver-major'\]/,
  );
});
