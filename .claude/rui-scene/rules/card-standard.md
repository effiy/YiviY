---
paths:
  - ".claude/rui-scene/**"
  - ".claude/rui-scene/SKILL.md"
description: "yry-scene-card 卡片数据生成与 Code Health Report 标准的边界契约。"
---

# rui-scene 卡片标准契约

> 把原始描述改写为符合 Code Health Report 标准的 `YrySceneCard` 数据，data 与渲染边界在此固化。

## 角色定位

| 维度 | 取值 |
|------|------|
| 输入 | 原始描述（工具 / 功能 / 项目 / 报告 / Agent）|
| 输出 | `YrySceneCard` props 对象（数组或单卡）|
| 调用模式 | 对话式触发，由调用方决定落到 `data.js` 还是 `window.YrySceneCard.mount(...)` |
| 状态 | 仅输出数据对象；不渲染；不写 scene 现有 `data.js` 之外的内容 |

## 输出契约

### 必填字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | string | 卡片标题（emoji 前缀常见）|
| `desc` | string | 用 `·` (U+00B7) 分隔；至少 1 个 `<strong>` |

### 强烈建议（Rich / Standard 层）

| 字段 | 类型 | 说明 |
|------|------|------|
| `tags` | `Array<{text, modifier, href?}>` | 2–4 个；每个有语义 modifier |
| `badge` | string | `'Report'` / `'Core'` / `'Agent'` / `'OSS'` / `'Beta'` |

### 可选

| 字段 | 类型 | 说明 |
|------|------|------|
| `nameHref` | string | 标题链接 |
| `nameTarget` | string | `''` 同窗口 / `_blank` 新窗口 |
| `meta` | string | 单行 ASCII 风格溯源 |
| `demo` | string | 自动追加 `演示` 链接（去重）|
| `links` | `Array<{icon,label,href,target}>` 或 `null` | 自定义底部链接 |

### `links` 三态语义

| 取值 | 含义 |
|------|------|
| `null`（默认） | 使用 `data.js` 配置的 7 条默认（清单/架构/图谱/源码/测试/演示/审查）|
| `[]` | 隐藏所有底部链接（适用于密集 feature grid）|
| `[...]` | 自定义最多 7 条（外链工具 3–5；报告/审计 2–4）|

## 三种 Tier 最低字段

| Tier | 适用场景 | 必填 | 强烈建议 |
|------|---------|:---:|---------|
| Rich | 报告 / 工具 / 项目 / Agent / 审计 | name + desc | tags (2–4) + badge + meta + 链接 |
| Standard | feature grid / 能力卡 | name + desc（带 `·` + `<strong>`）| tags (2–4) |
| Nav | 文档导航 | name + nameHref + desc | tags (2–4) + badge |

## Tag modifier 语义对照

| Modifier | 适用 | 例 |
|----------|------|------|
| `info` (default) | 中性分类（维度 / 语言 / 类型）| `7 dimensions`、`Python` |
| `accent` | 高亮 / 推荐特性 | `1.2k sites`、`word-level` |
| `warn` | 警示 / 数值分 | `58 / 100` |
| `red` | 风险 / 失败 / 严重问题 | `5.6 → 7.9`、`3 critical` |
| `purple` | 方法论 / 实现路径 | `ATAM`、`AI-driven`、`TDD` |
| `cyan` | 数量 / 行动项 | `26 actions`、`10 items` |
| `green` | 通过 / 正面验证 | `95/100`、`Verified` |

## 12 条门禁检查（Code Health Report 自检）

| 类别 | 检查 | 失败处置 |
|------|------|---------|
| 结构 | `name` 非空 | 跳过 |
| 结构 | `desc` 用 `·` 不是逗号 | 重写 |
| 结构 | `desc` 至少 1 个 `<strong>` | 补 strong |
| 结构 | `tags` 2–4 个 | 增删 |
| 结构 | `tags` 各自语义 modifier | 改 modifier |
| 结构 | `badge` 大写 / 类型分类词 | 改名 |
| 结构 | `meta` 存在（Rich）| 补 |
| 链接 | `links` 三态合法 | 修 |
| 链接 | feature grid 用 `null` 或 `[]` | 改 |
| 标准 | 数字具体（"7 dimensions" 非 "multiple"）| 重写 |
| 标准 | tags 是自描述分类词而非指令 | 改 |
| i18n | 多语言结构、tag 数、links 一致 | 同步 |

