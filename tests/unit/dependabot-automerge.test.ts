import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { safeToAutomerge } from '../../scripts/dependabot-automerge.ts';

const root = new URL('../../', import.meta.url).pathname;
const read = (path: string) => readFileSync(join(root, path), 'utf8');

// The metadata Dependabot writes into its commit messages.
const commit = (...types: string[]) =>
  [
    'build(deps-dev): bump the minor-and-patch group with 2 updates',
    '',
    '---',
    'updated-dependencies:',
    ...types.flatMap((type, i) => [
      `- dependency-name: package-${i}`,
      '  dependency-version: 1.2.3',
      '  dependency-type: direct:development',
      `  update-type: version-update:semver-${type}`,
    ]),
    '...',
  ].join('\n');

describe('Dependabot auto-merge decision', () => {
  it('merges patch and minor updates by themselves', () => {
    assert.equal(safeToAutomerge([commit('patch')]), true);
    assert.equal(safeToAutomerge([commit('minor', 'patch')]), true);
  });

  it('leaves any major update to a person', () => {
    assert.equal(safeToAutomerge([commit('major')]), false);
    assert.equal(safeToAutomerge([commit('patch', 'major')]), false);
  });

  it('leaves pull requests without Dependabot metadata to a person', () => {
    assert.equal(safeToAutomerge([]), false);
    assert.equal(safeToAutomerge(['fix: something by hand']), false);
  });

  it('ignores the sync commit the Dependabot sync workflow adds', () => {
    assert.equal(
      safeToAutomerge([
        commit('minor'),
        'ci: match the Playwright image to @playwright/test',
      ]),
      true,
    );
  });

  it('is an npm-free script', () => {
    assert.doesNotMatch(
      read('scripts/dependabot-automerge.ts'),
      /from '(?!node:)[^']+'|import\('(?!node:)/,
    );
  });
});

describe('Dependabot auto-merge workflow', () => {
  const workflow = read('.github/workflows/dependabot-automerge.yml');

  it('stays off until the owner sets DEPENDABOT_AUTOMERGE to true', () => {
    assert.match(workflow, /vars\.DEPENDABOT_AUTOMERGE == 'true'/);
  });

  it("acts only on Dependabot's own pull requests", () => {
    assert.match(workflow, /github\.actor == 'dependabot\[bot\]'/);
    assert.match(
      workflow,
      /github\.event\.pull_request\.head\.repo\.full_name == github\.repository/,
    );
    assert.doesNotMatch(workflow, /pull_request_target/);
  });

  it('enables GitHub auto-merge, which still waits for the required checks', () => {
    assert.match(workflow, /gh pr merge --auto --squash "\$PR"/);
    assert.match(workflow, /^permissions: \{\}$/m);
    assert.doesNotMatch(workflow, /npm (ci|install|i)\b|npx /);
  });
});
