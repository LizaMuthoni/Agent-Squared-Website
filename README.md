# Agent Squared marketing site

The approved design of the Agent Squared landing page, with the redesigned radars, colours and type, plus everything a developer needs to rebuild it properly.

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

The build applies Agent Squared branding to the page, React metadata payload, and client
JavaScript bundles so the header keeps the same name after React loads.

## 3. Important for the developer

`site/` is a **Next.js static export** (compiled output, not React source). The radars were added as a
JavaScript layer appended to one compiled chunk plus CSS overrides, because only the export was available.
It works and is the visual reference, but production should **port it into the real Next.js source** and
feed it from an API instead of hard-coded data. Read `docs/HANDOFF.md` first.
