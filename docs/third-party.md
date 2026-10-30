# Third-party design materials

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
