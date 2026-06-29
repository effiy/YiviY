---
name: rui-graph
description: Generate interactive source code relationship graphs (源码图谱) from rui-scene card data using Cytoscape.js. Analyze YrySceneCard data structures, extract nodes and edges from card relationships, and produce self-contained dark-theme HTML with interactive graph visualization. Use when the user wants to generate a graph, chart, or network visualization from scene cards, data.js card arrays, or INTRO_CONFIG. Also use when the user mentions 图谱, source graph, card relationships, dependency graph, or wants to visualize card connections.
---

# Rui Graph

Generate interactive source code relationship graphs (源码图谱) from rui-scene card data using **Cytoscape.js** — the industry-standard open source graph library. This skill follows a structured phased pipeline for reliable, validated graph generation.

For creating scene card data, see **[[rui-scene]]**. For architecture diagrams (SVG), see **[[rui-diagram]]**. For documentation page generation, see **[[rui-html]]**.

```
rui-scene card data → Card Analysis → Node/Edge Extraction → Cytoscape.js Graph
     (data.js)        (classify)       (relationships)      (interactive HTML)
```

## What This Skill Does

Takes rui-scene card data (the `YrySceneCard` props objects found in `data.js` files, `INTRO_CONFIG`, or inline card arrays) and transforms it into an interactive, explorable graph:

- **Cards become nodes** — sized by richness, colored by badge type/domain
- **Tags become nodes** — colored by semantic modifier (`warn`, `accent`, `info`, etc.)
- **Relationships become edges** — `has_tag`, `shares_tag`, `links_to`, `shares_badge`, `has_badge`, `depends_on`, `related_to`, `extends`, `implements`
- **Link destinations become nodes** — external/internal repos, doc pages, demos
- **Badge groups become nodes** — aggregate badge types

The output follows the project's file convention — **4 files** in a `graph/` subdirectory alongside the card data source, mirroring `index.html` + `index.js` + `index.css` + `data.js` (same pattern as `rui-scene` and `rui-html` components). Works from `file://` URLs — zero build step, zero dependencies beyond Cytoscape.js CDN. An intermediate `graph-data.json` is also produced for reuse, validation, and incremental updates.

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
├─ Embed graph in existing docs page
│  → Mode E: Generate graph as a standalone view (views/<name>/graph/)
│
├─ Analyze and visualize arbitrary JSON/YAML data as a graph
│  → Mode F: Generic data-to-graph conversion
│
└─ Update existing graph incrementally (changed cards only)
   → Mode G: Incremental update from git diff
