---
name: rui-video
description: Download YouTube videos with customizable quality and format options. Use this skill when the user asks to download, save, or grab YouTube videos. Supports various quality settings (best, 1080p, 720p, 480p, 360p), multiple formats (mp4, webm, mkv), and audio-only downloads as MP3.
lifecycle: default-pipeline
---

# Rui Video

Download YouTube videos with full control over quality and format settings.

## Quick Start

The simplest way to download a video:

```bash
python scripts/download_video.py "https://www.youtube.com/watch?v=VIDEO_ID"
```

This downloads the video in best available quality as MP4 to `/mnt/user-data/outputs/`.

## Options

### Quality Settings

Use `-q` or `--quality` to specify video quality:

- `best` (default): Highest quality available
- `1080p`: Full HD
- `720p`: HD
- `480p`: Standard definition
- `360p`: Lower quality
- `worst`: Lowest quality available

Example:
```bash
python scripts/download_video.py "URL" -q 720p
```

### Format Options

Use `-f` or `--format` to specify output format (video downloads only):

- `mp4` (default): Most compatible
- `webm`: Modern format
- `mkv`: Matroska container

Example:
```bash
python scripts/download_video.py "URL" -f webm
```

### Audio Only

Use `-a` or `--audio-only` to download only audio as MP3:

```bash
python scripts/download_video.py "URL" -a
```

### Custom Output Directory

Use `-o` or `--output` to specify a different output directory:

```bash
python scripts/download_video.py "URL" -o /path/to/directory
```

## Complete Examples

1. Download video in 1080p as MP4:
```bash
python scripts/download_video.py "https://www.youtube.com/watch?v=dQw4w9WgXcQ" -q 1080p
```

2. Download audio only as MP3:
```bash
python scripts/download_video.py "https://www.youtube.com/watch?v=dQw4w9WgXcQ" -a
```

3. Download in 720p as WebM to custom directory:
```bash
python scripts/download_video.py "https://www.youtube.com/watch?v=dQw4w9WgXcQ" -q 720p -f webm -o /custom/path
```

## How It Works

The skill uses `yt-dlp`, a robust YouTube downloader that:
- Automatically installs itself if not present
- Fetches video information before downloading
- Selects the best available streams matching your criteria
- Merges video and audio streams when needed
- Supports a wide range of YouTube video formats

## Important Notes

- Downloads are saved to `/mnt/user-data/outputs/` by default
- Video filename is automatically generated from the video title
- The script handles installation of yt-dlp automatically
- Only single videos are downloaded (playlists are skipped by default)
- Higher quality videos may take longer to download and use more disk space

## 规则

- [youtube-fetch-contracts.md](./rules/youtube-fetch-contracts.md) — YouTube 单视频下载的 yt-dlp 选项、输出契约、路径所有权与无认证硬约束。

## 专业代理

- [format-advisor.md](./agents/format-advisor.md) — 由用户意图推荐 `quality` + `format` + `-o` 路径组合。
- [error-diagnoser.md](./agents/error-diagnoser.md) — yt-dlp stderr → 根因分类 + 下一步 + 验证片段。

## Borders

### What this skill does

- Download single YouTube videos via `yt-dlp` (quality + format + audio-only flags)
- Auto-install `yt-dlp` if missing
- Save to a configurable output directory (default `/mnt/user-data/outputs/`)

### What this skill does NOT do

- **Download playlists** — single-video only; playlists are explicitly skipped
- **Transcode, edit, or merge** — pass-through download only
- **Subtitle extraction** — `--write-subs` is out of scope
- **Authentication / cookies** — public videos only

### Coordinated with

| Skill | Direction | See |
|-------|-----------|-----|
| rui-demo (pipeline) | calls → rui-video | rui-video is invoked when a rui-demos pipeline needs fixture media |
| (standalone) | — | Otherwise invoked manually |

### Output ownership

| Path | Permission |
|------|-----------|
| `<this-skill-dir>/scripts/download_video.py` | read+write (owned) |
| Output directory (`-o` or `/mnt/user-data/outputs/` default) | write |
| YouTube endpoint (via yt-dlp) | read-only (HTTP GET) |
| Anywhere else | no write |

### Invocation

Entry script lives alongside this SKILL.md:

```bash
python3 <this-skill-dir>/scripts/download_video.py "<url>" [-q 720p] [-f mp4] [-a] [-o <dir>]
```

`<this-skill-dir>` is the directory containing this SKILL.md (typically `.claude/rui-video/`). Requires `python3`; `yt-dlp` is auto-installed on first run.