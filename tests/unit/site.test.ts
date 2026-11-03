import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { buildSite } from '../../scripts/site.ts';

// The published site: the two prototype pages as full documents, hidden from
// search until the team approves launch, served as static files only.

test('the site holds the English and Hebrew pages as full documents', async () => {
  const files = await buildSite();
  assert.deepEqual([...files.keys()].sort(), [
    '_headers',
    'he.html',
    'index.html',
  ]);
  assert.match(
    files.get('index.html') ?? '',
    /^<!doctype html>\s*<html lang="en" dir="ltr">\s*<head>\s*<meta charset="utf-8"/i,
  );
  assert.match(
    files.get('he.html') ?? '',
    /^<!doctype html>\s*<html lang="he" dir="rtl">/i,
  );
});

test('drafts stay out of search engines', async () => {
  const files = await buildSite();
  for (const page of ['index.html', 'he.html']) {
    assert.match(
      files.get(page) ?? '',
      /<meta name="robots" content="noindex, nofollow"/,
      page,
    );
  }
  assert.match(
    files.get('_headers') ?? '',
    /^\/\*\n\s+X-Robots-Tag: noindex, nofollow$/m,
  );
});

test('the site deploys as static files, with no server code or email', async () => {
  const config = JSON.parse(
    await readFile('wrangler.site.json', 'utf8'),
  ) as Record<string, unknown>;
  assert.equal(config['main'], undefined);
  assert.equal(config['send_email'], undefined);
  assert.deepEqual(config['assets'], { directory: './dist/site' });
  assert.equal(config['workers_dev'], true);
});
