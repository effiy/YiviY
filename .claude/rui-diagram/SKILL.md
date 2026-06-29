---
name: rui-diagram
description: Create architecture diagrams (HTML+SVG, dark theme) and run multi-agent codebase analysis producing structured Knowledge Graphs. Use for system diagrams, infrastructure diagrams, cloud architecture, network topology, or codebase understanding. Also handles incremental analysis, diff impact, and subdomain merging. **Do not use for Python interactive code graphs** — see [[rui-graph]].
lifecycle: default-pipeline
---

# Rui Diagram

Two capabilities sharing one abstraction: **Knowledge Graph → Diagram**. For documentation pages from a KG, see [[rui-html]].

```
Source Code → Multi-Agent Pipeline → Knowledge Graph → SVG Diagram
                                        │
                                        └──→ rui-html (doc pages)
```

## Decision Tree

```
User asks for...
├─ Architecture diagram (system/infra/network/cloud)
│  → Mode A: build SVG diagram (copy template → draw → verify)
│     If based on real code → run Phase 0 first
│
├─ Codebase understanding / analysis
│  → Phase 0 only (produce knowledge-graph.json)
│
├─ Diagram based on existing codebase
│  → Phase 0 → Mode A
│
├─ Incremental update (code changed)
│  → Phase 0 fingerprint diff → re-analyze changed only
│
├─ Impact analysis ("what does this change affect?")
│  → Phase 0 diff impact — blast radius via 1-hop + 2-hop dependents
│
├─ Interactive exploration (dashboard)
│  → Phase 0 → Dashboard (React app reading knowledge-graph.json)
│
├─ Knowledge base / wiki analysis
│  → Phase 0 (knowledge mode — article detection, wikilinks, entity extraction)
│
├─ Subdomain / multi-project merge
│  → Phase 0 across subdomains → merge → reconcile cross-domain edges
│
└─ Documentation page for a project
   → Phase 0 → hand off to [[rui-html]] Phase 1–3
```

## Knowledge Graph

All codebase-informed output is driven by a typed **Knowledge Graph** — structured JSON with deterministic structure (edges from imports/calls) + LLM semantics (summaries, tags, layers). Produced by Phase 0.

### Node Types (21)

| Family | Types |
|--------|-------|
| **Code** | `file`, `function`, `class`, `module`, `concept` |
| **Non-Code** | `config`, `document`, `service`, `table`, `endpoint`, `pipeline`, `schema`, `resource` |
| **Domain** | `domain`, `flow`, `step` |
| **Knowledge** | `article`, `entity`, `topic`, `claim`, `source` |

Full taxonomy with ID conventions and creation rules → `references/codebase-analysis.md`.

### Edge Types (35, across 8 categories)

| Category | Types | Weight |
|----------|-------|--------|
| **Structural** | `imports`, `exports`, `contains`, `inherits`, `implements` | 0.7–1.0 |
| **Behavioral** | `calls`, `subscribes`, `publishes`, `middleware` | 0.8 |
| **Data Flow** | `reads_from`, `writes_to`, `transforms`, `validates` | 0.5 |
| **Dependencies** | `depends_on`, `tested_by`, `configures` | 0.5–0.7 |
| **Semantic** | `related`, `similar_to` | 0.5 |
| **Infrastructure** | `deploys`, `serves`, `provisions`, `triggers` | 0.5–0.7 |
| **Schema/Data** | `migrates`, `documents`, `routes`, `defines_schema` | 0.5 |
| **Domain/Knowledge** | `contains_flow`, `flow_step`, `cross_domain`, `cites`, `contradicts`, `builds_on`, `exemplifies`, `categorized_under`, `authored_by` | 0.5 |

### GraphNode Shape

