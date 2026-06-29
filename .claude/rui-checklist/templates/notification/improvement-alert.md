# 改进警报通知模板 (Improvement Alert Notification)

当检测到需要关注的事件时，通过 rui-bot 发送的 Markdown 格式警报。

## 警报类型

| 类型 | 触发条件 | 颜色 |
|------|----------|:----:|
| `health-drop` | 健康分下降 ≥ 10 分 | 🔴 |
| `new-blocker` | 新增 fail 检查项 | 🟠 |
| `stale-check` | 超过 N 天未运行检查 | 🟡 |
| `regression` | 之前修复的问题再次出现 | 🔴 |
| `stagnation` | 连续 3 次检查健康分未改善 | 🟡 |
| `milestone` | 健康分达到新里程碑 (90+, 100) | 🟢 |

## 通用模板变量

| 变量 | 类型 | 说明 |
|------|------|------|
| `{{alertType}}` | string | 警报类型 key |
| `{{alertColor}}` | string | 颜色 emoji |
| `{{alertTitle}}` | string | 警报标题 |
| `{{alertSummary}}` | string | 一行摘要 |
| `{{triggeredAt}}` | string | 触发时间 |
| `{{project}}` | string | 项目名 |
| `{{reportUrl}}` | string | 详情 URL |
| `{{actionUrl}}` | string | 修复/操作 URL |

---

## 模板: 健康分下降警报

```markdown
## {{alertColor}} 健康分下降警报

**{{project}}** · {{sceneName}}
> {{triggeredAt}}

---

📉 健康分: **{{previousScore}}/100 → {{currentScore}}/100** ({{healthDelta}})

### ⚠️ 新增问题

{{#each newFails}}
> 🔴 **{{checkId}}** · {{cardName}}
> {{evidence}}
{{/each}}

{{#each newWarns}}
> 🟡 **{{checkId}}** · {{cardName}}
> {{evidence}}
{{/each}}

### 🔍 可能原因

{{#each possibleCauses}}
> {{@index_1}}. {{text}}
{{/each}}

---

🔧 [运行自动修复]({{fixUrl}}) | 📄 [查看详情]({{reportUrl}})
```

## 模板: 回归警报

```markdown
## {{alertColor}} 问题回归警报

**{{project}}** · {{sceneName}}
> {{triggeredAt}}

---

⚠️ 以下问题之前已修复，现已**再次出现**:

{{#each regressions}}
### 🔴 {{checkId}} · {{cardName}}

| | 状态 | 时间 |
|--|:--:|------|
| 修复时 | ✅ pass | {{fixedAt}} |
| 当前 | ❌ fail | {{triggeredAt}} |

> {{evidence}}

{{/each}}

### 🔧 建议操作

{{#each suggestedActions}}
> {{@index_1}}. {{text}}
{{/each}}

---

📄 [查看详情]({{reportUrl}}) | 🔄 [重新检查]({{rerunUrl}})
```

## 模板: 停滞警报

```markdown
## {{alertColor}} 改进停滞警报

**{{project}}** · {{triggeredAt}}

---

📊 连续 {{stagnantRuns}} 次检查健康分无改善: **{{currentScore}}/100**

### 📈 健康分趋势

```
{{#each historyRuns}}
{{date}}: {{scoreBar}} {{score}}/100
{{/each}}
```

### 🔍 持续存在的问题 (≥ 3 次出现)

{{#each recurringIssues}}
> {{@index_1}}. **{{checkId}}** · {{cardNames}} — 出现 {{occurrenceCount}} 次
{{/each}}

### 💡 突破建议

{{#each breakthroughSuggestions}}
> {{@index_1}}. {{text}}
{{/each}}

---

🔧 [深度检查]({{deepCheckUrl}}) | 📄 [查看详情]({{reportUrl}})
```

## 模板: 里程碑通知

```markdown
## {{alertColor}} 质量里程碑达成!

**{{project}}** · {{sceneName}}
> {{triggeredAt}}

---

🎉 健康分达到 **{{currentScore}}/100**!

### 📈 改进历程

| 日期 | 健康分 | 变化 |
|------|:------:|:----:|
{{#each milestoneHistory}}
| {{date}} | {{score}}/100 | {{delta}} |
{{/each}}

### 🏆 关键改进

{{#each keyImprovements}}
> ✨ {{text}}
{{/each}}

---

💪 继续加油 · 下一个目标: {{nextMilestone}}/100
```

## 模板: 过期检查提醒

```markdown
## {{alertColor}} 检查过期提醒

**{{project}}** · {{triggeredAt}}

---

⏰ 上次质量检查: **{{daysSinceLastCheck}} 天前** ({{lastCheckDate}})

建议立即运行检查:
> `检查 {{sceneName}} 卡片`

当前已知指标 (可能已过时):
- 健康分: {{lastKnownScore}}/100
- Fail: {{lastKnownFail}} | Warn: {{lastKnownWarn}}

---

🔄 [运行检查]({{triggerUrl}})
```

## 警报阈值配置

```javascript
// 在 .claude/rui-checklist/config/alerts.json 中配置
{
  "thresholds": {
    "healthDrop": 10,         // 健康分下降 ≥ 10 触发
    "staleCheckDays": 3,      // 超过 3 天未检查触发
    "stagnationRuns": 3,      // 连续 3 次无改善触发
    "milestones": [90, 95, 100], // 里程碑分数
    "regressionLookback": 7   // 回归检测回溯天数
  },
  "notification": {
    "channels": ["wecom"],    // 通知渠道
    "cooldown": "4h",         // 同类型警报冷却时间
    "quietHours": "22:00-08:00" // 静默时段
  }
}
```
