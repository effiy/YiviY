---
name: rui-graph
description: Generate interactive source code relationship graphs (源码图谱) from rui-scene card data using Cytoscape.js. Analyze YrySceneCard data structures, extract nodes and edges from card relationships, and produce self-contained dark-theme HTML with interactive graph visualization. Use when the user wants to generate a graph, chart, or network visualization from scene cards, data.js card arrays, or INTRO_CONFIG. Also use when the user mentions 图谱, source graph, card relationships, dependency graph, or wants to visualize card connections.
---

# Rui Graph

Generate interactive source code relationship graphs (源码图谱) from rui-scene card data using **Cytoscape.js** — the industry-standard open source graph library.

For creating scene card data, see **[[rui-scene]]**. For architecture diagrams (SVG), see **[[rui-diagram]]**. For documentation page generation, see **[[rui-html]]**.

```
rui-scene card data → Card Analysis → Node/Edge Extraction → Cytoscape.js Graph
     (data.js)        (classify)       (relationships)      (interactive HTML)
```

## What This Skill Does

Takes rui-scene card data (the `YrySceneCard` props objects found in `data.js` files, `INTRO_CONFIG`, or inline card arrays) and transforms it into an interactive, explorable graph:

- **Cards become nodes** — sized by richness, colored by badge type/domain
- **Tags become nodes** — colored by semantic modifier (`warn`, `accent`, `info`, etc.)
- **Relationships become edges** — `has_tag`, `shares_tag`, `links_to`, `shares_badge`, `has_badge`
- **Link destinations become nodes** — external/internal repos, doc pages, demos

The output is a single self-contained HTML file that works from `file://` URLs — zero build step, zero dependencies beyond Cytoscape.js CDN.

## Decision Tree

```
User has card data and wants...
├─ Interactive graph visualization
│  → Mode A: Full graph (cards + tags + links + all relationships)
│
├─ Simplified card-only network (no tag/link nodes)
│  → Mode B: Card-to-card relationships only
│
├─ Single card deep-dive (expand one card's connections)
│  → Mode C: Ego graph centered on one card
│
├─ Compare two card sets (e.g., en vs zh-CN)
│  → Mode D: Side-by-side or merged with language color
│
└─ Embed graph in existing docs page
   → Mode E: Generate graph as a standalone view (views/<name>/graph/)
```

## Graph Design System

### Node Types

| Node Type | Source | Color | Shape | Size |
|-----------|--------|-------|-------|------|
| **Card** | Each `{name, desc, ...}` object | By `badge` (Report=rose, Core=emerald, Guide=sky, OSS=amber, Agent=purple, default=cyan) | Rounded rectangle | By richness: desc length + tag count + has links |
| **Tag** | Each `tags[{text, modifier}]` | By `modifier` (warn=orange, accent=yellow, info=blue, red=red, purple=violet, cyan=teal, pass=green) | Ellipse | By co-occurrence count |
| **Link Dest** | Each `links[{label, href}]` | Slate `#64748b` | Diamond | Uniform small |
| **Badge** | Each unique `badge` value | Matches badge color | Triangle | Uniform small |

### Edge Types

| Edge Type | Source → Target | Line Style | Width | Meaning |
|-----------|----------------|------------|-------|---------|
| `has_tag` | Card → Tag | Solid, curved | 1 | This card has this tag |
| `shares_tag` | Card ↔ Card | Dashed, `#94a3b8` | 0.5 | Two cards share ≥1 tag |
| `has_badge` | Card → Badge | Solid, straight | 2 | This card has this badge |
| `shares_badge` | Card ↔ Card | Dashed, colored by badge | 1 | Two cards share same badge |
| `links_to` | Card → Link Dest | Dotted, `#475569` | 1 | Card links to this URL |
| `shares_link` | Card ↔ Card | Dotted, `#475569` | 0.5 | Two cards link to same URL |

### Color Palette — Badge → Cytoscape

