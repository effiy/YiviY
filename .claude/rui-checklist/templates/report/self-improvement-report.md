# 自改进分析报告模板 (Self-Improvement Analysis Report)

每次自改进循环完成后生成的结构化分析报告，追踪改进趋势并提供数据驱动的建议。

## 报告结构

```
SelfImprovementReport
├── meta: ReportMeta           # 报告元信息
├── executiveSummary: string   # 执行摘要（3-5 句）
├── healthTrend: HealthTrend   # 健康分趋势（多轮）
├── issueAnalysis: IssueAnalysis # 问题深度分析
├── improvementVelocity: Velocity # 改进速率
├── categoryBreakdown: CategoryBreakdown[] # 分类分解
├── riskAssessment: RiskAssessment # 风险评估
├── recommendations: Recommendation[] # 数据驱动建议
└── nextCycle: NextCycle       # 下轮计划
```

---

## 1. 报告元信息 (`ReportMeta`)

```javascript
{
  reportId: 'sir-20260629',
  generatedAt: '2026-06-29T18:00:00Z',
  period: {
    start: '2026-06-22',
    end: '2026-06-29',
    duration: '7天',
  },
  cyclesInPeriod: 5,           // 本周期内自改进循环次数
  scenesCovered: ['intro', 'quick-start', 'architecture'],
  healthScoreStart: 65,        // 周期开始健康分
  healthScoreEnd: 88,          // 周期结束健康分
  totalImprovement: +23,       // 总改进
}
```

## 2. 健康分趋势 (`HealthTrend`)

```javascript
{
  // 按日期排列的数据点
  dataPoints: [
    { date: '2026-06-22', score: 65, fail: 12, warn: 8, scene: 'intro' },
    { date: '2026-06-24', score: 72, fail: 8,  warn: 5, scene: 'intro' },
    { date: '2026-06-26', score: 78, fail: 5,  warn: 4, scene: 'intro' },
    { date: '2026-06-28', score: 85, fail: 3,  warn: 3, scene: 'intro' },
    { date: '2026-06-29', score: 88, fail: 2,  warn: 3, scene: 'intro' },
  ],
  // 趋势线
  trend: {
    direction: 'up',            // 'up' | 'down' | 'flat'
    slope: +3.5,               // 每周期平均改善分
    volatility: 2.1,           // 标准差 (越小越稳定)
    bestDay: { date: '2026-06-26', improvement: +6 },
    worstDay: { date: '2026-06-22', improvement: 0 },
  },
  // 预测
  forecast: {
    targetScore: 95,           // 目标分数
    estimatedCycles: 3,        // 预计还需几轮
    estimatedDate: '2026-07-05', // 预计达标日期
    confidence: 'high',        // 'high' | 'medium' | 'low'
  },
}
```

## 3. 问题深度分析 (`IssueAnalysis`)

```javascript
{
  // 高复发率问题（出现 ≥ 3 次）
  recurring: [
    {
      checkId: 'struct-desc-dot',
      occurrences: 4,
      affectedCards: ['🎬 Demo Viewer', '🎯 Comma Test', '📝 Vague Card', '🏠 Home'],
      trend: 'declining',      // 'declining' (好转) | 'stable' | 'increasing' (恶化)
      rootCause: '写作习惯 — 中文写作习惯用逗号分隔，未意识到需使用 · ',
      fixDifficulty: 'easy',   // 'easy' | 'medium' | 'hard'
    },
  ],
  // 新出现的问题
  new: [
    {
      checkId: 'tag-fingerprint',
      firstSeen: '2026-06-28',
      affectedCards: ['🔗 Link Test', '🔗 Link Test Clone'],
      likelyCause: '复制卡片后未修改 tags',
    },
  ],
  // 已根治的问题（连续 3 次 pass）
  resolved: [
    {
      checkId: 'std-badge-case',
      resolvedAt: '2026-06-24',
      previouslyAffected: ['📊 Code Health Report'],
      resolution: '自动修复 — 首字母转大写',
    },
  ],
}
```

## 4. 改进速率 (`ImprovementVelocity`)

