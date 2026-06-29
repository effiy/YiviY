---
name: rui-checkout
description: Analyze code health reports and architecture analysis reports to generate mandatory improvement action items with steps, status tracking, and before/after effect quantification. Use when the user wants to create action plans, track improvement progress, generate checkout lists from reports, or turn report findings into executable tasks. Also use when the user mentions 行动项, improvement actions, action tracking, checkout, 改进清单, report follow-up, or wants to convert analysis reports into a work plan.
lifecycle: default-pipeline
---

# Rui Checkout

Analyze code health reports and architecture analysis reports — extract, enrich, cross-reference, and generate an interactive action-tracking checkout page.

## What This Skill Does

Reads report data from `docs/views/健康报告/data.js` (Code Health Report) and `docs/views/架构报告/data.js` (Architecture Analysis Report), cross-references findings, and produces a 4-file checkout page (`data.js` + `index.js` + `index.html` + `index.css`) in `docs/views/checkout/`. The result is an interactive Vue 3 dashboard where users can:

- See **all improvement actions** aggregated from both reports in one unified view
- Track **status** per action: `todo` → `in_progress` → `done` (or `blocked`)
- View **before/after metrics** — quantified effect of each action
- See **step-by-step breakdowns** for complex actions
- Filter by **priority** (P0/P1/P2/P3), **source** (health/architecture), **phase**, and **status**
- Monitor **overall progress** toward target scores (58→85 health, 5.6→7.9 architecture)
- See **critical path** — actions that unblock other actions
- **Persist** status in localStorage for incremental progress tracking

## Self-Improvement Analysis Engine

The core differentiator of rui-checkout is its **self-improvement analysis**: it doesn't just copy action items from reports — it analyzes them through a self-improvement lens:

### 1. Cross-Report Correlation
Actions from the health report and architecture report are cross-referenced to find:
- **Same root cause** — e.g., health report's A7.1 (star import removal) enables architecture report's testability improvements
- **Sequential dependencies** — e.g., star import removal must happen before CI/CD pipeline can be introduced
- **Amplification effects** — e.g., fixing star imports amplifies the impact of 5+ other actions

### 2. Before/After Quantification
Every action item must have:
- **Before metric** — the measured baseline from the report (e.g., "37/63 files use star import (58.7%)")
- **After metric** — the expected outcome (e.g., "0/63 files use star import, mypy pass rate 100%")
- **Impact chain** — which downstream metrics improve as a result

### 3. Step Granularity
Complex actions are decomposed into verifiable steps — each step is independently checkable:
- Not: "Fix all star imports" (too vague to track)
- But: ① Identify all star import files → ② Replace with explicit imports → ③ Verify mypy passes → ④ Add ruff F403/F405 CI rule

### 4. Critical Path Detection
Actions that block other actions are identified and flagged — these must be completed first:
- P0 actions that are prerequisites for P1/P2 actions
- Actions whose completion unlocks automated tooling (e.g., removing star imports unlocks mypy/ruff)

## When to Use This Skill

- User wants to create an action plan from analysis reports
- User asks to "check out" the improvement actions, "track progress", "create a work plan"
- User mentions: 行动项, 改进清单, checkout, action items, improvement tracking, report follow-up
- After generating or updating a health report or architecture report — create the checkout to track execution
- User wants to see the critical path: "what should we do first?"
- User wants to quantify the impact: "what happens after we fix X?"

## How It Works

### Step 1: Locate Report Sources

Read the two report data files:

```
docs/views/健康报告/data.js   → window.HEALTH_REPORT_CONFIG
docs/views/架构报告/data.js   → window.ARCH_REPORT_CONFIG
```

If one or both don't exist, inform the user and offer to work with whatever is available. The checkout can be generated from a single report — cross-reference features are bonus, not required.

**Extract the following from each report:**

| From Health Report | From Architecture Report |
|---|---|
| 7 dimension scores (D1-D7) | 8 dimension scores |
| Per-dimension action items (A1.1-A7.4) | KPI gauge values (16 metrics) |
| Root cause analysis (4 causes) | Defect cards (bad1, bad2) |
| 4-phase improvement plan (26 actions) | 10 action items + 5-week schedule |
| Overall score: 58/100, target 85 | Overall score: 5.6/10, target 7.9 |

