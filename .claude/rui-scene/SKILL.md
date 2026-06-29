---
name: rui-scene
description: Rewrite and optimize content into professional yry-scene-card data structures. Use when the user wants to create, rewrite, or generate scene cards for tools, features, projects, agents, skills, reports, or any content that should be displayed as a polished card. Also use when the user mentions scene cards, yry-scene-card, card components, asset cards, or wants to converts descriptions into card format — even if they don't explicitly say "scene card."
lifecycle: default-pipeline
---

# Rui Scene Card

Rewrite and optimize content into professional, detail-rich `yry-scene-card` data — ready to mount and render.

## What This Skill Does

Takes raw content (tool descriptions, feature blurbs, project summaries, agent specs, report overviews) and transforms it into a polished `YrySceneCard` props object. The output is a structured data object that can be:
- Injected into a `data.js` config file (like `INTRO_CONFIG`)
- Passed directly to `window.YrySceneCard.mount(data, element)`
- Written as a standalone `data.js` for a new page or component

## The Code Health Report Standard

The **Code Health Report** card is the canonical reference — every `yry-scene-card` should match its **richness, precision, and structural completeness**. Study it before generating any card data:

```javascript
{
    name: 'Code Health Report',
    nameHref: 'views/health-report/index.html',
    nameTarget: '',
    badge: 'Report',
    desc: '7-dimension static analysis · quantitative scoring · <strong>26 improvements</strong> identified · 56h governance roadmap',
    tags: [
        { text: '58 / 100', modifier: 'warn' },
        { text: '7 dimensions', modifier: 'info' },
        { text: '26 actions', modifier: 'cyan' }
    ],
    meta: 'Assessment date 2026-06-28 · Technical Due Diligence'
}
```

### Why This Is the Standard

| Aspect | What It Demonstrates |
|--------|---------------------|
| **`desc`** | Uses `·` separators (not commas) · embeds key metrics inline · `<strong>` on the actionable insight · ends with a concrete outcome ("56h roadmap") |
| **`tags`** | Exactly 3 tags — the sweet spot · every tag has a **semantic** modifier (`warn` for score, `info` for dimensions, `cyan` for count) · tags are **self-describing classifiers**, not instructions |
| **`badge`** | `'Report'` signals the card type at a glance — uppercase, scannable |
| **`meta`** | Monospace-provenance: date + methodology context · uses `·` separators |
| **`nameHref` + `nameTarget: ''`** | Links to a dedicated detail page in the same window — the card is a **gateway**, not a dead end |
| **No `links` override** | Falls back to data.js defaults (清单/架构/图谱/源码/测试/演示/审查) — the right call for project-internal reports |

### Standard Rules (Apply to Every Card)

1. **`desc` must use `·` (U+00B7) as separator** — never commas, never plain spaces between features. At least one `<strong>` for the key takeaway.
2. **Every Rich and Standard tier card MUST have 2–4 `tags`** with semantic modifiers. A Standard/Rich card without tags is incomplete. Not everything is `info` — match the modifier to the meaning: scores → `warn`/`green`/`red`, methodology → `purple`, counts → `cyan`, highlights → `accent`.
3. **Quantify everything** — "7 dimensions" not "multiple dimensions", "26 actions" not "several fixes", "56h roadmap" not "improvement plan".
4. **Every card has a `meta` or a clear reason not to** — provenance matters. Dates, versions, contexts.
5. **Badges are type classifiers** — `'Report'`, `'Core'`, `'Agent'`, `'OSS'`, `'Beta'`. Uppercase, one word, scannable.

### Card Quality Tiers

Not every card needs every field, but the floor rises with context:

| Tier | Use Case | Minimum Fields | Target Fields |
|------|----------|---------------|---------------|
| **Rich** | Reports, audits, tools, projects, agents | name, desc (with `·` + `<strong>`), **tags (2–4, semantic modifiers, required)**, badge | + meta, + nameHref, + custom links |
| **Standard** | Feature grids, capability cards | name, desc (with `·` + `<strong>`), **tags (2–4, semantic modifiers, required)** | + badge (if core), + meta |
| **Nav** | Documentation page navigation | name, nameHref, nameTarget: `''`, desc (concise, `·` for multiple points) | + badge (if new/special), + tags |

**Key principle**: A nav card should never be just `{ name, nameHref, desc: 'one vague sentence' }`. Even the simplest nav card needs specificity — "Get running in 3 minutes with uv or Docker" beats "Quick start guide".

## The yry-scene-card Component

