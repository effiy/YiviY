# Validation Reference — rui-graph

> Complete validation rules, check details, severity classification, and auto-fix guidance for the rui-graph review pipeline.

## Validation Architecture

Validation happens in two layers:

1. **Deterministic script** (`resources/validate-graph.js`) — mechanical checks: schema, referential integrity, uniqueness, color palette, coverage.
2. **LLM reviewer** (`agents/graph-reviewer.md`) — semantic checks: description quality, relationship plausibility, cluster quality.

## Deterministic Checks

### Check 1: Schema Validation (Critical)

Every node MUST have:

| Field | Type | Non-empty? | Notes |
|-------|------|------------|-------|
| `id` | string | Yes | Must match one of the valid prefixes |
| `type` | string | Yes | One of: `card`, `tag`, `link_dest`, `badge`, `cluster`, `card_group` |
| `label` | string | Yes | Display label (may include emoji for cards) |

Every edge MUST have:

| Field | Type | Non-empty? | Notes |
|-------|------|------------|-------|
| `id` | string | Yes | Must be unique across all edges |
| `source` | string | Yes | Must reference existing node `id` |
| `target` | string | Yes | Must reference existing node `id` |
| `type` | string | Yes | One of the 10 valid edge types |

**Auto-fix**: Drop nodes with missing `id` or invalid `type`. Drop edges with missing `source`/`target`/`type`.

### Check 2: Referential Integrity (Critical)

Every `edge.source` and `edge.target` must exist in the node set.

**Implementation**:
```javascript
const nodeIds = new Set(graph.nodes.map(n => n.data.id));
const danglingEdges = graph.edges.filter(e => {
  return !nodeIds.has(e.data.source) || !nodeIds.has(e.data.target);
});
```

