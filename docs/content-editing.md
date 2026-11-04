# Updating the website

Updated 2026-11-04. The earlier Astro draft, with its JSON content
collections, was retired; its files and records can be recovered from commit
`d3e5b5b`.

## Plain-language requests work

Content is maintained through the agent workflow in `AGENTS.md`, not a CMS.
For example:

> Add this study using its official record, this team-approved description
> and reviewed Hebrew translation.

Never supply patient data in an editing request, GitHub issue, or source file.

## Where content lives

| Content                                                    | File                                           |
| ---------------------------------------------------------- | ---------------------------------------------- |
| English page: copy, styles, painting, script, publications | `prototype/index.html`                         |
| Hebrew page: only the Hebrew words                         | `prototype/he.html`                            |
| Not-found page, both languages                             | `prototype/404.html`                           |
| Team portraits, logos and the research image               | `public/images/` (sources in `third-party.md`) |
| Sources and their check dates                              | `content-plan.md`, `drafts/`                   |

`he.html` marks where shared parts go (`<!-- shared:style -->` and so on); the
build fills them in from `index.html`. Change styles, the painting, the script
or the publication list in `index.html` only. Publications stay in English on
both pages (owner, 2026-11-03).

Follow `AGENTS.md` for the information pyramid, naming each ongoing study in
one place only, and copy that states verified facts or offers an action.

## Style and script rules

- No inline `style="..."` or `on...=` attributes: the Content-Security-Policy
  allows only the pages' own `<style>` and `<script>` blocks, by hash, and a
  unit test fails on inline attributes. Put styles in the stylesheet.
- New external resources (another font host, an embed, analytics) are blocked
  by the policy. They need an owner decision first; then update
  `scripts/site.ts` and its tests.
- Images go in `public/images/` and are referenced as `../public/images/...`.
  The site build publishes them under content-hashed names.
- Keep core text visible without JavaScript or animation support; the scroll
  behavior is documented in [the scroll plan](scrolling-plan.md).

## Before changing study content

1. Read the official source, not a stale aggregator/search snippet.
2. Confirm current site availability with the coordinator. A global registry
   status may differ between study centers. The site lists ongoing studies
   without recruitment status or timelines (owner, 2026-11-03).
3. Describe practical burdens accurately. Do not promise treatment benefit,
   eligibility, or a place in a study.
4. Update both languages and keep the source dates honest.
5. Run `npm run verify` and inspect both pages: `npm run dev` serves the built
   site as Cloudflare does; `npm run prototype:build` writes the artifact
   version for the owner's review.

A completed study appears only through its publications, never among ongoing
studies.

## Participant enquiries

Not active: Contact offers the D360 email and phone. Any enquiry route follows
[the enquiry plan](registration-plan.md) and needs an approved destination and
reviewed participant information in both languages first.

## Before public launch

- Replace draft copy only with reviewed information.
- Add approved public contact routes and permission-cleared photos/logos.
- Complete manual accessibility, real-device, and content reviews.
- Configure the canonical domain and verify actual response headers.
- Remove the indexing restrictions (robots meta tag, `robots.txt` and the
  `X-Robots-Tag` header) together, in a reviewed launch PR. Non-indexable does
  not mean private.
