# Website stack and participant enquiries

Recommendation and local implementation, 2026-11-01. No Cloudflare account,
email destinations, domain, or DNS configuration has been connected or changed.

## Recommended stack

| Layer                        | Choice                                                        | Purpose                                                            |
| ---------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------ |
| Website                      | Existing Astro, TypeScript, plain CSS, bilingual JSON content | Static English/Hebrew pages, research, team and publications.      |
| Hosting                      | Cloudflare Workers Static Assets                              | Serve the generated `dist/` site and the small API in one project. |
| Participant enquiries        | One TypeScript Worker endpoint, `POST /api/participation`     | Validate the contact form and request an email notification.       |
| Delivery                     | Cloudflare `send_email` binding                               | Notify the four fixed, verified team addresses.                    |
| Spam protection              | Cloudflare Turnstile                                          | Check the submission on the server before sending.                 |
| Student/collaborator contact | Plain `mailto:tcukierm@gmail.com` links                       | Open an empty email for the visitor to write.                      |

The participant journey is: study information → shared contact form → Worker validates the
request and Turnstile token → Cloudflare accepts the email for the four recipients
→ the website shows confirmation. It does not claim delivery before the email
service has accepted the request.

The latest homepage is a continuous reading page. Its menu uses fragment links,
and its single participant form accepts general research interest. Existing deep
URLs still work. Optional native CSS parallax and a small IntersectionObserver
controller add orientation and heading emphasis; all content remains static HTML.

This adds no database, accounts, CMS, React, submission dashboard or clinical-data
workflow. Email inboxes are the team's enquiry workflow. A database would only be
justified by a later need such as assignment, follow-up status or reporting.

## What Email Routing provides

Email Routing handles incoming mail/forwarding; the website still needs an HTTP
endpoint to receive form submissions. Cloudflare's native Worker email binding
provides that endpoint's sending capability. Current documentation says sending
to verified destination addresses is free on all plans, including accounts with
only Email Routing configured. We use that fixed-recipient case and do not need
arbitrary visitor-email sending or a paid email provider.

Each enquiry goes to:

- `reakwind@gmail.com`
- `hagarshimon@gmail.com`
- `yasminshtig@gmail.com`
- `tcukierm@gmail.com`

Recipients are fixed in the Worker and restricted again in the binding. The
browser cannot choose different recipients. The sender will be an address on
the chosen Cloudflare-managed domain; it will not impersonate a Gmail address.
When a visitor supplies an email address it becomes Reply-To. A telephone contact
is included in the message body.

## Form and copy

The owner requested a practical informational website with CTAs, without legal
or consent language in the participation flow. The form has an optional first
name and one required phone number or email address. Study and language are
supplied by the page. It has no medical questionnaire, free-text history, file
upload, eligibility scoring or website consent step.

The Worker checks origin, method, field names, contact format, study selection,
body size, and Turnstile. It does not log contact fields, write them to browser
storage, GitHub or a database. The receiving email services handle the messages.
On failure the form keeps the visitor's entered details and offers retry/email.

## Local state and validation

- `worker/index.ts` implements the API and static-asset fallback.
- `wrangler.astro.jsonc` (the earlier Astro draft, not the published site)
  defines the assets, endpoint routing, fixed email allowlist,
  and **disabled** email sending. No sender/domain/secret is invented.
- `PUBLIC_TURNSTILE_SITE_KEY` is public build configuration; the secret key is
  a Worker secret. Templates contain no working credentials.
- `npm run dev:worker` builds Astro and starts the full local Cloudflare runtime.
  `npm run check:worker` bundles/validates without deploying.
- Wrangler is pinned at 4.156.0. Compatibility is pinned to 2026-10-30, the latest
  date supported by that bundled local runtime. No existing dependency version
  was changed when adding the CLI.
- Unit and browser form tests use dummy contact details and mocked sending.
  Nothing was sent to the team. The real integration remains to be checked in
  the owner's account.

## Setup order when connecting the account

1. Choose the existing Cloudflare-managed domain and sender address. Review the
   required email DNS records before applying any change.
2. Configure the domain's email service and verify all four destination addresses.
3. Create a Turnstile widget for the website hostname. Set its public site key
   in the Astro build and its secret key on the Worker.
4. Set `EMAIL_FROM`; deploy a preview with `ENQUIRIES_ENABLED=false`. Check real
   headers, both languages, form errors and routes on the hosted preview.
5. Perform an explicitly authorized delivery test with the team and verify all
   four inboxes. Enable sending once the complete route works, then run the final
   website review before public launch.

No account-wide billing, DNS, permissions, paid plan, GitHub publishing or public
deployment is authorized by this local preparation. Domain costs are a separate
decision; owning a Cloudflare account does not establish that a domain is free.

## Primary references

Checked 2026-11-01. Context7 was consulted and cross-checked against installed
Wrangler and primary documentation.

- [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Static asset billing](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)
- [Workers Free request limits](https://developers.cloudflare.com/workers/platform/pricing/)
- [Worker email API, including structured messages and multiple recipients](https://developers.cloudflare.com/email-service/api/send-emails/workers-api/)
- [Email binding restrictions](https://developers.cloudflare.com/email-service/configuration/send-bindings/)
- [Verified-destination pricing](https://developers.cloudflare.com/email-service/platform/pricing/)
- [Email domain setup](https://developers.cloudflare.com/email-service/get-started/send-emails/)
- [Turnstile server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Turnstile free plan](https://developers.cloudflare.com/turnstile/plans/)
