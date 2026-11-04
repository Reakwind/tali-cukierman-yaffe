# Confirmed project direction

Updated 2026-10-31 following the owner's discovery and content-scope answers. This supersedes the
personal-hub recommendation and tentative audience priorities in `discovery.md`.

## Decisions — 2026-11-03

These supersede conflicting points below.

- Images (2026-11-03): Sheba logo cropped from the Sheba letterhead (Hebrew
  only; an English version is wanted), TAU logo supplied by the owner, DSST
  screen from the group's DSST validation poster. Logo use needs a check with
  each institution's communications office before launch. Hagar and Yasmin agreed
  to publish their photos from the team's Drive (owner, 2026-11-03).
- No duplicate places (owner, 2026-11-03): each ongoing study is named in one
  place only, the Ongoing studies section. The first screen has no study
  shortcut, Research has no study markers and the contact form has no study
  field (owner, 2026-11-03); all three repeated that section and broke the
  flow. The form asks only for an optional first name and a phone or email.
  Publications link to papers. Affiliations appear once, as logos in About.
  Privacy and Accessibility pages are needed before launch; until they exist
  the footer has no links.
- Colour (owner chose "one bold colour", version B, 2026-11-03): palette from
  the Sheba logo. Navy #232350 for text, teal #0a6e5d for links and buttons
  only, neutral grey panels. The logo pink #e83880 marks ongoing studies only,
  on large type (study names, the Ongoing studies title) and their rules. No
  pink fills or bands.
- Typography (owner chose direction B, 2026-11-03): Frank Ruhl Libre for the
  story (page heading, section titles, Research opening, area names), IBM Plex
  Sans for details, IBM Plex Mono for records (years, citations, study
  details). One named type scale; nothing below 14px. Frank Ruhl Libre and IBM
  Plex Sans Hebrew cover Hebrew; mono is used only for Latin and numbers. Self-
  host the fonts for launch instead of loading them from Google.
- No icons (owner, 2026-11-03): text, typography and colour carry the hierarchy.
  Expert guidance (NHS, ONS, Nielsen Norman Group) supports icons only where
  testing shows a gap; an arrow on the participation links is the one candidate
  to test with users later.
- Layout (owner, 2026-11-03): one spacing scale where the gap grows with the
  change of level (heading to text 12px, between items 32px, between blocks
  48px, between sections 80–128px). The first screen alone spans the full width;
  sections keep a title column, which stacks above the content below 1000px.
  Phone margin 20px. Checked by tests/e2e/prototype-layout.spec.ts.
- Hero (owner chose "Quiet", option 3, 2026-11-03): the first screen is the
  heading "We study healthy aging with diabetes." beside a watercolour
  painting; the rest of the About sentence is no longer on the first screen
  (it added too little to justify the space). The painting is an abstract
  course through life, a lens at the moment of early detection and the path
  that follows, adapted from the owner's own SVG draft into the Sheba navy,
  teal and pink. It is decorative (hidden from screen readers) and inline SVG.
  Beside the heading from 1001px; full width under it on tablets and phones.
- Scroll (owner chose option C, 2026-11-03): a reading line under the header,
  section titles that stay with their section on desktop, and drawings that
  arrive once (the hero painting on load, rules and the app screenshot as they
  arrive). Text never moves. Details in docs/scrolling-plan.md.
- Hebrew (2026-11-03): prototype/he.html holds only the Hebrew words; the build
  takes fonts, styles, painting, script and the publication list from the
  English page. Same section ids, so the language link opens the other page at
  the section being read. Right-to-left layout, Hebrew faces first, and
  identifiers such as study names kept left to right. The painting is not
  mirrored, and publications stay in English as a left-to-right block (owner,
  2026-11-03). Mixed Hebrew and English is checked to stay inside its column
  from 360px to 1440px. The copy is a draft translation that needs review by a
  Hebrew-speaking team member; team names and roles reuse the site's existing
  Hebrew. Rewritten 2026-11-04 as native Hebrew rather than a word-for-word
  translation: "אנשים מבוגרים" for older adults ("מבוגרים" alone means
  adults), "מבחן סימן מספר קידוד (DSST)" (owner, 2026-11-04) for the Digit Symbol Substitution
  Test, "תחומי מחקר" for Research so it does not sit beside "מחקרים" in the
  menu, and "מחקרים פעילים" for Ongoing studies. Open: the Hebrew group name
  (draft "קבוצת המחקר ״סוכרת 360״"), the Hebrew names of the Center for
  Successful Aging with Diabetes and of Sheba's endocrinology division, and a
  native speaker's review of the whole page.
