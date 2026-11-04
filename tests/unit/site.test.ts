import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { lstat, readFile, readlink } from 'node:fs/promises';
import test from 'node:test';
import { buildSite } from '../../scripts/site.ts';

// The published site: the two prototype pages as full documents, hidden from
// search until the team approves launch, served as static files only.

const text = (files: Map<string, string | Buffer>, name: string) =>
  String(files.get(name) ?? '');

test('the site holds both pages, their images, a 404 page and robots.txt', async () => {
  const files = await buildSite();
  const names = [...files.keys()];
  for (const name of [
    '_headers',
    '404.html',
    'he.html',
    'index.html',
    'robots.txt',
  ]) {
    assert.ok(names.includes(name), name);
  }
  for (const name of names.filter((n) => !n.startsWith('images/'))) {
    assert.equal(typeof files.get(name), 'string', name);
  }
});

test('the site holds the English and Hebrew pages as full documents', async () => {
  const files = await buildSite();
  assert.match(
    text(files, 'index.html'),
    /^<!doctype html>\s*<html lang="en" dir="ltr">\s*<head>\s*<meta charset="utf-8"/i,
  );
  assert.match(
    text(files, 'he.html'),
    /^<!doctype html>\s*<html lang="he" dir="rtl">/i,
  );
});

test('drafts stay out of search engines', async () => {
  const files = await buildSite();
  for (const page of ['index.html', 'he.html', '404.html']) {
    assert.match(
      text(files, page),
      /<meta name="robots" content="noindex, nofollow"/,
      page,
    );
  }
  assert.match(
    text(files, '_headers'),
    /^\/\*\n\s+X-Robots-Tag: noindex, nofollow$/m,
  );
  assert.match(text(files, 'robots.txt'), /^User-agent: \*\nDisallow: \/$/m);
});

test('pages link their images as cached files instead of inlining them', async () => {
  const files = await buildSite();
  for (const page of ['index.html', 'he.html']) {
    const html = text(files, page);
    assert.doesNotMatch(html, /data:image\//, page);
    const sources = [...html.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)].map(
      (m) => m[1] ?? '',
    );
    assert.ok(sources.length > 0, page);
    for (const src of sources) {
      // Content-hashed names, so a changed image never reuses a cached one.
      assert.match(src, /^images\/[\w-]+\.[0-9a-f]{10}\.(jpg|png|webp)$/);
      const image = files.get(src);
      assert.ok(Buffer.isBuffer(image), src);
      assert.equal(
        createHash('sha256').update(image).digest('hex').slice(0, 10),
        src.split('.').at(-2),
      );
    }
    // 478 KB with every image inlined, twice over for the two languages.
    assert.ok(Buffer.byteLength(html) < 100 * 1024, `${page} under 100 KB`);
  }
  assert.match(
    text(files, '_headers'),
    /^\/images\/\*\n\s+Cache-Control: public, max-age=31536000, immutable$/m,
  );
});

test('security headers allow only the pages own inline code and fonts', async () => {
  const files = await buildSite();
  const headers = text(files, '_headers');
  const csp = headers.match(/^\s+Content-Security-Policy: (.+)$/m)?.[1] ?? '';
  const directives = new Map(
    csp.split(';').map((d) => {
      const [name = '', ...values] = d.trim().split(/\s+/);
      return [name, values] as const;
    }),
  );
  assert.deepEqual(directives.get('default-src'), ["'none'"]);
  for (const name of ['base-uri', 'form-action', 'frame-ancestors']) {
    assert.deepEqual(directives.get(name), ["'none'"], name);
  }
  assert.doesNotMatch(csp, /unsafe-/);
  const hash = (code: string) =>
    `'sha256-${createHash('sha256').update(code).digest('base64')}'`;
  for (const page of ['index.html', 'he.html', '404.html']) {
    const html = text(files, page);
    for (const [kind, directive] of [
      ['script', 'script-src'],
      ['style', 'style-src'],
    ] as const) {
      for (const match of html.matchAll(
        new RegExp(`<${kind}>([\\s\\S]*?)</${kind}>`, 'g'),
      )) {
        assert.ok(
          directives.get(directive)?.includes(hash(match[1] ?? '')),
          `${page}: ${kind} block missing from ${directive}`,
        );
      }
    }
    assert.doesNotMatch(html, /\sstyle="|\son[a-z]+="/, `${page}: inline attr`);
  }
  assert.ok(
    directives.get('style-src')?.includes('https://fonts.googleapis.com'),
  );
  assert.deepEqual(directives.get('font-src'), ['https://fonts.gstatic.com']);
  assert.deepEqual(directives.get('img-src'), ["'self'"]);
  for (const header of [
    'X-Content-Type-Options: nosniff',
    'Referrer-Policy: no-referrer',
    'Permissions-Policy: camera=(), microphone=(), geolocation=()',
    'Cross-Origin-Opener-Policy: same-origin',
  ]) {
    assert.ok(headers.includes(header), header);
  }
});

test('unknown addresses get a bilingual page back to both home pages', async () => {
  const html = text(await buildSite(), '404.html');
  assert.match(html, /^<!doctype html>\s*<html lang="en" dir="ltr">/i);
  assert.match(html, /<a href="\/">/);
  assert.match(html, /<[^>]+ lang="he" dir="rtl"[\s\S]*<a href="\/he">/);
});

test('the site deploys as static files, with no server code or email', async () => {
  const config = JSON.parse(await readFile('wrangler.json', 'utf8')) as Record<
    string,
    unknown
  >;
  assert.equal(config['main'], undefined);
  assert.equal(config['send_email'], undefined);
  assert.deepEqual(config['assets'], {
    directory: './dist/site',
    not_found_handling: '404-page',
  });
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
