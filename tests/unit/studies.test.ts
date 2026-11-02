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
const birax = JSON.parse(
  await readFile(
    new URL('../../src/content/studies/birax.json', import.meta.url),
    'utf8',
  ),
);

const project = {
  kind: 'project',
  acronym: 'BIRAX',
  registryStatus: 'NOT_VERIFIED',
  sourceUrl: 'https://en-cuenca-institute.tau.ac.il/board-of-directors',
  sourceChecked: '2026-11-01',
  approval: 'draft',
  enquiriesAvailable: false,
  localized: recruiting.localized,
};

const confirmedRecruitment = {
  status: 'recruiting',
  confirmedOn: '2026-11-01',
  source: 'owner',
};

test('owner-confirmed project recruitment is distinct from registry status', () => {
  const result = studySchema.safeParse({
    ...project,
    recruitment: confirmedRecruitment,
  });
  assert.equal(result.success, true);
  if (result.success) assert.equal('registryId' in result.data, false);
});

test('a completed trial cannot acquire a participant recruitment invitation', () => {
  assert.equal(
    studySchema.safeParse({ ...completed, recruitment: confirmedRecruitment })
      .success,
    false,
  );
});

test('a research project can be described without an invented trial ID or recruitment claim', () => {
  const result = studySchema.safeParse(project);
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal('registryId' in result.data, false);
    assert.equal('registryUpdated' in result.data, false);
  }
});

for (const change of [
  { registryStatus: 'RECRUITING' },
  { registryId: 'NCT00000000' },
  { registryUpdated: '2026-11-01' },
  { sourceUrl: 'javascript:alert(1)' },
  { enquiriesAvailable: true },
]) {
  test(`a project rejects unsupported facts: ${JSON.stringify(change)}`, () => {
    assert.equal(
      studySchema.safeParse({ ...project, ...change }).success,
      false,
    );
  });
}

test('all three sourced bilingual study and project records are valid', () => {
  assert.equal(studySchema.safeParse(recruiting).success, true);
  assert.equal(studySchema.safeParse(completed).success, true);
  assert.equal(studySchema.safeParse(birax).success, true);
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
