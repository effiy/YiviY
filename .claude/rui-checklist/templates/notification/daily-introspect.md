# 每日自省通知模板 (Daily Introspect Notification)

用于 rui-bot 发送每日自省报告到企业微信。

## 模板变量

| 变量 | 类型 | 说明 |
|------|------|------|
| `{{date}}` | string | 日期 (e.g. 2026-06-29) |
| `{{weekday}}` | string | 星期 (e.g. 星期一) |
| `{{goodItems}}` | string[] | Good 列表 |
| `{{badItems}}` | string[] | Bad 列表 |
| `{{tomorrowPlan}}` | string[] | 明日计划 |
| `{{healthScore}}` | number | 当日健康分 (如有检查) |
| `{{healthDelta}}` | string | 健康分变化 |
| `{{streakDays}}` | number | 连续自省天数 |
| `{{commitCount}}` | number | 当日提交数 |
| `{{changedFiles}}` | number | 变更文件数 |

## 模板: 完整每日自省

```markdown
## 🗓️ 每日自省 · {{date}} {{weekday}}

🔥 连续自省: {{streakDays}} 天

---

### 🟢 今日 Good

{{#each goodItems}}
{{@index_1}}. {{text}}
{{/each}}

### 🔴 今日 Bad

{{#each badItems}}
{{@index_1}}. {{text}}
{{/each}}

---

### 🎯 明日计划

{{#each tomorrowPlan}}
{{@index_1}}. {{text}}
{{/each}}

---

### 📊 项目数据

| 指标 | 数值 |
|------|:----:|
| 今日提交 | {{commitCount}} |
| 变更文件 | {{changedFiles}} |
| 健康分 | {{healthScore}}/100 {{healthDelta}} |

> 💡 *每日自省是持续改进的基石 · 坚持就是胜利*
```

## 模板: 紧凑版（群聊日常推送）

```markdown
## 🗓️ {{date}} {{weekday}} 自省

🟢 **Good**: {{goodSummary}}
🔴 **Bad**: {{badSummary}}
🎯 **明日**: {{planSummary}}

📊 健康分: {{healthScore}}/100 {{healthDelta}} | 🔥 {{streakDays}}天
```

## 模板: 周末回顾版

```markdown
## 📅 本周回顾 · {{weekRange}}

🔥 自省连续: {{streakDays}} 天

---

### 📈 本周亮点

{{#each weekHighlights}}
> ✨ {{text}}
{{/each}}

### 📊 本周统计

| 指标 | 数值 | 趋势 |
|------|:----:|:----:|
| 健康分 | {{healthScore}}/100 | {{healthDelta}} |
| 总提交 | {{weekCommits}} | — |
| 关闭问题 | {{closedIssues}} | {{issueDelta}} |
| 自动修复 | {{autoFixTotal}} | — |

### 🔮 下周重点

{{#each nextWeekPlan}}
{{@index_1}}. {{text}}
{{/each}}

> 💪 *持续改进 · 每周进步一点点*
```
