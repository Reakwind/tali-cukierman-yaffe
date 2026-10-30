# Third-party design materials

## Shipped fonts

IBM Plex Sans (regular/semibold), Plex Serif (regular), and Plex Sans Hebrew
(regular/semibold) are self-hosted in `public/fonts/`. These are unmodified WOFF2
files, renamed only at the filesystem level. They are licensed under SIL OFL 1.1;
the copyright notice and full license ship in `public/fonts/OFL.txt`.

Source: https://github.com/IBM/plex/tree/71f558992315a12ca1f06a2215d57962a1992162/packages

Downloaded 2026-10-30. SHA-256 checksums:

| File                       | SHA-256                                                          |
| -------------------------- | ---------------------------------------------------------------- |
| plex-sans-regular.woff2    | ba711a3085ff9f27440b6b9c4550cfc47c97bf36591d5da958b975bb3add8c1a |
| plex-sans-semibold.woff2   | f78048030eab62e860efa39a0df79e2e5581bf122eb95b9bc42c0b8a4988d205 |
| plex-serif-regular.woff2   | 024ebce13cec984b46e350dd85fa7c01105c777e116bfe95f097ad7fa93f39f2 |
| plex-hebrew-regular.woff2  | 9e56b8035b123978d479e50c6fcccaebc462888dc49902d8572f7869210a077e |
| plex-hebrew-semibold.woff2 | 22792f09b91eeac408bce0df1aea7849a103e993a9ee31c707b8b9b6396dddf4 |

No font API is contacted by visitors. Each language loads only fonts it uses.

## Design guidance, not shipped component libraries

IBM Carbon grid/spacing and USWDS content/navigation principles informed the
design. No full design-system package, institutional logos, stock photography,
medical illustrations, or copied third-party component implementation is shipped.
The draft wordmark/favicon and purely decorative CSS rings do not represent any
institutional logo, research measurement, or scientific result.

See `discovery.md` for the source links and license research. Dependencies retain
their own package licenses; the project has no blanket content/code license yet.
