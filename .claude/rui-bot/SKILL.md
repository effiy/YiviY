---
name: rui-bot
description: >
  Send WeChat Work (WeCom) bot notifications. Use when the user asks to send a
  notification, notify a WeChat/WeCom channel, or log pipeline messages.
  Executable: node <this-skill-dir>/send.mjs [options], where
  <this-skill-dir> is the directory containing this SKILL.md
  (typically .claude/rui-bot).
lifecycle: default-pipeline
---

# rui-bot

企业微信消息通知发送。手动触发 — 通过 WeCom webhook 发送通知并追加到消息通知列表。

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

### What this skill does NOT do

- **Send messages to channels other than WeCom** — non-WeCom transports are out of scope
- **Schedule or batch notifications** — fire-and-forget only; no built-in queue or cron
- **Persist message history beyond the per-story markdown log** — no central archive
- **Subscribe to events from other skills** — caller must invoke explicitly

### Coordinated with

| Skill | Direction | See |
|-------|-----------|-----|
| any pipeline rui-* | calls → rui-bot | `[IF-011](../INTERFACES.md#if-011)` |
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
