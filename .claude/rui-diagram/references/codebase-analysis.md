# Codebase Analysis — Structured Knowledge-Graph Pipeline

Extract architecture and code structure to produce a formal Knowledge Graph that feeds diagram generation (Mode A), documentation (Mode B), and the interactive dashboard. Inspired by the Understand-Anything multi-agent pipeline: deterministic structural edges + LLM semantic nodes, with a 21-type node taxonomy and 35-type edge taxonomy across 8 categories.

## Design Principle

**Deterministic edges, semantic nodes.** Structural relationships (imports, calls, inheritance) are extracted deterministically via tree-sitter/grep/ast-grep. What each component *does* and *means* is enriched by LLM reasoning. The output is a typed Knowledge Graph — a single source of truth that drives diagrams, docs, and dashboards.

```
Source Code
    │
    ▼
┌──────────────────────────────────────────────────────────────┐
│  Multi-Agent Analysis Pipeline (5-7 specialized passes)      │
│                                                              │
│  Scanner ──► Batch ──► Analyzer ──► Assembler ──► Reviewer   │
│                                               │              │
│                 ┌─────────────────────────────┘              │
│                 ▼                                            │
│         Architecture Classifier ──► Tour Builder             │
│                 │                         │                  │
│                 ▼                         ▼                  │
│         Knowledge Graph (JSON)                              │
│         ├── Nodes (21 types, validated)                     │
│         ├── Edges (35 types, 8 categories)                  │
│         ├── Layers (logical groupings)                      │
│         ├── Tours (dependency-ordered)                      │
│         └── Diff Impact (change blast radius)               │
└─────────────┬───────────────────────────────────────────────┘
              │
    ┌─────────┼─────────┬──────────┐
    ▼         ▼         ▼          ▼
  Diagram   Doc Page  Dashboard  Diff Report
(Mode A)  (Mode B)  (Interactive) (Impact)
```

---

## When to Analyze

| Scenario | Depth | Goal |
|----------|-------|------|
| Architecture diagram for existing codebase | **Full KG** | All nodes, edges, layers → diagram blueprint |
| Documentation page for existing code | **Full KG** | All nodes, edges, layers, tours → doc structure |
| Diff-aware diagram (showing what changed) | **Diff impact** | Changed files + affected upstream/downstream |
| Incremental update (minor code changes) | **Partial** | Re-analyze changed files only, update affected subgraph |
| Impact analysis ("will this break anything?") | **Diff impact only** | Blast radius computation, no regeneration |
| Subdomain / multi-project merge | **Full + merge** | Per-project analysis + cross-domain reconciliation |
| Knowledge base / wiki | **Knowledge mode** | Article extraction, entity linking, topic clustering |
| New project from scratch | Skip | No code to analyze |

---

## Full Type Taxonomy

The Knowledge Graph uses a rich type system inspired by Understand-Anything. Every node and edge is precisely typed — this enables accurate diagram coloring, correct edge routing, and meaningful dashboard filtering.

### Node Types (21 total: 5 code + 8 non-code + 3 domain + 5 knowledge)

#### Code Family (5 types)

| Type | Description | ID Convention | Example |
|------|-------------|---------------|---------|
| `file` | Source code file | `file:<relative-path>` | `file:src/index.ts` |
| `function` | Function or method | `function:<relative-path>:<name>` | `function:src/utils.ts:formatDate` |
| `class` | Class, interface, struct, type | `class:<relative-path>:<name>` | `class:src/models/User.ts:User` |
| `module` | Logical module or package | `module:<name>` | `module:auth-service` |
| `concept` | Abstract pattern or idea | `concept:<name>` | `concept:pub-sub` |

#### Non-Code Family (8 types)

| Type | Description | ID Convention | Example |
|------|-------------|---------------|---------|
| `config` | Configuration file | `config:<relative-path>` | `config:tsconfig.json` |
| `document` | Documentation file | `document:<relative-path>` | `document:README.md` |
| `service` | Deployable service | `service:<relative-path>` | `service:Dockerfile` |
| `table` | Database table/view | `table:<relative-path>:<name>` | `table:migrations/001.sql:users` |
| `endpoint` | API endpoint/route | `endpoint:<relative-path>:<METHOD-path>` | `endpoint:api/openapi.yaml:GET-/users` |
| `pipeline` | CI/CD pipeline | `pipeline:<relative-path>` | `pipeline:.github/workflows/ci.yml` |
| `schema` | Schema definition | `schema:<relative-path>` | `schema:schema.graphql` |
| `resource` | Infrastructure resource | `resource:<relative-path>` | `resource:main.tf` |

#### Domain Family (3 types)

| Type | Description | ID Convention | Example |
|------|-------------|---------------|---------|
| `domain` | Business domain | `domain:<name>` | `domain:payment` |
| `flow` | Business flow/process | `flow:<name>` | `flow:checkout` |
| `step` | Flow step | `step:<name>` | `step:validate-cart` |

#### Knowledge Family (5 types)

| Type | Description | ID Convention | Example |
|------|-------------|---------------|---------|
| `article` | Wiki article | `article:<path>` | `article:architecture-decisions` |
| `entity` | Named entity | `entity:<name>` | `entity:postgresql` |
| `topic` | Topic/category | `topic:<name>` | `topic:performance` |
| `claim` | Assertion/decision | `claim:<name>` | `claim:use-grpc-for-internal` |
| `source` | Reference source | `source:<name>` | `source:martin-fowler-patterns` |

