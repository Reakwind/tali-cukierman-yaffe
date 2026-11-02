import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  highlightSchema,
  publicationSchema,
} from '../../src/lib/output-schema.ts';

const publications = JSON.parse(
  await readFile(
    new URL('../../src/content/publications.json', import.meta.url),
    'utf8',
  ),
);
const highlights = JSON.parse(
  await readFile(
    new URL('../../src/content/highlights.json', import.meta.url),
    'utf8',
  ),
);

test('all curated publications and highlights retain bilingual copy and source provenance', () => {
  for (const publication of publications)
    assert.equal(
      publicationSchema.safeParse(publication).success,
      true,
      publication.id,
    );
  for (const highlight of highlights)
    assert.equal(
      highlightSchema.safeParse(highlight).success,
      true,
      highlight.id,
    );
});

for (const [reason, change] of [
  ['missing Hebrew', { localized: { en: publications[0].localized.en } }],
  ['an unsafe source URL', { sourceUrl: 'javascript:alert(1)' }],
  ['an invented approval', { approval: 'approved' }],
  ['an unknown study association', { studies: ['unverified-trial'] }],
  ['a false evidence type', { type: 'proven-clinical-benefit' }],
] as const) {
  test(`publication validation rejects ${reason}`, () => {
    assert.equal(
      publicationSchema.safeParse({ ...publications[0], ...change }).success,
      false,
    );
  });
}
