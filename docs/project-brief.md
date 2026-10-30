# Confirmed project direction

Updated 2026-10-30 following the owner's discovery answers. This supersedes the
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
- 6 Vital: the owner describes it as a platform Tali created. Present it as one
  strand of the group's digital-health work, not as the website's main identity.
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

The next iteration begins with the bilingual homepage and shared visual system.
Existing sourced study data, disabled enquiry routes, and local-only publishing
remain unchanged. Cleared real photography can be added later; do not fabricate it.

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

## Initial structure

- Home, with a prominent "Explore studies" action and a clinician/referral route.
- Studies, with readable detail pages and distinct registry-recruiting/completed
  states. No unapproved "Register now" button.
- Research, including cognition, physical function, and digital-health work.
- About the group, current sourced affiliations, and clinical roles.
- Selected publications, DOI links, and institutional full-publication profile.
- For clinicians/collaborators, participation guidance, privacy, and accessibility.

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
