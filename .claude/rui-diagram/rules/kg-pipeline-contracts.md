---
paths:
  - ".claude/rui-diagram/**"
  - ".claude/rui-diagram/SKILL.md"
description: "知识图谱与 SVG 架构图的边界、所有权与跨技能契约。"
---

# rui-diagram KG 与 SVG 契约

> Phase 0 输出知识图谱（Knowledge Graph）、Mode A 输出 SVG 架构图，所有路径与渲染边界在此固化。

## 角色定位

| 维度 | 取值 |
|------|------|
| 输入 | 用户意图 + 可选源代码树 |
| 输出 | `.diagram/knowledge-graph.json`（Phase 0）或自包含 HTML+SVG（Mode A）|
| 调用模式 | 多阶段管线（Phase 0.0–0.7）+ 按需 Mode A |
| 状态 | 写产物（`.diagram/` 与 `docs/views/.../diagram/`），其余只读 |

## Phase 0 多阶段产物

| 阶段 | 写产物 | 读产物 | 失败语义 |
|------|--------|--------|---------|
| 0.0 Pre-flight | `.diagram/fingerprint.json` | git worktree、`.gitignore` | 输出 `.diagramignore` 自动生成 |
| 0.1 SCAN | `scan-result.json` | 源码树 | 解析失败 → 跳过该语言 |
| 0.2 ANALYZE | `batch-graph-N.json` ×N | `scan-result.json` | subagent 重试 1 次 |
| 0.3 ASSEMBLE | `merged-graph.json` | 所有 batch | review-rejected → 重做 Phase 0.2 |
| 0.4 ARCHITECTURE | `layers.json` | `merged-graph.json` | 节点无层 → 单独"未分类"层 |
| 0.5 TOUR | `tour.json` | `merged-graph.json` | 入度 0 节点作 root |
| 0.6 VALIDATE | 验证报告 | KG 全量 | 阻塞 critical 级问题 |
| 0.7 SAVE | `knowledge-graph.json` + `meta.json` + `fingerprint.json` | 所有 KG 中间产物 | 任何错误 → 部分保存 |

## KG 数据契约

| 字段 | 类型 | 必填 | 备注 |
|------|------|:---:|------|
| `version` | string | 是 | `"1.0.0"` |
| `kind` | enum | 否 | `codebase` \| `knowledge` |
| `project` | object | 是 | 含 commit hash |
| `nodes` | GraphNode[] | 是 | 21 类型之一 |
| `edges` | GraphEdge[] | 是 | 35 类型/8 类别 |
| `layers` | Layer[] | 是 | 每个节点恰好 1 层 |
| `tour` | TourStep[] | 是 | 5–15 步 |
| `diffImpact` | DiffImpact | 否 | 增量模式产生 |

### 节点类型（21）

| 类别 | 成员 |
|------|------|
| Code | file · function · class · module · concept |
| Non-Code | config · document · service · table · endpoint · pipeline · schema · resource |
| Domain | domain · flow · step |
| Knowledge | article · entity · topic · claim · source |

### 边类型（35）

| 类别 | 类型数 | 成员 |
|------|:---:|------|
| Structural | 5 | imports · exports · contains · inherits · implements |
| Behavioral | 4 | calls · subscribes · publishes · middleware |
| Data Flow | 4 | reads_from · writes_to · transforms · validates |
| Dependencies | 3 | depends_on · tested_by · configures |
| Semantic | 2 | related · similar_to |
| Infrastructure | 4 | deploys · serves · provisions · triggers |
| Schema/Data | 4 | migrates · documents · routes · defines_schema |
| Domain/Knowledge | 9 | contains_flow · flow_step · cross_domain · cites · contradicts · builds_on · exemplifies · categorized_under · authored_by |

## 路径所有权矩阵

