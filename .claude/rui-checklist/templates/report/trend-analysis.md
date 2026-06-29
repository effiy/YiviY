# 趋势分析模板 (Trend Analysis Template)

从 `completion-effects.jsonl` 中提取多轮检查数据，生成趋势分析。

## 数据源

```
docs/故事任务面板/daily-check/completion-effects.jsonl
```

每行一条 JSON:

```jsonl
{"runId":"check-20260622","scene":"intro","score":65,"fail":12,"warn":8,"pending":3,"passRate":72.5,"autoFixCount":3,"timestamp":"2026-06-22T09:00:00Z"}
{"runId":"check-20260624","scene":"intro","score":72,"fail":8,"warn":5,"pending":3,"passRate":81.3,"autoFixCount":5,"timestamp":"2026-06-24T09:00:00Z"}
```

## 分析维度

### 1. 健康分趋势 (Score Trend)

```javascript
/**
 * 计算健康分趋势
 * @param {Object[]} history - 历史检查记录
 * @returns {ScoreTrend}
 */
function analyzeScoreTrend(history) {
  const sorted = [...history].sort((a, b) =>
    new Date(a.timestamp) - new Date(b.timestamp));

  if (sorted.length < 2) {
    return { direction: 'insufficient-data', slope: 0, volatility: 0 };
  }

  const scores = sorted.map(h => h.score);
  const days = sorted.map((h, i) => i); // x-axis: sequential runs

  // 线性回归: score = slope * runIndex + intercept
  const n = scores.length;
  const sumX = days.reduce((a, b) => a + b, 0);
  const sumY = scores.reduce((a, b) => a + b, 0);
  const sumXY = days.reduce((sum, x, i) => sum + x * scores[i], 0);
  const sumXX = days.reduce((sum, x) => sum + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);

  // 波动率 (标准差)
  const predicted = days.map(x => slope * x + (sumY - slope * sumX) / n);
  const residuals = scores.map((y, i) => y - predicted[i]);
  const volatility = Math.sqrt(
    residuals.reduce((sum, r) => sum + r * r, 0) / (n - 1)
  );

  return {
    direction: slope > 0.5 ? 'up' : slope < -0.5 ? 'down' : 'flat',
    slope: Math.round(slope * 10) / 10,
    volatility: Math.round(volatility * 10) / 10,
    confidence: volatility < 3 ? 'high' : volatility < 7 ? 'medium' : 'low',
    dataPoints: sorted.length,
  };
}
```

### 2. 预测达标时间 (Forecast)

```javascript
/**
 * 预测何时达到目标健康分
 * @param {Object[]} history
 * @param {number} targetScore - 目标分数 (default: 95)
 * @returns {Forecast}
 */
function forecastTarget(history, targetScore = 95) {
  const trend = analyzeScoreTrend(history);
  const lastScore = history[history.length - 1].score;

  if (trend.slope <= 0) {
    return {
      achievable: false,
      reason: '健康分未呈上升趋势',
      currentScore: lastScore,
      gap: targetScore - lastScore,
    };
  }

  const runsNeeded = Math.ceil((targetScore - lastScore) / trend.slope);
  const lastDate = new Date(history[history.length - 1].timestamp);
  const avgInterval = calculateAvgInterval(history); // 平均检查间隔 (ms)
  const estimatedDate = new Date(lastDate.getTime() + runsNeeded * avgInterval);

  return {
    achievable: true,
    currentScore: lastScore,
    targetScore,
    gap: targetScore - lastScore,
    runsNeeded,
    estimatedDate: estimatedDate.toISOString().slice(0, 10),
    confidence: trend.confidence,
  };
}

function calculateAvgInterval(history) {
  if (history.length < 2) return 24 * 60 * 60 * 1000; // default: 1 day
  const sorted = [...history].sort((a, b) =>
    new Date(a.timestamp) - new Date(b.timestamp));
  let totalMs = 0;
  for (let i = 1; i < sorted.length; i++) {
    totalMs += new Date(sorted[i].timestamp) - new Date(sorted[i-1].timestamp);
  }
  return totalMs / (sorted.length - 1);
}
```

### 3. 问题复发检测 (Recurrence Detection)

```javascript
/**
 * 检测重复出现的问题
 * @param {Object[]} history - 历史检查记录
 * @param {Object[]} improvementLogs - 每次的改进日志
 * @returns {RecurringIssue[]}
 */
function detectRecurringIssues(history, improvementLogs) {
  const issueMap = new Map(); // checkId → { dates, cards }

  for (const log of improvementLogs) {
    const key = log.checkId;
    if (!issueMap.has(key)) {
      issueMap.set(key, { dates: [], cards: new Set() });
    }
    const entry = issueMap.get(key);
    entry.dates.push(log.timestamp);
    if (log.cardName) entry.cards.add(log.cardName);
  }

  const recurring = [];
  for (const [checkId, data] of issueMap) {
    if (data.dates.length >= 3) {
      // 检查趋势：最近几次的间隔
      const recentDates = data.dates.slice(-3).map(d => new Date(d));
      const interval1 = (recentDates[1] - recentDates[0]) / (1000 * 60 * 60 * 24);
      const interval2 = (recentDates[2] - recentDates[1]) / (1000 * 60 * 60 * 24);

      recurring.push({
        checkId,
        occurrences: data.dates.length,
        affectedCards: [...data.cards],
        trend: interval2 > interval1 * 1.5 ? 'declining' :
               interval2 < interval1 * 0.5 ? 'increasing' : 'stable',
        firstSeen: data.dates[0],
        lastSeen: data.dates[data.dates.length - 1],
      });
    }
  }

  return recurring.sort((a, b) => b.occurrences - a.occurrences);
}
```