```typescript
GraphNode {
  id: string              // typed: "file:<path>", "function:<path>:<name>", etc.
  type: NodeType          // one of 21 types
  name: string            // display name
  filePath?: string       // repo-relative
  lineRange?: [number, number]
  summary: string         // LLM: 1–2 sentences
  tags: string[]          // LLM: 3–5 lowercase-hyphenated
  complexity: "simple" | "moderate" | "complex"
  // Optional extended metadata
  domainMeta?: { entities?, businessRules?, crossDomainInteractions?, entryPoint?, entryType? }
  knowledgeMeta?: { wikilinks?, backlinks?, category?, content? }
}
```

### KnowledgeGraph Shape

```typescript
KnowledgeGraph {
  version: string          // "1.0.0"
  kind?: "codebase" | "knowledge"
  project: { name, languages, frameworks, description, analyzedAt, gitCommitHash }
  nodes: GraphNode[]
  edges: GraphEdge[]
  layers: Layer[]          // { id, name, description, nodeIds[] }
  tour: TourStep[]         // { order, title, description, nodeIds[], languageLesson? }
  diffImpact?: DiffImpact  // change-aware runs only
}
```

### Validation (4-Tier)

| Tier | Action | Example |
|------|--------|---------|
| **Sanitize** | Null→`[]`, lowercase enums, strip null optionals | `tour: null` → `tour: []` |
| **Auto-Fix** | Fill missing fields, coerce types | missing `complexity` → `"moderate"` |
| **Validate** | Zod schema per node/edge, drop invalid, report | bad node type → dropped + logged |
| **Referential** | Drop edges with dangling refs, filter layer/tour nodeIds | missing node → edge removed |

Alias maps handle LLM variations: 60+ node type aliases (`func`→`function`, `interface`→`class`), 50+ edge type aliases (`extends`→`inherits`, `uses`→`depends_on`). Full validation → `references/codebase-analysis.md`.

## Phase 0: Codebase Analysis Pipeline

Multi-agent pipeline: **deterministic extraction first, LLM semantics second.**

### Phase 0.0 — Pre-flight

1. Resolve project root; detect git worktrees (redirect output to main repo)
2. Language directive (`--language <lang>`) for i18n content generation
3. Fingerprint check — compare structural hashes against stored baseline:

| Condition | Action |
|-----------|--------|
| All NONE/COSMETIC | **SKIP** |
| <10 structural, same directories | **PARTIAL_UPDATE** |
| New/deleted dirs OR >10 structural | **ARCHITECTURE_UPDATE** |
| >30 structural OR >50% changed | **FULL_UPDATE** |

4. Subdomain merge check (if multiple `*knowledge-graph*.json` exist)
5. `.diagramignore` — generate from `.gitignore` + defaults if missing

### Phase 0.1 — SCAN (Deterministic)

`scan-project.mjs` + `extract-import-map.mjs`: file enumeration, language detection, category assignment, import resolution for 12+ languages. Output: `scan-result.json`.

### Phase 0.2 — BATCH & ANALYZE (Deterministic + LLM)

Files grouped by directory cohesion. Up to 5 concurrent subagents per batch:
1. **Structural**: `extract-structure.mjs` — tree-sitter for 10 code languages + specialized parsers for non-code
2. **LLM semantic**: summaries, tags, complexity, semantic edges (using structural as foundation)

Node creation by `fileCategory`:

| Category | Node Type | Key Edges |
|----------|-----------|-----------|
| `code` | `file` (+ `function`/`class` sub-nodes) | `imports`, `contains`, `calls`, `inherits`, `exports`, `tested_by` |
| `config` | `config` | `configures` → code it affects |
| `docs` | `document` | `documents` → described components |
| `infra` (Dockerfile, K8s) | `service` | `deploys`, `serves` |
| `infra` (CI/CD) | `pipeline` | `triggers` |
| `infra` (Terraform) | `resource` | `provisions` |
| `data` (SQL) | `table` | `migrates`, `defines_schema` |
| `data` (GraphQL/Proto) | `schema` | `defines_schema` |
| `data` (OpenAPI) | `endpoint` | `routes` |