```

---

## Phased Pipeline

This skill executes graph generation in **5 phases**, inspired by the understand-anything analysis pipeline. Each phase has clear inputs, outputs, and validation gates.

### Phase Overview

| Phase | Name | Input | Output | Deterministic |
|-------|------|-------|--------|:---:|
| 0 | Pre-flight | User args / file paths | Resolved config, card data source | ✓ |
| 1 | Parse & Classify | Card data source | `card-analysis.json` | ✗ (LLM-assisted) |
| 2 | Build Graph | Card analysis | `graph-data.json` (nodes + edges) | ✓ (script) + ✗ (LLM) |
| 3 | Review & Validate | Graph data | `review.json` (issues + warnings) | ✓ (script) |
| 4 | Generate HTML | Validated graph data | `index.html` (self-contained) | ✓ |
| 5 | Save & Report | All artifacts | Final output, summary report | ✓ |

---

## Phase 0 — Pre-flight

Determine the card data source, output paths, and mode.

### Step 1: Resolve Data Source

Identify the card data location. Common paths:
- `docs/components/intro/data.js` → `window.INTRO_CONFIG` (features + cards arrays)
- `docs/components/<name>/data.js` → `window.<NAME>_CONFIG`
- Any `.js` file exporting a card array or `INTRO_CONFIG`-shaped object
- User-provided inline JSON

If the data uses `INTRO_CONFIG` pattern with i18n, default to the `en` language slice unless the user specifies otherwise. For multi-language comparison, use Mode D.

### Step 2: Resolve Mode

Parse user intent:
- `--mode full` or default → Mode A
- `--mode simple` / `--clean` → Mode B
- `--mode ego --card <name>` → Mode C
- `--mode compare --languages en,zh-CN` → Mode D
- `--mode embed --view <name>` → Mode E
- `--mode generic` → Mode F
- `--incremental` / existing graph exists + changed files → Mode G

### Step 3: Check for Existing Graph (Incremental)

If `graph-data.json` exists at the output location:
1. Read `meta.json` (if exists) to get last source hash
2. Compute current source hash: `md5` of the card data
3. If unchanged → report "Graph is up to date" and **STOP** (or ask: rebuild / review / skip)
4. If changed → compute diff for incremental update (Mode G)

### Step 4: Prepare Output Directory

Graph output follows the project's file structure convention. The output directory is determined by the data source:

| Data Source | Output Directory | Files |
|-------------|-----------------|-------|
| `docs/components/<name>/data.js` | `docs/components/<name>/graph/` | `index.html`, `index.js`, `index.css`, `data.js` |
| `docs/components/intro/data.js` | `docs/components/intro/graph/` | same 4 files |
| User-specified standalone | `docs/views/<name>/graph/` | same 4 files |
| Inline data (W3) | user-specified path | same 4 files |

```bash
mkdir -p docs/components/<name>/graph/
# or docs/views/<name>/graph/ for standalone views
```

### Step 5: Report

> `[Phase 0/5] Pre-flight complete. Mode: <mode>, Source: <path>, Cards: <count>`

---

## Phase 1 — Parse & Classify

Extract and classify all card objects from the data source. This phase combines deterministic extraction with LLM-assisted classification.

### Step 1: Extract Card Data

Read the source file. Extract all card objects. For `INTRO_CONFIG`-shaped data:
- `features[]` — feature cards with badges, tags, links
- `cards[]` — navigation/link cards

For each card, capture all fields: `name`, `badge`, `desc`, `tags[{text, modifier}]`, `links[{label, href}]`, `meta`, `nameHref`, `emoji`.

### Step 2: Classify Each Card

For every card extracted, classify using both deterministic rules and LLM judgment:

**Deterministic classification:**
1. **Domain/Tier** — Rich (has meta + tags + badge), Standard (has tags), Nav (has nameHref), or Minimal (name only)
2. **Badge type** — normalize badge value (Core/核心 → core, Report/报告 → report, etc.)
3. **Tag profile** — extract tag texts and modifiers; validate modifiers against known set
4. **Link profile** — `null` (defaults hidden), `[]` (hidden), or `[...]` (custom)
5. **Richness score** — `1 + min(desc.length / 50, 3) + tags.length * 0.5 + (hasLinks ? 1 : 0) + (hasMeta ? 1 : 0) + (hasBadge ? 0.5 : 0)`

**LLM-assisted classification:**
6. **Card category** — infer from name + desc + tags: `tool`, `service`, `library`, `framework`, `pipeline-step`, `resource`, `documentation`, `entry-point`, `config`
7. **Card relationships** — detect implicit relationships beyond shared tags: `depends_on` (this card describes a tool that depends on another), `related_to` (topical connection), `extends` (this card's subject extends another), `implements` (this card's subject implements a spec/interface)
8. **Semantic tags** — enrich tags with inferred ones: `video-processing`, `audio-processing`, `ml-model`, `cli-tool`, `web-service`, `data-format`, etc.

### Step 3: Tag Co-occurrence Analysis

Build a co-occurrence matrix for all tags:
- Count how many cards share each tag
- Tag node size = co-occurrence count (more shared = larger)
- Detect tag clusters (groups of tags that frequently appear together)

### Step 4: Write Card Analysis

Write `card-analysis.json` to the intermediate directory:

```json
{
  "source": "docs/components/intro/data.js → INTRO_CONFIG.en",
  "cardCount": 15,
  "tagCount": 42,
  "badges": ["Core", "Report", "OSS", "Guide"],
  "cards": [
    {
      "id": "card:0",
      "name": "🎥 yt-dlp",
      "badge": "OSS",
      "desc": "YouTube video download · <strong>1,200+ sites</strong>",
      "tags": [{"text": "1.2k sites", "modifier": "accent"}, {"text": "Python", "modifier": "info"}],
      "links": [{"label": "GitHub", "href": "https://github.com/yt-dlp/yt-dlp"}],
      "meta": "MIT · v2024.12.01",
      "richness": 5,
      "tier": "rich",
      "category": "tool",
      "href": "views/yt-dlp/index.html",
      "relationships": [
        {"target": "card:3", "type": "depends_on", "reason": "yt-dlp output feeds into WhisperX"}
      ],
      "semanticTags": ["video-download", "cli-tool"]
    }
  ],
  "tagCooccurrence": {
    "Python": {"count": 5, "cards": ["card:0", "card:3", "card:7"]},
    "1.2k sites": {"count": 1, "cards": ["card:0"]}
  },
  "tagClusters": [
    {"name": "Audio Processing", "tags": ["Python", "audio", "whisper", "speech"]},
    {"name": "Video Pipeline", "tags": ["video", "download", "encode"]}
  ]
}
```

Report: `Phase 1 complete. Parsed <N> cards, <M> unique tags, <B> badges.`

---

## Phase 2 — Build Graph

Transform card analysis into Cytoscape.js-compatible graph elements. This phase uses a deterministic script for element construction, supplemented by LLM-enhanced edge creation.

### Step 1: Run Graph Builder Script

The bundled `resources/build-graph.py` script reads `card-analysis.json` and produces `graph-data.json`:

```bash
python3 <SKILL_DIR>/resources/build-graph.py \
  <output_dir>/intermediate/card-analysis.json \
  <output_dir>/graph-data.json \
  --mode <mode>
