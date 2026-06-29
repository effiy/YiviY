# Action Analyzer Agent

Cross-reference actions from code health report and architecture analysis report — detect dependencies, identify critical path, quantify before/after, and enrich with verifiable steps.

## Role

rui-checkout reads two report data files and needs to produce a unified, enriched `actions[]` array. This agent does the heavy analysis: it finds what the reports say, cross-references them, decomposes vague actions into concrete steps, and attaches before/after metrics. The output is a machine-readable actions array ready for `data.js` injection.

## Inputs

You receive:

- **health_report_path**: Absolute path to `docs/views/健康报告/data.js` (may be absent)
- **arch_report_path**: Absolute path to `docs/views/架构报告/data.js` (may be absent)
- **language**: `en` or `zh-CN` (default: `zh-CN` matching the reports' primary language)

## Process

### Step 1: Extract Raw Actions from Each Report

#### From Health Report

Scan the HTML template (`index.html`) for action tables — they follow this pattern in every dimension section (D1-D7):

```html
<table>
    <tr><th>ID</th><th>Action</th><th>...</th><th>Priority</th><th>Hours</th></tr>
    <tr><td>A1.1</td><td>Split page_setting() into 5 independent panel files</td>...<td>P0</td><td>4h</td></tr>
</table>
```

Extract: id, title, priority, hours, and the dimension it belongs to.

Also read from `data.js`:
- Dimension scores: `en.sec1.dimensionCards` (7 items with name/grade/score)
- Root causes: section §9 data
- Overall score: 58/100, grade C+, target 85
- Improvement plan: §10 priority matrix

#### From Architecture Report

Read from `data.js`:
- Dimension scores: `en.s1.dimensions` (8 items with label/score)
- KPI gauges: `en.s2.gauges` (16 items — each is a potential action)
- Defect cards: `en.s6.cards.bad1`, `bad2`, `en.s7.badCard`, `en.s8.badCard`
- Good cards: `en.s6.cards.good1-3`, `en.s7.goodCard` (preserve these — they're things to keep)
- Root causes: `en.s9`
- Action items: `en.s12` (if present in the index.html template)
- Overall score: 5.6/10, target 7.9, gap -2.3

#### From HTML Templates (index.html)

If the `data.js` doesn't contain the full action items, read the `index.html` template — action items are often hardcoded in the template's table rows. Extract:
- Action ID, title, priority, hours from `<table>` rows
- Phase grouping from the gantt/timeline section
- Before/after states from the comparison diagrams (§11 in architecture report)

### Step 2: Normalize Actions

Each raw action becomes a normalized action object:

```javascript
{
    id: 'A7.1',                              // preserve report ID
    source: 'health-report',                  // infer from path
    dimension: 'D7 Import Standards',         // from section heading
    dimensionZh: 'D7 导入规范',              // from zh-CN data
    title: 'Phase A: Remove star import from 12 pipeline files',
    titleZh: '阶段A：移除12个管道文件的 star import',
    priority: 'P0',                           // normalize: P0/P1/P2/P3-P4
    phase: 'phase-1',                         // infer from priority + report phasing
    estimatedHours: 3,                        // number only
    status: 'todo',                           // default
    dependencies: [],                         // filled in Step 3
    blocks: [],                               // filled in Step 3
    criticalPath: false,                      // filled in Step 3
    steps: [],                                // filled in Step 4
    before: {},                               // filled in Step 5
    after: {}                                 // filled in Step 5
}
```

### Step 3: Map Dependencies

For every pair of actions (A, B), determine if A must precede B.

**Hard dependency signals** (from reports):
1. **Tool chain**: A introduces a tool, B uses it (e.g., star import removal → ruff CI rule)
2. **File overlap**: A and B touch the same file — the structural refactor must come first
3. **Causal chain**: Report root cause section explicitly says A causes B
4. **Cross-report**: Health report action enables architecture report action

**Soft dependency signals** (inferred):
1. **Same module**: A refactors module X, B adds docs to module X — refactor first
2. **Architecture → detail**: A changes architecture (registry pattern), B changes a specific backend using it
3. **Risk order**: Higher risk dimension first (D7 F-grade before D3 C-grade)

**Dependency resolution algorithm**:
```
For each action A:
    For each action B (B ≠ A):
        if A hard-blocks B:
            A.blocks.push(B.id)
            B.dependencies.push(A.id)
        if A soft-precedes B AND B.priority > A.priority:
            A.blocks.push(B.id)   // mark as soft
            B.dependencies.push(A.id)
```

**Critical path**: `criticalPath: true` if:
- `priority === 'P0'` AND `blocks.length >= 2`
- OR appears in the report's root cause chain as a prerequisite for 3+ problems

**Cycle detection**: If A→B→...→A, break the cycle by removing the lowest-priority edge (P3 over P2 over P1 over P0).

### Step 4: Decompose into Steps

For each action, produce 2-5 verifiable steps. Rules:
- Each step is independently checkable against the code
- Steps are ordered — step N logically precedes step N+1
- Step names use imperative form
- Complex refactors get: audit → plan → execute → verify → document
- Simple changes get: locate → change → test

**Step generation by action type**:

| Action Type | Step Pattern |
|-------------|-------------|
| Remove anti-pattern (star import, god function) | Audit → Replace → Verify tool passes → Integration test |
| Extract shared module | Identify duplicates → Design interface → Extract → Update callers → Remove originals |
| Add documentation | List targets → Write docstrings → Review for accuracy |
| Introduce tooling | Configure tool → Run baseline → Fix top N issues → Add CI rule |
| Refactor pattern (elif→registry) | Design registry interface → Implement registry → Migrate callers one by one → Remove old dispatch |
| Add tests | Identify test points → Write unit tests → Write integration tests → Verify coverage target |

### Step 5: Quantify Before/After

For each action, extract the **exact numbers** from the reports:

**Before (from report measurements)**:
```javascript
before: {
    metric: "37/63 files use star import (58.7%)",  // from report score table
    score: "D7: 15/100 (F)",                         // from report dimension card
    consequence: "mypy disabled, IDE navigation broken, all static analysis blocked"
}
```

The `consequence` field explains WHY the before state is problematic — connect it to the report's root cause analysis.

**After (projected from report targets)**:
```javascript
after: {
    metric: "0/63 files use star import",    // target state
    score: "D7: 85/100 (A)",                // from report improvement forecast
    unlocks: "mypy type checking, ruff linting, CI quality gate"
}
```

The `unlocks` field names specific capabilities that become available — this connects individual actions to the big picture.

**Quantification rules**:
1. `before.metric` must contain a number from the report
2. `after.metric` is the projected end state (derived from report targets)
3. `before.score` is the current dimension score (from report)
4. `after.score` is the projected dimension score (from report improvement forecast)
5. If no report data exists for a metric, use `"未测量 / Not measured"` and set `status: blocked`

**Architecture report KPIs as before/after**:
The architecture report's KPI dashboard (§2) has 16 gauges — each is a perfect before state:
```
KPI gauge: { val: '0', cls: 'gr--bad', label: 'Unit Test Files', note: 'Target ≥5 · P1' }
→ before.metric: "0 unit test files"
→ after.metric: "≥5 unit test files covering core modules"
```

### Step 6: Validate and Return

Run the extraction checklist from `rules/action-extraction.md`:
- [ ] All IDs unique
- [ ] All before.metrics contain numbers
- [ ] All actions have 2-5 steps
- [ ] Dependency graph has no cycles
- [ ] Total hours consistent with report claims
- [ ] Cross-report dependencies properly mapped

## Output Format

```json
{
    "analysis": {
        "generatedAt": "2026-06-29T...",
        "totalActions": 36,
        "healthActions": 26,
        "archActions": 10,
        "totalHours": 56,
        "criticalPathCount": 8,
        "crossReportDependencies": 4,
        "phaseBreakdown": {
            "phase-1": { "count": 8, "hours": 22 },
            "phase-2": { "count": 8, "hours": 16 },
            "phase-3": { "count": 3, "hours": 8 },
            "phase-4": { "count": 7, "hours": 10 }
        }
    },
    "actions": [
        {
            "id": "A7.1",
            "source": "health-report",
            "dimension": "D7 Import Standards",
            "dimensionZh": "D7 导入规范",
            "title": "Phase A: Remove star import from 12 pipeline files",
            "titleZh": "阶段A：移除12个管道文件的 star import",
            "priority": "P0",
            "phase": "phase-1",
            "estimatedHours": 3,
            "status": "todo",
            "dependencies": [],
            "blocks": ["A7.4", "ARCH-5", "ARCH-6", "ARCH-7"],
            "criticalPath": true,
            "steps": [
                { "id": "A7.1-s1", "text": "Audit all _1_* through _12_* files for star imports", "status": "todo" },
                { "id": "A7.1-s2", "text": "Replace each star import with explicit named imports", "status": "todo" },
                { "id": "A7.1-s3", "text": "Run mypy on all 12 pipeline files and fix surfaced errors", "status": "todo" },
                { "id": "A7.1-s4", "text": "Verify pipeline still runs end-to-end", "status": "todo" }
            ],
            "before": {
                "metric": "37/63 files use star import (58.7%)",
                "score": "D7: 15/100 (F)",
                "consequence": "mypy completely disabled, IDE cannot navigate, all static analysis tools blocked — this is the #1 architectural risk"
            },
            "after": {
                "metric": "25/63 files use star import (39.7%)",
                "score": "D7: 35→45/100 (D→C)",
                "unlocks": "Pipeline files now mypy-clean — enables targeted linting on the most critical 12 files"
            }
        }
    ]
}
```

## Guidelines

- **Never fabricate numbers** — if a report doesn't provide a measurement, mark it as blocked/unknown, don't guess
- **Preserve report language** — dimension names, action titles should match the report's own wording
- **Chinese-first for zh-CN** — when the report is in Chinese, titleZh is the authoritative text; title is translated
- **Cross-report humility** — if only one report is available, skip cross-report dependencies; don't hallucinate them
- **Output is JSON-only**: no Markdown wrappers; downstream `data.js` consumes it directly
- **Validate before returning** — run the extraction checklist, report any violations as warnings
