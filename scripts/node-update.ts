import { appendFile, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Weekly check (.github/workflows/node-update.yml): if nodejs.org has a newer
// release of the Node major version in .node-version, writes it there and
// reports it, so the workflow can open a pull request. Never moves to another
// major version: that is a deliberate upgrade. Uses only Node's built-in
// modules. CI, the cloud toolchain and Cloudflare all read .node-version.

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const plain = /^(\d+)\.(\d+)\.(\d+)$/;

const parts = (version: string) => {
  const match = plain.exec(version);
  if (!match) throw new Error(`not a plain version: '${version}'`);
  return match.slice(1).map(Number) as [number, number, number];
};

const newer = (a: string, b: string) => {
  const [x, y] = [parts(a), parts(b)];
  for (let i = 0; i < 3; i += 1) {
    if (x[i] !== y[i]) return x[i]! > y[i]!;
  }
  return false;
};

/** The newest release in nodejs.org's index with the same major version as
 * `current`, if it is newer than `current`. */
export function newerNode(
  index: { version: string }[],
  current: string,
): string | undefined {
  const [major] = parts(current);
  let best = current;
  for (const { version } of index) {
    const candidate = version.replace(/^v/, '');
    if (!plain.test(candidate) || parts(candidate)[0] !== major) continue;
    if (newer(candidate, best)) best = candidate;
  }
  return best === current ? undefined : best;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const file = resolve(root, '.node-version');
  const current = (await readFile(file, 'utf8')).trim();
  const response = await fetch('https://nodejs.org/dist/index.json');
  if (!response.ok) {
    throw new Error(`nodejs.org answered ${response.status}`);
  }
  const latest = newerNode(await response.json(), current);
  if (!latest) {
    console.log(`Node ${current} is the newest release of its major version.`);
  } else {
    await writeFile(file, `${latest}\n`);
    console.log(`Node ${latest} is available; .node-version updated.`);
    if (process.env['GITHUB_OUTPUT']) {
      await appendFile(process.env['GITHUB_OUTPUT'], `version=${latest}\n`);
    }
  }
}
