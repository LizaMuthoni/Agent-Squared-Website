# AgentSq marketing site

A static site served by a Cloudflare Worker, with one backend route for the Request access form.

## What is in this repo

```
site/                  The site: index.html, study/, sample-report/, request-access/, method/ (not in the nav),
                       assets/ (compiled CSS, nav CSS, agent-squared.js). Paths are relative, so it also works
                       from a sub-folder or opened straight from disk.
worker/index.js        Worker entry: serves site/ and routes /api/request-access.
functions/api/         request-access.js: validates the form and emails the team through Resend.
wrangler.jsonc         Worker config (name, entry point, assets).
data/study.json        Example of the data a study report renders (see docs/DATA-CONTRACT.md).
docs/                  HANDOFF.md, DATA-CONTRACT.md, RADARS.md, DESIGN-TOKENS.md.
```

There is no build step. Edit the files in `site/` directly; the nav and footer are repeated in each page. The
`/study` form posts to the same backend as Base44, its `submitStudyRequest` function. Log in links go to
`https://agentsq.co/signin`; the site has no sign-in page of its own.

## Request access

Every "Request access" button (header, mobile menu, home page, footer) opens `site/request-access/`. Its form posts
to `/api/request-access`, which this repo handles itself: `functions/api/request-access.js` checks the form and emails
the team through Resend. [`worker/index.js`](worker/index.js) serves `site/` and routes `/api/*` to it, as configured
in [`wrangler.jsonc`](wrangler.jsonc). Nothing is sent to the AgentSq app, and nothing is stored; the request lives in
the team's inbox.

Hosting it needs a **Cloudflare Workers** project on this repo (build command: none, deploy command:
`npx wrangler deploy`) with these settings under *Settings > Variables and secrets*. The Worker name in
`wrangler.jsonc` (`agent-squared-website`) must match the project's name in Cloudflare. A Cloudflare Pages project
also works: it serves `site/` and picks up `functions/` on its own.

| Name | Required | What |
|---|---|---|
| `RESEND_API_KEY` | yes (secret) | Resend API key |
| `RESEND_FROM` | no | Sender on a domain verified in Resend. Default `AgentSq <notifications@app.agentsq.co>` |
| `ACCESS_REQUEST_TO` | no | Comma-separated recipients. Default robley@, elizabeth@, tal@ and josh@frameworks.social |

The function refuses posts from other sites and gives bots that fill the hidden `trap` field a fake success. It has
no rate limit of its own; add a Cloudflare rate-limiting rule on `/api/request-access` if spam gets through.

To run the site with the backend locally, create `.dev.vars` (git-ignored) with `RESEND_API_KEY=...` and run
`npx wrangler dev --port 8788`. Without `ACCESS_REQUEST_TO`, a test submission emails the whole team. A plain static
server (`python -m http.server 8080 --directory site`) serves the pages, but the form then has no
`/api/request-access` to post to.

Deploy with `npx wrangler deploy`, or push to `main` if Cloudflare builds from this repo.

The site lives at `https://agentsquared.co`, attached as a custom domain on the Worker (Settings > Domains & Routes).
`www.agentsquared.co` is also attached and the Worker redirects it to the main address. The workers.dev address is
turned off (`workers_dev: false`), and `keep_vars: true` stops deploys from deleting variables set in the dashboard.
Add `RESEND_API_KEY` as a **Secret**, not a plain variable.

See `docs/HANDOFF.md` for how the site works and what a production build would need.