### Step 2: Run Self-Improvement Analysis

This is the core analysis phase. For each action item found in the reports, enrich it with:

#### 2a. Decompose into Verifiable Steps

Every action gets 2-5 concrete steps. Each step must be:
- **Independently checkable** — you can look at the code and say "yes, this step is done"
- **Ordered** — steps have a natural sequence
- **Small enough** — a step should take 30min-2h, not "a week"

Example decomposition:
```
A7.1: "Remove star import from 12 pipeline files"
  Step 1: Audit all _1_* through _12_* files for `from core.utils import *`
  Step 2: Replace each star import with explicit named imports
  Step 3: Run `mypy --ignore-missing-imports` on all 12 files
  Step 4: Fix any type errors surfaced by explicit imports
  Step 5: Add `# noqa: F403` comments only where intentionally re-exporting
```

#### 2b. Quantify Before/After

For every action, extract from the report data:
- **Before**: the current measured value (find the exact number in the report)
- **After**: the expected value after completion (extrapolate from report targets)
- **Impact**: which other metrics/actions does this improve?

Example:
```javascript
before: {
    metric: '37/63 files use star import (58.7%)',
    score: 'D7 score: 15/100 (F)',
    consequence: 'mypy disabled, IDE navigation broken, all static analysis blocked'
},
after: {
    metric: '0/63 files use star import (0%)',
    score: 'D7 score: 70→85/100 (B→A)',
    unlocks: ['mypy type checking', 'ruff linting', 'radon complexity', 'CI quality gate']
}
```

#### 2c. Map Dependencies

Build a dependency graph among actions:
- **Hard blockers**: A must complete before B (e.g., star import removal before CI introduction)
- **Soft ordering**: A should ideally come before B (e.g., fix god functions before adding docstrings)
- **Amplifiers**: A makes B more effective (e.g., explicit imports make refactoring safer)

The dependency graph drives the critical path display.

#### 2d. Assign Phase

Map each action to a phase based on the report's own phasing:
- **Phase 1 (Stop Bleeding)**: P0 blockers — things that prevent all other improvements
- **Phase 2 (Fix)**: P1 high-priority — significant maintainability improvements
- **Phase 3 (Consolidate)**: P2 medium — readability, DX, tooling
- **Phase 4 (Continuous)**: P3+ — ongoing improvements

### Step 3: Generate the 4-File Checkout Page

Produce four files in `docs/views/checkout/`:

```
docs/views/checkout/
├── data.js     # CHECKOUT_CONFIG with constants + actions[] + phases[] + scoreTargets
├── index.js    # Vue 3 app: filtering, status toggle, progress compute, localStorage
├── index.html  # Template: score dashboard + progress + filter bar + action cards
└── index.css   # Styles: all var(--vl-doc-*) tokens, dark theme
```

#### data.js Structure

```javascript
window.CHECKOUT_CONFIG = {
    constants: {
        generatedAt: '2026-06-29T12:00:00Z',
        totalActions: 36,                     // sum of all actions
        sources: ['health-report', 'architecture-report'],
        sourceMeta: {
            'health-report': {
                path: 'docs/views/健康报告/',
                label: 'Code Health Report',
                labelZh: '代码健康报告',
                score: { current: 58, target: 85, unit: '/100', grade: 'C+' },
                dimensions: 7,
                actions: 26
            },
            'architecture-report': {
                path: 'docs/views/架构报告/',
                label: 'Architecture Analysis Report',
                labelZh: '架构分析报告',
                score: { current: 5.6, target: 7.9, unit: '/10', grade: 'Medium Risk' },
                dimensions: 8,
                actions: 10
            }
        }
    },
    phases: [
        {
            id: 'phase-1',
            label: 'Phase 1: Stop Bleeding',
            labelZh: '第一阶段：止血',
            weeks: 'W1-2',
            priority: 'P0',
            estimatedHours: 22,
            goal: 'Eliminate blocking risks — star imports, god functions, missing CI gates'
        },
        {
            id: 'phase-2',
            label: 'Phase 2: Fix',
            labelZh: '第二阶段：修复',
            weeks: 'W3-4',
            priority: 'P1',
            estimatedHours: 16,
            goal: 'Structural improvements — dedup, refactor, test foundation'
        },
        {
            id: 'phase-3',
            label: 'Phase 3: Consolidate',
            labelZh: '第三阶段：巩固',
            weeks: 'W5-6',
            priority: 'P2',
            estimatedHours: 8,
            goal: 'Quality of life — docs, naming, tooling polish'
        },
        {
            id: 'phase-4',
            label: 'Phase 4: Continuous',
            labelZh: '第四阶段：持续改进',
            weeks: 'W7+',
            priority: 'P3-P4',
            estimatedHours: 10,
            goal: 'Ongoing — coverage growth, pattern propagation, culture'
        }
    ],
    actions: [
        {
            id: 'A7.1',
            source: 'health-report',
            dimension: 'D7 Import Standards',
            dimensionZh: 'D7 导入规范',
            title: 'Phase A: Remove star import from 12 pipeline files',
            titleZh: '阶段A：移除12个管道文件的 star import',
            priority: 'P0',
            phase: 'phase-1',
            estimatedHours: 3,
            status: 'todo',
            dependencies: [],
            blocks: ['A7.4', 'ARCH-5', 'ARCH-6', 'ARCH-7'],  // actions this unblocks
            criticalPath: true,
            steps: [
                { id: 'A7.1-s1', text: 'Audit all _1_* through _12_* files for star imports', status: 'todo' },
                { id: 'A7.1-s2', text: 'Replace each star import with explicit named imports', status: 'todo' },
                { id: 'A7.1-s3', text: 'Run mypy on all 12 pipeline files and fix surfaced errors', status: 'todo' },
                { id: 'A7.1-s4', text: 'Verify pipeline still runs end-to-end', status: 'todo' }
            ],
            before: {
                metric: '37/63 files use star import (58.7%)',
                score: 'D7: 15/100 (F)',
                consequence: 'mypy completely disabled, IDE cannot navigate, all static analysis tools blocked'
            },
            after: {
                metric: '25/63 files use star import (39.7%)',
                score: 'D7: 35→45/100 (D→C)',
                unlocks: 'Pipeline files now mypy-clean — enables targeted linting'
            }
        },
        // ... more actions
    ]
};
```

**Critical `data.js` rules**:
- `id` must be unique across all actions — use report IDs where available (A1.1-A7.4 from health, ARCH-1 through ARCH-10 from architecture)
- `status` must be one of: `todo`, `in_progress`, `done`, `blocked`
- `dependencies` lists IDs of actions that must complete first
- `blocks` lists IDs of actions that this action unblocks (reverse of dependencies, computed)
- `criticalPath: true` for P0 actions that block 2+ other actions
- `before` and `after` must contain specific numbers from the reports — never vague
- `steps[].status` same enum as action status
- All text fields support i18n via `title`/`titleZh` pattern

#### index.html Template

Follow this structure:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Improvement Action Checkout — VideoLingo</title>
    <link rel="stylesheet" href="../cdn/theme/tech-innovation.css">
    <link rel="stylesheet" href="../styles/tokens.css">
    <link rel="stylesheet" href="../styles/base.css">
    <link rel="stylesheet" href="index.css">
    <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
</head>
<body class="vl-doc">
    <div id="checkout-app">
        <!-- Score Dashboard -->
        <section class="score-dashboard">
            <div class="score-header">
                <h1>📋 Improvement Action Checkout</h1>
                <p class="score-subtitle">{{ totalActions }} actions · {{ totalHours }}h estimated · generated {{ generatedAt }}</p>
            </div>
            <div class="score-cards">
                <div class="score-card" v-for="src in sources" :key="src.key">
                    <div class="sc-label">{{ src.label }}</div>
                    <div class="sc-score-row">
                        <span class="sc-current" :class="src.scoreClass">{{ src.current }}</span>
                        <span class="sc-arrow">→</span>
                        <span class="sc-target">{{ src.target }}</span>
                    </div>
                    <div class="sc-progress">
                        <div class="sc-progress-fill" :style="{ width: src.progressPercent + '%' }"></div>
                    </div>
                    <div class="sc-meta">{{ src.completedActions }}/{{ src.totalActions }} actions done</div>
                </div>
            </div>
            <!-- Critical Path Alert -->
            <div class="critical-path-alert" v-if="criticalPathItems.length > 0">
                <strong>⚠️ Critical Path:</strong> {{ criticalPathItems.length }} blocking actions must be completed first
            </div>
        </section>

        <!-- Progress Overview -->
        <section class="progress-overview">
            <div class="progress-bar-wrap">
                <div class="progress-bar">
                    <div class="progress-segment seg-done" :style="{ width: donePercent + '%' }"></div>
                    <div class="progress-segment seg-progress" :style="{ width: inProgressPercent + '%' }"></div>
                    <div class="progress-segment seg-blocked" :style="{ width: blockedPercent + '%' }"></div>
                </div>
                <div class="progress-legend">
                    <span class="leg-done">✓ {{ counts.done }} Done</span>
                    <span class="leg-progress">◷ {{ counts.in_progress }} In Progress</span>
                    <span class="leg-blocked">⊘ {{ counts.blocked }} Blocked</span>
                    <span class="leg-todo">○ {{ counts.todo }} Todo</span>
                </div>
            </div>
        </section>

        <!-- Filter Bar -->
        <section class="filter-bar">
            <button v-for="f in statusFilters" :key="f.key"
                :class="{ active: activeStatus === f.key }"
                @click="activeStatus = f.key">{{ f.label }} ({{ f.count }})</button>
            <select v-model="activeSource">
                <option value="all">All Sources</option>
                <option value="health-report">Health Report</option>
                <option value="architecture-report">Architecture Report</option>
            </select>
            <select v-model="activePhase">
                <option value="all">All Phases</option>
                <option v-for="p in phases" :value="p.id">{{ p.label }}</option>
            </select>
            <select v-model="activePriority">
                <option value="all">All Priorities</option>
                <option value="P0">P0 Critical</option>
                <option value="P1">P1 High</option>
                <option value="P2">P2 Medium</option>
                <option value="P3-P4">P3-P4</option>
            </select>
            <label class="critical-only">
                <input type="checkbox" v-model="criticalOnly"> Critical Path Only
            </label>
        </section>

        <!-- Action Cards -->
        <section class="actions-list">
            <div v-for="action in filteredActions" :key="action.id"
                class="action-card" :class="[
                    'status-' + action.status,
                    'priority-' + action.priority.toLowerCase().replace('+',''),
                    { 'critical-path': action.criticalPath }
                ]">
                <!-- Action Header -->
                <div class="ac-header" @click="toggleExpand(action.id)">
                    <div class="ac-header-left">
                        <span class="ac-status-icon" :class="action.status"></span>
                        <span class="ac-id">{{ action.id }}</span>
                        <span class="ac-priority" :class="'pri-' + action.priority.toLowerCase().replace('+','')">{{ action.priority }}</span>
                        <span class="ac-title">{{ action.title }}</span>
                    </div>
                    <div class="ac-header-right">
                        <span class="ac-source-tag">{{ action.source === 'health-report' ? '🏥' : '🏗️' }}</span>
                        <span class="ac-dimension">{{ action.dimension }}</span>
                        <span class="ac-hours">{{ action.estimatedHours }}h</span>
                        <span class="ac-expand-icon">{{ expanded[action.id] ? '▾' : '▸' }}</span>
                    </div>
                </div>

                <!-- Action Body -->
                <div class="ac-body" v-show="expanded[action.id]">
                    <!-- Before/After Comparison -->
                    <div class="ac-before-after">
                        <div class="ba-col ba-before">
                            <div class="ba-label">🔴 Before</div>
                            <div class="ba-metric">{{ action.before.metric }}</div>
                            <div class="ba-score">{{ action.before.score }}</div>
                            <div class="ba-consequence">{{ action.before.consequence }}</div>
                        </div>
                        <div class="ba-arrow-col">
                            <div class="ba-arrow">→</div>
                        </div>
                        <div class="ba-col ba-after">
                            <div class="ba-label">🟢 After</div>
                            <div class="ba-metric">{{ action.after.metric }}</div>
                            <div class="ba-score">{{ action.after.score }}</div>
                            <div class="ba-unlocks" v-if="action.after.unlocks">
                                <strong>Unlocks:</strong> {{ action.after.unlocks }}
                            </div>
                        </div>
                    </div>

                    <!-- Dependencies -->
                    <div class="ac-deps" v-if="action.dependencies.length || action.blocks.length">
                        <div v-if="action.dependencies.length" class="ac-dep-row">
                            <strong>Depends on:</strong>
                            <span v-for="depId in action.dependencies" :key="depId"
                                class="dep-tag" :class="getActionStatus(depId)"
                                @click="scrollToAction(depId)">{{ depId }}</span>
                        </div>
                        <div v-if="action.blocks.length" class="ac-dep-row">
                            <strong>Unblocks:</strong>
                            <span v-for="blockId in action.blocks" :key="blockId"
                                class="dep-tag blocks-tag" @click="scrollToAction(blockId)">{{ blockId }}</span>
                        </div>
                    </div>

                    <!-- Steps -->
                    <div class="ac-steps">
                        <div class="ac-steps-title">Steps</div>
                        <div v-for="step in action.steps" :key="step.id"
                            class="ac-step" :class="'step-' + step.status">
                            <input type="checkbox"
                                :checked="step.status === 'done'"
                                @change="toggleStep(action.id, step.id)" />
                            <span class="step-icon" :class="step.status"></span>
                            <span class="step-text">{{ step.text }}</span>
                        </div>
                    </div>

                    <!-- Status Control -->
                    <div class="ac-status-control">
                        <span class="ac-status-label">Status:</span>
                        <button v-for="s in ['todo','in_progress','done','blocked']" :key="s"
                            :class="{ active: action.status === s }"
                            @click="setStatus(action.id, s)"
                            class="status-btn status-btn-{{ s }}">{{ statusLabel(s) }}</button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Empty State -->
        <div v-if="filteredActions.length === 0" class="empty-state">
            <p>No actions match the current filters.</p>
            <button @click="resetFilters">Reset All Filters</button>
        </div>
    </div>

    <script src="data.js"></script>
    <script src="index.js"></script>
</body>
</html>
```

