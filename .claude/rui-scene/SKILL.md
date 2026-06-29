---
name: rui-scene
description: Rewrite and optimize content into professional yry-scene-card data structures. Use when the user wants to create, rewrite, or generate scene cards for tools, features, projects, agents, skills, reports, or any content that should be displayed as a polished card. Also use when the user mentions scene cards, yry-scene-card, card components, asset cards, or wants to convert descriptions into card format — even if they don't explicitly say "scene card."
---

# Rui Scene Card

Rewrite and optimize content into professional, detail-rich `yry-scene-card` data — ready to mount and render.

## What This Skill Does

Takes raw content (tool descriptions, feature blurbs, project summaries, agent specs, report overviews) and transforms it into a polished `YrySceneCard` props object. The output is a structured data object that can be:
- Injected into a `data.js` config file (like `INTRO_CONFIG`)
- Passed directly to `window.YrySceneCard.mount(data, element)`
- Written as a standalone `data.js` for a new page or component

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
| `tags` | Array | No | Tag chips: `[{ text, modifier, href? }]`. Modifier: `info` (default), `accent`, `warn`, `red`, `purple`, `cyan`, `pass`, `fail` |
| `meta` | String | No | Monospace footer text, good for dates/versions/stats |
| `demo` | String | No | Demo URL. Auto-appended as "演示" link (deduped) |
| `links` | Array | No | Bottom links: `[{ icon, label, href, target }]`. `null` = use data.js defaults. `[]` = hide all links. `[...]` = custom override. `{name}` in href is replaced with URL-encoded `props.name` |

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

For each piece of content, identify:

1. **Core identity** — What's the one-line essence? → `name`
2. **Relationship** — Does it link somewhere? → `nameHref`, `nameTarget`
3. **Notability** — Is it new / core / featured? → `badge`
4. **Description** — What does it do, why does it matter? → `desc`
5. **Classifiers** — What categories, scores, dimensions? → `tags`
6. **Provenance** — When, which version, what context? → `meta`
7. **Resources** — Where can users go next? → `links`, `demo`

If the raw content is thin, enrich it with professional language — add specificity, quantify where possible, use consistent terminology.

### Step 3: Generate the Data

Produce a JavaScript object following the yry-scene-card props schema. Every card must have at least `name` and `desc`.

#### Writing the `desc` Field

The description is the heart of the card. Follow these rules:

- **Lead with the what** — "7-dimension static analysis · quantitative scoring · 26 improvements · 56h roadmap"
- **Use `·` (middle dot, U+00B7) as separator** between dimensions or features — it reads cleaner than commas
- **Support HTML**: use `<strong>` for emphasis, `<br>` for line breaks, `<code>` for technical terms
- **Keep it concise**: 1–2 lines max. Cards are scannable, not encyclopedic
- **Be specific**: "9 TTS engines compared with pro tips" beats "Multiple TTS support"

#### Writing the `tags` Field

Tags give at-a-glance classification. Each tag needs:
- `text` — short label (2–10 chars ideal, max ~15)
- `modifier` — semantic color:
  - `info` (default blue) — neutral classification
  - `accent` (yellow) — highlighted/featured
  - `warn` (orange) — caution/score
  - `red` — negative/risk
  - `purple` — methodology
  - `cyan` — count/action
  - `pass` (green) — positive/verified
  - `fail` (red variant) — negative/failed
- `href` (optional) — make the tag clickable

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

### 1. Professional Precision
Every card should feel like it was written by someone who deeply understands the subject. Use domain-appropriate terminology. Quantify when possible ("7 dimensions" not "multiple dimensions").

### 2. Scannable Structure
Cards are read in grids. The eye scans: name → badge → tags → desc (roughly in that order). Make each layer independently informative — the name alone should give the gist, the tags alone should classify it.

### 3. Consistent Rhythm
Use emoji prefixes on names for visual rhythm (🎥 🎙️ 📝 📚 🔄 ✅ 🗣️ 🚀 🌍 🔍 ⏯️). Use `·` separators in desc for feature lists. Keep tag counts consistent across similar cards.

### 4. Actionable Links
Every card should answer "what next?" — either through `nameHref`, `links`, or `demo`. Don't leave the user at a dead end. The `links` array, when customized, should point to the most relevant 3–5 destinations for that specific card.

### 5. Language Awareness
When generating i18n data:
- English: concise, direct, technical
- Chinese (zh-CN): natural, slightly more descriptive
- Japanese (ja): polite, precise, with katakana for technical terms
- Other languages: match the natural cadence and technical conventions of that language

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
    { name: '🎥 yt-dlp',       desc: 'YouTube video download via yt-dlp',                              links: [] },
    { name: '🎙️ WhisperX',     badge: 'Core', desc: 'Word-level and low-illusion subtitle recognition', links: [] },
    { name: '📝 NLP Split',    badge: 'Core', desc: 'NLP and AI-powered subtitle segmentation',         links: [] },
    { name: '📚 Term Base',    badge: 'Core', desc: 'Custom + AI-generated terminology for coherent translation', links: [] }
]
```

### Example 3: Project → Scene Card

**Input:** "VideoLingo is a video translation tool on GitHub. It uses Python and Streamlit. It's been starred a lot."

**Output:**
```javascript
{
    name: 'VideoLingo',
    nameHref: 'https://github.com/Huanshere/VideoLingo',
    badge: 'OSS',
    desc: 'All-in-one video translation, localization & dubbing tool — <strong>Netflix-quality subtitles</strong> with AI dubbing, spanning download → transcription → translation →配音',
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

## Reference Files

- `references/yry-scene-card-schema.md` — Full component API reference, including all props, tag modifiers, link conventions, and usage patterns. Read this when you need precise prop details or are debugging card rendering.
- `references/examples.md` — Curated examples of well-formed scene cards across different domains (tools, features, reports, agents, projects). Read this for inspiration when designing card layouts.

## Output Checklist

Before finalizing card data, verify:

- [ ] Every card has `name` (required) and `desc`
- [ ] `badge` is used sparingly — not every card needs one
- [ ] `tags` use appropriate modifiers (not everything is `info`)
- [ ] `desc` uses `·` separators, not commas, for feature lists
- [ ] `links` is intentional: `null` (defaults), `[]` (hidden), or `[...]` (custom)
- [ ] `meta` uses monospace-friendly formatting (versions, dates, paths)
- [ ] Links that should open in same window have `nameTarget: ''`
- [ ] i18n data is consistent across languages (same cards, translated content)
- [ ] Output is valid JavaScript — no trailing commas in arrays that would break older parsers