- Publishing (owner, 2026-11-03): the two prototype pages go to Cloudflare as
  static files only, at https://diabetes-360.reakwind.workers.dev/ (Worker
  `diabetes-360`, connected through Cloudflare's Git import). The repository's
  defaults publish them: `npm run build` builds `dist/site`, and the root
  `wrangler.json` builds before every `wrangler deploy`. The owner's first
  import published the old Astro draft because the defaults then pointed to
  it. The draft was retired on 2026-11-04 (recover from commit `d3e5b5b`).
  No form until a working, approved destination exists: Contact offers the D360
  email and phone, because a form that only shows "thank you" would lose real
  enquiries. Hidden from search (robots meta tag and `X-Robots-Tag` header)
  until the team approves launch. Address: the free workers.dev address for
  now, not a personal domain. A group or institutional domain for the public
  launch is still open.
- The English copy is settled (owner, 2026-11-03). Work continues on the
  English design until it is done, then the Hebrew version; launch still ships
  both languages.

- Name: **Diabetes 360 Research Group**. Prof. Tali Cukierman-Yaffe is the
  principal investigator and leads the Team section; she is not introduced in
  the opening.
- About copy (owner's text): "We study healthy aging with diabetes. Our research
  aims to better understand cognitive function, frailty and the use of diabetes
  technologies among older adults, with a strong focus on early detection and
  prevention."
- One page in an information pyramid: About -> Research -> Ongoing studies ->
  Publications, then Team, Contact and footer. Menu: Research, Studies,
  Publications, Team, Contact.
- Studies appear as "Ongoing studies" with no recruitment status or timelines.
  GRACE-780G (completed) appears only through its publication.
- Contact: one route for participants and clinicians (two-field form, or the
  Diabetes 360 program's email D360@sheba.health.gov.il as a link and its phone
  03-5307493, option 8), and "For collaboration opportunities and prospective
  students, email Prof. Cukierman-Yaffe" as a link. No "taking part is
  voluntary" line. The program contact replaces the four personal inboxes for
  enquiries (owner, 2026-11-03; source: Tali's 2024 Maccabi dietitians deck).
- 6 Vital closes Research under "How we measure", not as a map stop: the
  group's own platform for running studies and remote measurement (phone app
  with movement sensors and the digital DSST; machine-learning models with
  collaborators). The researchers' back office is not linked or described.
  It links to https://6-vital.com/, whose "Get in Touch" button was a
  placeholder link when checked on 2026-11-03.
- Research copy is drawn from Tali's presentations (2021 stakeholder lecture,
  2024 Diabetes 360 program deck, 2024 cognitive-function and Maccabi lectures).
  It states the group's approach and methods, not findings or statistics:
  findings belong to Publications (owner, 2026-11-03).
- Research names the Center for Successful Aging with Diabetes (Division of
  Endocrinology & Metabolism, Sheba Medical Center), whose pillars are clinical
  care in the Diabetes 360 clinic for ages 60+, training and research (owner
  approved, 2026-11-03).

## Decisions

- Identity: Tali Cukierman-Yaffe's research group and projects.
- Languages: English and Hebrew at launch; full RTL support, not a translated overlay.
- Main outcome: increase awareness and appropriate study enquiries/referrals from
  patients, caregivers, clinicians, and academic collaborators.
- Maintenance: agent-assisted content edits through tested pull requests.
- Public GitHub repository: `reakwind/tali-cukierman-yaffe`.
- Stack: proceed with the lean static Astro/TypeScript/CSS recommendation.
  Update 2026-11-04: the published site is the static prototype built by
  small Node scripts; the unpublished Astro draft was retired (commit
  `d3e5b5b` holds it). Porting the prototype into a component structure stays
  an option for the owner to decide.
