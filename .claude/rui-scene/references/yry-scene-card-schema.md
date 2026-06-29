# YrySceneCard — Full Component API Reference

> Source: `cdn/yry-scene-card/index.js` + `data.js` + `index.html`

## Overview

YrySceneCard is a Vue 3 asset card component for displaying tools, features, agents, skills, rules, references, and reports in a unified card format. It lives in the YrY CDN and is loaded asynchronously.

## Loading Chain

```
page loads Vue 3 + yry-tag-chip/index.js + yry-scene-card/index.js
  → index.js bootstraps, creates AsyncMountAPI placeholder
  → yryLoadComponent injects index.css + loads data.js
  → fetches index.html, extracts <script type="text/x-template" id="yry-scene-card-tpl">
  → waits for YryTagChip ready event
  → setComponentOptions with Vue component definition
  → dispatches 'yry-scene-card-ready' event
  → flushes mount queue
```

## Mount API

```javascript
window.YrySceneCard.mount(props, element)
// Returns: Promise<app>
//   - props: card data object (see below)
//   - element: DOM element or CSS selector string
//   - app: Vue 3 app instance with .unmount() method

// Can be called BEFORE component is ready — calls are queued and flushed on ready.
```

## Props Reference

### `name` (String, required)
Card title. Displayed prominently at the top. If `nameHref` is set, rendered as a link.

**Best practices:**
- Use emoji prefix for visual rhythm: `🎥 yt-dlp`, `📚 Term Base`
- Keep under 40 characters
- Make it independently meaningful — the name alone should identify the card

### `nameHref` (String, default: `''`)
When set, wraps the title in an `<a>` tag pointing to this URL.

### `nameTarget` (String, default: `'_blank'`)
Controls how the title link opens:
- `'_blank'` — new window (default, adds `rel="noopener noreferrer"`)
- `''` — same window (for same-page navigation like `#fragment`)

### `badge` (String, default: `''`)
Small colored badge rendered after the title. Styled with red background tint.

**Common values:** `"新"`, `"核心"`, `"Core"`, `"Report"`, `"报告"`, `"Informe"`, `"レポート"`, `"Отчёт"`, `"Rapport"`, `"OSS"`, `"Beta"`

**Guideline:** Use sparingly. One badge per ~5 cards. Reserve for things that are genuinely new, core to the product, or special report-type items.

### `desc` (String, default: `''`)
Description text rendered below the title. **Supports HTML via `v-html`.**

**Best practices:**
- Use `·` (middle dot, U+00B7) as separator between features/dimensions
- Use `<strong>` for key phrases that need emphasis
- Use `<br>` for line breaks (rarely needed)
- Use `<code>` for technical terms, file names, CLI commands
- Keep to 1–2 visual lines — cards are scannable
- Pattern: `Dimension1 · Dimension2 · <strong>highlight</strong> · more context`

**Examples:**
```
// Good
'7-dimension static analysis · quantitative scoring · <strong>26 improvements</strong> identified · 56h governance roadmap'

// Good  
'ATAM method · 8-dimension weighted scoring · <strong>10 action items</strong> · 5-week implementation plan'

// Good
'All-in-one video translation, localization & dubbing — <strong>Netflix-quality subtitles</strong> with AI-powered dubbing'

// Avoid
'This tool does static analysis of code and finds problems and gives you a score.' (too vague, no specifics)
```

### `tags` (Array, default: `[]`)
Array of tag chip objects. Each tag is rendered as `<yry-tag-chip>` (a small colored pill).

**Tag object structure:**
```javascript
{
    text: String,      // Display text (required)
    modifier: String,  // Color variant (default: 'info')
    href: String       // Optional, makes tag clickable
}
```

**Modifier values and their meanings:**

| Modifier | Color | When to Use |
|----------|-------|-------------|
| `info` | Blue (default) | Neutral classification: "Python", "Streamlit", "7 dimensions" |
| `accent` | Yellow/amber | Highlighted/featured: "AI/ML", "Featured" |
| `warn` | Orange | Caution/score: "58 / 100", "Medium risk" |
| `red` | Red | Negative/risk/delta: "5.6 → 7.9" (showing gap) |
| `purple` | Violet | Methodology/approach: "ATAM", "TDD" |
| `cyan` | Cyan/teal | Counts/actions: "26 actions", "10 items" |
| `pass` | Green | Positive/verified: "Passed", "Verified" |
| `fail` | Red variant | Negative/failed: "Failed", "Rejected" |

**Best practices:**
- 2–4 tags per card is the sweet spot
- Tag text should be short (2–10 chars ideal, max ~15)
- Tags should describe/classify the card, not instruct the viewer
- Use modifier colors semantically — don't make everything `info`

### `meta` (String, default: `''`)
Monospace footer text, ideal for versions, dates, paths, and provenance info.

**Best practices:**
- Use monospace-friendly formatting
- Pattern: `Version · Date · Context`
- Examples:
  - `'v3.0.0 → v3.1.0 · Assessment date 2026-06-28'`
  - `'Apache 2.0 · Last updated 2026-01-15'`
  - `'cdn/yry-scene-card/index.js · 4.2 KB'`

