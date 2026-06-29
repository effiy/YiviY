## [ProjectName] · [StoryName] · [YYYY-MM-DD HH:mm]

[Main notification body in plain text. Keep under 2000 characters total — the
sender will auto-truncate with `…` if exceeded. Line breaks are preserved.]

Key points:
- [point 1]
- [point 2]
- [point 3]

---
Triggered by: [user/system/cron] · Channel: [general/ops/alerts]

<!--
Template usage notes:
  - Header: 【ProjectName】 is auto-prepended by send.mjs
  - Timestamp: 【YYYY-MM-DD HH:mm:ss】 is auto-appended to log entries
  - Body: plain text only; no markdown rendering on WeCom
  - Path: appended to docs/故事任务面板/<story>/消息通知列表.md
  - Length: < 2000 chars (system auto-truncates otherwise)
-->