| Badge | Color | Hex | Background |
|-------|-------|-----|------------|
| `Core` / `核心` | Emerald | `#34d399` | `rgba(6, 78, 59, 0.4)` |
| `Report` / `报告` | Rose | `#fb7185` | `rgba(136, 19, 55, 0.4)` |
| `Guide` / `指南` | Sky | `#38bdf8` | `rgba(8, 51, 68, 0.4)` |
| `OSS` | Amber | `#fbbf24` | `rgba(120, 53, 15, 0.3)` |
| `Agent` | Purple | `#a78bfa` | `rgba(76, 29, 149, 0.4)` |
| `Beta` | Orange | `#fb923c` | `rgba(120, 53, 15, 0.3)` |
| (no badge) | Cyan | `#22d3ee` | `rgba(8, 51, 68, 0.4)` |

### Tag Modifier → Color

| Modifier | Color | Hex |
|----------|-------|-----|
| `warn` | Orange | `#f59e0b` |
| `accent` | Yellow/Amber | `#eab308` |
| `info` | Blue | `#3b82f6` |
| `red` | Red | `#ef4444` |
| `purple` | Violet | `#8b5cf6` |
| `cyan` | Teal | `#06b6d4` |
| `pass` / `green` | Emerald | `#22c55e` |
| (unknown) | Slate | `#64748b` |

## Mode A: Full Graph (Default)

The complete picture — every card, every tag, every link destination, and all relationships between them. This is the default mode and the richest visualization.

### Step 1: Locate Card Data

Find the card data source. Common locations:
- `docs/components/intro/data.js` → `window.INTRO_CONFIG` (features + cards arrays)
- `docs/components/<name>/data.js` → `window.<NAME>_CONFIG`
- Any `.js` file exporting a card array or `INTRO_CONFIG`-shaped object
- User-provided inline JSON

