import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';

const rootDir = process.cwd();
const read = (file: string) => readFileSync(path.join(rootDir, file), 'utf8');
const settings = () => JSON.parse(read('.claude/settings.json'));

describe('Claude Code permissions', () => {
  it('asks the owner before Claude opens or merges a pull request', () => {
    const { allow, ask } = settings().permissions;
    for (const rule of [
      'Bash(gh pr create:*)',
      'Bash(gh pr merge --squash:*)',
      'Bash(npm run day:finish:*)',
      'mcp__github__create_pull_request',
      'mcp__github__merge_pull_request',
    ]) {
      assert.ok(ask?.includes(rule), `${rule} should be an ask rule`);
      assert.ok(!allow.includes(rule), `${rule} should not be pre-approved`);
    }
  });

  it('pre-approves no command of the retired Astro draft', () => {
    const { allow } = settings().permissions;
    assert.deepEqual(
      allow.filter((rule: string) => rule.includes('astro')),
      [],
    );
  });
});
