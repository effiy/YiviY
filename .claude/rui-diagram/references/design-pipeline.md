# Design Pipeline — 4-Phase Guide

Detailed walkthrough of the integrated design pipeline: codebase analysis (multi-agent KG), rui-ui design intelligence, and rui-theme selection.

---

## Phase 0: Codebase Understanding (Pre-Generation)

**Tool:** Multi-agent analysis pipeline producing a typed Knowledge Graph. Read `references/codebase-analysis.md` for the full methodology.

**Purpose:** Extract real architecture and code structure into a single, typed KG that feeds both diagram generation (Mode A) and documentation (Mode B). The KG uses a 21-type node taxonomy and 35-type edge taxonomy across 8 categories — deterministic edges from tree-sitter/grep, semantic summaries from LLM reasoning.

### When to Use

| Scenario | Run Phase 0? | Depth |
|----------|-------------|-------|
| Architecture diagram for existing codebase | **Strongly recommended** | Full KG |
| Documentation for existing project | **Recommended** | Full KG (or targeted subgraph) |
| Incremental update (code changed since last analysis) | **Recommended** | Fingerprint-based diff → partial re-analysis |
| Impact analysis ("will this break anything?") | **Recommended** | Diff impact only (blast radius) |
| Subdomain / multi-project merge | **Full + merge** | Per-project analysis + cross-domain reconciliation |
| Knowledge base / wiki analysis | **Knowledge mode** | Article extraction, entity linking |
| New project from scratch | Skip | — |
| Quick prototype (<20 files) | Manual quick path | Read README + key files, sketch manually |

### Analysis Levels

The fingerprint-based change classifier determines the analysis depth:

| Update Level | Condition | Passes Re-run |
|-------------|-----------|---------------|
| **SKIP** | All files unchanged or cosmetic-only | None |
| **PARTIAL_UPDATE** | <10 structural changes, same directories | Changed files only (Passes 2-3, 6) |
| **ARCHITECTURE_UPDATE** | New/deleted directories or >10 structural files | Changed files + architecture + tour (Passes 2-6) |
| **FULL_UPDATE** | >30 structural files or >50% changed | All passes (1-7) |

### Step-by-Step

**1. Full KG pipeline** (for diagrams and comprehensive docs):
- **Pre-flight:** Worktree detection, language directive, fingerprint check, ignore config, subdomain merge check.
- **SCAN:** Discover languages, frameworks, entry points, file inventory with `fileCategory` classification.
- **BATCH & ANALYZE:** Tree-sitter structural extraction + LLM semantic analysis — produce typed `GraphNode[]` and `GraphEdge[]`.
- **ASSEMBLE & REVIEW:** Merge batches, normalize IDs, canonicalize edges, validate completeness against scan inventory.
- **ARCHITECTURE:** Classify every node into exactly one of 3-10 logical layers with descriptions.
- **TOUR:** Generate 5-15 dependency-ordered learning tour steps (bottom-up: foundational → consumers).
- **VALIDATE:** 4-tier pipeline — sanitize, auto-fix, schema validation, referential integrity.
- **SAVE:** Write `knowledge-graph.json` + `meta.json` + fingerprint baseline. Report summary by node/edge type.

Each layer becomes a region boundary or grouping in the diagram.
Each typed node maps to a diagram box with semantic coloring from the 10-layer palette.
Each typed edge maps to an arrow between components.

**2. Targeted subgraph** (for focused documentation):
- Ask focused questions about the subsystem being documented.
- Run the KG pipeline scoped to the relevant directories (use `--path` argument).
- Read key files directly: entry points, config types, main service modules.
- Trace data flows through the code via edge traversal (follow `imports`→`calls`→`reads_from`/`writes_to` chains).

**3. Diff-aware analysis** (for updates and impact assessment):
- Fingerprint comparison identifies changed files at STRUCTURAL/COSMETIC/NONE granularity.
- Map changed files to `GraphNode.id[]` by filePath.
- Compute 1-hop and 2-hop dependents via edge traversal.
- Classify risk: `high` (hub node or auth/config layer), `medium` (service/data layer, 3-10 dependents), `low` (utility, <3 dependents).
- Highlight changes in the output: dashed borders on changed components, `*` markers, "Recent Changes" section in docs.

**Output:** A typed Knowledge Graph (JSON) with nodes, edges, layers, tours, and optional diff impact — the single source of truth for all downstream generation.

---

## Phase 1: Design Intelligence (Pre-Generation)

**Tool:** rui-ui (`python3 <rui-ui-dir>/scripts/search.py`)

**Purpose:** Replace arbitrary design decisions with data-driven recommendations based on page content type, audience, and purpose.

### When to Use

| Scenario | Run Phase 1? |
|----------|-------------|
| Generating a new doc page | **Strongly recommended** |
| Major redesign of existing page | **Recommended** |
| Adding a single section to existing page | Skip (follow existing design system) |
| Quick prototype / draft | Optional (ask user) |
| Architecture diagram generation | Skip (diagrams use the fixed dark theme palette) |

### Step-by-Step

**1. Ask clarifying questions.** Before any code:

- What is this page about? (e.g., "API reference for a TTS engine")
- Who is the audience? (e.g., "Python developers, intermediate+")
- What tone? (e.g., "Professional and technical but approachable")
- Page type? (landing, documentation index, tutorial, API reference, etc.)

**2. Formulate a query.** Combine page type + product category + tone + keywords:

```
"technical documentation API reference machine learning professional clean"
```

Query tips:
- Use multi-dimensional keywords: `"<page_type> <product> <tone> <density>"`
- Density hints: "content-dense" for reference docs, "spacious" for landing pages
- Try 2-3 variations if the first query returns generic results

