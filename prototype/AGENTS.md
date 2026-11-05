# Page rules

These apply to the published pages in this folder (`index.html`, `he.html`,
`404.html`), on top of the project rules in the root `AGENTS.md`.

## Structure and security

- One page per language plus the not-found page.
  `he.html` holds only the Hebrew words; the build takes fonts, styles,
  painting, script and the English publication list from `index.html`.
- No inline `style=` or `on...=` attributes: the CSP that `npm run build`
  writes admits only the pages' own `<style>`/`<script>`.
- Images live in `public/images/`; sources and credits in `docs/third-party.md`.

## Approved design direction

- The owner rejected the original wellness-style draft and the university-template
  references. The approved references are https://www.sarvestanilab.com/ and
  https://www.ranadelab.org/: independent identity, short consistent navigation,
  readable sans-serif type, purposeful imagery, and restrained color.
- Avoid the rejected AI-template bundle: gradient headlines, glowing backgrounds,
  glossy decorative 3D objects, pill-button clusters, repeated three-card sections,
  arbitrary metric bars, and ornamental filler. These are quality warnings, not
  evidence that a particular author used AI.
- Write specific factual copy. No manufactured slogans such as "Aging well.
  Living fully.", "Three perspectives. One person.", "The next question starts
  here", or interchangeable "science with people at its heart" language.
- A section must serve a real visitor task. Do not invent content to fill a design.
  Use plain page/section names and show study information early.
- Borrow principles, not another lab's logo, photographs, text, or illustrations.
  Do not invent a portrait or use stock people as if they were the research group.
- Check the actual rendered design, not just passing tests. Present a reviewable
  draft before expanding an unapproved visual direction across more features.
