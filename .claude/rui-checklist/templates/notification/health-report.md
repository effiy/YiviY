# 健康报告通知模板 (Health Report Notification)

用于 rui-bot 发送到企业微信的 Markdown 格式健康报告。

## 模板变量

| 变量 | 类型 | 说明 |
|------|------|------|
| `{{project}}` | string | 项目名 (e.g. VideoLingo) |
| `{{sceneName}}` | string | 场景名 (e.g. intro) |
| `{{healthScore}}` | number | 健康分 0-100 |
| `{{healthDelta}}` | number | 健康分变化 (带符号) |
| `{{passRate}}` | number | 通过率 % |
| `{{passCount}}` | number | 通过数 |
| `{{failCount}}` | number | 失败数 |
| `{{failDelta}}` | string | 失败数变化 (e.g. "↓6") |
| `{{warnCount}}` | number | 警告数 |
| `{{warnDelta}}` | string | 警告数变化 |
| `{{pendingCount}}` | number | 待审查数 |
| `{{totalCards}}` | number | 卡片总数 |
| `{{autoFixCount}}` | number | 自动修复数 |
| `{{blockers}}` | string | 阻塞问题简述 |
| `{{topIssues}}` | markdown table rows | Top 3 问题 |
| `{{reportUrl}}` | string | 报告 URL |
| `{{generatedAt}}` | string | 生成时间 |
| `{{trendIcon}}` | string | 趋势图标 (📈/📉/📊) |

## 模板: 完整健康报告

```markdown
## 📋 {{project}} · 卡片质量报告

{{trendIcon}} **健康分: {{healthScore}}/100** ({{healthDelta}})
> 通过率: {{passRate}}% · {{totalCards}} 张卡片 · {{generatedAt}}

---

### 📊 检查概要

| 状态 | 当前 | 变化 |
|------|:----:|:----:|
| ✅ Pass | {{passCount}} | — |
| 🔴 Fail | {{failCount}} | {{failDelta}} |
| 🟡 Warn | {{warnCount}} | {{warnDelta}} |
| 🔵 Review | {{pendingCount}} | →0 |

---

### 🔴 阻塞问题 ({{failCount}})

{{#if failCount > 0}}
{{#each blockers}}
> **{{checkId}}**: {{description}} — 影响 {{cardNames}} ({{count}} 张卡片)
{{/each}}
{{else}}
> 🎉 无阻塞问题!
{{/if}}

### 🟡 警告 ({{warnCount}})

{{#if warnCount > 0}}
{{#each warnings}}
> **{{checkId}}**: {{description}} — {{count}} 张卡片
{{/each}}
{{else}}
> ✅ 无警告
{{/if}}

---

### 🤖 自动修复: {{autoFixCount}} 项

{{#each autoFixes}}
> ✅ `{{cardName}}` · {{checkId}}: {{fixDescription}}
{{/each}}

### 📝 待人工处理: {{pendingActionCount}} 项

{{#each pendingActions}}
> {{priorityIcon}} [{{priority}}] {{action}} (预计 {{estimatedEffort}})
{{/each}}

---

[📄 查看完整检查清单]({{reportUrl}})
```

## 模板: 紧凑版（用于定时推送）

```markdown
## 📋 {{sceneName}} 检查 · {{healthScore}}/100 {{trendIcon}}{{healthDelta}}

| | Pass | Fail | Warn | Review |
|--|:--:|:--:|:--:|:--:|
| 当前 | {{passCount}} | {{failCount}} | {{warnCount}} | {{pendingCount}} |

{{#if failCount > 0}}
⚠️ 阻塞: {{blockers}}
{{/if}}
{{#if autoFixCount > 0}}
✅ 自动修复 {{autoFixCount}} 项
{{/if}}

[查看详情]({{reportUrl}})
```

## 模板: 全绿通知（无问题）

```markdown
## 🎉 {{project}} · {{sceneName}} 检查全通过!

📊 健康分: **{{healthScore}}/100**
✅ {{passCount}}/{{passCount}} 检查通过
📋 {{totalCards}} 张卡片全部合格

[查看详情]({{reportUrl}})
```

## 模板: 紧急通知（健康分下降 > 10）

```markdown
## 🚨 {{project}} · 健康分下降警报!

📉 健康分: **{{healthScore}}/100** ({{healthDelta}})
> 上次: {{previousScore}}/100 → 本次: {{currentScore}}/100

⚠️ 新增 {{newFailCount}} 个阻塞问题:
{{#each newFails}}
> 🔴 **{{checkId}}** · {{cardName}}: {{evidence}}
{{/each}}

🔧 建议立即修复:
{{#each urgentActions}}
> {{priorityIcon}} {{action}}
{{/each}}

[查看详情]({{reportUrl}}) | [运行自动修复]({{fixUrl}})
```
