# rui-checkout · Templates

行动项跟踪页模板，聚合自健康报告与架构报告。

| 模板 | 用途 |
|------|------|
| `checkout/` | 完整 4 文件：进度条 + 过滤栏 + 行动卡片 |

## 字段契约

每个 action：

| 字段 | 含义 |
|------|------|
| `id` | 稳定标识（如 `A7.1` / `ARCH-3`） |
| `title` | 一句话行动 |
| `priority` | `P0` / `P1` / `P2` / `P3` |
| `source` | `health` / `architecture` |
| `phase` | 阶段标签（如 `Phase 1` / `Week 2`） |
| `before` | 当前基线指标描述 |
| `after` | 期望达到的指标描述 |
| `steps[]` | 顺序的子步骤（每步独立可勾选） |
| `status` | 默认 `todo` / `in_progress` / `done` / `blocked` |
| `critical` | 是否关键路径 |

## 持久化

通过 `localStorage` 持久化 step 与 action 状态（key: `rui-checkout-state-v1`），刷新后恢复。