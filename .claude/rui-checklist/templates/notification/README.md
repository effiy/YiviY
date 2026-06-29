# Notification Templates for rui-bot

三类企业微信通知模板，通过 [[rui-bot]] `format.mjs` 构建和发送。

## Template 1: 健康报告 (Health Report)

**触发**: 每次质量检查完成后自动发送

```
✅ 【VideoLingo】成功: 项目健康度: 85/100 🟡

📋 检查项: 276 (12 cards × 23 checks)
✅ 通过: 224 (81%)  ↑ +28 from last
❌ 失败:  18 (7%)   ↓ -15
⚠️ 警告:  22 (8%)   ↓ -8
👤 待审:  12 (4%)   —

🤖 自动修复: 5 项
  • badge 'new' → 'New'
  • links undefined → null (3 cards)
  • hex → var(--yry-*) (1 file)

🔍 重点关注:
  1. ❌ struct-desc-dot — 3 cards 使用逗号而非 · 分隔符
  2. ❌ tag-semantic — 2 cards modifier 与语义不匹配
  3. ⚠️ tag-fingerprint — 2 cards 标签组重复

💡 18 项需人工处理。建议优先处理 fail 项。

🔗 查看详情: docs/components/intro/checklist/index.html

—— 2026/6/29 09:00:00
```

**构建方式**:

```javascript
import { formatHealthReport } from '../rui-bot/format.mjs';
const msg = formatHealthReport({
  project: 'VideoLingo',
  health: { score: 85, passCount: 224, failCount: 18, warnCount: 22, pendingCount: 12 },
  topIssues: [
    { name: 'struct-desc-dot', status: 'fail', note: '3 cards 使用逗号而非 · 分隔符' },
    { name: 'tag-semantic', status: 'fail', note: '2 cards modifier 与语义不匹配' },
    { name: 'tag-fingerprint', status: 'warn', note: '2 cards 标签组重复' },
  ],
  reportUrl: 'docs/components/intro/checklist/index.html',
});
```

## Template 2: 每日自省 (Daily Introspect)

**触发**: 用户说"今日自省"或定时每天 18:00

```
📋 【VideoLingo】每日自省 — 2026-06-29

🟢 今日 Good:
  1. 修复了 rui-graph 页面键盘快捷键失效问题
  2. 完成了 rui-demos 的 Type A 工具演示模板
  3. 更新了 rui-bot 的消息格式化文档

🔴 今日 Bad:
  1. 忽略了 rui-bot 超时重试的指数退避边界条件
  2. 未及时更新 SKILL.md 中的接口契约文档
  3. rui-html 组件 CSS 未注册到 _COMPONENTS_WITH_CSS

🎯 明日计划:
  1. 补充 rui-bot sendWithRetry 的单元测试
  2. 完成 rui-diagram 的全景视图功能
  3. 审核所有 rui-* 技能的 SKILL.md 接口一致性

📊 连续自省: 7 天

—— 每日自省 · 2026-06-29
```

**构建方式**:

```javascript
import { formatDailyIntrospect } from '../rui-bot/format.mjs';
const msg = formatDailyIntrospect({
  project: 'VideoLingo',
  date: '2026-06-29',
  goods: [
    '修复了 rui-graph 页面键盘快捷键失效问题',
    '完成了 rui-demos 的 Type A 工具演示模板',
    '更新了 rui-bot 的消息格式化文档',
  ],
  bads: [
    '忽略了 rui-bot 超时重试的指数退避边界条件',
    '未及时更新 SKILL.md 中的接口契约文档',
    'rui-html 组件 CSS 未注册到 _COMPONENTS_WITH_CSS',
  ],
  actions: [
    '补充 rui-bot sendWithRetry 的单元测试',
    '完成 rui-diagram 的全景视图功能',
    '审核所有 rui-* 技能的 SKILL.md 接口一致性',
  ],
});
```

## Template 3: 改进警报 (Improvement Alert)

四种子类型：健康分下降 / 问题回归 / 改进停滞 / 里程碑

### 3a: 健康分下降 (Score Decline)

```
🚨 【VideoLingo】错误: 健康分下降警报

📉 健康分: 85 → 72 (-13 分)
   上次: 2026-06-28 09:00 (85 分)
   本次: 2026-06-29 09:00 (72 分)

新增 fail: 8 项
  1. struct-desc-dot — 5 new cards
  2. tag-semantic — 2 modifier mismatches
  3. link-grid — 1 default link set in grid

⚠️ 可能原因: 新增卡片未遵循 rui-scene 规范

💡 建议: 立即运行 rui-checklist check 查看详情

🔗 查看详情: docs/components/intro/checklist/index.html

—— 2026/6/29 09:00:00
```

### 3b: 问题回归 (Regression)

```
⚠️ 【VideoLingo】警告: 问题回归警报

🔄 之前已修复的问题重新出现:
  1. tag-semantic — '58/100' 使用 info 而非 warn (已在 6/25 修复)
  2. struct-desc-dot — Card 'TTS Config' 恢复使用逗号 (已在 6/26 修复)

💡 建议: 检查最近的 git diff，确认是否有回退合并

—— 2026/6/29 14:00:00
```

### 3c: 改进停滞 (Stagnation)

```
⚠️ 【VideoLingo】警告: 改进停滞警报

📊 连续 3 次检查健康分未提升:
  6/25: 72 分
  6/27: 72 分
  6/29: 72 分

剩余问题: 8 fail + 12 warn (20 项)
平均修复速度: 0 项/天

💡 建议: 调整优先级 — 集中处理 fail 项，或考虑是否需要新增检查规则

—— 2026/6/29 09:00:00
```

### 3d: 里程碑 (Milestone)

```
✅ 【VideoLingo】成功: 🎉 质量里程碑达成

🏆 健康分首次达到 90 分!
   当前: 92 分 | 起点: 58 分 | 提升: +34 分

📈 历程:
  6/15: 58 分 🔴 → 6/20: 72 分 🟠 → 6/25: 85 分 🟡 → 6/29: 92 分 🟢

完成: 224 项 pass | 剩余: 0 fail + 5 warn
自动修复贡献: 28 项 | 人工修复: 15 项

💡 项目质量已达优秀水平，继续保持！

—— 2026/6/29 09:00:00
```