#### index.js Structure

```javascript
(function() {
    const cfg = window.CHECKOUT_CONFIG;
    if (!cfg) { console.error('CHECKOUT_CONFIG not found'); return; }

    const { createApp } = Vue;
    const LS_KEY = 'checkout_state_v1';

    createApp({
        data() {
            return {
                generatedAt: cfg.constants.generatedAt,
                totalActions: cfg.constants.totalActions,
                phases: cfg.phases,
                actions: this.loadState(cfg.actions),
                sources: this.buildSourceCards(cfg.constants.sourceMeta),
                activeStatus: 'all',
                activeSource: 'all',
                activePhase: 'all',
                activePriority: 'all',
                criticalOnly: false,
                expanded: {},
            };
        },
        computed: {
            counts() {
                const c = { todo: 0, in_progress: 0, done: 0, blocked: 0 };
                this.actions.forEach(a => { c[a.status] = (c[a.status] || 0) + 1; });
                return c;
            },
            totalHours() {
                return this.actions.reduce((sum, a) => sum + a.estimatedHours, 0);
            },
            donePercent() {
                return this.totalActions ? Math.round((this.counts.done / this.totalActions) * 100) : 0;
            },
            inProgressPercent() {
                return this.totalActions ? Math.round((this.counts.in_progress / this.totalActions) * 100) : 0;
            },
            blockedPercent() {
                return this.totalActions ? Math.round((this.counts.blocked / this.totalActions) * 100) : 0;
            },
            statusFilters() {
                return [
                    { key: 'all', label: 'All', count: this.totalActions },
                    { key: 'todo', label: 'Todo', count: this.counts.todo },
                    { key: 'in_progress', label: 'In Progress', count: this.counts.in_progress },
                    { key: 'done', label: 'Done', count: this.counts.done },
                    { key: 'blocked', label: 'Blocked', count: this.counts.blocked },
                ];
            },
            criticalPathItems() {
                return this.actions.filter(a => a.criticalPath && a.status !== 'done');
            },
            filteredActions() {
                return this.actions.filter(a => {
                    if (this.activeStatus !== 'all' && a.status !== this.activeStatus) return false;
                    if (this.activeSource !== 'all' && a.source !== this.activeSource) return false;
                    if (this.activePhase !== 'all' && a.phase !== this.activePhase) return false;
                    if (this.activePriority !== 'all' && a.priority !== this.activePriority) return false;
                    if (this.criticalOnly && !a.criticalPath) return false;
                    return true;
                });
            },
        },
        methods: {
            toggleExpand(id) {
                this.expanded[id] = !this.expanded[id];
            },
            toggleStep(actionId, stepId) {
                const action = this.actions.find(a => a.id === actionId);
                if (!action) return;
                const step = action.steps.find(s => s.id === stepId);
                if (!step) return;
                step.status = step.status === 'done' ? 'todo' : 'done';
                // Auto-update action status: if all steps done → action done
                if (action.steps.every(s => s.status === 'done')) {
                    action.status = 'done';
                } else if (action.steps.some(s => s.status === 'done')) {
                    if (action.status === 'todo') action.status = 'in_progress';
                }
                this.saveState();
            },
            setStatus(actionId, status) {
                const action = this.actions.find(a => a.id === actionId);
                if (!action) return;
                action.status = status;
                if (status === 'done') {
                    action.steps.forEach(s => { s.status = 'done'; });
                }
                // Check if blocked dependencies are now resolved
                this.actions.forEach(a => {
                    if (a.status === 'blocked' && a.dependencies.every(depId => {
                        const dep = this.actions.find(x => x.id === depId);
                        return dep && dep.status === 'done';
                    })) {
                        a.status = 'todo';
                    }
                });
                this.saveState();
            },
            getActionStatus(id) {
                const a = this.actions.find(x => x.id === id);
                return a ? 'dep-' + a.status : '';
            },
            scrollToAction(id) {
                this.expanded[id] = true;
                this.$nextTick(() => {
                    const el = document.getElementById('action-' + id);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
            },
            statusLabel(s) {
                const map = { todo: '○ Todo', in_progress: '◷ In Progress', done: '✓ Done', blocked: '⊘ Blocked' };
                return map[s] || s;
            },
            resetFilters() {
                this.activeStatus = 'all';
                this.activeSource = 'all';
                this.activePhase = 'all';
                this.activePriority = 'all';
                this.criticalOnly = false;
            },
            buildSourceCards(meta) {
                return Object.entries(meta).map(([key, m]) => {
                    const actions = this.actions.filter(a => a.source === key);
                    const done = actions.filter(a => a.status === 'done').length;
                    return {
                        key,
                        label: m.labelZh || m.label,
                        current: m.score.current + m.score.unit,
                        target: m.score.target + m.score.unit,
                        grade: m.score.grade,
                        progressPercent: actions.length ? Math.round((done / actions.length) * 100) : 0,
                        completedActions: done,
                        totalActions: actions.length,
                        scoreClass: m.score.current < m.score.target * 0.7 ? 'score-bad' :
                                    m.score.current < m.score.target * 0.85 ? 'score-warn' : 'score-good',
                    };
                });
            },
            // Persistence
            loadState(actions) {
                try {
                    const saved = JSON.parse(localStorage.getItem(LS_KEY));
                    if (saved && saved.actions) {
                        return actions.map(a => {
                            const savedAction = saved.actions.find(s => s.id === a.id);
                            if (savedAction) {
                                return {
                                    ...a,
                                    status: savedAction.status || a.status,
                                    steps: a.steps.map(step => {
                                        const savedStep = (savedAction.steps || []).find(s => s.id === step.id);
                                        return savedStep ? { ...step, status: savedStep.status || step.status } : step;
                                    })
                                };
                            }
                            return a;
                        });
                    }
                } catch(e) { /* ignore */ }
                return actions;
            },
            saveState() {
                const state = {
                    actions: this.actions.map(a => ({
                        id: a.id,
                        status: a.status,
                        steps: a.steps.map(s => ({ id: s.id, status: s.status }))
                    }))
                };
                localStorage.setItem(LS_KEY, JSON.stringify(state));
            },
        },
        watch: {
            actions: {
                deep: true,
                handler() {
                    this.sources = this.buildSourceCards(cfg.constants.sourceMeta);
                    this.saveState();
                }
            }
        },
        mounted() {
            // Expand critical path items by default
            this.actions.forEach(a => {
                if (a.criticalPath && a.status !== 'done') {
                    this.expanded[a.id] = true;
                }
            });
        },
    }).mount('#checkout-app');
})();
```

