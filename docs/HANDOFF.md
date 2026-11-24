# Developer handoff

## 1. How the site works now

`site/` is a static site, served as-is by a Cloudflare Worker with static assets. There is no build step.

- **Pages:** `index.html` (home), `study/`, `sample-report/`, `request-access/`, and `method/` (not linked from the nav).
  Every page loads only `assets/agent-squared.css` (compiled styles), `assets/site-header.css` (the nav) and
  `assets/agent-squared.js` (radar reveal and parallax, View-as switch, FAQ accordion, mobile menu, the forms).
- **Nav and footer:** the same markup is repeated in each page. Change it in every `index.html`. Log in points to
  `https://agentsq.co/signin`; the site has no sign-in page of its own.
- **Backend:** `worker/index.js` serves `site/` and routes `/api/request-access` to
  `functions/api/request-access.js`, which checks the form and emails the team through Resend. Settings and
  deployment are in the README.

An earlier build of this page (a Next.js export with a radar layer, `tools/` and `radar-layer/`) was removed;
it is in git history before the commit that deleted it.

## 2. Recommended production build

The radar sections are hand-built for the static site. For a production app:

1. **Port each radar into a component** (plain SVG plus CSS animations; no chart library is needed).
   `RADARS.md` has the behaviour spec, and the current implementation is in `assets/agent-squared.js`.
2. **Replace hard-coded data with an API.** Serve the shape in `DATA-CONTRACT.md` per study and compute the
   aggregates server-side. `data/study.json` is a full example.
3. **Keep:** `prefers-reduced-motion` handling (all motion stops), hover/focus tooltips (keyboard reachable),
   the mobile stacking (sections stack under 768px, radars go full width).

## 3. What the backend has to provide

Per study, one JSON document shaped like `data/study.json`:

- **Study meta:** run date, category, agents with session counts, question count, notes.
- **Topics and questions:** six topics, eight questions each, three phrasings (A, B, C) per question.
- **Sessions:** one record per agent run. Each record holds the prompt and the position of each tracked
  brand in the answer (1 = picked first, 2 = named 2nd, 0 = not named), who was picked, and the ordered
  list of pages read, each with domain, page-type tag and whether it was cited.
- **Aggregates** (can be computed from sessions): picked-first and named rates per brand, the share of
  sessions that opened each page type, cited rate per page type, sites read, reads outside the brand's domain.
- **Fix list:** ranked fixes with title, tag, evidence, action, pages to model.
- **Hero picks:** which session the "One session, slowed down" walk-through uses (`hero.handoffSessionId`).

Brands are anonymised on the public page as Brand X, Y and Z (`A`, `B`, `C` in the data). Letters A, B, C
on the page only ever mean the three phrasings of a question.

## 4. Open items

- Login goes to the AgentSq app (`https://agentsq.co/signin`). Pricing is not on the site.
