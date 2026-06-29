# Canonical Action Item Template

Every action item in the checkout page follows this exact structure. Use this as the single source of truth when generating `data.js`.

## Full Template (All Fields)

```javascript
{
    // ── Identity ──
    id: 'A7.1',                              // Unique ID — preserve from report or assign ARCH-N
    source: 'health-report',                  // 'health-report' | 'architecture-report'
    
    // ── Classification ──
    dimension: 'D7 Import Standards',         // English dimension name
    dimensionZh: 'D7 导入规范',              // Chinese dimension name
    
    // ── Description ──
    title: 'Phase A: Remove star import from 12 pipeline files',
    titleZh: '阶段A：移除12个管道文件的 star import',
    
    // ── Triage ──
    priority: 'P0',                           // P0 | P1 | P2 | P3-P4
    phase: 'phase-1',                         // phase-1 | phase-2 | phase-3 | phase-4
    estimatedHours: 3,                        // Number — hours
    
    // ── Progress ──
    status: 'todo',                           // todo | in_progress | done | blocked
    
    // ── Dependencies ──
    dependencies: [],                         // IDs this action waits on
    blocks: ['A7.4', 'ARCH-5'],               // IDs this action unblocks
    criticalPath: true,                       // P0 + blocks >= 2 → true
    
    // ── Steps (2-5, independently verifiable) ──
    steps: [
        { id: 'A7.1-s1', text: 'Audit all _1_* through _12_* files for star imports', status: 'todo' },
        { id: 'A7.1-s2', text: 'Replace each star import with explicit named imports', status: 'todo' },
        { id: 'A7.1-s3', text: 'Run mypy on all 12 pipeline files and fix surfaced errors', status: 'todo' },
        { id: 'A7.1-s4', text: 'Verify pipeline still runs end-to-end', status: 'todo' }
    ],
    
    // ── Quantified Impact ──
    before: {
        metric: '37/63 files use star import (58.7%)',    // MUST contain a number
        score: 'D7: 15/100 (F)',                          // Dimension score before
        consequence: 'mypy disabled, IDE navigation broken, all static analysis blocked'
    },
    after: {
        metric: '25/63 files use star import (39.7%)',    // Projected after completion
        score: 'D7: 35→45/100 (D→C)',                     // Score improvement
        unlocks: 'Pipeline files mypy-clean — enables targeted linting'
    }
}
```

## Required vs Optional Fields

| Field | Required | Has Default | Notes |
|-------|:--------:|:-----------:|-------|
| `id` | ✅ | — | Must be unique |
| `source` | ✅ | — | |
| `dimension` | ✅ | — | |
| `dimensionZh` | ✅ | — | |
| `title` | ✅ | — | |
| `titleZh` | — | `title` | Falls back to `title` if absent |
| `priority` | ✅ | — | |
| `phase` | ✅ | — | |
| `estimatedHours` | ✅ | — | |
| `status` | ✅ | `'todo'` | |
| `dependencies` | ✅ | `[]` | |
| `blocks` | ✅ | `[]` | Computed from dependencies |
| `criticalPath` | ✅ | `false` | Computed |
| `steps` | ✅ | `[]` | Min 2, max 5 |
| `before` | ✅ | — | |
| `after` | ✅ | — | |
| `before.metric` | ✅ | — | Must contain number |
| `before.score` | — | `null` | |
| `before.consequence` | ✅ | — | |
| `after.metric` | ✅ | — | Must contain number |
| `after.score` | — | `null` | |
| `after.unlocks` | — | `null` | |

## Status State Machine

```
todo ──────→ in_progress ──────→ done
  ↑              │                  │
  │              │                  │
  └──── blocked ←┘                  │
  │                                 │
  └─────────────────────────────────┘ (reopen: done → todo)
```

- `todo`: Not started, not blocked
- `in_progress`: Work has begun, at least one step is `done` or `in_progress`
- `done`: All steps are `done`, action is complete
- `blocked`: A dependency is not `done`, OR an external blocker exists

**Auto-transitions**:
- Any step set to `done` while action is `todo` → action becomes `in_progress`
- All steps set to `done` → action becomes `done`
- All dependencies become `done` while action is `blocked` → action becomes `todo`