### 4. 分类改进速率 (Category Velocity)

```javascript
/**
 * 按检查分类计算改进速率
 * @param {Object[]} history
 * @returns {CategoryVelocity[]}
 */
function analyzeCategoryVelocity(history) {
  const categories = {};

  for (const run of history) {
    if (!run.categoryBreakdown) continue;
    for (const [cat, data] of Object.entries(run.categoryBreakdown)) {
      if (!categories[cat]) categories[cat] = { first: data, last: data };
      categories[cat].last = data;
    }
  }

  return Object.entries(categories).map(([cat, { first, last }]) => ({
    category: cat,
    startFails: first.failCount,
    endFails: last.failCount,
    improvement: first.failCount - last.failCount,
    velocity: first.failCount - last.failCount > (first.failCount * 0.3)
      ? 'fast' : first.failCount - last.failCount > 0 ? 'medium' : 'slow',
  }));
}
```

### 5. 稳定性分析 (Stability)

```javascript
/**
 * 分析修复稳定性 — 修复后是否保持 pass
 * @param {Object[]} improvementLogs
 * @param {Object[]} latestResults
 * @returns {StabilityReport}
 */
function analyzeStability(improvementLogs, latestResults) {
  const fixes = improvementLogs.filter(log => log.fixMethod);

  const regressions = [];
  for (const fix of fixes) {
    const current = latestResults.find(r =>
      r.checkId === fix.checkId && r.cardName === fix.cardName);
    if (current && current.status === 'fail') {
      regressions.push({
        checkId: fix.checkId,
        cardName: fix.cardName,
        fixedAt: fix.timestamp,
        regressedAt: current.timestamp,
      });
    }
  }

  return {
    totalFixes: fixes.length,
    regressions: regressions.length,
    stabilityRate: fixes.length > 0
      ? Math.round((1 - regressions.length / fixes.length) * 100)
      : 100,
    regressions,
  };
}
```

## 使用示例

```javascript
import { readFileSync } from 'fs';

// 读取历史数据
const historyPath = 'docs/故事任务面板/daily-check/completion-effects.jsonl';
const history = readFileSync(historyPath, 'utf-8')
  .trim()
  .split('\n')
  .map(line => JSON.parse(line));

// 运行分析
const scoreTrend = analyzeScoreTrend(history);
const forecast = forecastTarget(history, 95);
const velocity = analyzeCategoryVelocity(history);

console.log('=== 趋势分析 ===');
console.log(`方向: ${scoreTrend.direction} | 斜率: ${scoreTrend.slope}/轮 | 波动: ${scoreTrend.volatility}`);
console.log(`预测: ${forecast.runsNeeded} 轮后达到 ${forecast.targetScore}/100 (${forecast.estimatedDate})`);
console.log(`置信度: ${forecast.confidence}`);

console.log('\n=== 速率分析 ===');
for (const v of velocity) {
  console.log(`  ${v.category}: ${v.startFails} → ${v.endFails} fail (${v.velocity})`);
}
```

## 趋势图渲染

```javascript
/**
 * 生成 ASCII 趋势图
 * @param {Object[]} history
 * @returns {string}
 */
function renderAsciiTrend(history, width = 50, height = 8) {
  const sorted = [...history].sort((a, b) =>
    new Date(a.timestamp) - new Date(b.timestamp));
  const scores = sorted.map(h => h.score);
  const min = Math.max(0, Math.min(...scores) - 5);
  const max = Math.min(100, Math.max(...scores) + 5);
  const range = max - min || 1;

  const rows = [];
  for (let row = height; row >= 0; row--) {
    const threshold = min + (row / height) * range;
    const label = row === height ? `${max} ┤` :
                  row === 0     ? `${min} ┤` : '    │';
    let line = label;
    for (let col = 0; col < width; col++) {
      const idx = (col / (width - 1)) * (scores.length - 1);
      const lo = Math.floor(idx);
      const hi = Math.ceil(idx);
      const frac = idx - lo;
      const interpolated = lo === hi
        ? scores[lo]
        : scores[lo] * (1 - frac) + scores[hi] * frac;
      const y = ((interpolated - min) / range) * height;
      if (Math.abs(y - row) < 0.4) {
        line += '●';
      } else {
        // 连线检测
        const loY = ((scores[lo] - min) / range) * height;
        const hiY = ((scores[hi] - min) / range) * height;
        if ((row >= Math.min(loY, hiY) && row <= Math.max(loY, hiY)) && hi !== lo) {
          line += '·';
        } else {
          line += ' ';
        }
      }
    }
    rows.push(line);
  }

  // 日期标签
  const dateLine = '    ' + sorted.map((h, i) => {
    if (i === 0 || i === sorted.length - 1 ||
        i === Math.floor(sorted.length / 2)) {
      return h.timestamp.slice(0, 10);
    }
    return '';
  }).join('  ');

  rows.push(dateLine);
  return rows.join('\n');
}
```

输出示例:

```
100 ┤
    │               ●──●
 90 ┤          ●──·
    │         /
 80 ┤    ●──·
    │   /
 70 ┤  ●
    │
 60 ┤
    2026-06-22    2026-06-25    2026-06-29
```
