# AgentSq marketing site

> **theme_change branch:** `site/` is now a static site whose page bodies are a port of the Base44 design
> (https://agent-squared-hub.base44.app/), with the original nav bar kept: `index.html`, `study/`, `sample-report/`
> and `method/`. All paths are relative, so it works from a domain root, a sub-folder, or opened straight from disk. The `/study` form posts to the same backend
> as Base44, its `submitStudyRequest` function. Every page loads only
> `site/assets/agent-squared.css` (Base44's compiled styles), `site/assets/site-header.css` (the kept nav) and
> `site/assets/agent-squared.js` (radar reveal/parallax, View-as switch, FAQ accordion, mobile menu).
> It no longer uses `site/next/`, `radar-layer/` or `tools/build.py`. Do not run `build.py` against it.
> The rest of this README describes the previous build.

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

To run the site with the backend locally, put the settings in `.dev.vars` (git-ignored) and run
`npx wrangler dev --port 8788`. A plain static server serves the pages, but the form then has no
`/api/request-access` to post to.

The approved design of the AgentSq landing page, with the redesigned radars, colours and type, plus everything a developer needs to rebuild it properly.

Live preview (private, owner can share): https://claude.ai/artifact/LHFcu9KYE7m5qSKpdwWF6d

## 1. What is in this repo

```
site/                 The approved page, as a static build. Open this to see the target.
radar-layer/src/      Source of every radar and animation added on top of the original build.
radar-layer/styles/   theme.css (fonts, colour overrides) and radars.css (all radar styling).
data/study.json       The full data set the page renders: meta, topics, questions, 148 sessions,
                      page-type sources, fix list, hero picks. This is the data contract.
tools/build.py        Rebuilds site/ from radar-layer/ (reproduces the shipped files byte for byte).
tools/recolor.py      The one-off colour remap applied to the original dark build.
tools/base/           The untouched original JS chunk the radar layer is appended to.
docs/HANDOFF.md       How it is built today, and the recommended way to build it for production.
docs/DATA-CONTRACT.md The fields the backend has to produce, and which radar uses which field.
docs/RADARS.md        Behaviour spec for each radar, section by section.
docs/DESIGN-TOKENS.md Colours, fonts, sizes.
```

## 2. Run it

```bash
cd site
python3 -m http.server 8080      # any static server works
# open http://localhost:8080
```

After editing anything in `radar-layer/`:

```bash
python3 tools/build.py
```

The build applies AgentSq branding to the page, React metadata payload, and client
JavaScript bundles so the header keeps the same name after React loads.

## 3. Important for the developer

`site/` is a **Next.js static export** (compiled output, not React source). The radars were added as a
JavaScript layer appended to one compiled chunk plus CSS overrides, because only the export was available.
It works and is the visual reference, but production should **port it into the real Next.js source** and
feed it from an API instead of hard-coded data. Read `docs/HANDOFF.md` first.
