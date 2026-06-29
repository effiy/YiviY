# 项目自改进工作流 (Project Self-Improvement Workflow)

rui-checklist 不仅检查卡片质量，也是一套完整的**项目自改进系统**。按步骤一步一步完成项目的自我诊断和改进。

## 自改进循环

```
每日自省 → 发现问题 → 质量检查 → 自动修复 → 验证改进 → 报告通知 → 每日自省
   ↑                                                                    ↓
   └──────────────────── 持续改进循环 ─────────────────────────────────┘
```

## Step 1: 每日自省 (Daily Introspect)

### 目的

每天花 5 分钟回顾项目状态，记录今天做得好(GOOD)和需要改进(BAD)的事项。

### 输出

`docs/故事任务面板/daily-check/每日自省.md` — 追加模式，每天一条记录。

### 格式

```markdown
## 2026-06-29 每日自省

### 🟢 今日 Good
1. 修复了 rui-graph 页面键盘快捷键失效的问题
2. 完成了 rui-demos 的 Type A 工具演示模板
3. 更新了 rui-bot 的消息格式化文档

### 🔴 今日 Bad
1. 忽略了 rui-bot 超时重试的指数退避边界条件
2. 未及时更新 SKILL.md 中的接口契约文档
3. rui-html 组件 CSS 未注册到 _COMPONENTS_WITH_CSS

### 🎯 明日计划
1. 补充 rui-bot sendWithRetry 的单元测试
2. 完成 rui-diagram 的全景视图功能
3. 审核所有 rui-* 技能的 SKILL.md 接口一致性
```

### 触发

- 每天固定时间（建议早上 9:00）
- 或任何管线完成后
- 用户说"今日自省"、"daily check"、"今日总结"

## Step 2: 质量检查 (Quality Check)

### 卡片级检查

对 rui-scene 卡片运行自动化质量检查（见 `references/check-rules.md`）：

```bash
# 生成卡片质量清单
rui-checklist check docs/components/intro/
```

### 项目级检查

对整体项目运行健康检查：

| 维度 | 检查内容 | 工具 |
|------|----------|------|
| **卡片质量** | name, desc, tags, badge, links 规范性 | check-rules.md 全部规则 |
| **代码结构** | 4-file 模式完整性、CDN 路径正确性 | Phase 5 validator |
| **文档一致性** | SKILL.md 接口契约是否最新 | 人工审查 |
| **技能协调** | INTERFACES.md 引用是否有效 | 交叉引用检查 |
| **Git 卫生** | 未跟踪文件、分支状态 | git status |
| **主题一致性** | 所有页面使用相同 CDN 主题 | CSS audit |

## Step 3: 自动修复 (Auto-Fix)

根据检查结果，自动修复可确定的问题：

| 问题 | 自动修复 |
|------|----------|
| desc 使用逗号而非 `·` | 建议替换，需人工确认 |
| tags 缺少 modifier | 根据 tag text 语义自动推荐 modifier |
| badge 小写开头 | 自动转大写 |
| links 配置缺失 | 设为 `null`（使用默认） |
| 硬编码颜色 | 替换为 var(--yry-*) token |
| CDN 路径不对 | 修正为正确的相对路径 |

## Step 4: 验证改进 (Verify)

修复后重新运行检查，确认改进效果：

```
第1次检查: 健康分 72/100 (8 fail, 4 warn)
     ↓ 自动修复 + 人工改进
第2次检查: 健康分 88/100 (2 fail, 3 warn)  ↑ +16
     ↓ 人工处理剩余问题
第3次检查: 健康分 95/100 (0 fail, 2 warn)  ↑ +7
```

## Step 5: 报告通知 (Report & Notify)

通过 rui-bot 发送健康报告到企业微信：

```javascript
// 使用 rui-bot/format.mjs
import { formatHealthReport } from '../rui-bot/format.mjs';

const report = formatHealthReport({
  project: 'VideoLingo',
  health: { score: 88, passCount: 75, failCount: 2, warnCount: 3, pendingCount: 3 },
  topIssues: [
    { name: 'struct-desc-dot', status: 'fail', note: '2 cards 使用逗号而非 · 分隔符' },
    { name: 'tag-fingerprint', status: 'warn', note: 'intro 和 quick-start 标签组重复' },
  ],
  reportUrl: 'docs/components/intro/checklist/index.html',
});
```

## 完整自改进一次循环

```bash
# 1. 每日自省
echo "今日做了..." >> docs/故事任务面板/daily-check/每日自省.md

# 2. 质量检查 — 生成卡片检查清单
# (由 Claude agent 执行 rui-checklist skill)

# 3. 自动修复 — 修复可确定的问题
# (由 Claude agent 执行)

# 4. 验证改进 — 重新检查
# (由 Claude agent 执行)

# 5. 发送健康报告
node .claude/rui-bot/send.mjs --story=daily-check \
  --content="$(node -e "import { formatHealthReport } from './.claude/rui-bot/format.mjs'; console.log(formatHealthReport({...}));")"
```

## 自改进原则

1. **量化改进**：每次检查记录健康分，追踪改善趋势
2. **优先 fail**：先处理 fail（阻塞），再优化 warn（建议）
3. **不积压**：每天至少解决 1 个 fail 或 2 个 warn
4. **可回溯**：所有检查结果持久化到日志
5. **持续循环**：自省 → 检查 → 修复 → 验证 → 报告 → 自省