### Edge Types (35 total across 8 categories)

#### Structural (5 types)

| Type | When to Use | Weight | Direction |
|------|------------|--------|-----------|
| `imports` | File A imports from file B | 0.7 | forward |
| `exports` | File exports a function/class/type | 0.8 | forward |
| `contains` | File/class contains a function/class | 1.0 | forward |
| `inherits` | Class extends another class | 0.9 | forward |
| `implements` | Class implements an interface | 0.9 | forward |

#### Behavioral (4 types)

| Type | When to Use | Weight | Direction |
|------|------------|--------|-----------|
| `calls` | Function A calls function B (cross-file) | 0.8 | forward |
| `subscribes` | Component subscribes to a topic/channel | 0.6 | forward |
| `publishes` | Component publishes to a topic/channel | 0.6 | forward |
| `middleware` | Middleware intercepts request/response | 0.7 | forward |

#### Data Flow (4 types)

| Type | When to Use | Weight | Direction |
|------|------------|--------|-----------|
| `reads_from` | Component reads data from a source | 0.7 | forward |
| `writes_to` | Component writes data to a target | 0.7 | forward |
| `transforms` | Component transforms data format | 0.6 | forward |
| `validates` | Component validates data against schema/rules | 0.6 | forward |

#### Dependencies (3 types)

| Type | When to Use | Weight | Direction |
|------|------------|--------|-----------|
| `depends_on` | General runtime dependency | 0.6 | forward |
| `tested_by` | Production code tested by test file | 0.5 | forward (prod→test) |
| `configures` | Config file affects code | 0.6 | forward |

#### Semantic (2 types)

| Type | When to Use | Weight | Direction |
|------|------------|--------|-----------|
| `related` | Topically related without structural link | 0.5 | forward |
| `similar_to` | Components share similar purpose/pattern | 0.5 | forward |

#### Infrastructure (4 types)

| Type | When to Use | Weight | Direction |
|------|------------|--------|-----------|
| `deploys` | Infra file builds/deploys code | 0.7 | forward |
| `serves` | Service/ingress exposes an endpoint | 0.7 | forward |
| `provisions` | IaC resource creates infrastructure | 0.7 | forward |
| `triggers` | CI/CD config triggers pipeline | 0.6 | forward |

#### Schema/Data (4 types)

| Type | When to Use | Weight | Direction |
|------|------------|--------|-----------|
| `migrates` | Migration modifies a table | 0.7 | forward |
| `documents` | Doc file describes a component | 0.5 | forward |
| `routes` | Routing config directs to service | 0.6 | forward |
| `defines_schema` | Schema defines structure used by code | 0.8 | forward |

#### Domain (3 types)

| Type | When to Use | Weight | Direction |
|------|------------|--------|-----------|
| `contains_flow` | Domain contains a business flow | 0.8 | forward |
| `flow_step` | Flow step follows previous step | 0.8 | forward |
| `cross_domain` | Interaction across domain boundaries | 0.6 | forward |

#### Knowledge (6 types)

| Type | When to Use | Weight | Direction |
|------|------------|--------|-----------|
| `cites` | Article cites a source | 0.7 | forward |
| `contradicts` | Article contradicts another claim | 0.5 | bidirectional |
| `builds_on` | Article builds on/refines another | 0.6 | forward |
| `exemplifies` | Article is an example of a topic | 0.5 | forward |
| `categorized_under` | Article belongs to a topic category | 0.8 | forward |
| `authored_by` | Article authored by an entity | 0.9 | forward |

---

## Multi-Agent Analysis Pipeline

Run these passes in sequence. Each pass enriches the Knowledge Graph — pass N+1 consumes and extends the output of pass N.

### Phase 0.0 — Pre-flight

#### Worktree Detection

If running inside a git worktree, redirect output to the main repo root. Worktrees are ephemeral — losing the KG on session end wastes analysis. Detection logic:

```bash
COMMON_DIR=$(git -C "$PROJECT_ROOT" rev-parse --git-common-dir 2>/dev/null)
GIT_DIR=$(git -C "$PROJECT_ROOT" rev-parse --git-dir 2>/dev/null)
if [ -n "$COMMON_DIR" ] && [ -n "$GIT_DIR" ]; then
  COMMON_ABS=$(cd "$PROJECT_ROOT" && cd "$COMMON_DIR" 2>/dev/null && pwd -P)
  GIT_ABS=$(cd "$PROJECT_ROOT" && cd "$GIT_DIR" 2>/dev/null && pwd -P)
  if [ -n "$COMMON_ABS" ] && [ "$COMMON_ABS" != "$GIT_ABS" ]; then
    MAIN_ROOT=$(dirname "$COMMON_ABS")
    PROJECT_ROOT="$MAIN_ROOT"  # Redirect to main repo
  fi
fi
```

Set `UNDERSTAND_NO_WORKTREE_REDIRECT=1` to keep worktree-local output (rare — most users want the redirect).

#### Language Directive

If the user specifies `--language <lang>`, all textual content (summaries, tags, layer names, tour descriptions, languageNotes, languageLessons) is generated in that language. The directive is passed to every subagent:

```markdown
> **Language directive**: Generate all textual content (summaries, descriptions, tags, titles,
> languageNotes, languageLesson) in **{language}**. Maintain technical accuracy while using natural,
> native-level phrasing in the target language. Keep technical terms in English when no standard
> translation exists (e.g., "middleware", "hook", "barrel").
```

