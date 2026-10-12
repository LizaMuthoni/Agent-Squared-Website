# Design tokens (as shipped)

## 1. Type

- **Headings:** Poppins 500 to 700 (Google Fonts).
- **Everything else:** Inter 400 to 700, tabular numbers for figures.

## 2. Grounds

| Token | Hex | Where |
|---|---|---|
| page | #F1F5EC | default page ground |
| surface | #F8F9F4 | cards, raised panels |
| sage | #E4ECDA | "One session" section |
| sage-band | #E3EBD8 | radar outer bands, method slices |
| field | #0A3322 | field report section |
| cta-green | #0E4A2F | primary buttons |

## 3. Text

| Token | Hex |
|---|---|
| heading brown | #4A3122 |
| body | #2A2620 |
| muted | #5E574E |
| label | #958B7E |

## 4. Radar

| Meaning | Hex |
|---|---|
| Brand in view (Brand X) | #0E4A2F |
| Biggest competitor | #D9573F |
| Other competitor | #E3A33A |
| Other vendors | #B9B0A3 |
| Rings / axes | #D3DEC6 |
| Rim | #B9C9A8 |
| Sweep | rgba(14,74,47,.22) gradient, beam rgba(14,74,47,.5) |
| Brand X outcome scale (plate) | #0E4A2F, #3F7A5A, #6E9A7E, #9DB78E, grey #B9B0A3 |
| Page types | own #0E4A2F, listing #E3A33A / #4F8A6A, rival #D9573F, neutral types #8CA78F, unclassified/news #B9B0A3 |

## 5. Motion

- Sweep: 6 s per turn, linear, infinite.
- Ping: 30% of the turn, ring scales 1 to 2.2 and fades.
- Build-ups: 0.25 to 0.6 s ease-out per element, staggered about 0.2 s.
- Everything off under `prefers-reduced-motion`.
