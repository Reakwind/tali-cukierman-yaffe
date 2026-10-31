# Third-party design materials

## Team portraits (draft, 2026-10-31)

Real photographs located at the owner's direction; no generated, stock, or
invented people are shipped. The owner directed their use for this draft.
Institutional permission, final photo credits, and higher-resolution originals
remain launch gates — the Cuenca headshots are only 180px sources.

| File                            | Person                     | Source                                                                                                                         | Credit shown            | SHA-256                                                          |
| ------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------- | ---------------------------------------------------------------- |
| `public/images/team/tali.jpg`   | Prof. Tali Cukierman-Yaffe | Cuenca 2nd-conference booklet p.8 (embedded image extracted; CMYK converted to RGB JPEG; verified against her Cuenca headshot) | Photo: Cuenca Institute | b7da2f35c3649c125d7e667e33d173f38e88b3ae162c958f11da1ccb45526423 |
| `public/images/team/naama.webp` | Dr. Naama Peltz-Sinvani    | Sheba Longevity official staff page, unmodified                                                                                | Photo: Sheba Longevity  | 3c33e0e14a87bfeaf1426a22baf4de4a854567f0fac92c597f26ae5b3e6610b1 |
| `public/images/team/tal.jpg`    | Tal Yahalom-Peri           | Cuenca booklet p.18 (identified by elimination against Orit Shdior's awardee photo on the same page)                           | Photo: Cuenca Institute | 397d680449c815771e81be34191584424eddcdebdb1fccaab4c39b7e6f40a996 |
| `public/images/team/itay.png`   | Itay Cohen                 | Cuenca 2026 awardees page, unmodified                                                                                          | Photo: Cuenca Institute | 72c5d6f3d91cc17bdcb0526d9d6000342789762e1e1a1ccf900946583a710afd |

The Cuenca booklet credits its conference photography to Ofer Amram; confirm the
exact portrait credit before launch. No portrait was found for Hagar Shimon or
Yasmin Alt, so their profiles render without a photo rather than with a
substitute image.

## Shipped fonts

Lexend (Latin, variable weights) and IBM Plex Sans Hebrew (regular/semibold) are
self-hosted in `public/fonts/`. These are unmodified WOFF2 files, renamed only at
the filesystem level. They are licensed under SIL OFL 1.1; both copyright notices
and the full license ship in `public/fonts/OFL.txt`. Unused fonts from the first
draft have been removed rather than shipped to visitors.

Source: https://github.com/IBM/plex/tree/71f558992315a12ca1f06a2215d57962a1992162/packages

Lexend source: https://fonts.gstatic.com/s/lexend/v26/wlpwgwvFAVdoq2_v-6QU82RHaA.woff2

Lexend license: https://github.com/google/fonts/blob/main/ofl/lexend/OFL.txt

Downloaded 2026-10-30. SHA-256 checksums:

| File                       | SHA-256                                                          |
| -------------------------- | ---------------------------------------------------------------- |
| lexend-latin.woff2         | 1ec8f6ee2750554b4bc59ff0b507d316a82a7ba37e0e5bebc41d3bd9b9faad46 |
| plex-hebrew-regular.woff2  | 9e56b8035b123978d479e50c6fcccaebc462888dc49902d8572f7869210a077e |
| plex-hebrew-semibold.woff2 | 22792f09b91eeac408bce0df1aea7849a103e993a9ee31c707b8b9b6396dddf4 |

No font API is contacted by visitors. Each language loads only fonts it uses.

## Design guidance, not shipped component libraries

The owner approved Sarvestani Lab and Ranade Lab as design references. Their
assets, branding, and text have not been copied. The original SVG illustration
in `src/components/AssessmentIllustration.astro` explains a sit-to-stand movement
used in physical-function research; this method appears in the sourced study
record NCT06236256. It depicts neither actual participants nor measurements and
is not a clinical test, instructions, study result, or recruitment approval.

No full design-system package, institutional logos, stock people, generated
portraits, or copied third-party component implementation is shipped. The simple
wordmark/favicon is a draft site identity, not an institutional logo.

See `discovery.md` for the source links and license research. Dependencies retain
their own package licenses; the project has no blanket content/code license yet.

## Generative artwork (draft, 2026-10-31)

`public/images/art/{hero,cognition,movement,technology}.webp` are original
generated abstractions (pastel teal/magenta on cream), produced offline from a
seeded painterly algorithm. They are decorative, not study data, measurements,
or participant imagery. No p5.js runtime is shipped; replace the files at the
same paths with owner-generated art if preferred.

Photo credit captions were removed on 2026-10-31 at the owner's request: the
portraits are the team's own photographs. The provenance table above is retained
for internal reference only.
