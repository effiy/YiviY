---
name: rui-graph
description: Generate interactive code dependency graphs from Python source code using Cytoscape.js. Analyze .py files to extract import relationships, class hierarchies, function call graphs, and module structures, producing self-contained dark-theme HTML with interactive graph visualization. Use when the user wants to visualize code dependencies, import graphs, call graphs, class hierarchies, or module structures. Also use when the user mentions 源码图谱, dependency graph, code graph, import map, function-level dependencies, or wants to see how source files connect. **Do not use for multi-language architecture diagrams** — see [[rui-diagram]].
lifecycle: default-pipeline
---

# Rui Graph — Code Dependency Graph

Generate interactive **code dependency graphs** from Python source code using **Cytoscape.js**. This skill analyzes `.py` files to extract files, classes, functions, and their relationships (imports, calls, inheritance, containment, exports), producing a self-contained dark-theme HTML page with interactive graph visualization.

For creating documentation pages, see **[[rui-html]]**. For architecture diagrams (SVG), see **[[rui-diagram]]**.

```
Python source tree → AST Parse → Symbol Extraction → Graph Build → Cytoscape.js Graph
   (.py files)        (imports,     (nodes: file,    (edges: imports,   (interactive HTML)
                       classes,       class, func,     calls, inherits,
                       functions)     module)          contains, exports)
```

## What This Skill Does

Takes a Python source directory and transforms its code structure into an interactive, explorable graph:

- **Files become nodes** — rectangle, sized by line count, colored by tier (core/library/utility)
- **Classes become nodes** — hexagon, colored violet, showing inheritance and methods
- **Functions become nodes** — ellipse, colored emerald, showing call relationships
- **Modules (`__init__.py`) become nodes** — diamond, colored amber, showing re-exports
- **Imports become `imports` edges** — solid arrow between files
- **Calls become `calls` edges** — dashed arrow between functions
- **Inheritance becomes `inherits` edges** — bold solid arrow between classes
- **Containment becomes `contains` edges** — thin solid line from file to its definitions
- **Re-exports become `exports` edges** — dotted cyan arrow from `__init__.py` to submodules

The output follows the project's file convention — **4 files** in a `graph/` subdirectory: `index.html` + `index.js` + `index.css` + `data.js`. Works from `file://` URLs — zero build step, zero dependencies beyond Cytoscape.js CDN.

## Decision Tree

```
User has Python source code and wants...
├─ Interactive graph of the full codebase
│  → Mode A: Full graph (files + classes + functions + modules + all edges) — DEFAULT
│
├─ Module-level overview (no functions/classes, just files + imports)
│  → Mode B: Module-only graph
│
└─ Single module deep-dive (expand one package's internals)
   → Mode C: Single-module focus
```

---

## Phased Pipeline

This skill executes graph generation in **5 phases**.

### Phase Overview

| Phase | Name | Input | Output |
|-------|------|-------|--------|
| 0 | Pre-flight | User args / source directory | Resolved config, file manifest |
| 1 | Parse & Analyze | Python source files | `code-analysis.json` |
| 2 | Build Graph | Code analysis | `graph-data.json` (nodes + edges) |
| 3 | Validate | Graph data | Validation report |
| 4 | Generate Output | Validated graph data | 4 output files (index.html + js + css + data.js) |
| 5 | Save & Report | All artifacts | Final output, summary report |

---

## Phase 0 — Pre-flight

### Step 1: Resolve Source Directory

Identify the Python source directory to analyze. Common patterns:
- `site-packages/<package_name>/` — installed package
- `src/<package_name>/` — project source
- User-specified path

Exclude these subdirectories by default (they add noise):
- `extractor/`, `downloader/`, `postprocessor/` — plugin-heavy directories with hundreds of similar files
- `test/`, `tests/` — test files
- `compat/` — compatibility shims

### Step 2: Resolve Mode

Parse user intent:
- `--mode full` or default → Mode A (all node types, all edge types)
- `--mode modules` / `--simple` → Mode B (files + modules + imports/exports only)
- `--mode deep --module <name>` → Mode C (single module + all contained symbols + direct dependencies)