**Import edge rule**: 1:1 — one `imports` edge per import map entry. No aggregation.

### Phase 0.3 — ASSEMBLE & REVIEW

`merge-batch-graphs.py`: combine → normalize IDs → deduplicate by `(source, target, type)` → drop dangling edges → canonicalize `tested_by`. Assemble-reviewer subagent validates completeness against import map.

### Phase 0.4 — ARCHITECTURE (LLM)

Classify nodes into 3–10 logical layers using: directory signals, import adjacency (fan-in/out), cross-category edges, language/framework context. Every node in exactly one layer.

### Phase 0.5 — TOUR (LLM)

5–15 dependency-ordered learning steps: BFS from entry points, fan-in ranking for keystones, cluster detection, bottom-up ordering (foundational → consumers).

### Phase 0.6 — VALIDATE

4-tier validation pipeline. Auto-fix what can be fixed. Report all issues. Save partial results.

### Phase 0.7 — SAVE

Write `knowledge-graph.json` + `meta.json` + fingerprint baseline to `.diagram/`. Clean intermediates. Report summary.

### Quick Path (Manual)

For projects under ~20 files: read README, scan key directories, read 3–5 files, sketch manually, verify with user.

## Mode A: Architecture Diagrams

Self-contained HTML+SVG — dark theme (`#020617`), JetBrains Mono, export toolbar (Copy PNG / Download PNG / Download PDF).

### Quick Start

1. **Select theme** via [[rui-theme]]: pick from 10 presets, generate `--yry-*` CSS.
2. Copy `resources/template.html`, add theme `<link>` + `<link rel="stylesheet" href="theme-bridge.css">`.
3. Build SVG. **Read `references/diagram-system.md`** for color palette, spacing, arrow z-order, masking, legend rules. Use `var(--diag-*)` tokens instead of hardcoded hex.
4. Update summary cards and footer
5. Visual review: open in browser for final check

### SVG Construction Rules

| Rule | Detail |
|------|--------|
| **Arrow z-order** | Draw arrows after grid, before component boxes |
| **Masking** | Opaque `#0f172a` background rect behind every semi-transparent box |
| **Legend** | Outside all boundary boxes, ≥20px below lowest boundary |
| **Spacing** | ≥40px vertical gap between components; message buses in the gap |
| **Grid** | 40×40 pattern, `#1e293b` stroke, 0.5 width |
| **SRI hashes** | Don't modify html2canvas/jsPDF integrity hashes without recomputing |

### Color Palette — Layer → SVG

| Layer | Color | Hex | Node Types | Directory Signals |
|-------|-------|-----|-----------|-------------------|
| **UI** | Cyan | `#22d3ee` | `file` (frontend), `class` (component) | `frontend/`, `ui/`, `pages/`, `views/`, `components/`, `app/` |
| **API** | Sky | `#38bdf8` | `file` (routes), `endpoint` | `api/`, `routes/`, `handlers/`, `controllers/`, `gateway/` |
| **Service** | Emerald | `#34d399` | `file` (logic), `function`, `module` | `services/`, `logic/`, `domain/`, `core/`, `engine/`, `pipeline/` |
| **Data** | Violet | `#a78bfa` | `table`, `schema`, `file` (models) | `models/`, `entities/`, `db/`, `repositories/`, `store/`, `schemas/` |
| **Infrastructure** | Amber | `#fbbf24` | `service`, `pipeline`, `resource` | `infra/`, `deploy/`, `k8s/`, `terraform/`, `docker/`, `ci/` |
| **Config** | Slate | `#94a3b8` | `config` | `config/`, `env/`, `settings/`, `.env` |
| **Auth** | Rose | `#fb7185` | `file` (auth), `function` (middleware) | `auth/`, `security/`, `guard/`, `oauth/`, `jwt/` |
| **Events** | Orange | `#fb923c` | `file` (events), `function` (pub/sub) | `queue/`, `events/`, `messages/`, `pubsub/`, `bus/`, `kafka/` |
| **Utility** | Slate-muted | `#64748b` | `file` (utils), `function` (helpers) | `utils/`, `lib/`, `helpers/`, `common/`, `shared/` |
| **External** | Slate-dark | `#475569` | `module` (external), `service` (3rd-party) | Marked `isExternal: true` |