```

The script performs deterministically:
- Creates Card nodes (with badge→color mapping, richness→size mapping)
- Creates Tag nodes (with modifier→color mapping, co-occurrence→size mapping)
- Creates Link Dest nodes (diamond shape)
- Creates Badge group nodes (triangle shape)
- Creates `has_tag` edges (card → tag)
- Creates `shares_tag` edges (card ↔ card, when share ≥1 tag)
- Creates `has_badge` edges (card → badge)
- Creates `shares_badge` edges (card ↔ card)
- Creates `links_to` edges (card → link dest)
- Creates `shares_link` edges (card ↔ card)
- Deduplicates nodes by ID
- Deduplicates edges by `(source, target, type)`
- Drops dangling edges (source/target not in node set)
- For Mode B: filters to card-only nodes + shares_tag/shares_badge edges
- For Mode C: filters to ego graph (1-hop from focal card)
- For Mode D: merges two card sets with language coloring
- For Mode G: merges incremental changes into existing graph

The script also incorporates LLM-discovered edges from Phase 1:
- `depends_on` edges (card → card, solid, weighted)
- `related_to` edges (card → card, dashed)
- `extends` edges (card → card, solid with arrow)
- `implements` edges (card → card, dotted with arrow)

### Step 2: Verify Output

Check that `graph-data.json` exists and is valid JSON. Verify:
- `nodes` array exists and is non-empty
- `edges` array exists
- All node IDs are unique
- All edge source/target references exist in nodes
- Node count matches card count + tag count + link dest count (within mode)

### Step 3: Report

> `Phase 2 complete. Built graph with <N> nodes, <E> edges.`

---

## Phase 3 — Review & Validate

Validate the generated graph for correctness, completeness, and quality.

### Step 1: Deterministic Validation Script

Run the bundled validation script:

```bash
node <SKILL_DIR>/resources/validate-graph.js \
  <output_dir>/graph-data.json \
  <output_dir>/intermediate/review.json
```

The script checks:
1. **Schema validation** — every node has `id`, `type`, `label`; every edge has `source`, `target`, `type`
2. **Referential integrity** — every edge source/target references an existing node ID
3. **Uniqueness** — no duplicate node IDs or edge keys
4. **Color mapping** — badge and modifier colors match the canonical palette
5. **Edge type validity** — all edge types are in the known set
6. **Orphan detection** — nodes with zero edges (warning, not critical)
7. **Card coverage** — every card from source appears as a node
8. **Richness consistency** — richness scores match computed values

Output: `{ "issues": [...], "warnings": [...], "stats": {...} }`

### Step 2: LLM Review (Optional, --review flag)

If `--review` is specified, dispatch a subagent using the **graph-reviewer** agent definition (`agents/graph-reviewer.md`). The agent reads `graph-data.json`, cross-validates against `card-analysis.json`, and produces a detailed review.

Pass these parameters:
> Validate the graph at `<output_dir>/graph-data.json`.
> Card analysis at: `<output_dir>/intermediate/card-analysis.json`
> Write review to: `<output_dir>/intermediate/review-llm.json`

### Step 3: Apply Fixes

If `issues` array is non-empty:
- Remove edges with dangling references
- Fill missing required fields with sensible defaults
- Normalize color values to canonical palette
- Re-run validation after fixes
- If critical issues remain after one fix attempt, save with warnings and report

### Step 4: Report

> `Phase 3 complete. <X> issues, <Y> warnings. Graph is <VALID/INVALID>.`

---

## Phase 4 — Generate Output Files

Produce the 4-file output package following the project's `index.html` + `index.js` + `index.css` + `data.js` convention.

### Step 1: Read Templates

Read the 4 resource templates from `resources/`:

| Template | Purpose |
|----------|---------|
| `resources/index.html` | Light wrapper: `<div id="cy">`, sidebar, detail panel, toolbar. Loads `index.css` + `data.js` + `index.js`. |
| `resources/index.css` | Dark theme styles (CSS variables, layout, responsive breakpoints), JetBrains Mono font import. |
| `resources/index.js` | Cytoscape.js init, graph style, layout switcher, search, filter, click→detail, hover→highlight, export, keyboard shortcuts. |
| `resources/data.js` | `window.GRAPH_DATA = { elements: [...], meta: {...} }` — the generated nodes + edges + metadata. |

The templates separate concerns: HTML = structure, CSS = theme, JS = logic, data.js = content. This matches the project's `docs/components/<name>/` pattern.

### Step 2: Inject Graph Data

Generate `data.js` by writing `window.GRAPH_DATA` with:
- `elements`: the nodes + edges arrays from `graph-data.json` (Cytoscape.js compatible format)
- `meta`: stats (node count, edge count, card count, badges, source)

### Step 3: Mode-Specific Customization

- **Mode B**: `index.js` simplifies sidebar (only card legend), hides tag/badge filters
- **Mode C**: `index.js` adds "ego center" indicator, breadcrumb to return to full graph
- **Mode D**: `index.js` adds language toggle, `index.css` adds language color styles
- **Mode E**: `index.css` uses compact layout, `index.js` omits sidebar init
- **Mode F**: `index.js` uses generic node colors, no badge/tag assumptions

### Step 4: Write Output Files

Save the 4 files to the output directory:
```
<output_dir>/
├── index.html
├── index.js
├── index.css
└── data.js
```

### Step 5: Report

> `Phase 4 complete. 4 files written to <output_dir>/`

---

## Phase 5 — Save & Report

Finalize outputs, clean up, and report to the user.

### Step 1: Save Graph Data

Copy `graph-data.json` to the output directory (alongside the 4 output files) for future incremental updates and reuse.

### Step 2: Write Metadata

Write `meta.json` to the intermediate directory:

```json
{
  "version": "1.0.0",
  "generatedAt": "<ISO 8601>",
  "sourceHash": "<md5 of card data>",
  "mode": "full",
  "cardCount": 15,
  "nodeCount": 67,
  "edgeCount": 142,
  "source": "docs/components/intro/data.js"
}
```

### Step 3: Clean Up

Remove intermediate files (keep `graph-data.json` and `meta.json` for incremental updates).

### Step 4: Report Summary

```
── Rui Graph Summary ──────────────────
Project: VideoLingo Intro Cards
Source:  docs/components/intro/data.js → INTRO_CONFIG.en
Mode:    full

