---
name: rui-html
description: Generate and refactor documentation pages using the VideoLingo docs tech stack — Vue 3 CDN, zero-build 4-file component architecture, token-bridged theme system, and vanilla-JS i18n. Use for creating doc pages, refactoring static pages, adding sections, or setting up i18n. Also use when the user wants doc sites, documentation pages, Vue CDN pages, or pages following the docs/ pattern. Takes a Knowledge Graph from [[rui-diagram]] as optional input.
lifecycle: default-pipeline
---

# Rui HTML

Generate and refactor documentation pages: Vue 3 CDN + vanilla JS infrastructure + CSS token bridge + zero-build component architecture.

For architecture diagrams, see **[[rui-diagram]]**. For the full design pipeline (Phase 1–3), see the pipeline section below.

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Vue 3 (`unpkg.com/vue@3`) | Zero build, `file://` URLs work, reactive templates |
| Charts | Chart.js 4 (CDN, optional) | Data visualization |
| Theme | `cdn/theme/{name}.css` — 10 presets | One `<link>` switches entire color scheme |
| CSS | `index.css` → `@import` chain (tokens → base → layout → responsive) | Layered, no build tooling |
| Language | `assets/lang.js` — vanilla JS event bus | Shared state across independent Vue apps |
| Mounting | `assets/mount-component.js` — `mountDocComponent()` | Consistent mounting + auto CSS + i18n |
| Inclusion | `assets/include.js` — `data-include` placeholders | Sequential script execution (data.js before index.js) |
| Widgets | yry-loader, yry-tag-chip, yry-scene-card, yry-back-top | Pre-built CDN components |
| Tokens | `--yry-*` (CDN theme) → `--vl-doc-*` (docs tokens) | Theme-agnostic component styles |

## Decision Tree

```
User asks for...
├─ New doc page from scratch
│  → W1: entry point + stylesheets + components + theme
│
├─ Refactor existing static page
│  → W2: audit → extract data → template-ify → wire up mountDocComponent()
│
├─ Add a section to existing page
│  → W3: create 4-file component → add data-include → register CSS if needed
│
├─ Add i18n to a component
│  → W4: restructure data.js → i18n: true
│
├─ Switch theme
│  → W5: change one <link> in index.html
│
├─ Standalone sub-page (no sidebar, e.g. views/)
│  → W6: self-contained index.html + optional 4-file pattern
│
├─ Component with custom CSS
│  → W7: create index.css → add to _COMPONENTS_WITH_CSS Set
│
└─ Full design process (new page / major redesign)
   → Phase 1 (rui-ui) → Phase 2 (rui-theme)
```

## Directory Structure

```
docs/
├── index.html              # Entry point: CDN deps + data-include placeholders
├── index.css               # @import chain: tokens → base → layout → responsive
├── styles/
│   ├── tokens.css           # --yry-* → --vl-doc-* bridge + docs-specific tokens
│   ├── base.css             # Reset + typography + shared atoms (code, pre, table, card, callout, badge, tabs)
│   ├── layout.css           # Sidebar + main content + heading hierarchy + nav links
│   └── responsive.css       # @media only: ≤768, ≤1024, ≥1440, <375
├── assets/
│   ├── lang.js              # window.VL_LANG — global language state
│   ├── mount-component.js   # mountDocComponent() — Vue app factory
│   ├── include.js           # includeHTML() — data-include + sequential script exec
│   └── main.js              # Scroll spy + smooth scroll + language change listener
├── components/<name>/       # 4-file component pattern
│   ├── index.html           # <template id="xxx-template"> + <script src="data.js"> + <script src="index.js">
│   ├── data.js              # window.XXX_CONFIG = { constants?, en, 'zh-CN', ... }
│   ├── index.js             # mountDocComponent({name, templateId, dataKey, i18n, extra})
│   └── index.css            # Component-scoped styles (optional — must register in _COMPONENTS_WITH_CSS)
└── views/<name>/            # Standalone sub-pages (no sidebar, no data-include cross-deps)
    └── index.html           # Self-contained; can optionally use 4-file pattern + mountDocComponent()
```

