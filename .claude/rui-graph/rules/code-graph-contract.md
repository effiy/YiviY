---
paths:
  - ".claude/rui-graph/**"
  - ".claude/rui-graph/SKILL.md"
description: "Python 源码依赖图生成的边界与 Cytoscape 数据契约。"
---

# rui-graph 代码图契约

> 对 Python 源码做 AST 级分析并产出 Cytoscape 可消费的交互式依赖图，所有路径与渲染边界在此固化。

## 角色定位

| 维度 | 取值 |
|------|------|
| 输入 | 用户指定的 Python 源码目录 |
| 输出 | `graph/` 子目录的 4 文件包 + `code-analysis.json` + `graph-data.json` |
| 调用模式 | 5 阶段管线（Pre-flight → Parse → Build → Validate → Generate）|
| 状态 | 仅读取源目录，写入 `graph/` 子目录 |

## 5 阶段产物

| 阶段 | 输入 | 输出 | 失败语义 |
|------|------|------|---------|
| 0 Pre-flight | 用户参数 | 配置 + source manifest | 用户输入缺失 → 询问 |
| 1 Parse & Analyze | `.py` 源 | `code-analysis.json` | 解析失败 → 报错并跳过该文件 |
| 2 Build Graph | `code-analysis.json` | `graph-data.json` | 引用冲突 → 在校验阶段处理 |
| 3 Validate | `graph-data.json` | 验证报告 | dangling edge → drop |
| 4 Generate | `graph-data.json` | 4 文件 + `meta` | 模板 404 → 阻塞生成 |

## 数据契约

### Node（4 类型）

| Type | 来源 | 形态 | 颜色 | 大小 |
|------|------|------|------|------|
| `file` | 每个 `.py` 文件 | round-rect | `#38bdf8` (Sky) | 120–160 by line count |
| `class` | ClassDef 节点 | hexagon | `#a78bfa` (Violet) | 110×95 |
| `function` | FunctionDef | ellipse | `#34d399` (Emerald) | 125×48 |
| `module` | `__init__.py` | diamond | `#fbbf24` (Amber) | 80×80 |

### Edge（5 类型）

| Type | From → To | 形态 | 含义 |
|------|-----------|------|------|
| `imports` | file → file | 实线箭头 | 导入 |
| `calls` | function → function | 虚线箭头 | 调用（同文件内 best-effort）|
| `inherits` | class → class | 粗实线箭头 | 继承 |
| `contains` | file → class/function | 实线无箭头 | 包含 |
| `exports` | init → submodule | 点状青色箭头 | 重新导出 |

### 必填字段

| 节点字段 | 必填 | 说明 |
|---------|:---:|------|
| `id` | 是 | 类型化 ID，如 `file:yt_dlp/utils.py` |
| `type` | 是 | file / class / function / module |
| `label` | 是 | 显示名 |
| `path` | file | 相对源码根 |
| `tier` | file | core / library / utility |
| `lines` | file | 行数 |

| 边字段 | 必填 | 说明 |
|--------|:---:|------|
| `id` | 是 | `<src>:<tgt>:<type>` |
| `source` | 是 | 节点 ID |
| `target` | 是 | 节点 ID |
| `type` | 是 | 五种之一 |

## 文件层分级

| Tier | 行数 | 行为 |
|------|:---:|------|
| core | >1000 或顶层 `main()` | 加粗、hub 节点特征 |
| library | 100–1000 | 标准 |
| utility | <100 | 缩小、可隐藏 |

## 三种模式

| 模式 | 输入 | 输出差异 |
|------|------|---------|
| `full`（默认） | 源码目录 | 全节点 + 全边 |
| `modules` | `--mode modules` | 仅 file + module + imports/exports |
| `deep` | `--mode deep --module <name>` | 单包深掘 + 直接依赖 |

## 路径所有权矩阵

| 路径 | 权限 | 备注 |
|------|:---:|------|
| `<this-skill-dir>/resources/{index.html,index.js,index.css,data.js}` | read-only | 模板 |
| `docs/views/<name>/graph/` | write | 默认输出 |
| 用户指定 `<path>/graph/` | write | 自定义输出 |
| 用户指定的源目录 | **read-only**（AST 分析） | 严禁修改源 |
| `site-packages/<pkg>/` | read-only | 默认常见路径 |
| 输出目录的 `graph-data.json` | write | 增量参考 |

## 排除规则（默认）

| 路径 | 原因 |
|------|------|
| `extractor/`, `downloader/`, `postprocessor/` | 插件目录，节点爆炸 |
| `test/`, `tests/` | 测试代码 |
| `compat/` | 兼容垫片 |

## 自我隔离硬规则

| # | 规则 | 设计理由 | 违反处置 |
|---|------|---------|---------|
| 1 | 仅解析 `.py` 文件 — 其他语言拒收 | 范围明确 | 提示用 [[rui-diagram]] |
| 2 | 节点 ID 前缀类型化（`file:` / `class:` / `func:` / `module:`）| 跨图合并可识别 | 校验失败 |
| 3 | 边 `(source, target, type)` 三元组去重 | 重复边无意义 | dedup |
| 4 | 自引用边（source === target）必须丢弃 | 视觉上无意义 | 校验过滤 |
| 5 | 类 / 函数必须有 `contains` 边挂到 file | 图完整性 | 自动补 |
| 6 | 调用深度 ≤ 10（含警告），超出时简化 | 防止过度递归 | 警告后保留 |
| 7 | Cytoscape CDN 上的 SRI 不可修改 | 完整性 | 报错 |
| 8 | 节点 / 边 ID 全局唯一（不允许引用其他图）| 隔离 | 报告冲突 |
| 9 | cytoscape 边方向：含 source→target 的方向性是显示属性，绝不依赖它做语义 | 视觉 vs 数据分离 | 文档化 |

## 失败与降级

| 场景 | 行为 | 恢复方式 |
|------|------|---------|
| Python 文件语法错误 | 跳过该文件，记录到验证报告 | 用户修复后重跑 |
| 多模块同名类 | 生成 `"<Class>:<module>"` 形式 ID | 提示可能冲突 |
| 跨包 import 无法解析 | 记录为 unresolved edge（保留 source 节点） | 提示用户检查 PYTHONPATH |
| 类继承自外部依赖 | dangling edge → drop | 报告弃置 |
| 环状调用深度 | cap 10 后截断 | 提示 |
| Cytoscape 渲染失败 | 退化为静态 SVG 概要图 | 提示改用浏览器 |
| 源目录含非 `.py` 文件 | 静默忽略 | 无 |

## 与兄弟技能的关系

| 技能 | 方向 | 接口 | 说明 |
|------|------|------|------|
| [[rui-html]] | 下游 | `docs/views/<name>/graph/index.html` | 4 文件结构下游可消费 |
| [[rui-theme]] | 上游 | `--yry-*` CSS | 主题适配 |
| [[rui-diagram]] | 不相交 | KG vs AST | 不同的抽象层 |
| [[rui-demos]] | 不相交 | 演示页 vs 依赖图 | 各自独立产物 |

## 集成点

> 当前状态：本技能无自动触发。调用通常源于"看一下这段 Python 代码结构"的对话需求。如未来需要"代码改动即重生成图"，应复用 [[rui-diagram]] Phase 0 增量指纹而非在 rui-graph 内独立实现 — 避免两套指纹系统漂移。