```javascript
{
  // 各类别改进速度
  byCategory: {
    structural:    { start: 12, end: 2,  improved: 10, velocity: 'fast' },
    'tag-quality': { start: 5,  end: 1,  improved: 4,  velocity: 'medium' },
    'link-hygiene':{ start: 3,  end: 2,  improved: 1,  velocity: 'slow' },
    standard:      { start: 3,  end: 0,  improved: 3,  velocity: 'fast' },
    i18n:          { start: 2,  end: 1,  improved: 1,  velocity: 'medium' },
  },
  // 修复效率
  fixEfficiency: {
    autoFixTotal: 12,          // 总自动修复数
    autoFixSuccess: 11,        // 成功的自动修复
    autoFixRate: 91.7,         // % 成功率
    manualFixTotal: 5,
    manualFixCompleted: 4,
    manualFixRate: 80.0,
    avgTimePerFix: '8min',     // 每次修复平均耗时
  },
  // 瓶颈
  bottlenecks: [
    {
      checkId: 'human-desc-accuracy',
      reason: '需人工审查 desc 准确性 — 无法自动修复',
      stuckCycles: 5,
    },
  ],
}
```

## 5. 分类分解 (`CategoryBreakdown`)

```javascript
[
  {
    category: 'structural',
    totalChecks: 7,
    passRate: 96.4,           // %
    weakestCheck: 'struct-desc-dot',
    weakestCard: '🎯 Comma Test',
    improvement: +12,         // 本周期改善
  },
  // ... per category
]
```

## 6. 风险评估 (`RiskAssessment`)

```javascript
{
  overallRisk: 'low',          // 'critical' | 'high' | 'medium' | 'low'
  riskFactors: [
    {
      factor: '人工审查项积压',
      severity: 'medium',
      detail: '3 个 pending 审查项超过 5 天未处理',
      mitigation: '分配 15 分钟集中审查',
    },
    {
      factor: '多语言一致性',
      severity: 'low',
      detail: '新增卡片仅有 en 语言版本',
      mitigation: '补充 zh-CN 翻译',
    },
  ],
}
```

## 7. 建议 (`Recommendation[]`)

按优先级排序的数据驱动建议：

```javascript
[
  {
    priority: 1,
    category: 'immediate',     // 'immediate' | 'short-term' | 'long-term'
    title: '修复 2 个 desc 分隔符问题',
    rationale: 'struct-desc-dot 是最高频问题，修复后健康分 +4',
    actions: [
      '将 Demo Viewer desc 中的 , 替换为 ·',
      '将 Comma Test desc 中的 ，替换为 ·',
    ],
    estimatedEffort: '5min',
    expectedImpact: { score: +4, failResolved: 2 },
  },
  {
    priority: 2,
    category: 'short-term',
    title: '消除 tag 指纹重复',
    rationale: '2 张卡片共享相同 tags，破坏了 scannable grid 原则',
    actions: [
      '为 Link Test Clone 设计差异化 tags',
    ],
    estimatedEffort: '10min',
    expectedImpact: { score: +2, failResolved: 1 },
  },
  {
    priority: 3,
    category: 'long-term',
    title: '建立卡片审查 Checklist',
    rationale: 'human-* 审查项积压表明需要结构化审查流程',
    actions: [
      '定义审查 SOP（标准操作流程）',
      '每次新增卡片后运行 rui-checklist',
      '将 human-* 结果记录到审查日志',
    ],
    estimatedEffort: '1h',
    expectedImpact: { score: '+审查效率', failResolved: '流程化' },
  },
]
```

## 8. 下轮计划 (`NextCycle`)

```javascript
{
  targetScore: 92,
  focusAreas: ['struct-desc-dot', 'tag-fingerprint'],
  maxNewFails: 1,            // 新增 fail 上限
  scheduledCheck: '2026-06-30T09:00:00Z',
  assignedReviewers: ['human-desc-accuracy'],
}
```

---

## 报告渲染

### Markdown 报告（保存到 docs/）

文件路径: `docs/故事任务面板/daily-check/自改进报告-{{period.end}}.md`