If the data uses `INTRO_CONFIG` pattern with i18n, default to the `en` language slice (or the user's preferred language). For multi-language comparison, use Mode D.

### Step 2: Parse and Classify

Extract all card objects from the data source. For each card, classify:

1. **Domain/Tier** — Rich (has meta + tags + badge), Standard (has tags), Nav (has nameHref), or Minimal
2. **Badge type** — what badge does it carry?
3. **Tag profile** — what tags + modifiers?
4. **Link profile** — `null` (defaults), `[]` (hidden), or `[...]` (custom)?
5. **Richness score** — desc length + tag count + (has links ? 1 : 0) + (has meta ? 1 : 0) + (has badge ? 1 : 0)

### Step 3: Build Graph Elements

```javascript
// For each card: create a Card node
{
  data: {
    id: 'card:0',
    type: 'card',
    label: '🎥 yt-dlp',
    badge: 'OSS',
    desc: 'YouTube video download via yt-dlp · ...',
    tags: ['1.2k sites', 'Python'],
    meta: 'MIT · v2024.12.01',
    richness: 5,
    href: 'views/yt-dlp/index.html'
  }
}

// For each unique tag: create a Tag node
{
  data: {
    id: 'tag:Python',
    type: 'tag',
    label: 'Python',
    modifier: 'info'
  }
}

// Card → Tag edges
{
  data: {
    id: 'edge:card0:tag:Python',
    source: 'card:0',
    target: 'tag:Python',
    type: 'has_tag'
  }
}

// Card ↔ Card edges (shared tags)
{
  data: {
    id: 'edge:card0:card1:shares_tag',
    source: 'card:0',
    target: 'card:1',
    type: 'shares_tag',
    shared: 'Python'
  }
}
```

### Step 4: Generate HTML

Use `resources/template.html` as the base. The template includes:
- Cytoscape.js 3.x from CDN
- Dark theme (`#020617` background, JetBrains Mono)
- Layout selector toolbar (cose-bilkent, dagre, breadthfirst, concentric, grid, circle)
- Filter panel (by badge, by tag modifier, by domain)
- Search box (highlight matching nodes)
- Side panel (click node → show card details)
- Export toolbar (Copy PNG, Download PNG)
- Legend

### Step 5: Verify

Open the generated HTML in a browser (works from `file://`). Verify:
- All cards appear as nodes
- Tag nodes show correct modifier colors
- Edge types are visually distinct
- Layout switcher works
- Search filters correctly
- Click node → detail panel updates
- Export PNG works

## Mode B: Card-Only Network

Simplified view — only card nodes, no tag/link destination nodes. Edges connect cards that share tags or badges. Best for dense card grids where tag nodes would clutter.

```javascript
// Only Card nodes + shares_tag + shares_badge edges
// No Tag, Link Dest, or Badge nodes
```

Use this mode when:
- More than 20 cards (tag nodes cause visual overload)
- User asks for "clean" or "simple" view
- Embedding in a small container

## Mode C: Ego Graph

Deep-dive on one card. Show the focal card + all directly connected tags, links, and cards. 1-hop neighborhood. Best for exploring "what's related to this card?"

```javascript
// Center on card:X
// Include: card:X + its tags + its links + cards sharing tags
// Exclude: everything else (or dim to 10% opacity)
```

## Mode D: Language Comparison

When data has i18n (e.g., `INTRO_CONFIG.en` and `INTRO_CONFIG['zh-CN']`), show both language versions. Cards with same structure but different language → connected by `translates_to` edges. Color-coded: en = blue, zh-CN = red, ja = green, etc.

## Mode E: Docs Page Embed

Generate graph as a `docs/views/<name>/graph/index.html` sub-page, following the rui-html standalone sub-page pattern. Link from main docs via sidebar or card navigation.

## Graph Features (All Modes)

### Layouts

| Layout | Best For | When to Use |
|--------|----------|-------------|
| **cose-bilkent** (default) | General purpose, organic | Most card sets — compound nodes for badge groups |
| **dagre** | Hierarchical, left→right or top→down | Pipeline/step cards, reports with clear hierarchy |
| **breadthfirst** | Tree, root → leaves | Navigation cards, dependency chains |
| **concentric** | Radial, hub → satellite | Core features + supporting features |
| **grid** | Even spacing, no overlap | Small card sets (<12), comparison views |
| **circle** | Ring, equidistant | Symmetric view, no hierarchy implied |

### Interaction

| Feature | Implementation |
|---------|---------------|
| **Pan** | Mouse drag (default) |
| **Zoom** | Scroll wheel (default) |
| **Click node** | Select + show detail in side panel |
| **Double-click node** | Focus on node (ego graph highlight) |
| **Hover node** | Highlight 1-hop neighbors, dim others |
| **Search** | Type → highlight matching nodes by name/label/tag |
| **Filter** | Toggle buttons: show/hide by badge type, tag modifier, domain |

### Side Panel (Node Detail)

Clicking a node shows:
- **Card node**: name, badge, full desc (HTML rendered), tags list, meta, links (clickable)
- **Tag node**: tag text, modifier, used-by count, list of cards with this tag
- **Link Dest node**: URL, label, list of cards linking here
- **Badge node**: badge text, list of cards with this badge

## Workflows

### W1: Generate Graph from INTRO_CONFIG

The most common flow — take `docs/components/intro/data.js` and graph its `features` + `cards` arrays.

1. Read `docs/components/intro/data.js`
2. Extract `window.INTRO_CONFIG.en.features` and `window.INTRO_CONFIG.en.cards`
3. Classify each card (tier, badge, tags, links)
4. Build nodes + edges
5. Generate HTML from template
6. Save to `docs/views/intro-graph/index.html` (or user-specified path)
7. Open in browser for verification

### W2: Generate Graph from Any data.js

Same as W1 but for any component's `data.js`.

1. Read target `data.js`
2. Extract card arrays (may be nested in language slices)
3. Build graph
4. Output HTML

### W3: Generate Graph from Inline Card Data

User pastes card data directly in conversation.

1. Parse the card objects
2. Build graph
3. Output HTML

### W4: Compare Two Card Sets

1. Read two card arrays (e.g., features vs cards, or en vs zh-CN)
2. Build merged graph with set membership coloring
3. Output HTML with comparison legend

## Template Structure

The HTML template (`resources/template.html`) is a complete, self-contained page:

```
┌─────────────────────────────────────────────────────┐
│ [Header] Title · pulse dot · subtitle               │
├────────────────────┬────────────────────────────────┤
│ [Toolbar]          │                                │
│ Layout: [dropdown] │     Cytoscape.js Canvas        │
│ Filter: [toggles]  │     (fills remaining space)    │
│ Search: [input]    │                                │
│                    │                                │
│ [Legend]           │                                │
│ ■ Core  ■ Report   │                                │
│ ■ Guide ■ OSS      │                                │
│                    │                                │
├────────────────────┴────────────────────────────────┤
│ [Detail Panel] — shown when node clicked            │
│ Name · Badge · Desc · Tags · Meta · Links           │
└─────────────────────────────────────────────────────┘
```

## Critical Rules

- **Cytoscape.js from CDN** — use `https://cdn.jsdelivr.net/npm/cytoscape@3.x/dist/cytoscape.min.js`. No npm, no build.
- **Self-contained HTML** — no external CSS/JS files beyond CDN. Inline everything.
- **`file://` URLs must work** — no web server required.
- **Dark theme** — background `#020617`, match VideoLingo design system.
- **JetBrains Mono** — match rui-diagram and rui-html typography.
- **Node colors match badge/tag semantics** — don't invent new color mappings. Use the palette tables above.
- **Edge types visually distinct** — solid for has_tag, dashed for shares_tag, dotted for links_to.
- **Preserve card data fidelity** — desc supports HTML (`<strong>`, `<code>`), render in detail panel with `v-html`/`innerHTML`.
- **Layout selector works** — switching layouts should animate (cytoscape `animate: true`).
- **Export works** — PNG export using `cy.png()` or html2canvas fallback.

## Reference Files

| File | When to Read |
|------|-------------|
| `resources/template.html` | Base HTML template — copy and customize for each graph |
| `references/graph-system.md` | Full graph design system — all node/edge types, color palettes, layout configs, CSS variables |

## Output Checklist

Before finalizing a graph HTML:

- [ ] All cards from source data appear as nodes
- [ ] Tags have correct modifier colors (not all `info`)
- [ ] Badge nodes use correct badge→color mapping
- [ ] Edge types are visually distinct (solid/dashed/dotted)
- [ ] Layout switcher cycles through ≥3 layouts
- [ ] Search filters work (case-insensitive)
- [ ] Click node → detail panel populates
- [ ] Hover → neighbor highlight works
- [ ] Export PNG produces correct image
- [ ] `file://` URL opens without errors
- [ ] Dark theme applied (`#020617` bg, JetBrains Mono)
- [ ] Legend matches actual node colors
- [ ] No duplicate node IDs
- [ ] No dangling edges (all source/target IDs exist)

## Example

### Input: INTRO_CONFIG features array (partial)

```javascript
[
  { name: '🎥 yt-dlp', badge: 'OSS',
    desc: 'YouTube video download · <strong>1,200+ sites</strong>',
    tags: [{ text: '1.2k sites', modifier: 'accent' }, { text: 'Python', modifier: 'info' }],
    links: [...] },
  { name: '🎙️ WhisperX', badge: 'Core',
    desc: 'Word-level subtitle recognition · <strong>low-illusion</strong>',
    tags: [{ text: 'word-level', modifier: 'accent' }, { text: 'diarization', modifier: 'info' }],
    links: [...] }
]
```

### Output: Interactive Graph

- 2 Card nodes (OSS=amber, Core=emerald)
- 4 Tag nodes (accent=yellow ×2, info=blue ×2)
- `has_tag` edges: yt-dlp→"1.2k sites", yt-dlp→"Python", WhisperX→"word-level", WhisperX→"diarization"
- No `shares_tag` edges (no tag overlap in this subset)
- Click "🎥 yt-dlp" → panel shows full desc with rendered HTML, all tags, all links
