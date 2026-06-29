/**
 * Improvement Action Checkout 数据源
 * 聚合自代码健康报告（26 行动项）与架构分析报告（10 行动项）
 * 跨报告关联 · 依赖图 · 关键路径 · 前后量化
 */
window.CHECKOUT_CONFIG = {
    constants: {
        generatedAt: new Date().toISOString(),
        totalActions: 36,
        totalHours: 56,
        criticalPathCount: 8,
        crossReportDependencies: 5,
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
            goal: 'Eliminate blocking risks — star imports, god functions, missing CI gates. These are prerequisites for all other improvements.'
        },
        {
            id: 'phase-2',
            label: 'Phase 2: Fix',
            labelZh: '第二阶段：修复',
            weeks: 'W3-4',
            priority: 'P1',
            estimatedHours: 16,
            goal: 'Structural improvements — dedup, refactor, test foundation, registry patterns.'
        },
        {
            id: 'phase-3',
            label: 'Phase 3: Consolidate',
            labelZh: '第三阶段：巩固',
            weeks: 'W5-6',
            priority: 'P2',
            estimatedHours: 8,
            goal: 'Quality of life — docs, naming, tooling polish, CI/CD pipeline.'
        },
        {
            id: 'phase-4',
            label: 'Phase 4: Continuous',
            labelZh: '第四阶段：持续改进',
            weeks: 'W7+',
            priority: 'P3-P4',
            estimatedHours: 10,
            goal: 'Ongoing — coverage growth, pattern propagation, culture building.'
        }
    ],

    actions: [
        // ═══════════════════════════════════════════
        // PHASE 1: STOP BLEEDING (P0, 22h)
        // ═══════════════════════════════════════════

        // --- D7 Import Standards (4 actions) ---
        {
            id: 'A7.1',
            source: 'health-report',
            dimension: 'D7 Import Standards & Module Coupling',
            dimensionZh: 'D7 导入规范与模块耦合',
            title: 'Remove star import from 12 pipeline files (_1_* through _12_*)',
            titleZh: '移除 12 个管道文件的 star import（_1_* 至 _12_*）',
            priority: 'P0',
            phase: 'phase-1',
            estimatedHours: 3,
            status: 'todo',
            dependencies: [],
            blocks: ['A7.3', 'A7.4', 'ARCH-5', 'ARCH-6', 'ARCH-7'],
            criticalPath: true,
            steps: [
                { id: 'A7.1-s1', text: 'Audit all _1_* through _12_* files — catalog every star import occurrence', status: 'todo' },
                { id: 'A7.1-s2', text: 'Replace each `from core.utils import *` with explicit named imports', status: 'todo' },
                { id: 'A7.1-s3', text: 'Run mypy on all 12 pipeline files and fix surfaced type errors', status: 'todo' },
                { id: 'A7.1-s4', text: 'Verify full pipeline runs end-to-end without import errors', status: 'todo' }
            ],
            before: {
                metric: '37/63 files use star import (58.7%) — 26 from core.utils, 14 from core.utils.models',
                score: 'D7: 15/100 (F)',
                consequence: 'mypy completely disabled; IDE cannot navigate; all static analysis tools blocked — this is the #1 architectural risk'
            },
            after: {
                metric: '25/63 files use star import (39.7%) — pipeline files now mypy-clean',
                score: 'D7: 35→45/100 (D→C)',
                unlocks: 'Pipeline files mypy-clean — enables targeted linting and type checking on the most critical 12 files'
            }
        },
        {
            id: 'A7.2',
            source: 'health-report',
            dimension: 'D7 Import Standards & Module Coupling',
            dimensionZh: 'D7 导入规范与模块耦合',
            title: 'Remove star import from 17 backend files (TTS/ASR/utils)',
            titleZh: '移除 17 个后端文件的 star import（TTS/ASR/utils）',
            priority: 'P0',
            phase: 'phase-1',
            estimatedHours: 3,
            status: 'todo',
            dependencies: [],
            blocks: ['A2.1', 'A2.2', 'A2.3', 'ARCH-1'],
            criticalPath: true,
            steps: [
                { id: 'A7.2-s1', text: 'Audit TTS backends (edge_tts, azure_tts, openai_tts, fish_tts, sf_fishtts, _302_f5tts) for star imports', status: 'todo' },
                { id: 'A7.2-s2', text: 'Audit ASR backends (whisperX_302, elevenlabs_asr) and utils for star imports', status: 'todo' },
                { id: 'A7.2-s3', text: 'Replace all star imports with explicit imports across all 17 files', status: 'todo' },
                { id: 'A7.2-s4', text: 'Run mypy on backend files and fix type errors', status: 'todo' }
            ],
            before: {
                metric: '17 backend files with star imports — every TTS/ASR addition copies the anti-pattern',
                score: 'D7: 15/100 (F)',
                consequence: 'Backend code untraceable — adding a TTS engine means copying vague imports, perpetuating the problem'
            },
            after: {
                metric: '8/63 files use star import (12.7%) — only intentional re-exports remain',
                score: 'D7: 45→60/100 (C→B)',
                unlocks: 'Backend files become independently analyzable — dedup detection now works on TTS/ASR code'
            }
        },
        {
            id: 'A7.3',
            source: 'health-report',
            dimension: 'D7 Import Standards & Module Coupling',
            dimensionZh: 'D7 导入规范与模块耦合',
            title: 'Refactor core/__init__.py with explicit __all__ and deprecate star import re-exports',
            titleZh: '重构 core/__init__.py — 显式 __all__ 并废弃 star import 重导出',
            priority: 'P0',
            phase: 'phase-1',
            estimatedHours: 2,
            status: 'todo',
            dependencies: ['A7.1', 'A7.2'],
            blocks: ['A7.4'],
            criticalPath: false,
            steps: [
                { id: 'A7.3-s1', text: 'Audit core/__init__.py — list all re-exported symbols', status: 'todo' },
                { id: 'A7.3-s2', text: 'Define explicit __all__ with only the public API surface', status: 'todo' },
                { id: 'A7.3-s3', text: 'Add deprecation warning for `from core.utils import *` usage', status: 'todo' }
            ],
            before: {
                metric: 'core/__init__.py has no __all__ — star import surface is uncontrolled, 38 modules depend on it',
                score: 'D7: 15/100 (F)',
                consequence: 'Changing any symbol in core.utils has an unknown blast radius across 38 dependent modules'
            },
            after: {
                metric: 'core/__init__.py with explicit __all__ — public API surface documented and controlled',
                score: 'D7: 60→75/100 (B→A)',
                unlocks: 'Safe to evolve core.utils without breaking dependents — public API contract is explicit'
            }
        },
        {
            id: 'A7.4',
            source: 'health-report',
            dimension: 'D7 Import Standards & Module Coupling',
            dimensionZh: 'D7 导入规范与模块耦合',
            title: 'Add ruff F403/F405 CI check to permanently ban star imports',
            titleZh: '添加 ruff F403/F405 CI 检查，永久禁止 star import',
            priority: 'P0',
            phase: 'phase-1',
            estimatedHours: 0.5,
            status: 'todo',
            dependencies: ['A7.1', 'A7.2', 'A7.3'],
            blocks: ['ARCH-5'],
            criticalPath: false,
            steps: [
                { id: 'A7.4-s1', text: 'Configure ruff with F403 (star import usage) and F405 (star import member access) rules', status: 'todo' },
                { id: 'A7.4-s2', text: 'Add ruff check to pre-commit hooks or CI workflow', status: 'todo' }
            ],
            before: {
                metric: '0 automated checks for import quality — star imports can silently regress',
                score: 'D7: 15/100 (F)',
                consequence: 'After manual cleanup, star imports can creep back — no automated gate exists'
            },
            after: {
                metric: 'CI blocks any PR containing `import *` — regression impossible',
                score: 'D7: 75→85/100 (A)',
                unlocks: 'Star import ban is permanent and automated — unlocks all other static analysis tooling'
            }
        },

        // --- D1 File Size (2 actions) ---
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
            blocks: ['A5.1'],
            criticalPath: false,
            steps: [
                { id: 'A1.1-s1', text: 'Create settings/ package with llm_panel.py, asr_panel.py, tts_panel.py, subtitle_panel.py, audio_panel.py', status: 'todo' },
                { id: 'A1.1-s2', text: 'Extract LLM config logic from page_setting() into llm_panel.py', status: 'todo' },
                { id: 'A1.1-s3', text: 'Extract ASR/TTS/subtitle/audio logic into respective panel files', status: 'todo' },
                { id: 'A1.1-s4', text: 'Update sidebar_setting.py to import and compose the 5 panels', status: 'todo' },
                { id: 'A1.1-s5', text: 'Verify all UI widgets render correctly and settings persist across restart', status: 'todo' }
            ],
            before: {
                metric: 'sidebar_setting.py: 365 lines, page_setting() single function: 302 lines covering 5 functional domains',
                score: 'D1: 40/100 (D), D5: 38/100 (D)',
                consequence: 'Changing TTS settings UI risks breaking LLM config — Streamlit anti-pattern of cramming all widgets in one function'
            },
            after: {
                metric: 'sidebar_setting.py: ~80 lines + 5 panel files averaging ~50 lines each = total ~330 lines with clean separation',
                score: 'D1: 65/100 (B), D5: 55/100 (C)',
                unlocks: 'Each settings panel independently testable, independently modifiable — UI changes no longer risk unrelated config'
            }
        },
        {
            id: 'A1.2',
            source: 'health-report',
            dimension: 'D1 File Size & Structure',
            dimensionZh: 'D1 文件规模与结构',
            title: 'Convert prompts.py (364 lines) to config/prompts.yaml',
            titleZh: '将 prompts.py（364 行）转换为 config/prompts.yaml',
            priority: 'P1',
            phase: 'phase-2',
            estimatedHours: 2,
            status: 'todo',
            dependencies: [],
            blocks: [],
            criticalPath: false,
            steps: [
                { id: 'A1.2-s1', text: 'Extract all prompt strings from prompts.py into structured YAML', status: 'todo' },
                { id: 'A1.2-s2', text: 'Write prompt loader that reads from YAML with key-based access', status: 'todo' },
                { id: 'A1.2-s3', text: 'Replace all `from prompts import *` with YAML loader calls', status: 'todo' }
            ],
            before: {
                metric: 'prompts.py: 364 lines of pure data masquerading as Python code',
                score: 'D1: 40/100 (D)',
                consequence: 'Data embedded in .py — no syntax highlighting for prompt text, no validation, can\'t be edited by non-programmers'
            },
            after: {
                metric: 'config/prompts.yaml: ~300 lines of structured, validatable prompt data',
                score: 'D1: 65/100 (B)',
                unlocks: 'Prompts editable without Python knowledge, YAML validation catches formatting errors, clean separation of data from code'
            }
        },

        // --- D4 Nesting Depth (3 actions) ---
        {
            id: 'A4.1',
            source: 'health-report',
            dimension: 'D4 Nesting Depth & Cyclomatic Complexity',
            dimensionZh: 'D4 嵌套深度与圈复杂度',
            title: 'Registry pattern refactor for tts_main.py (11-level elif → 2-level dispatch)',
            titleZh: '注册表模式重构 tts_main.py（11 层 elif → 2 层分发）',
            priority: 'P0',
            phase: 'phase-1',
            estimatedHours: 3,
            status: 'todo',
            dependencies: [],
            blocks: ['ARCH-1'],
            criticalPath: false,
            steps: [
                { id: 'A4.1-s1', text: 'Design TTS_ENGINES registry dict mapping method name → handler function', status: 'todo' },
                { id: 'A4.1-s2', text: 'Implement registry lookup replacing the 8-level elif chain', status: 'todo' },
                { id: 'A4.1-s3', text: 'Add error handling for unknown TTS methods (ValueError with available methods list)', status: 'todo' },
                { id: 'A4.1-s4', text: 'Test with all 8 TTS backends through registry dispatch', status: 'todo' }
            ],
            before: {
                metric: 'tts_main.py: max nesting depth 11 levels — 8-level elif chain for TTS engine dispatch',
                score: 'D4: 42/100 (D+)',
                consequence: 'Adding a TTS engine grows the elif chain by 1 — classic "missing strategy pattern" anti-pattern, 3 files have 8+ nesting'
            },
            after: {
                metric: 'tts_main.py: max nesting depth 2 levels — registry lookup replaces all elif branching',
                score: 'D4: 65/100 (B)',
                unlocks: 'New TTS engine = new file + 1 registry entry — core dispatch never changes, OCP compliant'
            }
        },
        {
            id: 'A4.2',
            source: 'health-report',
            dimension: 'D4 Nesting Depth & Cyclomatic Complexity',
            dimensionZh: 'D4 嵌套深度与圈复杂度',
            title: 'Guard Clause refactor for split_by_connector.py (8→3 nesting levels)',
            titleZh: 'Guard Clause 重构 split_by_connector.py（8→3 嵌套层级）',
            priority: 'P1',
            phase: 'phase-2',
            estimatedHours: 2,
            status: 'todo',
            dependencies: [],
            blocks: [],
            criticalPath: false,
            steps: [
                { id: 'A4.2-s1', text: 'Identify deep-nested conditionals in split_by_connector.py', status: 'todo' },
                { id: 'A4.2-s2', text: 'Apply guard clause pattern — early return for edge cases, flatten main logic', status: 'todo' },
                { id: 'A4.2-s3', text: 'Verify subtitle splitting behavior unchanged with test cases', status: 'todo' }
            ],
            before: {
                metric: 'split_by_connector.py: max nesting depth 8 levels',
                score: 'D4: 42/100 (D+)',
                consequence: 'Deep nesting makes subtitle-splitting logic nearly impossible to debug — one misplaced break breaks everything'
            },
            after: {
                metric: 'split_by_connector.py: max nesting depth 3 levels',
                score: 'D4: 65/100 (B)',
                unlocks: 'Clean control flow — each condition is independently testable and debuggable'
            }
        },
        {
            id: 'A4.3',
            source: 'health-report',
            dimension: 'D4 Nesting Depth & Cyclomatic Complexity',
            dimensionZh: 'D4 嵌套深度与圈复杂度',
            title: 'Split sidebar_setting.py conditional rendering (9→3 nesting levels)',
            titleZh: '拆分 sidebar_setting.py 条件渲染逻辑（9→3 嵌套层级）',
            priority: 'P1',
            phase: 'phase-2',
            estimatedHours: 2,
            status: 'todo',
            dependencies: ['A1.1'],
            blocks: [],
            criticalPath: false,
            steps: [
                { id: 'A4.3-s1', text: 'After A1.1, audit remaining conditional rendering in sidebar_setting.py', status: 'todo' },
                { id: 'A4.3-s2', text: 'Extract conditional blocks into composable helper functions', status: 'todo' },
                { id: 'A4.3-s3', text: 'Verify Streamlit conditional rendering still works correctly', status: 'todo' }
            ],
            before: {
                metric: 'sidebar_setting.py: max nesting depth 9 levels from nested Streamlit conditional widgets',
                score: 'D4: 42/100 (D+)',
                consequence: 'Deeply nested Streamlit `if st.checkbox(...):` chains are fragile — removing one checkbox breaks indentation cascade'
            },
            after: {
                metric: 'sidebar_setting.py: max nesting depth 3 levels with composable helpers',
                score: 'D4: 65/100 (B)',
                unlocks: 'UI sections are independently toggleable without nesting — cleaner UX and cleaner code'
            }
        },

        // --- D5 Function Length (2 actions) ---
        {
            id: 'A5.1',
            source: 'health-report',
            dimension: 'D5 Function Length & Responsibility',
            dimensionZh: 'D5 函数长度与职责',
            title: 'Split page_setting() (302 lines, 6.0x limit) → 5 panel sub-functions',
            titleZh: '拆分 page_setting()（302 行，超标 6 倍）→ 5 个面板子函数',
            priority: 'P0',
            phase: 'phase-1',
            estimatedHours: 4,
            status: 'todo',
            dependencies: ['A1.1'],
            blocks: [],
            criticalPath: false,
            steps: [
                { id: 'A5.1-s1', text: 'After A1.1 creates panel files, refactor each panel into a single-responsibility function', status: 'todo' },
                { id: 'A5.1-s2', text: 'Ensure each panel function is ≤50 lines with clear I/O contract', status: 'todo' },
                { id: 'A5.1-s3', text: 'Add type hints to all panel function signatures', status: 'todo' }
            ],
            before: {
                metric: 'page_setting(): 302 lines (6.0x the 50-line limit) — worst function in the entire project',
                score: 'D5: 38/100 (D)',
                consequence: 'The most-changed function is also the hardest to change safely — Streamlit encourages this anti-pattern'
            },
            after: {
                metric: '5 panel functions averaging 40-50 lines each — all ≤50 line limit, single responsibility',
                score: 'D5: 55/100 (C)',
                unlocks: 'Settings changes are localized to one panel function — no more touching a 302-line monster for a TTS config tweak'
            }
        },
        {
            id: 'A5.2',
            source: 'health-report',
            dimension: 'D5 Function Length & Responsibility',
            dimensionZh: 'D5 函数长度与职责',
            title: 'Split _render_download_ui() (202 lines, 4.0x) → 4 sub-functions',
            titleZh: '拆分 _render_download_ui()（202 行，超标 4 倍）→ 4 个子函数',
            priority: 'P0',
            phase: 'phase-1',
            estimatedHours: 3,
            status: 'todo',
            dependencies: [],
            blocks: [],
            criticalPath: false,
            steps: [
                { id: 'A5.2-s1', text: 'Identify 4 logical sections in _render_download_ui(): URL input, format selection, progress display, result preview', status: 'todo' },
                { id: 'A5.2-s2', text: 'Extract each section into a named function with type hints', status: 'todo' },
                { id: 'A5.2-s3', text: 'Verify download UI still works with all yt-dlp format combinations', status: 'todo' }
            ],
            before: {
                metric: '_render_download_ui(): 202 lines (4.0x limit) — 2nd worst function',
                score: 'D5: 38/100 (D)',
                consequence: 'Download UI logic mixed with progress tracking and format selection — 3 concerns in 1 function'
            },
            after: {
                metric: '4 sub-functions averaging 40-50 lines each — all ≤50 line limit',
                score: 'D5: 55/100 (C)',
                unlocks: 'Download UI sections independently testable — format selection bugs don\'t break progress display'
            }
        },

        // ═══════════════════════════════════════════
        // PHASE 2: FIX (P1, 16h)
        // ═══════════════════════════════════════════

        // --- D2 Code Duplication (3 actions) ---
        {
            id: 'A2.1',
            source: 'health-report',
            dimension: 'D2 Code Duplication',
            dimensionZh: 'D2 代码重复率',
            title: 'Create core/tts_backend/audio_utils.py — extract merge_audio from 2 TTS backends',
            titleZh: '创建 core/tts_backend/audio_utils.py — 从 2 个 TTS 后端提取 merge_audio',
            priority: 'P1',
            phase: 'phase-2',
            estimatedHours: 2,
            status: 'todo',
            dependencies: ['A7.2'],
            blocks: ['ARCH-1'],
            criticalPath: false,
            steps: [
                { id: 'A2.1-s1', text: 'Compare merge_audio in sf_fishtts.py:101-120 and _302_f5tts.py:53-76 — identify exact duplication', status: 'todo' },
                { id: 'A2.1-s2', text: 'Design merge_wav_files() with unified params (files, output, silence_ms, sample_rate)', status: 'todo' },
                { id: 'A2.1-s3', text: 'Implement in core/tts_backend/audio_utils.py with type hints and docstring', status: 'todo' },
                { id: 'A2.1-s4', text: 'Replace both original implementations with calls to shared function', status: 'todo' },
                { id: 'A2.1-s5', text: 'Test both TTS backends produce identical audio output', status: 'todo' }
            ],
            before: {
                metric: 'merge_audio duplicated across sf_fishtts.py and _302_f5tts.py — ~60 lines, 95% similarity (DR-1)',
                score: 'D2: 35/100 (D)',
                consequence: 'One bug requires two fixes — TTS audio merging bug fixed in one backend but forgotten in the other'
            },
            after: {
                metric: '1 shared merge_wav_files() in audio_utils.py — ~60 lines eliminated, DR-1 resolved',
                score: 'D2: 55/100 (C)',
                unlocks: 'Single source of truth for audio merging — one fix applies to all TTS backends'
            }
        },
        {
            id: 'A2.2',
            source: 'health-report',
            dimension: 'D2 Code Duplication',
            dimensionZh: 'D2 代码重复率',
            title: 'Create video_utils.py — extract subtitle/video constants from 2 files',
            titleZh: '创建 video_utils.py — 从 2 个文件提取字幕/视频常量',
            priority: 'P1',
            phase: 'phase-2',
            estimatedHours: 1.5,
            status: 'todo',
            dependencies: ['A7.2'],
            blocks: [],
            criticalPath: false,
            steps: [
                { id: 'A2.2-s1', text: 'Extract duplicated constants from _7_sub_into_vid.py:22-29 and _12_dub_to_vid.py:19-29', status: 'todo' },
                { id: 'A2.2-s2', text: 'Create video_utils.py with shared constants and helper functions', status: 'todo' },
                { id: 'A2.2-s3', text: 'Update both files to import from video_utils.py', status: 'todo' }
            ],
            before: {
                metric: 'Subtitle/video constants duplicated across _7 and _12 — ~40 lines, 85% similarity (DR-2)',
                score: 'D2: 35/100 (D)',
                consequence: 'Changing subtitle format requires updating constants in 2 places — DRY violation in critical pipeline path'
            },
            after: {
                metric: '1 shared constants module — ~40 lines eliminated, DR-2 resolved',
                score: 'D2: 55/100 (C)',
                unlocks: 'Single source of truth for video/subtitle constants — format changes are one-line edits'
            }
        },
        {
            id: 'A2.3',
            source: 'health-report',
            dimension: 'D2 Code Duplication',
            dimensionZh: 'D2 代码重复率',
            title: 'Create audio_loader.py — unify ASR audio loading across whisperX_302 and elevenlabs_asr',
            titleZh: '创建 audio_loader.py — 统一 whisperX_302 和 elevenlabs_asr 的音频加载',
            priority: 'P1',
            phase: 'phase-2',
            estimatedHours: 1.5,
            status: 'todo',
            dependencies: ['A7.2'],
            blocks: [],
            criticalPath: false,
            steps: [
                { id: 'A2.3-s1', text: 'Compare audio loading in whisperX_302.py and elevenlabs_asr.py — extract common logic', status: 'todo' },
                { id: 'A2.3-s2', text: 'Create audio_loader.py with unified load_audio(path, sample_rate) interface', status: 'todo' },
                { id: 'A2.3-s3', text: 'Update both ASR backends to use shared loader', status: 'todo' }
            ],
            before: {
                metric: 'Audio loading duplicated across 2 ASR backends — ~30 lines, 75% similarity (DR-3)',
                score: 'D2: 35/100 (D)',
                consequence: 'Each ASR backend has its own audio loading quirks — inconsistent behavior across backends'
            },
            after: {
                metric: '1 shared load_audio() — ~30 lines eliminated, DR-3 resolved, consistent audio loading behavior',
                score: 'D2: 55/100 (C)',
                unlocks: 'Uniform audio preprocessing — ASR backends receive identically loaded audio, fair quality comparison'
            }
        },

        // --- D6 Comments & Docs (2 actions) ---
        {
            id: 'A6.1',
            source: 'health-report',
            dimension: 'D6 Comments & Documentation',
            dimensionZh: 'D6 注释与文档化',
            title: 'Add docstrings to 9 zero-comment files (68+70+104+40+23+30+14+14+13 lines)',
            titleZh: '为 9 个零注释文件添加 docstring（68+70+104+40+23+30+14+14+13 行）',
            priority: 'P1',
            phase: 'phase-2',
            estimatedHours: 3,
            status: 'todo',
            dependencies: [],
            blocks: [],
            criticalPath: false,
            steps: [
                { id: 'A6.1-s1', text: 'Add module docstrings to whisperX_302.py, _4_1_summarize.py, video_processor.py', status: 'todo' },
                { id: 'A6.1-s2', text: 'Add module + function docstrings to fish_tts.py, azure_tts.py, delete_retry_dubbing.py', status: 'todo' },
                { id: 'A6.1-s3', text: 'Add module docstrings to setup.py, _3_1_split_nlp.py, spacy_utils/__init__.py', status: 'todo' }
            ],
            before: {
                metric: '9/63 files have zero comments (14.3%) — docstring coverage: 12.7% modules, 10.7% functions',
                score: 'D6: 30/100 (D)',
                consequence: 'New contributors cannot understand what these files do without reading every line — onboarding friction'
            },
            after: {
                metric: '0/63 files have zero comments — docstring coverage: 25% modules, 20% functions',
                score: 'D6: 45/100 (C)',
                unlocks: 'Every file has at minimum a module docstring explaining its role in the pipeline'
            }
        },
        {
            id: 'A6.2',
            source: 'health-report',
            dimension: 'D6 Comments & Documentation',
            dimensionZh: 'D6 注释与文档化',
            title: 'Add I/O and dependency documentation to pipeline steps (_1 through _12)',
            titleZh: '为管道步骤添加 I/O 和依赖文档（_1 至 _12）',
            priority: 'P2',
            phase: 'phase-3',
            estimatedHours: 4,
            status: 'todo',
            dependencies: ['A6.1'],
            blocks: [],
            criticalPath: false,
            steps: [
                { id: 'A6.2-s1', text: 'Document input files, output files, and side effects for each pipeline step', status: 'todo' },
                { id: 'A6.2-s2', text: 'Add data dependency graph as module-level comment in each pipeline file', status: 'todo' },
                { id: 'A6.2-s3', text: 'Document expected LLM prompt behavior and fallback strategies', status: 'todo' }
            ],
            before: {
                metric: 'Pipeline steps have no I/O documentation — data dependencies are implicit in file paths',
                score: 'D6: 30/100 (D)',
                consequence: 'Debugging a mid-pipeline failure requires tracing file reads/writes across 12 files — hours of detective work'
            },
            after: {
                metric: 'Each pipeline step documents: inputs consumed, outputs produced, side effects, expected runtime',
                score: 'D6: 55/100 (C)',
                unlocks: 'Pipeline data flow is explicit — new contributors can understand the pipeline by reading docstrings, not tracing code'
            }
        },

        // --- D3 Naming (2 actions) ---
        {
            id: 'A3.1',
            source: 'health-report',
            dimension: 'D3 Naming Semantics',
            dimensionZh: 'D3 命名语义化',
            title: 'Rename 15 non-idiomatic single-char variables (r, x, f, d, t, out, etc.)',
            titleZh: '重命名 15 个非惯用单字符变量（r, x, f, d, t, out 等）',
            priority: 'P1',
            phase: 'phase-2',
            estimatedHours: 1,
            status: 'todo',
            dependencies: ['A7.1', 'A7.2'],
            blocks: [],
            criticalPath: false,
            steps: [
                { id: 'A3.1-s1', text: 'Locate all 15 non-idiomatic single-char variables using grep for common patterns', status: 'todo' },
                { id: 'A3.1-s2', text: 'Replace each with descriptive name (e.g., r→translation, out→video_writer, x→audio_segment)', status: 'todo' },
                { id: 'A3.1-s3', text: 'Verify no behavior change — pure rename refactor', status: 'todo' }
            ],
            before: {
                metric: '~15 single-char variables in non-idiomatic contexts (r, out, x, d, t — not loop indices)',
                score: 'D3: 55/100 (C)',
                consequence: 'Single-char names make code review diffs unreadable — `r = process(x)` conveys zero information'
            },
            after: {
                metric: '0 non-idiomatic single-char variables — all names are at least 3 chars and semantically descriptive',
                score: 'D3: 65/100 (B)',
                unlocks: 'Code is self-documenting at the variable level — review diffs are immediately understandable'
            }
        },
        {
            id: 'A3.2',
            source: 'health-report',
            dimension: 'D3 Naming Semantics',
            dimensionZh: 'D3 命名语义化',
            title: 'Specificize 50+ over-generalized names (result, data, info, item, out, temp)',
            titleZh: '具体化 50+ 个过度泛化名称（result, data, info, item, out, temp）',
            priority: 'P3-P4',
            phase: 'phase-4',
            estimatedHours: 3,
            status: 'todo',
            dependencies: ['A7.1', 'A7.2'],
            blocks: [],
            criticalPath: false,
            steps: [
                { id: 'A3.2-s1', text: 'Catalog all 50+ over-generalized names with file locations', status: 'todo' },
                { id: 'A3.2-s2', text: 'Replace each with domain-specific name (result→asr_result, data→response_json, info→task_metadata)', status: 'todo' },
                { id: 'A3.2-s3', text: 'Verify no behavior change across all affected modules', status: 'todo' }
            ],
            before: {
                metric: '50+ occurrences of over-generalized names (result: 25+, data: 10+, info: 8+, item: 5+, out: 5+)',
                score: 'D3: 55/100 (C)',
                consequence: 'Generic names create ambiguity — which result? whose data? Debugging requires tracing assignments back to source'
            },
            after: {
                metric: '≤10 over-generalized names — only in genuinely generic utility functions',
                score: 'D3: 75/100 (B→A)',
                unlocks: 'Names are self-documenting — reading the code tells you what each variable holds without tracing'
            }
        },

        // ═══════════════════════════════════════════
        // PHASE 3: CONSOLIDATE (P2, 8h)
        // ═══════════════════════════════════════════

        // --- Architecture: Config & i18n (2 actions) ---
        {
            id: 'ARCH-8',
            source: 'architecture-report',
            dimension: 'Performance',
            dimensionZh: '性能',
            title: 'Add in-process cache to load_key() and t() — eliminate redundant disk I/O',
            titleZh: '为 load_key() 和 t() 添加进程内缓存 — 消除冗余磁盘 I/O',
            priority: 'P1',
            phase: 'phase-2',
            estimatedHours: 2,
            status: 'todo',
            dependencies: [],
            blocks: [],
            criticalPath: false,
            steps: [
                { id: 'ARCH-8-s1', text: 'Implement TTL-based cache (2s) in load_key() with write-invalidation', status: 'todo' },
                { id: 'ARCH-8-s2', text: 'Implement TTL-based cache in t() for translation lookups', status: 'todo' },
                { id: 'ARCH-8-s3', text: 'Benchmark: measure I/O reduction in 500-sentence translation scenario', status: 'todo' }
            ],
            before: {
                metric: 'load_key(): open()→yaml.load() every call. t(): open()→json.load() every call. 500+ redundant disk I/Os in typical translation',
                score: 'Performance: 6.0/10',
                consequence: 'Translating 500 sentences = 500+ unnecessary disk reads — significant latency in batch processing'
            },
            after: {
                metric: 'Cache hit rate ≥90% for load_key() and t() — disk reads reduced to first access + write invalidation',
                score: 'Performance: 7.5/10',
                unlocks: 'Near-memory-speed config and i18n lookups after first read — batch translation latency significantly reduced'
            }
        },
        {
            id: 'ARCH-9',
            source: 'architecture-report',
            dimension: 'Security',
            dimensionZh: '安全性',
            title: 'Migrate API keys from plaintext YAML to environment variables with fallback',
            titleZh: '将 API Key 从明文 YAML 迁移到环境变量（含 fallback 机制）',
            priority: 'P1',
            phase: 'phase-2',
            estimatedHours: 1.5,
            status: 'todo',
            dependencies: [],
            blocks: [],
            criticalPath: false,
            steps: [
                { id: 'ARCH-9-s1', text: 'Implement env var lookup with YAML fallback for backward compatibility', status: 'todo' },
                { id: 'ARCH-9-s2', text: 'Update .gitignore to verify no key files are tracked', status: 'todo' },
                { id: 'ARCH-9-s3', text: 'Add setup wizard that writes keys to .env instead of config YAML', status: 'todo' },
                { id: 'ARCH-9-s4', text: 'Add documentation: "Never commit API keys — use .env file"', status: 'todo' }
            ],
            before: {
                metric: 'API keys stored in plaintext YAML config — one accidental `git add config.yaml` = all keys exposed',
                score: 'Security: 4.0/10',
                consequence: 'Plaintext secrets in config files — catastrophic if committed; every contributor must manually avoid'
            },
            after: {
                metric: 'API keys loaded from env vars with YAML fallback (deprecation warning) — .gitignore already covers .env',
                score: 'Security: 7.0/10',
                unlocks: 'Zero risk of accidental key exposure via git — standard 12-factor app secret management'
            }
        },

        // --- Architecture: CI/CD & Testing (3 actions) ---
        {
            id: 'ARCH-5',
            source: 'architecture-report',
            dimension: 'Testability',
            dimensionZh: '可测试性',
            title: 'Set up CI/CD pipeline with ruff linting + mypy type check on every PR',
            titleZh: '建立 CI/CD 流水线 — 每个 PR 运行 ruff linting + mypy 类型检查',
            priority: 'P2',
            phase: 'phase-3',
            estimatedHours: 2,
            status: 'todo',
            dependencies: ['A7.4'],
            blocks: ['ARCH-6', 'ARCH-7'],
            criticalPath: false,
            steps: [
                { id: 'ARCH-5-s1', text: 'Create .github/workflows/ci.yml with ruff + mypy steps', status: 'todo' },
                { id: 'ARCH-5-s2', text: 'Configure ruff with project-specific rules (F403/F405 mandatory, others advisory)', status: 'todo' },
                { id: 'ARCH-5-s3', text: 'Configure mypy with baseline ignore list (non-pipeline files)', status: 'todo' },
                { id: 'ARCH-5-s4', text: 'Run first CI pass, fix any configuration issues, verify green build', status: 'todo' }
            ],
            before: {
                metric: '0 automated quality checks — no CI/CD pipeline, no linting, no type checking on any code path',
                score: 'Testability: 2.0/10',
                consequence: 'Every quality regression is caught manually (if at all) — no automated gate prevents anti-patterns from merging'
            },
            after: {
                metric: 'CI runs on every PR: ruff (lint) + mypy (type check) — pipeline files must pass, others advisory',
                score: 'Testability: 4.5/10',
                unlocks: 'Automated quality gate — star imports, type errors, and lint violations caught before merge, not after deploy'
            }
        },
        {
            id: 'ARCH-6',
            source: 'architecture-report',
            dimension: 'Testability',
            dimensionZh: '可测试性',
            title: 'Write ≥5 unit test files covering core modules (config, utils, audio, subtitle)',
            titleZh: '编写 ≥5 个单元测试文件，覆盖核心模块（config, utils, audio, subtitle）',
            priority: 'P2',
            phase: 'phase-3',
            estimatedHours: 3,
            status: 'todo',
            dependencies: ['A7.1', 'A7.2', 'ARCH-5', 'A2.1', 'A2.2'],
            blocks: ['ARCH-7'],
            criticalPath: false,
            steps: [
                { id: 'ARCH-6-s1', text: 'Set up pytest with conftest.py and test fixtures', status: 'todo' },
                { id: 'ARCH-6-s2', text: 'Write tests for config_utils.py (load_config, key access patterns)', status: 'todo' },
                { id: 'ARCH-6-s3', text: 'Write tests for audio_utils.py (merge_wav_files, load_audio)', status: 'todo' },
                { id: 'ARCH-6-s4', text: 'Write tests for subtitle splitting and NLP utilities', status: 'todo' },
                { id: 'ARCH-6-s5', text: 'Add test coverage reporting to CI pipeline', status: 'todo' }
            ],
            before: {
                metric: '0 unit test files, 0 integration test files, 0% core module coverage',
                score: 'Testability: 2.0/10',
                consequence: 'Every refactor is a leap of faith — no tests to catch regressions in core utilities'
            },
            after: {
                metric: '≥5 unit test files, ≥60% core module coverage — every shared utility has test coverage',
                score: 'Testability: 5.0/10',
                unlocks: 'Refactoring is safe — tests catch regressions in audio processing, config loading, and subtitle splitting'
            }
        },
        {
            id: 'ARCH-7',
            source: 'architecture-report',
            dimension: 'Testability',
            dimensionZh: '可测试性',
            title: 'Write ≥2 integration tests for critical pipeline paths + coverage reporting',
            titleZh: '编写 ≥2 个集成测试覆盖关键管道路径 + 覆盖率报告',
            priority: 'P2',
            phase: 'phase-3',
            estimatedHours: 3,
            status: 'todo',
            dependencies: ['ARCH-5', 'ARCH-6'],
            blocks: [],
            criticalPath: false,
            steps: [
                { id: 'ARCH-7-s1', text: 'Design integration test: download → transcribe → translate (steps 1-4)', status: 'todo' },
                { id: 'ARCH-7-s2', text: 'Design integration test: translate → subtitle → dub → merge (steps 4-12)', status: 'todo' },
                { id: 'ARCH-7-s3', text: 'Add coverage badge to README and CI summary', status: 'todo' }
            ],
            before: {
                metric: '0 integration tests — pipeline correctness verified only by running full pipeline manually',
                score: 'Testability: 2.0/10',
                consequence: 'Pipeline regression = "someone ran the full pipeline and noticed something wrong" — days of delay'
            },
            after: {
                metric: '≥2 integration tests covering start→middle→end — CI catches pipeline breakage within minutes',
                score: 'Testability: 5.5/10',
                unlocks: 'Pipeline integrity verified automatically — any step that breaks upstream/downstream data flow is caught'
            }
        },

        // --- Architecture: Extensibility (2 actions) ---
        {
            id: 'ARCH-1',
            source: 'architecture-report',
            dimension: 'Extensibility',
            dimensionZh: '可扩展性',
            title: 'Implement TTS registry pattern — unified interface, single-file registration',
            titleZh: '实现 TTS 注册表模式 — 统一接口，单文件注册',
            priority: 'P1',
            phase: 'phase-2',
            estimatedHours: 4,
            status: 'todo',
            dependencies: ['A4.1', 'A2.1'],
            blocks: ['ARCH-2'],
            criticalPath: false,
            steps: [
                { id: 'ARCH-1-s1', text: 'Design unified TTS engine interface: signature, return type, error contract', status: 'todo' },
                { id: 'ARCH-1-s2', text: 'Implement TTS_ENGINES registry dict in tts_main.py (builds on A4.1 registry refactor)', status: 'todo' },
                { id: 'ARCH-1-s3', text: 'Migrate each TTS backend to conform to unified interface (edge_tts first as test, then others)', status: 'todo' },
                { id: 'ARCH-1-s4', text: 'Reduce TTS addition from 4-file change to 1-file + 1 registry entry', status: 'todo' },
                { id: 'ARCH-1-s5', text: 'Verify all 8 TTS backends work through registry dispatch with identical output quality', status: 'todo' }
            ],
            before: {
                metric: 'Adding a TTS backend requires modifying 4 files (new TTS file + tts_main if-elif + config.yaml section + sidebar_setting UI options)',
                score: 'Extensibility: 5.0/10',
                consequence: 'New TTS backend = touching 4 files with if-elif chain growth + inconsistent function signatures (2-4 params) — violates Open-Closed Principle'
            },
            after: {
                metric: 'Adding a TTS backend requires 1 new file + 1 registry entry — tts_main, config, and UI auto-discover from registry',
                score: 'Extensibility: 7.5/10',
                unlocks: 'TTS backends are truly pluggable — zero changes to dispatch logic, config structure, or UI rendering'
            }
        },
        {
            id: 'ARCH-2',
            source: 'architecture-report',
            dimension: 'Extensibility',
            dimensionZh: '可扩展性',
            title: 'Refactor pipeline step registration — auto-discovery instead of numeric prefix naming',
            titleZh: '重构管道步骤注册 — 自动发现替代数字前缀命名',
            priority: 'P2',
            phase: 'phase-3',
            estimatedHours: 3,
            status: 'todo',
            dependencies: ['ARCH-1', 'A7.1'],
            blocks: [],
            criticalPath: false,
            steps: [
                { id: 'ARCH-2-s1', text: 'Design pipeline step registry with metadata: name, description, inputs, outputs, dependencies', status: 'todo' },
                { id: 'ARCH-2-s2', text: 'Migrate _1_ytdlp.py → steps/download.py with registry decorator', status: 'todo' },
                { id: 'ARCH-2-s3', text: 'Implement pipeline runner that resolves step order from dependency metadata', status: 'todo' },
                { id: 'ARCH-2-s4', text: 'Remove numeric prefix requirement — steps are identified by name, not position', status: 'todo' }
            ],
            before: {
                metric: 'Inserting a pipeline step between step 4 and 5 requires renaming _5 through _12 (8 files) — numeric prefix encodes order',
                score: 'Extensibility: 5.0/10',
                consequence: 'Pipeline evolution is expensive — adding a step means renaming half the pipeline files, breaking git history and imports'
            },
            after: {
                metric: 'Inserting a step = 1 new file with registry decorator — zero other files changed, order resolved from dependency graph',
                score: 'Extensibility: 8.0/10',
                unlocks: 'Pipeline is truly evolvable — steps are named by function, ordered by dependencies, not hardcoded numbers'
            }
        },

        // --- Architecture: Task Isolation (1 action) ---
        {
            id: 'ARCH-3',
            source: 'architecture-report',
            dimension: 'Robustness',
            dimensionZh: '健壮性',
            title: 'Task-scoped output directories — replace global output/ singleton',
            titleZh: '任务级输出目录隔离 — 替代全局 output/ 单例',
            priority: 'P2',
            phase: 'phase-3',
            estimatedHours: 3,
            status: 'todo',
            dependencies: ['A7.1'],
            blocks: ['ARCH-4'],
            criticalPath: false,
            steps: [
                { id: 'ARCH-3-s1', text: 'Design task-scoped directory structure: output/{task_id}/{step}/', status: 'todo' },
                { id: 'ARCH-3-s2', text: 'Refactor models.py path constants to accept task_id parameter', status: 'todo' },
                { id: 'ARCH-3-s3', text: 'Update all 15 pipeline steps to use task-scoped paths', status: 'todo' },
                { id: 'ARCH-3-s4', text: 'Add cleanup policy: keep last N tasks, auto-delete older ones', status: 'todo' }
            ],
            before: {
                metric: 'All 15 pipeline steps share hardcoded output/ directory — 2 concurrent tasks = data corruption',
                score: 'Robustness: 7.0/10',
                consequence: 'Multi-task concurrency impossible — latter task overwrites former intermediate files; testing requires mocking entire filesystem'
            },
            after: {
                metric: 'Each task isolated in output/{task_id}/ — unlimited concurrent tasks, no cross-task interference',
                score: 'Robustness: 8.5/10',
                unlocks: 'Multi-user / multi-task support — each task has its own sandbox; testing needs no filesystem mocking'
            }
        },

        // --- Architecture: Performance (1 action) ---
        {
            id: 'ARCH-4',
            source: 'architecture-report',
            dimension: 'Performance',
            dimensionZh: '性能',
            title: 'Implement batch task parallelism (≥4 concurrent) for TTS and translation',
            titleZh: '实现批处理任务并行（≥4 并发）用于 TTS 和翻译',
            priority: 'P2',
            phase: 'phase-3',
            estimatedHours: 3,
            status: 'todo',
            dependencies: ['ARCH-3'],
            blocks: [],
            criticalPath: false,
            steps: [
                { id: 'ARCH-4-s1', text: 'Implement ThreadPoolExecutor for TTS batch generation (I/O-bound tasks)', status: 'todo' },
                { id: 'ARCH-4-s2', text: 'Implement asyncio-based concurrent LLM translation calls', status: 'todo' },
                { id: 'ARCH-4-s3', text: 'Add configurable concurrency limit with sensible default (4)', status: 'todo' },
                { id: 'ARCH-4-s4', text: 'Benchmark: compare serial vs parallel for 50-sentence translation + 8-engine TTS', status: 'todo' }
            ],
            before: {
                metric: 'All TTS generation and translation is serial — CPU/IO idle while waiting for single LLM/TTS response',
                score: 'Performance: 6.0/10',
                consequence: 'Translating 500 sentences = 500 sequential LLM calls — pipeline bottleneck is API latency, not throughput'
            },
            after: {
                metric: '≥4 concurrent TTS tasks + ≥4 concurrent LLM calls — pipeline throughput limited by API rate limits, not serial blocking',
                score: 'Performance: 8.0/10',
                unlocks: 'Batch translation time reduced ~3x — 500 sentences processed in parallel batches of 4, not one at a time'
            }
        },

        // --- Architecture: Security (1 action) ---
        {
            id: 'ARCH-10',
            source: 'architecture-report',
            dimension: 'Security',
            dimensionZh: '安全性',
            title: 'Add basic Streamlit authentication (password-protected access)',
            titleZh: '添加基础 Streamlit 认证（密码保护访问）',
            priority: 'P2',
            phase: 'phase-3',
            estimatedHours: 1.5,
            status: 'todo',
            dependencies: ['ARCH-9'],
            blocks: [],
            criticalPath: false,
            steps: [
                { id: 'ARCH-10-s1', text: 'Implement simple password gate using Streamlit session state', status: 'todo' },
                { id: 'ARCH-10-s2', text: 'Add rate limiting for failed login attempts', status: 'todo' },
                { id: 'ARCH-10-s3', text: 'Document: "This is basic auth — for production, put Streamlit behind nginx with OAuth"', status: 'todo' }
            ],
            before: {
                metric: 'Streamlit app accessible without authentication — anyone with the URL can access the full UI and trigger pipeline runs',
                score: 'Security: 4.0/10',
                consequence: 'Open access means anyone can consume API credits (LLM + TTS) through the web UI — no access control'
            },
            after: {
                metric: 'Password-gated access with rate-limited login attempts — casual unauthorized access prevented',
                score: 'Security: 6.0/10',
                unlocks: 'Safe to deploy on internal network — basic access control prevents accidental API credit consumption'
            }
        },

        // ═══════════════════════════════════════════
        // PHASE 4: CONTINUOUS (P3-P4, 10h)
        // ═══════════════════════════════════════════

        // --- Health: Remaining improvements ---
        {
            id: 'A1.3',
            source: 'health-report',
            dimension: 'D1 File Size & Structure',
            dimensionZh: 'D1 文件规模与结构',
            title: 'Monitor and reduce oversized file count from 7 to ≤3 (≤250 lines target)',
            titleZh: '监控并减少超标文件数：从 7 个降至 ≤3 个（≤250 行目标）',
            priority: 'P3-P4',
            phase: 'phase-4',
            estimatedHours: 2,
            status: 'todo',
            dependencies: ['A1.1', 'A1.2'],
            blocks: [],
            criticalPath: false,
            steps: [
                { id: 'A1.3-s1', text: 'Review remaining oversized files (st.py, install.py, setup_env.py, download_video_section.py, sf_fishtts.py)', status: 'todo' },
                { id: 'A1.3-s2', text: 'Apply SRP extraction to files still >250 lines after Phase 1-2 refactors', status: 'todo' }
            ],
            before: {
                metric: '7/63 files >250 lines (11.1%) — target <5%',
                score: 'D1: 40/100 (D)',
                consequence: 'Oversized files concentrate too many responsibilities — every change risks unintended side effects'
            },
            after: {
                metric: '≤3/63 files >250 lines (4.8%) — within target range',
                score: 'D1: 75/100 (B→A)',
                unlocks: 'File size distribution is healthy — large files are genuinely complex, not bloated'
            }
        },
        {
            id: 'A2.4',
            source: 'health-report',
            dimension: 'D2 Code Duplication',
            dimensionZh: 'D2 代码重复率',
            title: 'Eliminate DR-4: TTS backend file write pattern duplication (~20 lines)',
            titleZh: '消除 DR-4：TTS 后端文件写入模式重复（~20 行）',
            priority: 'P3-P4',
            phase: 'phase-4',
            estimatedHours: 1,
            status: 'todo',
            dependencies: ['A2.1', 'ARCH-1'],
            blocks: [],
            criticalPath: false,
            steps: [
                { id: 'A2.4-s1', text: 'Extract common TTS file write pattern into audio_utils.py write_audio_file()', status: 'todo' },
                { id: 'A2.4-s2', text: 'Update all 8 TTS backends to use shared write function', status: 'todo' }
            ],
            before: {
                metric: 'TTS file write pattern duplicated across 8 backends — ~20 lines × 8 = ~160 lines of near-identical code (DR-4)',
                score: 'D2: 35/100 (D)',
                consequence: 'Changing audio output format requires updating 8 files — or more likely, only some get updated'
            },
            after: {
                metric: '1 shared write_audio_file() — DR-4 resolved, ~140 lines eliminated across 8 backends',
                score: 'D2: 65/100 (B)',
                unlocks: 'Audio output format is a single configuration point — all backends write identically'
            }
        },
        {
            id: 'A5.3',
            source: 'health-report',
            dimension: 'D5 Function Length & Responsibility',
            dimensionZh: 'D5 函数长度与职责',
            title: 'Reduce long functions (50-100 lines) from 6 to ≤3',
            titleZh: '将长函数（50-100 行）从 6 个降至 ≤3 个',
            priority: 'P3-P4',
            phase: 'phase-4',
            estimatedHours: 2,
            status: 'todo',
            dependencies: ['A5.1', 'A5.2'],
            blocks: [],
            criticalPath: false,
            steps: [
                { id: 'A5.3-s1', text: 'Review the 6 functions in the 50-100 line range after Phase 1-2 refactors', status: 'todo' },
                { id: 'A5.3-s2', text: 'Apply extract-till-you-drop to functions still >50 lines', status: 'todo' }
            ],
            before: {
                metric: '6 functions in 50-100 line range (target <3) — long tail after top-2 are fixed',
                score: 'D5: 38/100 (D)',
                consequence: 'Medium-long functions are the hardest to review — long enough to have hidden complexity, short enough to not seem urgent'
            },
            after: {
                metric: '≤3 functions in 50-100 line range, average function length ≤25 lines',
                score: 'D5: 70/100 (B)',
                unlocks: 'Function length distribution is healthy — every function fits on one screen'
            }
        },
        {
            id: 'A6.3',
            source: 'health-report',
            dimension: 'D6 Comments & Documentation',
            dimensionZh: 'D6 注释与文档化',
            title: 'Increase function docstring coverage from 10.7% to ≥60% (140→140+ functions)',
            titleZh: '将函数 docstring 覆盖率从 10.7% 提升至 ≥60%（从 25 个增加到 140+ 个函数）',
            priority: 'P3-P4',
            phase: 'phase-4',
            estimatedHours: 5,
            status: 'todo',
            dependencies: ['A6.1', 'A6.2'],
            blocks: [],
            criticalPath: false,
            steps: [
                { id: 'A6.3-s1', text: 'Prioritize: docstring public API functions first, then internal pipeline steps', status: 'todo' },
                { id: 'A6.3-s2', text: 'Add docstrings with Parameters/Returns/Raises sections to top 100 functions', status: 'todo' },
                { id: 'A6.3-s3', text: 'Add CI rule: new functions without docstrings get a PR comment (not block)', status: 'todo' }
            ],
            before: {
                metric: '25/234 functions have docstrings (10.7%) — 90% of functions lack parameter/return documentation',
                score: 'D6: 30/100 (D)',
                consequence: 'Function usage requires reading the implementation — no IDE hover docs, no auto-generated API reference possible'
            },
            after: {
                metric: '≥140/234 functions have docstrings (≥60%) — all public API and pipeline functions documented',
                score: 'D6: 75/100 (B→A)',
                unlocks: 'IDE hover docs work across the codebase — auto-generated API reference is now feasible'
            }
        },
        {
            id: 'A4.4',
            source: 'health-report',
            dimension: 'D4 Nesting Depth & Cyclomatic Complexity',
            dimensionZh: 'D4 嵌套深度与圈复杂度',
            title: 'Reduce medium-nesting files (4-5 levels) from 18 to ≤12 (from 28.6% to ≤20%)',
            titleZh: '将中等嵌套文件（4-5 层）从 18 个降至 ≤12 个（从 28.6% 降至 ≤20%）',
            priority: 'P3-P4',
            phase: 'phase-4',
            estimatedHours: 2,
            status: 'todo',
            dependencies: ['A4.1', 'A4.2', 'A4.3'],
            blocks: [],
            criticalPath: false,
            steps: [
                { id: 'A4.4-s1', text: 'Audit 18 files with 4-5 nesting levels — identify top 6 candidates for guard clause refactor', status: 'todo' },
                { id: 'A4.4-s2', text: 'Apply early-return and extract-method patterns to reduce nesting', status: 'todo' }
            ],
            before: {
                metric: '18/63 files have 4-5 nesting levels (28.6%) — target ≤20%',
                score: 'D4: 42/100 (D+)',
                consequence: 'Medium-nesting files are the "silent complexity" — not bad enough to refactor urgently, but cumulatively high cognitive load'
            },
            after: {
                metric: '≤12/63 files have 4-5 nesting levels (≤19%) — within target range',
                score: 'D4: 75/100 (B→A)',
                unlocks: 'Codebase nesting profile is healthy — deep nesting is truly exceptional, not the norm'
            }
        }
    ]
};