Cards:   15 (8 rich, 5 standard, 2 nav)
Tags:    42 unique
Badges:  Core(4), Report(3), OSS(3), Guide(3), Agent(2)
Links:   18 destinations

Nodes:   67 total (15 cards + 42 tags + 6 badges + 4 link dests)
Edges:   142 total (42 has_tag, 15 has_badge, 35 shares_tag, 18 links_to, 12 shares_badge, 8 depends_on, 12 related_to)

Layers:  (tag clusters) Audio Processing, Video Pipeline, ML Models, DevOps

Output:  docs/components/intro/graph/
         ├── index.html    (structure + toolbar + canvas)
         ├── index.js       (Cytoscape init + interactions)
         ├── index.css      (dark theme + responsive)
         └── data.js        (GRAPH_DATA: 67 nodes, 142 edges)

Validation: ✓ PASSED (0 issues, 2 warnings)
```

### Step 5: Offer Next Steps

- "Open `index.html` in browser to explore the graph"
- "Run with `--review` for LLM quality review"
- "Use `--incremental` to update when card data changes"

---

## Graph Design System

### Node Types (5 types + 1 mode-specific)

| Node Type | Source | Color | Shape | Size |
|-----------|--------|-------|-------|------|
| **Card** | Each `{name, desc, ...}` object | By `badge` (Report=rose, Core=emerald, Guide=sky, OSS=amber, Agent=purple, Beta=orange, default=cyan) | Rounded rectangle | By richness: `100 + richness * 15` × `44 + richness * 8` |
| **Tag** | Each `tags[{text, modifier}]` | By `modifier` (warn=orange, accent=yellow, info=blue, red=red, purple=violet, cyan=teal, pass=green) | Ellipse | By co-occurrence count: `70 + count * 5` × `30 + count * 3` |
| **Link Dest** | Each `links[{label, href}]` | Slate `#64748b` | Diamond | Uniform: 60×60 |
| **Badge** | Each unique `badge` value | Matches badge color | Triangle | Uniform: 44×44 |
| **Cluster** | Tag co-occurrence clusters | Soft version of dominant modifier | Hexagon | By cluster member count |
| **Card Group** (Mode D) | Language-specific card sets | Language color (en=blue, zh-CN=red, ja=green) | Rectangle (parent compound) | Wraps child card nodes |

### Edge Types (9 types)

| Edge Type | Source → Target | Line Style | Width | Weight | Meaning |
|-----------|----------------|------------|-------|--------|---------|
| `has_tag` | Card → Tag | Solid, `#475569` | 1 | 0.8 | This card has this tag |
| `shares_tag` | Card ↔ Card | Dashed, `#94a3b8` | 0.5 | 0.4 | Two cards share ≥1 tag |
| `has_badge` | Card → Badge | Solid, colored by badge | 2 | 0.9 | This card has this badge |
| `shares_badge` | Card ↔ Card | Dashed, colored by badge | 1 | 0.5 | Two cards share same badge |
| `links_to` | Card → Link Dest | Dotted, `#475569` | 1 | 0.6 | Card links to this URL |
| `shares_link` | Card ↔ Card | Dotted, `#334155` | 0.5 | 0.3 | Two cards link to same URL |
| `depends_on` | Card → Card | Solid, `#22d3ee` | 1.5 | 0.7 | Subject dependency (LLM-inferred) |
| `related_to` | Card → Card | Dashed, `#64748b` | 0.8 | 0.4 | Topical relationship (LLM-inferred) |
| `extends` | Card → Card | Solid, `#a78bfa` | 1.5 | 0.8 | Subject extends another (LLM-inferred) |
| `implements` | Card → Card | Dotted, `#34d399` | 1.2 | 0.7 | Subject implements spec (LLM-inferred) |

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
| (unknown / default) | Slate | `#64748b` |

