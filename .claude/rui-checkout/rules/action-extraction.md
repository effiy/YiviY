---
paths:
  - ".claude/rui-checkout/**"
  - ".claude/rui-checkout/SKILL.md"
description: "从代码健康报告与架构分析报告中提取、分解、丰富行动项——规则、字段契约、依赖映射、前后量化标准。"
---

# rui-checkout 行动项提取规则

> 把报告的"发现"翻译成可执行的"行动项"——每条行动项必须有可验证的步骤、可量化的前后对比、可追踪的状态。

## 输入来源

| 报告 | 路径 | 全局变量 | 行动项来源 |
|------|------|---------|-----------|
| 代码健康报告 | `docs/views/健康报告/data.js` | `HEALTH_REPORT_CONFIG` | 每维度末尾的 `<table>` 中的 A* 行（A1.1–A7.4） |
| 架构分析报告 | `docs/views/架构报告/data.js` | `ARCH_REPORT_CONFIG` | KPI 面板 gauge 项 + s6–s8 缺陷卡片 + s12 行动项清单 |

## 行动项字段契约

每个行动项必须有以下字段——缺字段就是提取失败：

| 字段 | 类型 | 必填 | 来源 | 说明 |
|------|------|:---:|------|------|
| `id` | string | 是 | 报告原文 | 健康报告用 A* 编号，架构报告用 ARCH-N 编号 |
| `source` | enum | 是 | 推断 | `health-report` 或 `architecture-report` |
| `dimension` | string | 是 | 报告维度标题 | 如 "D7 Import Standards" |
| `dimensionZh` | string | 是 | 中文报告 | 如 "D7 导入规范" |
| `title` | string | 是 | 报告 action 列 | 英文摘要 |
| `titleZh` | string | 否 | 中文报告 | 中文摘要 |
| `priority` | enum | 是 | 报告 priority badge | P0 / P1 / P2 / P3-P4 |
| `phase` | enum | 是 | 推断 | phase-1 / phase-2 / phase-3 / phase-4 |
| `estimatedHours` | number | 是 | 报告 hours 列 | 数字，单位 h |
| `status` | enum | 是 | 默认 | todo / in_progress / done / blocked |
| `dependencies` | array | 是 | 推断 | 前置依赖的 action ID 列表 |
| `blocks` | array | 是 | 计算 | 被本项阻塞的 action ID 列表（反向依赖） |
| `criticalPath` | bool | 是 | 计算 | P0 且 blocks >= 2 → true |
| `steps` | array | 是 | 分解 | 2-5 个可验证步骤 |
| `before` | object | 是 | 报告数据 | 至少含 metric / score / consequence |
| `after` | object | 是 | 推断 | 至少含 metric / score；unlocks 可选 |

### 步骤字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|:---:|------|
| `id` | string | 是 | `${actionId}-s${n}` 格式 |
| `text` | string | 是 | 可在一个会话内完成的可验证操作 |
| `status` | enum | 是 | todo / in_progress / done（没有 blocked——步骤级不阻塞） |

### before/after 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|:---:|------|
| `metric` | string | 是 | 核心可量化指标——必须包含数字 |
| `score` | string | 否 | 关联的维度评分 |
| `consequence` | string | 是(before) | 当前状态的负面影响 |
| `unlocks` | string | 是(after) | 完成后解锁的能力/工具 |

## 提取规则

### 规则 1：数字必须从报告中提取，不能编造

```
✓ A7.1 before.metric: "37/63 files use star import (58.7%)"
  ↑ 数字来自健康报告 D7 维度 score 表格：37/63, 58.7%

✗ A7.1 before.metric: "Too many star imports"
  ↑ 没有数字——不可追踪
```

**验证**：每条 action 的 `before.metric` 和 `after.metric` 中至少包含一个数字。

### 规则 2：步骤分解粒度

每个步骤必须满足：
- **独立可验证**：看代码就能判断 done/not done
- **时间可控**：30min–2h 完成
- **有序**：步骤按自然顺序排列