### Step 3: Prepare Output Directory

Graph output follows the project's file structure convention:

| Source | Output Directory | Files |
|--------|-----------------|-------|
| `docs/views/<name>/` (standalone) | `docs/views/<name>/graph/` | `index.html`, `index.js`, `index.css`, `data.js` |
| User-specified path | `<path>/graph/` | same 4 files |

### Step 4: Report

> `[Phase 0/5] Pre-flight complete. Mode: <mode>, Source: <path>, Files: <count>`

---

## Phase 1 — Parse & Analyze

Extract symbols and relationships from Python source files using AST analysis.

### Step 1: Walk Source Tree

List all `.py` files in the source directory (respecting exclusions). For each file, record:
- Relative path within the package
- File basename
- Whether it's an `__init__.py` (treated as `module` node type)

### Step 2: AST-Parse Each File

For each `.py` file, parse the AST to extract:

**Imports:**
- `import X` → resolve to target file
- `from .module import X` → relative import, resolve to sibling file
- `from package.module import X` → absolute import, resolve within the package

**Class Definitions:**
- Class name
- Base classes (from `ClassDef.bases`)
- Methods (from `ClassDef.body` — filter for `FunctionDef`)

**Function Definitions (module-level):**
- Function name
- Calls within body (from `Call` nodes — same-file only, best-effort)

### Step 3: Classify Each Entity

**File tier:**
- **Core** — >1000 lines, or top-level orchestrator (e.g., `YoutubeDL.py`, `__init__.py` with `main()`)
- **Library** — 100–1000 lines, or named feature module
- **Utility** — <100 lines, or leaf module

**Class category:**
- **Orchestrator** — large class with 30+ methods, central to the system
- **Abstract** — ABC with abstract methods
- **Data** — dataclass / simple data holder
- **Handler** — request handler, plugin, or concrete implementation

**Function role:**
- **Entry point** — `main()`, `_real_main()`, CLI-facing
- **Core logic** — key pipeline function
- **Utility** — helper, formatter, converter

### Step 4: Build Symbol Index

Create a mapping from qualified names to node IDs for edge creation:
```
"YoutubeDL" → class:YoutubeDL
"extract_info" → func:extract_info
"download" → func:download
```

### Step 5: Write Code Analysis

Write `code-analysis.json`:

```json
{
  "source": "site-packages/yt_dlp/",
  "fileCount": 22,
  "classCount": 25,
  "functionCount": 25,
  "moduleCount": 3,
  "files": [
    {
      "id": "file:yt_dlp/YoutubeDL.py",
      "path": "yt_dlp/YoutubeDL.py",
      "basename": "YoutubeDL.py",
      "lines": 4542,
      "tier": "core",
      "type": "file",
      "classes": ["class:YoutubeDL"],
      "functions": [],
      "imports": ["file:yt_dlp/utils/__init__.py", "file:yt_dlp/networking/__init__.py"],
      "importedBy": ["file:yt_dlp/__init__.py"]
    }
  ],
  "classes": [
    {
      "id": "class:YoutubeDL",
      "name": "YoutubeDL",
      "fileId": "file:yt_dlp/YoutubeDL.py",
      "baseClasses": [],
      "methods": ["func:extract_info", "func:download", "func:urlopen"],
      "category": "orchestrator"
    }
  ],
  "functions": [
    {
      "id": "func:extract_info",
      "name": "extract_info",
      "fileId": "file:yt_dlp/YoutubeDL.py",
      "classId": "class:YoutubeDL",
      "calls": ["func:urlopen", "func:process_video_result"],
      "calledBy": ["func:download"],
      "role": "core_logic"
    }
  ],
  "modules": [
    {
      "id": "module:yt_dlp",
      "name": "yt_dlp",
      "path": "yt_dlp/",
      "initFileId": "file:yt_dlp/__init__.py",
      "exports": ["file:yt_dlp/YoutubeDL.py", "file:yt_dlp/options.py"]
    }
  ]
}
```

