---
name: rui-trends
description: >
  Query GitHub Trending to discover technology trends. Use when the user asks
  about trending repositories, technology trends, or wants to see what's popular
  on GitHub. Executable: node <this-skill-dir>/rui-trends.mjs [options],
  where <this-skill-dir> is the directory containing this SKILL.md
  (typically .claude/rui-trends).
lifecycle: default-pipeline
---

# rui-trends

> **--help / -h**: run `node <this-skill-dir>/help.mjs` for full help. When the user types `/rui-trends --help` or `/rui-trends -h` or `/rui-trends help`, run the help script directly.

查询 GitHub Trending，输出结构化趋势报告。

## Invocation

```
node <this-skill-dir>/rui-trends.mjs [options]
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--lang, -l <语言>` | 编程语言过滤（如 `TypeScript`, `Python`, `Go`） | 全部语言 |
| `--since daily\|weekly` | 时间窗口 | `daily` |

## Workflow

```
步骤 1: fetch https://github.com/trending(?since=daily|weekly&language=<L>)
步骤 2: 解析 HTML，提取仓库名、描述、语言、star 数、今日/本周 star 数
步骤 3: 格式化为 markdown 表格输出
步骤 4: 附带来源 URL 和时间戳
```

## Output Format

```markdown
## rui-trends — GitHub Trending

> 数据源: https://github.com/trending | 查询时间: YYYY-MM-DD HH:MM
> 语言: TypeScript | 窗口: daily

| 排名 | 仓库 | Stars | 语言 | 今日 | 描述 |
|------|------|-------|------|------|------|
| 1 | owner/repo | 12.3k | TypeScript | +156 | Short description |
```

## Degradation

| Situation | Behavior |
|-----------|----------|
| GitHub 限速 (60 req/h) | 输出错误 + 手动访问链接 |
| 网络超时 (30s) | 输出错误信息 |
| HTML 解析失败 | 输出原始 URL 引导手动访问 |

## Examples

```bash
# 今日趋势
node <this-skill-dir>/rui-trends.mjs

# TypeScript 语言过滤
node <this-skill-dir>/rui-trends.mjs --lang TypeScript

# 本周趋势
node <this-skill-dir>/rui-trends.mjs --since weekly --lang Go
```

## 规则

- [github-fetch-contracts.md](./rules/github-fetch-contracts.md) — GitHub Trending 单页抓取的速率限制、HTTP 边界与无持久化契约。

## 专业代理

- [trends-curator.md](./agents/trends-curator.md) — 把 GitHub Trending 原始 markdown 过滤成与用户兴趣对齐的摘要。

## Borders

### What this skill does

- Fetch GitHub Trending HTML (daily / weekly, optional language filter)
- Parse repo blocks (name, description, language, stars, today's stars)
- Emit a markdown table to stdout with provenance URL and timestamp

### What this skill does NOT do

- **Crawl beyond the first page** — GitHub Trending paginates via `<page>?since=...&language=...`; this skill stops at page 1
- **Star/history tracking** — single-shot snapshot only; no persistent storage
- **Replace package search** — for npm use [[rui-npm]]
- **Render charts** — plain markdown output only

### Coordinated with

| Skill | Direction | See |
|-------|-----------|-----|
| (standalone) | — | No cross-skill contract; invoked manually |

### Output ownership

| Path | Permission |
|------|-----------|
| `<this-skill-dir>/` | read+write (owned) |
| stdout | write |
| GitHub Trending endpoint | read-only (HTTP GET) |
| Anywhere else | no write |

### Invocation

Entry script lives alongside this SKILL.md:

```bash
node <this-skill-dir>/rui-trends.mjs [--lang <L>] [--since daily|weekly]
node <this-skill-dir>/help.mjs            # show help
```

`<this-skill-dir>` is the directory containing this SKILL.md (typically `.claude/rui-trends/`). GitHub rate limit (60 req/h unauthenticated) is the only constraint.
