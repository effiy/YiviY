---
name: rui-demos
description: >
  Generate interactive scene demonstration pages from rui-scene card data.
  Direct scenario→demo mapping for 15+ project types. Analyze YrySceneCard
  data structures and produce self-contained 4-file demo pages — each
  showcasing a feature in action with type-specific interactivity (Tool
  Interface, Pipeline, Comparison, State Machine, Dashboard, Walkthrough).
  Use when the user wants demo pages, feature showcases, interactive
  demonstrations, or scene HTML pages from cards. "演示页面", "demo pages",
  "场景效果", "feature demos", "交互演示".
lifecycle: default-pipeline
---

# Rui Demos

Generate interactive scene demonstration pages from rui-scene card data — one demo directory per card, each containing four modular files: `index.html`, `index.js`, `index.css`, `data.js`.

For creating card data, see **[[rui-scene]]**. For documentation page generation, see **[[rui-html]]**. For graph visualization from cards, see **[[rui-graph]]**. For architecture diagrams, see **[[rui-diagram]]**.

```
rui-scene card data → Phase 0: Discovery → Phase 1: Classify → Phase 2: Scaffold → Phase 3: Content → Phase 4: Integrate → Phase 5: Validate
     (data.js)          (resolve source)    (type + concept)   (4-file skeleton)  (fill placeholders)  (index + paths)    (inline validator)
```

## What This Skill Does

Takes rui-scene card data (the `YrySceneCard` props objects found in `INTRO_CONFIG`, `data.js` files, or inline card arrays) and generates a self-contained 4-file demo directory for each card:

- **`index.html`** — HTML structure: three-area layout, CDN references, Vue template directives
- **`index.js`** — Vue 3 app: reactive data, methods, computed, card mounting, lifecycle
- **`index.css`** — Demo styles: layout, type-specific, responsive; all using `--yry-*` variables
- **`data.js`** — Card data (`DEMO_CARD_DATA`) + mock data (`DEMO_MOCK_DATA`) + metadata

Each demo directory is a scene: a focused, interactive showcase of one tool or feature. The card provides context; the demo area provides the hands-on experience.

### Key Design Decisions

- **4 files, not 1** — follows the project's canonical pattern (`index.html` + `index.js` + `index.css` + `data.js`) used by every component under `docs/components/`
- **Scene-colocated** — demos live under `docs/components/<scene>/demos/<demo-slug>/`, colocated with the scene they showcase
- **Phase-based pipeline** — 5 gated phases with intermediate artifacts, inspired by understand-anything's methodology
- **Deterministic validation** — inline Node.js validation script enforces structural correctness (no hardcoded colors, CDN paths resolve, all 4 files present)
- **Subagent parallelism** — for 3+ demos, up to 5 concurrent subagents fill in content in parallel

## 4-File Output Structure

Every generated demo directory contains exactly these four files:

```
docs/components/<scene>/demos/<demo-slug>/
├── index.html    # HTML structure + CDN refs + Vue template
├── index.js      # Vue 3 app + card mounting IIFE
├── index.css     # All styles (base + type-specific + responsive)
└── data.js       # DEMO_CARD_DATA + DEMO_MOCK_DATA + _meta
```

### File Content Map

| File | Contains | Scaffold Template |
|------|----------|-------------------|
| `index.html` | DOCTYPE, viewport, `<link>`/`<script>` CDN refs, three-area layout DIVs, Vue directives | `assets/scaffold-index.html` |
| `index.js` | Card mounting IIFE, `Vue.createApp()` with `data`/`methods`/`computed`/`mounted`/`beforeUnmount` | `assets/scaffold-index.js` |
| `index.css` | Reset, body, layout, common elements, type-specific styles, responsive breakpoints | `assets/scaffold-index.css` |
| `data.js` | `window.DEMO_CARD_DATA` (YrySceneCard props), `window.DEMO_MOCK_DATA` (simulated state), `_meta` | `assets/scaffold-data.js` |

### CDN Path Resolution

From `docs/components/<scene>/demos/<slug>/index.html`, all CDN paths use 4-level relative references:

```
../../../../cdn/theme/{name}.css          → docs/cdn/theme/{name}.css
../../../../cdn/yry-scene-card/index.js  → docs/cdn/yry-scene-card/index.js
```

The scene's own `data.js` (if needed as a card source reference) is at `../../data.js` (2 levels up).

### The Three-Area Layout (in `index.html`)

1. **Card Area** (top) — `<section class="card-area"><div id="scene-card"></div></section>`. Populated by `YrySceneCard.mount()` in `index.js`. The card serves as the page's identity and a gateway back to the main docs. **Never use raw Vue templates (`{{ }}`) in the card area** — it is outside the Vue mount point (`#demo-app`) and will render as raw text.

2. **Demo Area** (middle) — `<section class="demo-area" id="demo-app">` with Vue template directives. This is where the feature comes alive — interactive, illustrative, self-explanatory. The Vue app mounts only to `#demo-app`.

3. **Info Area** (bottom) — `<section class="info-area">` with brief text explaining what the demo demonstrates, plus a standard navigation link row. Always include links to:
   - Pipeline diagram: `../../diagram/index.html` (if viewer has one)
   - Source graph: `../../graph/index.html` (if viewer has one)
   - All demos: `../index.html`
   - Docs home: `../../../../index.html`

### Standalone Demo Pattern (`views/<name>/demos/`)

When demos live under `docs/views/<name>/demos/<slug>/` (not under `docs/components/`), they are standalone pages with no `data-include` or `mountDocComponent` dependency. This pattern is used for feature-specific demos (e.g., yt-dlp tool demo, graph viewer).

Full code templates: see `references/standalone-demo-pattern.md` (CDN path resolution, manual i18n, YrySceneCard standalone mount, config structure).

## Decision Tree

```
User has card data and wants to generate demo pages...

├─ External tool cards (yt-dlp, WhisperX, Streamlit)
│  → Type A: Tool Interface Demo — mock UI + interactive simulation
│
├─ Pipeline/algorithm cards (NLP Split, 3-Step T-R-A)
│  → Type B: Pipeline Visualization — step-by-step animated flow
│
├─ Quality/comparison cards (Netflix 1-Line, Multi-TTS, i18n)
│  → Type C: Comparison Showcase — side-by-side before/after or A/B
│
├─ Control/state cards (Task Control, Resume, Model Picker)
│  → Type D: State Machine Demo — interactive state transitions
│
├─ Report cards (Code Health, Architecture)
│  → Type E: Dashboard Demo — metric cards + interactive charts
│
├─ Nav/guide cards (Quick Start, Configuration, Troubleshooting)
│  → Type F: Guide Walkthrough — step-by-step interactive tutorial
│
└─ Mixed batch (multiple types in one generation run)
   → Group by type → parallel subagents → per-scene index page
```

## Scenario → Demo 快速映射

**"我的项目里有什么 → 应该生成什么演示"** — 按项目场景直接找到对应 Demo 类型。

