# Participant enquiries and clinician referrals

Status: design proposal only. No live form, database, or registration service exists.

## Recommendation

Use the static public website for discovery and understandable study information.
Send an interested visitor to a research-institution-managed, approved enquiry
system, for example an existing REDCap survey if Sheba provides one for this
purpose. Confirm availability and cost with the institution; neither is assumed.

This avoids building and maintaining a clinical-data backend on a free hosting
account. REDCap is a candidate established research system, not an assurance that
any installation or form is automatically compliant or approved.

If no institutional system is available, return to the owner with options before
introducing any service. Do not silently substitute Google Forms, Formspree, email,
Cloudflare D1, or another generic database for an approved recruitment workflow.
Contact details plus interest in a particular study can themselves be sensitive.

## Proposed journey

1. Study page explains the research in plain language and identifies the sponsor,
   location, dated status, practical commitment, source, and team-review status.
2. An approved call to action says "Ask about participation", not "You qualify"
   or "Enroll now". Closed studies never offer participant registration.
3. Before leaving, explain who receives the information, why, and that an enquiry
   is not eligibility confirmation, informed consent, enrollment, or a promise of
   benefit. The study team conducts approved screening/consent separately.
4. An approved, accessible English/Hebrew form collects only necessary information.
5. The destination gives a real submission confirmation and a realistic follow-up
   expectation approved by the coordinator. Do not invent response-time promises.

Until this is approved, show an honest "Enquiries are not available on this draft"
state with an official registry/institutional information link. Do not display
dead submit buttons or show a fake success message.

## Candidate enquiry fields for institutional review

- First name, only if necessary.
- One preferred contact method: email OR telephone, not both by default.
- Preferred communication language.
- The study of interest, only if approved as necessary.
- An explicit acknowledgement/permission to be contacted about this enquiry,
  with separate, versioned privacy wording. No prechecked consent.

Avoid dates of birth, national IDs, diagnoses, medication lists, free-text medical
histories, documents, and third-party patient details. Do not add a screening
questionnaire or a general future-study mailing list without specific approval.
Do not conflate permission to respond with consent to future marketing/research.

## Clinician route

- Offer a readable study page and official source that can be shared with patients.
- Explain broad research criteria without providing an eligibility decision.
- Ask clinicians to obtain the patient's permission and use their institution's
  approved referral channel. Do not accept patient files or names on this site.
- Provide an approved professional contact/secure channel once supplied; a public
  telephone/email in a registry is not automatically an approved referral workflow.

## Decisions required before activation

- Responsible institution/data controller and coordinator.
- Approval of recruitment advertising, translated wording, and contact permission
  by the research team and relevant institutional/ethics/privacy staff.
- Approved data host/region, processor agreement if required, retention/deletion,
  access roles, multi-factor authentication, auditability, and incident handling.
- Whether anonymous enquiries are possible and what minimum identifiers are needed.
- How the coordinator handles access, withdrawal, correction, and deletion requests.
- A genuine accessible alternative contact route.
- How study closure or changed availability disables the enquiry action promptly.

No claim of HIPAA/GDPR/Israeli-law compliance should be made by the coding agent.
The appropriate institution must assess the actual workflow and jurisdiction.

## Technical guardrails and tests

- Keep the public website free of submission endpoints, cookies, trackers,
  embedded registration iframes, and health data in browser storage.
- Never send enquiry or health data in URLs, analytics events, GitHub issues,
  build logs, or error reporting. Link to the approved form without patient data.
- Default recruitment configuration is disabled. Require a reviewed destination,
  current study status, and explicit approval before enabling a live CTA.
- Validate destination URLs, use HTTPS, and review any external domain change.
- Test pending/closed/stale states, both languages, keyboard/mobile/RTL access,
  privacy explanation, external handoff, and absence of fake submissions.
- Automated tests must never send real participant information or submissions.
- Recheck the actual destination and the study team's current availability at
  launch and on a documented schedule, not just when code changes.

## Sources

- https://me.health.gov.il/en/older-adult/services-rights/living-with-a-condition/treatments/clinical-trials/
- https://www.gov.il/he/pages/protocol-of-medical-research-involving-human-subjects
- REDCap background (availability is institution-specific):
  https://catalyst.harvard.edu/redcap/

## Cost boundary

The static website can fit Cloudflare's free hosting tier. That does not establish
that an approved recruitment system will be available for free. Confirm an
existing institutional option first; do not purchase or activate a paid service.