**3. Run the design system generator:**

```bash
python3 <rui-ui-dir>/scripts/search.py "<query>" --design-system -p "<Project Name>"
```

If you want markdown output (easier to parse for docs):
```bash
python3 <rui-ui-dir>/scripts/search.py "<query>" --design-system -p "<Project Name>" -f markdown
```

**4. Interpret the output.** The design system returns:

| Field | What It Means | How to Apply |
|-------|--------------|--------------|
| **Product Category** | e.g., "Developer Tool" | Informs layout density and component choices |
| **Style** | Name + keywords + effects | Determines section layout, card style, animation feel |
| **Colors** | 10+ swatches with hex + CSS var names | Map to closest CDN theme (see theme-reference.md matching table) |
| **Typography** | Heading + body fonts, Google Fonts URLs | Update `--vl-doc-font-sans` in tokens.css; add `@import` to index.css |
| **Pattern** | Recommended section order | Determines which components to create and their sequence |
| **Effects** | Shadows, blur, radius, animation style | Apply in base.css and component CSS |
| **Anti-Patterns** | What to avoid | Check against during implementation |
| **Pre-Delivery Checklist** | Items to verify | Run through before declaring done |

**5. Present to user.** Summarize key findings and ask for adjustments:

```
"Based on analysis for your [page type]:
- Style: [name] — [why it fits]
- Colors: [primary], [accent], [background], [text]
- Fonts: [heading] + [body]
- Layout pattern: [section order]
- Key things to avoid: [top 2-3 anti-patterns]

Does this look right? Any adjustments before I start building?"
```

**6. Map colors to a CDN theme.** Use the matching table in `theme-reference.md` to find the closest CDN theme. If no good match, note which `--yry-*` variables to override in tokens.css.

**7. Optional: persist for multi-page projects:**

```bash
python3 <rui-ui-dir>/scripts/search.py "<query>" --design-system -p "<Project>" --persist
```

This creates `design-system/<project>/MASTER.md`. For subsequent pages in the same project, read this file instead of re-running the analysis.

---

## Phase 2: Theme Selection (During Generation)

**Tool:** rui-theme (`<rui-theme-dir>/themes/*.md`)

**Purpose:** Give users a choice of professionally designed themes instead of defaulting to Modern Minimalist.

### When to Use

| Scenario | Run Phase 2? |
|----------|-------------|
| Generating a new doc page | **Always** |
| Major redesign | **Always** |
| Adding a section | Skip (use existing theme) |
| Architecture diagrams | Skip (diagrams use fixed dark theme) |

### Step-by-Step

**1. Present the 10 themes.** Use the table from `theme-reference.md`. If Phase 1 was run, highlight which themes best match the design system's color recommendations.

**2. Help the user choose.** Ask: "Which theme? I recommend [X] based on your [design system / content type / audience]."

**3. Apply the theme.** Change ONE line in `docs/index.html`:

```html
<link rel="stylesheet" href="../cdn/theme/ocean-depths.css">
```

All other files (tokens.css, base.css, layout.css, all components) work automatically — they reference `--yry-*` variables which every CDN theme defines identically.

**4. Verify contrast.** After applying a dark theme, check that:
- Body text contrast ≥ 4.5:1
- Secondary text contrast ≥ 3:1
- Links are distinguishable from body text
- Code blocks have sufficient background contrast

**5. If no theme fits:** Generate a custom one:
- Copy the closest `cdn/theme/<name>.css` as a base
- Modify the hex values to match the design system's palette
- Ensure ALL `--yry-*` variables are defined (see existing theme for the full list)

---

---

## Complete End-to-End Example

```
User: "Create a documentation page for VideoLingo's TTS engine"

1. ASK: "Who's the audience? What tone? Page type? Is this for an existing codebase?"
   → "Developers, technical reference with some tutorials, needs comparison table.
      Yes, the TTS engine code is in this repo."

2. PHASE 0 — Codebase Understanding:
   Read key TTS files → trace pipeline stages → identify 5 stages:
   text preprocess → phonemize → infer → vocode → postprocess.
   Key configs: voice profiles, speed/rate, output formats.

3. PHASE 1 — Design Intelligence:
   $ python3 <rui-ui-dir>/scripts/search.py \
       "technical documentation configuration reference developer tools" \
       --design-system -p "VideoLingo TTS"

   Results:
   - Style: Technical/Data-Dense, clean grid layouts
   - Colors: Slate blue primary, amber accents
   - Fonts: JetBrains Mono (code), Inter (body)
   - Pattern: Overview > Quick Start > Reference > Comparison > Troubleshooting
   - Anti-patterns: excessive animations, low-contrast text

   → Present to user. User: "Looks good, but green accent instead of amber?"

4. PHASE 2 — Theme Selection:
   Present 10 themes. Based on cool-but-warm + developer audience:
   - Best match: Forest Canopy (green tones, light mode)
   - Alternative: Arctic Frost (blue, more technical)

   → User: "Forest Canopy"

5. GENERATION:
   - docs/index.html → <link href="../cdn/theme/forest-canopy.css">
   - tokens.css → JetBrains Mono for code, Inter for body
   - Components (informed by Phase 0 pipeline knowledge):
     intro, quick-start, config-reference, comparison-table,
     advanced (5-stage pipeline detail), troubleshooting, footer
   - Green accent bridged from Forest Canopy's --yry-accent

6. PHASE 3 — Verification:
   - Playwright: desktop 1440px ✓, mobile 375px ✓
   - Console: no errors
   - i18n: language switch works
   - Theme: Forest Canopy colors applied correctly
   - Contrast: all text ≥ 4.5:1

7. Pre-delivery checklist → all items pass → DONE
```
