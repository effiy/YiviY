---
name: rui-bot
description: >
  Send WeChat Work (WeCom) bot notifications. Use when the user asks to send a
  notification, notify a WeChat/WeCom channel, or log pipeline messages.
  Executable: node .claude/rui-bot/send.mjs [options].
user_invocable: true
lifecycle: default-pipeline
---

# rui-bot

企业微信消息通知发送。手动触发 — 通过 WeCom webhook 发送通知并追加到消息通知列表。

## Invocation

```
node .claude/rui-bot/send.mjs [options]
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
node .claude/rui-bot/send.mjs --story=user-login --content="管线完成"

# Log only, no HTTP
node .claude/rui-bot/send.mjs --story=user-login --content="管线完成" --no-send

# Read content from file
node .claude/rui-bot/send.mjs --story=user-login --contentFile=message.txt
```