**Auto-fix**: Drop dangling edges (they can't be repaired without the missing node).

### Check 3: Card Coverage (Critical)

Every card from `card-analysis.json` must have a corresponding graph node.

**Implementation**: Compare `card-analysis.json` card count against graph node count for type `card`. Also verify individual card IDs.

**Auto-fix**: Not auto-fixable. If cards are missing, the build step must be re-run.

### Check 4: Uniqueness (Critical)

- No duplicate node `id` values
- No duplicate edge `id` values
- No duplicate edge `(source, target, type)` tuples

**Auto-fix**: Keep the last occurrence of duplicate nodes (the build script writes in order, later = updated). Drop duplicate edges.

### Check 5: Color Mapping (Warning)

Badge values on card nodes must match the canonical palette:

```
Core/核心 → #34d399, Report/报告 → #fb7185, Guide/指南 → #38bdf8,
OSS → #fbbf24, Agent → #a78bfa, Beta → #fb923c
```

Tag modifier values must match the canonical palette:

```
warn→#f59e0b, accent→#eab308, info→#3b82f6, red→#ef4444,
purple→#8b5cf6, cyan→#06b6d4, pass/green→#22c55e
```

**Auto-fix**: Map unknown badge to `cyan` (default). Map unknown modifier to `slate` (`#64748b`). Warn but don't block.

### Check 6: Completeness (Warning)

- `graph.nodes.length > 0`
- `graph.edges.length > 0`
- Every tag from source has a tag node (check tag texts against `card-analysis.json`)
- Every link destination from source has a `link_dest` node

### Check 7: Richness Consistency (Warning)

Computed richness should match the stored `richness` field on card nodes:

```javascript
function computeRichness(card) {
  let s = 1;
  if (card.desc) s += Math.min(card.desc.replace(/<[^>]*>/g, '').length / 50, 3);
  if (card.tags) s += card.tags.length * 0.5;
  if (card.links && card.links.length) s += 1;
  if (card.meta) s += 1;
  if (card.badge) s += 0.5;
  return Math.round(s);
}
```

**Threshold**: ±1 difference = warning. >±1 = issue.

### Check 8: Orphan Detection (Warning)

Nodes with zero incident edges (no edges where the node is source OR target).

**Implementation**:
```javascript
const connectedNodes = new Set();
graph.edges.forEach(e => {
  connectedNodes.add(e.data.source);
  connectedNodes.add(e.data.target);
});
const orphans = graph.nodes.filter(n => !connectedNodes.has(n.data.id));
```

Isolated cards are expected (some cards genuinely don't connect to others). Orphan tag nodes suggest missing `has_tag` edges. Orphan link_dest nodes suggest missing `links_to` edges.

### Check 9: Self-Reference Detection (Warning)

Edges where `source === target`. Should never happen — indicates a bug in edge generation.

**Auto-fix**: Drop self-referencing edges.

## Runtime Browser Checks

These checks catch bugs that pass structural validation but cause **browser console errors or broken UI interactions**. Run these manually or via automated browser testing.

### Runtime Check 1: `filterByBadge('all', null)` Button State

**Problem:** `resetView()` calls `filterByBadge('all', null)` — the `null` button means no filter button gets the `.active` class after reset.

**Check:** With browser console open, click any badge filter, then press `R`. Verify the "All" filter button has the `.active` class.

**Auto-fix in template:** Always re-find the "All" button: `document.querySelector('#badge-filters .filter-btn')`.

### Runtime Check 2: `escHtml` Single Quote Handling

**Problem:** `escHtml()` doesn't escape `'`, so label values containing `'` break onclick handlers.

**Check:** Verify `escHtml("test'value")` returns a string without raw single quotes. In the generated `index.js`, the function must include `.replace(/'/g, '&#39;')`.

### Runtime Check 3: Search Edge Dimming

**Problem:** `doSearch()` dims nodes but not edges, leaving edges visible between dimmed nodes.

**Check:** Type a search query that matches some nodes. Verify that edges between non-matching nodes are dimmed (opacity reduced).

### Runtime Check 4: `filterByBadge` Cluster Node Handling

**Problem:** The visibility conditional misses `cluster` nodes, leaving them always visible.

**Check:** Ensure generated `index.js` includes `|| n.data('type') === 'cluster'` in the filterByBadge non-card visibility conditional.

### Runtime Check 5: `focusNode` Empty Collection Guard

**Problem:** Calling `focusNode(id)` with a non-existent ID creates an empty collection; `.length` is 0 and calling `.addClass()` etc. on it fails silently.

**Check:** Verify `focusNode` has `if (!node || !node.length) return;` as its first guard.

### Runtime Check 6: `.detail-badge` Default Colors

**Problem:** The `.detail-badge` base class lacks `border-color`, `color`, and `background`. Unknown badge types render invisible.

**Check:** In the generated `index.css`, verify `.detail-badge` has `border: 1px solid var(--border); color: var(--text-soft); background: var(--border);`.

## Severity Classification

| Level | Meaning | Action |
|-------|---------|--------|
| **BLOCKER** | Graph is structurally broken — missing required data, broken references | Must fix before HTML generation |
| **WARNING** | Graph is usable but has quality issues | Should fix; OK to ship with warnings noted |
| **INFO** | Minor observations, suggestions for improvement | Can ship; consider for next iteration |
| **RUNTIME** | Structural validation passes but browser console errors or broken interactions will occur | Must fix before finalizing — see Runtime Browser Checks above |

## Auto-Fix Pipeline

When validation finds issues, apply fixes in this order:

1. **Drop dangling edges** — remove any edge whose source or target doesn't exist in nodes
2. **Drop invalid nodes** — remove nodes with missing `id` or invalid `type`
3. **Deduplicate** — remove duplicate node IDs (keep last), duplicate edge IDs (keep last), duplicate edge keys (keep first)
4. **Normalize colors** — map unknown badges to cyan, unknown modifiers to slate
5. **Fix richness** — recompute richness for cards where discrepancy > 1
6. **Drop self-references** — remove edges where source === target

After applying fixes, re-run validation. If critical issues remain, save with warnings and report.

## Post-Validation Report Format

```json
{
  "approved": true,
  "issues": [],
  "warnings": ["2 orphan nodes: tag:RareTag, tag:AnotherRare"],
  "autoFixed": {
    "danglingEdgesRemoved": 0,
    "invalidNodesRemoved": 0,
    "duplicatesRemoved": 0,
    "colorNormalizations": 0,
    "richnessRecalculations": 1,
    "selfReferencesRemoved": 0
  },
  "stats": {
    "totalNodes": 67,
    "totalEdges": 142,
    "nodeTypes": {},
    "edgeTypes": {}
  }
}
```