Key `index.js` rules:
- IIFE wrapper — no global leaks
- `localStorage` persistence for all action/step status (key: `checkout_state_v1`)
- Auto-status propagation: all steps done → action done; blocking deps resolved → unblock
- All computed properties derived from data
- Source cards re-computed on action status changes

#### index.css Structure

Follow the existing report CSS patterns (`docs/views/健康报告/index.css`):
- All colors from `var(--vl-doc-*)` tokens — zero hardcoded hex/rgb
- Score dashboard with gradient progress bars
- Action cards with left-border status colors (green=done, blue=in_progress, red=blocked, muted=todo)
- Before/after comparison side-by-side layout
- Step checkboxes with status icons
- Priority badges: P0=red, P1=orange, P2=blue, P3=grey
- Critical path cards get a subtle glow/border accent
- Responsive: collapse before/after to stacked at 768px, single-column at 500px
- Target ~200-350 lines

### Step 4: Progress Notifications (via rui-bot)

rui-checkout 通过 [[rui-bot]] 发送进度通知，追踪改进执行情况：

#### 关键路径完成告警

当用户完成一个 critical path 上的 action 时，自动发送通知：

```
✅ 【VideoLingo】关键路径进展: A7.1 已完成

📋 Action: Phase A: Remove star import from 12 pipeline files
🔓 解锁 5 个后续 Actions: A7.4, ARCH-5, ARCH-6, ARCH-7, ARCH-8

📊 整体进度: 3/36 done (8%)
🎯 Phase 1: 2/4 done — 50% complete

💡 所有关键路径阻塞已清除，可推进 Phase 2

—— 2026/6/29 14:30:00
```