### Language Colors (Mode D)

| Language | Color | Hex |
|----------|-------|-----|
| `en` / English | Blue | `#3b82f6` |
| `zh-CN` / Chinese | Red | `#ef4444` |
| `ja` / Japanese | Green | `#22c55e` |
| `ko` / Korean | Violet | `#8b5cf6` |
| (other) | Amber | `#f59e0b` |

## Mode Reference

### Mode A: Full Graph (Default)

All nodes and edges. Best for exploration. Use when card count ≤ 50.

### Mode B: Card-Only Network

Only Card nodes + `shares_tag`, `shares_badge`, `depends_on`, `related_to`, `extends`, `implements` edges. No Tag/Link/Badge nodes. Use when >20 cards or "clean" view desired.

### Mode C: Ego Graph

Single card deep-dive. Specify focal card with `--card <name>`. Shows: focal card + directly connected tags + directly connected cards + link destinations. 1-hop neighborhood. Non-neighbor nodes dimmed to 10% opacity.

### Mode D: Language Comparison

Compare two language versions of the same card set. Cards with same structure but different language connected by `translates_to` edges. Language color overlays on card nodes.

### Mode E: Docs Page Embed

Compact, no-sidebar variant for embedding in existing documentation pages. Output follows the same 4-file convention (`index.html` + `index.js` + `index.css` + `data.js`) but with compact styles and minimized UI. Placed in `docs/views/<name>/graph/` for standalone views or `docs/components/<name>/graph/` for component sub-pages.

### Mode F: Generic Data-to-Graph

Analyze arbitrary JSON/YAML arrays and produce nodes + edges. Auto-detects:
- Object keys → node properties
- Array fields with shared values → edges
- Nested objects → compound/parent nodes
- String arrays → tag-like nodes

### Mode G: Incremental Update

Update existing `graph-data.json` when source card data changes:
1. Compute diff (added/removed/modified cards)
2. Remove nodes/edges for removed cards
3. Add nodes/edges for new cards
4. Recompute shared edges (shares_tag, shares_badge, shares_link)
5. Preserve LLM-inferred edges for unchanged cards
6. Validate and save

## Graph Features (All Modes)

### Layouts

| Layout | Best For | When to Use |
|--------|----------|-------------|
| **cose-bilkent** (default) | General purpose, organic | Most card sets — force-directed with compound support |
| **dagre LR** | Left→right hierarchy | Pipeline/step cards, reports |
| **dagre TB** | Top→bottom hierarchy | Dependency chains, layered architecture |
| **breadthfirst** | Tree, root → leaves | Navigation cards, strict hierarchies |
| **concentric** | Radial, hub → satellite | Core features + supporting features |
| **grid** | Even spacing, no overlap | Small card sets (<12), comparison views |
| **circle** | Ring, equidistant | Symmetric view, no hierarchy |

### Interaction

| Feature | Trigger | Behavior |
|---------|---------|----------|
| **Pan** | Mouse drag | Move viewport |
| **Zoom** | Scroll wheel | Zoom in/out |
| **Select** | Click node | Show detail in side panel |
| **Focus** | Double-click node | Center + zoom on node, highlight 1-hop |
| **Hover highlight** | Hover node | Highlight 1-hop neighbors, dim others |
| **Search** | Type in search box | Highlight matching nodes, dim others (debounced 250ms) |
| **Filter** | Toggle filter buttons | Show/hide by badge type |
| **Reset** | Click Reset / press R | Clear search, clear selection, fit view |
| **Fit** | Click Fit / press F | Fit all visible nodes to viewport |

### Side Panel (Node Detail)

Clicking a node shows type-specific detail:

| Node Type | Detail Content |
|-----------|---------------|
| **Card** | Name, badge, full desc (HTML rendered), tags list, meta, links (clickable), connected tag count, related card count, richness score |
| **Tag** | Tag text, modifier, used-by count, list of cards with this tag (clickable to focus) |
| **Link Dest** | URL, label, list of cards linking here (clickable to focus) |
| **Badge** | Badge text, list of cards with this badge (clickable to focus) |
| **Cluster** | Cluster name, member tags, member cards |

### Export

