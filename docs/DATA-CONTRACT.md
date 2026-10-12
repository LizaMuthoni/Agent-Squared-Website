# Data contract

`data/study.json` is the exact data set the page renders (taken from the original build, brands renamed X/Y/Z).
The backend should return this shape for each study.

## 1. Top level

```jsonc
{
  "meta":      { ... },   // run info and headline numbers
  "topics":    [ ... ],   // 6
  "questions": [ ... ],   // 48
  "sessions":  [ ... ],   // 148 (one per agent run)
  "sources":   [ ... ],   // 9 page types
  "fixes":     [ ... ],   // 8 ranked fixes
  "hero":      { ... }    // which questions/sessions the animations feature
}
```

## 2. Objects

**meta**
| Field | Example | Used by |
|---|---|---|
| runDate | "2026-10-09" | Field report eyebrow |
| sessionCount | 148 | Everywhere "of 148" appears |
| questionCount | 48 | Method radar, field report |
| sitesRead | 147 | Field report stat |
| firstPickPct {A,B,C} | 33.1 | Hero line, field report stat, plate |
| seenPct {A,B,C} | 72.3 | Field report stat |
| readsOutsideBrandPct | 78.4 | Field report stat |
| agents[] {id,name,sessions,rated} | Claude Code, 144 | Method table |

**topics[]**: `id`, `label`, `short`, `index` (0 to 5; sets the slice order on the method radar).

**questions[]**: `id`, `topic`, `number`, `intent`, `sessionIds[]`.

**sessions[]**
| Field | Meaning |
|---|---|
| id | e.g. `agentic-media-04-a` |
| agent | `claude-code` or `codex` |
| topic, questionId | links to the lists above |
| phrasing | `A`, `B` or `C` (the three ways a question is asked) |
| prompt | the buyer question, anonymised |
| positions {A,B,C} | where each tracked brand appeared in the answer: 1 picked first, 2 named 2nd, 3 named 3rd, 4+ lower, 0 not named |
| picked | the brand picked first (`Brand X/Y/Z` or another vendor) |
| reads[] | `{order, label, domain, tag, cited}` in the order the agent opened them |
| searches | number of web searches |
| seed | 0 to 1, only for stable dot jitter |

**Page-type tags** (`reads[].tag`, `sources[].tag`): `rival`, `yours`, `your-listing`, `request-mention`,
`publish-here`, `standard`, `diy`, `unclassified`, `news`.

**sources[]**: `tag`, `label`, `sessionsPct` (share of sessions that opened at least one page of this type),
`citedPct`, `reads`.

**fixes[]**: `rank`, `title`, `tag`, `evidence`, `action`, `pagesToModel[]`.

**hero**: `openingQuestions[]`, `relightQuestions[]`, `handoffSessionId`.

## 3. Which radar reads what

| Radar | Data |
|---|---|
| Hero (View as switch) | per brand: picked first and named counts across sessions; other vendors per topic |
| One session, slowed down | the `hero.handoffSessionId` session: its 3 phrasings and results, `reads[]`, `positions` |
| What agents read | `sources[]` |
| Fix list mini radar | `sources[]` + the fix's `tag` |
| Run 1 / Run 2 | per-brand totals of this run and (when it exists) the previous run |
| Method | topics, questions per topic, phrasings |
| Field report plate | count of sessions per Brand X position (1, 2, 3, 4+, 0), split by topic on hover |
