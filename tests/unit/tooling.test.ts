import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

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
