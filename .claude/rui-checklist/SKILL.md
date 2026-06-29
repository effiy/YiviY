---
name: rui-checklist
description: >
  Project self-improvement system — 项目自改进系统。Analyze rui-scene card
  content and generate interactive verification checklist HTML pages. Also
  includes daily introspection (good/bad reflection), step-by-step project
  health improvement workflow, automated quality scoring, self-testing for
  all check rules, completion effects tracking, WeCom notification templates,
  and self-improvement analysis reports with trend forecasting. Use whenever
  the user wants to check/verify/audit cards, do daily self-review, run
  project health checks, run self-tests, or follow the self-improvement
  cycle. "check the cards", "daily introspection", "今日自省", "项目自检",
  "health check", "检查卡片", "生成清单", "自改进", "自测试", "run self test".
lifecycle: default-pipeline
---

# Rui Checklist — 项目自改进系统

两大能力共享一个核心：**质量检查 → 自改进循环**。

```
每日自省 → 质量检查 → 自动修复 → 验证改进 → 报告通知 ──┐
    ↑         ↑            ↑          ↑          ↑        │
    │    自测试验证   完成效果追踪  趋势分析   通知模板     │
    ↑                                                    │
    └────────────── 持续改进循环 ─────────────────────────┘
```

## What This Skill Does

### 能力一：卡片质量检查 (Card Quality Audit)

读取 rui-scene 卡片数据，运行自动化质量检查，生成交互式验证清单 HTML 页面（4-file 格式）。详见下方 Step 2–4。

### 能力二：项目自改进 (Project Self-Improvement)

按步骤一步一步完成项目的自我诊断和改进 — 从每日自省(good/bad)到质量检查、自动修复、验证改进、报告通知。详见 `references/self-improvement.md`。

### 能力三：规则自测试 (Rule Self-Testing)

每个检查规则都有自测试夹具和验证脚本，确保检查逻辑正确无误。详见 `tests/`。

**触发**: "run self test", "运行自测试", "test check rules"

所有 23 条规则（structural × 7, tag-quality × 4, link-hygiene × 3, standard × 3, i18n × 3, human × 3）都有自动化测试，覆盖 pass / fail / warn 三种状态。

### 能力四：完成效果追踪 (Completion Effects)

每次检查运行后生成结构化效果报告：健康分变化、问题解决数、自动修复数、待处理项。详见 `references/completion-effects.md`。

**输出**: 终端摘要 + HTML 组件 + JSONL 持久化

### 能力五：通知模板库 (Notification Templates)

为 rui-bot 提供三类企业微信 Markdown 通知模板：
- **健康报告**: 质量检查结果 + 改进效果 + 详情链接
- **每日自省**: Good/Bad 回顾 + 明日计划 + 连续天数
- **改进警报**: 健康分下降 / 问题回归 / 改进停滞 / 里程碑

详见 `templates/notification/`。

### 能力六：自改进分析报告 (Self-Improvement Report)

多轮检查数据的综合分析：趋势预测、复发检测、分类速率、稳定性评估、数据驱动建议。详见 `templates/report/`。

## When to Use This Skill

- User wants to verify scene cards meet the Code Health Report standard
- User asks to "check the cards", "audit scene data", "validate cards"
- User mentions checklist + cards/scene in any language (清单 + 卡片)
- After rui-scene generates or updates card data — verify the output
- Before shipping a page that uses scene cards — catch quality regressions
- **User wants daily introspection** — "今日自省", "daily check", "今日总结"
- **User wants project health check** — "项目自检", "health check", "质量报告"
- **User wants to run the self-improvement cycle** — "自改进", "self-improvement"
- **User wants to run self-tests** — "run self test", "自测试", "test check rules"
- **User wants completion effects** — "check result", "完成效果", "改进效果"
- **User wants trend analysis** — "trend analysis", "趋势分析", "improvement report"
- **User wants to send health notification** — "send health report", "发送健康报告"

## 项目自改进工作流