#### 阶段里程碑

```
✅ 【VideoLingo】阶段里程碑: Phase 1 完成

📊 Phase 1 (止血): 4/4 actions done — 100%
⏱️ 实际耗时: 18h / 预估 22h

📈 进入 Phase 2 (修复): 5 actions, 预估 16h

💡 关键路径已清除，后续 actions 无阻塞依赖

—— 2026/6/30 09:00:00
```

#### 停滞告警

```
⚠️ 【VideoLingo】改进停滞警告

📊 7 天无进度更新
   待处理: 12 actions (4 blocked, 8 todo)
   上次完成: 2026-06-22 (A3.2)

💡 建议检查是否有阻塞项需要优先解决

—— 2026/6/29 09:00:00
```

**构建方式**: 使用 rui-bot `format.mjs`:

```javascript
import { formatAlert } from '../rui-bot/format.mjs';

// Critical path completion
const msg = formatAlert({
  project: 'VideoLingo',
  level: 'success',
  title: `关键路径进展: ${actionId} 已完成`,
  detail: `📋 Action: ${action.title}\n🔓 解锁 ${unblockedCount} 个后续 Actions: ${unblockedIds}`,
});

// Phase milestone
const msg = formatAlert({
  project: 'VideoLingo',
  level: 'success',
  title: `阶段里程碑: ${phase.label} 完成`,
  detail: `📊 ${phase.id}: ${doneCount}/${totalCount} actions done\n📈 进入 Phase ${nextPhase}`,
});
```