- **Download PNG**: `cy.png({ full: true, scale: 2, bg: '#020617' })` — high-res, dark background
- **Copy PNG**: Clipboard API with `ClipboardItem` — paste directly into docs/slides
- **Fallback**: html2canvas CDN loaded as backup if `cy.png()` fails

## Output File Structure

Graph output follows the project's 4-file convention, matching `docs/components/<name>/`:

```
docs/components/<name>/graph/
├── index.html    ← Light wrapper: toolbar, canvas, sidebar, detail panel
├── index.js      ← Cytoscape init, styles, layouts, search, filter, export
├── index.css     ← Dark theme CSS variables, layout, responsive breakpoints
└── data.js       ← window.GRAPH_DATA = { elements: [...], meta: {...} }
```

| File | Role | What It Contains |
|------|------|-----------------|
| `index.html` | Structure | Header with title + action buttons, toolbar (layout selector dropdown, search input, badge filter buttons), main layout (sidebar + cy canvas + detail panel), toast, CDN script tags |
| `index.js` | Logic | `cy` init with `GRAPH_DATA.elements`, `getGraphStyle()` (node/edge styles by type), `switchLayout()` (7 layouts), `doSearch()` (debounced), `filterByBadge()`, click→`updateDetail()`, hover→highlight, PNG export, keyboard shortcuts, `initUI()` (populates stats/legend/filters from `cy` instance) |
| `index.css` | Theme | `:root` CSS variables (`--bg: #020617`, badge colors), header/toolbar/sidebar styles, graph container, detail panel styles (badge chips, tag chips, link styles), toast, responsive breakpoints (1024px, 768px, 480px) |
| `data.js` | Data | `window.GRAPH_DATA = { elements: [...nodes/edges...], meta: { nodeCount, edgeCount, cardCount, badges, source } }` — the single injection point |

### Data Injection Pattern

`index.html` loads scripts in order:
```html
<script src="https://cdn.jsdelivr.net/npm/cytoscape@3.30.4/dist/cytoscape.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dagre@0.8.5/dist/dagre.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/cytoscape-dagre@2.5.0/cytoscape-dagre.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/cytoscape-cose-bilkent@4.1.0/cytoscape-cose-bilkent.min.js"></script>

<link rel="stylesheet" href="index.css">
<script src="data.js"></script>   <!-- ← window.GRAPH_DATA defined here -->
<script src="index.js"></script>   <!-- ← reads window.GRAPH_DATA, builds cy -->
```

This separation means: change data → only regenerate `data.js`; change layout → only edit `index.css`; change interactions → only edit `index.js`.

## Workflows

### W1: Generate Graph from INTRO_CONFIG

Most common flow — graph the `features` + `cards` arrays from `docs/components/intro/data.js`.

1. Read `docs/components/intro/data.js` (Phase 0)
2. Extract `window.INTRO_CONFIG.en.features` and `window.INTRO_CONFIG.en.cards` (Phase 1)
3. Classify each card: tier, badge, tags, links, richness, category, relationships (Phase 1)
4. Build nodes + edges → `graph-data.json` (Phase 2)
5. Validate graph (Phase 3)
6. Generate 4 output files → `docs/components/intro/graph/{index.html,index.js,index.css,data.js}` (Phase 4)
7. Save artifacts, report summary (Phase 5)
8. Open in browser for verification

### W2: Generate Graph from Any data.js

Same as W1 but for any component's `data.js`.

1. Read target `data.js` (Phase 0)
2. Extract card arrays (may be nested in language slices) (Phase 1)
3. Build graph (Phase 2)
4. Validate, generate HTML, save (Phases 3-5)

### W3: Generate Graph from Inline Card Data

User pastes card data directly in conversation.

1. Parse the card objects from the user's message (Phase 0-1)
2. Classify (Phase 1)
3. Build graph (Phase 2)
4. Generate HTML (Phase 4, skip validation by default)
5. Return HTML content inline or write to file

### W4: Compare Two Card Sets

1. Read two card arrays (e.g., features vs cards, or en vs zh-CN) (Phase 0)
2. Classify both sets independently (Phase 1)
3. Build merged graph with set membership coloring (Phase 2, Mode D)
4. Add `translates_to` edges for cards present in both sets (Phase 2)
5. Generate HTML with comparison legend (Phase 4)

### W5: Incremental Update

1. Compute source hash, compare to stored `meta.json` (Phase 0)
2. Identify changed cards (added/removed/modified) (Phase 0)
3. Parse & classify only changed cards (Phase 1)
4. Merge changes into existing `graph-data.json` (Phase 2, Mode G)
5. Recompute shared edges (shares_tag, shares_badge, shares_link) (Phase 2)
6. Validate (Phase 3), generate HTML (Phase 4), save (Phase 5)

## Critical Rules