Report: `Phase 1 complete. Parsed <N> files, <C> classes, <F> functions, <M> modules.`

---

## Phase 2 — Build Graph

Transform code analysis into Cytoscape.js-compatible graph elements.

### Step 1: Create Nodes

**File nodes** (one per `.py` file):
```
{ data: { id: 'file:yt_dlp/YoutubeDL.py', type: 'file', label: 'YoutubeDL.py',
          path: 'yt_dlp/YoutubeDL.py', lines: 4542, tier: 'core', module: 'yt_dlp' } }
```

**Class nodes** (one per class definition):
```
{ data: { id: 'class:YoutubeDL', type: 'class', label: 'YoutubeDL',
          file: 'file:yt_dlp/YoutubeDL.py', methodCount: 69 } }
```

**Function nodes** (one per module-level function or key method):
```
{ data: { id: 'func:extract_info', type: 'function', label: 'extract_info()',
          file: 'file:yt_dlp/YoutubeDL.py', class: 'YoutubeDL' } }
```

**Module nodes** (one per `__init__.py` / package):
```
{ data: { id: 'module:yt_dlp', type: 'module', label: 'yt_dlp',
          path: 'yt_dlp/', submoduleCount: 3 } }
```

### Step 2: Create Edges

**`contains` edges** — file → class/function:
```javascript
{ data: { id: 'edge:file_a:class_x:contains', source: 'file:yt_dlp/YoutubeDL.py', target: 'class:YoutubeDL', type: 'contains' } }
```

**`imports` edges** — importing file → imported file:
```javascript
{ data: { id: 'edge:file_a:file_b:imports', source: 'file:yt_dlp/YoutubeDL.py', target: 'file:yt_dlp/utils/__init__.py', type: 'imports' } }
```

**`inherits` edges** — subclass → superclass:
```javascript
{ data: { id: 'edge:class_a:class_b:inherits', source: 'class:UrllibRH', target: 'class:RequestHandler', type: 'inherits' } }
```

**`calls` edges** — caller → callee:
```javascript
{ data: { id: 'edge:func_a:func_b:calls', source: 'func:download', target: 'func:extract_info', type: 'calls' } }
```

**`exports` edges** — init file → submodule:
```javascript
{ data: { id: 'edge:file_a:file_b:exports:symbol', source: 'file:yt_dlp/__init__.py', target: 'file:yt_dlp/YoutubeDL.py', type: 'exports', symbol: 'YoutubeDL' } }
```

### Step 3: Deduplicate

- Deduplicate nodes by ID
- Deduplicate edges by `(source, target, type)` tuple
- Drop any edge whose source or target doesn't exist in nodes

### Step 4: Report

> `Phase 2 complete. Built graph with <N> nodes, <E> edges.`

---

## Phase 3 — Validate

Validate the generated graph for correctness, completeness, and quality.

### Step 1: Deterministic Checks

