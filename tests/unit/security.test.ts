import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const headers = await readFile(
  new URL('../../public/_headers', import.meta.url),
  'utf8',
);

for (const header of [
  "Content-Security-Policy: default-src 'self'",
  "form-action 'none'",
  "frame-ancestors 'none'",
  'X-Content-Type-Options: nosniff',
  'Referrer-Policy: no-referrer',
  'X-Robots-Tag: noindex, nofollow',
]) {
  test(`static deployment declares ${header}`, () => {
    assert.ok(
      headers.includes(header),
      `Missing security directive: ${header}`,
    );
  });
}

test('draft robots policy disallows indexing all paths', async () => {
  const robots = await readFile(
    new URL('../../public/robots.txt', import.meta.url),
    'utf8',
  );
  assert.match(robots, /^Disallow: \/$/m);
});
