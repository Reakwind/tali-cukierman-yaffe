# Updating the website

## Plain-language requests work

Content is maintained through the agent/PR workflow, not a new CMS. For example:

> Add this study using its official record, this team-approved description,
> participation commitment, current site status, and reviewed Hebrew translation.
> Keep enquiries disabled until our institutional contact route is approved.

Never supply patient data in an editing request, GitHub issue, or source file.

## Where content lives

| Content                                                        | File                                                                |
| -------------------------------------------------------------- | ------------------------------------------------------------------- |
| Individual studies in both languages                           | `src/content/studies/*.json`                                        |
| Curated publications and study-output associations             | `src/content/publications.json`                                     |
| Sourced research highlights in both languages                  | `src/content/highlights.json`                                       |
| Publication/highlight structure and source validation          | `src/lib/output-schema.ts`                                          |
| Team profiles, roles, and portrait metadata                    | `src/data/team.ts`, rendered by `src/components/TeamProfiles.astro` |
| Required study fields and draft safety rules                   | `src/lib/study-schema.ts`                                           |
| Astro's built-in content loading                               | `src/content.config.ts`                                             |
| Page introductions, research, guidance, privacy, accessibility | `src/data/pages.ts`                                                 |
| Shared navigation and interface translations                   | `src/i18n/ui.ts`                                                    |
| Homepage editorial copy                                        | `src/components/Home.astro`                                         |
| Shared layout and appearance                                   | `src/layouts/Layout.astro`, `src/styles/site.css`                   |

Study cards, detail pages, and the homepage feature read the same validated study
collection. The continuous homepage presents research areas, current studies,
then one shared contact section. BIRAX and STAY-STRONG are confirmed as recruiting
by the owner on 2026-11-01. GRACE-780G appears with research findings, without a
completion badge or participation invitation. `homepageSummary` provides concise
study introductions; the full information comes from the same validated records.
Do not duplicate dates, registry status, or study summaries in page templates.

The root URL and both localized homepages share `Home.astro`; there is no initial
language-selection gate. Keep the four current main destinations visible on desktop and
available through the native disclosure menu on small screens. Shortcuts now use
the homepage anchors in `src/lib/section-navigation.ts`. Follow the approved
Sarvestani/Ranade direction and copy guardrails in `AGENTS.md` rather than bringing
back the rejected wellness-style headings or decorative template sections.

Each study file includes:

- A `kind` distinguishing a registered trial from a research project.
- For trials: a real registry identifier and matching official URL, registry status,
  and registry-update date. For projects: an official source URL and explicitly
  unconfirmed participation status, without invented NCT identifiers or registry dates.
- The date the source was actually checked, displayed separately from registry updates.
- Optional owner-confirmed recruitment metadata, distinct from registry status.
- English and Hebrew purpose, population, location, duration, procedures, and limitations.
- A concise scientific description for clinicians and collaborators.
- Explicit draft status and disabled enquiries. The current schema deliberately
  rejects a claim that content is approved or that live enquiries are available.

Current records are dated public snapshots, not automatic registry synchronization.
The static build does not depend on registry or other external API availability.
The source-check date is not research-team approval or ethics approval.

Publications are loaded from one validated JSON collection and reused on study
pages using explicit study associations. Keep evidence types accurate: a
conference abstract is not a full results article, and a related paper is not
automatically a study output. Each entry carries a source URL, source-check date,
English/Hebrew summary and context, citation, year, draft status, and DOI when
available. Earlier highlight records retain their dated provenance in the content
collection; the homepage now presents findings with the research and publication
sections. A grant period must remain a project period, not an invented news date.

The scroll layout and behavior are documented in [the scroll plan](scrolling-plan.md).
Keep core text visible without JavaScript or animation support. Portrait crop
positions are applied in `TeamProfiles.astro` CSS to work under the strict CSP;
keep the curation metadata in `team.ts` consistent when changing a crop.

For the current editorial choices and team questions, see
[the study-content review](drafts/study-content.md).

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

## Participant contact form

The owner requested optional first name and one phone/email field, sent to four
specified team inboxes. `ParticipationInvite.astro` renders the bilingual form;
`worker/index.ts` validates and sends via Cloudflare's email binding. Recipients
are fixed server-side. Success appears only after the provider accepts the email.
Deployment configuration starts disabled; do not enable it before domain setup,
recipient verification and a real delivery check. See the updated
[enquiry plan](registration-plan.md) and [architecture](architecture.md).

Keep the public flow informational, without consent/legal copy or medical intake.
Student and collaborator links open a blank email to Tali. The minimal JavaScript
is restricted to study contact forms; research content/navigation remain static.

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

## Visual study explanations

`src/content/visual-studies.json` supplies the bilingual caption text and actual
protocol/result values for the homepage diagrams. `visual-study-schema.ts`
validates both languages, diagram kinds, ordered visit dates, duration and
percentage ranges. Keep these values consistent with the full study records
and cited publication/registry source. A graphic must not imply a procedure,
benefit or device reading absent from its source. BIRAX's individual visit plan
is unconfirmed; do not invent it to complete a timeline.

The owner rejected SVG people and anatomical parts. Use the original geometric
device/instrument icons in `DiabetesIcon.astro` and the separate layered hero.
Real portrait crops belong in CSS; inline style attributes violate the production
CSP. Do not add paid illustration services or runtime asset fetches.
