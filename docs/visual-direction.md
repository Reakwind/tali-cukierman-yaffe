# Visual communication and deeper parallax

Owner direction, 2026-11-01. This supersedes the earlier muted color and small
diagram-drift direction. Local review only; no publication or account changes.

## Six parts and communication budget

Keep title/menu, hero, research areas, current studies, shared participation,
then footer. Use the requested 40% text / 60% visual meaning as an editorial
constraint, not a scientifically measurable percentage of understanding.
Every primary message must have a meaningful visual representation. Use a
roughly 36/64 copy/illustration split on wide screens, concise supporting copy,
and a visual-first reading sequence on phones. Empty colored space does not
count as an explanation.

| Part          | Meaning carried visually                                                         | Text needed                                                   |
| ------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Menu          | Active location, consistent section colors                                       | Short destinations                                            |
| Hero          | Sensor, injection pen and assessment symbols in one layered scene                | Group identity and research focus                             |
| Research      | Large topic illustrations and scroll-driven visual focus                         | One short explanation per area; evidence labels               |
| Studies       | BIRAX assessment domains, STAY-STRONG two-arm protocol and actual visit timeline | Population, short procedure captions, unknown visit details   |
| Participation | Contact → team conversation → study information                                  | Field labels and the next step                                |
| Footer        | Real portraits, publication topic icons, keyboard/language/contact icons         | Names, roles, publication metadata and brief site information |

Preserve essential study burdens, optional procedures, source dates and truthful
evidence types. Remove duplicated summaries, long introductory prose and
editorial process notes from the main story. Keep authoritative source records
and deep URLs, without making the main visitor journey depend on them.

## Design plan

- Palette: paper #ffffff, ink #243b45, teal #17686a, pastel teal #d7efe9,
  magenta #94315f and pastel magenta #f5d9e7. Dark text carries readable labels;
  pale fills stay inside illustrations and protocol diagrams.
- Type: existing Lexend and Plex Hebrew, with real RTL composition. Short,
  specific headings; no new slogans, gradient text, stock people or fake data.
- Hero: a wide SVG illustration with distinct background, subject and foreground
  layers. Device forms and assessment symbols explain the research tools.
- Research: one sustained visual scene beside short sequential topic steps.
- Studies: two visual study explanations, followed by one shared contact form.
- Graphics: editable, flat SVG paths with a consistent stroke and pastel fills.
  Use the lab's research tools as the subject; avoid glossy 3D decoration.

  sticky title / menu
  hero copy 36% | layered diabetes scene 64%
  topic steps | sustained research illustration
  visual study protocols and visit timeline
  contact explanation | one form
  portraits / outputs / brief site information

## Research and motion

Inspected the live [Firewatch](https://www.firewatchgame.com/) site at 1440×1000,
including screenshots before/after a 600px wheel scroll. Its eight layers moved
by approximately 12–414px. The useful principle is sustained, substantially
different layer travel, not small movement of a single image. Its artwork,
branding and implementation are not reused.

Also read [Keith Clark's original layered CSS demonstration](https://keithclark.co.uk/articles/pure-css-parallax-websites/)
and [Chrome's current scroll-driven animation documentation](https://developer.chrome.com/docs/css-ui/scroll-driven-animations).
The older perspective technique is a reference for depth; current native view
timelines are the preferred implementation. The web.dev performant-parallax URL
was unavailable through the web reader and is not treated as an inspected source.

Use multiple layers with clearly different travel, a bounded sticky hero scene,
and a sustained research visual. Keep native wheel/touch/history. Use native CSS
timelines where supported, with a small requestAnimationFrame/WAAPI fallback for
other engines. The fallback updates only visible scenes, at most once per frame.
Reduced motion removes both depth movement and unnecessary sticky travel. All
content stays visible without animation or JavaScript.

This is a design interpretation of those examples, not eye-tracking research.
Verify actual layer displacement, content order, contrast, CSP, mobile/RTL,
native anchors/Back, reduced motion and disabled JavaScript in the rendered site.

## Art correction after owner review

The owner rejected the first SVG drawings. Remove every SVG person and anatomical
part, including the brain, arm, balance figure and scan silhouette. Keep cleared
real team photographs; use typographic initials for missing portraits.

The revised hero is a geometric composition of a glucose-sensor disc, insulin
pen, measurement grid and connected signal paths. Research uses a symbol matrix,
a dumbbell, a balance instrument and devices. All are original code-native shapes;
there are no invented patient readings, scores or device endorsements. No new
subscription, asset purchase, image-generation API or runtime service is needed.

Read [Anthropic's frontend guidance](https://claude.com/resources/articles/improving-frontend-design-through-skills):
its practical advice is to give the model a precise visual vocabulary that maps
to code. This supports using repeatable geometry and coordinated motion here;
it is not evidence that a model can produce convincing anatomical drawings.
Read [Lucide's design language](https://lucide.dev/contribute/icons/design-principles)
and [specification](https://lucide.dev/contribute/icons/specification) for a shared
grid, balanced visual weight, low detail density and smooth curves. These guide
our original pictograms; no Lucide asset or dependency is included.
Read [MDN's SVG pattern API](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorials/SVG_from_scratch/Patterns)
for reusable grids and explicit user-space units. An initially guessed Lucide URL
returned 404; the working guidance above was reached through its official site.
Carbon's pictogram guide was unavailable to the web reader and is not relied on.

Critique before implementation: a collection of floating outline stickers would
retain the rejected feel. Use one integrated device-and-signal hero, shared stroke
weights and broad solid-color shapes. Keep small icons as wayfinding and protocol
explanations rather than enlarging them into the main artwork.

## White canvas and motion refinement — owner review

The owner accepted the geometric art as the promising direction and requested
refinement, white backgrounds and color carried by graphics/elements. Keep the
existing six-part reading order, all factual copy, and the non-anatomical subjects.

Plan: pure white page/header/section/form surfaces; magenta/teal remain in the
illustrations, protocol arms, controls and fine structural details. Refine the
hero's sensor rim, pen and symbol-sheet spacing rather than introduce new art.
Keep strong depth travel, add small counter-rotations to the foreground objects,
and let the signal path resolve as the hero is scrolled. Research uses a smoother
focus change; on tall phones hold the graphic above the current topic, with a
reading area that keeps headings clear. Short landscape screens and reduced
motion use normal flow. Scrolling backward must restore the earlier composition.

Critique: more autonomous floating and more animation on every element would
weaken the hierarchy. Keep motion tied to scroll and the research topic change;
leave data values, prose, links and fields stable. White space should connect the
chapters; color stays local to meaningful diagrams and navigation details.

Rechecked MDN's current animation-timeline and KeyframeEffect documentation for
native timelines and computed keyframes. Keep the existing native CSS path and
small WAAPI fallback; no new dependency or paid service is justified.
