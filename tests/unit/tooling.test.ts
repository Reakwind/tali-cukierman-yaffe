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

test('lint still checks TypeScript, Astro and build scripts', async () => {
  for (const [filePath, source] of [
    ['src/example.ts', 'const unusedValue: number = 1;'],
    [
      'src/pages/example.astro',
      '---\nconst unusedValue = 1;\n---\n<p>Example</p>',
    ],
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
  '.astro/types.d.ts',
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
      'src/example.ts',
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
      ['src/example.ts'],
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('CI lives where GitHub runs it and runs the full verification', async () => {
  const workflow = await readFile(
    new URL('../../.github/workflows/ci.yml', import.meta.url),
    'utf8',
  );
  assert.match(workflow, /^\s+quality:$/m, 'required check job name');
  assert.match(workflow, /run: npm run check:dependencies$/m);
  assert.match(workflow, /run: npm run verify$/m);
});
