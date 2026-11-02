// Session worktrees and the daily pull request. Usage: see AGENTS.md.
const [command] = process.argv.slice(2);
if (!['start', 'finish', 'cleanup'].includes(command ?? '')) {
  console.error('usage: node scripts/session.ts start <slug> | finish | cleanup');
  process.exit(2);
}
