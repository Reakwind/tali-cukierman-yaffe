import assert from 'node:assert/strict';
import test from 'node:test';
import { buildPrototype } from '../../scripts/prototype.ts';

test('prototype build inlines every image as a data URI', async () => {
  const html = await buildPrototype();
  const sources = [...html.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)].map(
    (match) => match[1] ?? '',
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

test('prototype enquiries go to the Diabetes 360 program contact', async () => {
  const html = await buildPrototype();
  assert.match(html, /href="mailto:D360@sheba\.health\.gov\.il"/);
  assert.match(html, /href="tel:\+97235307493"/);
  assert.doesNotMatch(html, /(reakwind|hagarshimon|yasminshtig)@/);
});

test('prototype research names the Center and states no statistics', async () => {
  const html = await buildPrototype();
  const research =
    /<section[^>]*id="research"[\s\S]*?<\/section>/.exec(html)?.[0] ?? '';
  assert.match(research, /Center\s+for\s+Successful\s+Aging\s+with\s+Diabetes/);
  assert.doesNotMatch(html.replace(/<style[\s\S]*?<\/style>/g, ''), /\d\s?%/);
});

const section = (html: string, id: string) =>
  new RegExp(`<section[^>]*id="${id}"[\\s\\S]*?</section>`).exec(html)?.[0] ??
  '';
const studyIds = (html: string) =>
  [...section(html, 'studies').matchAll(/<li class="study" id="([^"]+)"/g)].map(
    (m) => m[1] ?? '',
  );

test('research stops link one level down, to ongoing studies only', async () => {
  const html = await buildPrototype();
  const studies = new Set(studyIds(html));
  const stops = [
    ...section(html, 'research').matchAll(
      /<a class="stop[^"]*" href="#([^"]+)"/g,
    ),
  ].map((m) => m[1] ?? '');
  assert.ok(stops.length > 0);
  for (const stop of stops) assert.ok(studies.has(stop), stop);
});

test('the header names the group without repeating its affiliations', async () => {
  const html = await buildPrototype();
  const header = /<header[\s\S]*?<\/header>/.exec(html)?.[0] ?? '';
  assert.match(header, /Diabetes 360 Research Group/);
  assert.doesNotMatch(header, /Sheba|Tel Aviv University/);
});

test('no link is a placeholder pointing back to the top', async () => {
  const html = await buildPrototype();
  const toTop = [...html.matchAll(/href="#top"/g)];
  assert.equal(toTop.length, 1);
});

test('the first screen links to every ongoing study', async () => {
  const html = await buildPrototype();
  const about =
    /<section class="about"[\s\S]*?<\/section>/.exec(html)?.[0] ?? '';
  const studies = studyIds(html);
  assert.ok(studies.length > 0);
  for (const id of studies) assert.match(about, new RegExp(`href="#${id}"`));
});

test('each study can be named in the enquiry form', async () => {
  const html = await buildPrototype();
  const studies = section(html, 'studies');
  const names = [
    ...studies.matchAll(/href="#contact" data-study="([^"]+)"/g),
  ].map((m) => m[1] ?? '');
  assert.ok(names.length > 0);
  assert.equal(names.length, studyIds(html).length);
  const form = /<form[\s\S]*?<\/form>/.exec(html)?.[0] ?? '';
  for (const name of names) {
    assert.match(form, new RegExp(`<option value="${name}"`));
  }
});

test('every image has alt text', async () => {
  const html = await buildPrototype();
  const images = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  assert.ok(images.length > 0);
  for (const image of images) assert.match(image, /\salt="[^"]+"/);
});

test('every team member has a photo', async () => {
  const html = await buildPrototype();
  const team = section(html, 'team');
  assert.doesNotMatch(team, /class="initials"/);
  const people = [...team.matchAll(/<li>[\s\S]*?<\/li>/g)].map((m) => m[0]);
  assert.ok(people.length > 0);
  for (const person of people) assert.match(person, /<img\b/);
});
