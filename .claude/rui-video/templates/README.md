# rui-video · Templates

YouTube 视频下载清单模板。

| 模板 | 用途 |
|------|------|
| `download-manifest.md` | 单视频下载清单（信息 + 配置 + 输出 + 校验和） |
| `batch-summary.md`     | 批量下载汇总（每条 URL 的状态 + 失败原因） |

## 字段填充

```bash
# 单视频
python3 .claude/rui-video/scripts/download_video.py "<URL>" -q 1080p

# 批量
# 见 references/youtube-fetch-contracts.md
```

模板字段可从 yt-dlp `--write-info-json` 的 `.info.json` 填充。