1. **Schema validation** — every node has `id`, `type` (file/class/function/module), `label`; every edge has `source`, `target`, `type` (imports/calls/inherits/contains/exports)
2. **Referential integrity** — every edge source/target references an existing node ID
3. **File coverage** — every `.py` file from the manifest has a corresponding `file` node
4. **Uniqueness** — no duplicate node IDs or edge IDs
5. **Color mapping** — node types match the canonical palette (file=#38bdf8, class=#a78bfa, function=#34d399, module=#fbbf24)
6. **Completeness** — every class/function has a `contains` edge from its parent file
7. **Call depth** — maximum call chain ≤ 10, total calls ≥ 5
8. **Orphan detection** — nodes with zero edges (warning for class/function, info for files)
9. **Self-reference** — no edge where source === target

### Step 2: Apply Fixes

- Drop dangling edges
- Add missing `contains` edges for class/function nodes
- Normalize unknown types to file (cyan) as safe default
- Drop self-references

### Step 3: Report

> `Phase 3 complete. <X> issues, <Y> warnings. Graph is <VALID/INVALID>.`

---

## Phase 4 — Generate Output Files

Produce the 4-file output package.

### Step 1: Read Templates

Read the 4 resource templates from `resources/`:

| Template | Purpose |
|----------|---------|
| `resources/index.html` | Light wrapper: `<div id="cy">`, sidebar, detail panel, toolbar |
| `resources/index.css` | Dark theme styles (CSS variables, layout, responsive) |
| `resources/index.js` | Cytoscape.js init, graph style, layout switcher, search, filter, detail, hover, export |
| `resources/data.js` | `window.GRAPH_DATA = { elements: [...], meta: {...} }` |

### Step 2: Inject Graph Data

Generate `data.js` by writing `window.GRAPH_DATA` with:
- `elements`: the nodes + edges arrays from Phase 2 (Cytoscape.js compatible format)
- `meta`: stats (node count, edge count, file count, class count, function count, module count, source)

### Step 3: Customize for Mode

- **Mode B**: index.js simplifies sidebar (file + module legend only), hides class/function filters
- **Mode C**: index.js adds "focal module" indicator, shows only the target module + direct dependencies

### Step 4: Write Output Files

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

### Step 1: Save Graph Data

Save `graph-data.json` alongside the 4 output files for future reference and incremental updates.

### Step 2: Report Summary

```
── Rui Graph Summary ──────────────────
Source:  site-packages/yt_dlp/ (22 .py files)
Mode:    full

Files:    22 (5 core, 12 library, 5 utility)
Classes:  25
Functions: 25
Modules:  3 (yt_dlp, utils, networking)

Nodes:    75 total (22 files + 25 classes + 25 functions + 3 modules)
Edges:    150 total (45 imports, 40 calls, 12 inherits, 50 contains, 3 exports)

Output:  docs/views/yt-dlp/graph/
         ├── index.html    (structure + toolbar + canvas)
         ├── index.js       (Cytoscape init + interactions)
         ├── index.css      (dark theme + responsive)
         └── data.js        (GRAPH_DATA: 75 nodes, 150 edges)

Validation: ✓ PASSED (0 issues, 2 warnings)
```

### Step 3: Offer Next Steps

- "Open `index.html` in browser to explore the code dependency graph"
- "Use `--mode modules` for a simplified module-level view"
- "Use `--mode deep --module <name>` to focus on a single package"

---

## Graph Design System

### Node Types (4 types)

| Node Type | Source | Color | Shape | Size |
|-----------|--------|-------|-------|------|
| **file** | Each `.py` source file | Sky blue `#38bdf8` | Round-rectangle | 140×55, sized by line count |
| **class** | Each class definition | Violet `#a78bfa` | Hexagon | 110×95 |
| **function** | Each function/method def | Emerald `#34d399` | Ellipse | 125×48 |
| **module** | Package `__init__.py` | Amber `#fbbf24` | Diamond | 80×80 |

### Edge Types (5 types)

| Edge Type | Source → Target | Line Style | Width | Color | Meaning |
|-----------|----------------|------------|-------|-------|---------|
| `imports` | file → file | Solid arrow | 1.5 | `#475569` | File imports another |
| `calls` | function → function | Dashed arrow | 1 | `#94a3b8` | Function calls another |
| `inherits` | class → class | Bold solid arrow | 2 | `#a78bfa` | Class inherits from superclass |
| `contains` | file → class/function | Solid no arrow | 0.8 | `#475569` | File defines the symbol |
| `exports` | file → file | Dotted arrow | 1 | `#22d3ee` | `__init__.py` re-exports |

### File Tier → Size

| Tier | Line Count | Width | Description |
|------|-----------|-------|-------------|
| Core | >1000 | 160 | Main orchestrator / large module |
| Library | 100–1000 | 140 | Feature module |
| Utility | <100 | 120 | Small helper / constants |

## Mode Reference

### Mode A: Full Graph (Default)

All node types (file, class, function, module) and all edge types (imports, calls, inherits, contains, exports). Best for exploring a codebase of 10–50 files.

### Mode B: Module-Only Graph

Only file + module nodes with `imports` and `exports` edges. No class/function nodes. Use when the codebase is >50 files or a high-level architecture view is needed.

### Mode C: Single-Module Deep-Dive

Focus on one package: show the focal file + all its contained classes/functions + all files it imports + all files that import it. Use for code review or understanding a specific module.

## Graph Features (All Modes)

### Layouts

| Layout | Best For | When to Use |
|--------|----------|-------------|
| **cose-bilkent** (default) | General purpose, organic | Most codebases — force-directed with increased repulsion |
| **dagre LR** | Left→right hierarchy | Import dependency chains, pipeline architectures |
| **dagre TB** | Top→bottom hierarchy | Class hierarchies, layered architectures |
| **breadthfirst** | Tree, root → leaves | Strict dependency trees, class inheritance |
| **concentric** | Radial, hub → satellite | Core module + supporting utilities |
| **grid** | Even spacing, no overlap | Small codebases (<15 files) |
| **circle** | Ring, equidistant | Symmetric view, no hierarchy |

### Interaction

| Feature | Trigger | Behavior |
|---------|---------|----------|
| **Pan** | Mouse drag | Move viewport |
| **Zoom** | Scroll wheel | Zoom in/out |
| **Select** | Click node | Show detail in side panel |
| **Focus** | Double-click node / click in detail | Center + zoom on node |
| **Hover highlight** | Hover node | Highlight 1-hop neighbors, dim others |
| **Search** | Type in search box | Highlight matching nodes (debounced 250ms) |
| **Filter** | Toggle module filter buttons | Show/hide by package |
| **Reset** | Click Reset / press R | Clear search, clear selection, fit view |
| **Fit** | Click Fit / press F | Fit all visible nodes to viewport |

### Side Panel (Node Detail)

Clicking a node shows a rich, professional detail panel with type-specific content. Every section uses structured layouts with colored stat chips, entity icons, and clickable cross-references.

#### Common Patterns

- **Header**: entity icon + name + type tag (tier/category/role)
- **Meta block**: key-value rows (Path, Lines, Module, File, Class, Role) in a bordered card
- **Stat chips row**: color-coded summary badges showing relationship counts
- **Sections**: each relationship group in its own bordered card with title + count badge + clickable list

#### File Detail

| Section | Content |
|---------|---------|
| **Header** | 📄 icon, filename, tier badge (core/library/utility) |
| **Meta card** | Path (clickable code), Lines, Module (amber) |
| **Stat chips** | classes count, functions count, imports count, imported-by count |
| **Defined Symbols** | classes (⬡ icon + class chip) and functions (○ icon + func chip), each clickable |
| **→ Imports** | files this file imports, with path subtitle, clickable |
| **← Imported By** | files that import this file, with path subtitle, clickable |
| **⇢ Re-exports** | `__init__.py` re-exports with symbol name badges |

#### Class Detail

| Section | Content |
|---------|---------|
| **Header** | ⬡ icon, class name, category badge (orchestrator/abstract/data/handler) |
| **Meta card** | File (clickable code), Methods count |
| **Stat chips** | methods count, extends count, subclasses count |
| **⬆ Extends** | base classes with ⬡ icon, clickable |
| **⬇ Extended By** | subclasses with ⬡ icon, clickable |
| **⚙ Methods** | method names with ○ icon + role subtitle, clickable |

#### Function Detail

| Section | Content |
|---------|---------|
| **Header** | ○ icon, function name, role badge (entry point/core logic/utility) |
| **Meta card** | File (clickable code), Class (violet, if method), Role |
| **Stat chips** | calls count, called-by count |
| **→ Calls** | functions this function calls, with `Class.name` subtitle, clickable |
| **← Called By** | functions that call this function, clickable |

#### Module Detail

| Section | Content |
|---------|---------|
| **Header** | ◇ icon, package name, "package" badge |
| **Meta card** | Path, Sub-packages count |
| **Stat chips** | files count, exports count |
| **📄 Contained Files** | files with 📄 icon + tier chip (core/library/utility), clickable |
| **⇢ Public API (Re-exports)** | exported targets with symbol name badges, clickable |

### Export

- **Download PNG**: `cy.png({ full: true, scale: 2, bg: '#020617' })` — high-res, dark background

## Output File Structure

```
docs/views/<name>/graph/
├── index.html    ← Light wrapper: toolbar, canvas, sidebar, detail panel
├── index.js      ← Cytoscape init, styles, layouts, search, filter, export
├── index.css     ← Dark theme CSS variables, layout, responsive breakpoints
└── data.js       ← window.GRAPH_DATA = { elements: [...], meta: {...} }
```

| File | Role | What It Contains |
|------|------|-----------------|
| `index.html` | Structure | Header with title + action buttons, toolbar (layout selector, search input, module filter buttons), main layout (sidebar + cy canvas + detail panel), toast, CDN script tags |
| `index.js` | Logic | `cy` init with `GRAPH_DATA.elements`, `getGraphStyle()` (node/edge styles by type), `switchLayout()` (7 layouts), `doSearch()` (debounced), `filterByModule()`, click→`updateDetail()`, hover→highlight, PNG export, keyboard shortcuts, `initUI()` |
| `index.css` | Theme | `:root` CSS variables (`--bg: #020617`, file/class/function/module colors), header/toolbar/sidebar styles, graph container, detail panel styles, toast, responsive breakpoints |
| `data.js` | Data | `window.GRAPH_DATA = { elements: [...nodes/edges...], meta: { nodeCount, edgeCount, fileCount, classCount, functionCount, moduleCount, source } }` |

---

## Workflows

### W1: Generate Graph from Python Package

Most common flow — graph an installed or local Python package.

1. Identify source directory (Phase 0)
2. Walk `.py` files, AST-parse, extract symbols and relationships (Phase 1)
3. Build nodes + edges → `graph-data.json` (Phase 2)
4. Validate graph (Phase 3)
5. Generate 4 output files (Phase 4)
6. Save artifacts, report summary (Phase 5)
7. Open in browser for verification

### W2: Generate Graph from Single File

For a single Python file with multiple classes/functions.

1. Read the `.py` file (Phase 0)
2. AST-parse to extract classes, functions, internal calls (Phase 1)
3. Build graph (only `contains` + `calls` edges — no `imports` since it's one file) (Phase 2)
4. Generate output (Phases 3-5)

### W3: Generate Graph from User-Provided Structure

User provides a description or listing of code structure directly.

1. Parse the code structure from the user's message (Phase 0-1)
2. Build graph (Phase 2)
3. Generate HTML (Phase 4, skip validation by default)
4. Return HTML content inline or write to file

### W4: Incremental Update

Update existing `graph-data.json` when source code changes.

1. Hash source files, compare to stored `meta.json` (Phase 0)
2. Identify changed files (added/removed/modified) (Phase 0)
3. Parse & analyze only changed files (Phase 1)
4. Merge changes into existing `graph-data.json` (Phase 2)
5. Recompute shared edges (imports, exports) (Phase 2)
6. Validate, generate HTML, save (Phases 3-5)

---

## Critical Rules

- **Cytoscape.js from CDN** — use `https://cdn.jsdelivr.net/npm/cytoscape@3.30.4/dist/cytoscape.min.js`. No npm, no build.
- **Layout plugins from CDN** — `cytoscape-dagre@2.5.0`, `cytoscape-cose-bilkent@4.1.0`, `dagre@0.8.5`.
- **Self-contained HTML** — no external CSS/JS files beyond CDN.
- **`file://` URLs must work** — no web server required for the HTML file.
- **Dark theme** — background `#020617`, surface `#0f172a`, border `#1e293b`. Match VideoLingo design system.
- **JetBrains Mono** — from Google Fonts CDN.
- **Node colors match entity type** — file=sky blue, class=violet, function=emerald, module=amber. Do not invent new color mappings.
- **Edge types visually distinct** — solid for structural (imports, inherits, contains), dashed for calls, dotted for exports.
- **Preserve source code fidelity** — file paths, class names, and function signatures shown in detail panel.
- **Layout selector works** — switching layouts should animate (`animate: true`).
- **Export works** — PNG export using `cy.png()`.
- **Keyboard accessible** — Ctrl+F → search, Escape → reset, R → reset, F → fit.
- **Validation before save** — always run Phase 3 validation. Save with warnings if issues cannot be auto-fixed.
- **No silent drops** — every warning from validation must appear in the final report.

## Reference Files

| File | When to Read |
|------|-------------|
| `resources/index.html` | Base HTML wrapper template |
| `resources/index.js` | Graph logic template |
| `resources/index.css` | Dark theme stylesheet template |
| `resources/data.js` | Data template — `window.GRAPH_DATA` shape |
| `references/graph-system.md` | Full graph design system — all node/edge types, color palettes, layout configs |
| `references/edge-types.md` | Expanded edge type reference with creation rules |
| `references/validation.md` | Validation rules, check details, and fix guidance |
| `agents/graph-reviewer.md` | Agent definition for LLM graph quality review |

## Output Checklist

Before finalizing a graph:

- [ ] All target `.py` files appear as file nodes
- [ ] Classes and functions use correct shapes and colors (hexagon=violet, ellipse=emerald)
- [ ] Module nodes (diamond) correctly represent `__init__.py` packages
- [ ] `imports` edges connect files based on actual Python imports
- [ ] `inherits` edges show correct base-class relationships
- [ ] `contains` edges connect files to their class/function definitions
- [ ] `calls` edges capture major call paths (best-effort)
- [ ] `exports` edges for `__init__.py` re-exports
- [ ] Layout switcher cycles through ≥3 layouts with animation
- [ ] Search works (case-insensitive, debounced, matches file/class/function names)
- [ ] Click node → detail panel shows code-specific info
- [ ] Hover → neighbor highlight + dim non-neighbors
- [ ] Export PNG works at 2x scale with dark background
- [ ] `file://` URL opens without errors
- [ ] Dark theme applied (`#020617` bg, JetBrains Mono font)
- [ ] Legend matches actual node/edge colors in the graph
- [ ] No duplicate node IDs (validated in Phase 3)
- [ ] No dangling edges (validated in Phase 3)
- [ ] Keyboard shortcuts functional (Ctrl+F, Escape, R, F)
- [ ] `doSearch()` dims edges disconnected from search hits
- [ ] `resetView()` properly reactivates the "All" filter button
- [ ] `escHtml()` escapes single quotes (`'` → `&#39;`)
- [ ] `filterByModule()` handles all node types: file, class, function, module
- [ ] `focusNode()` guards against empty collection (`!node.length`)
- [ ] `.detail-type-tag` has default fallback for unknown entity types

## Browser Console Error Prevention

### Bug 1: `resetView` doesn't re-activate filter button

**Symptom:** After clicking a module filter then pressing `R` to reset, no filter button shows as active.

**Root cause:** `resetView()` calls `filterByModule('all', null)` — the `null` button means no button gets `.active` class.

**Fix:** Find the "All" button via `document.querySelector('#module-filters .filter-btn')` and pass it:
```javascript
var allBtn = document.querySelector('#module-filters .filter-btn');
window.filterByModule('all', allBtn);
```

### Bug 2: `escHtml` doesn't escape single quotes

**Symptom:** If any label contains `'`, onclick handlers break with JS syntax error.

**Fix:** Add `'` → `&#39;` to `escHtml`:
```javascript
return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
```

### Bug 3: `doSearch` only dims nodes, leaves edges visible

**Symptom:** After searching, dimmed nodes have undimmed edges between them.

**Fix:** After setting node classes, dim edges not connected to any search-hit node.

### Bug 4: `filterByModule` missing node types

**Symptom:** When filtering by module, some node types remain visible even when disconnected.

**Fix:** Ensure all 4 node types (file, class, function, module) are handled in the visibility conditional.

### Bug 5: `focusNode` doesn't guard against missing nodes

**Fix:** Guard with `if (!node || !node.length) return;`

### Bug 6: `.detail-type-tag` has no default colors

**Fix:** Add defaults:
```css
.detail-type-tag {
  border: 1px solid var(--border);
  color: var(--text-soft);
  background: var(--border);
}
```

## Error Handling

- If source directory is not found → report and **STOP**
- If source files are not Python → report and **STOP**
- If AST parsing fails → report parsing errors and **STOP**
- If validation finds critical issues → auto-fix once, re-validate. If still failing, save with warnings and report
- **Always save partial results** — a graph with warnings is better than no graph
- **Never silently drop errors** — every failure must be visible in the Phase 5 summary

## Example

### Input: Python source files (simplified)

```python
# main.py
from utils import helper

class Pipeline:
    def run(self):
        data = load_data()
        result = helper.process(data)
        return result

def load_data():
    return {"key": "value"}

# utils.py
class Processor:
    def process(self, data):
        return self.transform(data)

    def transform(self, data):
        return str(data)
```

### Output: Interactive Graph

- 2 file nodes: `main.py` (core, rectangle, sky blue), `utils.py` (utility, rectangle, sky blue)
- 2 class nodes: `Pipeline` (hexagon, violet), `Processor` (hexagon, violet)
- 4 function nodes: `run()`, `load_data()`, `process()`, `transform()` (ellipse, emerald)
- `imports` edge: `main.py` → `utils.py` (solid arrow, slate)
- `contains` edges: `main.py` → `Pipeline`, `main.py` → `load_data()`, `utils.py` → `Processor`
- `calls` edges: `run()` → `load_data()`, `run()` → `process()` (dashed arrow, gray)
- Click `run()` → detail panel shows: file=main.py, class=Pipeline, calls=load_data(), process()
- Click `utils.py` → detail panel shows: defines=Processor, imported by=main.py

## 规则

- [code-graph-contract.md](./rules/code-graph-contract.md) — Python AST 依赖图的数据契约、3 种模式、5 阶段产物与硬约束。

## 专业代理

- [python-ast-extractor.md](./agents/python-ast-extractor.md) — 用 `ast` 走 Python 源码并产结构化符号记录。
- [python-edge-resolver.md](./agents/python-edge-resolver.md) — 解析悬空 import / 类调用的目标。

## Borders

### What this skill does

- Parse Python source via AST → emit nodes (file / class / function / module) and edges (imports / calls / inherits / contains / exports)
- Generate an interactive **Cytoscape.js** graph embedded in a 4-file page (`index.html` + `index.js` + `index.css` + `data.js`)
- Tier files (core / library / utility), categorize classes (orchestrator / abstract / data / handler), classify functions (entry / core / utility)
- Run a 5-phase pipeline (Pre-flight → Parse → Build → Validate → Generate)

### What this skill does NOT do

- **Multi-language architecture diagrams** — see [[rui-diagram]] (21 node types, SVG). rui-graph is Python-only with 4 node types.
- **Knowledge Graph semantics** — see [[rui-diagram]] for layers/tours/tags/KG schema; rui-graph produces a flat code graph, no LLM-summarized layers
- **Static SVG output** — interactive Cytoscape only; if you need a printable diagram, use rui-diagram
- **Real-time call tracing** — static AST only; no runtime profiling
- **Edit source code** — observation only

### Coordinated with

| Skill | Direction | See |
|-------|-----------|-----|
| [[rui-html]] | pattern sibling | Same 4-file structure; rui-html can refactor rui-graph output into a doc page |
| [[rui-theme]] | calls → rui-theme | Injects theme CSS into graph page — `[IF-009](../INTERFACES.md#if-009)` |
| [[rui-diagram]] | no overlap | Different abstraction: AST 4-node vs KG 21-node — `[IF-008](../INTERFACES.md#if-008)` |
| [[rui-skill]] | can target | rui-skill may add evals around rui-graph |

### Output ownership

| Path | Permission |
|------|-----------|
| `code-analysis.json`, `graph-data.json` | write (intermediate, may persist) |
| `docs/views/<name>/graph/` | **write** — primary output (4 files) |
| Python source tree (input) | no write — read-only |

### Invocation

Graph generation is invoked by an agent following the 5-phase pipeline.

`<this-skill-dir>` is the directory containing this SKILL.md (typically `.claude/rui-graph/`).
