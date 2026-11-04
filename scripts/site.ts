import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPage } from './prototype.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist/site');

/** The inline <style> and <script> blocks of a page, as CSP hash sources. */
const hashes = (html: string, kind: 'style' | 'script') =>
  [...html.matchAll(new RegExp(`<${kind}>([\\s\\S]*?)</${kind}>`, 'g'))].map(
    (match) =>
      `'sha256-${createHash('sha256')
        .update(match[1] ?? '')
        .digest('base64')}'`,
  );

/** Response headers for every file. Until the team approves launch, every
 * response asks search engines not to index the site (the pages also carry a
 * robots meta tag, and robots.txt disallows everything). The policy admits
 * only the pages' own inline style and script, by hash, Google Fonts, and
 * images from the site itself. Images have content-hashed names, so they can
 * be cached for good. */
const headers = (pages: string[]) => {
  const unique = (kind: 'style' | 'script') => [
    ...new Set(pages.flatMap((page) => hashes(page, kind))),
  ];
  const policy = [
    "default-src 'none'",
    `script-src ${unique('script').join(' ')}`,
    `style-src ${unique('style').join(' ')} https://fonts.googleapis.com`,
    'font-src https://fonts.gstatic.com',
    "img-src 'self'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
  ].join('; ');
  return [
    '/*',
    '  X-Robots-Tag: noindex, nofollow',
    `  Content-Security-Policy: ${policy}`,
    '  X-Content-Type-Options: nosniff',
    '  Referrer-Policy: no-referrer',
    '  Permissions-Policy: camera=(), microphone=(), geolocation=()',
    '  Cross-Origin-Opener-Policy: same-origin',
    '/images/*',
    '  Cache-Control: public, max-age=31536000, immutable',
    '',
  ].join('\n');
};

/** The published site: the two prototype pages as full documents, their
 * images as cached files, a not-found page and response headers. Served as
 * static files by Cloudflare (wrangler.json, the default config, so a plain
 * `wrangler deploy` publishes it). */
export async function buildSite(): Promise<Map<string, string | Buffer>> {
  const en = await buildPage('en', 'files');
  const he = await buildPage('he', 'files');
  // The English page is written for the artifact host, which supplies the
  // document shell; the site needs its own.
  const english =
    '<!doctype html>\n<html lang="en" dir="ltr">\n<head>\n<meta charset="utf-8" />\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />\n' +
    en.html +
    '\n</html>\n';
  const notFound = await readFile(resolve(root, 'prototype/404.html'), 'utf8');
  const files = new Map<string, string | Buffer>([
    ['index.html', english],
    ['he.html', he.html],
    ['404.html', notFound],
    ['robots.txt', 'User-agent: *\nDisallow: /\n'],
    ['_headers', headers([english, he.html, notFound])],
  ]);
  for (const [name, data] of [...en.images, ...he.images]) {
    files.set(name, data);
  }
  return files;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await rm(output, { recursive: true, force: true });
  for (const [name, content] of await buildSite()) {
    const path = resolve(output, name);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content);
  }
  console.log(output);
}
