import assert from 'node:assert/strict';
import test from 'node:test';
import { buildPrototype } from '../../scripts/prototype.ts';

// The Hebrew page: same structure, styles, painting and script as the English
// page, with real right-to-left layout and Hebrew copy.

const visibleText = (html: string) =>
  html
    .replace(/<(style|script|svg|title)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/g, ' ');

const ids = (html: string) =>
  [...html.matchAll(/<(?:section|li|div)[^>]*\sid="([^"]+)"/g)].map(
    (m) => m[1],
  );

test('the Hebrew page is a right-to-left Hebrew document', async () => {
  const he = await buildPrototype('he');
  assert.match(he, /^<!doctype html>\s*<html lang="he" dir="rtl">/i);
  assert.match(he, /<title>[^<]*[א-ת][^<]*<\/title>/);
});

test('both pages share sections, studies and anchors for same-place switching', async () => {
  const [en, he] = [await buildPrototype('en'), await buildPrototype('he')];
  assert.deepEqual(ids(he), ids(en));
  const nav = (html: string) =>
    [
      ...(/<nav[\s\S]*?<\/nav>/.exec(html)?.[0] ?? '').matchAll(
        /href="(#[^"]+)"/g,
      ),
    ].map((m) => m[1]);
  assert.deepEqual(nav(he), nav(en));
});

test('each page links to the other language, named in that language', async () => {
  const [en, he] = [await buildPrototype('en'), await buildPrototype('he')];
  assert.match(
    en,
    /<a class="lang" href="he\.html" hreflang="he" lang="he">עברית<\/a>/,
  );
  assert.match(
    he,
    /<a class="lang" href="index\.html" hreflang="en" lang="en">English<\/a>/,
  );
});

test('styles, painting and script come from the English page', async () => {
  const [en, he] = [await buildPrototype('en'), await buildPrototype('he')];
  const part = (html: string, re: RegExp) => re.exec(html)?.[0] ?? '';
  for (const re of [
    /<style>[\s\S]*?<\/style>/,
    /<figure class="art"[\s\S]*?<\/figure>/,
    /<script>[\s\S]*?<\/script>/,
  ]) {
    const shared = part(en, re);
    assert.ok(shared.length > 100);
    assert.equal(part(he, re), shared);
  }
});

test('Hebrew copy is complete: Latin only in names, records and citations', async () => {
  const he = await buildPrototype('he');
  const text = visibleText(
    he
      .replace(/<bdi>[\s\S]*?<\/bdi>/g, ' ')
      .replace(/<a class="lang"[\s\S]*?<\/a>/, ' ')
      .replace(/<span class="cite" dir="ltr"\s*>[\s\S]*?<\/span>/g, ' '),
  );
  assert.deepEqual(text.match(/[A-Za-z]{2,}/g) ?? [], []);
  assert.ok((text.match(/[א-ת]+/g) ?? []).length > 400);
});

test('identifiers and citations are isolated from the Hebrew text direction', async () => {
  const he = await buildPrototype('he');
  for (const id of [
    '6 Vital',
    'BIRAX',
    'Diabetes UK',
    'NCT06497595',
    '03-5307493',
  ]) {
    assert.match(he, new RegExp(`<bdi>${id}</bdi>`), id);
  }
  const cites = [...he.matchAll(/<span class="cite" dir="ltr"\s*>/g)];
  assert.equal(cites.length, 6);
});

test('every Hebrew image description is in Hebrew', async () => {
  const he = await buildPrototype('he');
  const alts = [...he.matchAll(/<img\b[^>]*\salt="([^"]*)"/g)].map(
    (m) => m[1] ?? '',
  );
  assert.ok(alts.length > 0);
  for (const alt of alts) assert.match(alt, /[א-ת]/, alt);
});

test('the Hebrew page keeps the content rules', async () => {
  const he = await buildPrototype('he');
  const text = visibleText(he);
  assert.doesNotMatch(text, /[\w.+-]+@[\w-]+\.[\w.]+/);
  assert.doesNotMatch(text, /\d\s?%/);
  assert.match(he, /href="mailto:D360@sheba\.health\.gov\.il"/);
  assert.equal([...he.matchAll(/href="#top"/g)].length, 1);
  const form = /<form[\s\S]*?<\/form>/.exec(he)?.[0] ?? '';
  const fields = [...form.matchAll(/<input[^>]*\sid="([^"]+)"/g)].map(
    (m) => m[1],
  );
  assert.deepEqual(fields, ['f-name', 'f-contact']);
});

test('the form message is read from the page, not written in the script', async () => {
  const [en, he] = [await buildPrototype('en'), await buildPrototype('he')];
  assert.match(en, /<form[^>]*data-missing="Enter a phone number or email\."/);
  assert.match(he, /<form[^>]*data-missing="[^"]*[א-ת][^"]*"/);
  const script = /<script>[\s\S]*?<\/script>/.exec(en)?.[0] ?? '';
  assert.doesNotMatch(script, /Enter a phone number/);
});