- Content: no current CV or approved portraits/team photos are available. Draft from
  attributed public sources, improve iteratively, and mark content pending review.
- 6 Vital: the owner describes it as a platform Tali created. Give it a dedicated
  page under Research, not the website's main identity or a major commercial section.
- Participant enquiries: on 2026-11-01 the owner requested an optional first name
  and one phone/email contact, sent to the four specified team inboxes. Prepare
  Cloudflare Worker delivery; account/domain setup is still pending. No medical
  intake, website consent flow or pretend successful submission.
- Tooling: owner approved installing Node.js LTS and GitHub CLI using Homebrew.
- No new paid services or account upgrades.
- Superseded 2026-11-02: CI now runs from `.github/workflows/ci.yml` at the
  owner's request. The owner chose to keep it because GitHub Actions standard
  runners are free for this public repository; Codex reviews PRs in addition.
- Owner removed the visible "Website draft" banner on 2026-10-31. The site stays
  noindex/nofollow and content remains unreviewed; this is not launch approval.

## Design revision agreed with the owner

The initial draft was rejected as amateurish and generic. The owner selected
Sarvestani Lab and Ranade Lab as the closest references:

- https://www.sarvestanilab.com/
- https://www.ranadelab.org/

Use their independent lab identity, clear navigation, sans-serif typography,
spacing, and purposeful visual material as principles—not copied assets.
Prefer white, dark slate, and restrained pale cyan over the rejected green/serif
wellness treatment. Keep page and section headings factual, with study discovery
and clinician referrals ahead of decorative storytelling.

Explicitly avoid the formulaic traits discussed with the owner: glowing or
gradient hero treatments, floating glossy 3D objects, pill-button pairs, invented
catchphrases, arbitrary statistics, and repeated generic card grids. A scientific
illustration must describe an actual research method or question and must not
pretend to be study data, a validated test, or an actual participant portrait.

The owner accepted the revised draft as a much better direction, not as ready for
production. Visual/application development is paused while content and its
organization are agreed. Existing study data, disabled enquiry routes, and
local-only publishing remain unchanged. Cleared real photography can be added
later; do not fabricate it.

## Confirmed launch content scope

- Begin with three studies/projects: STAY-STRONG, BIRAX, and GRACE-780G. The owner
  confirmed (2026-10-31) that **GRACE-780G** is the official study name to showcase;
  it is the completed MiniMed 780G trial, `NCT06236256`.
- Core team supplied by the owner:
  - Prof. Tali Cukierman-Yaffe.
  - Dr. Naama Peltz-Sinvani — endocrinologist; head of the Sheba division's
    Clinical Research Unit per the Sheba Division's own post.
  - Hagar Shimon — research coordinator and PhD candidate.
  - Yasmin Alt — research coordinator.
  - Tal Yahalom — PhD candidate; official Cuenca sources use "Tal Yahalom-Peri".
  - Itay Cohen — MSc student; official Cuenca bio/photo found.
- Preferred English/Hebrew names, credentials, biographies, and photos still need
  review. Do not add publication coauthors to the core team automatically.
- Women's endocrinology and pregnancy are outside this site's scope, including
  the research overview and curated content. Draft references were removed from
  the application in the 2026-10-31 team-profile change.
- Include talks/media and news/updates. Select real items rather than inventing
  an announcement schedule or filling empty pages.
- Participant enquiries go to Itay, Hagar, Yasmin and Tali at the exact addresses
  supplied on 2026-11-01; student/collaborator links open Tali's blank email draft.
- Give visitors the essential information on the site. The owner removed the
  team page's "Sources & further reading" section on 2026-11-01; retain source
  provenance in editorial docs rather than restoring that public section.
- Each copy block should provide useful information or help visitors take a
  relevant next step. The homepage's closing section now offers direct contact
  for collaboration and graduate research; avoid generic team-description filler.
- The owner will approve factual content. This does not replace institutional
  recruitment/privacy approval or review of the English/Hebrew wording.
- Research findings, proposed page organization, and the material-request checklist
  are recorded in [the content plan](content-plan.md). Its proposed navigation is
  not yet approved or implemented.

## Updated journeys