| 项目场景 | 卡片特征 | Demo 类型 | 演示效果 | 一句话描述 |
|----------|----------|-----------|----------|-----------|
| 🎬 视频下载工具 | ext links 3+, badge: OSS | **Type A** 工具界面 | 输入URL→进度条→结果 | "让用户'试用'这个工具" |
| 🔊 语音转文字 | ext links 3+, desc 含 "transcribe" | **Type A** 工具界面 | 上传模拟→转录进度→文本输出 | "模拟工具的实际使用流程" |
| 🧠 AI 分句管线 | purple tag, desc 含 "pipeline/steps" | **Type B** 管线可视化 | 步骤节点→自动播放→中间态 | "展示数据流经各阶段的动画" |
| 🔄 三步骤翻译 | purple tag, desc 含 "3-Step" | **Type B** 管线可视化 | 3步流→每步展开→翻译对比 | "每步可点击查看细节" |
| 🎙️ 多引擎 TTS | count tags ("6 engines"), desc 列引擎 | **Type C** 对比展示 | 引擎标签页→对比表→高亮最优 | "并排对比各引擎效果" |
| 🌍 多语言翻译 | count tags ("4 languages"), 语言列表 | **Type C** 对比展示 | 语言切换→翻译对比→质量评分 | "一键切换语言看翻译质量" |
| ⏯️ 任务控制 | tags "real-time"/"3 states" | **Type D** 状态机 | 状态图→点击转换→操作日志 | "模拟状态流转和操作" |
| 🔍 智能搜索 | desc 含 "auto-fetch"/"实时" | **Type D** 状态机 | 搜索框→状态变化→结果面板 | "展示搜索的实时状态变化" |
| 📊 代码健康报告 | badge: 'Report', tags 含分数 | **Type E** 仪表盘 | 评分卡→雷达图→改进建议 | "可视化报告的所有指标" |
| 🏗️ 架构评估 | badge: 'Report', meta 含 ATAM | **Type E** 仪表盘 | 维度分→对比基准→建议展开 | "架构评估一目了然" |
| 🚀 快速开始指南 | badge: 'Guide', tags "5 min" | **Type F** 引导教程 | 步骤点→代码块→复制按钮 | "3-5步带用户走完入门" |
| ⚙️ 配置指南 | badge: 'Guide', nameHref #config | **Type F** 引导教程 | 配置步骤→代码块→预期结果 | "可复制的配置代码" |
| 🔌 插件/扩展 | ext links 1-2, 技术标签 | **Type A** 工具界面 | 配置面板→启用开关→效果预览 | "展示插件的功能和配置" |
| 📈 性能基准 | count tags "10 benchmarks" | **Type C** 对比展示 | 基准表格→排序→高亮 | "交互式查看性能数据" |
| 🔐 认证流程 | desc 含 "OAuth"/"JWT"/"login" | **Type B** 管线可视化 | 认证步骤流→每步说明→代码 | "展示认证的完整流程" |

## Demo Types Reference

See `references/demo-types.md` for the full specification of each type (A–F), including the expected DOM structure, Vue app template, interactivity requirements, mock data shapes, and examples.

### Quick Reference

| Type | Card Signal | Demo Area | Interactivity |
|------|-------------|-----------|---------------|
| **A: Tool Interface** | External links (3+ custom), badge: none/OSS | Simulated tool UI with inputs + outputs | User provides input → simulated processing → result |
| **B: Pipeline** | Tags with `purple` modifier, desc mentions stages/steps | Step-by-step animated flow diagram | Click each step to expand details, auto-play sequence |
| **C: Comparison** | Tags with counts ("6 engines", "4 languages"), desc mentions comparison | Side-by-side panels showing variants | Switch variants, highlight differences |
| **D: State Machine** | Tags with "real-time", "3 states", "checkpoint" | Interactive state transition diagram | Click to trigger state changes, see transitions |
| **E: Dashboard** | Badge: 'Report', tags with scores, counts | Metric cards + chart visualizations | Hover for details, toggle dimensions |
| **F: Guide** | Badge: 'Guide', nameHref with `#fragment` | Step-by-step walkthrough with code snippets | Click through steps, copy code |

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Vue 3 (`unpkg.com/vue@3`) | Zero build, `file://` URLs work, reactive templates |
| Theme | `cdn/theme/{name}.css` — 10 presets | One `<link>` switches entire color scheme; default to Modern Minimalist |
| Component | `yry-scene-card` (CDN) | Renders the card consistently with the main docs |
| Styling | `index.css` + theme CSS variables (`--yry-*`) | 4-file separation, no build tooling, inherits theme |
| Animations | CSS `@keyframes` + Vue `Transition` | Lightweight, no extra dependencies |
| Icons | Inline SVG or emoji | Zero dependencies, consistent with card design language |
| Charts | Chart.js 4 (CDN, Type E only) | Dashboard demos need data visualization |
| Layout | CSS Grid + Flexbox | Responsive without framework overhead |

---

## Phase 0: Discovery

**Purpose**: Resolve the card data source and determine scope before any generation begins. This is the gate check — if card data cannot be found or is malformed, stop here.

### Steps

1. **Identify the card data source.** Accept flexible input:
   - A **scene name** (e.g., `"intro"`) — reads `docs/components/intro/data.js` and uses cards from `INTRO_CONFIG.en.overview.features` and/or `INTRO_CONFIG.en.cards`
   - A **path to a data.js file** — reads the file and extracts card arrays
   - An **inline card object** — a single `YrySceneCard` props object
   - An **inline array of cards** — multiple card objects
   - A **key path** — e.g., `"INTRO_CONFIG.en.overview.features"` to extract a specific array from a known config

2. **Read and validate card data.** Each card must have at minimum `name` and `desc` fields. Report any cards that fail validation and exclude them.

3. **Determine output base.** For a scene named `"intro"`, output goes to `docs/components/intro/demos/`. Rule: scene name → `docs/components/<scene>/demos/`. If the scene directory does not contain at minimum `index.html` and `data.js`, ask the user to confirm or specify a different scene.

4. **Check for existing demos.** List any existing directories under `docs/components/<scene>/demos/`. If demos already exist for some cards, ask the user:
   > "Found existing demos for: <list>. Would you like to **(s)** skip these cards, **(o)** overwrite them, or **(u)** update them (keep existing where card data hasn't changed)?"

5. **Gate check: scope.** If more than 5 cards are being generated, inform the user of the scope and suggest they confirm before proceeding. This prevents runaway generation.

6. **Resolve language.** If the card source is a multi-language config (like `INTRO_CONFIG` with `en` and `zh-CN`):
   - Default to `en` for card data (tags, badge, meta are language-agnostic; only `name` and `desc` vary)
   - Ask the user which language to use for demo UI text

7. **Query rui-ui for design intelligence** (recommended):
   ```bash
   python3 <rui-ui-dir>/scripts/search.py "<scene description>" --design-system
   ```
   Use the returned color palette, typography pairing, and style category to inform the theme selection and demo styling. This ensures demos are visually coherent and accessibility-aware. The recommended style and colors are stored in `_demo-plan.json`.

### Intermediate Artifact

Write a `_demo-plan.json` to the output base directory:

```json
{
  "sceneName": "intro",
  "outputBase": "docs/components/intro/demos",
  "cardSource": "INTRO_CONFIG.en.overview.features",
  "language": "en",
  "theme": "modern-minimalist",
  "existingDemos": ["yt-dlp"],
  "cards": [
    {
      "name": "NLP Split",
      "desc": "NLP and AI-powered subtitle segmentation...",
      "tags": [{"text": "AI-driven", "modifier": "purple"}, ...],
      "badge": "Core",
      "links": null,
      "nameHref": "views/.../index.html"
    }
  ]
}
```

---

## Phase 1: Classification & Concept

**Purpose**: Classify each card by demo type and design a demo concept. This is the **approval gate** — no HTML/CSS/JS is generated until the user confirms the plan.

### Steps

1. **For each card, extract classification signals** using the table in `references/demo-types.md`:
   - `tags` — modifiers (`purple` → pipeline, `warn` → score/dashboard, `cyan` → count/comparison)
   - `links` — custom array (external tool), `null` (internal feature), `[]` (no links)
   - `badge` — `'Report'` → dashboard, `'Guide'` → walkthrough, `'Core'` → feature
   - `desc` — keywords: "pipeline"/"steps" → B, "comparison"/"engines"/"languages" → C, "real-time"/"state" → D
   - `nameHref` — `#fragment` → guide, external URL → tool

2. **Apply tie-breaking priority** when a card matches multiple types:
   1. **E (Dashboard)** if `badge === 'Report'`
   2. **F (Walkthrough)** if `badge === 'Guide'`
   3. **A (Tool Interface)** if `links` is custom array with external URLs
   4. **D (State Machine)** if the card is about controlling/managing
   5. **B (Pipeline)** if `purple` tag present or desc mentions process steps
   6. **C (Comparison)** if tag count > 2 variants — fallback

3. **Generate a demo concept** for each card — a 2-3 sentence description of what the interactive demo will show and the key interaction:
   - What is the **core capability**? Demo that, not the settings.
   - What would a user **do** with this feature? Make that action the demo.
   - What's the **simplest possible interaction** that illustrates the value? Start there.

4. **Derive demo slugs** from card names: lowercase, hyphenated, ASCII-safe. For Chinese card names, use the English equivalent or a short slug.

5. **Present classification and concepts** to the user as a table:

   ```
   | Card | Type | Slug | Concept | Warnings |
   |------|------|------|---------|----------|
   | 🎥 yt-dlp | A (Tool) | yt-dlp | Paste URL → progress bar → mock video info + subtitles | |
   | 📝 NLP Split | B (Pipeline) | nlp-split | Sample text → animated sentence detection → split output | |
   | 📊 Code Health | E (Dashboard) | code-health | Score gauge + radar chart + expandable recommendations | |
   ```

   **Wait for user confirmation before proceeding to Phase 2.** If the user wants to change classifications or concepts, iterate here.

6. **Error handling**: If a card cannot be classified (no signals match), assign Type B (Pipeline) as the default fallback and mark it with a warning. Always complete classification for all cards rather than failing on one ambiguous card.

### Intermediate Artifact

Write a `_batch-plan.json` to the output base directory:

```json
{
  "sceneName": "intro",
  "outputBase": "docs/components/intro/demos",
  "language": "en",
  "theme": "modern-minimalist",
  "cards": [
    {
      "cardData": { "name": "🎥 yt-dlp", "desc": "...", "tags": [...], ... },
      "demoSlug": "yt-dlp",
      "demoType": "A",
      "demoTypeLabel": "Tool Interface Demo",
      "concept": "Simulated yt-dlp tool interface where user pastes a URL, sees staged download progress, and gets mock video info with subtitle extraction results.",
      "warnings": []
    }
  ]
}
```

---

## Phase 2: Scaffold

**Purpose**: Generate the 4-file structural skeleton for each demo. This phase produces **structure-only** files with `__PLACEHOLDER__` markers — no creative content yet. The scaffold guarantees correct file anatomy before creative work begins.

### Steps

1. **For each demo in `_batch-plan.json`**, create the output directory `docs/components/<scene>/demos/<demoSlug>/`.

2. **Generate the four files** using the scaffold templates at `assets/`:

   - **`index.html`** — Use `assets/scaffold-index.html`. Fill in structural placeholders:
     - `__CARD_NAME__` — card name for `<title>`
     - `__CARD_DESC_SNIPPET__` — short plain-text description for `<meta name="description">`
     - `__THEME_NAME__` — e.g., `"modern-minimalist"`
     - `__CHARTJS_CDN__` — `<script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>` for Type E, commented out otherwise
     - Keep `__DEMO_HTML__` and `__INFO_HTML__` as placeholders for Phase 3

   - **`index.js`** — Use `assets/scaffold-index.js`. Fill in structural placeholders:
     - `__CARD_NAME__`, `__DEMO_TYPE_LABEL__`, `__DEMO_INTERACTIVITY_DESC__` (from concept)
     - Keep `__DEMO_DATA__`, `__DEMO_METHODS__`, `__DEMO_COMPUTED__`, `__DEMO_MOUNTED__`, `__DEMO_BEFORE_UNMOUNT__` as placeholders for Phase 3

   - **`index.css`** — Use `assets/scaffold-index.css`. Keep `__TYPE_SPECIFIC_STYLES__`, `__RESPONSIVE_768__`, `__RESPONSIVE_375__` as placeholders for Phase 3.

   - **`data.js`** — Use `assets/scaffold-data.js`. Fill in:
     - `__CARD_DATA_JSON__` — the complete card data object as JSON (this is structural, not placeholder)
     - `__DEMO_SLUG__`, `__DEMO_TYPE__`, `__SCENE_NAME__`, `__GENERATED_AT__` — metadata
     - Keep `__MOCK_DATA_JSON__` as placeholder for Phase 3

3. **Validate the scaffold** before proceeding:
   - All 4 files exist in each demo directory
   - `index.html` has valid HTML5 structure (DOCTYPE, charset, viewport)
   - CDN paths resolve correctly (check that `../../../../cdn/theme/{name}.css` exists on disk)
   - `index.js` contains a valid `Vue.createApp()` call structure
   - `data.js` contains a valid `window.DEMO_CARD_DATA` assignment

4. **Gate check**: If CDN paths do not resolve (theme or yry-scene-card not found), report an error and suggest the user verify the CDN directory. Do not proceed to Phase 3 with broken paths.

### Progress Reporting

```
[Phase 2/5] Generating scaffolds...
  Created scaffold for yt-dlp (Type A) at docs/components/intro/demos/yt-dlp/
  Created scaffold for nlp-split (Type B) at docs/components/intro/demos/nlp-split/
  ...
Phase 2 complete. 4 scaffolds generated. All CDN paths verified.
```

---

## Phase 3: Content Generation

**Purpose**: Fill in the `__PLACEHOLDER__` markers across all four files with type-specific creative content. This is where the demo comes alive.

### Generation Strategy