## Entry Point Pattern

### `docs/index.html` — Anatomy

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <link rel="icon" href="data:image/svg+xml,..." type="image/svg+xml">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Site Title</title>
    <meta name="description" content="...">

    <!-- 1. CDN theme (one line to switch) -->
    <link rel="stylesheet" href="../cdn/theme/modern-minimalist.css">

    <!-- 2. Docs CSS (@import chain) -->
    <link rel="stylesheet" href="index.css">

    <!-- 3. Vue 3 CDN -->
    <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>

    <!-- 4. Chart.js (optional) -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"></script>
</head>
<body class="vl-doc">

<!-- Skip link (accessibility) -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- Sidebar -->
<div data-include="components/sidebar/index.html"></div>

<main class="main" id="main-content">
    <div data-include="components/intro/index.html"></div>
    <div data-include="components/quick-start/index.html"></div>
    <!-- ... more components ... -->
    <div data-include="components/footer/index.html"></div>
</main>

<!-- Script order is CRITICAL -->
<script src="../cdn/shared/yry-loader.js"></script>
<script src="../cdn/yry-tag-chip/index.js"></script>
<script src="../cdn/yry-scene-card/index.js"></script>
<script src="../cdn/yry-back-top/index.js"></script>
<script src="assets/mount-component.js"></script>
<script src="assets/lang.js"></script>
<script src="assets/include.js"></script>
<script src="assets/main.js"></script>