- **Cytoscape.js from CDN** — use `https://cdn.jsdelivr.net/npm/cytoscape@3.30.4/dist/cytoscape.min.js`. No npm, no build.
- **Layout plugins from CDN** — `cytoscape-dagre@2.5.0`, `cytoscape-cose-bilkent@4.1.0`, `dagre@0.8.5`.
- **Self-contained HTML** — no external CSS/JS files beyond CDN. Inline everything.
- **`file://` URLs must work** — no web server required for the HTML file.
- **`graph-data.json` for reuse** — always save the intermediate JSON alongside the HTML.
- **Dark theme** — background `#020617`, surface `#0f172a`, border `#1e293b`. Match VideoLingo design system.
- **JetBrains Mono** — from Google Fonts CDN. Match rui-diagram and rui-html typography.
- **Node colors match badge/tag semantics** — use the canonical palettes. Do not invent new color mappings.
- **Edge types visually distinct** — solid for structural (has_tag, depends_on), dashed for shared (shares_tag, shares_badge), dotted for external (links_to, shares_link).
- **Preserve card data fidelity** — desc supports HTML (`<strong>`, `<code>`), render in detail panel with `innerHTML`.
- **Layout selector works** — switching layouts should animate (`animate: true`).
- **Export works** — PNG export using `cy.png()` with html2canvas fallback.
- **Keyboard accessible** — Ctrl+F → search, Escape → reset, R → reset, F → fit.
- **Validation before save** — always run Phase 3 validation. Save with warnings if issues cannot be auto-fixed.
- **Incremental when possible** — if `graph-data.json` + `meta.json` exist, offer incremental update for changed data.
- **No silent drops** — every warning from validation must appear in the final report.

## Reference Files

| File | When to Read |
|------|-------------|
| `resources/index.html` | Base HTML wrapper template — structure for header, toolbar, canvas, sidebar, detail panel |
| `resources/index.js` | Graph logic template — Cytoscape init, styles, layout switcher, search, filter, interactions, export |
| `resources/index.css` | Dark theme stylesheet template — CSS variables, layout, responsive breakpoints |
| `resources/data.js` | Data template — `window.GRAPH_DATA` shape, copy and inject generated elements |
| `resources/build-graph.py` | Deterministic graph builder — Phase 2 |
| `resources/validate-graph.js` | Deterministic validation script — Phase 3 |
| `references/graph-system.md` | Full graph design system — all node/edge types, color palettes, layout configs, CSS variables |
| `references/edge-types.md` | Expanded edge type reference with weights, line styles, and creation rules |
| `references/validation.md` | Validation rules, check details, and fix guidance |
| `agents/card-analyzer.md` | Agent definition for LLM-assisted card classification (Phase 1) |
| `agents/graph-builder.md` | Agent definition for LLM-assisted graph assembly (Phase 2) |
| `agents/graph-reviewer.md` | Agent definition for LLM graph quality review (Phase 3) |

## Output Checklist

Before finalizing a graph:

- [ ] All cards from source data appear as nodes
- [ ] Tags have correct modifier colors (not all defaulting to `info`)
- [ ] Badge nodes use correct badge→color mapping
- [ ] Edge types are visually distinct (solid/dashed/dotted)
- [ ] Layout switcher cycles through ≥3 layouts with animation
- [ ] Search filters work (case-insensitive, debounced)
- [ ] Click node → detail panel populates with type-specific content
- [ ] Hover → neighbor highlight + dim non-neighbors
- [ ] Export PNG produces correct image at 2x scale
- [ ] `file://` URL opens without errors (test in browser)
- [ ] Dark theme applied (`#020617` bg, JetBrains Mono font)
- [ ] Legend matches actual node/edge colors in the graph
- [ ] No duplicate node IDs (validated in Phase 3)
- [ ] No dangling edges — all source/target IDs exist (validated in Phase 3)
- [ ] `graph-data.json` saved alongside the 4 output files (for incremental updates)
- [ ] `meta.json` written with source hash and generation metadata
- [ ] Keyboard shortcuts functional (Ctrl+F, Escape, R, F)
- [ ] `doSearch()` dims edges disconnected from search hits (not just nodes)
- [ ] `resetView()` properly reactivates the "All" filter button (not `null` btn)
- [ ] `escHtml()` escapes single quotes (`'` → `&#39;`) for safe onclick attributes
- [ ] `filterByBadge()` handles all node types: card, tag, link_dest, badge, **cluster**
- [ ] `focusNode()` guards against empty collection (`!node.length`) before animating
- [ ] `.detail-badge` has default fallback (border/color/background) for unknown badge types
- [ ] Output follows project convention: `index.html` + `index.js` + `index.css` + `data.js`

## Browser Console Error Prevention

The following are **real bugs** found in production graphs. Every generated graph MUST be checked against this list:

### 🐛 Bug 1: `resetView` doesn't re-activate filter button

**Symptom:** After clicking a badge filter then pressing `R` to reset, no filter button shows as active.

**Root cause:** `resetView()` calls `filterByBadge('all', null)` — the `null` button means no button gets `.active` class.