The component lives at `cdn/yry-scene-card/` and is a Vue 3 asset card component. It renders a dark-themed card with:
- Title (with optional link and badge)
- Description (supports HTML)
- Tag chips (colored labels)
- Meta info (monospace footer)
- Bottom link row (icon + label links)
- Optional demo link (auto-appended as "演示")

### Full Props Reference

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | String | **Yes** | Card title. Use emoji prefix for visual rhythm. |
| `nameHref` | String | No | Makes title a clickable link |
| `nameTarget` | String | No | Link target, default `_blank` (new window). Use `''` for same-window |
| `badge` | String | No | Small badge after title (e.g. `"新"`, `"核心"`, `"Report"`) |
| `desc` | String | No | Description text. Supports **HTML** — use `<strong>`, `<br>`, `<code>` for rich formatting |
| `tags` | Array | No | Tag chips: `[{ text, modifier, href? }]`. Modifier: `info` (default), `accent`, `warn`, `red`, `purple`, `cyan`, `green` |
| `meta` | String | No | Monospace footer text, good for dates/versions/stats |
| `demo` | String | No | Demo URL. Auto-appended as "演示" link (deduped) |
| `links` | Array | No | Bottom links: `[{ icon, label, href, target }]`. `null` = use data.js defaults. `[]` = hide all links. `[...]` = custom override. `{name}` in href is replaced with URL-encoded `props.name` |

#### Links Convention

When customizing `links`, prefer lean, card-specific links over duplicating the 7 baseline defaults:

- **Feature grid cards** → `links: []` (hide defaults) — tags alone provide enough classification; bottom links add visual noise in a dense grid
- **External tool cards** (yt-dlp, WhisperX) → 3–5 custom links pointing to that tool's own repo, docs, and community
- **Internal VideoLingo cards** → `links: null` (use defaults) — the 7 baseline links (清单/架构/图谱/源码/测试/演示/审查) already point to the right places
- **Report/audit cards** → 2–4 custom links to the report detail page, data sources, and methodology docs

**Never** copy the same 7–9 link objects across every card in a grid — it's visual noise, a maintenance burden, and defeats the purpose of per-card link customization.

### Tags Convention

Name tags by what they measure or classify — nouns that describe the card, not the viewer:

| Good (self-describing) | Avoid (instructive) |
|---|---|
| `7 dimensions` | `View details` |
| `26 actions` | `Click here` |
| `58 / 100` | `Learn more` |
| `ATAM` | `Read report` |

This keeps cards self-contained: the tags describe the thing, not what to do with it.

## When to Use This Skill

- User wants to create scene cards for tools, features, projects, or reports
- User has raw descriptions and wants them polished into card format
- User mentions: scene card, yry-scene-card, asset card, card component, card data
- User wants to generate `data.js` for a page/component that uses scene cards
- User is building docs pages and needs professional card layouts
- User wants to rewrite existing card data to be more professional or detailed

## How to Use

### Step 1: Understand the Content

