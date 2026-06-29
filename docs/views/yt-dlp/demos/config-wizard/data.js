/**
 * Config Wizard Demo — Data
 * =============================================================================
 * Type F: Guide Walkthrough — yt-dlp Configuration Wizard
 *
 * 4-step walkthrough for configuring yt-dlp:
 *   1. Format Selection      — build format selector strings
 *   2. Subtitle Options      — configure subtitle download and language filters
 *   3. Post-Processing       — FFmpeg options and thumbnail handling
 *   4. Output Templates      — design filename patterns with variables
 *
 * Each step has:
 *   - title + instruction text
 *   - code snippet (copyable)
 *   - filename label for the code block
 *   - expected result text
 */
window.CONFIG_WIZARD_CONFIG = {

    /* Cross-language: step definitions share templates */
    codeSnippets: {
        format: {
            code: '# Format selection examples\n\n# Best quality: 4K VP9 + Opus in WebM\n-f "bestvideo[height<=2160][vcodec=vp9]+bestaudio[acodec=opus]/best"\n\n# Balanced: 1080p H.264 + AAC in MP4 (DEFAULT)\n-f "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]"\n\n# Audio only: best quality, convert to M4A\n-f "bestaudio[ext=m4a]/bestaudio" -x --audio-format m4a\n\n# Space-saving: AV1 at any resolution\n-f "bestvideo[vcodec=av1]+bestaudio/best"',
            filename: 'format_strings.txt'
        },
        subs: {
            code: '# Subtitle configuration\n\n# Download all available manual + auto subtitles\n--write-subs --write-auto-subs\n\n# Download only specific languages\n--sub-langs "en,zh-CN,ja,ko,fr"\n\n# Convert all subtitles to SRT format\n--convert-subs srt\n\n# Embed subtitles into the video file\n--embed-subs\n\n# Don\'t download auto-generated subs (manual only)\n--no-write-auto-subs',
            filename: 'subtitle_flags.txt'
        },
        postproc: {
            code: '# Post-processing options\n\n# Extract audio only (skip video download entirely)\n-x --audio-format mp3 --audio-quality 0\n\n# Embed thumbnail into video file\n--embed-thumbnail\n\n# Add metadata (title, uploader, description)\n--add-metadata\n\n# Remux to MKV (preserves all streams)\n--remux-video mkv\n\n# Limit download speed to 5 MB/s\n--limit-rate 5M\n\n# Custom FFmpeg post-processing\n--exec "ffmpeg -i {} -vf scale=1280:720 {}.720p.mp4"',
            filename: 'post_processing.txt'
        },
        output: {
            code: '# Output filename templates\n\n# Organize by uploader and title\n-o "%(uploader)s/%(title)s.%(ext)s"\n\n# Include resolution and format in filename\n-o "%(title)s [%(resolution)s] [%(format_id)s].%(ext)s"\n\n# Date-based directory structure\n-o "%(upload_date>%Y-%m-%d)s/%(title)s.%(ext)s"\n\n# Simple: title + video ID (unique)\n-o "%(title)s-%(id)s.%(ext)s"\n\n# Full metadata filename\n-o "%(uploader)s_-_%(title)s_-_%(upload_date>%Y-%m-%d)s_-_%(id)s.%(ext)s"',
            filename: 'output_templates.txt'
        }
    },

    /* ── English ──────────────────────────────────────── */
    en: {
        card: {
            name: '⚙️ Configuration Wizard',
            desc: 'Step-by-step yt-dlp config builder · <strong>format strings</strong> · subtitle options · post-processing · output templates',
            tags: [
                { text: '4 steps',    modifier: 'purple' },
                { text: 'copyable',   modifier: 'cyan' },
                { text: 'yt-dlp CLI', modifier: 'accent' }
            ],
            badge: 'Guide',
            nameHref: '../../index.html#config-wizard'
        },

        ui: {
            /* Navigation */
            prevBtn: '← Previous',
            nextBtn: 'Next →',
            copyBtn: '📋 Copy',
            copied: '✓ Copied!',
            stepCount: 'Step',
            of: 'of',

            /* Step titles & instructions */
            step1title: '1. Format Selection',
            step1instr: 'Configure how yt-dlp selects video and audio formats. The format string determines resolution, codec, and container. Best results combine bestvideo + bestaudio for maximum quality.',
            step1result: 'These format strings cover the most common use cases. The default selects H.264/AAC in MP4 for universal compatibility. For archival, use the highest quality VP9 or AV1 variant.',

            step2title: '2. Subtitle Options',
            step2instr: 'Configure subtitle extraction behavior. You can download manual captions (creator-uploaded), auto-generated captions (YouTube ASR), or both. Filter by language codes and convert between formats.',
            step2result: 'Use --write-subs --write-auto-subs together to get all available subtitles. Filter with --sub-langs to avoid downloading unnecessary languages. Convert to SRT for maximum tool compatibility.',

            step3title: '3. Post-Processing',
            step3instr: 'Configure FFmpeg post-processing — audio extraction, video remuxing, thumbnail embedding, metadata injection, and custom exec hooks.',
            step3result: 'Post-processing happens after download completes. --add-metadata injects YouTube metadata into the file. --embed-thumbnail adds the cover image. Use --exec for arbitrary FFmpeg commands.',

            step4title: '4. Output Templates',
            step4instr: 'Design filename patterns using yt-dlp output template variables. Organize downloads by uploader, date, resolution, or any metadata field.',
            step4result: 'Output templates use %(field)s syntax. Available fields: title, uploader, upload_date, id, resolution, format_id, ext, and many more. Combine them to create your ideal organization scheme.',

            /* Info area */
            infoHeader: 'About This Demo',
            infoP1: 'This interactive walkthrough guides you through <strong>configuring yt-dlp for VideoLingo</strong> in 4 steps. Each step covers a category of yt-dlp options with real, working configuration snippets that you can copy and use directly.',
            infoP2: 'All snippets use real yt-dlp CLI flags and format strings. The <strong>format selector</strong> is the most important — it determines what quality and codec you get. The <strong>output template</strong> controls how files are named and organized.',
            infoP3: 'Tip: yt-dlp supports a configuration file at <code>~/.config/yt-dlp/config</code> where you can set defaults for all these options.',
            pipelineLink: '📐 Pipeline Diagram',
            graphLink: '🕸️ Code Dependency Graph',
            allDemosLink: '🎬 All yt-dlp Demos',
            docsHomeLink: '🏠 Docs Home'
        }
    },

    /* ── 简体中文 ──────────────────────────────────────── */
    'zh-CN': {
        card: {
            name: '⚙️ 配置向导',
            desc: '逐步构建 yt-dlp 配置 · <strong>格式字符串</strong> · 字幕选项 · 后处理 · 输出模板',
            tags: [
                { text: '4 步',        modifier: 'purple' },
                { text: '可复制',       modifier: 'cyan' },
                { text: 'yt-dlp CLI', modifier: 'accent' }
            ],
            badge: '教程',
            nameHref: '../../index.html#config-wizard'
        },

        ui: {
            prevBtn: '← 上一步',
            nextBtn: '下一步 →',
            copyBtn: '📋 复制',
            copied: '✓ 已复制！',
            stepCount: '步骤',
            of: '/',

            step1title: '1. 格式选择',
            step1instr: '配置 yt-dlp 如何选择视频和音频格式。格式字符串决定分辨率、编码和容器。最佳实践是组合 bestvideo + bestaudio 以获得最高质量。',
            step1result: '这些格式字符串覆盖了最常见的用例。默认选择 H.264/AAC 的 MP4 以获得通用兼容性。如需存档，使用最高质量的 VP9 或 AV1 变体。',

            step2title: '2. 字幕选项',
            step2instr: '配置字幕提取行为。可下载人工字幕（创作者上传）、自动生成字幕（YouTube ASR）或两者兼有。按语言代码筛选并在格式间转换。',
            step2result: '同时使用 --write-subs --write-auto-subs 获取所有可用字幕。使用 --sub-langs 筛选避免下载不需要的语言。转换为 SRT 以获得最佳工具兼容性。',

            step3title: '3. 后处理',
            step3instr: '配置 FFmpeg 后处理 — 音频提取、视频重封装、缩略图嵌入、元数据注入和自定义 exec 钩子。',
            step3result: '后处理在下载完成后执行。--add-metadata 将 YouTube 元数据注入文件。--embed-thumbnail 添加封面图片。使用 --exec 执行任意 FFmpeg 命令。',

            step4title: '4. 输出模板',
            step4instr: '使用 yt-dlp 输出模板变量设计文件名模式。按上传者、日期、分辨率或任意元数据字段组织下载文件。',
            step4result: '输出模板使用 %(field)s 语法。可用字段包括：title、uploader、upload_date、id、resolution、format_id、ext 等。组合它们创建理想的组织方案。',

            infoHeader: '关于此演示',
            infoP1: '此交互式教程通过 4 个步骤引导你<strong>为 VideoLingo 配置 yt-dlp</strong>。每个步骤涵盖一类 yt-dlp 选项，并提供可直接复制使用的真实配置片段。',
            infoP2: '所有片段均使用真实的 yt-dlp CLI 参数和格式字符串。<strong>格式选择器</strong>最为重要 — 它决定你获得的质量和编码。<strong>输出模板</strong>控制文件的命名和组织方式。',
            infoP3: '提示：yt-dlp 支持在 <code>~/.config/yt-dlp/config</code> 中使用配置文件，你可以为上述所有选项设置默认值。',
            pipelineLink: '📐 流水线图',
            graphLink: '🕸️ 代码依赖图',
            allDemosLink: '🎬 全部 yt-dlp 演示',
            docsHomeLink: '🏠 文档首页'
        }
    }
};