### Step 5: Present and Explain

After generating the files, tell the user:
- Where the files were created (`docs/views/checkout/`)
- Total actions aggregated, critical path count, total estimated hours
- How many actions from each report source
- Notable cross-report correlations found (e.g., "A7.1 from health report unblocks 4 architecture report actions")
- How to view: open `docs/views/checkout/index.html` in browser
- Status persists in localStorage — they can close and come back

### Step 5: Iterate Based on Feedback

If the user wants adjustments:
- Add/remove actions
- Adjust step breakdowns
- Update before/after metrics
- Regenerate with updated data
- The `generatedAt` timestamp updates on each regeneration

## Design Principles

### 1. Reports Are Input, Actions Are Output
The health and architecture reports are diagnostic documents — they tell you what's wrong. rui-checkout translates diagnosis into prescription: concrete, trackable, verifiable actions. Every action must answer "what exactly do I do?" and "how do I know it's done?"

### 2. Quantified Before/After
Vague improvements ("better code quality") are untrackable. Every action must have a numeric before-metric and a numeric after-target. This enables progress measurement — you know whether the action actually moved the needle.

### 3. Dependency-Aware
Actions don't exist in isolation. The star import removal (A7.1) isn't just one of 36 actions — it's the gatekeeper that unlocks 5+ others. The checkout page must make this visible: what depends on what, what's on the critical path, what's blocking progress.

