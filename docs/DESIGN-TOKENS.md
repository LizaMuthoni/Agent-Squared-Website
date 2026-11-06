# Design tokens (as shipped)

## 1. Type

- **Headings:** Poppins 500 to 700 (Google Fonts).
- **Body:** Inter 400 to 700.
- **Labels and figures:** IBM Plex Mono 400 to 600, tabular numbers for figures.

## 2. Grounds

| Token | Hex | Where |
|---|---|---|
| page | #FCFCFF | default page ground |
| surface | #FFFFFF | cards, raised panels |
| signal | #6CFCFC | highlight and strong accent bands |
| signal-soft | #A9F5F5 | secondary accent sections and radar bands |
| field | #6CFCFC | field report section |
| electric | #5D5FEF | primary buttons and Brand X |
| ink | #111111 | text, borders, and button shadows |

## 3. Text

| Token | Hex |
|---|---|
| ink | #111111 |
| body | #111111 |
| muted | #55555F |
| label | #55555F |

## 4. Radar

| Meaning | Hex |
|---|---|
| Brand in view (Brand X) | #5D5FEF |
| Biggest competitor | #E66A55 |
| Other competitor | #E3A33A |
| Other vendors | #A9A9B7 |
| Rings / axes | #CFCFD8 |
| Rim | #A9A9B7 |
| Sweep | rgba(93,95,239,.22) gradient, beam rgba(93,95,239,.5) |
| Brand X outcome scale (plate) | #5D5FEF, #7779F3, #A9AAF7, #D6D6FC, grey #A9A9B7 |
| Page types | own #5D5FEF, listing #E3A33A / #6C9E9E, rival #E66A55, neutral types #8CA78F, unclassified/news #A9A9B7 |

## 5. Motion

- Sweep: 6 s per turn, linear, infinite.
- Ping: 30% of the turn, ring scales 1 to 2.2 and fades.
- Build-ups: 0.25 to 0.6 s ease-out per element, staggered about 0.2 s.
- Everything off under `prefers-reduced-motion`.
