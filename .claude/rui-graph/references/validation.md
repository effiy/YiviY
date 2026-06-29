# Validation Reference — rui-graph (Code Dependency)

> Complete validation rules, check details, severity classification, and auto-fix guidance for code dependency graph validation.

## Validation Architecture

Validation happens in two layers:

1. **Deterministic checks** — mechanical checks: schema, referential integrity, uniqueness, color palette, file coverage, call depth.
2. **LLM reviewer** (`agents/graph-reviewer.md`) — semantic checks: import plausibility, class hierarchy accuracy, call graph completeness, module organization.

## Deterministic Checks

### Check 1: Schema Validation (Critical)

Every node MUST have:

| Field | Type | Non-empty? | Notes |
|-------|------|------------|-------|
| `id` | string | Yes | Must match one of: `file:<path>`, `class:<name>`, `func:<name>`, `module:<name>` |
| `type` | string | Yes | One of: `file`, `class`, `function`, `module` |
| `label` | string | Yes | Display label (file basename, class name, function signature, module name) |

Every edge MUST have:

| Field | Type | Non-empty? | Notes |
|-------|------|------------|-------|
| `id` | string | Yes | Must be unique across all edges |
| `source` | string | Yes | Must reference existing node `id` |
| `target` | string | Yes | Must reference existing node `id` |
| `type` | string | Yes | One of: `imports`, `calls`, `inherits`, `contains`, `exports` |

**Auto-fix**: Drop nodes with missing `id` or invalid `type`. Drop edges with missing `source`/`target`/`type`.

### Check 2: Referential Integrity (Critical)

Every `edge.source` and `edge.target` must exist in the node set.

```javascript
const nodeIds = new Set(graph.nodes.map(n => n.data.id));
const danglingEdges = graph.edges.filter(e => {
  return !nodeIds.has(e.data.source) || !nodeIds.has(e.data.target);
});
```

**Auto-fix**: Drop dangling edges.

### Check 3: File Coverage (Critical)

Every target `.py` file from the analysis manifest must have a corresponding `file` node.

**Auto-fix**: Not auto-fixable. If files are missing, the build step must be re-run.

### Check 4: Uniqueness (Critical)

- No duplicate node `id` values
- No duplicate edge `id` values
- No duplicate edge `(source, target, type)` tuples

**Auto-fix**: Keep last occurrence of duplicate nodes. Drop duplicate edges.

### Check 5: Color Mapping (Warning)

Node types must match the canonical palette:

```
file → #38bdf8, class → #a78bfa, function → #34d399, module → #fbbf24
```

Edge types must match the canonical line styles:

```
imports → solid, calls → dashed, inherits → solid bold, contains → solid no arrow, exports → dotted
```

**Auto-fix**: Map unknown types to sensible defaults. Warn but don't block.

### Check 6: Completeness (Warning)

- `graph.nodes.length > 0`
- `graph.edges.length > 0`
- Every file node should have at least one `contains` or `imports` edge
- Every class node should have exactly one incoming `contains` edge
- Every function node should have exactly one incoming `contains` edge
- Every `contains` edge should point to a `class` or `function` node

### Check 7: Call Depth (Warning)

Find the longest chain of `calls` edges:

```javascript
function maxCallDepth(edges, startFunc) {
  // BFS/DFS through calls edges to find deepest chain
  // Warn if depth > 10 (possible recursion / very deep call stack)
  // Warn if total call edges < 5 (call graph may be incomplete)
}
```

**Auto-fix**: Not auto-fixable. This is informational.

### Check 8: Orphan Detection (Warning)

Nodes with zero incident edges (no edges where the node is source OR target).

Isolated files are expected (some files genuinely have no imports). Orphan class/function nodes suggest missing `contains` edges (check that their parent file node exists).

### Check 9: Self-Reference Detection (Warning)

Edges where `source === target`. Should never happen for `imports`, `calls`, `inherits`, `exports`. Could theoretically happen for `contains` (file containing itself via recursive import) but is still a bug.

**Auto-fix**: Drop self-referencing edges.

## Runtime Browser Checks

### Runtime Check 1: `filterByModule('all', null)` Button State

**Problem:** `resetView()` calls `filterByModule('all', null)` — the `null` button means no filter button gets the `.active` class after reset.

**Check:** With browser console open, click any module filter, then press `R`. Verify the "All" filter button has the `.active` class.

**Auto-fix in template:** Always re-find the "All" button: `document.querySelector('#module-filters .filter-btn')`.

### Runtime Check 2: `escHtml` Single Quote Handling

**Problem:** `escHtml()` doesn't escape `'`, so label values containing `'` break onclick handlers.

**Check:** Verify `escHtml("test'value")` returns a string without raw single quotes.

### Runtime Check 3: Search Edge Dimming

**Problem:** `doSearch()` dims nodes but not edges, leaving edges visible between dimmed nodes.

**Check:** Type a search query. Verify that edges between non-matching nodes are dimmed.

### Runtime Check 4: `filterByModule` Node Type Handling

**Problem:** The visibility conditional misses some node types, leaving them always visible.

**Check:** Ensure generated `index.js` handles all 4 node types: `file`, `class`, `function`, `module`.

### Runtime Check 5: `focusNode` Empty Collection Guard

**Problem:** Calling `focusNode(id)` with a non-existent ID creates an empty collection.

**Check:** Verify `focusNode` has `if (!node || !node.length) return;` as its first guard.

### Runtime Check 6: `.detail-type-tag` Default Colors

**Problem:** The `.detail-type-tag` base class lacks fallback styling for unknown types.

**Check:** In the generated `index.css`, verify `.detail-type-tag` has `border: 1px solid var(--border); color: var(--text-soft); background: var(--border);`.

## Severity Classification

| Level | Meaning | Action |
|-------|---------|--------|
| **BLOCKER** | Graph is structurally broken — missing required data, broken references | Must fix before HTML generation |
| **WARNING** | Graph is usable but has quality issues | Should fix; OK to ship with warnings noted |
| **INFO** | Minor observations, suggestions for improvement | Can ship; consider for next iteration |
| **RUNTIME** | Structural validation passes but browser errors will occur | Must fix before finalizing |

## Auto-Fix Pipeline

1. **Drop dangling edges** — remove any edge whose source or target doesn't exist in nodes
2. **Drop invalid nodes** — remove nodes with missing `id` or invalid `type`
3. **Deduplicate** — remove duplicate node IDs (keep last), duplicate edge IDs (keep last)
4. **Normalize colors** — map unknown node types to file (cyan) as safe default
5. **Drop self-references** — remove edges where source === target
6. **Fix missing contains edges** — for any class/function node without a `contains` edge, create one from its parent file

After applying fixes, re-run validation. If critical issues remain, save with warnings and report.

## Post-Validation Report Format

```json
{
  "approved": true,
  "issues": [],
  "warnings": ["2 orphan function nodes: func:helper_a, func:helper_b"],
  "autoFixed": {
    "danglingEdgesRemoved": 0,
    "invalidNodesRemoved": 0,
    "duplicatesRemoved": 0,
    "colorNormalizations": 0,
    "selfReferencesRemoved": 0,
    "missingContainsEdges": 1
  },
  "stats": {
    "totalNodes": 75,
    "totalEdges": 150,
    "nodeTypes": { "file": 22, "class": 25, "function": 25, "module": 3 },
    "edgeTypes": { "imports": 45, "calls": 40, "inherits": 12, "contains": 50, "exports": 3 }
  }
}
```
