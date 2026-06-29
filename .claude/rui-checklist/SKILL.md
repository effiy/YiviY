---
name: rui-checklist
description: Analyze rui-scene card content and generate interactive verification checklist HTML pages. Use whenever the user wants to check, verify, or audit scene cards — "check the cards", "generate a checklist", "verify card quality", "audit scene data", "card checklist", "检查卡片", "生成清单", or any mention of checklist + cards/scene. Also use when the user wants to validate that scene card data meets the Code Health Report standard.
lifecycle: default-pipeline
---

# Rui Checklist

Analyze rui-scene card data against quality standards and generate an interactive verification checklist page.

## What This Skill Does

Reads scene card data from `data.js` files (the output of [[rui-scene]]), runs automated quality checks against the rui-scene standard, and produces a 4-file checklist page (data.js + index.js + index.html + index.css) in a `checklist/` subdirectory. The result is an interactive Vue 3 page where users can:

- See **auto-graded pass/fail/warn results** for every card
- **Check off** items manually and see real-time summary updates
- **Filter** by status (pass/fail/warn/pending) and by card
- **Expand/collapse** per-card sections
- See an **overall score** and per-category breakdown

## When to Use This Skill

- User wants to verify scene cards meet the Code Health Report standard
- User asks to "check the cards", "audit scene data", "validate cards"
- User mentions checklist + cards/scene in any language (清单 + 卡片)
- After rui-scene generates or updates card data — verify the output
- Before shipping a page that uses scene cards — catch quality regressions

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

## 规则

- [audit-invariants.md](./rules/audit-invariants.md) — 卡片审计的数据契约、检查类别分级、路径所有权与跨技能边界。

## 专业代理

- [quality-judge.md](./agents/quality-judge.md) — 对卡片"主观"项做结构化裁定。
- [evidence-tracer.md](./agents/evidence-tracer.md) — 为每条检查项生成可引用的源证据。

## Borders

### What this skill does
- Read scene card data from `data.js` files
- Run automated quality checks against the rui-scene standard
- Generate a 4-file interactive checklist page (data + js + html + css)
- Produce an interactive Vue 3 page with filtering, checkbox persistence, and summary stats

### What this skill does NOT do
- **Modify card data** — this is read-only analysis; use [[rui-scene]] to fix issues found
- **Generate scene cards** — that is [[rui-scene]]; rui-checklist only verifies existing cards
- **Mount cards into DOM** — that is [[rui-html]] via `YrySceneCard.mount()`
- **Run in CI/CD** — the checklist is a human-facing tool, not an automated gate (though the analysis logic could be extracted)
- **Grade demo pages** — demo quality is [[rui-demos]] territory; rui-checklist focuses on card data structure

### Coordinated with

| Skill | Direction | See |
|-------|-----------|-----|
| [[rui-scene]] | upstream — produces the card data that rui-checklist analyzes | rui-scene's Output Checklist defines the standard |
| [[rui-demos]] | sibling — produces demo pages from cards; rui-checklist verifies the card data before demo generation | rui-demos output-checklist.md |
| [[rui-diagram]] | sibling — shares the component creation conventions | component-checklist.md |

### Output ownership

| Path | Permission |
|------|-----------|
| `docs/components/<scene>/checklist/` | **write** — 4 files generated |
| `docs/views/<scene>/checklist/` | **write** — same, for view-level scenes |
| `references/check-rules.md` | read-only — owned by rui-checklist |
| Anywhere else | no write |

### Invocation

rui-checklist is invoked through conversation. The user asks to check/verify/audit scene cards; the skill locates the data, runs analysis, and generates the checklist page. No CLI entry scripts.
