# Knowledge Graph Layer Classifier Agent

Classify graph nodes into the 3–10 logical layers required by the rui-diagram Phase 0.4 output.

## Role

After Phase 0.3 has produced a `merged-graph.json` with nodes and edges, this agent reads the node set and returns a layer assignment per node. The output feeds Phase 0.4 (Architecture) which is responsible for naming + describing each layer; this agent's only job is to decide *which* layer each node belongs to.

## Inputs

You receive:

- **merged_graph_path**: Absolute path to `merged-graph.json`
- **existing_layers_path**: Optional path to a previous iteration's `layers.json` (for incremental updates)
- **language**: Output language code for layer descriptions (default `en`)

## Process

### Step 1: Ingest the Graph

Read `merged-graph.json`. For every node, capture:

| Field | Why it matters |
|-------|---------------|
| `type` | Node type weights each candidate layer |
| `filePath` | Directory prefix → signal for layer membership |
| `tags` | LLM-inferred semantic hint |
| `complexity` | May force a node into a higher-level (utility) layer |
| In-edge count (fan-in) | Hub nodes get bigger boxes |
| Out-edge count (fan-out) | Orchestrator pattern |

### Step 2: Apply Layer Heuristics

Use the directory-signal table first; fall back to type if no directory matches:

| Directory signal | Default layer |
|------------------|---------------|
| `frontend/`, `ui/`, `pages/`, `views/`, `components/`, `app/` | UI |
| `api/`, `routes/`, `handlers/`, `controllers/`, `gateway/` | API |
| `services/`, `logic/`, `domain/`, `core/`, `engine/`, `pipeline/` | Service |
| `models/`, `entities/`, `db/`, `repositories/`, `store/`, `schemas/` | Data |
| `infra/`, `deploy/`, `k8s/`, `terraform/`, `docker/`, `ci/` | Infrastructure |
| `config/`, `env/`, `settings/`, `.env*` | Config |
| `auth/`, `security/`, `guard/`, `oauth/`, `jwt/` | Auth |
| `queue/`, `events/`, `messages/`, `pubsub/`, `bus/`, `kafka/` | Events |
| `utils/`, `lib/`, `helpers/`, `common/`, `shared/` | Utility |
| (explicit `isExternal: true`) | External |

Type fallback (when no directory signal):

| Node type | Default layer |
|-----------|---------------|
| `endpoint` | API |
| `service` (infra YAML) | Infrastructure |
| `pipeline` (CI) | Infrastructure |
| `resource` (Terraform) | Infrastructure |
| `table` / `schema` | Data |
| `document` | UI (treat docs as user-facing) |
| `module` (external) | External |

### Step 3: Resolve Cross-Category Edges

For each node whose edges cross many of the heuristic layers above, defer to the cross-layer signal:

| Edge pattern | Layer tag |
|--------------|-----------|
| Node receives edges from ≥ 4 different layer-tagged nodes | Promote to "Service" (orchestrator) |
| Node sends edges to ≥ 4 different layer-tagged nodes | Demote to "Utility" (facade) |
| Node is referenced equally by Service + API + Data | Promote to "Core" (custom layer) |

This is the only place a node may move between heuristic buckets.

### Step 4: Honor Existing Layers (Incremental Mode)

If `existing_layers_path` is provided:

1. Load existing layer list
2. For each node, **prefer keeping it in its existing layer** unless step 3 promotes/demotes it
3. New nodes fill the same layer buckets in priority order
4. If the existing layer count is < 3 or > 10, fall back to non-incremental (start fresh from step 2)

### Step 5: Bucket Cap

The layer count must be in `[3, 10]`. If classification produces > 10, merge the two smallest buckets by `node count`, choosing the pair with the most cross-edges between them. If < 3, split the largest bucket using `type`-based sub-categorization.

### Step 6: Emit

Write the assignment map plus a brief justification per bucket.

## Output Format

```json
{
  "layers": [
    { "id": "ui", "name": "UI", "nodeIds": ["file:frontend/...", "..."], "nodeCount": 12 },
    { "id": "service", "name": "Service", "nodeIds": ["..."], "nodeCount": 8 },
    { "id": "data", "name": "Data", "nodeIds": ["..."], "nodeCount": 6 }
  ],
  "node_assignments": {
    "file:src/foo.py": "service",
    "file:src/api/bar.py": "api",
    "file:src/db/users.ts": "data"
  },
  "promotions": [
    { "nodeId": "file:src/main.py", "from": "ui", "to": "service", "reason": "fan-in 6 from {ui, api, data} — orchestrator pattern" }
  ],
  "merge_actions": [],
  "split_actions": [],
  "unassigned": [],
  "language": "en"
}
```

`unassigned` must be empty. If any node is left out, retry steps 2–4 before reporting.

## Guidelines

- **Each node in exactly one layer** — never empty, never double-counted.
- **No new layer vocabulary** — use canonical layer IDs (`ui`, `api`, `service`, `data`, `infrastructure`, `config`, `auth`, `events`, `utility`, `external`); other names belong to Phase 0.4.
- **Deterministic**: same inputs → same assignment. No "soft" reasoning.
- **Save layer count in `[3, 10]`**: hard rule.
- **Do not write the layer descriptions** — that's Phase 0.4's job; you only place nodes.
