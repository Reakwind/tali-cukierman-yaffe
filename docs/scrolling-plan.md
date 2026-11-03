# Continuous-page reading and scrolling

## Current direction — 2026-11-03

The owner chose option C of four reviewed on the real prototype (orientation,
reading focus, graphics draw in, staged entrance). It supersedes the parallax
and pinned-scene plan below, which describes the earlier Astro implementation
and is to be replaced when the prototype is ported.

- Orientation: a 3px navy line under the header grows with the reading
  position (CSS scroll timeline, no script; absent where unsupported). On
  screens from 1001px each section title stays beside its section.
- Drawings arrive once: on load the hero painting is painted left to right,
  the lens appears at the moment of detection, then the risk path rises (about
  two seconds). The rules over Research, each study and Publications draw
  across as they arrive; the app screenshot fades in.
- Text never moves or fades. Nothing scrolls for the reader, snaps or uses
  parallax. The page is complete at rest: without the script, in print, with
  reduced motion (also when changed mid-visit), after a menu jump and for
  anything on screen when the page opens.
- Evidence: Nielsen Norman Group on animated text, scrolljacking and parallax;
  vestibular dysfunction is more common with diabetes (Agrawal 2009); WCAG
  2.3.3 on motion from interaction. Orientation is what helps.
- Write `animation-timeline` after the `animation` shorthand, which resets it.
  Hero animations use `backwards` fill so they leave no state behind.
- Checked by `tests/e2e/prototype-scroll.spec.ts` in Chromium (desktop and
  Pixel 7). Firefox 159+ and Safari 26+ support scroll timelines; they have
  not been tested locally (no browsers in the cloud session).

## Earlier plan — 2026-11-01 (superseded)

Owner direction and source check: 2026-11-01. Local review draft; no deployment.
The latest visual direction supersedes the original muted diagram drift.

## Reading order

Six parts: sticky title/menu, hero, research areas, current studies, one shared
participation section, then footer. Research includes the GRACE-780G result;
studies include the clinician route. Publications, portraits and site information
remain in the continuous document's final part. Existing deep URLs still work.
Menu shortcuts use native homepage anchors. There is one homepage contact form.

## Visual hierarchy

Use [the current visual plan](visual-direction.md): pastel magenta and teal,
existing Lexend/Plex Hebrew type, original device and instrument SVG geometry.
No SVG humans or anatomy. Real portraits remain photographs. The owner's 40/60
meaning budget is an editorial constraint, not a measured claim of understanding.
Desktop hero uses a 35/65 copy/illustration split; small screens stack the content.
The page, header, sections and form use pure white. Color stays in graphics,
protocol arms, controls and fine structural details.
Research holds a visual beside three short topics and emphasizes the relevant
symbol/instrument as its text crosses the reading area. Study diagrams carry
allocation, duration, assessment dates and weekly commitments.

## Scroll behavior

- Keep native wheel/touch scrolling, history, fragment URLs, find-in-page and
  keyboard navigation. No interception, mandatory snapping or scroll library.
- The title/menu stays sticky. The hero illustration has three layers with
  substantially different travel over a bounded sticky scene. Research uses a
  sustained illustration beside the flowing topics. Body text and controls
  do not transform. Foreground objects make small opposing rotations and a
  colored signal trace resolves over its always-visible connecting line. These
  effects reverse with the scroll position; they are not autonomous loops.
- Native CSS named view timelines animate SVG layer transforms. Use a guarded
  fallback of paused Web Animations, driven by a passive scroll listener and
  at most one requestAnimationFrame per actual event. An IntersectionObserver
  limits work to visible scenes; there is no permanent render loop.
- The mobile menu closes after a shortcut. Focus goes to the fragment target,
  with clearance for the sticky header. Active menu and same-page language
  switching track the reading area without changing history during scrolling.
- Reduced motion disables depth and removes unnecessary hero/topic travel,
  including when changed mid-session. Native navigation and all content remain.
- Static HTML starts visible. With JavaScript disabled, content and anchor
  navigation still work; supported browsers can run native CSS parallax.
- Do not introduce layout animation or paid/runtime illustration APIs.

## Sources and verification

Inspected the actual [Firewatch](https://www.firewatchgame.com/) example and
[Keith Clark's original layered CSS demonstration](https://keithclark.co.uk/articles/pure-css-parallax-websites/).
Borrow the depth principle, not assets or obsolete implementation details.
Implementation uses [Chrome's current timeline documentation](https://developer.chrome.com/docs/css-ui/scroll-driven-animations),
[MDN IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
and [W3C motion guidance](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions).
This is a design interpretation, not eye-tracking or participant usability research.

Context7 was consulted for Astro earlier in this work. It returned an obsolete
pre-v1 upgrade snippet; that example was discarded. Bundling was checked against
[current Astro script documentation](https://docs.astro.build/en/guides/client-side-scripts/)
and installed Astro 7.4.4. Keep `animation-timeline` separate with its own priority:
otherwise the CSS minifier folds it into browser-rejected animation shorthand.
Verify real transform changes in production output, not just source declarations.

Test actual depth separation, native Back/anchors, header clearance, keyboard
focus, English/Hebrew, RTL, narrow layouts, reduced motion, disabled JavaScript,
strict CSP and automated accessibility. Visual-review and red/green evidence is
recorded in [test evidence](test-evidence.md). No physical-device, screen-reader
or eye-tracking verification is claimed.

## Tall-phone research focus

At phone widths with at least 700px of viewport height and normal motion, the
research illustration stays above the topic text. Its bounded height leaves a
separate reading area below the graphic. IntersectionObserver uses pixel margins
computed from the actual illustration/header height; it updates after resizing or
a motion-preference change. Active symbols crossfade and gently scale into focus.
Short/landscape screens and reduced motion use a compact natural flow instead.
The headings remain visible rather than sliding beneath the pinned illustration.