| 路径 | 权限 | 备注 |
|------|:---:|------|
| `.diagram/` | write | KG 主产物落点 |
| `.diagram/knowledge-graph.json` | write（覆盖） | 主产物 |
| `.diagram/meta.json` | write | 时间戳与统计 |
| `.diagram/fingerprint.json` | write | 增量基线 |
| `.diagramignore` | write（首次自动生成） | 排除规则 |
| `<this-skill-dir>/references/` | read-only | 规范权威 |
| `<this-skill-dir>/resources/template.html` | read-only | Mode A 模板 |
| `docs/views/<name>/diagram/index.html` | write | Mode A 移交 [[rui-html]] 时的落点 |
| git worktree 检测到 → 重定向到主仓库 | rewrite path | 防散落 |
| 任何源代码路径 | **no write** | 仅读取 / 扫描 |

## 自我隔离硬规则

| # | 规则 | 设计理由 | 违反处置 |
|---|------|---------|---------|
| 1 | 每个节点恰好在 1 个层 — 不允许空层或重复层 | KG 完整性 | 校验失败阶段重做 Phase 0.4 |
| 2 | Alias map 处理 60+ 节点类型别名与 50+ 边别名 — 不要在调用方硬编码 | 防 LLM 漂移 | 引用既有 alias |
| 3 | Import 边 1:1 — 一条 import 对应一条边，不聚合 | 可溯源 | 自动去重保留一条 |
| 4 | SVG 箭头 z-order：先背景、边、最后 box | 视觉对齐 | 视觉自检失败重排 |
| 5 | 半透明 box 后必须有 opaque `#0f172a` background rect | 视觉重叠修正 | 强制注入 |
| 6 | Legend 必须位于所有 boundary box 外（≥20px） | 不遮挡 | 自动校验 |
| 7 | `html2canvas`/`jsPDF` SRI 哈希不动 — 改前必须重算 | 完整性保护 | 报错并阻止 |
| 8 | Worktree 中执行的产物必须重定向到主仓库 | 防散落多副本 | 自动检测 |
| 9 | 增量指纹：仅 SKIP/PARTIAL/ARCHITECTURE/FULL 四档 — 不增新档 | 决策矩阵稳定 | 落档失败 → 全量重跑 |

## 失败与降级

| 场景 | 行为 | 恢复方式 |
|------|------|---------|
| git worktree 嵌套 | 输出重定向到主仓库根 | `pwd` 检测主仓库 |
| tree-sitter 缺某语言语法 | 跳过该文件，下游 reviewer 标 warning | 提示安装对应 parser |
| LLM 子代理超时 | 重试 1 次，仍失败 → 用 base node 占位 | partial 保存 |
| 节点未分类到任何层 | 自动新建 `Unclassified` 层 | 报告占位层 |
| 边引用不存在的节点 | 自动断开并报告 | 列出 dangling 边 |
| SVG 视觉冲突 | 调整 layout + 自动 spacing | 自检 checklist |
| Mode A 调用但无 Phase 0 | 立即报错，推荐先 Phase 0 | 强制执行 Phase 0 |

## 与兄弟技能的关系

| 技能 | 方向 | 接口 | 说明 |
|------|------|------|------|
| [[rui-html]] | 下游 | `knowledge-graph.json` | 嵌入 SVG |
| [[rui-theme]] | 上游 | 颜色/字体 | Mode A 渲染 |
| [[rui-ui]] | 上游（可选） | 层配色灵感 | layer palette |
| [[rui-graph]] | 不相交 | AST vs KG 抽象 | 用 [[rui-graph]] 看代码依赖 |
| [[rui-skill]] | 评估目标 | 可针对 rui-diagram 写 evals | 评测管线 |

## 集成点

> 当前状态：本技能无自动调度，所有调用来自 rui-html 转交或人工触发。若未来加入"代码变动即重生成"的工作流，应通过管线协调器在 git post-commit hook 显式调用，避免与 Phase 0 增量指纹内置逻辑重复调度。
