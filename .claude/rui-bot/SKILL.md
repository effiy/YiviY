---
name: rui-bot
description: >
  Notification hub — 项目通知中心。Send WeChat Work (WeCom) bot notifications
  with multi-level alerts (info/success/warning/error/fatal), structured report
  templates (pipeline, health, deploy, daily-introspect), and human-friendly
  formatting. Use when the user asks to send notifications, report pipeline
  results, do daily introspection, publish deploy alerts, or log to the
  per-story notification journal.
  Executable: node <this-skill-dir>/send.mjs [options]. For formatted messages,
  import from <this-skill-dir>/format.mjs.
lifecycle: default-pipeline
---

# rui-bot — 项目通知中心

企业微信消息通知枢纽 — 提供多级告警、结构化报告模板、人性化消息格式。作为整个 rui-* 技能体系的**通知中枢**，所有管线和自检技能通过 rui-bot 统一发出消息。

## Invocation

```
node <this-skill-dir>/send.mjs [options]
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--story=<name>` | 故事名，用于日志路径 | — |
| `--project=<name>` | 项目名 | 从 CLAUDE.md 读取 |
| `--content=<text>` | 消息正文 | — |
| `--contentFile=<path>` | 从文件读取正文（相对项目根） | — |
| `--no-send` | 仅追加日志，不发送 HTTP | `false` |

### Environment Variables

| Variable | Description |
|----------|-------------|
| `API_X_TOKEN` | **Required.** 网关认证令牌 |
| `WEWORK_BOT_WEBHOOK_URL` | 可选全局 webhook URL 覆盖 |

## Workflow

```
User invokes → ① Append log (→ 消息通知列表.md) → ② Send HTTP POST (→ WeCom webhook)
```

| Step | Action | Detail |
|------|--------|--------|
| ① Append log | Always | Write to `docs/故事任务面板/<story>/消息通知列表.md` |
| ② Send | Unless `--no-send` | POST to WeCom gateway with retry |

## Message Format

- `【ProjectName】` header auto-prepended
- Plain text, max **2000** characters
- Truncated with `…` if over limit

## Alert Levels & Message Formatting

`format.mjs` 提供结构化消息构建 — 告警级别、报告模板、人性化排版。

### 告警级别

| Level | Emoji | 含义 | 使用场景 |
|-------|-------|------|----------|
| `info` | ℹ️ | 信息 | 常规状态更新、进度通知 |
| `success` | ✅ | 成功 | 管线完成、部署成功、检查通过 |
| `warning` | ⚠️ | 警告 | 部分失败、阈值告警、需关注 |
| `error` | 🚨 | 错误 | 管线失败、部署失败、检查不通过 |
| `fatal` | 💥 | 致命 | 系统崩溃、数据丢失风险 |

### 消息构建 API

```javascript
import { formatAlert, formatReport, formatSummary, ALERT_LEVELS } from './format.mjs';

// ① 通用告警 — 任意场景，完全自定义
formatAlert({
  project: 'VideoLingo',
  level: 'warning',               // info | success | warning | error | fatal
  title: '字幕提取速率下降',        // 一行概要
  detail: '过去1小时内失败率升至12%，正常应<5%',
  fields: { '失败数': '47', '成功率': '88%' },
  suggestion: '建议检查 yt-dlp 版本兼容性',
  link: 'http://...',
});

// ② 管线完成报告 — 自动化管线结果通知
formatPipelineReport({
  project: 'VideoLingo',
  pipelineName: 'yt-dlp 字幕提取',
  status: 'success',              // success | warning | error
  stats: { total: 120, success: 118, failed: 2, skipped: 0 },
  durationSec: 154,
  logUrl: 'http://...',
});

// ③ 项目健康报告 — 配合 rui-checklist 使用
formatHealthReport({
  project: 'VideoLingo',
  health: { score: 85, passCount: 68, failCount: 5, warnCount: 7, pendingCount: 3 },
  topIssues: [
    { name: 'struct-desc-dot', status: 'fail', note: '3 cards 使用逗号而非 · 分隔符' },
    { name: 'tag-semantic', status: 'warn', note: '2 cards modifier 与语义不匹配' },
  ],
  reportUrl: 'http://...',
});

// ④ 每日自省报告 — 配合 rui-checklist 每日自省使用
formatDailyIntrospect({
  project: 'VideoLingo',
  date: '2026-06-29',
  goods: ['修复了 graph 页面键盘快捷键失效问题', '完成了 rui-demos 的 4-demo suite'],
  bads: ['忽略了 rui-bot 超时重试的边界条件', '未及时更新 SKILL.md 接口文档'],
  actions: ['补充 rui-bot 重试逻辑的单元测试', '完成 rui-diagram 全景视图'],
});

// ⑤ 部署报告
formatDeployReport({
  project: 'VideoLingo',
  version: 'v2.3.1',
  env: 'production',
  status: 'success',
  changes: ['修复 yt-dlp 下载超时重试', '新增多语言字幕合并功能'],
  durationSec: 45,
});

// ⑥ 简洁摘要 — 高频通知合并
formatSummary({
  project: 'VideoLingo',
  title: '今日管线汇总',
  items: [
    { icon: '✅', text: 'yt-dlp 字幕提取: 120/120 成功' },
    { icon: '⚠️', text: 'WhisperX 转录: 95/100 成功 (5 GPU 不足跳过)' },
    { icon: '✅', text: 'NLP 分句: 120/120 成功' },
  ],
});
```

### 辅助函数

```javascript
import { sanitizeForWecom, truncateForWecom } from './format.mjs';

sanitizeForWecom('<strong>text</strong>');  // → "text" (移除 HTML)
truncateForWecom(longMsg, 2000);            // → 截断到 2000 字符
```

