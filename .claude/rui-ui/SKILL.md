---
name: rui-ui
description: Query a curated UI/UX design intelligence database — styles, colors, typography, charts, landing patterns, products, UX guidelines, Google Fonts, and per-stack (react/next/vue/svelte/astro/swiftui/flutter/jetpack-compose/threejs/...). Use when the user wants design inspiration, color palettes, typography pairings, landing page patterns, chart presets, or a full design system recommendation. Also use when a downstream skill (e.g. rui-demos Phase 0, rui-html Phase 1) needs design intelligence before committing to a theme. Executable: python3 <this-skill>/scripts/search.py "<query>" [options].
lifecycle: default-pipeline
---

# Rui UI

Design intelligence database backed by CSV corpora and BM25 search. Provides per-domain queries (style, color, typography, chart, landing, product, UX) and per-stack queries for 22+ frameworks, plus a one-shot design-system generator.

## Invocation

The entry script lives **alongside this SKILL.md** (`scripts/search.py`).

```bash
# from project root, where <this-skill-dir> = .claude/rui-ui
python3 <this-skill-dir>/scripts/search.py "<query>" [options]
```

### Modes

| Mode | Invocation | Output |
|------|-----------|--------|
| Domain search | `python3 .../search.py "<kw>"` | Top 3 matching rows for the domain |
| Stack search | `python3 .../search.py "<kw>" --stack <stack>` | Stack-specific guidelines |
| Design system | `python3 .../search.py "<kw>" --design-system [-p "Project Name"]` | Full recommendation: style + colors + fonts + UX |
| Persist design system | `... --design-system --persist [-p "..."] [--page "<page>"]` | Writes `design-system/<slug>/MASTER.md` + page overrides |
| Raw JSON | append `--json` | Structured JSON instead of markdown |

### Domains

| Domain | CSV |
|--------|-----|
| `style` | design styles catalog |
| `color` | color palettes |
| `typography` | font pairings |
| `chart` | chart types & presets |
| `chart` | chart configurations |
| `landing` | landing page patterns |
| `product` | product archetypes |
| `ux` | UX guidelines |
| `google-fonts` | Google Fonts recommendations |

### Stacks (22+)

react · nextjs · vue · svelte · astro · swiftui · react-native · flutter · nuxtjs · nuxt-ui · html-tailwind · shadcn · jetpack-compose · threejs · angular · laravel · javafx · wpf · winui · avalonia · uno · uwp

## 规则

- [design-intelligence-boundaries.md](./rules/design-intelligence-boundaries.md) — BM25 检索的 8 领域 / 22+ 框架栈、`--persist` 目录结构、corpus 只读与跨技能契约。

## 专业代理

- [design-query-parser.md](./agents/design-query-parser.md) — 自然语言设计需求 → `search.py` 的 CLI 调用计划。
- [recommendation-synthesizer.md](./agents/recommendation-synthesizer.md) — 跨风格 / 配色 / 字体 BM25 结果合成为一致的设计推荐。

## Borders

### What this skill does

- BM25 search over curated UI/UX corpora
- Generate full design-system recommendations (style + colors + typography + UX heuristics)
- Optionally persist a Master + Page-Override design-system file tree

### What this skill does NOT do

- **Apply themes to pages** — that is [[rui-theme]] (select theme + emit CSS variables) and [[rui-html]] / [[rui-demos]] (inject CSS into pages)
- **Render visual artifacts** — this skill returns text; downstream skills consume the recommendation
- **Maintain historical trends** — single-shot recommendations only

### Coordinated with

| Skill | Direction | What flows through this interface |
|-------|-----------|-----------------------------------|
| [[rui-demos]] | called by | rui-demos Phase 0 invokes `scripts/search.py --design-system` to inform theme selection |
| [[rui-html]] | called by | rui-html Phase 1 invokes `scripts/search.py --design-system` for new page design |
| [[rui-theme]] | called by | rui-theme consumes color/font tokens when generating `--yry-*` CSS variables |

### File ownership

| Boundary | Permission |
|----------|-----------|
| `data/*.csv`, `data/stacks/*.csv` | **read-only** — corpus, do not edit |
| `scripts/`, `templates/` | **read/write** — code & template maintained by rui-ui |
| `design-system/<slug>/` | **write** — owner of persisted design-system files (created on `--persist`) |
| Anywhere else in the repo | **no write** — calls only consume output |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Search | BM25 (custom) over CSV corpora |
| CLI | `argparse` (stdlib) |
| Output | Markdown (default), JSON (with `--json`) |
| Persistence | Master + Override file tree under `design-system/` |
