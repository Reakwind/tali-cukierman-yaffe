import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import {
  imageDigest,
  playwrightImage,
  syncWorkflow,
} from '../../scripts/deps-sync.ts';

const root = new URL('../../', import.meta.url).pathname;
const read = (path: string) => readFileSync(join(root, path), 'utf8');
const digest = `sha256:${'a'.repeat(64)}`;

describe('deps:sync', () => {
  it('points the CI browser jobs at the image for a Playwright version', () => {
    const before = read('.github/workflows/ci.yml');
    const after = syncWorkflow(before, playwrightImage('1.66.0', digest));
    assert.match(
      after,
      new RegExp(
        `^\\s+image: mcr\\.microsoft\\.com/playwright:v1\\.66\\.0-noble@${digest}$`,
        'm',
      ),
    );
    // Nothing else in the workflow changes.
    assert.equal(
      after.replace(/image: \S+/, ''),
      before.replace(/image: \S+/, ''),
    );
  });

  it('refuses a workflow without a Playwright image', () => {
    assert.throws(() => syncWorkflow('jobs: {}\n', 'x'), /Playwright image/);
  });

  it('reads the image digest from the registry and checks its form', async () => {
    const requests: string[] = [];
    const fake = (headers: Record<string, string>, status = 200) =>
      (async (url: string | URL | Request) => {
        requests.push(String(url));
        return new Response(null, { status, headers });
      }) as typeof fetch;
    assert.equal(
      await imageDigest('1.66.0', fake({ 'docker-content-digest': digest })),
      digest,
    );
    assert.equal(
      requests[0],
      'https://mcr.microsoft.com/v2/playwright/manifests/v1.66.0-noble',
    );
    await assert.rejects(
      imageDigest('1.66.0', fake({ 'docker-content-digest': 'sha256:zz' })),
      /digest/,
    );
    await assert.rejects(imageDigest('1.66.0', fake({}, 404)), /404/);
  });

  it('is an npm script that needs no installed packages', () => {
    const pkg = JSON.parse(read('package.json'));
    assert.equal(pkg.scripts['deps:sync'], 'node scripts/deps-sync.ts');
    assert.doesNotMatch(
      read('scripts/deps-sync.ts'),
      /from '(?!node:)[^']+'|import\('(?!node:)/,
    );
  });
});

describe('Dependabot sync workflow', () => {
  const workflow = read('.github/workflows/dependabot-sync.yml');

  it("runs only on Dependabot's own pull requests", () => {
    assert.match(workflow, /^\s+pull_request:/m);
    assert.doesNotMatch(workflow, /pull_request_target/);
    assert.match(workflow, /github\.actor == 'dependabot\[bot\]'/);
    assert.match(
      workflow,
      /github\.event\.pull_request\.head\.repo\.full_name == github\.repository/,
    );
  });

  it('never installs or runs the updated packages while it can push', () => {
    assert.doesNotMatch(workflow, /npm (ci|install|i)\b|npx /);
    assert.match(workflow, /run: npm run deps:sync$/m);
    assert.match(workflow, /^permissions: \{\}$/m);
    assert.match(workflow, /contents: write/);
  });

  it('starts CI on the commit it pushes', () => {
    // Pushes made with the workflow token start no workflows by themselves.
    assert.match(workflow, /gh workflow run ci\.yml --ref "\$BRANCH"/);
    assert.match(workflow, /actions: write/);
  });
});

describe('every workflow', () => {
  const files = readdirSync(join(root, '.github/workflows'));

  it('uses only GitHub-owned actions pinned to a full commit SHA', () => {
    for (const file of files) {
      const text = read(`.github/workflows/${file}`);
      for (const [, action] of text.matchAll(/uses: (\S+)/g)) {
        assert.match(
          action ?? '',
          /^actions\/[\w-]+@[0-9a-f]{40}$/,
          `${file}: ${action}`,
        );
      }
    }
  });
});
