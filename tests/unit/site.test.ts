import assert from 'node:assert/strict';
import { lstat, readFile, readlink } from 'node:fs/promises';
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
  const config = JSON.parse(await readFile('wrangler.json', 'utf8')) as Record<
    string,
    unknown
  >;
  assert.equal(config['main'], undefined);
  assert.equal(config['send_email'], undefined);
  assert.deepEqual(config['assets'], { directory: './dist/site' });
  assert.equal(config['workers_dev'], true);
});

// Cloudflare's Git import runs `npm run build` and `npx wrangler deploy` with
// the root config. Those defaults must publish this site, not the old Astro
// draft (owner, 2026-11-03).
test('the default build and deploy publish this site', async () => {
  const scripts = (
    JSON.parse(await readFile('package.json', 'utf8')) as {
      scripts: Record<string, string>;
    }
  ).scripts;
  assert.equal(scripts['build'], 'npm run site:build');
  // Only one root config, so no tool can pick the old one by default.
  for (const other of ['wrangler.jsonc', 'wrangler.toml']) {
    await assert.rejects(readFile(other), other);
  }
  const config = JSON.parse(await readFile('wrangler.json', 'utf8')) as {
    name?: string;
    build?: { command?: string };
    previews?: object;
  };
  // The Worker the owner connected to the repository and serves the site.
  assert.equal(config.name, 'diabetes-360');
  // A plain `wrangler deploy` builds the site first.
  assert.equal(config.build?.command, 'npm run site:build');
  // Cloudflare builds pull requests with `wrangler preview`, which needs this
  // block, even empty, to create a preview of the site.
  assert.deepEqual(config.previews, {});
});

test('deploy commands that name wrangler.site.json reach the same config', async () => {
  // The owner's Cloudflare build may run `wrangler deploy -c wrangler.site.json`.
  const link = await lstat('wrangler.site.json');
  assert.ok(link.isSymbolicLink(), 'wrangler.site.json links to wrangler.json');
  assert.equal(await readlink('wrangler.site.json'), 'wrangler.json');
});

test('no other Wrangler config can deploy something else', async () => {
  // The retired Astro draft had its own config and enquiry Worker; neither
  // may come back as a second deploy target.
  for (const other of ['wrangler.astro.jsonc', 'worker/index.ts']) {
    await assert.rejects(readFile(other), other);
  }
});
