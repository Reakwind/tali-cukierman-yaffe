import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'prototype/index.html');
const output = resolve(root, 'dist/prototype/index.html');
const imageTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

/** Returns the prototype as one self-contained HTML file: the artifact host
 * blocks external images, so local images become data URIs. */
export async function buildPrototype(): Promise<string> {
  let html = await readFile(source, 'utf8');
  const paths = new Set(
    [...html.matchAll(/\ssrc="(\.\.\/[^"]+)"/g)].map((match) => match[1]),
  );
  for (const path of paths) {
    const type = imageTypes[extname(path).toLowerCase()];
    if (!type) throw new Error(`Unsupported image type: ${path}`);
    const data = await readFile(resolve(dirname(source), path));
    html = html
      .split(`src="${path}"`)
      .join(`src="data:${type};base64,${data.toString('base64')}"`);
  }
  return html;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, await buildPrototype());
  console.log(output);
}