## 路径所有权矩阵

| 路径 | 权限 | 备注 |
|------|:---:|------|
| 调用方提供的 `data.js` | write | 数据落点（由调用方决定）|
| `cdn/yry-scene-card/` | read-only | 上游组件 |
| `references/yry-scene-card-schema.md` | read-only | schema 权威 |
| `references/examples.md` | read-only | 示例库 |

## 自我隔离硬规则

| # | 规则 | 设计理由 | 违反处置 |
|---|------|---------|---------|
| 1 | 中点必须是 `·` (U+00B7)，绝不使用半角逗号 `,` | 视觉一致性 | 自动转换并警告 |
| 2 | Rich / Standard 卡必须 2–4 个 tag；空 tag 视为 incompleteness | Code Health Report 标准 | 拒绝输出 |
| 3 | tag 不得出现 "View" / "Click" / "Learn" / "Read" 等指令词 | 标签是分类器，不是动作 | 替换 |
| 4 | tag 文本 2–15 字符；超过则截断+省略号 | 视觉密度 | 截断 |
| 5 | tag `text` 跨卡片去重 — 同一 grid 内不应有完全一样的 tag 配置 | 卡片指纹唯一 | 警告并调 |
| 6 | `badge` 仅出现在类型分类语境（`'Report'` / `'Core'` 等）| 不滥用 | 改名 |
| 7 | 数字必须具体化（"26 actions" 非 "some improvements"）| 专业精度 | 重写 |
| 8 | 多语言 `en` / `zh-CN` 同构；`badge` / `modifier` / `links` 不翻译 | i18n 语义对齐 | 校验拒绝 |
| 9 | `links` 自定义总数 ≤ 7；超则提示优先级 | 视觉噪声 | 提示 |
| 10 | 不输出 JSON Schema 之外字段（如 `description`, `cover`）| schema 权威 | 删除 |
| 11 | `desc` 不超过 2 行（移动端可读性）| 视觉 | 截断提示 |
| 12 | 卡片 `name` 中 emoji 不超过 1 个 | 视觉密度 | 警告 |

## 失败与降级

| 场景 | 行为 | 恢复方式 |
|------|------|---------|
| 原始描述过短（< 30 字）| 拒绝生成并询问细化 | 追加上下文 |
| Tag modifier 与含义不匹配 | 自动审计并提示 | 改 modifier |
| `links` 与 `data.js` 默认重复 | 提示用户决策 | 用 `null` 或 `[]` |
| 多语言不一致 | 列出 diff，让用户修正 | 同步 |
| 用户要求纯文本 desc（不想要 `<strong>`）| Rich/Standard 必须 strong，否则为 Nav | 协商 |
| 调用方提供的 schema 已废弃 | 报错并指引 [[rui-skill]] | 不输出 |

## 与兄弟技能的关系

| 技能 | 方向 | 接口 | 说明 |
|------|------|------|------|
| [[rui-demos]] | 下游 | cards → demo 数据 | 调用方桥接 |
| [[rui-html]] | 下游 | `YrySceneCard.mount(...)` | YrySceneCard 在 Vue App 内挂载 |
| [[rui-checklist]] | 平行（上游可被审计）| cards → 审计 | 卡出 → 审 |
| [[rui-theme]] | 上游 | tag modifier 颜色 | 主题感知 |

## 集成点

> 当前状态：本技能无管线自动调用。所有调用源于"我想给某个东西做一个卡片"的对话需求。如未来 rui-demos Phase 1 等场景需要自动化卡片生成（无人工审核），该自动流程必须保留人工 gate；本技能不内置静默模式。