Supported: all ISO 639-1 codes (`zh`, `ja`, `ko`, `en`, `es`, `fr`, `de`, `pt`, `ru`, `ar`, etc.) + locale variants (`zh-TW`, `zh-HK`, `pt-BR`). The language preference is persisted to `.diagram/config.json` for consistency across incremental updates.

**Locale guidance files** provide language-specific conventions for tag naming, summary style, and layer name translations. Located at `locales/<lang>.md` in the plugin.

#### Fingerprint System

File-level structural fingerprints enable efficient incremental updates. Each source file gets a fingerprint:

```typescript
interface FileFingerprint {
  path: string;
  contentHash: string;          // SHA-256 of file content
  functions: FunctionFingerprint[];  // { name, lineRange, paramCount, bodyHash }
  classes: ClassFingerprint[];      // { name, lineRange, methodCount, methodHashes }
  imports: ImportFingerprint[];     // { source, specifiers[], lineNumber }
  exports: ExportFingerprint[];     // { name, lineNumber, isDefault }
  structuralHash: string;           // Hash of structural info (ignores comments/whitespace)
}

interface FingerprintStore {
  fingerprints: Record<string, FileFingerprint>;  // path → fingerprint
  gitCommitHash: string;
  generatedAt: string;
}
```

**Comparison levels:**

| Level | Condition | Meaning |
|-------|-----------|---------|
| `NONE` | Identical `contentHash` | File unchanged |
| `COSMETIC` | Different `contentHash`, identical `structuralHash` | Comments/whitespace only — no graph impact |
| `STRUCTURAL` | Different `structuralHash` | Functions/classes/imports changed — re-analyze needed |

#### Change Classifier

After comparing fingerprints, the classifier determines the update strategy:

```
Input: ChangeAnalysis { newFiles, deletedFiles, structurallyChangedFiles, cosmeticOnlyFiles }

Decision matrix:
├─ structuralCount === 0  →  SKIP (no re-analysis needed)
├─ structuralCount > 30 OR structuralCount/totalFiles > 0.5  →  FULL_UPDATE
├─ new/deleted directories OR structuralCount > 10  →  ARCHITECTURE_UPDATE (re-layer + re-tour)
├─ otherwise  →  PARTIAL_UPDATE (re-analyze changed only, keep layers/tour)
```

**File categories for incremental re-analysis:**

| Change Level | Passes to Re-run | Layers | Tour |
|-------------|-----------------|--------|------|
| SKIP | None | Keep | Keep |
| PARTIAL_UPDATE | 2 (changed files) + 3 (assembly) + 6 (validation) | Keep existing | Keep existing |
| ARCHITECTURE_UPDATE | 2 (changed) + 3 (assembly) + 4 (architecture) + 5 (tour) + 6 (validation) | Re-analyze | Re-build |
| FULL_UPDATE | All passes (1-6) | Re-analyze | Re-build |

#### Ignore Configuration

Generate a `.diagramignore` file from `.gitignore` + sensible defaults:

```
# Default exclusions (merged with .gitignore patterns)
node_modules/
.git/
dist/
build/
__pycache__/
target/
*.lock
*.min.js
*.min.css
*.map
*.pyc
*.class
*.o
*.so
*.dylib
*.wasm
*.woff
*.woff2
*.ttf
*.eot
*.png
*.jpg
*.jpeg
*.gif
*.svg
*.ico
*.pdf
```

Users can uncomment or add patterns. `!`-negation re-includes files excluded by defaults.

#### Subdomain Graph Merging

When multiple `*knowledge-graph*.json` files exist (e.g., `frontend-knowledge-graph.json`, `backend-knowledge-graph.json`), the merge script reconciles them:

1. Load all subdomain graphs + existing main `knowledge-graph.json`
2. Deduplicate nodes by ID (case-insensitive matching for knowledge-family types)
3. Normalize all node/edge types across subdomains via alias maps
4. Reconcile cross-domain edges — if subdomain A references a node in subdomain B, create a `cross_domain` edge
5. Merge layers — if identical layer names exist across subdomains, combine nodeIds
6. Merge tours — interleave subdomain tours or create a multi-project overview tour
7. Write unified `knowledge-graph.json`

---

### Pass 1: Project Scanner

**Role:** Discover project shape — languages, frameworks, directory structure, entry points, file inventory.

**Input:** Repo root.

**Method:** Two deterministic bundled scripts + LLM narrative synthesis.

#### Step A: LLM Narrative

Read manifests (package.json, pyproject.toml, Cargo.toml, go.mod, etc.) and README to synthesize:
- `name` — from manifest or directory name
- `description` — from manifest or README
- `frameworks` — detected from dependencies (React, Django, Express, FastAPI, Spring, Gin, Actix, etc.)
- `languages` — top-level language set

#### Step B: File Enumeration

Run the bundled `scan-project.mjs`:
- Prefers `git ls-files`; falls back to recursive walk for non-git directories
- Applies `.diagramignore` filtering (defaults + user patterns)
- Assigns `language` and `fileCategory` per canonical tables
- Counts lines per file
- Reports `filteredByIgnore` count

**File category assignment (canonical table — the script is authoritative):**

