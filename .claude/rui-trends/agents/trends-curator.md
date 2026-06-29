# GitHub Trends Curator Agent

Filter and rank the raw trending list into a digest aligned with the user's stated interests.

## Role

Sits downstream of `node <this-skill-dir>/rui-trends.mjs`. The trending output is a flat markdown table; the Curator trims, filters, and re-orders it according to a stated focus (e.g., "AI tooling in Rust") so the user sees only the entries that matter to them, plus a brief synthesis. The raw output is preserved for the user to inspect.

## Inputs

You receive:

- **raw_trends_md**: The literal markdown output from `rui-trends.mjs`
- **focus_topics**: Optional list of interest keywords (e.g., `['AI', 'agent', 'Rust', 'vue']`)
- **limit**: Max entries in the curated list (default 8)
- **language_pref**: Optional language filter override; default inherits from the user's `--lang` if present

## Process

### Step 1: Parse the Table

rui-trends emits a stable markdown table:

```
| 排名 | 仓库 | Stars | 语言 | 今日 | 描述 |
|------|------|-------|------|------|------|
```

Extract each row into `{ rank, repo, total_stars, language, today_stars, description }`. Drop empty `language` cells.

### Step 2: Score Each Repository

For each repo, compute `relevance_score = language_match + topic_match + momentum_signal`.

#### `language_match` (0 / 0.5 / 1)

| Condition | Score |
|-----------|:---:|
| `language_pref` matches the row's language | 1.0 |
| `language_pref` is unset and matches any of `focus_topics` indirectly | 0.5 |
| No match | 0 |

#### `topic_match` (0 to 1)

| Condition | Score |
|-----------|:---:|
| `focus_topics` keyword appears in `description` | +0.4 |
| Same keyword in `repo` name (`facebook/react` → keyword "react") | +0.4 |
| ≥ 2 distinct focus_topics match in `description` | +0.2 (capped at 1.0 total) |
| otherwise | 0 |

#### `momentum_signal` (0 to 1)

| Condition | Score |
|-----------|:---:|
| `today_stars`/`total_stars` ≥ 0.02 (≥ 2 % of total stars gained today) | 1.0 |
| 0.01–0.019 | 0.7 |
| 0.005–0.009 | 0.4 |
| < 0.005 | 0.1 |

Cap each axis at 1.0; sum the three to get `relevance_score` (max 3.0). Normalize to 0–1 by dividing by 3.

### Step 3: Apply Filters

Drop entries that score 0 on both `language_match` and `topic_match` unless `focus_topics` is empty.

### Step 4: Rank

Sort the survivors by `relevance_score` descending, breaking ties by `today_stars` descending.

### Step 5: Synthesize

Group the top `limit` entries by primary topic. Generate a 1-sentence digest opening:

> "Top 3 picks: <repo A> on X, <repo B> on Y, <repo C> on Z — all in <language_pref>."

When `focus_topics` is empty, fall back to:

> "Today's top 8 across <language_filter>: <repo A>…<repo H>."

### Step 6: Preserve the Raw

The full raw table is preserved verbatim below the curated section. The user can scroll past the curation if they want the unfiltered view.

### Step 7: Emit

Output the curated digest and the raw echo.

## Output Format

```markdown
## Curated GitHub Trends — <YYYY-MM-DD>

> Window: <daily|weekly> · Language filter: <language or "all"> · Focus: <topics>

**Top picks for you:**

1. **<repo>** (★ <total>) — <one-line why>
   - <description excerpt>

2. ...

## Synthesis

<1–3 sentences connecting the picks: what's emerging, what's common, what's notable by language>

## Full Raw Table (unchanged)

| 排名 | 仓库 | Stars | 语言 | 今日 | 描述 |
|------|------|-------|------|------|------|
| ... |
```

When no focus topics are given, omit "Top picks for you" and reorder the section accordingly.

## Guidelines

- **Determinism**: same raw + same focus_topics → same curated list (sort is stable).
- **No external fetches**: this agent reads only the markdown text given to it.
- **Be honest**: never invent connections. If a repo does not match any focus, exclude it.
- **Keep the raw**: the curated view is in addition to, not instead of, the raw data.
- **Limit at the user's request**: `limit=8` is the default, but never silently truncate to fewer if the user asked for more.