Ask the user what they want to display as cards. Get clarity on:
- **What** is being carded? (tools, features, reports, agents, projects?)
- **How many** cards? (single or a grid?)
- **What context** will the cards appear in? (docs page, dashboard, landing page?)
- **What language**? (default to the user's language; support i18n if needed)
- **Any special emphasis**? (badge certain items as "New", "Core", "Report"?)
- **Link destinations**? (where should title/links point?)

If the user provides raw content, don't ask everything at once — extract what you can from the content itself and only ask about what's ambiguous.

### Step 2: Analyze and Extract

For each piece of content, identify what belongs in each slot. **Reference the Code Health Report standard** to determine what level of richness is appropriate:

1. **Core identity** — What's the one-line essence? → `name`
2. **Relationship** — Does it link somewhere? → `nameHref`, `nameTarget`
3. **Notability** — Is it new / core / featured? → `badge` (type classifier: `'Report'`, `'Core'`, `'Agent'`, `'OSS'`)
4. **Description** — What does it do, why does it matter? → `desc` (must use `·` + `<strong>` per standard)
5. **Classifiers** — What categories, scores, dimensions? → `tags` (2–4, semantic modifiers required)
6. **Provenance** — When, which version, what context? → `meta` (required for Rich tier)
7. **Resources** — Where can users go next? → `links`, `demo`

If the raw content is thin, enrich it with professional language — add specificity, quantify where possible, use consistent terminology. **Every card should aim for at least the Standard tier.**

### Step 3: Generate the Data

Produce a JavaScript object following the yry-scene-card props schema. Every card must have at least `name` and `desc`.

#### Writing the `desc` Field

The description is the heart of the card. **The Code Health Report desc is the canonical pattern:**

```
'7-dimension static analysis · quantitative scoring · <strong>26 improvements</strong> identified · 56h governance roadmap'
```

Follow these rules for every card:

- **Lead with the what** — the primary dimension or capability first
- **Use `·` (middle dot, U+00B7) as separator** — never commas, never plain spaces between features. This is the single most visible consistency marker across all cards.
- **Always include at least one `<strong>`** (Rich and Standard tiers) — the key takeaway or most impressive metric gets emphasis
- **Support HTML**: use `<strong>` for emphasis, `<br>` for line breaks, `<code>` for technical terms
- **Keep it concise**: 1–2 lines max. Cards are scannable, not encyclopedic
- **Be specific**: "9 TTS engines compared with pro tips" beats "Multiple TTS support"
- **End with outcome or scale**: "56h governance roadmap", "5-week implementation plan", "Netflix-quality subtitles"

#### Writing the `tags` Field

Tags give at-a-glance classification. **The Code Health Report tags are the canonical pattern** — exactly 3 tags, each with a distinct semantic modifier that matches its meaning:

```javascript
tags: [
    { text: '58 / 100', modifier: 'warn' },     // score → warn (caution)
    { text: '7 dimensions', modifier: 'info' },   // structure → info (neutral)
    { text: '26 actions', modifier: 'cyan' }      // count → cyan (actionable)
]
```

Each tag needs:
- `text` — short label (2–15 chars). Must be a **self-describing classifier**, not an instruction. "7 dimensions" not "View details".
- `modifier` — semantic color. **Audit every tag**: does the modifier match what the text means?
  - `info` (default blue) — neutral classification: dimensions, languages, types
  - `accent` (yellow) — highlighted/featured: key metrics, standout features
  - `warn` (orange) — caution/score: numerical scores, medium-risk findings
  - `red` — negative/risk/failure: score gaps ("5.6 → 7.9"), critical issues ("3 critical"), failed status
  - `purple` — methodology/approach: "ATAM", "TDD", "AI-driven"
  - `cyan` — count/action: "26 actions", "10 items"
  - `green` — positive/verified: "95/100", "Verified"

**Tag count rule**: 2–4 tags per card. 3 is the sweet spot. Each card's tag set should be a distinct "fingerprint" — no two cards should have identical tag configurations.

#### Output Format

Always provide the full data object ready for use. If generating for a multi-language page, follow the `INTRO_CONFIG` pattern with language keys:

```javascript
window.MY_CONFIG = {
    en: {
        cards: [
            { name: '...', desc: '...', ... },
        ]
    },
    'zh-CN': {
        cards: [
            { name: '...', desc: '...', ... },
        ]
    }
};
```

For single-language output, use a flat array or simple config object.

### Step 4: Present and Iterate

Show the generated card data to the user. Explain your choices:
- Why certain tags were chosen
- How the description was optimized
- What links were configured

Ask if they want adjustments. Common iteration points:
- Tone (more formal or more casual?)
- Detail level (more dimensions in tags? longer desc?)
- Emphasis (different badge? different tag modifiers?)
- Language (translate to another language?)

## Design Principles

### 1. The Code Health Report Baseline
Every card you generate should pass the "Code Health Report test": if you placed your card next to the Code Health Report standard, would they feel like the same product? If your card is missing tags, has no `<strong>` emphasis, uses commas instead of `·`, or lacks specific numbers — it fails the test. **Start from the standard and remove only what the context genuinely doesn't need.**

### 2. Professional Precision
Every card should feel like it was written by someone who deeply understands the subject. Use domain-appropriate terminology. Quantify when possible ("7 dimensions" not "multiple dimensions", "56h roadmap" not "improvement plan", "5.6 → 7.9" not "score improved").

### 3. Scannable Structure
Cards are read in grids. The eye scans: name → badge → tags → desc (roughly in that order). Make each layer independently informative — the name alone should give the gist, the tags alone should classify it. A card without tags is a missed opportunity for at-a-glance classification.

### 4. Consistent Rhythm
Use emoji prefixes on names for visual rhythm (🎥 🎙️ 📝 📚 🔄 ✅ 🗣️ 🚀 🌍 🔍 ⏯️). Use `·` separators in desc for feature lists — never commas, never plain spaces. Keep tag counts balanced (2–4 per card).

### 5. Actionable Links
Every card should answer "what next?" — either through `nameHref`, `links`, or `demo`. Don't leave the user at a dead end. The `links` array, when customized, should point to the most relevant 3–7 destinations for that specific card. For internal project pages, prefer `nameHref` + `nameTarget: ''` (same-window navigation to a detail view).

### 6. Language Awareness
When generating i18n data:
- English: concise, direct, technical
- Chinese (zh-CN): natural, slightly more descriptive
- Japanese (ja): polite, precise, with katakana for technical terms
- Other languages: match the natural cadence and technical conventions of that language

**i18n consistency rule**: All languages must have the same card structure (same fields, same tags count, same links). Only the text content translates — badges, tag modifiers, and link URLs stay identical.

## Examples

### Example 1: Tool → Scene Card

**Input:** "We have a code health checker that runs static analysis on 7 dimensions and finds issues. It scored the project 58/100 and found 26 things to fix."

**Output:**
```javascript
{
    name: 'Code Health Report',
    nameHref: 'views/health-report/index.html',
    nameTarget: '',
    badge: 'Report',
    desc: '7-dimension static analysis · quantitative scoring · <strong>26 improvements</strong> identified · 56h governance roadmap',
    tags: [
        { text: '58 / 100', modifier: 'warn' },
        { text: '7 dimensions', modifier: 'info' },
        { text: '26 actions', modifier: 'cyan' }
    ],
    meta: 'Assessment date 2026-06-28 · Technical Due Diligence'
}
```

### Example 2: Feature List → Scene Card Grid

**Input:** "Our tool does video download via yt-dlp, whisper-based transcription, NLP subtitle splitting, and has a term glossary."

**Output:**
```javascript
[
    { name: '🎥 yt-dlp', desc: 'YouTube video download via yt-dlp · <strong>1,200+ sites</strong> · format selection · subtitle extraction',
      tags: [{ text: '1.2k sites', modifier: 'accent' }, { text: 'Python', modifier: 'info' }],
      links: [] },
    { name: '🎙️ WhisperX', badge: 'Core', desc: 'Word-level subtitle recognition · <strong>low-illusion</strong> output · speaker diarization · multi-language',
      tags: [{ text: 'word-level', modifier: 'accent' }, { text: 'diarization', modifier: 'info' }],
      links: [] },
    { name: '📝 NLP Split', badge: 'Core', desc: 'NLP and AI-powered subtitle segmentation · <strong>natural reading flow</strong> · sentence-boundary detection',
      tags: [{ text: 'AI-driven', modifier: 'purple' }, { text: 'sentence-aware', modifier: 'info' }],
      links: [] },
    { name: '📚 Term Base', badge: 'Core', desc: 'Custom + AI-generated terminology · <strong>translation consistency</strong> · domain-specific glossaries',
      tags: [{ text: 'AI + Custom', modifier: 'purple' }, { text: 'glossary', modifier: 'info' }],
      links: [] }
]
```

> **Standard compliance**: Each card has tags with semantic modifiers, `desc` uses `·` + `<strong>`, and `badge` marks only genuinely core features.

### Example 3: Project → Scene Card

**Input:** "VideoLingo is a video translation tool on GitHub. It uses Python and Streamlit. It's been starred a lot."

**Output:**
```javascript
{
    name: 'VideoLingo',
    nameHref: 'https://github.com/Huanshere/VideoLingo',
    badge: 'OSS',
    desc: 'All-in-one video translation, localization & dubbing — <strong>Netflix-quality subtitles</strong> · AI dubbing · multi-TTS · Streamlit UI · i18n',
    tags: [
        { text: 'Python', modifier: 'info' },
        { text: 'Streamlit', modifier: 'info' },
        { text: 'AI/ML', modifier: 'accent' }
    ],
    meta: 'Apache 2.0 · Active Development',
    demo: 'https://videolingo.io',
    links: [
        { label: '源码', href: 'https://github.com/Huanshere/VideoLingo', target: '_blank' },
        { label: '文档', href: 'https://github.com/Huanshere/VideoLingo/blob/main/README.md', target: '_blank' }
    ]
}
```

> **Standard compliance**: Rich tier — tags with semantic modifiers, `meta` for provenance, `badge` classifies the card type, custom `links` point to the most relevant 2 destinations.

## Reference Files

- `references/yry-scene-card-schema.md` — Full component API reference, including all props, tag modifiers, link conventions, and usage patterns. Read this when you need precise prop details or are debugging card rendering.
- `references/examples.md` — Curated examples of well-formed scene cards across different domains (tools, features, reports, agents, projects). Read this for inspiration when designing card layouts.

## Output Checklist

Before finalizing card data, verify against the Code Health Report standard:

### Structural Completeness
- [ ] Every card has `name` (required) and `desc`
- [ ] `desc` uses `·` (U+00B7) as separator — **never commas** for feature lists
- [ ] At least one `<strong>` in `desc` for the key takeaway (Rich and Standard tiers)
- [ ] **`tags` present on every Rich and Standard tier card** — a card without tags is a hard fail. 2–4 tags required.
- [ ] `tags` use semantic modifiers — **not everything is `info`** (audit each tag: does its modifier match its meaning?)
- [ ] `badge` is a type classifier when used (`'Report'`, `'Core'`, `'Agent'`, `'OSS'`) — uppercase, scannable
- [ ] `meta` is present on Rich tier cards (dates, versions, contexts in monospace format)

### Link Hygiene
- [ ] `links` is intentional: `null` (defaults), `[]` (hidden), or `[...]` (custom 3–5 items for external tools, max 7 for reports)
- [ ] Feature grid cards prefer `links: null` (internal) or `links: []` (dense grid) — never duplicate 7 baseline links per card
- [ ] Links that should open in same window have `nameTarget: ''`
- [ ] `nameHref` + `nameTarget: ''` for same-site detail pages; `_blank` for external

### Standard Compliance
- [ ] Card passes the "Code Health Report test" — placed next to the standard, does it feel like the same product?
- [ ] Numbers are specific ("7 dimensions", "26 actions", "56h roadmap") — not vague ("multiple", "several", "improvements")
- [ ] Tags are self-describing classifiers, not instructions ("7 dimensions" not "View details")
- [ ] Tag text is concise (2–15 chars)
- [ ] No two cards in the same grid have identical tag sets — each card has a distinct "fingerprint"

### i18n Consistency
- [ ] i18n data has identical structure across languages (same fields, same tag count, same links)
- [ ] Badges and tag modifiers stay identical across languages; only text translates
- [ ] Output is valid JavaScript — no trailing commas in arrays that would break older parsers

## 规则

- [card-standard.md](./rules/card-standard.md) — YrySceneCard 数据生成的标准 / Tier 分级 / tag modifier 语义 / 12 条门禁检查。

## 专业代理

- [card-writer.md](./agents/card-writer.md) — 把自由描述改写成 Code Health Report 级的卡片数据。
- [tag-modifier-auditor.md](./agents/tag-modifier-auditor.md) — 校验 tag 的 `modifier` 与文本的语义类一致。

## Borders

### What this skill does

- Rewrite raw content (tool descriptions, feature blurbs, project summaries) into polished `YrySceneCard` props objects
- Enforce the **Code Health Report standard**: `·` separators, semantic tag modifiers, quantified `desc`, `<strong>` highlights
- Define a tier system (Rich / Standard / Nav) with minimum field requirements per tier
- Audit tag modifiers against meaning (`warn` for scores, `red` for risk, `green` for verified, …)

### What this skill does NOT do

- **Generate demo pages** — that is [[rui-demos]]; rui-scene only produces the data, not the page
- **Mount cards into the DOM** — that is [[rui-html]] via `YrySceneCard.mount()`
- **Translate between languages** — multilingual data structure (en / zh-CN) is the caller's responsibility; rui-scene operates on the requested locale
- **Define tag colors** — modifiers (`info`, `accent`, `warn`, `red`, `purple`, `cyan`, `green`) are part of the `YrySceneCard` schema; rui-scene only fills semantic content

### Coordinated with

| Skill | Direction | See |
|-------|-----------|-----|
| [[rui-demos]] | downstream consumer | Reads cards from data.js / inline objects — `[IF-003](../INTERFACES.md#if-003)` |
| [[rui-html]] | downstream consumer | Mounts `YrySceneCard` props — `[IF-007](../INTERFACES.md#if-007)` |

### Output ownership

| Path | Permission |
|------|-----------|
| Caller-provided `data.js` / config object | **write** (data output goes wherever caller specifies) |
| Component schema reference (`references/yry-scene-card-schema.md`) | read-only — owned by rui-scene |
| Examples reference (`references/examples.md`) | read-only — owned by rui-scene |

### Invocation

rui-scene has **no CLI entry** — it is invoked through conversation. The user describes what they want carded (tools, features, reports, agents); the skill returns a JavaScript object matching the `YrySceneCard` props schema.