| Pattern | Category | Priority Rule |
|---------|----------|---------------|
| `Dockerfile*`, `docker-compose.*`, `Makefile`, `Jenkinsfile`, `.github/workflows/*`, K8s manifests, Terraform | `infra` | Most-specific wins |
| `.md`, `.mdx`, `.rst`, `.txt`, `.text` (except `LICENSE`) | `docs` | |
| `.yaml`, `.yml`, `.json`, `.toml`, `.xml`, `.cfg`, `.ini`, `.env`, `.properties` | `config` | `docker-compose.yml` is `infra` not `config` |
| `.sql`, `.graphql`, `.gql`, `.proto`, `.prisma`, `.csv` | `data` | |
| `.sh`, `.bash`, `.ps1`, `.bat`, `.cmd` | `script` | |
| `.html`, `.htm`, `.css`, `.scss`, `.less` | `markup` | |
| `LICENSE` | `code` | Exception — not `docs` |
| Everything else | `code` | Default |

#### Step C: Import Resolution

Run the bundled `extract-import-map.mjs`:
- Uses tree-sitter for parsing across 12+ languages (TS, JS, Python, Go, Rust, Java, Kotlin, C#, Ruby, PHP, C, C++)
- Resolves relative imports, path aliases (tsconfig paths), Go module prefixes
- Filters out external packages — only project-internal paths remain
- Non-code files get empty import arrays

**Output:** `scan-result.json` with `files[]`, `importMap`, project metadata, `estimatedComplexity`.

---

### Pass 2: File Analyzer (Batched)

**Role:** Extract structural facts from each source file and produce GraphNode/GraphEdge objects.

**Method:** Split files into semantic batches (by directory cohesion, language, size). Each batch runs a two-phase subagent:

#### Phase 1: Structural Extraction (Deterministic)

Run the bundled `extract-structure.mjs`:

**Supported code languages (tree-sitter):** TypeScript, JavaScript, Python, Go, Rust, Java, Ruby, PHP, C/C++, C# (10 languages)

**Supported non-code parsers:**

| Parser | File Types | Extracts |
|--------|-----------|----------|
| `MarkdownParser` | `.md`, `.mdx`, `.rst` | Sections (headings), wikilinks, frontmatter |
| `YAMLConfigParser` | `.yaml`, `.yml` | Top-level keys as sections |
| `JSONConfigParser` | `.json` | Top-level keys |
| `TOMLParser` | `.toml` | Tables, keys |
| `EnvParser` | `.env` | Variable definitions |
| `DockerfileParser` | `Dockerfile*` | Stages, COPY/EXPOSE/CMD instructions |
| `SQLParser` | `.sql` | CREATE TABLE, ALTER TABLE, views |
| `GraphQLParser` | `.graphql`, `.gql` | Types, queries, mutations |
| `ProtobufParser` | `.proto` | Messages, services, enums |
| `TerraformParser` | `.tf`, `.tfvars` | Resources, modules, variables |
| `MakefileParser` | `Makefile` | Targets, prerequisites |
| `ShellParser` | `.sh`, `.bash` | Function definitions |

**Output per file:**
```json
{
  "path": "src/index.ts",
  "language": "typescript",
  "fileCategory": "code",
  "totalLines": 150,
  "nonEmptyLines": 120,
  "functions": [{"name": "main", "startLine": 10, "endLine": 45, "params": ["config"]}],
  "classes": [{"name": "App", "startLine": 50, "endLine": 140, "methods": ["init"], "properties": ["config"]}],
  "exports": [{"name": "App", "line": 50, "isDefault": false}],
  "callGraph": [{"caller": "main", "callee": "initApp", "lineNumber": 15}],
  "sections": [], "definitions": [], "services": [], "endpoints": [], "steps": [], "resources": [],
  "metrics": {"importCount": 5, "exportCount": 3, "functionCount": 4, "classCount": 1}
}
```

**Non-code structural fields:**

| Field | Source | Sub-node prefix to emit |
|-------|--------|------------------------|
| `sections` | Markdown, YAML, JSON | Context only — not emitted as nodes |
| `definitions` | .env, GraphQL, Protobuf | `schema:` for proto/graphql |
| `services` | Dockerfile, docker-compose | `service:<path>:<name>` |
| `endpoints` | OpenAPI, route files | `endpoint:<path>:<METHOD-path>` |
| `steps` | CI/CD configs | `step:<path>:<name>` |
| `resources` | Terraform, K8s | `resource:<path>:<name>` |

**Languages without tree-sitter (Swift, Kotlin, PowerShell, Batch):** The script outputs basic metrics with empty structural data. The LLM must regex-extract at minimum function definitions so these files don't become bare file nodes.

#### Phase 2: Semantic Analysis (LLM)

Using the structural results as foundation (do NOT re-read source files unless the script skipped them), produce:

1. **File-level node** — type based on `fileCategory` (see type mapping table)
2. **Function/class sub-nodes** — only for significant definitions (10+ lines, exported, or 2+ methods)
3. **Edges** — imports (1:1 from `batchImportData`), contains, calls, inherits, exports, configures, documents, deploys, triggers, migrates, defines_schema, serves, provisions, routes, tested_by

**Edge creation per fileCategory:**

| fileCategory | Edge Types to Create |
|-------------|---------------------|
| `code` | `imports`, `contains`, `calls`, `inherits`, `implements`, `exports`, `tested_by`, `depends_on` |
| `config` | `configures` → code it affects, `depends_on` → related configs |
| `docs` | `documents` → components it describes, `related` → sibling docs |
| `infra` (Dockerfile) | `deploys` → code it packages |
| `infra` (docker-compose) | `depends_on` → Dockerfile, `serves` → containers |
| `infra` (K8s) | `serves` → endpoints, `deploys` → containers |
| `infra` (CI/CD) | `triggers` → test/deploy targets |
| `infra` (Terraform) | `provisions` → resources it creates |
| `data` (SQL) | `migrates` → tables, `defines_schema` → models |
| `data` (GraphQL) | `defines_schema` → resolver code |
| `data` (OpenAPI) | `routes` → services |
| `script` | Same as `code` |
| `markup` | `related` → components |

**Import edge creation rule (CRITICAL):** For every code file, emit exactly one `imports` edge per entry in `batchImportData[filePath]`. Sum `batchImportData[file].length` across all code files — the number of `imports` edges MUST equal that sum. The merge script's `tested_by` linker canonicalizes direction (flip inverted edges, drop semantically broken ones, supplement with path-convention pairings). Production nodes that source any `tested_by` edge get the `"tested"` tag.

**Batch output:** `batch-<i>.json` files in the intermediate directory. For large batches (>60 nodes or >120 edges), split into `batch-<i>-part-<k>.json`.

---

### Pass 3: Assembly & Review

**Role:** Merge all batch outputs, normalize, validate completeness.

#### Merge Script

Run the bundled `merge-batch-graphs.py`:

1. Reads all `batch-*.json` files (including `batch-<i>-part-<k>.json`)
2. Combines all nodes and edges across batches
3. Normalizes node IDs:
   - Strips double prefixes (`project:file:path` → `file:path`)
   - Strips project-name prefixes
   - Adds missing type prefixes (bare paths → `file:<path>`)
4. Normalizes complexity values via alias map (`low`→`simple`, `medium`→`moderate`, `high`→`complex`)
5. Rewrites edge references to match corrected node IDs
6. Deduplicates edges by `(source, target, type)` — keeps last occurrence
7. Drops dangling edges referencing missing nodes
8. Runs `tested_by` canonicalization:
   - **Pass 1:** Walks LLM-emitted `tested_by` edges, flips inverted ones (test→prod becomes prod→test), drops semantically broken edges (test↔test, prod↔prod, orphan endpoints)
   - **Pass 2:** Supplements with path-convention pairings (e.g., `src/auth.ts` ↔ `src/__tests__/auth.test.ts`)
   - Tags production nodes with `"tested"`

#### Assemble Reviewer (LLM)

The assemble-reviewer subagent validates:
1. Every file in `scan-result.json` has a corresponding node
2. Every node has at least one edge (except standalone config/utility files)
3. No orphan nodes (edges pointing to non-existent target IDs)
4. Layer distribution is reasonable
5. Hub nodes are documented
6. Cross-batch edges verified against `importMap`

---

### Pass 4: Architecture Classification

**Role:** Classify every file-level node into exactly one logical architecture layer.

**Method:** Two-phase — deterministic structural analysis script + LLM semantic layer assignment.

#### Phase 1: Structural Analysis Script

Computes:
- **Directory grouping** — by top-level directory after common prefix
- **Node type grouping** — distribution of code vs. non-code files
- **Import adjacency matrix** — fan-in/fan-out per file, inter-group import frequency
- **Cross-category edge analysis** — config→code, service→deployment, schema→code patterns
- **Intra-group density** — cohesion signal for layer boundaries
- **Directory pattern matching** — classify directory names against known architectural patterns (see table below)
- **Deployment topology** — Dockerfile→compose→K8s chains, multi-env detection
- **Data pipeline detection** — schema→migration→model→API chains
- **Documentation coverage** — which groups have documentation

**Directory→Pattern mapping (for the script):**

| Directory Patterns | Pattern Label |
|-------------------|---------------|
| `routes`, `api`, `controllers`, `endpoints`, `handlers`, `serializers` | `api` |
| `services`, `core`, `lib`, `domain`, `logic`, `engine`, `composables`, `internal` | `service` |
| `models`, `db`, `data`, `persistence`, `repository`, `entities`, `migrations` | `data` |
| `components`, `views`, `pages`, `ui`, `layouts`, `screens` | `ui` |
| `middleware`, `plugins`, `interceptors`, `guards` | `middleware` |
| `utils`, `helpers`, `common`, `shared`, `tools`, `templatetags`, `pkg` | `utility` |
| `config`, `constants`, `env`, `settings`, `management` | `config` |
| `__tests__`, `test`, `tests`, `spec`, `specs` | `test` |
| `types`, `interfaces`, `schemas`, `contracts`, `dtos`, `dto` | `types` |
| `hooks` | `hooks` |
| `store`, `state`, `reducers`, `actions`, `slices` | `state` |
| `assets`, `static`, `public` | `assets` |
| `cmd`, `bin` | `entry` |
| `docs`, `documentation`, `wiki` | `documentation` |
| `deploy`, `deployment`, `infra`, `infrastructure`, `k8s`, `kubernetes`, `terraform`, `docker` | `infrastructure` |
| `.github`, `.gitlab`, `.circleci` | `ci-cd` |
| `sql`, `database`, `schema` | `data` |

#### Phase 2: Semantic Layer Assignment (LLM)

Using the script's structural results + file summaries/tags, assign every file to exactly one of 3-10 layers:

**Layer taxonomy (10 standard layers):**

| Layer | ID | Color | Node Types | Description |
|-------|----|-------|-----------|-------------|
| UI | `layer:ui` | Cyan `#22d3ee` | `file` (frontend), `class` (components) | User-facing interfaces, pages, views |
| API | `layer:api` | Sky `#38bdf8` | `file` (routes), `endpoint` | HTTP/RPC endpoints, controllers |
| Service | `layer:service` | Emerald `#34d399` | `file` (logic), `function`, `module` | Business logic, domain services |
| Data | `layer:data` | Violet `#a78bfa` | `table`, `schema`, `file` (models) | Database, models, schemas |
| Infrastructure | `layer:infrastructure` | Amber `#fbbf24` | `service`, `pipeline`, `resource` | Cloud, deploy, containers |
| Config | `layer:config` | Slate `#94a3b8` | `config` | Configuration, env, settings |
| Auth | `layer:auth` | Rose `#fb7185` | `file` (auth), `function` (middleware) | Authentication, authorization |
| Events | `layer:events` | Orange `#fb923c` | `file` (events), `function` (pub/sub) | Message queues, event bus |
| Utility | `layer:utility` | Slate-muted `#64748b` | `file` (utils), `function` (helpers) | Shared libs, helpers |
| External | `layer:external` | Slate-dark `#475569` | `module` (external), `service` (3rd-party) | Third-party, external APIs |

**Non-code layer assignment:**

| Node Types | Target Layer | Merge Guidance |
|-----------|-------------|----------------|
| `service`, `resource` | `layer:infrastructure` | Merge into Infrastructure |
| `pipeline` | `layer:infrastructure` or `layer:ci-cd` | Separate CI/CD if 3+ pipeline files |
| `document` | `layer:documentation` | Merge into root or relevant code layer if <3 docs |
| `table`, `schema`, `endpoint` | `layer:data` | Merge into Data layer |
| `config` | `layer:config` | Merge into root layer if <3 configs |

**Layer output format:**
```json
[
  {
    "id": "layer:api",
    "name": "API Layer",
    "description": "HTTP endpoints, route handlers, and request/response processing",
    "nodeIds": ["file:src/routes/index.ts", "endpoint:api/openapi.yaml:GET-/users"]
  }
]
```

Required fields: `id`, `name`, `description`, `nodeIds`. Every file-level node MUST appear in exactly one layer.

---

### Pass 5: Tour Builder

**Role:** Generate 5-15 dependency-ordered learning tour steps teaching the project's architecture.

**Method:** Two-phase — graph topology analysis script + LLM pedagogical tour design.

#### Phase 1: Graph Topology Script

Computes:
- **Fan-in ranking** — most-depended-upon nodes (architectural keystones)
- **Fan-out ranking** — widest-scope nodes (good for overview)
- **Entry point candidates** — scored by filename patterns + position + fan metrics
- **BFS traversal** — from top code entry point following imports/calls edges, recording depth levels
- **Tightly coupled clusters** — 2-5 nodes with high mutual connectivity
- **Non-code file inventory** — by category (documentation, infrastructure, data, config)

#### Phase 2: Pedagogical Tour Design (LLM)

**Step structure:**

```json
{
  "order": 1,
  "title": "Project Overview",
  "description": "Start with the README to understand the project's purpose...",
  "nodeIds": ["document:README.md"],
  "languageLesson": "Optional: explain a notable language/framework pattern"
}
```

**Tour design principles:**
- Start with README (Step 1) for project context
- Follow BFS depth ordering for code files (foundational → consumers)
- Integrate non-code stops at pedagogically correct positions
- Group tightly-coupled clusters into single steps
- Use fan-in ranking to prioritize architectural keystones
- Use layer ordering for narrative arc (bottom-up: Data → Service → API → UI)
- Each description connects to previous steps, building a coherent narrative
- 5-15 steps, 1-5 nodeIds per step

---

### Pass 6: Validation

**Role:** Validate the complete Knowledge Graph for correctness and completeness.

#### 4-Tier Validation Pipeline

**Tier 1: Sanitize**
- Null collections → empty arrays (`layers: null` → `layers: []`)
- Lowercase enum-like strings (`type`, `complexity`, `direction`)
- Strip null optionals (`filePath: null` → delete key)

**Tier 2: Auto-Fix**
- Missing `type` → `"file"` (default)
- Missing `complexity` → `"moderate"` (default)
- Missing `summary` → node name
- Missing `tags` → `[]`
- Complexity aliases: `low`→`simple`, `medium`→`moderate`, `high`→`complex`
- Edge direction aliases: `to`→`forward`, `from`→`backward`, `both`→`bidirectional`
- Edge weight: coerce string→number, clamp to [0, 1], default 0.5

**Tier 3: Schema Validation**
- Each node/edge validates against Zod schema
- Invalid items dropped with logged issues
- At least one valid node required (fatal otherwise)

**Tier 4: Referential Integrity**
- Every edge `source` and `target` must exist in node set
- Dangling edges dropped
- Layer `nodeIds` filtered to existing nodes
- Tour `nodeIds` filtered to existing nodes
- Orphan nodes (no edges) flagged as warnings

#### Alias Maps

LLMs produce inconsistent type names. Normalize via alias maps before validation:

**Node type aliases (60+ mappings):**
```
func→function, fn→function, method→function,
interface→class, struct→class,
mod→module, pkg→module, package→module,
container→service, deployment→service, pod→service,
doc→document, readme→document, docs→document,
job→pipeline, ci→pipeline,
route→endpoint, api→endpoint, query→endpoint, mutation→endpoint,
setting→config, env→config, configuration→config,
infra→resource, infrastructure→resource, terraform→resource,
migration→table, database→table, db→table, view→table,
proto→schema, protobuf→schema, definition→schema, typedef→schema,
business_domain→domain, business_flow→flow, business_process→flow,
task→step, business_step→step,
note→article, page→article, wiki_page→article,
person→entity, actor→entity, organization→entity,
tag→topic, category→topic, theme→topic,
assertion→claim, decision→claim, thesis→claim,
reference→source, raw→source, paper→source
```

**Edge type aliases (50+ mappings):**
```
extends→inherits, invokes→calls, invoke→calls,
uses→depends_on, requires→depends_on,
relates_to→related, related_to→related, similar→similar_to,
import→imports, export→exports, contain→contains,
publish→publishes, subscribe→subscribes,
describes→documents, documented_by→documents,
creates→provisions, exposes→serves, listens→serves,
deploys_to→deploys, migrates_to→migrates,
routes_to→routes, triggers_on→triggers, fires→triggers,
defines→defines_schema,
has_flow→contains_flow, next_step→flow_step, interacts_with→cross_domain,
references→cites, cites_source→cites,
conflicts_with→contradicts, disagrees_with→contradicts,
refines→builds_on, elaborates→builds_on,
illustrates→exemplifies, instance_of→exemplifies, example_of→exemplifies,
belongs_to→categorized_under, tagged_with→categorized_under,
written_by→authored_by, created_by→authored_by
```

Note: `implemented_by` is intentionally NOT aliased to `implements` — it inverts edge direction.

#### Inline Validation (default)

For the default (non-LLM review) path, run inline deterministic validation checking:
- Required fields present on all nodes/edges
- No duplicate node IDs
- All edge sources/targets exist in node set
- Every file-level node assigned to exactly one layer
- All tour nodeIds reference existing nodes
- Orphan nodes flagged as warnings

#### LLM Review (--review flag)

For the full review path, dispatch a graph-reviewer subagent that cross-validates:
- Every file in scan inventory has a corresponding graph node
- Every graph node's filePath appears in scan inventory
- Edge counts are reasonable (not all nodes in one layer, reasonable edge density)
- Phase warnings reviewed and addressed

---

### Pass 7: Save & Dashboard

1. Write final `knowledge-graph.json` to `.diagram/` (or `.understand-anything/` for dashboard compatibility)
2. Write `meta.json` with `gitCommitHash`, `analyzedAt`, `version`, `analyzedFiles`
3. Build fingerprint baseline via `build-fingerprints.mjs` (enables future incremental updates)
4. Clean up intermediate files (preserving `scan-result.json` for future incremental runs)
5. Report summary:
   - Project name, description
   - Files analyzed (by `fileCategory`: code, config, docs, infra, data, script, markup)
   - Nodes created (by type)
   - Edges created (by type)
   - Layers identified (with names and file counts)
   - Tour steps generated
   - Phase warnings
6. Launch interactive dashboard (if graph validation passed)

---

## Plugin Architecture

New languages and frameworks are supported through a plugin system:

```
plugins/
├── extractors/          # Language-specific structural extractors
│   ├── types.ts         # LanguageExtractor interface
│   └── index.ts         # Built-in extractors (10 code languages)
├── parsers/             # Non-code parsers
│   ├── index.ts         # Register all parsers
│   ├── markdown.ts      # Sections, wikilinks, frontmatter
│   ├── yaml.ts          # Top-level keys, docker-compose services
│   ├── json.ts          # Top-level keys
│   ├── toml.ts          # Tables, keys
│   ├── env.ts           # Variable definitions
│   ├── dockerfile.ts    # Stages, instructions
│   ├── sql.ts           # Tables, views, migrations
│   ├── graphql.ts       # Types, queries, mutations
│   ├── protobuf.ts      # Messages, services, enums
│   └── terraform.ts     # Resources, modules, variables
├── languages/           # Language configuration
│   ├── index.ts         # LanguageRegistry
│   ├── python.md        # Python-specific patterns, idioms, edge conventions
│   ├── typescript.md    # TS-specific patterns
│   ├── go.md            # Go-specific patterns
│   └── ...
├── frameworks/          # Framework configuration
│   ├── index.ts         # FrameworkRegistry
│   ├── django.md        # Django-specific layer mapping, directory signals
│   ├── react.md         # React-specific patterns
│   └── ...
└── locales/             # Output language guides
    ├── zh.md            # Chinese language conventions
    ├── ja.md            # Japanese language conventions
    └── ...
```

### Plugin Interfaces

```typescript
interface AnalyzerPlugin {
  name: string;
  languages: string[];
  analyzeFile(filePath: string, content: string): StructuralAnalysis;
  resolveImports?(filePath: string, content: string): ImportResolution[];
  extractCallGraph?(filePath: string, content: string): CallGraphEntry[];
  extractReferences?(filePath: string, content: string): ReferenceResolution[];
}

interface StructuralAnalysis {
  functions: Array<{ name: string; lineRange: [number, number]; params: string[]; returnType?: string }>;
  classes: Array<{ name: string; lineRange: [number, number]; methods: string[]; properties: string[] }>;
  imports: Array<{ source: string; specifiers: string[]; lineNumber: number }>;
  exports: Array<{ name: string; lineNumber: number; isDefault?: boolean }>;
  // Non-code structural data (optional):
  sections?: SectionInfo[];
  definitions?: DefinitionInfo[];
  services?: ServiceInfo[];
  endpoints?: EndpointInfo[];
  steps?: StepInfo[];
  resources?: ResourceInfo[];
}

interface LanguageConfig {
  id: string;
  name: string;
  extensions: string[];
  treeSitterConfig?: TreeSitterConfig;
  filePatternConfig?: FilePatternConfig;
}

interface FrameworkConfig {
  id: string;
  name: string;
  language: string;
  directorySignals: string[];
  layerMapping: Record<string, string>;
  entryPointPatterns: string[];
}
```

---

## Manual Quick Path

For small projects or quick sketches, the full KG pipeline is overkill. The manual approach still works:

1. **Read the README** — understand what the project does.
2. **`ls` top-level and source directories** — spot the layer structure.
3. **Read 3-5 key files** — entry point, main service, key model.
4. **Sketch a minimal KG** — 5-15 nodes, key edges only, no formal classification.
5. **Verify with the user** — "Here's what I found. Is this architecture accurate?"

Use the manual path for projects under ~20 source files or when the user explicitly asks for a quick sketch.

---

## Architecture Summary Template

After analysis, produce this structured summary before any generation. It's the bridge between raw analysis and creative output.

```markdown
## Architecture Summary

**Project:** <name>
**Language(s):** <list>
**Framework(s):** <list>
**Analysis Hash:** <gitCommitHash>

### Layer Breakdown
| Layer | Node Count | Key Nodes |
|-------|-----------|-----------|

### Hub Nodes (Architectural Keystones)
| Node | Layer | Fan-In | Why It's Central |
|------|-------|--------|-----------------|

### Dependency Graph
- Total nodes: N (by type: file K, function J, config C, document D, ...)
- Total edges: M (by type: imports X, calls Y, contains Z, ...)
- External dependencies: K
- Graph depth (UI→Data): D levels

### Guided Tour (Topological)
1. <node> — <why first>
2. <node> — <builds on 1>
...

### Change Impact (if diff-aware)
- Risk level: low/medium/high
- Direct impact: N nodes
- Indirect impact: M nodes
- Layers affected: <list>

### For Diagram Generation
| GraphNode | Box Position | Color | Width × Height |
|-----------|-------------|-------|----------------|

### For Documentation
| GraphNode | Doc Section | Component Name | Priority |
|-----------|------------|----------------|----------|
```

---

## Change Impact Analysis

For pending changes, compute the blast radius:

### DiffImpact Shape

```typescript
DiffImpact {
  changedNodes: string[];        // GraphNode.id[] of changed files
  directImpact: string[];        // 1-hop dependents (nodes that import/call changed nodes)
  indirectImpact: string[];      // 2-hop dependents
  upstreamImpact: string[];      // nodes that changed nodes import/call (if imports changed)
  newNodes: string[];            // new files not in previous graph
  removedNodes: string[];        // deleted files
  layerImpact: {                 // impact by architectural layer
    layer: string;               // layer id
    affectedNodes: number;
  }[];
  riskLevel: "low" | "medium" | "high";
}
```

### Risk Heuristics

- `"high"`: hub node changed (fan-in > 10) OR auth/config layer affected OR >10 direct dependents
- `"medium"`: service/data layer changed with 3-10 direct dependents
- `"low"`: utility layer changed, <3 direct dependents, cosmetic-only changes

---

## From Knowledge Graph to Outputs

### To Diagrams (Mode A)

| KG Element | Diagram Element |
|------------|----------------|
| `GraphNode.type` → layer taxonomy | Component fill color + stroke color |
| `GraphNode.name` | Component label (11px, bold) |
| `GraphNode.summary` | Component sublabel (9px, muted) |
| `GraphNode.tags` | Annotation tags below sublabel (8px) |
| `GraphEdge[]` (internal, forward) | Solid arrow between components |
| `GraphEdge[]` (external) | Dashed arrow to External box |
| `GraphEdge` type label | Arrow label text |
| Layer grouping | Region boundary (`stroke-dasharray="8,4"`) |
| Auth-layer nodes | Security group boundary (`stroke-dasharray="4,4"`, rose) |
| Hub nodes (top fan-in) | Taller box, bold label, centered in layer column |
| `DiffImpact.changedNodes` | Dashed border or `*` marker |
| `TourStep[]` | Numbered annotations or sidebar |

**SVG Layout from Graph Topology:**
1. Horizontal columns per layer (left→right: External → UI → API → Service → Data → Config)
2. Vertical ordering within layers — topologically sorted (dependencies above, dependents below)
3. Hub nodes centered vertically within their layer column
4. Arrows drawn before boxes (z-order)
5. Opaque background rect behind every semi-transparent component box (masking)

### To Doc Pages (Mode B)

| KG Element | Doc Element |
|------------|-------------|
| `Layer[]` | A section per layer with description |
| `GraphNode` (per node) | A component card (4-file pattern) |
| `GraphNode.summary` | Card body text |
| `GraphNode.tags` | Tag chips in the card |
| `GraphNode`'s edges | "Dependencies" and "Used By" sub-sections |
| `TourStep[]` | "Architecture Overview" or "Getting Started" section |
| `DiffImpact` | "Recent Changes" or changelog section |
| Hub nodes | "Key Components" highlight section |
| `domainMeta` | Business context sidebar |
| `knowledgeMeta.wikilinks` | "See Also" cross-references |

### To Dashboard

The KG format is directly compatible with the Understand-Anything dashboard:
- `kind: "codebase"` → hierarchical dagre layout (default)
- `kind: "knowledge"` → force-directed layout (for wiki/knowledge graphs)
- Diff overlay: reads `.diagram/diff-overlay.json` to highlight changed/affected nodes
- Layer filtering: toggle layers on/off
- Tour navigation: step-through guided walkthrough