## API Contract

```
POST <apiUrl>
Headers:
  Content-Type: application/json
  X-Token: <API_X_TOKEN>
Body:
  { "webhook_url": "<resolved>", "content": "<message>" }

Timeout: 30s
Retries: 3 (exponential backoff: 2s, 4s, 8s)
Success: HTTP 200–299
```

| Element | Source |
|---------|--------|
| `apiUrl` | `config.json` > `https://api.effiy.cn/wework/send-message` |
| webhook URL | `WEWORK_BOT_WEBHOOK_URL` env > `config.json` robots |
| `API_X_TOKEN` | Environment variable only |

## Notification Log

| Aspect | Detail |
|--------|--------|
| Trigger | When `--story` is specified |
| Path | `docs/故事任务面板/<story>/消息通知列表.md` |
| Write mode | Append only |
| Entry format | `【YYYY-MM-DD HH:mm:ss】` + blank line + full message body + trailing newline |

## Degradation

| Situation | Behavior |
|-----------|----------|
| `API_X_TOKEN` missing | Skip HTTP, log written |
| Webhook URL unreachable | Skip HTTP, log written |
| Message > 2000 chars | Auto-truncate with `…` |
| Network timeout | Retry with exponential backoff |

## Security

| # | Rule |
|---|------|
| 1 | Never commit tokens or webhook URLs |
| 2 | `API_X_TOKEN` from environment variable only |
| 3 | Real webhook URL never written to docs |

## Examples

```bash
# Send notification
node <this-skill-dir>/send.mjs --story=user-login --content="管线完成"

# Log only, no HTTP
node <this-skill-dir>/send.mjs --story=user-login --content="管线完成" --no-send

# Read content from file
node <this-skill-dir>/send.mjs --story=user-login --contentFile=message.txt
```

### Formatted Message Examples

```bash
# Pipeline completion report (via Node.js script using format.mjs)
node <this-skill-dir>/send.mjs --story=subtitle-pipeline \
  --content="✅ 【VideoLingo】成功: 管线完成: yt-dlp 字幕提取

📊 总计: 120 | ✅ 成功: 118 | ❌ 失败: 2 | ⏭️ 跳过: 0
⏱️ 耗时: 2m 34s

💡 管线已完成，可查看日志了解详情。

—— 2026/6/29 14:30:00"

# Daily introspection
node <this-skill-dir>/send.mjs --story=daily-check \
  --contentFile=.claude/rui-checklist/daily-introspect.txt

# Health check alert (warning level)
node <this-skill-dir>/send.mjs --story=health-check \
  --content="⚠️ 【VideoLingo】警告: 项目健康度: 72/100 🟡

📋 检查项: 83
✅ 通过: 68 | ❌ 失败: 8 | ⚠️ 警告: 4 | 👤 待审: 3

🔍 重点关注:
  1. ❌ struct-desc-dot — 3 cards 使用逗号而非 · 分隔符
  2. ❌ tag-semantic — 2 cards modifier 与语义不匹配
  3. ⚠️ link-grid — 1 card 在 grid 中使用了默认7链接集

💡 建议立即处理 fail 项，查看详细报告了解改进建议。

—— 2026/6/29 09:00:00"
```

## 规则

- [notification-contracts.md](./rules/notification-contracts.md) — WeCom webhook 通知的输入 / 输出 / 路径所有权 / 失败降级契约。

## 专业代理

- [notification-troubleshooter.md](./agents/notification-troubleshooter.md) — 通知发送失败根因分类与下一步建议。
- [content-curator.md](./agents/content-curator.md) — 将任意内容塑形为 WeCom 兼容的纯文本消息。

## Borders

### What this skill does

- Send WeCom webhook notifications with retry + backoff
- Append every send (or `--no-send` log-only attempt) to `docs/故事任务面板/<story>/消息通知列表.md`
- Truncate messages to 2000 chars and prepend project name header
- **Format multi-level alerts** (info / success / warning / error / fatal) with `format.mjs`
- **Generate structured reports**: pipeline completion, health check, deploy, daily introspection
- **Serve as the notification hub** for all rui-* skills — rui-checklist / rui-demos / rui-diagram pipeline results flow through rui-bot

### What this skill does NOT do

- **Send messages to channels other than WeCom** — non-WeCom transports are out of scope
- **Schedule or batch notifications** — fire-and-forget only; no built-in queue or cron
- **Persist message history beyond the per-story markdown log** — no central archive
- **Subscribe to events from other skills** — caller must invoke explicitly

### Coordinated with

| Skill | Direction | See |
|-------|-----------|-----|
| any pipeline rui-* | calls → rui-bot | `[IF-011](../INTERFACES.md#if-011)` |
| [[rui-checklist]] | calls → rui-bot | Health reports, daily introspection → rui-bot for delivery |
| [[rui-demos]] | calls → rui-bot | Pipeline completion reports |
| [[rui-diagram]] | calls → rui-bot | Analysis completion notifications |
| [[rui-skill]] | can target | rui-skill may add evals around rui-bot |

### Output ownership

| Path | Permission |
|------|-----------|
| `<this-skill-dir>/` | read+write (owned) |
| `docs/故事任务面板/<story>/消息通知列表.md` | append-only (owned per-story) |
| WeCom webhook endpoint | write (HTTP POST) |
| Anywhere else | no write |

### Invocation

Entry scripts live alongside this SKILL.md:

```bash
node <this-skill-dir>/send.mjs [options]      # main entry
node <this-skill-dir>/help.mjs                 # show help
```

`<this-skill-dir>` is the directory containing this SKILL.md (typically `.claude/rui-bot/`). On first run, both scripts require `--help` to verify environment.
