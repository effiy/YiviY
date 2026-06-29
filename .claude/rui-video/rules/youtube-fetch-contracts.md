---
paths:
  - ".claude/rui-video/**"
  - ".claude/rui-video/SKILL.md"
description: "YouTube 视频下载的 yt-dlp 边界、单视频约束与输出目录契约。"
---

# rui-video 下载契约

> 通过 yt-dlp 下载单条 YouTube 视频，所有格式、路径与认证边界在此固化。

## 角色定位

| 维度 | 取值 |
|------|------|
| 输入 | 用户给出的 YouTube URL |
| 输出 | 视频或音频文件落到指定目录 |
| 调用模式 | 单次 `python3 scripts/download_video.py` |
| 状态 | 默认写 `/mnt/user-data/outputs/`；可改 `-o` |

## 输入契约

| 选项 | 取值 | 默认 |
|------|------|:---:|
| `<url>` (positional) | YouTube 单视频 URL | — |
| `-q, --quality` | `best` \| `1080p` \| `720p` \| `480p` \| `360p` \| `worst` | `best` |
| `-f, --format` | `mp4` \| `webm` \| `mkv` | `mp4` |
| `-a, --audio-only` | bool | `false`（下载后 = MP3）|
| `-o, --output` | 绝对路径 | `/mnt/user-data/outputs/` |

> URL 必须是单视频 — 播放列表不下载（自动跳过）。

## 输出契约

| 产物 | 命名 | 路径 |
|------|------|------|
| 视频 | `<title>.<ext>` | `-o` 或默认 |
| 音频 | `<title>.mp3` | 同上 |
| 临时文件 | `*.part` | 同上（下载中）|

文件名由 yt-dlp 自动从视频标题生成，不做修改。

## 路径所有权矩阵

| 路径 | 权限 | 备注 |
|------|:---:|------|
| `<this-skill-dir>/scripts/download_video.py` | r+w | owned |
| 用户指定 `-o` 路径 | write | 用户授权 |
| `/mnt/user-data/outputs/`（默认）| write | 部署环境约定 |
| YouTube 端点（yt-dlp HTTP）| read-only | 唯一外部源 |
| yt-dlp 二进制 | write（首次自动 `pip install`）| 一次性 |
| 任何其他路径 | **no write** | 严格限定 |

## 自我隔离硬规则

| # | 规则 | 设计理由 | 违反处置 |
|---|------|---------|---------|
| 1 | 单视频下载 — playlist 必须跳过（不弹提示且不写）| 防止批量下载违反 ToS | 脚本参数关 |
| 2 | 不转码、不编辑、不合并多源视频 — 仅透传 yt-dlp 输出 | 范围聚焦 | 跳过并提示 ffmpeg |
| 3 | 不下载字幕（`--write-subs` 关）| 字幕由他技能管 | 跳过 |
| 4 | 不使用 cookies / authentication — 公共视频 | 凭据保护 | 拒绝 token 传入 |
| 5 | 不调用 ffmpeg 后期处理 | 范围聚焦 | 提示独立工具 |
| 6 | 文件名不修改（保留 yt-dlp 生成的 title）| 一致性 | 警告 |
| 7 | 下载目标必须在 `-o` 内 — 不附加默认子目录 | 透明 | 阻塞 |
| 8 | 不读取任何调用方上下文（无 YRY / VL config 导入）| 范围聚焦 | 不读 CLAUDE.md |

## 失败与降级

| 场景 | 行为 | 恢复方式 |
|------|------|---------|
| `yt-dlp` 缺失 | 自动 `pip install yt-dlp` | 一次性 |
| 网络超时 / 403 / 地理限制 | yt-dlp 自报错透传 | 用户手动重试 |
| URL 是 playlist | 静默跳过 + stderr 警告 | 传单视频 |
| `-o` 路径无写权限 | yt-dlp 报错 | 用户 `chmod` |
| 文件名包含特殊字符 | yt-dlp 自动 sanitize | 用户接受 |
| 磁盘空间不足 | yt-dlp 自动终止 + 删除 partial | 清理后重试 |
| 视频私密 / 删除 | 报错 + 退出非 0 | 更换 URL |

## 与兄弟技能的关系

| 技能 | 方向 | 接口 | 说明 |
|------|------|------|------|
| (无强制) | 手动调用 | 单文件下载完成 | 后续可用 [[rui-html]] 转码 demo |
| [[rui-bot]] | 可选 | `--story=... --content="视频已下载"` | 下载完成通知 |

## 集成点

> 当前状态：本技能为按需单次工具，无定时器，无管线级自动调用。任何"管线完成自动下载"需求应在管线的最后一环显式 `python3 <this-skill-dir>/scripts/download_video.py <url>` 触发，不在 rui-video 内实现内置 listener。
