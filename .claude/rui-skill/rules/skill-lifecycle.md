---
paths:
  - ".claude/rui-skill/**"
  - ".claude/rui-skill/SKILL.md"
description: "技能的创建、迭代、评估与描述优化的全生命周期契约。"
---

# rui-skill 生命周期契约

> 管理其他技能的元生命周期：创建、改进、评测、描述优化。所有 eval 流水线与脚本路径边界在此固化。

## 角色定位

| 维度 | 取值 |
|------|------|
| 输入 | 用户意图（draft / improve / benchmark / describe）|
| 输出 | 修订后的 `<other-skill>/SKILL.md`、eval 工件、benchmark 报告 |
| 调用模式 | 主循环（draft → test → review → improve → repeat）|
| 状态 | 写 `<target-skill>/`、`workspace/`，读 skills / claude 进程 |

## 5 阶段产出矩阵

| 阶段 | 写产物 | 风险 | 阻断 |
|------|--------|:---:|:---:|
| Capture Intent | `notes.md`（用户访谈）| 低 | 无 |
| Interview | 草稿 `SKILL.md` | 中 | 用户确认 |
| Run Eval | `<workspace>/iteration-N/eval-X/{with_skill,without_skill}/outputs/` | 中 | 无 |
| Grade | `grading.json` | 低 | 无 |
| Aggregate / Viewer | `benchmark.json` + `benchmark.md` + HTML viewer | 低 | 无 |
| Improve | 修订 `SKILL.md` | 中 | 用户 gate |
| Describe Optimize | 替换 `description` 前置数据 | 高 | 用户 gate |
| Package | `.skill` 文件 | 低 | 无 |

## Eval 数据契约

| 文件 | 字段 | 必填 | 说明 |
|------|------|:---:|------|
| `evals/evals.json` | `skill_name` | 是 | 目标技能 |
| | `evals[].id` | 是 | 唯一 |
| | `evals[].prompt` | 是 | 用户自然语言测试 prompt |
| | `evals[].expected_output` | 是 | 期望描述 |
| | `evals[].files` | 否 | 输入文件 |
| | `evals[].assertions[]` | 加测时填 | 量化断言 |
| `eval_metadata.json` | `eval_id`、`eval_name`、`prompt`、`assertions` | 是 | grader 读取 |
| `grading.json` | `expectations[]: { text, passed, evidence }` | 是 | **字段名固定** |
| `benchmark.json` | pass_rate / time / tokens per configuration | 是 | viewer schema |
| `timing.json` | `total_tokens`、`duration_ms` | 是 | 唯一窗口 |

> viewer 锁定 `expectations` 字段名为 `{ text, passed, evidence }` — 任何别名将导致渲染失败。

## 描述优化硬约束

| # | 规则 | 理由 |
|---|------|------|
| 1 | 训练 / 测试集 60 / 40 切分；按测试集分选出 `best_description` | 防 overfit 训练集 |
| 2 | 每个 query 跑 3 次取稳定触发率 | 降低方差 |
| 3 | max-iterations 默认 5 | 防止无意义循环 |
| 4 | `best_description` 仅替换 `description`，不动 `name` 与正文 | description 是触发唯一变量 |
| 5 | eval queries 必须实质（多步 / 领域专用），不可单步 trivial | 单步 prompt 不触发任何技能 |

## 路径所有权矩阵

| 路径 | 权限 | 备注 |
|------|:---:|------|
| `<target-skill>/SKILL.md` | write（用户 gate 后）| 被管理的目标技能 |
| `<target-skill>/` 其他文件 | read | 只在描述优化范围内改 frontmatter |
| `<this-skill-dir>/scripts/` | r+w | owned |
| `<this-skill-dir>/agents/`, `references/`, `assets/` | r+w | owned |
| `<workspace>/iteration-N/` | write | 用户指定的 evals workspace |
| `<workspace>/iteration-N/skill-snapshot/` | write（首轮） | baseline 副本 |
| `feedback.json` | read | viewer 输出 |
| 任何 `<target-skill>/SKILL.md` 之外的工作区路径 | no | 由用户在调用时指定 |

## 自我隔离硬规则

| # | 规则 | 设计理由 | 违反处置 |
|---|------|---------|---------|
| 1 | **不擅自创建 / 修改任意技能** — 必须经过用户 gate | 元技能权限极高 | 阻塞提示 |
| 2 | 不在描述优化过程中修改 `name` 与 body | description 是单一变量 | 校验拒绝 |
| 3 | **不要** 对 `rui-skill` 自身写 evals 时调用自己（自指环）| 元层稳定 | 阻塞 |
| 4 | **不要** 在盲对比过程中向 comparator 透露 A/B 身份 | 防偏差 | 校验 schema |
| 5 | grader output schema 严格 `{ text, passed, evidence }` | viewer 依赖 | 替换字段报错 |
| 6 | viewer 必须经 `generate_review.py` 生成（不要写自定义 HTML）| 视觉一致 | 阻塞提示 |
| 7 | 描述优化的触发 eval queries 须经用户审阅方可运行 | 防跑偏 | 阻塞 |
| 8 | skills 安装路径可能只读 — 修改前复制到 `/tmp/` 或 `<workspace>/` | 防权限错误 | 复制 |
| 9 | runner 同时启动 with-skill 与 baseline 子代理（同一批） | 防测量时机偏差 | 强制同批 |
| 10 | benchmark 必须按 with_skill 在前、baseline 在后输出 | viewer 排序 | 重排序 |
| 11 | 生成报告前**强制**完成 viewer 渲染（先人工再自动化）| 防止绕过评审 | 阻塞 |

## 失败与降级

| 场景 | 行为 | 恢复方式 |
|------|------|---------|
| eval prompt 不可执行（缺文件 / 路径错）| runner 报错但不影响其他 eval | 修复 prompt |
| grader 失败（无法判定某个 assertion）| 在 grading.json 中标 `passed: false` + evidence 说明 | 人工裁判 |
| 描述优化找不到 `best_description`（多 iteration 全失败）| 保留原始 description | 报告与重新设置 eval |
| viewer 在 Cowork / 无浏览器环境 | `--static` 模式生成 HTML 文件 | 用户手动打开 |
| subagent timeout | 单 eval 失败不影响其他 | 重试该 eval 一次 |
| `feedback.json` 多版本（下载多次）| 取 Downloads 最新 | 提示用户手动清理 |
| baseline 性能 < with-skill 性能 | 接受现状（可能合理）| 在 analyst 报告中标注 |

## 与兄弟技能的关系

| 技能 | 方向 | 接口 | 说明 |
|------|------|------|------|
| 任何 rui-\* | 上游（被管理）| `SKILL.md` 引用 | 评估对象 |
| (无) | 下游 | rui-skill 不被任何其他技能调用 | 顶层元技能 |

## 集成点

> 当前状态：本技能无自动调度。所有 eval / 迭代源于用户在对话中显式触发。如未来需要"PR 即评测"流程，应通过外部 CI hook 显式调用 `aggregate_benchmark.py`，不在 rui-skill 内实现内置 trigger，避免阻塞主对话节奏。
