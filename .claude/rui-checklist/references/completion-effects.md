# 完成效果格式 (Completion Effects Format)

检查运行完成后的结构化效果报告，量化改进增量。

## 用途

每次 `rui-checklist` 质量检查（及后续修复）完成后，生成一份完成效果摘要，让用户清楚看到：
- 检查了什么
- 发现了什么
- 改进了什么
- 还剩下什么

## 效果报告结构

```javascript
/**
 * @typedef {Object} CompletionEffect
 * @property {CheckRunMeta} meta       - 运行元信息
 * @property {HealthDelta} health      - 健康分变化
 * @property {IssueBreakdown} issues   - 问题分解
 * @property {ImprovementLog} improved - 改进记录
 * @property {ActionItems} pending     - 待处理项
 */
```

### 1. 运行元信息 (`CheckRunMeta`)

```javascript
{
  runId: 'check-20260629-143000',
  sceneName: 'intro',
  scenePath: 'docs/components/intro/',
  sourceFile: 'data.js',
  language: 'en',
  totalCards: 11,
  startedAt: '2026-06-29T14:30:00Z',
  completedAt: '2026-06-29T14:30:05Z',
  duration: '5s',
  triggeredBy: 'manual',        // 'manual' | 'scheduled' | 'pipeline'
  previousRunId: 'check-20260628-090000', // null if first run
}
```

### 2. 健康分变化 (`HealthDelta`)

```javascript
{
  // 当前运行
  current: {
    score: 88,          // 0-100 健康分
    passCount: 75,
    failCount: 2,
    warnCount: 3,
    pendingCount: 3,
    passRate: 93.8,     // %
  },
  // 与上次对比（首次运行为 null）
  previous: {
    score: 72,
    passCount: 65,
    failCount: 8,
    warnCount: 4,
    pendingCount: 3,
    passRate: 81.3,
  },
  // 增量
  delta: {
    score: +16,           // ↑ 改善
    failResolved: 6,      // 解决的 fail
    warnResolved: 1,      // 解决的 warn
    newFails: 0,          // 新增 fail
    newWarns: 0,          // 新增 warn
    trend: 'improving',   // 'improving' | 'stable' | 'declining'
  },
}
```

### 3. 问题分解 (`IssueBreakdown`)

按严重程度聚类：

```javascript
{
  // 🔴 阻塞性问题（必须修复）
  blockers: [
    {
      checkId: 'struct-desc-dot',
      cardNames: ['🎬 Demo Viewer', '🎯 Comma Test'],
      count: 2,
      description: '2 cards use comma instead of · separator',
      fix: 'auto',  // 'auto' | 'manual' | 'review'
    },
  ],
  // 🟡 警告（建议优化）
  warnings: [
    {
      checkId: 'tag-fingerprint',
      cardNames: ['🔗 Link Test', '🔗 Link Test Clone'],
      count: 2,
      description: '2 cards share identical tag sets',
      fix: 'manual',
    },
  ],
  // 🔵 待审查（需人工判断）
  reviews: [
    {
      checkId: 'human-desc-accuracy',
      cardNames: ['📊 Code Health Report', '📋 Missing Meta Report'],
      count: 2,
      description: '2 card descriptions need human accuracy review',
      fix: 'review',
    },
  ],
}
```

### 4. 改进记录 (`ImprovementLog`)

对比上次检查，本次解决了哪些问题：

```javascript
[
  {
    checkId: 'struct-badge',
    cardName: '🎬 Demo Viewer',
    before: { status: 'fail', evidence: "badge: 'new feature!' starts lowercase" },
    after:  { status: 'pass', evidence: "badge: 'New Feature' (valid)" },
    fixMethod: 'auto',  // 'auto' | 'manual'
    fixDescription: '自动将 badge 首字母大写',
  },
  {
    checkId: 'link-intentional',
    cardName: '🔗 Link Test',
    before: { status: 'fail', evidence: 'links field is undefined' },
    after:  { status: 'pass', evidence: 'links: null (using defaults)' },
    fixMethod: 'auto',
    fixDescription: '自动设置 links 为 null',
  },
  // ... more
]
```

### 5. 待处理项 (`ActionItems`)

```javascript
[
  {
    priority: 'high',     // 'high' | 'medium' | 'low'
    checkId: 'struct-desc-dot',
    cardNames: ['🎬 Demo Viewer', '🎯 Comma Test'],
    action: '替换 desc 中的逗号为 · (U+00B7) 分隔符',
    estimatedEffort: '5min',
    canAutoFix: true,
  },
  {
    priority: 'medium',
    checkId: 'tag-fingerprint',
    cardNames: ['🔗 Link Test Clone'],
    action: '修改 Link Test Clone 的 tags 使其与 Link Test 区分',
    estimatedEffort: '10min',
    canAutoFix: false,
  },
]
```

## 渲染模板

### 终端输出（CLI 友好）

