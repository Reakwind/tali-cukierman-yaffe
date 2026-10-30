import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { studySchema } from '../../src/lib/study-schema.ts';

const recruiting = JSON.parse(
  await readFile(
    new URL('../../src/content/studies/stay-strong.json', import.meta.url),
    'utf8',
  ),
);
const completed = JSON.parse(
  await readFile(
    new URL(
      '../../src/content/studies/hybrid-closed-loop.json',
      import.meta.url,
    ),
    'utf8',
  ),
);

test('the two sourced bilingual study records are valid', () => {
  assert.equal(studySchema.safeParse(recruiting).success, true);
  assert.equal(studySchema.safeParse(completed).success, true);
});

const unsafeRecords = [
  [
    'missing Hebrew content',
    { ...recruiting, localized: { en: recruiting.localized.en } },
  ],
  [
    'missing English content',
    { ...recruiting, localized: { he: recruiting.localized.he } },
  ],
  [
    'an untrusted registry domain',
    { ...recruiting, registryUrl: 'https://example.invalid/study/NCT06497595' },
  ],
  [
    'a mismatched registry identifier',
    {
      ...recruiting,
      registryUrl: 'https://clinicaltrials.gov/study/NCT06236256',
    },
  ],
  [
    'an invalid registry identifier',
    { ...recruiting, registryId: 'made-up-study' },
  ],
  [
    'an unsupported recruitment claim',
    { ...recruiting, registryStatus: 'JOIN_TODAY' },
  ],
  ['an invalid source date', { ...recruiting, registryUpdated: 'recently' }],
  [
    'a source check older than the referenced update',
    { ...recruiting, sourceChecked: '2026-01-01' },
  ],
  ['a false content-approval claim', { ...recruiting, approval: 'approved' }],
  ['unapproved live recruitment', { ...recruiting, enquiriesAvailable: true }],
  [
    'an incomplete participant-burden summary',
    {
      ...recruiting,
      localized: {
        ...recruiting.localized,
        en: { ...recruiting.localized.en, activities: [] },
      },
    },
  ],
  [
    'unexpected personal-data fields',
    { ...recruiting, patientEmail: 'not-real@example.invalid' },
  ],
  [
    'an attempt to reopen a completed study',
    { ...completed, enquiriesAvailable: true },
  ],
] as const;

for (const [reason, data] of unsafeRecords) {
  test(`content validation rejects ${reason}`, () => {
    assert.equal(studySchema.safeParse(data).success, false);
  });
}
