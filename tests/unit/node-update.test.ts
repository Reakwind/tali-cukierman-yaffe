import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { newerNode } from '../../scripts/node-update.ts';

const root = new URL('../../', import.meta.url).pathname;
const read = (path: string) => readFileSync(join(root, path), 'utf8');

// The shape of https://nodejs.org/dist/index.json, newest first.
const index = [
  { version: 'v25.2.0' },
  { version: 'v24.23.1' },
  { version: 'v24.23.0' },
  { version: 'v24.9.10' },
  { version: 'v24.22.2' },
  { version: 'v22.30.0' },
];

describe('Node update check', () => {
  it('finds the newest release of the same major version', () => {
    assert.equal(newerNode(index, '24.22.2'), '24.23.1');
  });

  it('never moves to another major version', () => {
    assert.equal(newerNode([{ version: 'v25.0.0' }], '24.22.2'), undefined);
  });

  it('reports nothing when the pinned version is the newest', () => {
    assert.equal(newerNode(index, '24.23.1'), undefined);
  });

  it('compares versions as numbers, not text', () => {
    assert.equal(
      newerNode([{ version: 'v24.10.0' }, { version: 'v24.9.0' }], '24.9.0'),
      '24.10.0',
    );
  });

  it('ignores anything that is not a plain version', () => {
    assert.equal(
      newerNode([{ version: 'v24.99.0; rm -rf /' }], '24.22.2'),
      undefined,
    );
    assert.throws(() => newerNode(index, 'lts'), /plain version/);
  });

  it('is an npm script that needs no installed packages', () => {
    const pkg = JSON.parse(read('package.json'));
    assert.equal(pkg.scripts['node:update'], 'node scripts/node-update.ts');
    assert.doesNotMatch(
      read('scripts/node-update.ts'),
      /from '(?!node:)[^']+'|import\('(?!node:)/,
    );
  });
});

describe('Node update workflow', () => {
  const workflow = read('.github/workflows/node-update.yml');

  it('runs weekly and on demand', () => {
    assert.match(workflow, /^\s+schedule:\n\s+- cron: '[^']+'/m);
    assert.match(workflow, /^\s+workflow_dispatch:/m);
  });

  it('opens a pull request and starts CI on it', () => {
    assert.match(workflow, /^permissions: \{\}$/m);
    assert.match(workflow, /run: npm run node:update$/m);
    assert.match(workflow, /gh pr create /);
    // Pushes made with the workflow token start no workflows by themselves.
    assert.match(workflow, /gh workflow run ci\.yml --ref "\$BRANCH"/);
    assert.doesNotMatch(workflow, /npm (ci|install|i)\b|npx /);
  });

  it('merges by itself only when the owner turned auto-merge on', () => {
    assert.match(workflow, /AUTOMERGE: \$\{\{ vars\.DEPENDABOT_AUTOMERGE \}\}/);
    assert.match(
      workflow,
      /if \[ "\$AUTOMERGE" = "true" \]; then\s+gh pr merge --auto --squash/,
    );
  });
});
