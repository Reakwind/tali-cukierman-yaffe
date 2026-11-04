import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Keeps the versions written outside package.json in step with it. Today
// that is the Playwright image the CI browser jobs run in, which must match
// @playwright/test. Uses only Node's built-in modules, so the Dependabot
// workflow can run it without installing (or running) updated packages.

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const workflowPath = resolve(root, '.github/workflows/ci.yml');

export const playwrightImage = (version: string, digest: string) =>
  `mcr.microsoft.com/playwright:v${version}-noble@${digest}`;

/** Points the workflow's Playwright container image at `image`. */
export function syncWorkflow(workflow: string, image: string): string {
  const pattern = /(image: )mcr\.microsoft\.com\/playwright:\S+/;
  if (!pattern.test(workflow)) {
    throw new Error('ci.yml has no Playwright image to update');
  }
  return workflow.replace(pattern, `$1${image}`);
}

/** The digest of the multi-platform image for a Playwright version. */
export async function imageDigest(
  version: string,
  fetchImpl: typeof fetch = fetch,
): Promise<string> {
  const url = `https://mcr.microsoft.com/v2/playwright/manifests/v${version}-noble`;
  const response = await fetchImpl(url, {
    method: 'HEAD',
    headers: {
      Accept:
        'application/vnd.oci.image.index.v1+json, application/vnd.docker.distribution.manifest.list.v2+json',
    },
  });
  if (!response.ok) {
    throw new Error(`${url} answered ${response.status}`);
  }
  const digest = response.headers.get('docker-content-digest') ?? '';
  if (!/^sha256:[0-9a-f]{64}$/.test(digest)) {
    throw new Error(`${url} gave no valid digest: '${digest}'`);
  }
  return digest;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const pkg = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
  const version: string = pkg.devDependencies['@playwright/test'];
  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error(`@playwright/test is not pinned: '${version}'`);
  }
  const before = await readFile(workflowPath, 'utf8');
  const after = syncWorkflow(
    before,
    playwrightImage(version, await imageDigest(version)),
  );
  if (after === before) {
    console.log(`ci.yml already runs the Playwright ${version} image.`);
  } else {
    await writeFile(workflowPath, after);
    console.log(`ci.yml now runs the Playwright ${version} image.`);
  }
}
