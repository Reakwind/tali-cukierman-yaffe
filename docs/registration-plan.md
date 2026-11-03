# Participant enquiries and professional contact

Status 2026-11-03: the published prototype has no form. Contact offers the
Diabetes 360 program's email and phone until the form below is built, tested
and approved (owner, 2026-11-03).

Updated 2026-11-01 from the owner's instructions. The minimal contact-form
direction supersedes the earlier institution-managed registry proposal for this
informational website. Account setup and deployment have not happened.

## Confirmed behavior

- BIRAX and STAY-STRONG are actively recruiting, confirmed by the owner on
  2026-11-01. Store this separately from dated registry metadata.
- The continuous homepage has one shared participant form in its final section.
  Visitors can express general research interest without choosing a study.
  Existing study URLs retain contextual forms for direct/bookmarked visits.
- Collect an optional first name and one phone number or email address. Send
  these details, general interest or study name, and page language to all four recipients:
  `reakwind@gmail.com`, `hagarshimon@gmail.com`, `yasminshtig@gmail.com`, and
  `tcukierm@gmail.com`.
- Student and collaborator CTAs open an empty `mailto:tcukierm@gmail.com` draft.
  Do not prefill the visitor's subject or message.
- Public participation copy is informational and inviting, without legal or
  consent language. Consent procedures are not a website feature.
- Other studies remain discoverable as research and results, without public
  completion badges or participant invitations. Keep truthful lifecycle metadata
  internally so a completed trial cannot accidentally offer recruitment.

## Technical design

Use the existing Astro static build on Cloudflare Workers Static Assets and one
Worker endpoint for form submissions. The Worker uses Cloudflare's native email
binding with the four-recipient allowlist. Turnstile is verified server-side.
See [the stack recommendation](architecture.md) for primary sources and setup order.

The form has no medical questions, file uploads, eligibility scoring or free-text
history. The site has no participant database, accounts, browser storage, contact
tracking or GitHub submissions. Messages go to the team's email inboxes. Do not
log form fields, include them in URLs, or echo provider errors to visitors.

The endpoint checks request origin, method, body size, permitted fields, contact
format, study identity and verification. Recipients cannot be set by the browser.
Success is shown only after the email service accepts the message. Errors keep
the entered details on screen and allow retry. An email alternative is available.

## Current state

The bilingual form, Worker and configuration are prepared locally. Delivery is
explicitly disabled in `wrangler.jsonc`. No email was sent to the recipients;
tests use dummy details and mocked delivery. Native local runtime and dry-run
validation do not establish that recipients or a domain are configured.

Before enabling the route, choose the Cloudflare-managed domain and sender,
verify all four destinations, set the Turnstile site key and secret, deploy a
preview, and carry out an authorized delivery test. Account permissions, DNS,
billing, GitHub publishing and public launch remain separate decisions.