### 4. Step Granularity Enables Progress
"Fix all star imports" is a project, not an action. Breaking it into 4 verifiable steps means progress is visible before the whole thing is done — step 2 of 4 done shows 50% progress, not 0% until the final commit.

### 5. Persistent State
Progress tracking only works if state survives page reloads. All status data persists in localStorage. The user can check off steps incrementally across days or weeks.

### 6. Project-Convention Alignment
Output follows the same 4-file pattern as all other doc components: `data.js` + `index.js` + `index.html` + `index.css`. Theme token usage (`--vl-doc-*`), Vue 3 CDN patterns, file naming — all match existing codebase conventions.

## Reference Files

- `references/report-schema.md` — Schema cross-reference: which fields in HEALTH_REPORT_CONFIG and ARCH_REPORT_CONFIG map to checkout action fields
- `references/action-template.md` — The canonical action item template with all required/optional fields

## 规则

- [action-extraction.md](./rules/action-extraction.md) — Rules for extracting, decomposing, and enriching action items from report data. Defines mandatory fields, before/after quantification standards, and dependency mapping rules.

## 专业代理

- [action-analyzer.md](./agents/action-analyzer.md) — Cross-references actions from both reports, detects dependencies, identifies critical path, and enriches actions with before/after metrics.

## Borders