```
╔══════════════════════════════════════════════════╗
║  📋 rui-checklist · 完成效果                     ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  📊 健康分: 88/100  ↑ +16                        ║
║  📈 通过率: 93.8%  ↑ +12.5pp                     ║
║                                                  ║
║  🔴 阻塞: 2 (↓ -6)                               ║
║  🟡 警告: 3 (↓ -1)                               ║
║  🔵 待审: 3 (→ 0)                                ║
║                                                  ║
║  ✅ 本次自动修复: 7 项                            ║
║  📝 待人工处理: 2 项                              ║
║  ⏱️  预计剩余工时: 15min                           ║
║                                                  ║
║  详情: docs/components/intro/checklist/index.html ║
╚══════════════════════════════════════════════════╝
```

### HTML 组件（嵌入 checklist 页面）

在现有 checklist 页面中新增"完成效果"区块：

```html
<section class="completion-effects" v-if="hasHistory">
  <div class="ce-header">
    <h2>📊 改进效果</h2>
    <span class="ce-trend" :class="healthDelta.trend">
      {{ trendIcon }} {{ healthDelta.trend }}
    </span>
  </div>

  <div class="ce-health-bar">
    <div class="ce-score-before">{{ healthDelta.previous.score }}</div>
    <div class="ce-arrow">→</div>
    <div class="ce-score-after highlight">{{ healthDelta.current.score }}</div>
    <div class="ce-delta" :class="{ positive: healthDelta.delta.score > 0 }">
      {{ healthDelta.delta.score >= 0 ? '+' : '' }}{{ healthDelta.delta.score }}
    </div>
  </div>

  <div class="ce-breakdown">
    <div class="ce-item resolved">
      <span class="ce-num">{{ healthDelta.delta.failResolved + healthDelta.delta.warnResolved }}</span>
      <span class="ce-label">问题已解决</span>
    </div>
    <div class="ce-item remaining">
      <span class="ce-num">{{ healthDelta.current.failCount + healthDelta.current.warnCount }}</span>
      <span class="ce-label">待处理</span>
    </div>
    <div class="ce-item auto-fixed">
      <span class="ce-num">{{ autoFixCount }}</span>
      <span class="ce-label">自动修复</span>
    </div>
  </div>

  <details class="ce-improvements">
    <summary>查看改进详情 ({{ improvementLog.length }} 项)</summary>
    <div v-for="item in improvementLog" class="ce-improvement-item">
      <span class="ce-card-name">{{ item.cardName }}</span>
      <span class="ce-check-id">{{ item.checkId }}</span>
      <span class="ce-before">❌ {{ item.before.status }}</span>
      <span class="ce-arrow2">→</span>
      <span class="ce-after">✅ {{ item.after.status }}</span>
      <span class="ce-fix-badge" :class="item.fixMethod">{{ item.fixMethod }}</span>
    </div>
  </details>
</section>
```

### 企业微信消息格式

```javascript
// formatCompletionEffect(ce) → WeCom markdown
export function formatCompletionEffect(ce) {
  const { health, meta } = ce;
  const trend = health.delta.trend === 'improving' ? '📈' :
                health.delta.trend === 'declining' ? '📉' : '📊';

  return [
    `## 📋 ${meta.sceneName} 质量检查完成`,
    ``,
    `${trend} 健康分: **${health.current.score}/100** (${health.delta.score >= 0 ? '+' : ''}${health.delta.score})`,
    `> 通过率: ${health.current.passRate}%`,
    ``,
    `| 状态 | 当前 | 变化 |`,
    `|------|------|------|`,
    `| 🔴 Fail | ${health.current.failCount} | ${health.delta.failResolved > 0 ? `↓${health.delta.failResolved}` : '→0'} |`,
    `| 🟡 Warn | ${health.current.warnCount} | ${health.delta.warnResolved > 0 ? `↓${health.delta.warnResolved}` : '→0'} |`,
    `| 🔵 Review | ${health.current.pendingCount} | →0 |`,
    ``,
    `✅ 自动修复: ${ce.autoFixCount} 项`,
    `📝 待处理: ${ce.pendingItems.length} 项`,
    ``,
    ce.pendingItems.length > 0
      ? `⚠️ **待处理**: ${ce.pendingItems.map(i => i.action).join('; ')}`
      : `🎉 所有问题已解决!`,
    ``,
    `[查看详情](${ce.reportUrl})`,
  ].join('\n');
}
```

## 效果追踪

每次检查运行后追加到 `docs/故事任务面板/daily-check/completion-effects.jsonl`：

```jsonl
{"runId":"check-20260628-090000","scene":"intro","score":72,"fail":8,"warn":4,"pending":3,"timestamp":"2026-06-28T09:00:00Z"}
{"runId":"check-20260629-143000","scene":"intro","score":88,"fail":2,"warn":3,"pending":3,"timestamp":"2026-06-29T14:30:00Z"}
```

使用 `scripts/trend.mjs` 可生成趋势图（横轴=日期，纵轴=健康分）。

## 原则

1. **可量化**: 每个效果都用数字表示，不做模糊描述
2. **可对比**: 每次运行都与上次对比，delta 一目了然
3. **可追溯**: 改进日志记录 before/after，可回溯每项变更
4. **可行动**: 待处理项附预估工时和修复方式，可直接执行
5. **轻量级**: 效果报告不阻塞生成流程，计算耗时 < 50ms
