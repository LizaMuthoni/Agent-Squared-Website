# AgentSq marketing site

The public website for AgentSq (agentsq.co): a static site built on the Base44 design (https://agent-squared-hub.base44.app/). The home page, menu and footer follow Josh's website copy (Nov 2026): the menu is Home · Sign in · Request access, and the footer is AgentSq · Home · Sign in · Request access.

The client app, sign-in and backend API live in the AI-Visibility-Dashboard repo (app.agentsq.co). This site calls that app for three things only: study requests, access requests and sign-in.

## What's here

```
site/
  index.html              Home (Josh's copy)
  method/                 How a study works            } not linked from the menu or footer since Josh's copy;
  sample-report/          The anonymized 9 Oct sample  } still reachable by URL until we decide whether to
  study/                  The category study form      } remove them (J-02)
  request-access/         The Request access form
  signin/                 Forwards to the app's sign-in page
  icon.svg
  assets/
    agent-squared.css     Base44's compiled Tailwind styles (generated, don't edit by hand)
    site-header.css       The nav bar, with the design-token colours
    agent-squared.js      Radar reveal and parallax, View-as switch, FAQ accordion, mobile menu,
                          study and request-access forms, app links
docs/
  DESIGN-TOKENS.md        Colours, fonts and sizes
```

All paths are relative, so the site works from a domain root, a sub-folder, or opened straight from disk. There is no build step.

## Run it

```bash
cd site
python3 -m http.server 8080
```

Then open http://localhost:8080.

## Talking to the app

- **The app address** defaults to `https://app.agentsq.co`.
  - A page can set its own with `<meta name="agentsq-api" content="https://...">`, for example for a staging app.
  - On localhost, `?api=http://localhost:3100` points the page at a local app.
- **The study form** (`study/`) posts to the app's `POST /api/public/study-request`. The request is stored and emailed to the team.
  - **Accepted sites:** the app only accepts requests from agentsq.co, www.agentsq.co and localhost, unless its `PUBLIC_SITE_ORIGINS` setting says otherwise.
- **The Request access form** (`request-access/`) posts to the app's `POST /api/public/access-request`, with the same accepted sites. The request is stored and emailed to the team; accounts are still set up by the team. Every page links to it from the header, the mobile menu and the footer.
- **Log in** links go straight to the app's `/signin`. The old `signin/` page forwards there and keeps a `?next=` path.

**Release the app before the site.** The study form needs `/api/public/study-request` and the Request access form needs `/api/public/access-request`. Both only exist on the app once its `staging` is released, and the access form also needs the app's `access_requests` table.

## The sample report

The sample report's figures are a fixed, anonymized snapshot of the 9 October study: 148 sessions, with the brand shown as "Brand X". The home page's one figure ("considered in 71% of video API sessions, installed in none") comes from Josh's copy and is to be replaced with a measured install figure (J-11, J-12). They're written into the HTML on purpose, so the published claims don't change when the study data does. The app's `GET /api/public/sample` serves live figures if that's ever wanted.

## History

Earlier versions of this repo held a compiled Next.js export (`site/next/`), a radar layer appended to it (`radar-layer/`, `tools/build.py`) and its data file (`data/study.json`). The Base44 port replaced all of that. They were removed in T-22 and remain in git history.