### `demo` (String, default: `''`)
URL to a live demo or interactive example. When non-empty, automatically appends a "演示" (Demo) link to the bottom links row. If a link with `label: '演示'` already exists in `links`, it won't duplicate.

### `links` (Array, default: `null`)
Bottom link row. Three-state semantics:

| Value | Behavior |
|-------|----------|
| `null` / `undefined` (default) | Use `data.js` default links (清单/架构/图谱/源码/测试/演示/审查 — 7 generic links) |
| `[]` (empty array) | Hide all bottom links entirely |
| `[...]` (non-empty array) | Use these links, replacing defaults |

**Link object structure:**
```javascript
{
    icon: String,    // Optional icon (rarely used in practice)
    label: String,   // Link text (e.g., "源码", "文档", "演示")
    href: String,    // URL. Use `{name}` as placeholder for URL-encoded props.name
    target: String   // Link target, default '_blank'
}
```

**Best practices:**
- Customize `links` per-card when the card represents something specific (a repo, a report)
- Use `links: []` for feature cards in a grid where generic links would be noise
- 3–5 links is a good range for custom links
- Common labels: "源码" (source), "文档" (docs), "演示" (demo), "架构" (architecture), "测试" (tests)

## Default Links (from data.js)

When `links` is `null`, these 7 links appear at the bottom:

```javascript
[
    { label: '清单', href: 'https://github.com/Huanshere/VideoLingo/blob/main/README.md', target: '_blank' },
    { label: '架构', href: 'docs/components/workflow/index.html',                            target: '_blank' },
    { label: '图谱', href: 'https://github.com/Huanshere/VideoLingo/network/dependents',     target: '_blank' },
    { label: '测试', href: 'https://github.com/Huanshere/VideoLingo/actions',                target: '_blank' },
    { label: '源码', href: 'https://github.com/Huanshere/VideoLingo',                         target: '_blank' },
    { label: '演示', href: 'https://videolingo.io',                                          target: '_blank' },
    { label: '审查', href: 'https://github.com/Huanshere/VideoLingo/pulls',                  target: '_blank' }
]
```

For project-internal pages that don't want these defaults, always set `links: []`.

## Template Structure (HTML)

```html
<div class="yry-scene-card">
  <div class="yry-scene-card-body">
    <div class="yry-scene-card-name">
      <a v-if="nameHref" :href="nameHref">{{ name }}</a>
      <span v-else>{{ name }}</span>
      <span v-if="badge" class="yry-scene-card-name-badge">{{ badge }}</span>
    </div>
    <div v-if="desc" class="yry-scene-card-desc" v-html="desc"></div>
    <div v-if="tags && tags.length" class="yry-scene-card-tags">
      <yry-tag-chip v-for="t in tags" :text="t.text" :modifier="t.modifier" :href="t.href" />
    </div>
    <div v-if="meta" class="yry-scene-card-meta">{{ meta }}</div>
    <div v-if="resolvedLinks && resolvedLinks.length" class="yry-scene-card-links">
      <a v-for="l in resolvedLinks" :href="l.href" :target="l.target">{{ l.label }}</a>
    </div>
  </div>
</div>
```

The card has a dark theme with gradient background, subtle border, hover lift effect, and a left accent bar that appears on hover. It uses CSS custom properties (design tokens) for theming — see `cdn/theme/index.css`.

## Styling Notes

- All class names use `yry-scene-card-` prefix
- Hover: card lifts 2px, shadow deepens, left border becomes accent-colored
- Badge: small uppercase pill with red-tinted background
- Tags: rendered by `yry-tag-chip` which must be loaded before this component
- Links: flex row at bottom, cyan-colored on hover
- Meta: monospace, muted color
- Responsive: padding and font sizes reduce at ≤640px
- Entry animation: fade-in + slide-up (0.4s, staggered by `--card-delay`)

## Page Integration Pattern

```html
<!-- Prerequisites -->
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
<script src="../../../../cdn/yry-tag-chip/index.js"></script>
<script src="../../../../cdn/yry-scene-card/index.js"></script>

<!-- Mount point -->
<div id="card-slot"></div>

<script>
  window.YrySceneCard.mount({
    name: 'My Tool',
    desc: 'Does something <strong>amazing</strong>',
    tags: [{ text: 'v2.0', modifier: 'accent' }],
    links: []
  }, '#card-slot');
</script>
```

For multiple cards in a grid, iterate over a data array:

```javascript
items.forEach(function(item, i) {
    var slot = document.querySelector('.card-slot-' + i);
    if (slot) window.YrySceneCard.mount(item, slot);
});
```

## Events

| Event | When | Detail |
|-------|------|--------|
| `yry-scene-card-ready` | Component fully initialized | Fired on `document`. Listen for this if mounting before the component script loads. |
| `yry-scene-card-error` | Loading/initialization failed | Fired on `document`. Check console for details. |