| Number of Demos | Strategy |
|----------------|----------|
| 1–2 | Inline generation — fill placeholders sequentially |
| 3+ | Parallel subagents — dispatch up to 5 concurrent agents, one per demo |

### For 1–2 Demos (Inline)

For each demo, fill in the placeholders across all four files following the type specification in `references/demo-types.md`:

- **`index.html`** — Replace `__DEMO_HTML__` with the type-specific DOM structure (input groups, pipeline nodes, variant tabs, state diagram, metric cards, code blocks). Replace `__INFO_HTML__` with a brief explanation, back link, and source links.
- **`index.js`** — Replace `__DEMO_DATA__` with reactive state referencing `mockData`. Replace `__DEMO_METHODS__` with type-specific methods. Replace `__DEMO_COMPUTED__` with computed properties where needed. Replace `__DEMO_MOUNTED__` with initialization (e.g., Chart.js setup for Type E). Replace `__DEMO_BEFORE_UNMOUNT__` with cleanup (timers, chart instances).
- **`index.css`** — Replace `__TYPE_SPECIFIC_STYLES__` with type-specific CSS. Replace `__RESPONSIVE_768__` and `__RESPONSIVE_375__` with responsive adjustments.
- **`data.js`** — Replace `__MOCK_DATA_JSON__` with the mock data object following the type's Mock Data Shape from `demo-types.md`.

### For 3+ Demos (Subagent Parallelism)

Dispatch one subagent per demo (up to 5 concurrently). Each subagent receives:

> **Subagent dispatch template:**
>
> Generate the demo content for this card by filling in placeholders across all four files.
>
> **Card data:**
> ```json
> <cardData JSON from _batch-plan.json>
> ```
>
> **Demo type:** `<demoType>` — `<demoTypeLabel>`
> **Concept:** `<concept>`
> **Output directory:** `docs/components/<scene>/demos/<demoSlug>/`
>
> **Type specification** (from `references/demo-types.md`):
> ```
> <paste the relevant type section for this demo type>
> ```
>
> **Theme variables reference** (from `references/theme-variables.md`):
> ```
> <paste the theme variables reference>
> ```
>
> **Task:** Read the four scaffold files at the output directory. Each contains `__PLACEHOLDER__` markers. Fill in every placeholder with type-specific content following the type specification. Key rules:
> - All colors use `var(--yry-*)` — zero hardcoded hex values
> - All data is simulated client-side (no `fetch()`)
> - Vue app references `window.DEMO_MOCK_DATA` for initial state
> - Timers are cleaned up in `beforeUnmount()`
> - At least one interactive element is present
> - Responsive layout works at 375px+
> - Card mounts via `YrySceneCard.mount()` (already in scaffold)

### Error Handling

- **Retry once**: If a subagent fails, retry with the same prompt plus additional context about the failure.
- **Skip with warning**: If the retry also fails, mark that demo as "partial", save whatever was generated, and continue with the remaining demos.
- **Always save partial results**: A demo with scaffold + partial content is better than no demo.
- **Track all warnings** for the Phase 5 final report.

### Progress Reporting

```
[Phase 3/5] Filling in demo content (up to 5 concurrent)...
  Generating batch 1/3: yt-dlp ✓, whisperx ✓, nlp-split ✓, term-base ✓
  Generating batch 2/3: 3-step-tra ✓, netflix-1line ✓, multi-tts ✓, streamlit-ui ⚠ (retrying...)
  Generating batch 3/3: i18n ✓, resume ✓, model-picker ✓, task-control ✓
Phase 3 complete. 12 demos generated (0 failed, 1 warning: streamlit-ui retry succeeded with delayed mock data).
```

---

## Phase 4: Integration

**Purpose**: Wire everything together — generate the scene-scoped demo index, verify cross-references, and ensure CDN paths resolve.

### Steps

1. **Generate or update the scene-scoped demo index** at `docs/components/<scene>/demos/index.html`:
   - Use the template at `assets/demo-index.html`
   - Fill in `__SCENE_NAME__` and `__THEME_NAME__`
   - Fill in `__DEMOS_DATA__` with a JSON array of demo entries extracted from `_batch-plan.json`:
     ```javascript
     [
       { slug: "yt-dlp", type: "A", typeLabel: "🛠️ Tool Demo", name: "🎥 yt-dlp", href: "yt-dlp/index.html", desc: "...", tags: ["1.2k sites", "Python"] },
       ...
     ]
     ```
   - Each entry's `tags` is a flat array of strings (just the tag text, not the full tag objects)

2. **Verify CDN paths** for every generated file. Check that relative paths from each `index.html` reach existing files on disk for theme CSS and yry-scene-card script.

3. **If generating demos for multiple scenes**, also update or create the global demo aggregator at `docs/views/demos/index.html` that links to each scene's demo index. This is secondary — the per-scene index is primary.

### Progress Reporting

```
[Phase 4/5] Integrating...
  Updated demo index at docs/components/intro/demos/index.html (12 demos linked)
  Verified CDN paths for all 12 demos.
Phase 4 complete. All demos integrated.
```

---

## Phase 5: Validate & Test

**Purpose**: Deterministic validation of all generated demos followed by automated browser testing and a final summary report.

### Steps

#### 5a: Structural Validation (inline Node.js)

Uses the existing inline validator to check file structure, CDN resolution, and code quality.

1. **Write and execute the inline validation script.** This script checks every demo directory for structural correctness:

