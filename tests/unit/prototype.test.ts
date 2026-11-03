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
  // Visible text only: percentages inside SVG attributes are geometry, not statistics.
  const text = html
    .replace(/<(style|script|svg)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  assert.doesNotMatch(text, /\d\s?%/);
});

const section = (html: string, id: string) =>
  new RegExp(`<section[^>]*id="${id}"[\\s\\S]*?</section>`).exec(html)?.[0] ??
  '';
const studyIds = (html: string) =>
  [...section(html, 'studies').matchAll(/<li class="study" id="([^"]+)"/g)].map(
    (m) => m[1] ?? '',
  );

test('ongoing studies are named in one place only', async () => {
  const html = await buildPrototype();
  const names = [
    ...section(html, 'studies').matchAll(
      /<li class="study"[^>]*>\s*<h3>([^<]+)<\/h3>/g,
    ),
  ].map((m) => (m[1] ?? '').trim());
  assert.ok(names.length > 0);
  const elsewhere = html
    .replace(/<section[^>]*id="studies"[\s\S]*?<\/section>/, '')
    .replace(/<(script|style|title)[\s\S]*?<\/\1>/g, '');
  for (const name of names) {
    assert.doesNotMatch(elsewhere, new RegExp(`\\b${name}\\b`), name);
  }
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

test('the first screen does not repeat the ongoing studies', async () => {
  const html = await buildPrototype();
  const about =
    /<section class="about"[\s\S]*?<\/section>/.exec(html)?.[0] ?? '';
  assert.ok(about.length > 0);
  for (const id of studyIds(html)) {
    assert.doesNotMatch(about, new RegExp(`href="#${id}"`));
  }
  assert.doesNotMatch(about, /Ongoing studies|href="#contact"/);
});

test('contact offers the team email and phone, and no form that sends nothing', async () => {
  // A form that only shows "thank you" would lose real enquiries (owner,
  // 2026-11-03): email and phone until a working destination is approved.
  const html = await buildPrototype();
  assert.doesNotMatch(html, /<form\b|<input\b/);
  const contact = section(html, 'contact');
  assert.match(contact, /href="mailto:D360@sheba\.health\.gov\.il"/);
  assert.match(contact, /href="tel:\+97235307493"/);
  assert.doesNotMatch(html, /data-study=/);
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

const css = (html: string) =>
  /<style>([\s\S]*?)<\/style>/.exec(html)?.[1] ?? '';
const rule = (styles: string, selector: string) =>
  new RegExp(
    `(^|\\n)\\s*${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]*)\\}`,
  ).exec(styles)?.[2] ?? '';

test('the page loads typefaces that also cover Hebrew', async () => {
  const html = await buildPrototype();
  const fonts = /href="(https:\/\/fonts\.googleapis\.com\/css2[^"]+)"/.exec(
    html,
  )?.[1];
  assert.ok(fonts);
  assert.match(fonts, /Frank\+Ruhl\+Libre/);
  assert.match(fonts, /IBM\+Plex\+Sans\+Hebrew/);
  assert.doesNotMatch(fonts, /Lexend/);
});

test('no text is set smaller than 14px', async () => {
  const sizes = [
    ...css(await buildPrototype()).matchAll(/font-size:\s*([\d.]+)px/g),
  ].map((m) => Number(m[1]));
  assert.ok(sizes.length > 0);
  for (const size of sizes) assert.ok(size >= 14, `${size}px`);
});

test('the story is serif, details sans and records mono', async () => {
  const styles = css(await buildPrototype());
  for (const selector of ['.about h1', '.section h2', '.area h3']) {
    assert.match(
      rule(styles, selector),
      /font-family:\s*var\(--serif\)/,
      selector,
    );
  }
  for (const selector of ['.study .meta', '.pubs .yr', '.pubs .src']) {
    assert.match(
      rule(styles, selector),
      /font-family:\s*var\(--mono\)/,
      selector,
    );
  }
  assert.match(rule(styles, 'body'), /font-family:\s*var\(--sans\)/);
});

const token = (styles: string, name: string) =>
  new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`).exec(styles)?.[1] ?? '';
const luminance = (hex: string) => {
  const channel = (i: number) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((hi ?? 0) + 0.05) / ((lo ?? 0) + 0.05);
};

test('every colour pair meets WCAG contrast for text', async () => {
  const styles = css(await buildPrototype());
  const pairs: [string, string, number][] = [
    ['ink', 'paper', 7],
    ['muted', 'paper', 4.5],
    ['teal', 'paper', 4.5],
    ['study-display', 'paper', 3],
    ['study-display', 'panel', 3],
  ];
  for (const [fg, bg, min] of pairs) {
    const [a, b] = [token(styles, fg), token(styles, bg)];
    assert.ok(a && b, `--${fg} and --${bg} are defined`);
    assert.ok(contrast(a, b) >= min, `--${fg} on --${bg}`);
  }
});

test('pink is reserved for ongoing studies', async () => {
  const styles = css(await buildPrototype());
  const uses = [...styles.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter((m) =>
    /var\(--study/.test(m[2] ?? ''),
  );
  assert.ok(uses.length > 0);
  for (const use of uses) {
    const selector = (use[1] ?? '').trim();
    assert.match(selector, /stud|ongoing|\.dot\.on/, selector);
  }
});

test('teal is used only for links and buttons', async () => {
  const styles = css(await buildPrototype());
  assert.doesNotMatch(rule(styles, '.pubs .area-tag'), /var\(--teal\)/);
  assert.doesNotMatch(styles, /background:\s*var\(--teal-paper\)/);
});

test('ongoing study names are large serif type in the logo pink', async () => {
  const styles = css(await buildPrototype());
  for (const selector of ['.studies-band h2', '.study h3']) {
    const body = rule(styles, selector);
    assert.match(body, /color:\s*var\(--study-display\)/, selector);
  }
  const name = rule(styles, '.study h3');
  assert.match(name, /font-family:\s*var\(--serif\)/);
  assert.match(name, /font-size:\s*var\(--t-heading\)/);
  assert.equal(token(styles, 'study-display').toLowerCase(), '#e83880');
});

test('the first screen pairs the heading with the painting, not a sentence', async () => {
  const html = await buildPrototype();
  const about =
    /<section class="about"[\s\S]*?<\/section>/.exec(html)?.[0] ?? '';
  assert.match(about, /<h1>/);
  assert.doesNotMatch(about, /<p\b/);
  assert.match(
    about,
    /<figure class="art" aria-hidden="true">\s*<svg[^>]*focusable="false"/,
  );
});

test('the painting stays within the Sheba navy, teal and pink hues', async () => {
  const html = await buildPrototype();
  const art = /<figure class="art"[\s\S]*?<\/figure>/.exec(html)?.[0] ?? '';
  const colours = [...art.matchAll(/#([0-9a-fA-F]{6})\b/g)].map((m) => m[1]);
  assert.ok(colours.length > 0);
  for (const hex of colours) {
    const [r, g, b] = [0, 2, 4].map(
      (i) => parseInt((hex ?? '').slice(i, i + 2), 16) / 255,
    ) as [number, number, number];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (max - min < 0.06) continue; // white and greys
    const d = max - min;
    const raw =
      max === r
        ? (g - b) / d + (g < b ? 6 : 0)
        : max === g
          ? (b - r) / d + 2
          : (r - g) / d + 4;
    const hue = raw * 60;
    const family =
      (hue >= 225 && hue <= 250) || // navy
      (hue >= 155 && hue <= 175) || // teal
      (hue >= 320 && hue <= 345); // pink
    assert.ok(family, `#${hex} (hue ${Math.round(hue)})`);
  }
});