**Fix:** Find the "All" button via `document.querySelector('#badge-filters .filter-btn')` and pass it:
```javascript
var allBtn = document.querySelector('#badge-filters .filter-btn');
window.filterByBadge('all', allBtn);
```

### 🐛 Bug 2: `escHtml` doesn't escape single quotes

**Symptom:** If any badge/label name contains `'`, onclick handlers break with JS syntax error.

**Root cause:** `escHtml()` escapes `&`, `<`, `>`, `"` but NOT `'`. Since onclick attributes use single-quote delimiters (`onclick="fn('val', this)"`), an unescaped `'` in the value breaks the JS.

**Fix:** Add `'` → `&#39;` to `escHtml`:
```javascript
return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
```

### 🐛 Bug 3: `doSearch` only dims nodes, leaves edges visible

**Symptom:** After searching, dimmed nodes have undimmed edges between them, or undimmed edges connect dimmed to highlighted nodes.

**Root cause:** Only `cy.nodes().addClass('dimmed')` is called; edges are never dimmed.

**Fix:** After setting node classes, dim edges not connected to any search-hit node:
```javascript
cy.edges().forEach(function(e) {
  if (e.source().hasClass('search-hit') || e.target().hasClass('search-hit')) {
    e.removeClass('dimmed');
  } else {
    e.addClass('dimmed');
  }
});
```

### 🐛 Bug 4: `filterByBadge` missing `cluster` node type

**Symptom:** When filtering by badge, cluster nodes always remain visible even when disconnected from visible cards.

**Root cause:** The visibility logic only handles `card`, `tag`, `link_dest`, and `badge` types. `cluster` nodes are ignored and stay visible.

**Fix:** Add `|| n.data('type') === 'cluster'` to the conditional.

### 🐛 Bug 5: `focusNode` doesn't guard against missing nodes

**Symptom:** If `focusNode('bad-id')` is called (e.g., from a stale detail panel click), `cy.getElementById('bad-id').length` is 0, and subsequent calls silently fail.

**Fix:** Guard with `if (!node || !node.length) return;`

### 🐛 Bug 6: `.detail-badge` has no default colors

**Symptom:** Unknown badge types in the detail panel show a transparent badge with no visible border/background.

**Root cause:** `.detail-badge` base class has `border: 1px solid` without a color, and no `background` or `color`. Only modifier classes (`.badge-core`, etc.) set these.

**Fix:** Add defaults:
```css
.detail-badge {
  border: 1px solid var(--border);
  color: var(--text-soft);
  background: var(--border);
}
```

## Error Handling

- If card data source is not found → report and **STOP**
- If card data is malformed → report parsing errors and **STOP**
- If `build-graph.py` fails → report script errors, retry once with `--verbose`, then **STOP** if still failing
- If validation finds critical issues → auto-fix once, re-validate. If still failing, save with warnings and report
- If HTML generation fails → report template errors and **STOP**
- **Always save partial results** — a graph with warnings is better than no graph
- **Never silently drop errors** — every failure must be visible in the Phase 5 summary
- **Run the Browser Console Error Prevention checklist** before finalizing — these are bugs that pass structural validation but fail at runtime

## Example

### Input: INTRO_CONFIG features array (partial)

```javascript
[
  { name: '🎥 yt-dlp', badge: 'OSS',
    desc: 'YouTube video download · <strong>1,200+ sites</strong>',
    tags: [{ text: '1.2k sites', modifier: 'accent' }, { text: 'Python', modifier: 'info' }],
    links: [{ label: 'GitHub', href: 'https://github.com/yt-dlp/yt-dlp' }] },
  { name: '🎙️ WhisperX', badge: 'Core',
    desc: 'Word-level subtitle recognition · <strong>low-illusion</strong>',
    tags: [{ text: 'word-level', modifier: 'accent' }, { text: 'Python', modifier: 'info' }, { text: 'diarization', modifier: 'info' }],
    links: [{ label: 'GitHub', href: 'https://github.com/m-bain/whisperX' }] }
]
```

### Output: Interactive Graph

- 2 Card nodes (OSS=amber, Core=emerald)
- 3 unique Tag nodes (accent=yellow ×2, info=blue for "Python" ×1 shared, info=blue for "diarization" ×1)
- `has_tag` edges: yt-dlp→"1.2k sites", yt-dlp→"Python", WhisperX→"word-level", WhisperX→"Python", WhisperX→"diarization"
- `shares_tag` edge: yt-dlp↔WhisperX (share "Python" tag)
- LLM-inferred: yt-dlp `depends_on` relationship? (maybe — yt-dlp feeds WhisperX if card analysis infers it)
- Click "🎥 yt-dlp" → panel shows full desc with rendered HTML, all tags, link to GitHub
- Click "Python" tag → panel shows used by 2 cards: yt-dlp, WhisperX