```javascript
#!/usr/bin/env node
/**
 * rui-demos inline validator — Phase 5
 * Checks structural correctness of generated demo files.
 * Usage: node validate.js <outputBase>
 */
const fs = require('fs');
const path = require('path');

const outputBase = process.argv[2];
if (!outputBase || !fs.statSync(outputBase).isDirectory()) {
    console.error('Error: outputBase must be a directory');
    process.exit(1);
}

const issues = [], warnings = [];
const demoDirs = fs.readdirSync(outputBase, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('_') && !d.name.startsWith('.'));

if (demoDirs.length === 0) {
    issues.push('No demo directories found');
}

for (const dir of demoDirs) {
    const demoPath = path.join(outputBase, dir.name);
    const requiredFiles = ['index.html', 'index.js', 'index.css', 'data.js'];

    // Check all 4 files exist
    for (const file of requiredFiles) {
        const filePath = path.join(demoPath, file);
        if (!fs.existsSync(filePath)) {
            issues.push(`${dir.name}: missing ${file}`);
        }
    }

    // Read files if they exist
    const htmlPath = path.join(demoPath, 'index.html');
    const cssPath = path.join(demoPath, 'index.css');
    const jsPath = path.join(demoPath, 'index.js');
    const dataPath = path.join(demoPath, 'data.js');

    let html = '', css = '', js = '', data = '';

    try { html = fs.readFileSync(htmlPath, 'utf8'); } catch(e) {}
    try { css = fs.readFileSync(cssPath, 'utf8'); } catch(e) {}
    try { js = fs.readFileSync(jsPath, 'utf8'); } catch(e) {}
    try { data = fs.readFileSync(dataPath, 'utf8'); } catch(e) {}

    // Check index.html structure
    if (html) {
        if (!/<!DOCTYPE html>/i.test(html)) issues.push(`${dir.name}/index.html: missing DOCTYPE`);
        if (!/<meta[^>]+viewport/.test(html)) issues.push(`${dir.name}/index.html: missing viewport meta`);
        if (!/<link[^>]+cdn\/theme/.test(html)) issues.push(`${dir.name}/index.html: missing theme <link>`);
        if (!/unpkg\.com\/vue@3/.test(html)) issues.push(`${dir.name}/index.html: missing Vue 3 CDN`);
        if (!/yry-scene-card/.test(html)) issues.push(`${dir.name}/index.html: missing yry-scene-card CDN`);
        if (!/id="scene-card"/.test(html)) issues.push(`${dir.name}/index.html: missing #scene-card`);
        if (!/id="demo-app"/.test(html)) issues.push(`${dir.name}/index.html: missing #demo-app`);
        if (!/<link[^>]+index\.css/.test(html)) issues.push(`${dir.name}/index.html: missing index.css <link>`);
        if (!/<script[^>]+data\.js/.test(html)) issues.push(`${dir.name}/index.html: missing data.js <script>`);
        if (!/<script[^>]+index\.js/.test(html)) issues.push(`${dir.name}/index.html: missing index.js <script>`);
        if (/__[A-Z_]+__/.test(html)) {
            const unfilled = html.match(/__[A-Z_]+__/g);
            issues.push(`${dir.name}/index.html: unfilled placeholders: ${[...new Set(unfilled)].join(', ')}`);
        }
    }

    // Check index.css: no hardcoded hex colors
    if (css) {
        const hexPattern = /(?<!var\(--[\w-]*)\s*#[0-9a-fA-F]{3,6}(?![-\w])/g;
        // Remove comments first
        const cssNoComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
        const hexMatches = cssNoComments.match(hexPattern);
        if (hexMatches) {
            issues.push(`${dir.name}/index.css: hardcoded hex colors found: ${hexMatches.join(', ')}`);
        }
        if (/__[A-Z_]+__/.test(css)) {
            const unfilled = css.match(/__[A-Z_]+__/g);
            issues.push(`${dir.name}/index.css: unfilled placeholders: ${[...new Set(unfilled)].join(', ')}`);
        }
    }

    // Check index.js structure
    if (js) {
        if (!/YrySceneCard\.mount/.test(js)) issues.push(`${dir.name}/index.js: missing YrySceneCard.mount()`);
        if (!/Vue\.createApp/.test(js)) issues.push(`${dir.name}/index.js: missing Vue.createApp()`);
        if (!/\.mount\(['"]#demo-app['"]\)/.test(js)) issues.push(`${dir.name}/index.js: not mounting to #demo-app`);
        if (/fetch\s*\(/.test(js)) issues.push(`${dir.name}/index.js: contains fetch() call`);
        if (/XMLHttpRequest/.test(js)) issues.push(`${dir.name}/index.js: contains XMLHttpRequest`);
        if (/__[A-Z_]+__/.test(js)) {
            const unfilled = js.match(/__[A-Z_]+__/g);
            issues.push(`${dir.name}/index.js: unfilled placeholders: ${[...new Set(unfilled)].join(', ')}`);
        }
    }

    // Check data.js structure
    if (data) {
        if (!/window\.DEMO_CARD_DATA/.test(data)) issues.push(`${dir.name}/data.js: missing DEMO_CARD_DATA`);
        if (!/window\.DEMO_MOCK_DATA/.test(data)) issues.push(`${dir.name}/data.js: missing DEMO_MOCK_DATA`);
        if (!/_meta/.test(data)) issues.push(`${dir.name}/data.js: missing _meta`);
        if (/__[A-Z_]+__/.test(data)) {
            const unfilled = data.match(/__[A-Z_]+__/g).filter(s => s !== '__DEMO_SLUG__' && s !== '__DEMO_TYPE__' && s !== '__SCENE_NAME__' && s !== '__GENERATED_AT__');
            if (unfilled.length > 0) {
                // The _meta fields we fill in Phase 2 are structural and always filled
                issues.push(`${dir.name}/data.js: unfilled placeholders: ${[...new Set(unfilled)].join(', ')}`);
            }
        }
    }

    // Check CDN path resolution
    if (html) {
        const cdnPathPattern = /(\.\.\/)+cdn\/(theme\/[\w-]+\.css|yry-scene-card\/index\.js)/g;
        let match;
        while ((match = cdnPathPattern.exec(html)) !== null) {
            const resolved = path.resolve(demoPath, match[0]);
            if (!fs.existsSync(resolved)) {
                issues.push(`${dir.name}/index.html: CDN path does not resolve: ${match[0]}`);
            }
        }
    }

    // Check that Chart.js is present for Type E
    if (html && /Chart\.js/i.test(html) && !/chart\.js@4/.test(html)) {
        warnings.push(`${dir.name}/index.html: Chart.js reference found but may not be the correct CDN URL`);
    }

    // Warn if no Chart.js for Type E
    if (data && /"demoType":\s*"E"/.test(data) && html && !/chart\.js/.test(html)) {
        issues.push(`${dir.name}: Type E (Dashboard) demo missing Chart.js CDN`);
    }
}

const stats = {
    totalDemos: demoDirs.length,
    totalIssues: issues.length,
    totalWarnings: warnings.length,
};

console.log(JSON.stringify({ issues, warnings, stats }, null, 2));
process.exit(0);
```

2. **Execute the validator:**
   ```bash
   node /tmp/rui-demos-validate.cjs docs/components/<scene>/demos/
   ```

3. **If issues are reported:**
   - Apply automated fixes where possible (fill missing DOCTYPE, fix obvious path errors)
   - Retry validation once after fixes
   - If critical issues remain after one fix attempt, save demos with warnings and report

#### 5b: Browser Verification

Run automated browser tests to catch runtime errors the structural validator cannot detect: open each demo HTML via `file://` and check for console errors, Vue 3 mounting, YrySceneCard rendering, interactive elements, and per-demo screenshots. If any demo fails browser verification, fix and re-run before finalizing.

4. **Run the manual output checklist** from `references/output-checklist.md` for a final quality pass.

5. **Final summary report:**

```
[Phase 5/5] Validating...
  ✓ 12/12 demos pass structural validation
  ✓ 48/48 CDN paths resolve correctly
  ✓ 0 hardcoded hex colors found
  ✓ All placeholders filled
  ✓ 12/12 demos pass browser verification

── Summary ──────────────────────────────────
  Scene:      intro
  Demos:      12 generated (12 pass, 0 warnings)
  Types:      4× A (Tool), 3× B (Pipeline), 3× C (Comparison), 2× D (State Machine)
  Index:      docs/components/intro/demos/index.html

  Output:     docs/components/intro/demos/
              ├── index.html (12 demos linked)
              ├── yt-dlp/index.html + index.js + index.css + data.js
              ├── whisperx/index.html + index.js + index.css + data.js
              └── ... (10 more)
```

---

## Common Bugs & Fixes

Issues observed in real demos and how to prevent/repair them:

| Bug | Root Cause | Fix |
|-----|-----------|-----|
| `{{ card.name }}` rendered as raw text | Card area uses Vue template but is **outside `#demo-app`** mount point | Replace with `<div id="scene-card">` + `YrySceneCard.mount()` |
| Card links show empty labels | `data.js` uses `{ text, href }` but YrySceneCard expects `{ label, href }` | Always use `label` in card link objects |
| `#scene-card` stays empty | `yry-scene-card/index.js` CDN not loaded | Add `<script src="../../../../cdn/yry-scene-card/index.js">` to `<head>` |
| No graph/diagram link in info area | Info links section was not updated after graph/diagram added | Always check for `../../diagram/` and `../../graph/` existence |
| `fetch()` in demo | Demo tries to make real API calls | All data must be simulated via `DEMO_MOCK_DATA`; validator catches `fetch()` |
| Hardcoded hex colors in CSS | Author used `#020617` instead of theme variables | Replace with `var(--yry-bg-primary)`; validator catches hex patterns |

---

## Error Handling

Following understand-anything's pattern, every phase has explicit error handling:

| Situation | Action |
|-----------|--------|
| Card source not found | Report error, **STOP** (Phase 0 gate) |
| Card data malformed | Skip that card, continue with others |
| >5 cards without confirmation | Ask user to confirm scope (Phase 0 gate) |
| Card cannot be classified | Assign Type B default, mark with warning |
| Scaffold CDN paths don't resolve | Report error, **STOP** before content generation (Phase 2 gate) |
| Subagent dispatch fails | Retry once with failure context |
| Subagent fails twice | Mark demo as "partial", save scaffold, continue |
| Validation finds hardcoded colors | Auto-fix if pattern is simple, flag if not |
| Validation finds missing files | Report which files are missing, do not auto-create |

**Core principles:**
- **Retry once, then skip** — never loop indefinitely
- **Always save partial results** — a partial demo is better than no demo
- **Never silently drop errors** — every failure is visible in the final report
- **Gate checks before expensive work** — validate prerequisites before generating content

## Design Principles

### 1. Show, Don't Tell
The card already describes the feature. The demo's job is to **show it working**. A demo that just displays the card again with different CSS is not a demo.

### 2. One Interaction, Done Well
Don't try to demo every capability. Pick the one interaction that best captures the feature's value and execute it well. A single well-designed interactive element beats a cluttered page of half-baked widgets.

### 3. Simulate, Don't Implement
Demos are illustrations, not production features. Use mock data (`DEMO_MOCK_DATA`), simulated delays (`setTimeout`), and simplified logic. The goal is understanding, not functionality.

### 4. Respect the Theme
Every generated page uses `--yry-*` CSS variables from the CDN theme. Never hardcode `#020617` or `#38bdf8` — use `var(--yry-bg-primary)`, `var(--yry-accent)`, etc. The Phase 5 validator enforces this mechanically.

### 5. Cards Are Gateways
The card at the top of the demo page is a gateway — it links to the feature's documentation, source code, and related resources. The demo page complements the card's ecosystem, it doesn't replace it.

### 6. 4-File Separation
Follow the project's canonical pattern: structure in HTML, logic in JS, style in CSS, data in JS. This makes demos maintainable, diffable, and consistent with every other component in the project.

### 7. Language Awareness
When generating demos for a multi-language project:
- Generate one demo per card (not per language)
- Use the card data from the source language (usually `en`)
- Add a language note in the info area if the feature supports i18n
- Demo UI text should match the project's primary language

---

## Key Patterns

These patterns are used across all demo types and should be followed strictly.

### Timer Management

All `setTimeout`/`setInterval` handles must be tracked for cleanup. Never use bare `setTimeout` in Vue methods:

```javascript
// In Vue data():
_timers: [],

// Schedule with tracking
scheduleTimeout: function(fn, delay) {
    var self = this;
    var h = setTimeout(function() {
        var idx = self._timers.indexOf(h);
        if (idx >= 0) self._timers.splice(idx, 1);
        fn();
    }, delay);
    this._timers.push(h);
    return h;
},

// Cleanup
clearAllTimers: function() {
    (this._timers || []).forEach(function(h) { clearTimeout(h); });
    this._timers = [];
},

// In beforeUnmount:
beforeUnmount: function() { this.clearAllTimers(); }
```

### i18n Resolver (Standalone Demos)

Merge cross-language constants with the current language slice. See the [Standalone Demo Pattern](#standalone-demo-pattern-viewsnamedemos) above for full implementation.

### Stage Trace Pattern (Type A + B)

Each pipeline stage carries a `trace` object linking to the code dependency graph:

```javascript
// In data.js progressStages:
{
    pct: 15, delay: 600,
    text: 'Extracting video info...',
    trace: {
        file: 'YoutubeDL.py',           // Display name (shown in UI)
        fileId: 'file:YoutubeDL.py',    // Graph node ID (used for deep-link)
        func: 'extract_info()',         // Display name
        funcId: 'func:extract_info',    // Graph node ID
        desc: 'fetches metadata: title, formats, subtitles'
    }
}
```

### Graph Deep-Link

Trace elements should be clickable, opening the code dependency graph focused on the exact node:

```javascript
// In index.js
graphLink: function(nodeId) {
    if (!nodeId) return '#';
    return '../../graph/index.html?focus=' + encodeURIComponent(nodeId);
}
```

```html
<!-- In index.html -->
<a class="trace-link trace-file"
   :href="graphLink(currentStageInfo.trace.fileId)"
   target="_blank">{{ currentStageInfo.trace.file }}</a>
```

The graph page must handle `?focus=<nodeId>` by centering and highlighting the node on load.

### Pipeline Flow UI (Type A)

Replace simple progress dots with a horizontal stepped timeline:

```html
<div class="pipeline-flow" v-if="processing">
    <div v-for="(stage, i) in stages" class="pf-step"
         :class="{ done: i < currentStage, current: i === currentStage }">
        <div class="pf-dot">
            <span v-if="i < currentStage">✓</span>
            <span v-else-if="i === currentStage" class="pf-spinner"></span>
            <span v-else>{{ i + 1 }}</span>
        </div>
        <div class="pf-label">{{ stage.text }}</div>
    </div>
</div>
```

CSS: connector lines via `::after` pseudo-elements, spinner animation for current step, accent-colored dots for completed steps.

### Config-Driven Options

Move magic numbers to `data.js` config, never hardcode in Vue methods:

```javascript
// data.js — cross-language constants
retryRate: {
    postPipeline: 0.15,
    fragmentStage: 0.2,
    fragmentStageIndex: 3,
    extraDelayMs: 400
},
resolutionSizes: { '4K': '512 MB', '720p': '72 MB', '480p': '24 MB' },
```

## Professional Quality Standards

These rules were distilled from building professional demo suites (see the yt-dlp demos at `docs/views/yt-dlp/demos/` for the canonical 4-demo reference implementation covering Types A, B, C, F).

### Cross-Demo Consistency (Suite Rule)

When building 3+ demos for one scene, they MUST share these traits:

1. **Unified theme**: All demo pages reference the same CDN theme `<link>`. Never mix inline tokens (`--rui-*`) and CDN tokens (`--yry-*`) in the same suite.
2. **Consistent info area**: Every demo's info area has the same 4 standard links (diagram, graph, all demos, docs home). Same order, same emoji prefixes.
3. **Shared CDN scripts**: All demos load the same set of CDN scripts in the same order. The standalone pattern uses: `vue@3`, `yry-loader.js`, `yry-tag-chip/index.js`, `yry-scene-card/index.js`, `lang.js`.
4. **Identical layout shell**: The three-area layout (card → demo → info) is identical across all demos. Only the demo area content differs.
5. **Mutual cross-linking**: The demo index page lists all demos with consistent card design. Each demo links back to `../index.html`.

### Checklist Per Demo Type

Beyond the base output checklist, each type has specific professionalism checks:

**Type A (Tool Interface):**
- [ ] Empty state with clear call-to-action (icon + "paste a URL" text)
- [ ] 3+ sample inputs as clickable chips (not just a text list)
- [ ] Progress indicator shows stage count and current step number
- [ ] Trace/command display shows the equivalent CLI command
- [ ] Result section has a header with timestamp
- [ ] At least one configurable option panel (resolution, format, etc.)
- [ ] Reset button returns to clean empty state

**Type B (Pipeline Visualization):**
- [ ] Auto-play button with pause capability
- [ ] Manual step selection by clicking nodes
- [ ] Step detail panel with: icon + title + description + technical detail + code trace
- [ ] At least one step shows a supplementary visualization (matrix, sample output)
- [ ] Connector arrows between pipeline nodes show active/completed states
- [ ] Reset restores to initial state (step -1, no selection)

**Type C (Comparison Showcase):**
- [ ] Sortable table or interactive selector (not static divs)
- [ ] At least 10 variants in the comparison
- [ ] Visual size/quality indicators (bars, stars, color coding)
- [ ] Detail panel on click/hover showing full stats
- [ ] Default/Recommended items visually highlighted
- [ ] Best-for recommendation text derived from data properties

**Type D (State Machine):**
- [ ] SVG or CSS-based state diagram with labeled transitions
- [ ] Action buttons that trigger state changes
- [ ] Action log with timestamps and autoscroll
- [ ] Current state is visually prominent (pulsing, accent-colored)
- [ ] Invalid transitions are visibly disabled

**Type E (Dashboard):**
- [ ] Chart.js radar or bar chart with dark theme colors
- [ ] 3-4 metric cards with trend indicators
- [ ] Expandable recommendation cards with priority badges
- [ ] Dimension breakdown with score bars and color coding
- [ ] Chart instance cleaned up in `beforeUnmount()`

**Type F (Guide Walkthrough):**
- [ ] Step progress dots with connectors (not plain numbers)
- [ ] Code blocks with filename headers and copy buttons
- [ ] Copy feedback ("Copied!" with 2s timeout)
- [ ] Result/tip panel per step explaining the expected outcome
- [ ] Keyboard navigation (left/right arrow keys)
- [ ] Prev/Next buttons with disabled states at boundaries
- [ ] Step counter in nav bar

### The Demo Value Pyramid

Every demo should provide value at four levels:

```
Level 4: Teach — the user learns something new about the tool
Level 3: Engage — the user interacts meaningfully (click, type, compare)
Level 2: Explain — the content shows HOW the feature works
Level 1: Display — the card data is rendered correctly
```

A demo that only achieves Level 1 (card rendered, static content) fails. Aim for Level 3 minimum; Level 4 separates professional demos from basic ones.

### Theme Token Discipline

- **Every color** in CSS uses `var(--yry-*)` — zero exceptions for borders, backgrounds, text, shadows
- **Hover states** use `var(--yry-accent-hover)` for filled elements, `var(--yry-accent)` for border/text color changes
- **Muted states** use `var(--yry-text-muted)` or `var(--yry-accent-muted)`
- **Code blocks** use `var(--yry-font-mono)` + `var(--yry-bg-primary)` background + `var(--yry-text-secondary)` text
- **Success/warning/error** use their semantic tokens: `var(--yry-success)`, `var(--yry-warning)`, `var(--yry-error)`
- **Never** use the `--rui-*` token family in demo pages — that's for standalone docs pages that define their own design system inline

### Internationalization Rules

For multi-language demo suites:
- `data.js` uses the cross-language constant pattern: top-level keys for locale-independent data, `en`/`zh-CN` keys for locale-dependent slices
- `index.js` implements `resolveLang(lang)` that merges cross-language constants with the current language slice
- The `ui` object is always flat — no nested i18n keys; use `ui.someLabel` not `ui.section.someLabel`
- Listen to `vl-lang-changed` CustomEvent on `document` for runtime language switching
- Card data is language-dependent (name, desc, tags, badge text) — provide full card objects per language

## When to Use This Skill

- User wants to create demo pages for features described in scene cards
- User has a `data.js` file with card arrays and wants interactive demos
- User mentions: demo pages, 演示, demo, showcase, interactive demo, scene demo, card demo, feature demo
- User wants to generate visual demonstrations from `INTRO_CONFIG` or similar card data
- User is building a docs site and wants to add interactive demos alongside documentation
- User wants to create a demo gallery/index for multiple features within a scene
- User wants to generate a professional demo suite with multiple demo types covering one tool/feature from different angles

---

## Examples

### Example 1: Single Card → Demo

**Input:** "Generate a demo page for the NLP Split card from INTRO_CONFIG"

**Process:**
1. **Phase 0**: Read `INTRO_CONFIG.en.overview.features` → find NLP Split card. Scene: `intro`. No existing demos.
2. **Phase 1**: Classify: tags include `purple` (`AI-driven`) + desc mentions "segmentation" "sentence-boundary" → Type B (Pipeline). Concept: "User sees sample text flow through animated NLP detection → sentence boundary identification → split output. Click any step to inspect intermediate state."
3. **Phase 2**: Create `docs/components/intro/demos/nlp-split/` with 4 scaffold files. CDN paths verified.
4. **Phase 3**: Fill in pipeline-specific content: 3 steps (NLP Detect → Sentence Boundary → Split Output), auto-play button, I/O preview panels, sample English text as input.
5. **Phase 4**: Generate `docs/components/intro/demos/index.html` (or update if exists) with NLP Split card entry.
6. **Phase 5**: Validate — all checks pass. Demo ready.

### Example 2: Batch Generation for a Scene

**Input:** "Generate demo pages for all feature cards in INTRO_CONFIG"

**Process:**
1. **Phase 0**: Read 12 feature cards from `INTRO_CONFIG.en.overview.features`. Scene: `intro`. Scope confirmed.
2. **Phase 1**: Classify → 4 Type A, 3 Type B, 3 Type C, 2 Type D. Present table to user, get approval.
3. **Phase 2**: Generate 12 scaffolds in parallel (12 `mkdir` + 4 file writes each). All CDN paths verified.
4. **Phase 3**: Dispatch 5 concurrent subagents: batch 1 (cards 1-5), batch 2 (cards 6-10), batch 3 (cards 11-12). All complete successfully.
5. **Phase 4**: Generate `docs/components/intro/demos/index.html` with all 12 demos linked. Update global `docs/views/demos/index.html`.
6. **Phase 5**: Validator passes — 48/48 files pass. Final summary reported.

### Example 3: Custom Card → Demo

**Input:** "I have this card: { name: 'Smart Cache', desc: 'LRU + TTL eviction · <strong>3x hit rate</strong>', tags: [{ text: 'LRU+TTL', modifier: 'purple' }, { text: '3x hit rate', modifier: 'accent' }] }. Generate a demo."

**Process:**
1. **Phase 0**: Inline card detected. Ask user for scene name → "features". Create `docs/components/features/demos/` if needed.
2. **Phase 1**: `purple` tag + "eviction" in desc → Type B (Pipeline). Concept: "Visual cache grid with color-coded entries. User clicks to simulate cache hits/misses. Hit rate counter updates live."
3. **Phase 2**: Scaffold generated at `docs/components/features/demos/smart-cache/`.
4. **Phase 3**: Fill in pipeline content: 4 steps (Request → LRU Check → TTL Validate → Serve/Evict), cache grid visualization.
5. **Phase 4**: Generate `docs/components/features/demos/index.html`.
6. **Phase 5**: Validate — passes all checks.

---

## Reference Files

- `references/demo-types.md` — Full specification for each demo type (A–F): DOM structure, Vue app template, interactivity requirements, mock data shapes, and examples. **Read this before generating content in Phase 3.**
- `references/theme-variables.md` — Available `--yry-*` CSS variables and their semantic meanings. **Read this when writing demo styles in Phase 3.**
- `references/output-checklist.md` — Pre-generation and post-generation verification checklists. **Read this in Phase 5 for manual quality assurance.**
- `[[rui-theme]]` — Theme selection and CSS generation (10 presets). See `../rui-theme/scripts/generate-theme.py`.
- `[[rui-ui]]` — Design intelligence for style/color/typography guidance. See `../rui-ui/scripts/search.py`.
- `[[rui-html]]` — Docs tech stack: Vue 3 CDN, 4-file pattern, CSS token bridge, i18n.
- `assets/scaffold-index.html` — HTML scaffold template. **Use this in Phase 2.**
- `assets/scaffold-index.js` — Vue app scaffold template. **Use this in Phase 2.**
- `assets/scaffold-index.css` — CSS scaffold template. **Use this in Phase 2.**
- `assets/scaffold-data.js` — Data scaffold template. **Use this in Phase 2.**
- `assets/demo-index.html` — Scene-scoped demo index page template. **Use this in Phase 4.**

## Output Checklist

Before finalizing generated demos, verify:

### Structural
- [ ] Each demo directory has exactly 4 files: `index.html`, `index.js`, `index.css`, `data.js`
- [ ] No `__PLACEHOLDER__` markers left unfilled in any file
- [ ] Card is mounted via `YrySceneCard.mount()`, not reimplemented in HTML
- [ ] Three-area layout (card, demo, info) is present in `index.html`
- [ ] "Back to Scene" link in the info area points to `../../index.html`

### Technical
- [ ] Vue 3 CDN script tag present in `index.html`
- [ ] Theme CSS link present and path correct (4-level relative)
- [ ] All CSS uses `--yry-*` variables (validated by Phase 5 script)
- [ ] No external API calls — all data from `data.js`
- [ ] CDN paths are correct relative to output location (verified by Phase 5 script)
- [ ] Chart.js included only for Type E demos

### Demo Quality
- [ ] At least one interactive element (click, type, toggle, drag)
- [ ] Demo illustrates the feature's core capability (not a settings panel)
- [ ] Responsive layout works at 375px+ (validated by manual visual check)
- [ ] First-time visitor can understand the feature within 10 seconds
- [ ] Demo uses mock/simulated data appropriate to the feature
- [ ] Type-specific DOM structure matches the template in `demo-types.md`

### Index Page (Multi-Demo Only)
- [ ] Index page at `docs/components/<scene>/demos/index.html`
- [ ] Grid of cards linking to each demo page
- [ ] Cards use the same rui-scene data as the demo pages
- [ ] Type filtering works (All / Tool / Pipeline / Comparison / Control / Dashboard / Walkthrough)
- [ ] "Back to Scene" link works

## 规则

- [scaffold-contracts.md](./rules/scaffold-contracts.md) — 6 阶段管线 / 4 文件结构 / 6 种 demo 类型 / 主题与坐标硬约束。

## 专业代理

- [type-classifier.md](./agents/type-classifier.md) — 把卡片确定性归类到 A–F demo 类型。
- [mock-data-crafter.md](./agents/mock-data-crafter.md) — 为各 demo 类型产出无网络依赖的种子化 mock 数据。

## Borders

### What this skill does

- Generate 4-file demo directories (`index.html` + `index.js` + `index.css` + `data.js`) from rui-scene card data
- Classify each card into demo types A–F and produce type-appropriate interactivity
- Run a 5-phase pipeline (Discovery → Classify → Scaffold → Content → Validate) with gated approval
- Optionally dispatch up to 5 parallel subagents for 3+ demos

### What this skill does NOT do

- **Create the card data itself** — that is [[rui-scene]]; this skill consumes its output
- **Design system recommendation** — that is [[rui-ui]] (called from Phase 0 as a recommendation source, not a replacement)
- **Apply themes to pages** — page mounting of `--yry-*` variables is the responsibility of the demo's own `<link>` tag (use [[rui-theme]] to choose the preset)
- **Browser/runtime verification** — rui-demos only does static structural validation in Phase 5
- **Edit existing demos implicitly** — Phase 0 asks confirmation policy (skip / overwrite / update)

### Coordinated with

| Skill | Direction | See |
|-------|-----------|-----|
| [[rui-scene]] | upstream producer | Card data source — `[IF-003](../INTERFACES.md#if-003)` |
| [[rui-ui]] | calls → rui-ui | Phase 0 design system recommendation — `[IF-001](../INTERFACES.md#if-001)` |
| [[rui-theme]] | calls → rui-theme | Phase 0 theme selection — `[IF-002](../INTERFACES.md#if-002)` |

### Output ownership

| Path | Permission |
|------|-----------|
| `<this-skill-dir>/assets/` | read-only — scaffold templates owned by rui-demos |
| `docs/components/<scene>/demos/<demo-slug>/` | **write** — primary output (4 files per demo + `index.html`) |
| `_demo-plan.json` per scene | write (intermediate Phase 0 artifact) |
| Cards in `INTRO_CONFIG` / `data.js` | no write — read only |
| Anywhere else | no write |

### Invocation

rui-demos has **no CLI entry** — it is invoked by an agent (Claude) following the phased pipeline in this SKILL.md. The Phase 5 inline validator is a one-shot Node script template:

```bash
node /tmp/rui-demos-validate.cjs docs/components/<scene>/demos/
```

The validator is meant to be generated per-run and lives in `/tmp/`, not in `<this-skill-dir>`.