### What this skill does
- Read health report and architecture report data from `docs/views/`
- Extract and aggregate all improvement actions into a unified tracking page
- Decompose complex actions into verifiable steps
- Quantify before/after effects for every action
- Map cross-report dependencies and critical path
- Generate a 4-file interactive checkout page with progress tracking

### What this skill does NOT do
- **Generate reports** — health reports are external input; architecture reports are external input
- **Modify source code** — this is a tracking tool, not a refactoring tool
- **Run static analysis** — metrics come from the reports, not live analysis
- **Replace rui-checklist** — rui-checklist verifies card data quality; rui-checkout tracks code improvement actions
- **Execute actions** — the checkout page tracks human work, doesn't automate it

### Coordinated with

| Skill | Direction | See |
|-------|-----------|-----|
| Health Report (健康报告) | upstream — provides the 7-dimension code health data with 26 actions | `docs/views/健康报告/data.js` |
| Architecture Report (架构报告) | upstream — provides the 8-dimension architecture data with 10 actions + KPIs | `docs/views/架构报告/data.js` |
| [[rui-checklist]] | sibling — both generate tracking pages; rui-checklist for card quality, rui-checkout for code actions | rui-checklist audit pattern |
| [[rui-html]] | sibling — shares the Vue 3 CDN + 4-file component pattern | docs component conventions |
| [[rui-bot]] | calls → rui-bot | Progress alerts for critical path completion, phase milestones, and staleness warnings |

### Output ownership

| Path | Permission |
|------|-----------|
| `docs/views/checkout/` | **write** — 4 files generated |
| `docs/views/健康报告/data.js` | read-only — input source |
| `docs/views/架构报告/data.js` | read-only — input source |
| Anywhere else | no write |

### Invocation

rui-checkout is invoked through conversation. The user asks to generate action items, track progress, or create a checkout from reports. No CLI entry scripts.
