# rui-bot · Templates

企业微信通知消息模板。

| 模板 | 用途 |
|------|------|
| `notification.md`    | 通用通知（≤2000 字符，自动截断） |
| `pipeline-status.md` | 流水线状态（阶段 / 度量 / 下一步） |
| `error-alert.md`      | 错误告警（严重度 / 影响 / 行动项 / @on-call） |

## 使用方式

```bash
# 1. 选模板并替换占位
# 2. 通过 send.mjs 发送
node .claude/rui-bot/send.mjs \
  --story=<name> \
  --contentFile=path/to/filled-template.md \
  --project=<project>
```

## 硬约束

- 消息 ≤ 2000 字符（send.mjs 自动截断加 `…`）
- 头部 `【ProjectName】` 由脚本自动添加
- 时间戳 `【YYYY-MM-DD HH:mm:ss】` 由脚本自动追加到日志条目
- 纯文本，无 Markdown 渲染