### KG → SVG Mapping

| KG Element | SVG Element |
|------------|-------------|
| `GraphNode.type` → layer | Component fill/stroke color |
| `GraphNode.name` | `<text font-size="11" font-weight="600">` |
| `GraphNode.summary` | `<text font-size="9" fill="#94a3b8">` sublabel |
| `GraphNode.tags` | `<text font-size="8">` annotation tags |
| Internal `GraphEdge[]` | Arrows between components (drawn before boxes) |
| External `GraphEdge[]` | Dashed arrows to External boxes |
| Layers | Region boundaries (`stroke-dasharray="8,4"`) |
| Auth/security groups | Security boundaries (`stroke-dasharray="4,4"`, rose) |
| Hub nodes (high fan-in/out) | Larger boxes, bold labels |
| `DiffImpact.changedNodes` | Dashed border or `*` marker |

### Plugin Architecture

```
plugins/
├── extractors/     # Language-specific structural extractors (tree-sitter grammars)
├── parsers/        # Non-code parsers (Markdown, YAML, Dockerfile, SQL, GraphQL, etc.)
├── languages/      # Language config: patterns, idioms, edge conventions
├── frameworks/     # Framework config: directory signals, layer mappings
└── locales/        # Output language guides for i18n content generation
```

## Workflows

### W1: Generate Architecture Diagram

Copy template → build SVG (`references/diagram-system.md`) → update cards/footer → verify. If based on code: Phase 0 first.

### W2: Incremental Update (Code Changed)

Phase 0.0 fingerprint check → classify update level → re-run affected passes → update diagram sections → update baseline → verify.

### W3: Diff Impact Analysis

`git diff --name-only` → map to node IDs → compute 1-hop + 2-hop dependents → classify risk (hub-node impact, layer criticality, fan-out) → `DiffImpact` report.

### W4: Subdomain Merge (Multi-Project)

Run Phase 0 per subdomain → merge → reconcile `cross_domain` edges → deduplicate → normalize → unified KG.

### W5: Knowledge Base Analysis (Wiki Mode)

Detect wiki structure (index.md + wikilinks) → extract articles, sources, topics → LLM for implicit relationships → KG with `kind: "knowledge"`.

### W6: Dashboard Launch

After any KG-producing workflow, launch interactive dashboard: hierarchical (dagre) for codebase, force-directed for knowledge, diff overlay, layer filtering, tour navigation.

## Critical Rules

- **Deterministic edges first, LLM semantics second** — structure from tree-sitter/grep, meaning from LLM
- **Every node in exactly one layer** — no orphaned or duplicate classifications
- **Arrow z-order** — arrows before boxes in SVG
- **Masking** — opaque bg rect behind every semi-transparent component box
- **Legend outside boundaries** — ≥20px below lowest boundary
- **SRI hashes** — don't modify without recomputing
- **Save partial results** — partial KG > no KG
- **Worktree awareness** — redirect `.diagram/` output to main repo root
- **`.diagramignore`** — generate from `.gitignore` + defaults if missing
- **Import edges 1:1** — one edge per import, no aggregation
- **Alias maps** — handle LLM output variability (60+ node aliases, 50+ edge aliases)

## Reference Files

