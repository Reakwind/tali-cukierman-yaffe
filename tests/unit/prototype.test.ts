import assert from 'node:assert/strict';
import test from 'node:test';
import { buildPrototype } from '../../scripts/prototype.ts';

test('prototype build inlines every image as a data URI', async () => {
  const html = await buildPrototype();
  const sources = [...html.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.ok(sources.length > 0);
  for (const source of sources) {
    assert.match(source, /^data:image\/(jpeg|png|webp);base64,/);
  }
});

test('prototype copy prints no email address and no placeholders', async () => {
  const html = await buildPrototype();
  const text = html
    .replace(/<(script|style|title)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  assert.doesNotMatch(text, /[\w.+-]+@[\w-]+\.[\w.]+/);
  assert.doesNotMatch(text, /to confirm/i);
});

test('prototype element ids are unique', async () => {
  const html = await buildPrototype();
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length);
});
