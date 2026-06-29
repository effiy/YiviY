---
paths:
  - ".claude/rui-ui/**"
  - ".claude/rui-ui/SKILL.md"
description: "BM25 驱动的 UI/UX 设计情报查询边界与持久化契约。"
---

# rui-ui 设计情报边界

> 通过 BM25 检索 8 个领域 + 22+ 框架语料，给出 markdown 设计推荐。所有 corpus 与持久化路径边界在此固化。

## 角色定位

| 维度 | 取值 |
|------|------|
| 输入 | 自然语言查询 / 模式选项 |
| 输出 | 单次 markdown 推荐或 `--persist` 落盘的 `design-system/<slug>/` |
| 调用模式 | 一次性 `search.py` 调用 |
| 状态 | 仅读 `data/*.csv`（corpus）；可选写 `design-system/<slug>/` |

## 8 个领域

| Domain | CSV | 用途 |
|--------|-----|------|
| `style` | design styles catalog | 设计风格 |
| `color` | color palettes | 配色 |
| `typography` | font pairings | 字体配对 |
| `chart` | chart presets & config | 图表 |
| `landing` | landing page patterns | 着陆页 |
| `product` | product archetypes | 产品原型 |
| `ux` | UX guidelines | UX 指南 |
| `google-fonts` | Google Fonts | 字体源 |

## 22+ 框架栈

react · nextjs · vue · svelte · astro · swiftui · react-native · flutter ·
nuxtjs · nuxt-ui · html-tailwind · shadcn · jetpack-compose · threejs ·
angular · laravel · javafx · wpf · winui · avalonia · uno · uwp

## 命令族

| 命令 | 输出 | 风险 |
|------|------|:---:|
| domain search（默认）| Top 3 rows / 域 | 低 |
| `--stack <name>` | 特定 stack 指南 | 低 |
| `--design-system` | 完整推荐（style + color + font + UX）| 低 |
| `--design-system --persist` | 写 `design-system/<slug>/MASTER.md` + 页 overrides | **中** |
| `--json`（任意以上）| 原始 JSON | 低 |
| `-p "<Project>"` | 项目名（持久化时）| 低 |
| `--page "<page>"` | 页 override | 低 |

## 数据契约：持久化目录结构

```
design-system/<slug>/
├── MASTER.md                 # 全局设计系统（color + typography + UX）
├── design-system.json        # 机器可读归档
└── pages/
    └── <page-slug>.md        # 页级 override（可选）
```

| 文件 | 必含 | 备注 |
|------|------|------|
| `MASTER.md` | 风格 + 配色 hex + 字体对 + UX 戒律 | 多页项目共享 |
| `design-system.json` | 设计推荐的 JSON 镜像 | 跨工具消费 |
| `pages/<page>.md` | 该页对 MASTER 的 override | 局部偏离 |

## 路径所有权矩阵

| 路径 | 权限 | 备注 |
|------|:---:|------|
| `data/*.csv` | **read-only** | corpus 权威，绝不修改 |
| `data/stacks/*.csv` | **read-only** | stack 语料 |
| `scripts/` | r+w | owned |
| `templates/` | r+w | owned |
| `design-system/<slug>/`（在 `--persist` 时）| write | 新建（不覆盖既有） |
| 既有 `<slug>/MASTER.md` | read | 不覆盖（重 slug）|
| stdout | write | 主产物 |

## 自我隔离硬规则

| # | 规则 | 设计理由 | 违反处置 |
|---|------|---------|---------|
| 1 | corpus CSV 只读 — 不修改、不增字段 | BM25 索引稳定 | 阻断 |
| 2 | 不内置颜色 hex — 通过 [[rui-theme]] 输出 | 单一权威 | 提示跳转 |
| 3 | 不向实际 page 注入 CSS — 由 [[rui-html]] / [[rui-demos]] 负责 | 职责分离 | 跳过 |
| 4 | 持久化目录若已存在 `<slug>` — 自动追加 timestamp 后缀（`<slug>-2026-06-29`）| 不覆盖 | 自动重命名 |
| 5 | 不保留历史 / 历史化趋势查询 — 单次结果 | 简化 | 拒绝建库 |
| 6 | `--json` 输出必须为合法 JSON — 无尾随注释 | 管线友好 | 校验 |
| 7 | slug 必须匹配 `^[a-z0-9][a-z0-9-]*$` | 跨工具兼容 | 自动 slug 化 |
| 8 | `--persist` 仅写本技能产物 — 不写 `.diagram/`、`docs/` | 范围聚焦 | 阻断 |

## 失败与降级

| 场景 | 行为 | 恢复方式 |
|------|------|---------|
| corpus CSV 损坏 | 报错并提示恢复 | 回滚到 git 历史 |
| BM25 索引为空 | 输出"未找到匹配"+ 提示换个查询 | 改关键词 |
| `--stack` 不在 22+ 列表 | 仍按域名搜索；提示堆栈未收录 | 用户自行 grep |
| 持久化冲突 | 时间戳后缀 | 用户主动合并 |
| stdout 写入失败（如管道关闭）| 报错但不污染 corpus | 重定向到文件 |

## 与兄弟技能的关系

| 技能 | 方向 | 接口 | 说明 |
|------|------|------|------|
| [[rui-demos]] | 下游（被调用）| `--design-system` | Phase 0 |
| [[rui-html]] | 下游（被调用）| `--design-system` | Phase 1 |
| [[rui-theme]] | 平行（不替代）| preset vs 情报查询 | 本技能是 search，[[rui-theme]] 是 preset 权威 |
| [[rui-graph]] / [[rui-diagram]] | 平行 | 颜色灵感 | layer palette 候选 |

## 集成点

> 当前状态：本技能由 [[rui-demos]] Phase 0、 [[rui-html]] Phase 1 等显式调用，提供设计情报。本技能不内置"页面加载即拉设计情报"的 listener — 避免无意义调用。若未来新增自动 hook（如代码改动重新拉 palette），应在 hook 触发器侧实现，本技能保持纯查询语义。