| File | When to Read |
|------|-------------|
| `references/codebase-analysis.md` | Phase 0 — full pipeline: scanner, analyzer, classifier, reviewer, tour builder, plugin docs, fingerprint system, incremental analysis, KG schema, validation |
| `references/diagram-system.md` | Building diagrams — color palette, spacing, arrow rules, masking, export toolbar, legend placement |
| `resources/theme-bridge.css` | CSS token bridge — maps `--yry-*` to diagram-specific `--diag-*` tokens |
| `.claude/understand-anything/packages/core/src/types.ts` | Canonical type definitions |
| `.claude/understand-anything/packages/core/src/schema.ts` | Validation pipeline (Zod schemas, alias maps, auto-fix) |
| `[[rui-theme]]` | Theme selection and CSS generation (10 presets) |
| `[[rui-ui]]` | Design intelligence for layer color palette and typography |
| `.claude/understand-anything/packages/core/src/fingerprint.ts` | Fingerprint system (structural hashing, change detection) |
| `.claude/understand-anything/packages/core/src/change-classifier.ts` | Update decision matrix (SKIP/PARTIAL/ARCHITECTURE/FULL) |
| `resources/template.html` | Diagram HTML template |

## 规则

- [kg-pipeline-contracts.md](./rules/kg-pipeline-contracts.md) — 知识图谱与 SVG 架构图的 8 阶段产物、节点/边分类、路径所有权与跨技能契约。

## 专业代理

- [node-extractor.md](./agents/node-extractor.md) — 从源码 / 配置提取结构化图节点。
- [layer-classifier.md](./agents/layer-classifier.md) — 把节点归入 3–10 个层。
- [tour-builder.md](./agents/tour-builder.md) — 自底向上 5–15 步学习 tour 编排。

## Borders

### What this skill does

- Run multi-agent codebase analysis (Phase 0) → Knowledge Graph (21 node types, 35 edge types across 8 categories)
- Produce **SVG architecture diagrams** (dark theme, `--yry-*` tokens) from the KG
- Support incremental updates via fingerprint diff (SKIP / PARTIAL / ARCHITECTURE / FULL)
- Handle dashboard launch (React app) for interactive KG exploration
- Cover knowledge/wiki mode (article detection, wikilinks)

### What this skill does NOT do

- **Cytoscape.js interactive graphs** — see [[rui-graph]] (different abstraction, Python + AST)
- **Codebase understanding without output** — every Phase 0 run writes `knowledge-graph.json`
- **Per-file diff/impact only** — KG-level blast radius via 1-hop + 2-hop dependents is in scope; single-file blame is not
- **Live runtime profiling** — static analysis only; no traces, no metrics

### Coordinated with

| Skill | Direction | See |
|-------|-----------|-----|
| [[rui-html]] | reads ← rui-diagram | Consumes `knowledge-graph.json` for SVG embedding — `[IF-005](../INTERFACES.md#if-005)` |
| [[rui-theme]] | calls → rui-theme | Color/typography tokens for SVG |
| [[rui-ui]] | calls → rui-ui | Layer palette inspiration |
| [[rui-graph]] | no overlap | Different abstraction (KG vs AST) — `[IF-008](../INTERFACES.md#if-008)` |

### Output ownership

| Path | Permission |
|------|-----------|
| `<this-skill-dir>/references/` | read-only — analysis spec, validation spec |
| `<this-skill-dir>/resources/template.html` | read-only |
| `.diagram/knowledge-graph.json` | **write** — primary KG output |
| `.diagram/meta.json`, `.diagram/fingerprint.json` | write — auxiliary artifacts |
| `docs/views/<name>/diagram/index.html` | write when handing off to [[rui-html]] |

### Invocation

rui-diagram has **no CLI entry** — it is invoked by an agent following the phased pipeline. The shell snippets in Phase 0 (e.g., `python -m`) are documented inline; persistent reuse happens via subagent dispatch.

For documentation pages from a KG, see **[[rui-html]]** — takes the KG produced here through Phases 1–3 (design intelligence → theme selection → verification).
