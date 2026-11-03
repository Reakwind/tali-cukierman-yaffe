import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPrototype } from './prototype.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist/site');

// Until the team approves launch, every response asks search engines not to
// index the site (the pages also carry a robots meta tag).
const headers = '/*\n  X-Robots-Tag: noindex, nofollow\n';

/** The published site: the two prototype pages as full documents, plus
 * response headers. Served as static files by Cloudflare (wrangler.site.json). */
export async function buildSite(): Promise<Map<string, string>> {
  // The English page is written for the artifact host, which supplies the
  // document shell; the site needs its own.
  const english =
    '<!doctype html>\n<html lang="en" dir="ltr">\n<head>\n<meta charset="utf-8" />\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />\n' +
    (await buildPrototype('en')) +
    '\n</html>\n';
  return new Map([
    ['index.html', english],
    ['he.html', await buildPrototype('he')],
    ['_headers', headers],
  ]);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  for (const [name, content] of await buildSite()) {
    await writeFile(resolve(output, name), content);
  }
  console.log(output);
}