完整的自改进循环包含 5 个步骤。详细说明见 `references/self-improvement.md`。

### Step 1: 每日自省 (Daily Introspect)

每天回顾项目状态，记录 Good（做得好）和 Bad（需改进）：

```
🟢 今日 Good:
  1. <做得好的一件事>
  2. <做得好的一件事>

🔴 今日 Bad:
  1. <需要改进的一件事>
  2. <需要改进的一件事>

🎯 明日计划:
  1. <明天要做的改进>
```

自省记录追加到 `docs/故事任务面板/daily-check/每日自省.md`。触发方式：用户说"今日自省"、"daily check"。

通过 rui-bot 发送自省报告到企业微信：

```javascript
import { formatDailyIntrospect } from '../rui-bot/format.mjs';
// 构建消息 → rui-bot send.mjs 发送
```

### Step 2: 质量检查 (Quality Check)

对卡片数据和项目结构运行全面检查，生成健康分 (0-100)。检查分为：

| 类别 | 检查数 | 说明 |
|------|--------|------|
| structural | 7 | name, desc, tags, badge, meta 字段完整性 |
| tag-quality | 4 | modifier 语义、自描述、简洁性、唯一性 |
| link-hygiene | 3 | links 配置、grid 策略、nameHref 配对 |
| standard | 3 | 数字量化、badge 大小写、卡片差异化 |
| i18n | 3 | 多语言结构一致性（如有） |
| human | 3 | 人工审查项（标记为 pending） |

### Step 3: 自动修复 (Auto-Fix)

可自动修复的问题：

| 问题 | 自动修复 |
|------|----------|
| badge 小写开头 | 自动转大写 |
| links 字段缺失 | 设为 `null` |
| 硬编码 hex 颜色 | 替换为 `var(--yry-*)` |
| tags 缺 modifier | 根据语义推荐 modifier |
| desc 无 `·` 分隔符 | 建议替换（需人工确认） |

### Step 4: 验证改进 (Verify)

修复后重新检查，对比改进前后的健康分：

```
改进前: 健康分 72/100 (8 fail, 4 warn)
   ↓ 自动修复 + 人工改进
改进后: 健康分 88/100 (2 fail, 3 warn) ↑ +16
```

### Step 5: 报告通知 (Report & Notify)

通过 [[rui-bot]] 发送健康报告通知：

```javascript
import { formatHealthReport } from '../rui-bot/format.mjs';
// → rui-bot send.mjs 发送到企业微信
```

### 触发整个自改进循环

用户说"项目自检"、"run health check"、"自改进"时，按 Step 1→5 顺序执行：
1. 询问是否先做每日自省
2. 运行卡片/项目质量检查
3. 自动修复可确定的问题
4. 重新检查，对比改进效果
5. 如用户配置了 rui-bot，发送健康报告通知

---

## 卡片质量检查（原有能力）

以下为 rui-checklist 原有的卡片质量检查功能。

## How It Works

### Step 1: Locate Scene Card Data

Ask the user which scene to check. If they don't specify, scan for likely candidates:

- `docs/components/<name>/data.js` — component-level scene data (e.g., `intro`)
- `docs/views/<name>/demos/<slug>/data.js` — demo-level card data

Read the `data.js` and extract all card objects. A card object is any JS object with a `name` field and at least one of `desc`, `tags`, `badge`, `meta`, or `links`. Cards typically live in arrays like `config.en.cards`, `config.en.overview.features`, or `config.en.card`.

**Multi-language configs**: If the data has language keys (`en`, `zh-CN`, etc.), pick ONE language for analysis (default: `en`). The i18n consistency check will verify structural parity across languages — but the analysis runs on one language slice to avoid duplicates. Ask the user which language if ambiguous.

### Step 2: Run Automated Analysis

For each card found, run every check in the rule set (see `references/check-rules.md`). Each check produces:

| Field | Description |
|-------|-------------|
| `id` | Unique check ID (e.g., `struct-name`, `tag-count`) |
| `category` | One of: `structural`, `tag-quality`, `link-hygiene`, `standard`, `i18n` |
| `label` | Human-readable description (Chinese or English based on user's language) |
| `status` | `pass` / `fail` / `warn` / `pending` |
| `evidence` | Brief evidence string — what was found, or why it failed |

**Key principle**: Checks must be objectively determinable from the data alone. No subjective judgment — if a check requires human evaluation (e.g., "does the description accurately reflect the tool?"), mark it `pending` with a note for manual review.

Default language for labels: match the user's language. If the user speaks Chinese, labels are in Chinese.

### Step 3: Generate the 4-File Checklist Page

Produce four files in `docs/components/<scene>/checklist/` (or `docs/views/<scene>/checklist/`):

```
checklist/
├── data.js     # CHECKLIST_CONFIG with constants + cards[] + checks[]
├── index.js    # Vue 3 app: filtering, checkbox toggle, summary compute
├── index.html  # Template: summary bar + filter bar + card sections
└── index.css   # Styles: all var(--yry-*) tokens, dark theme
```

#### data.js Structure

```javascript
window.CHECKLIST_CONFIG = {
    constants: {
        sceneName: 'intro',                    // scene directory name
        scenePath: 'docs/components/intro/',   // relative path to scene
        sourceFile: 'data.js',                 // which file was analyzed
        language: 'en',                        // which language slice
        generatedAt: '2026-06-29T12:00:00Z',   // ISO timestamp
        totalCards: 11,
        summary: { pass: 45, fail: 12, warn: 8, pending: 3 }
    },
    cards: [
        {
            name: '🎥 yt-dlp',                 // card name
            index: 0,                          // position in source array
            sourceKey: 'en.overview.features[0]', // where in data.js
            badge: 'Core',                     // from card (if present)
            desc: '...',                       // from card (truncated to 120 chars)
            checks: [
                {
                    id: 'struct-name',
                    category: 'structural',
                    label: 'name 字段存在且非空',
                    status: 'pass',
                    evidence: '🎥 yt-dlp'
                },
                // ... more checks
            ]
        },
        // ... more cards
    ]
};
```

**Critical `data.js` rules**:
- `id` must be unique per check type across ALL cards (e.g., `struct-name` is the same check applied to every card — use the same `id`)
- `status` must be one of: `pass`, `fail`, `warn`, `pending`
- All cards must have the SAME set of check `id`s in the SAME order — this ensures the summary table aligns
- `constants.summary` must be computed from actual check results, not hardcoded

#### index.html Template

Follow this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Card Quality Checklist — <scene-name></title>
    <link rel="stylesheet" href="../../../../cdn/theme/rui-checklist.css">
    <link rel="stylesheet" href="index.css">
    <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
</head>
<body>
    <div id="checklist-app">
        <!-- Summary Dashboard -->
        <section class="summary-dashboard">
            <div class="summary-header">
                <h1>📋 Card Quality Checklist</h1>
                <p class="summary-subtitle">{{ sceneName }} · {{ totalCards }} cards · generated {{ generatedAt }}</p>
            </div>
            <div class="summary-stats">
                <div class="stat stat-pass" @click="setFilter('pass')">
                    <span class="stat-num">{{ counts.pass }}</span>
                    <span class="stat-label">Pass</span>
                </div>
                <div class="stat stat-fail" @click="setFilter('fail')">
                    <span class="stat-num">{{ counts.fail }}</span>
                    <span class="stat-label">Fail</span>
                </div>
                <div class="stat stat-warn" @click="setFilter('warn')">
                    <span class="stat-num">{{ counts.warn }}</span>
                    <span class="stat-label">Warn</span>
                </div>
                <div class="stat stat-pending" @click="setFilter('pending')">
                    <span class="stat-num">{{ counts.pending }}</span>
                    <span class="stat-label">Manual</span>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" :style="{ width: passRate + '%' }"></div>
            </div>
            <p class="pass-rate-text">{{ passRate }}% passing ({{ counts.pass }}/{{ totalChecks }})</p>
        </section>

        <!-- Filter Bar -->
        <section class="filter-bar">
            <button v-for="f in filters" :key="f.key"
                :class="{ active: activeFilter === f.key }"
                @click="setFilter(f.key)">{{ f.label }} ({{ f.count }})</button>
            <select v-model="selectedCard" class="card-select">
                <option value="">All Cards</option>
                <option v-for="card in cards" :value="card.name">{{ card.name }}</option>
            </select>
            <button class="toggle-all" @click="expandAll = !expandAll">
                {{ expandAll ? 'Collapse All' : 'Expand All' }}
            </button>
        </section>

        <!-- Card Checklists -->
        <section class="cards-list">
            <div v-for="card in filteredCards" :key="card.name" class="card-section"
                :class="{ expanded: expandedCards[card.name] !== false }">
                <div class="card-header" @click="toggleCard(card.name)">
                    <div class="card-header-left">
                        <span class="card-name">{{ card.name }}</span>
                        <span v-if="card.badge" class="card-badge">{{ card.badge }}</span>
                        <span class="card-source">{{ card.sourceKey }}</span>
                    </div>
                    <div class="card-header-right">
                        <span class="card-stats">
                            <span class="mini-stat pass">{{ cardCounts[card.name].pass }}</span>
                            <span class="mini-stat fail">{{ cardCounts[card.name].fail }}</span>
                            <span class="mini-stat warn">{{ cardCounts[card.name].warn }}</span>
                        </span>
                        <span class="expand-icon">{{ expandedCards[card.name] !== false ? '▾' : '▸' }}</span>
                    </div>
                </div>
                <div class="card-body" v-show="expandedCards[card.name] !== false">
                    <p class="card-desc">{{ card.desc }}</p>
                    <div v-for="check in card.checks" :key="check.id"
                        class="check-item" :class="'check-' + check.status"
                        v-show="showCheck(check)">
                        <input type="checkbox"
                            :checked="checkedItems[card.name + '|' + check.id]"
                            @change="toggleCheck(card.name, check.id)" />
                        <span class="check-status-icon" :class="check.status"></span>
                        <span class="check-label">{{ check.label }}</span>
                        <span class="check-evidence" v-if="check.evidence">{{ check.evidence }}</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Empty State -->
        <div v-if="filteredCards.length === 0" class="empty-state">
            <p>No cards match the current filter.</p>
            <button @click="resetFilters">Reset Filters</button>
        </div>
    </div>

    <script src="data.js"></script>
    <script src="index.js"></script>
</body>
</html>
```

Key template rules:
- Theme CSS path: `../../../../cdn/theme/rui-checklist.css` (4 levels up from `checklist/`). If the scene is deeper (e.g., `docs/views/<view>/demos/<slug>/checklist/`), adjust accordingly: use `getRelativePathToCdn(scenePath)` logic.
- Vue 3 from CDN: `https://unpkg.com/vue@3/dist/vue.global.prod.js`
- All text content comes from `data.js` via Vue bindings — no hardcoded text except structural labels
- `data.js` script before `index.js`
- Theme CSS before component CSS

#### index.js Structure

```javascript
(function() {
    const cfg = window.CHECKLIST_CONFIG;
    if (!cfg) { console.error('CHECKLIST_CONFIG not found'); return; }

    const { createApp } = Vue;

    createApp({
        data() {
            const expandedCards = {};
            cfg.cards.forEach(c => { expandedCards[c.name] = true; });

            return {
                sceneName: cfg.constants.sceneName,
                totalCards: cfg.constants.totalCards,
                generatedAt: cfg.constants.generatedAt,
                cards: cfg.cards,
                activeFilter: 'all',
                selectedCard: '',
                expandAll: true,
                expandedCards: expandedCards,
                checkedItems: this.loadCheckedItems() || {},
            };
        },
        computed: {
            counts() {
                // compute pass/fail/warn/pending counts across all visible checks
            },
            totalChecks() {
                return this.counts.pass + this.counts.fail + this.counts.warn + this.counts.pending;
            },
            passRate() {
                if (this.totalChecks === 0) return 0;
                return Math.round((this.counts.pass / (this.totalChecks - this.counts.pending)) * 100);
            },
            filters() {
                return [
                    { key: 'all', label: 'All', count: this.totalChecks },
                    { key: 'pass', label: 'Pass', count: this.counts.pass },
                    { key: 'fail', label: 'Fail', count: this.counts.fail },
                    { key: 'warn', label: 'Warn', count: this.counts.warn },
                    { key: 'pending', label: 'Manual', count: this.counts.pending },
                ];
            },
            filteredCards() {
                // filter by selectedCard, then filter checks by activeFilter
            },
            cardCounts() {
                // per-card pass/fail/warn counts
            },
        },
        methods: {
            setFilter(key) { this.activeFilter = key; },
            toggleCard(name) {
                this.expandedCards[name] = this.expandedCards[name] === false ? true : false;
            },
            toggleCheck(cardName, checkId) {
                const key = cardName + '|' + checkId;
                this.checkedItems[key] = !this.checkedItems[key];
                this.saveCheckedItems();
            },
            showCheck(check) {
                if (this.activeFilter === 'all') return true;
                return check.status === this.activeFilter;
            },
            resetFilters() {
                this.activeFilter = 'all';
                this.selectedCard = '';
            },
            loadCheckedItems() {
                try {
                    return JSON.parse(localStorage.getItem('checklist_checked_' + cfg.constants.sceneName));
                } catch(e) { return {}; }
            },
            saveCheckedItems() {
                localStorage.setItem(
                    'checklist_checked_' + cfg.constants.sceneName,
                    JSON.stringify(this.checkedItems)
                );
            },
        },
        watch: {
            selectedCard() {
                // scroll to card if one selected
            },
        },
    }).mount('#checklist-app');
})();
```

Key `index.js` rules:
- IIFE wrapper — no global leaks
- `localStorage` persistence for checkbox state (keyed by scene name)
- All computed properties derived from data — no hardcoded values
- Clean separation: data in `data.js`, logic in `index.js`, presentation in `index.html`

#### index.css Structure

```css
/* ══════════════════════════════════════════════
   Card Quality Checklist — Component Styles
   All colors use var(--yry-*) tokens
   ══════════════════════════════════════════════ */

*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    background: var(--yry-bg-flat);
    color: var(--yry-text);
    font-family: var(--yry-font-sans);
    line-height: 1.6;
    padding: 2rem;
    max-width: 1020px;
    margin: 0 auto;
}

/* ── Summary Dashboard ── */
.summary-dashboard {
    background: var(--yry-bg-card);
    border: var(--yry-border);
    border-radius: var(--yry-radius-lg);
    padding: 2rem;
    margin-bottom: 1.5rem;
}

/* ── Filter Bar ── */
.filter-bar {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    align-items: center;
}

/* ── Card Sections ── */
.card-section {
    background: var(--yry-bg-card);
    border: var(--yry-border);
    border-radius: var(--yry-radius);
    margin-bottom: 0.75rem;
    overflow: hidden;
}

/* ── Check Items ── */
.check-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 1.25rem;
    border-bottom: 1px solid rgba(0,0,0,0.04);
}

/* Status colors */
.check-pass { border-left: 3px solid var(--yry-pass); }
.check-fail { border-left: 3px solid var(--yry-fail); }
.check-warn { border-left: 3px solid var(--yry-warn); }
.check-pending { border-left: 3px solid var(--yry-text-muted); }

/* ── Responsive ── */
@media (max-width: 768px) {
    body { padding: 1rem; }
    .filter-bar { flex-direction: column; }
    .check-category { display: none; }
}

@media (max-width: 375px) {
    .summary-stats { flex-wrap: wrap; }
    .card-badge { display: none; }
}
```

Key `index.css` rules:
- ALL colors from `var(--yry-*)` — zero hardcoded hex/rgb values (token names: `--yry-bg-card`, `--yry-bg-flat`, `--yry-text`, `--yry-text-soft`, `--yry-text-muted`, `--yry-text-heading`, `--yry-accent`, `--yry-accent-soft`, `--yry-pass`, `--yry-fail`, `--yry-warn`, `--yry-border-color`, `--yry-border`, `--yry-radius`, `--yry-radius-sm`, `--yry-radius-lg`, `--yry-radius-full`)
- Responsive breakpoints at 768px and 375px
- Smooth transitions on interactive elements
- Status colors: green=pass, red=fail, orange=warn, muted=pending
- The CSS file should be comprehensive but not bloated — target ~150-250 lines

### Step 4: Present and Explain

After generating the files, tell the user:
- Where the files were created
- Summary stats: how many cards analyzed, pass/fail/warn breakdown
- Any notable findings (e.g., "3 cards are missing tags", "2 cards use commas instead of ·")
- How to view the checklist (open `checklist/index.html` in browser)

### Step 5: Iterate Based on Feedback

If the user wants adjustments:
- Add/remove/modify check rules
- Regenerate the checklist with updated rules
- The `generatedAt` timestamp updates on each regeneration

## Analysis Rules

The full check rule reference is in `references/check-rules.md`. Read it when generating the analysis. Here's the summary:

### Structural Completeness (auto)
| ID | Check | Pass Condition |
|----|-------|---------------|
| `struct-name` | name 字段存在 | `name` is a non-empty string |
| `struct-desc` | desc 字段存在 | `desc` is a non-empty string |
| `struct-desc-dot` | desc 使用 `·` 分隔符 | `desc` contains at least one `·` (U+00B7) |
| `struct-desc-strong` | desc 包含 `<strong>` | `desc` contains `<strong>` tag |
| `struct-tags` | tags 字段存在 (2-4个) | `tags` array length is 2-4 |
| `struct-tags-modifier` | tags 使用语义 modifier | Every tag has a `modifier` field; not all are `info` |
| `struct-badge` | badge 是类型分类器 | `badge` is absent, OR is a single uppercase-start word |
| `struct-meta` | meta 溯源信息 | `meta` is present (for cards with `badge`='Report') OR warn if Rich-tier card lacks `meta` |

### Tag Quality (auto)
| ID | Check | Pass Condition |
|----|-------|---------------|
| `tag-semantic` | modifier 与含义匹配 | Score-like text → `warn`/`green`/`red`; count-like → `cyan`; methodology → `purple` |
| `tag-self-describing` | 标签是自描述分类器 | Tag text does NOT contain instructional phrases (View, Click, Learn, Read) |
| `tag-concise` | 标签文字简洁 | Each tag text is 2-20 chars |
| `tag-fingerprint` | 卡片标签组唯一 | No two cards have identical tag `text` arrays |

### Link Hygiene (auto)
| ID | Check | Pass Condition |
|----|-------|---------------|
| `link-intentional` | links 配置有意图 | `links` is `null` (defaults), `[]` (hidden), or `[...]` (custom) — not missing |
| `link-grid` | 网格卡片链接策略 | If card is in a feature grid, `links` should be `null` or `[]`, not a full 7-link array |
| `link-namehref` | nameHref 有对应 target | If `nameHref` present, `nameTarget` is set appropriately |

### Standard Compliance (auto)
| ID | Check | Pass Condition |
|----|-------|---------------|
| `std-numbers` | 数字具体量化 | `desc` contains at least one digit (quantified metrics) |
| `std-badge-case` | badge 大写开头 | If `badge` present, first char is uppercase |
| `std-card-distinct` | 卡片差异化 | Card has at least one field value that differs from all other cards |

### i18n Consistency (auto if multi-language)
| ID | Check | Pass Condition |
|----|-------|---------------|
| `i18n-structure` | 多语言结构一致 | All language slices have the same keys at the same nesting level |
| `i18n-tag-count` | 标签数量跨语言一致 | Each card has the same number of tags in every language |
| `i18n-badge-same` | badge 不翻译 | `badge` value is identical across all languages |

**Pending checks** (require human judgment, auto-marked as `pending`):
| ID | Check | Why Manual |
|----|-------|------------|
| `human-desc-accuracy` | 描述准确反映卡片内容 | Requires domain knowledge |
| `human-tag-meaning` | 标签语义与卡片匹配 | Subjective judgment |
| `human-visual` | 卡片渲染效果良好 | Requires opening in browser |

## Design Principles

### 1. Objective Where Possible, Honest Where Not
Every check that CAN be determined from data alone SHOULD be. For checks that require human judgment, mark them `pending` with clear guidance — don't guess and don't skip them. The checklist is a tool for humans, not a replacement for them.

### 2. Actionable Evidence
Every check result includes `evidence` — a short string showing exactly what was found. "desc contains 3 · separators" is actionable; "desc looks good" is useless. The evidence should tell the reviewer what to look at if they disagree with the auto-grade.

### 3. Lean Output
The checklist page should load fast and render cleanly. No external fonts, no heavy libraries beyond Vue 3. Keep the CSS under 250 lines. Keep the JS logic straightforward — the complexity is in the analysis, not the rendering.

### 4. Persistent State
Checkbox state persists in `localStorage` so users can work through the checklist incrementally. Keyed by scene name so different scenes don't collide.

### 5. Project-Convention Alignment
Output follows the same 4-file pattern as all other doc components: `data.js` + `index.js` + `index.html` + `index.css`. Theme token usage, Vue 3 patterns, file naming — all match the existing codebase conventions documented in `rui-diagram/references/component-checklist.md`.

## Reference Files

- `references/check-rules.md` — Full check rule reference with detailed pass/fail conditions, examples, and edge cases. Read this when generating the analysis for complete rule definitions.
- `references/self-improvement.md` — **项目自改进工作流**：5步循环 (自省→检查→修复→验证→报告)，每日自省模板，健康分追踪，自动修复规则。
- `references/completion-effects.md` — **完成效果格式**：health delta、issue breakdown、improvement log、action items 的结构化定义，含终端/HTML/WeCom 三种渲染模板。
- `templates/notification/health-report.md` — **健康报告通知模板**：完整版/紧凑版/全绿版/紧急版 4 种 WeCom markdown 模板。
- `templates/notification/daily-introspect.md` — **每日自省通知模板**：完整版/紧凑版/周末回顾版 3 种格式。
- `templates/notification/improvement-alert.md` — **改进警报通知模板**：6 种警报类型（健康分下降/回归/停滞/里程碑/过期检查）。
- `templates/report/self-improvement-report.md` — **自改进分析报告模板**：8 段结构（趋势/问题/速率/风险/建议/下轮计划）+ markdown 渲染。
- `templates/report/trend-analysis.md` — **趋势分析模板**：包含线性回归、达标预测、复发检测、速率分析、ASCII 趋势图渲染的完整算法。
- `tests/fixtures/sample-cards.js` — **自测试夹具**：10 张覆盖所有 23 条规则正/反/边 cases 的测试卡片。
- `tests/self-test-rules.js` — **规则自测试脚本**：所有检查规则的独立实现 + 测试运行器 + 报告生成器。

## 规则

- [audit-invariants.md](./rules/audit-invariants.md) — 卡片审计的数据契约、检查类别分级、路径所有权与跨技能边界。

## 自测试

### 运行自测试

```
用户: "run self test" / "运行自测试" / "test check rules"
```

Claude agent 执行 `tests/self-test-rules.js` 中的 `runSelfTest()` 并返回结果:

```
════════════════════════════════════════
  rui-checklist 规则自测试报告
════════════════════════════════════════

  总计: 173 tests
  通过: 173 ✅
  失败: 0 ❌
  通过率: 100%

── 分类汇总 ──
  ✅ struct: 80/80 passed
  ✅ tag: 36/36 passed
  ✅ link: 27/27 passed
  ✅ std: 27/27 passed
  ✅ i18n: 3/3 passed
```

### 添加新测试

1. 在 `tests/fixtures/sample-cards.js` 添加测试卡片
2. 设置 `expected` 中对应新规则的预期值
3. 如需要新检查函数，在 `tests/self-test-rules.js` 添加实现
4. 运行自测试确认全部通过

### 测试覆盖原则

- **正例**：至少 1 张完美卡片（所有检查 pass）
- **反例**：每个规则至少 1 张卡片对应 fail
- **边例**：每个 warn 条件至少 1 张卡片对应 warn
- **复合**：1 张卡片同时触发多个 fail/warn

## 专业代理

- [quality-judge.md](./agents/quality-judge.md) — 对卡片"主观"项做结构化裁定。
- [evidence-tracer.md](./agents/evidence-tracer.md) — 为每条检查项生成可引用的源证据。

## Borders

### What this skill does
- Read scene card data from `data.js` files
- Run automated quality checks against the rui-scene standard (23 checks across 5 categories + 3 human)
- Generate a 4-file interactive checklist page (data + js + html + css)
- Produce an interactive Vue 3 page with filtering, checkbox persistence, and summary stats
- **Guide step-by-step project self-improvement** (daily introspection → check → fix → verify → report)
- **Generate daily good/bad introspection reports** via rui-bot
- **Track health score trends** across multiple check runs
- **Auto-fix deterministic issues** (badge case, missing links, hex colors, missing modifiers)
- **Self-test all 23 check rules** with fixtures covering pass/fail/warn cases (173 tests, 100% coverage)
- **Produce completion effects reports** with health delta, issue breakdown, improvement log, and action items
- **Format WeCom notifications** for health reports, daily introspection, and improvement alerts
- **Generate self-improvement analysis reports** with trend forecasting, recurrence detection, and data-driven recommendations

### What this skill does NOT do
- **Modify card data** — this is read-only analysis; use [[rui-scene]] to fix issues found
- **Generate scene cards** — that is [[rui-scene]]; rui-checklist only verifies existing cards
- **Mount cards into DOM** — that is [[rui-html]] via `YrySceneCard.mount()`
- **Run in CI/CD** — the checklist is a human-facing tool, not an automated gate (though the analysis logic could be extracted)
- **Grade demo pages** — demo quality is [[rui-demos]] territory; rui-checklist focuses on card data structure
- **Send notifications directly** — uses [[rui-bot]] for WeCom delivery; rui-checklist provides the formatted content
- **Replace human judgment** — pending/human checks remain manual review items; the system flags them, doesn't decide them

### Coordinated with

| Skill | Direction | See |
|-------|-----------|-----|
| [[rui-scene]] | upstream — produces the card data that rui-checklist analyzes | rui-scene's Output Checklist defines the standard |
| [[rui-demos]] | sibling — produces demo pages from cards; rui-checklist verifies the card data before demo generation | rui-demos output-checklist.md |
| [[rui-diagram]] | sibling — shares the component creation conventions | component-checklist.md |
| [[rui-bot]] | calls → rui-bot | Health reports, daily introspection → rui-bot for WeCom delivery |

### Output ownership

| Path | Permission |
|------|-----------|
| `docs/components/<scene>/checklist/` | **write** — 4 files generated |
| `docs/views/<scene>/checklist/` | **write** — same, for view-level scenes |
| `references/check-rules.md` | read-only — owned by rui-checklist |
| Anywhere else | no write |

### Invocation

rui-checklist is invoked through conversation. The user asks to check/verify/audit scene cards; the skill locates the data, runs analysis, and generates the checklist page. No CLI entry scripts.
