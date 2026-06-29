# Self-Improvement Analysis Report

多轮检查数据的综合分析：趋势预测、复发检测、修复速率、稳定性评估、数据驱动建议。

## Report Generation

**触发**: 用户说"trend analysis", "趋势分析", "improvement report", "自改进报告"

**输入**: `<this-skill-dir>/logs/effects.jsonl` — 历史检查记录

**输出**: `docs/views/improvement-report/index.html` — 4-file 组件化报告页面

## Report Sections

### 1. 健康分趋势 (Health Score Trend)

折线图展示健康分随时间变化：

```
100 ┤
 90 ┤                    ╭─●──●──●
 80 ┤              ╭─●──╯
 70 ┤        ╭─●──╯
 60 ┤  ●──●─╯
 50 ┤
    └───┴───┴───┴───┴───┴───┴───┴───
    6/15 6/18 6/21 6/24 6/27 6/30 7/3
```

**预测**: 基于最近 5 次数据点，线性外推未来 3 次检查的趋势。

| 当前 | 趋势 | 预测 (3 轮后) | 置信度 |
|------|------|--------------|--------|
| 85 | 📈 上升 (+3/轮) | ~94 | High (R²=0.89) |
| 72 | 📉 下降 (-2/轮) | ~66 | Medium (R²=0.45) |
| 85 | ➡️ 平稳 (±0) | ~85 | High (R²=0.95) |

### 2. 问题分类演进 (Category Evolution)

按检查类别分组，展示各分类的 fail 数变化：

| 类别 | 6/15 | 6/20 | 6/25 | 6/29 | 趋势 |
|------|------|------|------|------|------|
| structural | 12 | 8 | 4 | 2 | 📉 ↓ |
| tag-quality | 8 | 6 | 4 | 3 | 📉 ↓ |
| link-hygiene | 4 | 3 | 2 | 1 | 📉 ↓ |
| standard | 3 | 2 | 1 | 0 | ✅ 清零 |
| i18n | 5 | 4 | 3 | 3 | ➡️ 停滞 |

### 3. 自动修复贡献 (Auto-Fix Contribution)

| 检查轮次 | 总修复 | 自动修复 | 人工修复 | 自动率 |
|----------|--------|----------|----------|--------|
| 1 (6/15) | 10 | 4 | 6 | 40% |
| 2 (6/20) | 15 | 7 | 8 | 47% |
| 3 (6/25) | 12 | 5 | 7 | 42% |
| 4 (6/29) | 8 | 5 | 3 | 63% |

### 4. 复发检测 (Regression Detection)

检测之前修复过但再次出现的问题：

```
🔄 复发问题:
  1. tag-semantic (card: 'Code Health')
     首次修复: 6/20 | 复发: 6/29
     历史: pass(fix)→fail(regression)
     建议: 检查 modifier 规则是否在卡片更新时被覆盖

  2. struct-desc-dot (card: 'TTS Config')
     首次修复: 6/25 | 复发: 6/29
     历史: pass(fix)→fail(regression)
     建议: desc 被重新编辑，需建立 lint 规则防止逗号使用
```

### 5. 修复速率 (Fix Velocity)

| 指标 | 数值 | 评级 |
|------|------|------|
| 日均修复数 | 3.2 项 | 🟡 正常 |
| fail → pass 平均天数 | 2.3 天 | 🟢 快 |
| warn → pass 平均天数 | 5.1 天 | 🟡 正常 |
| 最慢修复类别 | i18n (7 天) | 🔴 慢 |
| 修复效率 | 63% | 🟢 高 |

### 6. 稳定性评估 (Stability Assessment)

| 维度 | 评估 | 说明 |
|------|------|------|
| 健康分稳定性 | 🟢 稳定 | 连续 4 轮上升，无大幅波动 |
| 问题复发率 | 🟡 一般 | 2 次复发，建议加强 lint 保护 |
| 新问题引入率 | 🟢 低 | 新增卡片引入问题 <2 个/轮 |
| 自动修复覆盖率 | 🟢 高 | 63% 的问题可自动修复 |
| 人工处理效率 | 🟡 一般 | 人工项平均 2.3 天处理 |

### 7. 数据驱动建议 (Data-Driven Recommendations)

基于趋势分析的具体建议：

```
📋 改进建议 (按优先级):

P0 — 立即处理:
  • i18n 类别问题已停滞 3 轮未改进 → 安排专人集中处理

P1 — 本周处理:
  • tag-semantic 复发 1 次 → 建立 modifier 自动校验规则
  • 人工修复率偏低 (37%) → 考虑增加更多自动修复规则

P2 — 持续优化:
  • 当前趋势可预估 7/5 达到 94 分 → 目标 95 分
  • 自动修复率稳定 >60% → 可考虑 CI 集成自动修复
```

## Report File Structure

```
docs/views/improvement-report/
├── index.html    # Full page: trend chart (Chart.js) + category breakdown + recommendations
├── index.js      # Vue 3 app: chart rendering, data loading from effects.jsonl
├── index.css     # Dashboard styles, all var(--yry-*)
└── data.js       # Cached analysis data (generated from effects.jsonl)
```

## Usage

```bash
# Generate analysis report from effects.jsonl
node .claude/rui-checklist/templates/report/generate.mjs

# Open in browser
open docs/views/improvement-report/index.html
```