```
反例（太粗）：
  Step 1: "修复所有导入问题"
  ↑ 无法判断何时算"完成"

正例：
  Step 1: "审计所有 _1_* 到 _12_* 文件，列出 star import 位置"
  Step 2: "将每个 star import 替换为显式命名导入"
  Step 3: "对 12 个文件运行 mypy 并修复类型错误"
  Step 4: "端到端验证管道仍正常运行"
```

### 规则 3：依赖关系推断

依赖关系从以下信号推断：

| 信号 | 推断 | 示例 |
|------|------|------|
| 同一文件被多个 action 涉及 | 先重构基础，再优化细节 | A1.1 (拆分 sidebar) → A5.1 (拆分 page_setting) |
| 一个 action 引入工具，另一个使用该工具 | 先引入工具，再使用 | A7.1 (去除 star import) → A7.4 (添加 ruff 规则) |
| 报告原文明确指出因果 | 直接映射 | 健康报告 §9 根因因果链 |
| 架构报告 KPI 项依赖健康报告改进 | 健康报告先行 | A7.x (导入清理) → ARCH-5 (CI/CD) |

### 规则 4：跨报告关联

健康报告和架构报告之间的关联：

| 健康报告 Action | 架构报告 Action | 关系 |
|----------------|----------------|------|
| A7.1–A7.4 (star import 清理) | ARCH-5 (CI/CD), ARCH-6 (测试), ARCH-7 (覆盖率) | 硬依赖——star import 阻止所有自动化工具 |
| A1.1 (拆分 UI) + A5.1 (拆分函数) | ARCH-1 (TTS 注册表), ARCH-2 (管道步骤) | 软依赖——模块化后才能有效重构 |
| A2.1–A2.3 (消除重复) | ARCH-3 (TTS 签名统一) | 强关联——共享工具模块是统一接口的基础 |
| A6.1–A6.2 (文档化) | ARCH-4 (可测试性) | 软关联——文档是测试可维护性的前提 |

### 规则 5：Phase 分配

| Phase | 优先级 | 特征 | 工时 |
|-------|--------|------|------|
| phase-1 (止血) | P0 | 阻塞性——不解决则无法引入任何自动化工具 | ~22h |
| phase-2 (修复) | P1 | 结构性——显著改善可维护性和可扩展性 | ~16h |
| phase-3 (巩固) | P2 | 工具性——改善开发体验和可读性 | ~8h |
| phase-4 (持续) | P3-P4 | 锦上添花——持续优化 | ~10h |

## 提取检查清单

生成 `actions[]` 后，逐项验证：

- [ ] 每条 action 的 `id` 唯一且可追溯到报告原文
- [ ] 每条 action 的 `before.metric` 包含具体数字
- [ ] 每条 action 的 `after.metric` 包含目标数字
- [ ] 每条 action 有 2-5 个步骤，每个步骤独立可验证
- [ ] `criticalPath: true` 的 action 必须是 P0 且 blocks ≥ 2
- [ ] 依赖图无环（A→B→C→A）
- [ ] 总工时与报告声明一致（健康报告 56h + 架构报告约 30h ≈ 86h 但考虑重叠后约 56h）
- [ ] 所有 `status` 初始值为 `todo`（生成时的默认状态）
- [ ] 跨报告依赖正确标记（health-report action 可以 blocks architecture-report action）

## 失败与降级

| 场景 | 行为 | 恢复方式 |
|------|------|---------|
| 一个报告缺失 | 仅从存在的报告提取，标记 `sources` 为单报告模式 | 创建另一个报告后重新生成 |
| 两个报告都缺失 | 报错退出，提示先创建报告 | 用对应工具生成报告 |
| 报告中没有行动项表格 | 从缺陷卡片和 KPI 面板推断行动项 | 提示用户确认推断结果 |
| 无法确定 before 数值 | 标记 `before.metric: "未测量"`，`status: blocked` | 手动运行测量工具后更新 |
| 依赖循环 | 打破循环——将最不紧迫的依赖改为软依赖 | 人工审核 |