```markdown
# 📊 自改进分析报告

**周期**: {{period.start}} → {{period.end}} ({{period.duration}})
**生成时间**: {{generatedAt}}
**报告 ID**: {{reportId}}

---

## 🎯 执行摘要

{{executiveSummary}}

---

## 📈 健康分趋势

| 日期 | 健康分 | Fail | Warn | 变化 |
|------|:------:|:----:|:----:|:----:|
{{#each dataPoints}}
| {{date}} | **{{score}}/100** | {{fail}} | {{warn}} | {{delta}} |
{{/each}}

### 趋势分析

- 📈 方向: **{{trend.direction}}** (每轮 +{{trend.slope}} 分)
- 📊 波动: {{trend.volatility}} (标准差)
- 🎯 预测: {{forecast.estimatedCycles}} 轮后达到 {{forecast.targetScore}}/100 (预计 {{forecast.estimatedDate}})

```
健康分趋势 (ASCII chart)
{{scoreChart}}
```

---

## 🔍 问题深度分析

### 🔁 重复出现的问题

| 问题 | 出现次数 | 影响卡片 | 趋势 | 根因 |
|------|:------:|------|:----:|------|
{{#each recurring}}
| {{checkId}} | {{occurrences}} | {{affectedCards}} | {{trend}} | {{rootCause}} |
{{/each}}

### 🆕 新增问题

{{#each new}}
- **{{checkId}}**: {{affectedCards}} — {{likelyCause}}
{{/each}}

### ✅ 已根治

{{#each resolved}}
- **{{checkId}}**: 于 {{resolvedAt}} 解决 — {{resolution}}
{{/each}}

---

## ⚡ 改进速率

### 分类改进

| 类别 | 起始 | 当前 | 改善 | 速度 |
|------|:---:|:---:|:---:|:---:|
{{#each byCategory}}
| {{key}} | {{start}} | {{end}} | **+{{improved}}** | {{velocity}} |
{{/each}}

### 修复效率

| 指标 | 数值 |
|------|:----:|
| 自动修复成功率 | {{autoFixRate}}% |
| 人工修复完成率 | {{manualFixRate}}% |
| 平均修复时间 | {{avgTimePerFix}} |

---

## ⚠️ 风险评估

**总体风险**: {{overallRisk}}

{{#each riskFactors}}
### {{severity}} · {{factor}}

{{detail}}

> 💡 缓解方案: {{mitigation}}
{{/each}}

---

## 💡 改进建议

{{#each recommendations}}
### {{priority}}. [{{category}}] {{title}}

**理由**: {{rationale}}

**行动**:
{{#each actions}}
- {{text}}
{{/each}}

> ⏱️ 预计工时: {{estimatedEffort}} | 📈 预期影响: 健康分 {{expectedImpact.score}}, 解决 {{expectedImpact.failResolved}} fail

{{/each}}

---

## 🔮 下轮计划

- 🎯 目标健康分: **{{targetScore}}/100**
- 🔍 重点领域: {{focusAreas}}
- 📅 下次检查: {{scheduledCheck}}
- 👤 审查任务: {{assignedReviewers}}

---

> 🤖 本报告由 rui-checklist 自改进系统自动生成
> 📄 原始数据: `docs/故事任务面板/daily-check/completion-effects.jsonl`
```

### ASCII 趋势图渲染

```javascript
function renderScoreChart(dataPoints, width = 40, height = 10) {
  const scores = dataPoints.map(d => d.score);
  const min = Math.min(...scores) - 5;
  const max = Math.max(...scores) + 5;
  const range = max - min;

  const rows = [];
  for (let row = height - 1; row >= 0; row--) {
    const threshold = min + (row / (height - 1)) * range;
    const label = row === height - 1 ? `${max} ┤` :
                  row === 0 ? `${min} ┤` : '     │';
    let line = label;
    for (let col = 0; col < dataPoints.length; col++) {
      const x = (col / Math.max(dataPoints.length - 1, 1)) * (width - 1);
      const charPos = Math.round(x);
      const scoreY = ((scores[col] - min) / range) * (height - 1);
      if (Math.abs(scoreY - row) < 0.5) {
        line += '●';
      } else if (col > 0) {
        // Draw connecting line
        const prevScoreY = ((scores[col-1] - min) / range) * (height - 1);
        if ((row >= prevScoreY && row <= scoreY) || (row <= prevScoreY && row >= scoreY)) {
          line += '│';
        } else {
          line += ' ';
        }
      } else {
        line += ' ';
      }
    }
    rows.push(line);
  }
  // Date labels
  const dateLine = '     ' + dataPoints.map((d, i) => {
    if (i % Math.ceil(dataPoints.length / 5) === 0) return d.date.slice(5);
    return '   ';
  }).join('');
  rows.push(dateLine);
  return rows.join('\n');
}
```
