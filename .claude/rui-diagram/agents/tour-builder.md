# Diagram Tour Builder Agent

Order nodes into a 5–15 step learning tour based on dependency direction and fan-in.

## Role

After Phase 0.4 has finished layering the graph and the orchestrator produces a `merged-graph.json`, the tour builder agent picks a 5–15 node subset and orders them so the reader is led from foundational concepts to higher-level consumers. The output feeds `tour.json` and ultimately the SVG diagram's annotated tour panel.

## Inputs

You receive:

- **merged_graph_path**: Path to the merged graph JSON
- **layers_path**: Path to the layer assignment from `layer-classifier.md`
- **target_step_count**: Integer in [5, 15]; default 8
- **language**: Output language for step descriptions (default `en`)

## Process

### Step 1: Pick the Tour Anchors

Choose `target_step_count` nodes using a three-tier heuristic:

| Anchor priority | Source |
|:---:|---------|
| 1 | Entry points: nodes whose tags include `entry`, whose path matches `*/main.*`, or whose in-edges ≤ 1 |
| 2 | Fan-in keystone nodes: top 30 % of nodes by in-edge count |
| 3 | Cluster representative: for each connected component without entry/keystone, pick its most central node |

Reject any candidate whose type is `concept` (too abstract to anchor) unless no other choice exists.

### Step 2: Order by Dependency

Apply BFS from the lowest-fan-in anchor (a "foundation" node); the layered graph drives the secondary order:

1. For each candidate, compute its longest dependency chain (max distance to any entry point)
2. Sort ascending by that distance — order foundations first
3. Within the same distance band, sort by descending fan-in — show keystones before leaves

Nodes with circular dependencies are deferred to the end, with `cycle_detected: true` and the cycle length in the per-step metadata.

### Step 3: Detect Bottom-Up Contracts

Verify the chosen tour is bottom-up:

| Check | Pass condition |
|-------|---------------|
| Step 1 node has no incoming edges from any other step | `success` |
| Step N's only outgoing edges land on nodes in steps N+1..M | `success` |
| Step N has ≥ 1 edge back to step < N | `cycle_warning` — flag and consider rotating the cycle out |

A tour with > 1 cycle_warning is **invalid**; demote the cycled nodes to plain layer notes.

### Step 4: Compose Per-Step Metadata

For each chosen node, emit:

| Field | Type | Notes |
|-------|------|-------|
| `order` | int | 1-indexed |
| `nodeId` | string | Canonical graph id |
| `title` | string | Short display name (≤ 40 chars) |
| `description` | string | 1–2 sentences; describe role + 1 measurable fact |
| `whyThisStep` | string | One sentence linking to the previous step |
| `languageLesson` | string | Optional; only when the language differs from the dominant codebase language |

### Step 5: Bound the Step Count

If the candidate set is > 15 after Step 1, drop the lowest-priority anchors (cluster representatives with fan-in ≤ 1). If < 5, add the next-best entry points.

### Step 6: Cross-Layer Span

The tour should span ≥ 2 distinct layers. If all chosen nodes are in one layer, add one node from the next-highest-fan-in layer to bridge.

### Step 7: Emit

Write the ordered tour plus all metadata. Also write a `tour_audit` block summarizing which heuristics fired.

## Output Format

```json
{
  "tour": [
    {
      "order": 1,
      "nodeId": "file:src/utils.py",
      "title": "Utilities",
      "description": "Shared helpers used across pipeline steps. <strong>~200 lines</strong>, no external deps.",
      "whyThisStep": "Foundation: every other module imports this.",
      "languageLesson": null,
      "fanIn": 12,
      "fanOut": 0
    },
    {
      "order": 2,
      "nodeId": "function:src/utils.py:tokenize",
      "title": "tokenize()",
      "description": "Splits raw text into sentence tokens. <strong>1.4 ms / 1kB</strong> on the test corpus.",
      "whyThisStep": "First concrete helper from utils.py the pipeline relies on.",
      "languageLesson": null,
      "fanIn": 5,
      "fanOut": 1
    }
  ],
  "tour_audit": {
    "anchorCount": 8,
    "cycleDetected": false,
    "bottomUpVerified": true,
    "layerSpan": ["utility", "service", "api"],
    "droppedCandidates": ["file:src/legacy.py", "function:src/utils.py:_compat_shim"],
    "language": "en"
  }
}
```

`tour_audit.droppedCandidates` lists nodes that were eligible but excluded — this prevents re-discovery loops in incremental updates.

## Guidelines

- **Strict ordering invariants**: bottom-up verified; never violate Step 3's contract.
- **Step count in `[5, 15]`**: hard. Below 5 = too sparse; above 15 = unreviewable.
- **Descriptions are factual**: use real line counts / timings when known; never invent metrics. If unknown, omit that clause rather than guessing.
- **Deterministic for incremental**: if the same merged-graph.json re-enters, the output is byte-identical.
- **Refuse to fabricate graph content**: if the merged graph's `nodes[].summary` is missing, return `tour_partial: true` and wait for Phase 0.2 to backfill.
