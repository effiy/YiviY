# Diagram Node Extractor Agent

Inspect source code or config files and propose graph nodes + candidate edges for Phase 0.2.

## Role

When the analyzer subagent assigned to a batch needs to lift its slice from "files on disk" to "graph nodes", the Extractor provides a structured proposal. It reads project files (Python, JS/TS, Go, Rust, or YAML/JSON/Markdown/Terraform etc.), emits typed `GraphNode` objects, and surfaces candidate `GraphEdge` entries with sources. This is the deterministic bridge between the SCAN result (`scan-result.json`) and the LLM layer that adds `summary` / `tags` / `complexity`.

## Inputs

You receive:

- **scan_entry**: One row of `scan-result.json` (`path`, `language`, `category`, `size_bytes`, `imports_to_resolve[]`)
- **node_type_aliases**: Hash of `{ given_name: canonical_name }` for node types (e.g., `func → function`, `interface → class`)

## Process

### Step 1: Load the File

Read the file as text. If `size_bytes > 256 KB` or `category === 'binary'`, skip and emit `error: "size_or_binary"`.

### Step 2: Parse via the Right Strategy

| `category` | Strategy |
|-----------|----------|
| `code` (Python / JS / TS / Go / Rust / Java / C# / C++ / Ruby) | Use language-appropriate parser / regex extraction (tree-sitter grammar if bundled) |
| `config` | JSON / YAML parser; emit one `config` node + one `configures` edge per referenced file |
| `docs` (Markdown / MDX / reST) | Treat as one `document` node; do not parse prose |
| `infra` (Dockerfile / K8s YAML) | One `service` or `pipeline` node depending on shape |
| `infra` (Terraform / HCL) | One `resource` per `resource` block |
| `infra` (CI YAML — `.github/workflows/*`, `.gitlab-ci.yml`, etc.) | One `pipeline` node |
| `data` (SQL) | One `table` per `CREATE TABLE` |
| `data` (GraphQL / Proto) | One `schema` node |
| `data` (OpenAPI / Swagger) | One `endpoint` per operation |
| unknown / no rule | Emit a single `document` node with `tags: ["unknown"]` for the orchestrator to inspect |

### Step 3: Emit Top-Level Nodes

| File category | Top-level node | Rule |
|---------------|----------------|------|
| `code` | `file:<path>` | Always emitted |
| `config` / `infra` / `data` | As above per Step 2 | Always emitted |
| `docs` | `document:<path>` | Always emitted |

Generate the canonical id as `type:<path>` where `type` is one of `file` / `function` / `class` / `module` / `config` / `document` / `service` / `pipeline` / `resource` / `table` / `endpoint` / `schema`.

### Step 4: Extract Sub-Nodes (Code Only)

For `code` files, walk the AST (or regex fallback) and emit child nodes:

| Construct | Child node id | Parent edge |
|-----------|----------------|------------|
| `class Foo` | `class:<path>:Foo` | `contains` |
| `def method(self, ...)` inside class | `function:<path>:Class.method` | `contains` (from class) |
| `def top_level(...)` | `function:<path>:top_level` | `contains` (from file) |
| `module` (file with `__init__.py` semantics) | `module:<dir>/` | `contains` (init file → module) |

### Step 5: Emit Edges

Edge id convention: `edge:<sourceId>:<targetId>:<type>`.

| Construct | Edge type |
|-----------|:---:|
| `import X from 'Y'` | `imports` |
| `from .x import Y` | `imports` (target = sibling) |
| `class A(B)` | `inherits` |
| `class A implements I` | `implements` |
| `class A extends B` (TS/Java) | `inherits` |
| `module.exports = { foo, bar }` | `exports` from `__init__` / barrel |
| `f()` (call) | `calls` (best-effort, same-file only) |
| Config file referencing code path | `configures` |

Deduplicate edges by `(source, target, type)` tuple.

### Step 6: Validation Hints

| Check | Action |
|-------|--------|
| Multiple class nodes share a name within one file | Disambiguate by appending `:<line_no>` |
| `import` resolves to a path outside the repo (e.g., `lodash`) | Emit `edge:` with `target: "external:lodash"` for Phase 0.3 to normalize |
| `class` with no methods | Set `complexity: "simple"`, leave `methods: []` |
| Function with > 60 lines | Set `complexity: "complex"`, add tag `["long"]` (LLM may refine) |

### Step 7: Emit

Write the new batch fragment plus a per-file diff hint (added nodes / removed nodes relative to the prior iteration if available).

## Output Format

```json
{
  "scan_path": "src/foo/bar.py",
  "language": "python",
  "category": "code",
  "nodes": [
    { "id": "file:src/foo/bar.py", "type": "file", "name": "bar.py", "summary": "", "tags": [], "complexity": "moderate" },
    { "id": "class:src/foo/bar.py:Bar", "type": "class", "name": "Bar", "summary": "", "tags": [], "complexity": "moderate" },
    { "id": "function:src/foo/bar.py:Bar.process", "type": "function", "name": "process", "summary": "", "tags": [], "complexity": "moderate" }
  ],
  "edges": [
    { "id": "edge:file:src/foo/bar.py:class:src/foo/bar.py:Bar:contains", "source": "file:src/foo/bar.py", "target": "class:src/foo/bar.py:Bar", "type": "contains" },
    { "id": "edge:class:src/foo/bar.py:Bar:function:src/foo/bar.py:Bar.process:contains", "source": "class:src/foo/bar.py:Bar", "target": "function:src/foo/bar.py:Bar.process", "type": "contains" }
  ],
  "external_refs": ["lodash"],
  "errors": [],
  "warnings": []
}
```

Empty `summary` / `tags` are placeholders for the LLM pass. The Extractor stays deterministic; the LLM layer (called separately) fills the semantic fields.

## Guidelines

- **Idempotent re-runs**: same file content → identical `nodes` + `edges`. No "best guess" — fail loudly instead.
- **No LLM calls**: this agent does not call LLMs. It produces structural skeletons only.
- **Error transparency**: invalid syntax → `errors[]`, not silent skip; the orchestrator decides remediation.
- **Alias map is honored**: use the canonical id; never leak language-specific nicknames (`func → function`).
- **Path-style prefix discipline**: `file:` / `class:` / `function:` prefixes are mandatory.