1. Potential participant/caregiver: understand the research -> inspect a study's
   purpose, location, participation burden, and current information -> review
   what an enquiry means -> use an approved enquiry route once available.
2. Referring clinician: find the relevant study -> inspect source eligibility and
   status -> understand the referral process -> give the patient a shareable
   study link or use the institution-approved referral channel. Never upload
   patient details to this public website or GitHub.
3. Academic collaborator: research theme -> related studies and publications ->
   group/affiliation information -> appropriate collaboration contact.
4. Prospective student: research fit -> methods and selected publications ->
   approved opportunities/contact information when supplied.
5. Industry/investor: digital-health work -> evidence and limitations -> 6 Vital
   or another appropriate institutional channel. Secondary to recruitment.

### Primary recruitment personas (provisional)

- **Potential participant or caregiver:** may be browsing on a phone and be new
  to research terminology. Needs readable, non-promotional explanations of the
  purpose, location, commitment, risks/limitations, and next step. Main barriers
  are jargon, unclear status, a burdensome form, or an implied promise of benefit.
  The site should support learning without forcing disclosure or commitment.
- **Referring clinician:** time-constrained and needs a credible source quickly.
  Needs a dated registry link, broad population description plus full source
  criteria, site-specific status, practical commitment, and an approved referral
  channel. Main barriers are stale recruitment badges and uncertainty about where
  patient details would go. Shareable deep links should work in either language.
- **Academic colleague:** needs scientific overlap, methods, publications, and
  the correct institutional context. Source-based summaries and direct publication
  links are more useful than promotional claims or unexplained affiliation lists.

These remain desk-research hypotheses, not claims that interviews or usability
sessions with actual patients/clinicians have taken place.

## Proposed structure for content review

- Home, with a prominent "Explore studies" action and a clinician/referral route.
- Studies, with readable detail pages and distinct registry-recruiting/completed
  states. No unapproved "Register now" button.
- Research, including cognition, physical function, diabetes technology, and a
  dedicated 6 Vital page.
- The team, including Tali's biography and the owner-supplied roster.
- Selected publications, DOI links, and institutional full-publication profile.
- News and media, including approved talks, interviews, presentations, and updates.
- Contact/referrals, clinician guidance, participation information, privacy, and
  accessibility remain directly discoverable support pages, not duplicated studies.

The content plan proposes five main destinations: Studies, Research, Team,
Publications, and News & media, with visible Contact and clinician shortcuts.
Review that organization before changing the current header or routes.

### Content iteration — 2026-11-01

The owner asked to continue with content and copy, focusing on BIRAX, STAY-STRONG,
and the MiniMed 780G study (GRACE-780G). The owner confirmed that BIRAX is the
Steve Bain/Swansea physical-capacity project co-funded by Diabetes UK for
2024–2027. The owner subsequently confirmed active recruitment for both BIRAX
and STAY-STRONG. BIRAX's detailed participant procedures still need to be supplied.

The local bilingual draft now gives all three a study/project page and homepage
visibility, and connects them to sourced outputs and achievements. This resumes
content implementation within the established design and navigation. It is not
approval to launch or expand the visual/application direction. See the
[study-content review](drafts/study-content.md) for sources, wording decisions,
and the exact remaining factual gaps. All content still needs review.

The next owner direction removes public completion labels for other studies and
legal/consent copy from participation flows, and adds a minimal contact form.
The local draft now prepares Cloudflare-native delivery without connecting the
account or enabling sending. See [the architecture](architecture.md) and the
updated [enquiry plan](registration-plan.md).

Keep navigation short and consistent. Information should remain discoverable by
topic; visitors should not have to identify themselves before seeing the site.

### Continuous page and scroll hierarchy — 2026-11-01

The owner's latest order supersedes the earlier study-first homepage proposal:
sticky title/menu, hero, research areas, current studies, then one shared
participation section. All core information is readable by scrolling. Menu
shortcuts jump to sections rather than requiring a new page.

Publications sit within the research section, clinician information within the
study section, and team/professional contact within the final contact section.
Website information remains in the footer. Existing deep URLs are preserved for
bookmarks. The shared enquiry accepts general interest without choosing a study.

