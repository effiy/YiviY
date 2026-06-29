# Report Schema Cross-Reference

Maps fields from `HEALTH_REPORT_CONFIG` and `ARCH_REPORT_CONFIG` to checkout action fields.

## Health Report → Action Fields

| Report Field | Path | → Action Field | Notes |
|-------------|------|----------------|-------|
| Dimension name | `en.dimLabels.d<N>.name` | `dimension` | e.g. "Import Coupling" |
| Dimension score | `en.dimLabels.d<N>.score` | `before.score` | e.g. "15/100 F" |
| Dimension card score | `en.sec1.dimensionCards[N].score` | `before.score` (numeric) | e.g. "15" |
| Action ID | Extracted from `index.html` table rows | `id` | e.g. "A7.1" |
| Action title | Extracted from `index.html` table rows | `title` | |
| Action priority | Extracted from `index.html` table badges | `priority` | P0/P1/P2 |
| Action hours | Extracted from `index.html` table rows | `estimatedHours` | e.g. 3 |
| Overall score | `en.sec1.score.score` | `constants.sourceMeta.health-report.score.current` | "58 / 100" → 58 |
| Overall grade | `en.sec1.score.grade` | `constants.sourceMeta.health-report.score.grade` | "C+" |
| Total actions | `en.cover.metaItems[4].num` | `constants.sourceMeta.health-report.actions` | "26" → 26 |
| File count | `constants.meta.fileCount` | reference | 63 |
| LOC | `constants.meta.loc` | reference | 6986 |
| Root causes | `en.rootCause` section + `index.html` §9 table | `before.consequence` | Causal chain context |
| Phase plan | `en.improvement` section + `index.html` §10 tables | `phase` assignment | |
| Improvement forecast | `index.html` §10 metrics/gantt | `after.score` | Projected scores |

### Action Table Extraction Pattern (from index.html)

Health report actions are in tables within each dimension section (§2–§8):

```html
<!-- §2 D1: File Size -->
<table>
    <tr><th>ID</th><th>Action Item</th><th>...</th><th>Priority</th><th>Hours</th></tr>
    <tr><td>A1.1</td><td>Split page_setting() ...</td>...<td>P0</td><td>4h</td></tr>
    <tr><td>A1.2</td><td>prompts.py → config/prompts.yaml</td>...<td>P2</td><td>2h</td></tr>
</table>
```

Extract: td[0]=id, td[1]=title, td[n-2]=priority, td[n-1]=hours

## Architecture Report → Action Fields

| Report Field | Path | → Action Field | Notes |
|-------------|------|----------------|-------|
| Dimension name | `en.s1.dimensions[N].label` | `dimension` | e.g. "Testability" |
| Dimension score | `en.s1.dimensions[N].score` | `before.score` | e.g. "2.0" |
| KPI gauge value | `en.s2.gauges[N].val` | `before.metric` | e.g. "0" for unit tests |
| KPI gauge label | `en.s2.gauges[N].label` | `title` (basis) | e.g. "Files to add TTS" |
| KPI gauge note | `en.s2.gauges[N].note` | `after.metric` (basis) | e.g. "Target ≤1 · P1" |
| KPI gauge class | `en.s2.gauges[N].cls` | `priority` (infer) | gr--bad→P1, gr--warn→P2, gr--good→done |
| Defect card title | `en.s6.cards.bad1.title` | `title` (basis) | |
| Defect card desc | `en.s6.cards.bad1.desc` | `before.consequence` | |
| Overall score | `en.s1` description text | `constants.sourceMeta.architecture-report.score.current` | "5.6" |
| Target score | `en.s1` description text | `constants.sourceMeta.architecture-report.score.target` | "7.9" |
| Action count | `en.header.metaItems[3].label` | `constants.sourceMeta.architecture-report.actions` | "10 Actions" → 10 |
| Root causes | `en.s9` section + `index.html` §9 SVG | `before.consequence` | Causal chain |

### Architecture Report Action Inference

The architecture report doesn't always have explicit action tables in `data.js`. Actions must be inferred from:

1. **KPI Gauges** (§2): 16 gauges → each gauge with `cls: 'gr--bad'` is a potential action
2. **Defect Cards** (§6–§8): bad1/bad2/badCard → each defect is an action
3. **Root Causes** (§9): 4 causes → each maps to 1-2 corrective actions
4. **Improvement Plan** (§10): explicit action list if present
5. **Comparison Diagrams** (§11): current→target gap → each gap is an action

## Numeric Value Extraction Patterns

When scanning report text for before/after metrics, look for these patterns:

| Pattern | Example | Extraction |
|---------|---------|------------|
| `N/M label (P%)` | `37/63 files use star import (58.7%)` | count=37, total=63, pct=58.7 |
| `score / max` | `15/100 F` | current=15, max=100, grade=F |
| `N units` | `26 actions`, `56h roadmap` | value=26, unit=actions |
| `X→Y` | `5.6 → 7.9` | current=5.6, target=7.9 |
| `N.Nx` | `6.0x` | multiplier=6.0 |
| `≥N` | `Target ≥5` | target=5 |
| `≤N` | `Target ≤1` | target=1 |
