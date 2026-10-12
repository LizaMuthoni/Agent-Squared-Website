# Developer handoff

## 1. How the current build works

**Base.** `site/` is the Next.js 16.4 / React 19.3 static export of the original georadar page (Turbopack chunks,
GSAP ScrollTrigger for the pinned sections). The original page was dark; `tools/recolor.py` remapped its colours
to the light GEO Radar palette, and `radar-layer/styles/theme.css` swaps the fonts to Poppins (headings) and Inter (body).

**Radar layer.** `radar-layer/src/*.js` is one IIFE, concatenated in this order and appended to
`site/next/static/chunks/3qjcn3l3yqgm5.js`:

| File | Contents |
|---|---|
| r2-head.js | Shared helpers: polar maths (`P`, `Q`), colours, brand names, topic order |
| sess-data.js | `SESS`: the 148 sessions, flattened from `data/study.json` |
| r2-body.js | Hero radar, session radar ("One session, slowed down"), hero-to-session hand-off animation, pointer line, sources radar, field report plate |
| r2-qdots.js | Colours the question-readout dots by who was picked |
| keep-run.js | Run 1 / Run 2 comparison radars in the fix list |
| keep-method.js | Method radar (6 topics, 48 questions, 144 sessions build-up) |
| r2-tail.js | Fix-list mini radars, closing "G" mark, View-as switch handling, mount loop |

A `setInterval` (300 ms) mounts each radar into the React-rendered page once its host element exists.
The layer never edits text that React owns (doing so breaks hydration); it adds its own SVG and hides
React elements with CSS. Where the page copy changed, the text was changed in both `index.html` and
the JS chunk that renders it, so hydration still matches.

**Known, pre-existing:** React reports hydration warning #418 in the console. It was in the original build too.

## 2. Recommended production build

1. **Get the Next.js source** of the original page (the export came from it). Do not keep patching the export.
2. **Port each radar into its section component** as a React component (plain SVG plus CSS animations;
   no chart library is needed). `radar-layer/src` is the reference implementation: geometry, timings and
   colours can be copied as they are.
3. **Replace hard-coded data with an API.** Every number on the page comes from `data/study.json`.
   Serve that shape per study (see `DATA-CONTRACT.md`) and compute the aggregates server-side.
4. **Move the CSS overrides into the design tokens** (Tailwind theme) instead of `!important` rules.
5. **Replace the mount loop** with normal component rendering; the pinned-scroll steps should drive radar
   state through props/state instead of reading element opacity.
6. **Keep:** `prefers-reduced-motion` handling (all motion stops), hover/focus tooltips (keyboard reachable),
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

- Pricing and login are placeholders in the nav.
- The domain field in the closing section has no submit handler yet.
- "Results in [X] days" in the closing section is a placeholder in the original copy.
- Run 2 in the fix list is an illustration until a second study run exists (labelled on the page).
