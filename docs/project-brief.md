# Confirmed project direction

Updated 2026-10-31 following the owner's discovery and content-scope answers. This supersedes the
personal-hub recommendation and tentative audience priorities in `discovery.md`.

## Decisions

- Identity: Tali Cukierman-Yaffe's research group and projects.
- Languages: English and Hebrew at launch; full RTL support, not a translated overlay.
- Main outcome: increase awareness and appropriate study enquiries/referrals from
  patients, caregivers, clinicians, and academic collaborators.
- Maintenance: agent-assisted content edits through tested pull requests.
- Public GitHub repository: `reakwind/tali-cukierman-yaffe`.
- Stack: proceed with the lean static Astro/TypeScript/CSS recommendation.
- Content: no current CV or approved portraits/team photos are available. Draft from
  attributed public sources, improve iteratively, and mark content pending review.
- 6 Vital: the owner describes it as a platform Tali created. Give it a dedicated
  page under Research, not the website's main identity or a major commercial section.
- Registration: no approved route has been supplied; a solution is needed. Plan it
  separately, with no health-data collection or pretend successful submission.
- Tooling: owner approved installing Node.js LTS and GitHub CLI using Homebrew.
- No new paid services or account upgrades.
- Later decision: continue application development locally rather than grant the
  additional GitHub workflow scope. Keep CI publishing, feature PRs, and merges
  pending; do not work around that boundary.

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
  the research overview and curated content. Existing draft references in the
  application need removal in a subsequent approved content change.
- Include talks/media and news/updates. Select real items rather than inventing
  an announcement schedule or filling empty pages.
- A research coordinator will handle enquiries. The named coordinator/shared
  channel and institution-approved workflow remain unresolved.
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

Keep navigation short and consistent. Information should remain discoverable by
topic; visitors should not have to identify themselves before seeing the site.

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
- GitHub workflow publishing authorization and actual remote CI/PR verification
  (initial login and repository protections are already in place).
- Cloudflare account access and deployment choice; optional domain and code license.
- Real-device/manual accessibility checks and final production smoke testing.
