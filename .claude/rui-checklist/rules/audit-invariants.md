---
paths:
  - ".claude/rui-checklist/**"
  - ".claude/rui-checklist/SKILL.md"
description: "rui-scene 卡片数据审计规则与清单页生成边界。"
---

# rui-checklist 审计契约

> 把 rui-scene 卡片数据按 `references/check-rules.md` 的检查清单转换为可视化页面，路径与渲染边界在此固化。

## 角色定位

| 维度 | 取值 |
|------|------|
| 输入 | rui-scene 产出的 `data.js`（任何 scene） |
| 输出 | `checklist/` 子目录下的 4 文件包：`data.js` + `index.js` + `index.html` + `index.css` |
| 调用模式 | 对话式触发（用户在某卡片评审节奏点调用），非定时任务 |
| 状态 | 仅读取 — 无任何写入源卡片数据的权力 |

## 输入契约

| 元素 | 来源 | 必填 | 缺省 |
|------|------|:---:|------|
| scene 名 或 data.js 路径 | 调用方 | 是 | 询问调用方确认 |
| 目标语言切片 | 配置文件语言键 | 否 | 默认 `en`（按 I18n 一致性视角补齐检查） |
| 既有检查项的覆盖 | `references/check-rules.md` | 否 | 使用默认检查集 |

## 输出契约

| 产物 | 路径 | 模式 | 失败语义 |
|------|------|:---:|---------|
| `checklist/data.js` | `<scene>/checklist/data.js` | write | scene 路径不存在 → 拒绝 |
| `checklist/index.html` | `<scene>/checklist/index.html` | write | 必须包含 `#checklist-app` |
| `checklist/index.js` | `<scene>/checklist/index.js` | write | IIFE 包裹，命名空间隔离 |
| `checklist/index.css` | `<scene>/checklist/index.css` | write | 所有颜色走 `--yry-*` |

## 检查分类分级

| 类别 | 自动化 | 备注 |
|------|:---:|------|
| structural | ✅ | name / desc / tags / badge 字段完整性 |
| tag-quality | ✅ | modifier 语义对齐 |
| link-hygiene | ✅ | `links` 三态（null / [] / [...]）|
| standard | ✅ | `·` 分隔符、`<strong>`、具体数字 |
| i18n | ✅（如多语言） | 结构、标签数、badge 不翻译 |
| human-judgment | ⏸️ pending | desc 准确性、tag 语义、视觉一致性 |

## 路径所有权矩阵

| 路径 | 权限 | 理由 |
|------|:---:|------|
| `<this-skill-dir>/` | r+w | 自身配置 |
| `<this-skill-dir>/references/check-rules.md` | read-only | 检查集权威 |
| `<scene>/data.js`（输入） | read | 不修改源 |
| `<scene>/checklist/`（输出） | write | 自有产物 |
| 主题 CSS / `--yry-*` | read | 来自 [[rui-theme]] |

## 自我隔离硬规则

| # | 规则 | 设计理由 | 违反处置 |
|---|------|---------|---------|
| 1 | 不修改输入的 `data.js` | 源数据所有权归 rui-scene | 拒绝执行 |
| 2 | 不替代 rui-scene 角色，不重写卡片描述/标签 | 卡片内容生成归属 rui-scene | 仅生成 reviewer 视角的检查项 |
| 3 | 检查项 ID 命名严格遵循 `references/check-rules.md` 既有 ID | 跨项目一致 | 报错并列出合法 ID |
| 4 | `index.js` 必须 IIFE 包裹，禁止 `window.CHECKLIST_*` 之外的全局副作用 | 隔离命名空间 | 报错并阻止渲染 |
| 5 | 所有 `status` 只能是 `pass` / `fail` / `warn` / `pending` — 不允许语义别名 | 结果可机读 | 校验失败时跳过该卡片 |
| 6 | 不持久化远端状态 — `localStorage` 仅用于 checkbox 勾选状态 | 不引入后端 | 数据损坏时自动重置 |

## 失败与降级

| 场景 | 行为 | 恢复方式 |
|------|------|---------|
| scene 不存在 | 报错并询问调用方 | 提供备选 scene 列表 |
| 数据中无任何卡片 | 退出，提示"无可审计内容" | 先用 [[rui-scene]] 生成数据 |
| 多语言结构不一致 | 标 `i18n-structure` 失败，不阻塞页面生成 | 修复源数据后重跑 |
| 主题 CSS 加载失败 | 静态 fallback 颜色注入 | 提醒上游 rui-theme 缺失 |
| Vue CDN 不可达 | 提示改用纯静态 HTML | 引入 Vue 本地副本 |

## 与兄弟技能的关系

| 技能 | 方向 | 接口 | 说明 |
|------|------|------|------|
| [[rui-scene]] | 上游 | `<scene>/data.js` | 提供被审计的卡片数据 |
| [[rui-demos]] | 上游（可选） | `<scene>/demos/<slug>/data.js` | demo 场景的卡片同样可审 |
| [[rui-html]] | 平行 | 不调用，主题层互不干扰 | 同源主题 |

## 集成点

> 当前状态：本技能为按需调用工具，无定时或管线级集成。任何"生成即自动检查"需求需由管线协调器显式串联 rui-scene → rui-checklist，否则审计节奏由人工决定。