</body>
</html>
```

### Script Loading Order (Critical)

```
CDN Vue → CDN Chart.js → CDN theme CSS → docs/index.css
→ yry-loader → yry-tag-chip → yry-scene-card → yry-back-top
→ mount-component.js → lang.js → include.js → main.js
```

| Position | Script | Why This Position |
|----------|--------|-------------------|
| 1 | `mount-component.js` | Defines `mountDocComponent()` before any component's `index.js` calls it |
| 2 | `lang.js` | `window.VL_LANG` must exist before `include.js` fetches components (data.js may read it) |
| 3 | `include.js` | Fetches all `data-include` placeholders, executes scripts sequentially |
| 4 | `main.js` | Calls `includeHTML().then(...)` — triggers all component mounting |

## CSS Architecture

### The `@import` Chain

```css
/* docs/index.css — entry point, NO styles here, only @import */
@import url('styles/tokens.css');
@import url('styles/base.css');
@import url('styles/layout.css');
@import url('styles/responsive.css');
```

### Layer Responsibilities

| File | Contains | Does NOT Contain |
|------|----------|-----------------|
| **tokens.css** | `--vl-doc-*` design variables: color bridge, font stacks, spacing scale, radii, animation | Any selectors or rules |
| **base.css** | Reset, `.vl-doc` root, `code`/`pre`/`table`/`.card`/`.callout`/`.badge`/`.tabs`, `@keyframes`, `:focus-visible`, `prefers-reduced-motion` | Layout, component-specific styles |
| **layout.css** | `.sidebar`, `.main`, `h1`–`h4`, `.nav-link`, `.nav-group`, link styles | Responsive overrides, component styles |
| **responsive.css** | `@media` queries only: ≤768, ≤1024, ≥1440, <375 | Base styles, component styles |

### Token Bridge Pattern

```css
/* tokens.css — bridge CDN theme tokens to docs-specific names */
:root, .vl-doc {
    /* Surface (from CDN theme) */
    --vl-doc-bg:        var(--yry-bg-card);
    --vl-doc-bg-soft:   var(--yry-bg-flat);
    --vl-doc-bg-raised: var(--yry-bg-raised);

    /* Text (from CDN theme) */
    --vl-doc-text:         var(--yry-text);
    --vl-doc-text-soft:    var(--yry-text-soft);
    --vl-doc-text-muted:   var(--yry-text-muted);

    /* Brand (from CDN theme) */
    --vl-doc-primary: var(--yry-accent);

    /* Status (from CDN theme) */
    --vl-doc-success: var(--yry-pass);
    --vl-doc-warning: var(--yry-warn);

    /* Border (from CDN theme) */
    --vl-doc-border: var(--yry-border-color, #e2e8f0);

    /* Docs-specific tokens (NOT in CDN theme) */
    --vl-doc-font-sans: 'IBM Plex Sans', ...;
    --vl-doc-font-mono: 'JetBrains Mono', ...;
    --vl-doc-sidebar-width: 280px;
    --vl-doc-content-max-width: 1100px;
    --vl-doc-space-xs: 4px;  /* ... spacing scale, radii, animation tokens ... */
}
```

**Key principle**: All 10 CDN themes define identical `--yry-*` variable names. Changing the theme `<link>` instantly switches colors — zero other file changes.

## Component 4-File Pattern

### `index.html` — Template + Script Includes

```html
<!-- Component Name — purpose description -->
<template id="xxx-template">
    <section id="xxx">
        <h2>{{ sectionTitle }}</h2>
        <p>{{ sectionDescription }}</p>
        <div v-if="items.length">
            <div v-for="(item, i) in items" :key="i">
                <h3>{{ item.name }}</h3>
                <p v-html="item.desc"></p>
            </div>
        </div>
    </section>
</template>

<!-- data.js MUST come before index.js -->
<script src="data.js"></script>
<script src="index.js"></script>
```

**Rules:**
- `<template>` `id` must be globally unique across all components
- `<section>` `id` must match the sidebar navigation anchor (`href="#xxx"`)
- `data.js` before `index.js` — enforced by `include.js` sequential execution
- Use Vue 3 syntax: `v-for`, `v-if`, `v-html`, `{{ }}`, `:bind`, `@click`

### `data.js` — Data Source

```javascript
/**
 * ComponentName 数据源
 * 语言键值对格式，与 mount-component.js 的 i18n: true 配合使用。
 */
window.COMPONENT_CONFIG = {
    /* ── 跨语言常量（可选） ─────────────────────────── */
    constants: {
        repoUrl: 'https://github.com/user/repo'
    },

    /* ── 多语言内容 ───────────────────────────────────── */
    en: {
        sectionTitle: 'Getting Started',
        sectionDescription: 'How to install and run the project.',
        items: [
            { name: 'Step 1', desc: 'Clone the repo.' },
            { name: 'Step 2', desc: 'Install dependencies.' }
        ]
    },
    'zh-CN': {
        sectionTitle: '快速上手',
        sectionDescription: '如何安装和运行项目。',
        items: [
            { name: '第一步', desc: '克隆仓库。' },
            { name: '第二步', desc: '安装依赖。' }
        ]
    }
};
```

**Rules:**
- `window.XXX_CONFIG` key must be globally unique
- `constants` at top level (NOT inside a language slice)
- All language slices must have **identical structure** — same keys, same nesting depth
- Language code keys (`en`, `zh-CN`) are stripped during i18n resolution — don't name data properties with language codes
- Use `v-html` when content contains HTML (`<strong>`, `<a>`)

### `index.js` — Vue 3 Component

```javascript
/**
 * ComponentName Vue 3 组件
 * 由 assets/mount-component.js 公共工具挂载。
 * i18n: true 透明处理语言切换——模板无需修改。
 */
mountDocComponent({
    name: 'DocComponentName',       // Vue devtools + log prefix
    templateId: 'xxx-template',     // matches <template id="...">
    dataKey: 'COMPONENT_CONFIG',    // matches window.XXX_CONFIG
    i18n: true,                     // transparent language switching

    /* ── Extra options (optional) ───────────────────── */
    extra: {
        methods: {
            handleClick: function(id) { /* ... */ }
        },
        computed: {
            filteredItems: function() { return this.items.filter(/* ... */); }
        },
        mounted: function() {
            // DOM-dependent init; track sub-apps: this._mountedApps = []
        },
        beforeUnmount: function() {
            // Cleanup sub-apps, event listeners
        }
    }
});
```

**Rules:**
- **Never call `Vue.createApp()` directly** — always use `mountDocComponent()`
- `name` format: `Doc` + PascalCase (e.g., `DocIntro`, `DocSidebar`)
- `templateId` must exactly match `<template id="...">`
- `dataKey` must exactly match `window.XXX_CONFIG`
- `i18n: true` → `data()` is wrapped to resolve current language slice; listens for `vl-lang-changed`
- Track sub-app instances → unmount in `beforeUnmount` → re-mount on `vl-lang-changed`

### `index.css` — Component Styles (Optional)

```css
/* Scoped under .vl-doc to avoid leaking */
.vl-doc .component-class { /* ... */ }
```

**Rules:**
- Scoped under `.vl-doc` — no bare element selectors
- If the component has `index.css`, register its directory name in `_COMPONENTS_WITH_CSS`:

```javascript
var _COMPONENTS_WITH_CSS = new Set([
    'sidebar',
    'intro',
    // ... add your component name here
]);
```

- **Static whitelist** — never probe with `fetch` HEAD (produces permanent 404 noise)

## Infrastructure Scripts

### `assets/lang.js` — Global Language State

```javascript
window.VL_LANG.current          // → 'en' | 'zh-CN' (read-only getter)
window.VL_LANG.available        // → [{ code, label, native, emoji }]
window.VL_LANG.setLanguage(code) // Switch → persist to localStorage → dispatch 'vl-lang-changed'
window.VL_LANG.onChange(fn)     // Register callback → returns unsubscribe
```

Init: `localStorage('vl-docs-lang')` → `navigator.language` → `'en'`.

### `assets/mount-component.js` — Vue App Factory

```javascript
mountDocComponent({ name, templateId, dataKey, i18n?, extra? })
```

What it does:
1. Resolves `SELF_DIR` from `document.currentScript`'s `data-cs-dir` (set by include.js) or `script.src`
2. Auto-injects `index.css` `<link>` if component is in `_COMPONENTS_WITH_CSS` Set (idempotent)
3. Inserts mount `<div>` before `<template>`
4. Creates `Vue.createApp({ name, template, data, ...extra })`
5. If `i18n: true`: wraps `data()` to resolve current language slice + listens for `vl-lang-changed`

**I18n data resolution** (`i18n: true`):
1. Reads `window[dataKey]` as raw config
2. Checks for language code keys → if yes, resolves current lang slice + merges `constants`
3. Copies `extra.data()` private state into resolved object
4. Injects `currentLang` into data
5. On `vl-lang-changed`: applies new language slice properties directly onto Vue instance

### `assets/include.js` — HTML Inclusion

```javascript
includeHTML() // → Promise, resolves when ALL includes loaded + scripts executed
```

1. Finds all `[data-include]` elements
2. Fetches each target HTML
3. Injects HTML into placeholder
4. **Sequentially executes** all `<script>` tags:
   - External (`<script src="...">`): fetched via `fetch()`, injected as inline — ensures each loads + executes before the next
   - Inline (`<script>...</script>`): injected directly, browser executes synchronously
   - Sets `data-cs-dir` on injected scripts so `mountDocComponent()` can resolve `SELF_DIR`

**This guarantees**: `data.js` always executes before `index.js` within each component.

### `assets/main.js` — Page-Level Logic

```javascript
includeHTML().then(function() {
    // All components mounted
    // Scroll spy: highlight active nav link
    // Smooth scroll: intercept .nav-link clicks
    // Language change: refresh scroll spy on vl-lang-changed
});
```

## Component Categories

| Category | Complexity | Template | Data Source | i18n | CSS | Example |
|----------|-----------|----------|-------------|------|-----|---------|
| **Simple text** | Low | Static HTML | `data.js` | `i18n: true` | None | `contact`, `license` |
| **Table/list** | Low–Med | `v-for` | `data.js` array | `i18n: true` | None | `config`, `api-config` |
| **Cards + sub-apps** | Medium | Containers + slots | `data.js` cards | `i18n: true` | Minimal | `intro` (YrySceneCard) |
| **Code blocks** | Medium | `v-for` + `<pre><code>` | `data.js` snippets | `i18n: true` | None | `quick-start`, `docker` |
| **Interactive** | High | Events, methods | `data.js` + `extra.methods` | `i18n: true` | `index.css` | `sidebar`, `troubleshooting` |
| **Chart-based** | High | `<canvas>` + Chart.js | `data.js` chart data | `i18n: true` | `index.css` | `code-activity` |
| **Static (no data)** | Minimal | Pure HTML | `dataKey` optional | `i18n: false` | None | Rare — prefer data-driven |

## Workflows

### W1: Generate New Doc Page

1. Create `docs/index.html` from entry point template
2. Create `docs/index.css` with `@import` chain
3. Create `docs/styles/tokens.css` — bridge `--yry-*` → `--vl-doc-*`
4. Create `docs/styles/base.css` — reset + shared atoms
5. Create `docs/styles/layout.css` — sidebar + main structure
6. Create `docs/styles/responsive.css` — breakpoints at 375/768/1024/1440
7. Copy `docs/assets/` (reusable across all doc pages)
8. Create components using 4-file pattern
9. Add `data-include` placeholders in `index.html`
10. Select CDN theme (Phase 2)
11. Verify: `file://` URL works directly

### W2: Refactor Existing Static Page

1. **Audit** — identify sections, data, interactive elements
2. **Extract** content into `data.js` (language-keyed if multi-lang)
3. **Template-ify** HTML into Vue `<template>` blocks
4. **Replace** inline JS with Vue declarative syntax (`v-for`, `v-if`, `:bind`, `@click`)
5. **Wire up** `mountDocComponent()` in each `index.js`
6. **Create** entry point `index.html` with CDN deps + `data-include` placeholders
7. **Move** shared styles to `styles/base.css`; component-specific to component `index.css`
8. **Add i18n** by restructuring `data.js` → `{ constants, en, 'zh-CN' }` + `i18n: true`
9. **Verify**: compare screenshots at 375/768/1024/1440px against original

### W3: Add Section to Existing Page

1. Create `docs/components/<name>/` directory
2. Write `index.html` with `<template id="<name>-template">` + script includes
3. Write `data.js` with `window.<NAME>_CONFIG` — match existing language slices
4. Write `index.js`: `mountDocComponent({name, templateId, dataKey, i18n, extra})`
5. Add `data-include="components/<name>/index.html"` placeholder in `docs/index.html`
6. If component has `index.css`, add to `_COMPONENTS_WITH_CSS` Set
7. Add sidebar nav link in `components/sidebar/data.js`

### W4: Add i18n to Existing Component

1. Restructure `data.js`: flat object → `{ constants, en, 'zh-CN' }` with identical structure
2. Change `mountDocComponent()`: `i18n: false` → `i18n: true`
3. Move language-agnostic data to `constants`
4. Template accesses data via direct property names (no `data.en.xxx` — i18n wrapper flattens)
5. If component has sub-apps: add `vl-lang-changed` listener → re-mount; add `beforeUnmount` cleanup

### W5: Switch Theme

1. Change ONE line in `docs/index.html`:
   ```html
   <link rel="stylesheet" href="../cdn/theme/<new-theme>.css">
   ```
2. Verify contrast (especially light↔dark): body text ≥ 4.5:1, secondary ≥ 3:1
3. If no theme fits: copy closest `cdn/theme/<name>.css` → modify hex values in `:root`

### W6: Generate Standalone Sub-Page

For pages under `docs/views/<name>/` (no sidebar, self-contained):

1. Create `docs/views/<name>/index.html` — self-contained HTML
2. Can optionally use Vue 3 CDN + CDN theme + token bridge
3. Can optionally follow 4-file pattern + `mountDocComponent()`
4. Load `assets/lang.js` + `assets/mount-component.js` if using i18n + `mountDocComponent()`
5. No `data-include` cross-dependencies with main docs
6. Link from main docs via sidebar or card navigation

### W7: Add Component with Custom CSS

1. Create `docs/components/<name>/index.css` — `.vl-doc`-scoped styles
2. Add component directory name to `_COMPONENTS_WITH_CSS` Set in `mount-component.js`
3. CSS auto-injected on mount — no manual `<link>` needed; idempotent

## Integrated Design Pipeline

For new pages and major redesigns. Each phase is optional but recommended.

```
User asks for new page / redesign
    │
    ▼
Phase 1: Design Intelligence (rui-ui)
    │  Search UI/UX style guides → style, colors, typography, patterns, anti-patterns
    │  Command: python3 <rui-ui-dir>/scripts/search.py "<query>" --design-system -p "<Project>"
    ▼
Phase 2: Theme Selection (rui-theme)
    │  Pick from 10 CDN themes → match to design system palette
    │  Apply by changing ONE <link> in index.html
    ▼
    ▼
Pre-Delivery Checklist → DONE
```

### Phase 1: Design Intelligence (rui-ui)

Ask clarifying questions (page purpose, audience, tone, page type) → formulate query → run `search.py` → interpret output (style, colors, typography, pattern, anti-patterns) → present to user → map colors to CDN theme.

### Phase 2: Theme Selection (rui-theme)

#### The 10 Themes

| # | Theme | Mode | Primary | Mood | Best For |
|---|-------|------|---------|------|----------|
| 1 | Ocean Depths | Dark | Navy, Teal, Seafoam | Professional, Calm | Corporate, financial |
| 2 | Sunset Boulevard | Light | Burnt Orange, Coral, Gold | Warm, Energetic | Creative, marketing |
| 3 | Forest Canopy | Light | Forest Green, Sage, Olive | Natural, Grounded | Sustainability, wellness |
| 4 | Modern Minimalist | Light | Charcoal, Slate, Light Gray | Clean, Contemporary | General-purpose (default) |
| 5 | Golden Hour | Light | Mustard, Terracotta, Beige | Rich, Sophisticated | Premium brands, editorial |
| 6 | Arctic Frost | Light | Ice Blue, Steel Blue, Silver | Cool, Precise | Data-heavy, analytics |
| 7 | Desert Rose | Light | Dusty Rose, Clay, Sand | Soft, Elegant | Fashion, lifestyle |
| 8 | Tech Innovation | Dark | Electric Blue, Cyan, Dark Gray | Bold, Modern | SaaS, dev tools, startups |
| 9 | Botanical Garden | Light | Fern Green, Marigold, Cream | Fresh, Organic | Health, education |
| 10 | Midnight Galaxy | Dark | Deep Purple, Cosmic Blue, Lavender | Dramatic, Cosmic | Gaming, AI, creative tech |

#### Decision Tree

```
Dark mode needed?
├─ Yes → Corporate? → Ocean Depths (#1)
│        Tech/Bold? → Tech Innovation (#8)
│        Creative/Dramatic? → Midnight Galaxy (#10)
│
└─ No (light mode) → Mood?
    ├─ Clean/neutral → Modern Minimalist (#4)
    ├─ Warm/creative → Sunset Boulevard (#2) or Golden Hour (#5)
    ├─ Cool/technical → Arctic Frost (#6)
    ├─ Natural/earthy → Forest Canopy (#3) or Botanical Garden (#9)
    └─ Soft/elegant → Desert Rose (#7)
```

Full theme details → `<rui-theme-dir>/themes/<name>.md`.

### Phase 3: Post-Generation Verification

Verify pages render correctly: no console errors, critical elements present, theme applied, responsive at 375/768/1024/1440px, i18n switching works, CDN components render, skip-link accessible. For CDN-based pages, `file://` URLs work directly. Open in browser and run through the Pre-Delivery Checklist.

## Critical Rules

### Script Order
- **`data.js` before `index.js`** in every component's `index.html`
- **Entry point**: yry-loader → yry-tag-chip → yry-scene-card → yry-back-top → mount-component.js → lang.js → include.js → main.js

### Data Structure
- All language slices must have **identical structure** — same keys, same nesting, same array lengths
- `constants` is language-agnostic — top level of `window.XXX_CONFIG`, NOT inside a language slice
- Language code keys are stripped during i18n resolution — don't name properties `en`, `zh-CN`, etc.
- Use `v-html` for HTML content, `{{ }}` for plain text

### Template
- `<template>` `id` must be **globally unique** across all components
- `<section>` `id` must match sidebar navigation `href` (`id="quick-start"` ↔ `href="#quick-start"`)
- `v-for` needs `:key`

### CSS
- Scoped under `.vl-doc` — no bare element selectors
- Shared atoms → `base.css`; layout → `layout.css`; responsive overrides → `responsive.css`
- Component styles → `components/<name>/index.css` + registered in `_COMPONENTS_WITH_CSS`
- Use `--yry-*` → `--vl-doc-*` bridge — never hardcode colors from a specific theme

### Component Mounting
- **Never call `Vue.createApp()` directly** — always use `mountDocComponent()`
- Track sub-app instances → unmount in `beforeUnmount` → re-mount on `vl-lang-changed`
- `_COMPONENTS_WITH_CSS` is a **static whitelist** — never probe with `fetch` HEAD

### Infrastructure
- `file://` URLs must work — no build step, no web server dependency
- Prefer pinned CDN versions with SRI integrity hashes

## Pre-Delivery Checklist

- [ ] `file://` URL opens correctly (no build step needed)
- [ ] No console errors on page load
- [ ] Theme applied (`.vl-doc` has non-transparent background)
- [ ] All `data-include` placeholders resolve
- [ ] Language switcher works — all components update on `vl-lang-changed`
- [ ] Sidebar nav links scroll to correct sections
- [ ] Scroll spy highlights active section
- [ ] Responsive at 375px (mobile), 768px (tablet), 1024px (desktop), 1440px (wide)
- [ ] No horizontal overflow at any breakpoint
- [ ] All links correct (`#fragment` internal, `target="_blank" rel="noopener"` external)
- [ ] Touch targets ≥ 44×44px
- [ ] `:focus-visible` styles visible on keyboard navigation
- [ ] Skip link works (Tab → Enter)
- [ ] `prefers-reduced-motion` respected
- [ ] Component CSS registered in `_COMPONENTS_WITH_CSS` if component has `index.css`
- [ ] No memory leaks from sub-app instances

## Reference Files

| File | When to Read |
|------|-------------|
| `docs/index.html` | Entry point pattern — CDN deps, script order, data-include placeholders |
| `docs/index.css` | CSS entry point — @import chain |
| `docs/styles/tokens.css` | Token bridge pattern — `--yry-*` → `--vl-doc-*` |
| `docs/styles/base.css` | Shared UI atoms — code, pre, table, card, callout, badge, tabs, keyframes |
| `docs/styles/layout.css` | Structure — sidebar, main, headings, nav links |
| `docs/styles/responsive.css` | Breakpoints — 768, 1024, 1440, 375px |
| `docs/assets/lang.js` | Language state manager — `VL_LANG` API |
| `docs/assets/mount-component.js` | Vue app factory — `mountDocComponent()` API + auto CSS injection |
| `docs/assets/include.js` | HTML inclusion — `includeHTML()`, sequential script execution |
| `docs/assets/main.js` | Page logic — scroll spy, smooth scroll |
| `docs/components/intro/` | Reference — complex component with sub-apps, cards, i18n |
| `docs/components/sidebar/` | Reference — interactive component with CSS, navigation |
| `docs/components/config/` | Reference — table-based component with i18n |
| `docs/components/contact/` | Reference — simple text component with i18n |
| `cdn/theme/*.css` | CDN theme definitions — all define identical `--yry-*` variable names |
| `<rui-ui-dir>/scripts/search.py --help` | Design intelligence CLI reference |
| `<rui-theme-dir>/themes/*.md` | Exact theme hex values and font pairings |

For architecture diagrams and codebase analysis, see **[[rui-diagram]]**.

## 规则

- [docs-mounting-contracts.md](./rules/docs-mounting-contracts.md) — Vue 3 CDN + 4 文件组件架构、token 桥接、i18n 同构、加载顺序与硬约束。

## 专业代理

- [template-builder.md](./agents/template-builder.md) — 把 markdown 大纲 / 纯稿转换为 Vue 3 `<template>` 片段。
- [i18n-translator.md](./agents/i18n-translator.md) — 多语言 `data.js` 平行切片的同构翻译。
- [theme-integrator.md](./agents/theme-integrator.md) — 主题切换时的链接替换、token 审计与对比度 sanity。

## Borders

### What this skill does

- Generate and refactor documentation pages using the VideoLingo 4-file component pattern (`index.html` + `data.js` + `index.js` + `index.css`)
- Provide `mountDocComponent()` Vue app factory with auto CSS injection and `vl-lang-changed` i18n handling
- Maintain the `@import` CSS chain (`tokens.css` → `base.css` → `layout.css` → `responsive.css`)
- Bridge `--yry-*` CDN theme tokens to `--vl-doc-*` docs-specific tokens in `tokens.css`

### What this skill does NOT do

- **Define CDN components** — `yry-loader` / `yry-tag-chip` / `yry-scene-card` / `yry-back-top` live under `docs/cdn/` and are maintained independently
- **Choose themes** — that is [[rui-theme]]; rui-html references one theme CSS in `<head>`, never curates
- **Produce diagrams / graphs** — see [[rui-diagram]] (SVG architecture) or [[rui-graph]] (Cytoscape code graph)
- **Card data generation** — receives cards from [[rui-scene]] data.js

### Coordinated with

| Skill | Direction | See |
|-------|-----------|-----|
| [[rui-theme]] | consumes | Token bridge to `--yry-*` — `[IF-006](../INTERFACES.md#if-006)` |
| [[rui-scene]] | consumes | Mounts `YrySceneCard` props — `[IF-007](../INTERFACES.md#if-007)` |
| [[rui-diagram]] | consumes | Reads `knowledge-graph.json` for SVG embedding — `[IF-005](../INTERFACES.md#if-005)` |
| [[rui-demos]] | pattern sibling | Same 4-file pattern; views/ sub-pages are a subset of the same architecture |

### Output ownership

| Path | Permission |
|------|-----------|
| `docs/index.html` | **write** (owned) |
| `docs/index.css`, `docs/styles/*.css` | **write** (owned) |
| `docs/assets/mount-component.js`, `include.js`, `lang.js`, `main.js` | **write** (owned) |
| `docs/components/<scene>/` | **write** per scene (one writer per scene, see project_memory.md) |
| `docs/cdn/<name>/` | read-only — CDN components owned by maintainers |
| `docs/views/<name>/` | write when generating new sub-pages |

### Key constraints (must not violate)

- `_COMPONENTS_WITH_CSS` Set must list every component with `index.css`
- Sub-app Vue instances must `unmount()` on `vl-lang-changed` to prevent memory leaks (see project_memory.md)
- Chart instances and timers must be destroyed in `beforeUnmount`
- Deprecated: `window.YrYVueCE.define()` and `docs/styles/components.css` (per project_memory.md)
