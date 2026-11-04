import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Decides whether a Dependabot pull request may merge by itself
// (.github/workflows/dependabot-automerge.yml). Dependabot writes each
// update's type into its commit message ("update-type:
// version-update:semver-patch"). Only patch and minor updates qualify; a
// major update, or no metadata at all, is left to a person. Built-in modules
// only.

const UPDATE_TYPE = /^\s*update-type: version-update:semver-(\w+)\s*$/gm;

export function safeToAutomerge(messages: string[]): boolean {
  const types = messages.flatMap((message) =>
    [...message.matchAll(UPDATE_TYPE)].map((match) => match[1]),
  );
  return (
    types.length > 0 &&
    types.every((type) => type === 'patch' || type === 'minor')
  );
}

// Reads `gh pr view --json commits` from stdin; exits 0 when safe.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { commits } = JSON.parse(readFileSync(0, 'utf8')) as {
    commits: { messageHeadline: string; messageBody: string }[];
  };
  const messages = commits.map(
    (c) => `${c.messageHeadline}\n\n${c.messageBody}`,
  );
  if (safeToAutomerge(messages)) {
    console.log('Only patch and minor updates: enabling auto-merge.');
  } else {
    console.log('A major update or no Dependabot metadata: left for review.');
    process.exit(1);
  }
}
