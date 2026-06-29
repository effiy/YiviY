---
paths:
  - ".claude/rui-theme/**"
  - ".claude/rui-theme/SKILL.md"
description: "10 套主题预设 + 自定义主题生成的 token 契约与所有权边界。"
---

# rui-theme 主题契约

> 主题预设 + 自定义主题输出，所有 `--yry-*` token 命名与作用域边界在此固化。

## 角色定位

| 维度 | 取值 |
|------|------|
| 输入 | 主题名（10 套预设）或描述（自定义）|
| 输出 | `themes/<name>.md`（预设文档）或生成 CSS（自定义）|
| 调用模式 | 用户选择 → 应用到外部 artifact（slide / doc / HTML 页）|
| 状态 | 写 `<this-skill-dir>/themes/` 和输出 CSS；不主动修改页面 |

## 10 套预设清单

| # | 名称 | 调性 |
|:---:|------|------|
| 1 | Ocean Depths | 专业冷静海蓝 |
| 2 | Sunset Boulevard | 暖橙夕阳 |
| 3 | Forest Canopy | 自然大地色 |
| 4 | Modern Minimalist | 极简灰白 |
| 5 | Golden Hour | 暖秋金 |
| 6 | Arctic Frost | 冷脆冬 |
| 7 | Desert Rose | 柔粉灰 |
| 8 | Tech Innovation | 鲜明科技 |
| 9 | Botanical Garden | 清新植物 |
| 10 | Midnight Galaxy | 戏剧性深色 |

## `--yry-*` Token 契约

| 类别 | Token 示例 | 数量级 |
|------|----------|:---:|
| 背景 | `--yry-bg-card` / `--yry-bg-flat` / `--yry-bg-raised` | 3+ |
| 文本 | `--yry-text` / `--yry-text-soft` / `--yry-text-muted` | 3+ |
| 主色 | `--yry-accent` | 1 |
| 状态 | `--yry-pass` / `--yry-warn` / `--yry-fail` | 3+ |
| 边框 | `--yry-border-color` | 1+ |

> 10 套主题必须定义**同名** `--yry-*`。换主题 = 改一个 `<link>`，零代码改动。这是项目层强约束。

## 工作流分类

| 阶段 | 必做 | 禁止 |
|------|------|------|
| 展示选项 | 渲染 `theme-showcase.pdf`（只读）| 修改 PDF |
| 选择 | 用户显式确认 | 默认应用 |
| 应用 | 读 `themes/<name>.md`，提取 hex + 字体 | 修改 `themes/` 内既有文件 |
| 自定义 | 接收描述，调用 `scripts/generate-theme.py` | 在生产页 inline 写颜色 |

## 路径所有权矩阵

| 路径 | 权限 | 备注 |
|------|:---:|------|
| `<this-skill-dir>/themes/*.md` | r+w | 预设文档权威 |
| `<this-skill-dir>/theme-showcase.pdf` | read-only | 视觉展示 |
| `<this-skill-dir>/scripts/generate-theme.py` | r+w | owned |
| `<output>.css` | write | 用户指定输出位置 |
| `cdn/theme/<name>.css` | write（约定）| 主题作者发布 |
| 任意 caller page 的内联颜色 | **no write** | 调用方负责注入 |
| 主题内的字体源（Google Fonts URL）| read-only | 引用 |

## 自我隔离硬规则

| # | 规则 | 设计理由 | 违反处置 |
|---|------|---------|---------|
| 1 | token 命名严格锁定 `--yry-*`，不增删，不改名 | 跨主题可互换 | 校验失败 |
| 2 | 不主动把 CSS 注入任意 page（`docs/`、`docs/views/` 等）| 调用方责任 | 阻断 |
| 3 | 必须先 show 主题选项让用户选 — 不可默认挑一套 | 用户决策权 | 阻塞 |
| 4 | `theme-showcase.pdf` 只读 — 不得修改 | 权威性 | 校验 |
| 5 | 自定义主题输出 hex 必须满足对比度（正文 ≥ 4.5:1，次级 ≥ 3:1）| 可访问性 | 自动拒绝低对比 |
| 6 | 不替代 [[rui-ui]] 设计情报查询 — 本技能是 preset/font/color 的**权威** | 单一来源 | 平行使用 |
| 7 | 不实现 dark/light 切换 — 每套主题是完整预设 | 与 [[rui-html]] 职责正交 | 拒绝 |
| 8 | 字体配对必须单一场景可读（heading + body），不能多字体堆砌 | 视觉一致 | 警告 |
| 9 | 修改既有 `themes/*.md` 必须保留原有色卡结构（新增 section 而非替换）| diff 友好 | 拒绝覆盖 |

## 失败与降级

| 场景 | 行为 | 恢复方式 |
|------|------|---------|
| 用户描述含糊（"好看点"）| 询问上下文（场景 / 行业 / 调性）| 进一步对话 |
| 生成主题失败（脚本异常）| 返回最近一次预设 | 提示手动选择 |
| 嵌入字体网络不可达 | 降级到系统字体栈 | 控制台警告 |
| 对比度不足 | 自动调亮前景或深色背景 | 报告并接受 |
| `themes/<name>.md` 已存在同名自定义 | 备份为 `<name>-<timestamp>.md` 后写新 | 用户决策 |

## 与兄弟技能的关系

| 技能 | 方向 | 接口 | 说明 |
|------|------|------|------|
| [[rui-html]] | 下游 | 注入 `--yry-*` link | 主题切换方 |
| [[rui-demos]] | 下游 | 注入 `cdn/theme/<name>.css` | Demo 渲染 |
| [[rui-graph]] / [[rui-diagram]] | 下游 | dark theme 颜色 source | 架构图 / 代码图 |
| [[rui-ui]] | 平行（不替代）| UI 情报查询 vs 主题预设 | 两者并存 |
| [[rui-checklist]] | 下游 | `--yry-*` tokens | 静态清单页 |

## 集成点

> 当前状态：本技能无管线级自动调用。所有主题选择与切换发生在用户与 [[rui-html]] / [[rui-demos]] / [[rui-graph]] / [[rui-diagram]] 的对话中，由它们显式调用 rui-theme 选择主题。本技能不内置"页面加载即应用主题"的监听逻辑。
