import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import test from 'node:test';
import { team } from '../../src/data/team.ts';

test('the roster has six unique bilingual profiles with the confirmed names', () => {
  assert.equal(team.length, 6);
  assert.equal(new Set(team.map((member) => member.id)).size, 6);
  const names = team.map((member) => member.name.en);
  for (const expected of [
    'Prof. Tali Cukierman-Yaffe',
    'Dr. Naama Peltz-Sinvani',
    'Hagar Shimon',
    'Yasmin Alt',
    'Tal Yahalom-Peri',
    'Itay Cohen',
  ]) {
    assert.ok(names.includes(expected), `missing ${expected}`);
  }
});

test('every profile carries non-empty roles and bios in both languages', () => {
  for (const member of team) {
    for (const locale of ['en', 'he'] as const) {
      assert.ok(member.name[locale].trim(), `${member.id} name ${locale}`);
      assert.ok(member.role[locale].trim(), `${member.id} role ${locale}`);
      assert.ok(
        member.bio[locale].trim().length > 60,
        `${member.id} bio ${locale} too thin`,
      );
    }
  }
});

test('profiles contain no contact details, raw links, or recruitment claims', () => {
  for (const member of team) {
    const copy = `${member.role.en}${member.role.he}${member.bio.en}${member.bio.he}`;
    assert.ok(!/mailto:|tel:|@/.test(copy), `${member.id} leaks contact data`);
    assert.ok(!/https?:\/\//.test(copy), `${member.id} has a raw URL`);
    assert.ok(
      !/enroll|register now|join today|we guarantee|promise of benefit/i.test(
        copy,
      ),
      `${member.id} makes a recruitment claim`,
    );
  }
});

test('four shipped portraits exist with bilingual alt text and credits', async () => {
  const photographed = team.filter((member) => member.photo);
  assert.equal(photographed.length, 4);
  for (const member of photographed) {
    const photo = member.photo!;
    assert.ok(photo.src.startsWith('/images/team/'), member.id);
    await access(new URL(`../../public${photo.src}`, import.meta.url));
    for (const locale of ['en', 'he'] as const) {
      assert.ok(photo.alt[locale].trim(), `${member.id} alt ${locale}`);
      assert.ok(photo.credit[locale].trim(), `${member.id} credit ${locale}`);
    }
    assert.ok(
      /^\d+% \d+%$/.test(photo.position),
      `${member.id} invalid object-position`,
    );
  }
});
