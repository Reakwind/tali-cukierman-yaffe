import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pages = {
  en: { source: 'prototype/index.html', output: 'dist/prototype/index.html' },
  he: { source: 'prototype/he.html', output: 'dist/prototype/he.html' },
} as const;
type Language = keyof typeof pages;
const imageTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

const shared = (english: string, pattern: RegExp, name: string) => {
  const found = english.match(pattern);
  if (!found) throw new Error(`prototype/index.html has no ${name}`);
  return found.join('\n');
};

/** The Hebrew page holds only its own words. Fonts, styles, the painting, the
 * script and the English publication list come from the English page, so the
 * two never drift apart. */
async function assemble(language: Language): Promise<string> {
  const english = await readFile(resolve(root, pages.en.source), 'utf8');
  if (language === 'en') return english;
  const hebrew = await readFile(resolve(root, pages.he.source), 'utf8');
  const parts: Record<string, string> = {
    fonts: shared(english, /<link\b[\s\S]*?\/>/g, 'font links'),
    style: shared(english, /<style>[\s\S]*?<\/style>/, 'style'),
    art: shared(english, /<figure class="art"[\s\S]*?<\/figure>/, 'painting'),
    script: shared(english, /<script>[\s\S]*?<\/script>/, 'script'),
    // Publications stay in English (owner, 2026-11-03), read left to right.
    publications: shared(
      english,
      /<ol class="pubs"[\s\S]*?<\/ol>/,
      'publications',
    ).replace('<ol class="pubs"', '<ol class="pubs" lang="en" dir="ltr"'),
  };
  return hebrew.replace(/<!-- shared:(\w+) -->/g, (_, name: string) => {
    const part = parts[name];
    if (part === undefined) throw new Error(`Unknown shared part: ${name}`);
    return part;
  });
}

/** Returns one page of the prototype. `inline` makes a self-contained HTML
 * file: the artifact host blocks external images, so local images become
 * data URIs. `files` links each image as `images/<name>.<hash>.<ext>` and
 * returns the files, so the published site can cache them and both
 * languages share one copy. */
export async function buildPage(
  language: Language,
  images: 'inline' | 'files',
): Promise<{ html: string; images: Map<string, Buffer> }> {
  const source = resolve(root, pages[language].source);
  let html = await assemble(language);
  const files = new Map<string, Buffer>();
  const paths = new Set(
    [...html.matchAll(/\ssrc="(\.\.\/[^"]+)"/g)].flatMap((match) =>
      match[1] ? [match[1]] : [],
    ),
  );
  for (const path of paths) {
    const extension = extname(path).toLowerCase();
    const type = imageTypes[extension];
    if (!type) throw new Error(`Unsupported image type: ${path}`);
    const data = await readFile(resolve(dirname(source), path));
    let target = `data:${type};base64,${data.toString('base64')}`;
    if (images === 'files') {
      const hash = createHash('sha256').update(data).digest('hex').slice(0, 10);
      target = `images/${basename(path, extension)}.${hash}${extension}`;
      files.set(target, data);
    }
    html = html.split(`src="${path}"`).join(`src="${target}"`);
  }
  return { html, images: files };
}

/** One page of the prototype as a self-contained HTML file (images inlined),
 * as the owner reviews it in the artifact host. */
export async function buildPrototype(
  language: Language = 'en',
): Promise<string> {
  return (await buildPage(language, 'inline')).html;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const language of Object.keys(pages) as Language[]) {
    const output = resolve(root, pages[language].output);
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, await buildPrototype(language));
    console.log(output);
  }
}
