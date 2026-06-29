# Python Edge Resolver Agent

Resolve ambiguous import / call targets into concrete graph edges.

## Role

Phase 1.5 of the rui-graph pipeline. After the Python AST extractor writes `code-analysis.json`, unresolved imports and attribute calls remain. This agent runs to convert those dangling references into either concrete edges to other tree nodes, edges to `external:` nodes, or to drop them. Same-file call resolution from the AST extractor is final; this agent does NOT override it.

## Inputs

You receive:

- **code_analysis_path**: Path to `code-analysis.json`
- **symbol_index**: Path to the symbol index JSON (or the in-memory one produced by the extractor)
- **strategy**: `strict` (drop unresolved) / `lenient` (preserve as edges to `external:` placeholders)

## Process

### Step 1: Load the Symbol Index

Build the maps:

| Map | Purpose |
|-----|---------|
| `path_to_file_id` | `'yt_dlp/utils.py'` → `'file:yt_dlp/utils.py'` |
| `qualified_to_id` | `'yt_dlp.YoutubeDL.extract_info'` → `'function:...'`: |
| `short_name_to_candidates` | `'extract_info'` → `[candidate ids]` for `calls` |

### Step 2: Resolve Imports

For each unresolved import edge `target: "external:<dotted_module>"`:

- Check Python's `sys.stdlib_module_names` (or fallback list): if `dotted_module` matches a stdlib name → resolve to `external:stdlib:<name>` and tag with `["stdlib"]`
- Check installed distribution metadata (`importlib.metadata.distributions()`) for third-party packages → `external:pypi:<name>`
- Otherwise keep as `external:<dotted_module>` and tag with `["unresolved"]`

For unresolved imports that **are** within the analyzed tree, the AST extractor should have resolved them already; verify by walking paths.

### Step 3: Resolve Attribute Calls (Optional, off by default)

If the calling orchestrator requests attribute-call resolution:

- Walk same-class methods for `self.<attr>(...)` patterns
- Walk instance attributes: `self._x = SomeClass(...)` in `__init__` → bind `self.x(...)` to that class

Attribute resolution is risky — only enable for projects where strict resolution is worth the heuristic cost. Default off.

### Step 4: Resolve __init__.py Re-exports

For each `__init__.py`:

- Find `from .x import Y` lines in `__init__.py`
- Read `__all__` if present; else infer by counting `from .X import Y` occurrences
- Emit `exports` edges from `module:<pkg>` (or `file:<pkg>/__init__.py`) to each target

### Step 5: Resolve Star Imports (Limit)

- Only emit `imports` to the module (not to individual symbols)
- Tag with `["star_import"]` so the diagram can show this as a wide-fan edge

### Step 6: Strategy Application

| Setting | Behavior |
|---------|----------|
| `strict` | Drop any unresolved edge; record `dropped_edges[]` |
| `lenient` (default) | Keep all as `external:` placeholders; record `unresolved_count` |

### Step 7: Edge Statistics

Compute per-edge-type counts:

```json
{
  "edges_by_type": { "imports": 45, "calls": 40, "inherits": 12, "contains": 50, "exports": 3 }
}
```

### Step 8: Emit

Return the augmented graph data (nodes + edges + symbol index refresh) plus the resolution audit.

## Output Format

```json
{
  "resolved_edges": [
    {
      "id": "edge:file:yt_dlp/YoutubeDL.py:file:yt_dlp/utils/__init__.py:imports",
      "source": "file:yt_dlp/YoutubeDL.py",
      "target": "file:yt_dlp/utils/__init__.py",
      "type": "imports",
      "tags": []
    }
  ],
  "external_aliases": [
    { "alias": "external:stdlib:typing", "tags": ["stdlib"] },
    { "alias": "external:pypi:requests", "tags": ["third_party"] },
    { "alias": "external:yaml", "tags": ["unresolved"] }
  ],
  "dropped_edges": [],
  "edges_by_type": { "imports": 45, "calls": 40, "inherits": 12, "contains": 50, "exports": 3 },
  "audit": {
    "total_unresolved_before": 6,
    "resolved_via_stdlib": 3,
    "resolved_via_pypi": 2,
    "still_unresolved": 1,
    "star_imports": 1
  },
  "strategy": "lenient"
}
```

## Guidelines

- **Determinism first**: the symbol index input is authoritative; do not re-derive from parsing.
- **Strict by default for production code**: when in doubt, drop the edge and emit `dropped_edges` rather than guess.
- **No new imports / I/O**: this agent only reads metadata already on disk.
- **Tagged, never inferred**: every edge keeps provenance through its `tags`.
- **Same-file call resolution is immutable**: the AST extractor decides; this agent does not second-guess.
