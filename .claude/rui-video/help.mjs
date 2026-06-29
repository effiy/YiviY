#!/usr/bin/env node
// rui-video — YouTube 视频下载帮助
// 用法: node .claude/rui-video/help.mjs

import { bold, dim, cyan, yellow } from '../../lib/tty.mjs';
import { hdr, subhdr, item, scene } from '../../lib/help-layout.mjs';

const help = `
${bold("# rui-video — YouTube 视频下载")}

${dim("yt-dlp 驱动 · 质量控制 · 多格式 · 纯音频 · 自动安装 | 单视频下载")}

${hdr("快速入门")}
${item("python3 <this-skill-dir>/scripts/download_video.py \"<url>\"", "下载最佳质量 MP4 到默认输出目录", cyan)}
${item("核心依赖", "yt-dlp（首次运行自动安装）· python3", dim)}

${hdr("参数")}

${subhdr("质量设置 (-q / --quality)")}
${item("best (默认)", "最高可用质量", cyan)}
${item("1080p", "全高清", cyan)}
${item("720p", "高清", cyan)}
${item("480p", "标清", cyan)}
${item("360p", "低质量", cyan)}
${item("worst", "最低可用质量", cyan)}

${subhdr("格式选项 (-f / --format) — 仅视频")}
${item("mp4 (默认)", "最兼容格式", cyan)}
${item("webm", "现代格式", cyan)}
${item("mkv", "Matroska 容器", cyan)}

${subhdr("纯音频 (-a / --audio-only)")}
${item("-a", "仅下载音频 → 输出 MP3", yellow)}

${subhdr("输出目录 (-o / --output)")}
${item("-o <dir>", "自定义输出目录 → 默认 /mnt/user-data/outputs/", cyan)}

${hdr("完整示例")}
${item("1080p MP4", "python3 scripts/download_video.py \"https://www.youtube.com/watch?v=dQw4w9WgXcQ\" -q 1080p", cyan)}
${item("纯音频 MP3", "python3 scripts/download_video.py \"https://www.youtube.com/watch?v=dQw4w9WgXcQ\" -a", cyan)}
${item("720p WebM 自定义路径", "python3 scripts/download_video.py \"URL\" -q 720p -f webm -o /custom/path", cyan)}
${item("最低质量 mp4", "python3 scripts/download_video.py \"URL\" -q worst", cyan)}

${hdr("工作原理")}
${item("Step 1", "检查 yt-dlp 是否安装 → 如缺失则自动安装 (pip install yt-dlp)", dim)}
${item("Step 2", "获取视频信息 → 选择匹配质量/格式的最佳可用流", dim)}
${item("Step 3", "下载视频+音频流 → 必要时合并 (ffmpeg) → 输出到目标目录", dim)}
${item("文件命名", "自动从视频标题生成 → 安全文件名处理", dim)}

${hdr("专业代理")}
${item("format-advisor", "用户意图 → 推荐 quality + format + -o 路径组合", cyan)}
${item("error-diagnoser", "yt-dlp stderr → 根因分类 + 下一步建议 + 验证代码片段", cyan)}

${hdr("边界（Borders）")}
${item("做什么", "单 YouTube 视频下载 (yt-dlp) · 质量+格式+纯音频标志 · 自动安装 · 可配置输出目录", dim)}
${item("不做什么", "播放列表下载（明确跳过）· 转码/编辑/合并 · 字幕提取 · 登录/认证（仅公开视频）", dim)}

${hdr("使用场景")}
${scene("场景 1 — 快速下载最佳质量")}
${item("python3 scripts/download_video.py \"URL\"", "→ 默认 best + mp4 → /mnt/user-data/outputs/<title>.mp4", cyan)}

${scene("场景 2 — 下载音频做 TTS 对比素材")}
${item("python3 scripts/download_video.py \"URL\" -a", "→ 纯音频 MP3 → 用于多引擎 TTS 对比测试", cyan)}

${scene("场景 3 — 下载小文件快速预览")}
${item("python3 scripts/download_video.py \"URL\" -q 360p", "→ 低质量小文件 → 快速下载预览", cyan)}

${scene("场景 4 — 为 demo 下载素材")}
${item("python3 scripts/download_video.py \"URL\" -q 720p -o docs/assets/", "→ rui-demos 调用 → 下载素材到项目 assets 目录", cyan)}
`;

console.log(help);