## Dependency Map Template

```
A7.1 (star import pipeline) ──────→ A7.4 (ruff F403 rule)
    │                                    │
    ├──→ ARCH-5 (CI/CD pipeline) ────────┤
    ├──→ ARCH-6 (unit tests)             │
    └──→ ARCH-7 (coverage)               │
                                         │
A7.2 (star import backend) ──────────────┤
    │                                    │
    └──→ A2.1 (audio_utils) ←────────────┘ (shared module needs explicit imports)
```

## Example: Health Report Action (D1 File Size)

```javascript
{
    id: 'A1.1',
    source: 'health-report',
    dimension: 'D1 File Size & Structure',
    dimensionZh: 'D1 文件规模与结构',
    title: 'Split page_setting() into 5 independent panel files',
    titleZh: '将 page_setting() 拆分为 5 个独立面板文件',
    priority: 'P0',
    phase: 'phase-1',
    estimatedHours: 4,
    status: 'todo',
    dependencies: [],
    blocks: ['A5.1'],                    // Splitting UI before splitting the function itself
    criticalPath: false,                  // Only blocks 1 action
    steps: [
        { id: 'A1.1-s1', text: 'Create settings/ directory with llm_panel.py, asr_panel.py, tts_panel.py, subtitle_panel.py, audio_panel.py', status: 'todo' },
        { id: 'A1.1-s2', text: 'Extract each functional domain from page_setting() into its panel file', status: 'todo' },
        { id: 'A1.1-s3', text: 'Update sidebar_setting.py to import and compose the 5 panels', status: 'todo' },
        { id: 'A1.1-s4', text: 'Verify all UI widgets render and settings save correctly', status: 'todo' }
    ],
    before: {
        metric: 'sidebar_setting.py: 365 lines, 1 function with 302 lines covering 5 functional domains',
        score: 'D1: 40/100 (D), D5: 38/100 (D)',
        consequence: 'Changing TTS settings UI risks breaking LLM config — no separation of concerns'
    },
    after: {
        metric: 'sidebar_setting.py: 80 lines + 5 panel files averaging 50 lines each',
        score: 'D1: 65/100 (B), D5: 55/100 (C)',
        unlocks: 'Each panel independently testable, independently modifiable'
    }
}
```

## Example: Architecture Report Action (Inferred from KPI)

```javascript
{
    id: 'ARCH-1',
    source: 'architecture-report',
    dimension: 'Extensibility',
    dimensionZh: '可扩展性',
    title: 'Implement TTS registry pattern to replace if-elif dispatch',
    titleZh: '实现 TTS 注册表模式，替代 if-elif 分发',
    priority: 'P1',
    phase: 'phase-2',
    estimatedHours: 4,
    status: 'todo',
    dependencies: ['A2.1'],              // Need shared audio_utils before unifying TTS interface
    blocks: ['ARCH-2'],                  // Registry pattern enables pipeline step refactoring
    criticalPath: false,
    steps: [
        { id: 'ARCH-1-s1', text: 'Design unified TTS engine interface (signature, return type, error contract)', status: 'todo' },
        { id: 'ARCH-1-s2', text: 'Implement TTS_ENGINES registry dict in tts_main.py', status: 'todo' },
        { id: 'ARCH-1-s3', text: 'Migrate each TTS backend to conform to unified interface (edge_tts first, then others)', status: 'todo' },
        { id: 'ARCH-1-s4', text: 'Remove if-elif chain, replace with registry lookup', status: 'todo' },
        { id: 'ARCH-1-s5', text: 'Verify all 8 TTS backends work through registry dispatch', status: 'todo' }
    ],
    before: {
        metric: 'Adding a TTS backend requires modifying 4 files (tts_main + config + sidebar + new file)',
        score: 'Extensibility: 5.0/10',
        consequence: 'New TTS backend = touching 4 files with if-elif chain growth — violates Open-Closed Principle'
    },
    after: {
        metric: 'Adding a TTS backend requires adding 1 file + 1 registry entry',
        score: 'Extensibility: 7.5/10',
        unlocks: 'TTS backends are truly pluggable — no changes to dispatch logic, UI, or config structure'
    }
}
```
