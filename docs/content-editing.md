# Updating the website

## Plain-language requests work

Content is maintained through the agent/PR workflow, not a new CMS. For example:

> Add this study using its official record, this team-approved description,
> participation commitment, current site status, and reviewed Hebrew translation.
> Keep enquiries disabled until our institutional contact route is approved.

Never supply patient data in an editing request, GitHub issue, or source file.

## Where content lives

| Content                                                         | File                                              |
| --------------------------------------------------------------- | ------------------------------------------------- |
| Individual studies in both languages                            | `src/content/studies/*.json`                      |
| Required study fields and draft safety rules                    | `src/lib/study-schema.ts`                         |
| Astro's built-in content loading                                | `src/content.config.ts`                           |
| About, research, publications, guidance, privacy, accessibility | `src/data/pages.ts`                               |
| Shared navigation and interface translations                    | `src/i18n/ui.ts`                                  |
| Homepage editorial copy                                         | `src/components/Home.astro`                       |
| Shared layout and appearance                                    | `src/layouts/Layout.astro`, `src/styles/site.css` |

Study cards, detail pages, and the homepage feature read the same validated study
collection. The homepage only features a record whose registry status is recruiting;
it does not convert that registry status into a promise of current availability.
Do not duplicate dates, registry status, or study summaries in page templates.

The root URL and both localized homepages share `Home.astro`; there is no initial
language-selection gate. Keep the five main destinations visible on desktop and
available through the native disclosure menu on small screens. Follow the approved
Sarvestani/Ranade direction and copy guardrails in `AGENTS.md` rather than bringing
back the rejected wellness-style headings or decorative template sections.

Each study file includes:

- A real registry identifier and its matching official URL.
- Registry status, registry-update date, and the date the source was actually checked.
- English and Hebrew purpose, population, location, duration, procedures, and limitations.
- Explicit draft status and disabled enquiries. The current schema deliberately
  rejects a claim that content is approved or that live enquiries are available.

Current records are dated public snapshots, not automatic registry synchronization.
The static build does not depend on registry or other external API availability.
The source-check date is not research-team approval or ethics approval.

## Before changing study content

1. Read the official source, not a stale aggregator/search snippet.
2. Confirm current site availability and approved recruitment information with
   the coordinator. A global registry status may differ between study centers.
3. Describe practical burdens accurately, including relevant invasive/optional
   procedures. Do not promise treatment benefit, eligibility, or a place in a study.
4. Update both languages and keep the source dates honest.
5. Run `npm run verify`, inspect the relevant pages in both directions, and open
   the feature PR when publishing is authorized. Never bypass protections.

If a study completes, retain its useful archive page and clearly mark it closed.
Do not link it as a participation opportunity. The current draft never accepts
participant information, including for records that a registry lists as recruiting.

## Opening a real enquiry route is a separate feature

Do not simply change the schema or replace the pending message with a submit
button. First resolve `registration-plan.md`: responsible institution, approved
form, contact permission/privacy text, access, retention, translated participant
information, accessibility, and coordinator ownership. Use the institution's
approved system where available rather than building a health-data database here.

## Before public launch

- Replace draft/unknown copy only with reviewed information.
- Add approved public contact routes and any permission-cleared photos/logos.
- Confirm the platform's preferred URL and current institutional role wording.
- Complete manual accessibility, real-device, and content reviews.
- Configure hosting/canonical domain and verify actual response headers.
- Remove draft indexing restrictions together, in a reviewed launch PR, only
  when the team is ready. Non-indexable does not mean private.

See `operations.md` for the owner's current local-only publishing decision and
the safe order for publishing the stacked feature branches later.