Use restrained parallax on research diagrams, stable reading text and form
controls, sticky section context on wide screens, and an active menu location.
Keep native scrolling/history, keyboard focus, no-JavaScript access and reduced
motion. The diagrams explain research categories; they contain no study data or
invented measurements. See [the researched scroll plan](scrolling-plan.md).

## New source checks

- `https://6vital.com` did not return usable content during the session.
  `https://6-vital.com/` is accessible and describes digital cognitive measurement,
  a caregiver/patient-management system, and a patient app. Confirm the preferred
  canonical platform URL with the team before launch.
- ClinicalTrials.gov `NCT06497595` (STAY-STRONG): registry lists `RECRUITING`,
  last update posted 2026-07-21. This is a dated public listing, not a guarantee
  of current availability or approved website recruitment text.
- ClinicalTrials.gov `NCT06236256` (older-adult hybrid closed-loop study): registry
  lists `COMPLETED`, completion 2025-08-20, last update posted 2026-07-21.
  Third-party search results still describe it as recruiting; do not reuse them.
- Official records read directly:
  - https://clinicaltrials.gov/api/v2/studies/NCT06497595
  - https://clinicaltrials.gov/api/v2/studies/NCT06236256
- Both registry records were rechecked on 2026-10-31. STAY-STRONG's site listing
  distinguishes Sheba (`RECRUITING`) from Hadassah (`NOT_YET_RECRUITING`).
- EASD's GRACE-780G abstract LBA 19 explicitly names `NCT06236256`. Conference
  findings are publicly available even though the registry has no posted results;
  do not describe an abstract as a full trial-results paper. Source and limitations
  are in the content plan.
- Tali's TAU Cuenca biography confirms a BIRAX-funded physical-assessment ML
  project. Diabetes UK describes a likely matching award led in the UK by Steve
  Bain at Swansea, with listed dates October 2024–August 2027. The connection,
  formal protocol, and recruitment status require team confirmation.
- Participant information from Israel's Ministry of Health:
  https://me.health.gov.il/en/older-adult/services-rights/living-with-a-condition/treatments/clinical-trials/
- Ministry procedure (including recruitment-advertising references):
  https://www.gov.il/he/pages/protocol-of-medical-research-involving-human-subjects

## Launch gates still open

- Tali/team approval of the group's name, biography, roles, and English/Hebrew copy.
- Current study/site status, accurate participation burdens, and approved recruitment
  material. Summaries are not a substitute for complete approved eligibility/risk details.
- Recruitment-data controller, approved form/channel, retention, access, privacy
  information, accessibility, and ethics/institutional approval as applicable.
- Approved public contact details; no personal mobile numbers copied automatically.
- Permission-cleared photography and institutional/platform logos.
- Cloudflare account access and deployment choice; optional domain and code license.
- Real-device/manual accessibility checks and final production smoke testing.

## Latest visual direction — 2026-11-01

The owner resumed visual development and requested a continuous, visually led
homepage: title/menu, hero, research areas, current studies, shared participation,
then footer. The earlier paused-visual-work and muted-palette directions above
are superseded for this local draft. Use pastel magenta and teal, substantial
layered parallax, and the 40% text / 60% visual meaning constraint as an editorial
guide. Do not claim that understanding has been quantitatively measured.

The owner then rejected the anatomical SVG illustrations. Do not draw people,
brains, limbs or anatomical scan silhouettes. Use code-native device forms,
measurement instruments, symbol grids, study diagrams and timelines. Keep real
team photography. No added paid service, asset subscription or image API.
See [visual direction](visual-direction.md) and [scroll behavior](scrolling-plan.md).
Source metadata remains in versioned records; content/translations remain drafts.

## White canvas and refinement — 2026-11-01

The owner described the geometric art as a promising direction and requested
further SVG/motion refinement. Keep the website background pure white and let
magenta/teal live in the illustrations, diagrams and selected interface details.
Refine the existing direction rather than replace it. Preserve the non-anatomical
art restriction, six-part structure, bilingual copy, native scrolling, and one
shared participant form. The new tall-phone research composition must reserve
readable space for each topic below its sticky illustration and collapse to
normal flow with reduced motion or a short viewport.
