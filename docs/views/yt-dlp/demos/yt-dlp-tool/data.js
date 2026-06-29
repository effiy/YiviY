/**
 * yt-dlp Tool Demo — Data
 * =============================================================================
 * Type A: Tool Interface Demo — Download Pipeline Simulator
 *
 * Structure:
 *   Top-level keys      — cross-language constants (URLs, patterns, config)
 *   en / 'zh-CN'        — language slices with card + ui + stages + results
 *
 * Each progress stage has a trace object linking to the actual yt-dlp source:
 *   file       — display name of the Python source file
 *   fileId     — graph node ID (used for deep-link via ?focus=...)
 *   func       — display name of the function
 *   funcId     — graph node ID for the function
 *   desc       — human-readable description of what happens in this stage
 */
window.YT_DLP_TOOL_CONFIG = {

    /* ── Cross-Language Constants ──────────────────── */
    sampleInputs: [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://www.youtube.com/watch?v=jNQXAC9IVRw',
        'https://vimeo.com/1084537'
    ],

    /** Map URL keywords → mockResults index for realistic per-URL output */
    urlPatterns: [
        { keywords: ['rick', 'dQw4w9'],   idx: 0 },
        { keywords: ['zoo',  'jNQXAC'],   idx: 1 },
        { keywords: ['bunny','big buck'],  idx: 2 },
        { keywords: ['vimeo'],             idx: 1 }
    ],
    defaultIdx: 2,

    /** Retry simulation probabilities */
    retryRate: {
        postPipeline: 0.15,          // 15% chance of retry at pipeline end
        fragmentStage: 0.2,          // 20% chance of fragment download retry
        fragmentStageIndex: 3,       // which stage triggers fragment retries
        extraDelayMs: 400            // extra delay during retry simulation
    },

    /** Resolution → file size mapping (for idx=0, applied when user changes resolution) */
    resolutionSizes: {
        '4K':    '512 MB',
        '1440p': '256 MB',
        '1080p': '128 MB',
        '720p':  '72 MB',
        '480p':  '24 MB',
        '360p':  '8 MB'
    },

    /* ── English ──────────────────────────────────────── */
    en: {
        card: {
            name: '🎥 yt-dlp',
            desc: 'YouTube / 1,200+ sites download engine · <strong>360p → 4K</strong> · format selection · subtitle extraction · progress hooks',
            tags: [
                { text: '1.2k sites', modifier: 'cyan' },
                { text: 'Python',     modifier: 'purple' },
                { text: '5 retries',  modifier: 'accent' }
            ],
            badge: 'OSS',
            nameHref: '../../index.html'
        },

        ui: {
            /* Input section */
            inputLabel:        'Paste a video URL to simulate the yt-dlp download pipeline',
            placeholder:       'https://www.youtube.com/watch?v=...',
            download:          '⬇ Download',
            downloading:       '⏳ Downloading...',
            showOptions:       '▼ Advanced Options',
            hideOptions:       '▲ Hide Options',
            resolutionLabel:   'Resolution:',
            audioOnly:         'Audio only',
            extractSubtitles:  'Extract subtitles',
            downloadThumbnail: 'Download thumbnail',
            cmdLabel:          'Equivalent command:',

            /* Progress */
            progressHeader:    'Download Progress',
            tracePrefix:       '📍',
            retryPrefix:       '⚠ Retry',
            retrySuffix:       '— automatic fragment retry',
            retryInProgress:   'Fragment timeout — retrying',
            complete:          '✓ Complete',

            /* Result */
            completeHeader:    '✓ Download Complete',
            extractedSubs:     'Extracted Subtitles',
            resetBtn:          '↺ Try Another URL',
            resultLabelTitle:       'Title',
            resultLabelUploader:    'Uploader',
            resultLabelDuration:    'Duration',
            resultLabelViews:       'Views',
            resultLabelResolution:  'Resolution',
            resultLabelFormat:      'Format',
            resultLabelFileSize:    'File Size',
            resultLabelSavedAs:     'Saved As',
            resultLabelThumbnail:   'Thumbnail',
            resultLabelExtractedAt: 'Extracted At',

            /* Info area */
            infoHeader:        'About This Demo',
            infoP1:            'This interactive demo simulates the <strong>yt-dlp download pipeline</strong> as it runs inside VideoLingo. Each stage displays the actual Python source file and function — <strong>click them</strong> to open the code dependency graph at the exact node.',
            infoP2:            'The progress stages mirror the real implementation: connection pooling, fragment download with 5 retries, FFmpeg post-processing, and automatic yt-dlp update checks. <strong>All data is simulated</strong> — no real network requests are made.',
            infoP3:            'Try different resolution/format options or switch language (top-right corner) to see how the UI responds. URLs are matched to mock data by keyword lookup.',
            pipelineLink:      '📐 Pipeline Diagram',
            graphLink:         '🕸️ Code Dependency Graph',
            allDemosLink:      '🎬 All yt-dlp Demos',
            docsHomeLink:      '🏠 Docs Home'
        },

        /** 8-stage pipeline — trace objects link to code graph nodes */
        progressStages: [
            { pct: 2,  delay: 300,
              text: 'Checking yt-dlp version + auto-updating...',
              trace: { file: '_1_ytdlp.py', fileId: 'file:update_ytdlp', func: 'update_ytdlp()', funcId: 'func:update_ytdlp', desc: 'checks for updates once per session' } },
            { pct: 10, delay: 500,
              text: 'Extracting video metadata (--dump-json)...',
              trace: { file: 'YoutubeDL.py', fileId: 'file:YoutubeDL.py', func: 'extract_info()', funcId: 'func:extract_info', desc: 'fetches title, formats, subtitles, thumbnails' } },
            { pct: 25, delay: 400,
              text: 'Building format selector string...',
              trace: { file: '_1_ytdlp.py', fileId: 'file:build_format_str', func: 'build_format_str()', funcId: 'func:build_format_str', desc: 'constructs bestvideo+bestaudio format string' } },
            { pct: 45, delay: 900,
              text: 'Downloading video fragments (8 concurrent, 30s timeout)...',
              trace: { file: 'YoutubeDL.py', fileId: 'file:YoutubeDL.py', func: 'dl() → process_info()', funcId: 'func:process_video_result', desc: 'dispatches fragment downloader with 5-retry backoff' } },
            { pct: 65, delay: 600,
              text: 'Extracting subtitles (manual + auto, all languages)...',
              trace: { file: 'YoutubeDL.py', fileId: 'file:YoutubeDL.py', func: 'process_subtitles()', funcId: 'func:process_info', desc: 'fetches manual & auto-generated subtitle tracks' } },
            { pct: 80, delay: 500,
              text: 'Post-processing: FFmpeg merge + thumbnail embed...',
              trace: { file: 'YoutubeDL.py', fileId: 'file:YoutubeDL.py', func: 'post_process()', funcId: 'func:process_info', desc: 'merges video+audio streams, embeds thumbnail' } },
            { pct: 95, delay: 300,
              text: 'Sanitizing filename + writing to output/...',
              trace: { file: 'utils/_utils.py', fileId: 'file:utils/_utils.py', func: 'sanitize_filename()', funcId: 'func:sanitize_filename', desc: 'cleans filename, writes to output directory' } },
            { pct: 100, delay: 200,
              text: 'Pipeline complete — locating output files...',
              trace: { file: '_1_ytdlp.py', fileId: 'file:update_ytdlp', func: 'find_video_files()', funcId: 'func:find_video_files', desc: 'locates output files for next pipeline step' } }
        ],

        mockTitles: {
            rick:  'Rick Astley — Never Gonna Give You Up (Official Music Video)',
            zoo:   'Me at the zoo',
            bunny: 'Big Buck Bunny — 60fps 4K'
        },

        mockResults: [
            { titleKey: 'rick', duration: '3:32', uploader: 'Rick Astley', viewCount: '1,400,000,000+',
              resolution: '1080p', format: 'mp4 (h264 + aac)', fileSize: '128 MB',
              savedAs: 'Rick_Astley_-_Never_Gonna_Give_You_Up_1080p.mp4',
              subs: { en: 'manual (vtt)', 'zh-CN': 'auto-translated (vtt)', ja: 'auto (vtt)', ko: 'auto (vtt)', fr: 'manual (vtt)' },
              thumbnail: 'maxresdefault.jpg (1280×720)' },
            { titleKey: 'zoo', duration: '0:19', uploader: 'jawed', viewCount: '330,000,000+',
              resolution: '360p', format: 'mp4 (h264 + aac)', fileSize: '1.2 MB',
              savedAs: 'Me_at_the_zoo_360p.mp4',
              subs: { en: 'auto (vtt)' },
              thumbnail: 'default.jpg (120×90)' },
            { titleKey: 'bunny', duration: '10:34', uploader: 'Blender Foundation', viewCount: '22,000,000+',
              resolution: '4K', format: 'mp4 (av1 + opus)', fileSize: '845 MB',
              savedAs: 'Big_Buck_Bunny_60fps_4K.mp4',
              subs: { en: 'manual (srt)', de: 'manual (srt)', fr: 'manual (srt)', it: 'manual (srt)', ja: 'auto (vtt)', pt: 'auto (vtt)' },
              thumbnail: 'maxresdefault.jpg (1280×720)' }
        ],

        maxRetries: 5,

        /** Command template — shown to user, {url} is substituted */
        cmdTemplate: 'yt-dlp -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" --write-subs --write-auto-subs --embed-thumbnail "{url}"'
    },

    /* ── 简体中文 ──────────────────────────────────────── */
    'zh-CN': {
        card: {
            name: '🎥 yt-dlp',
            desc: 'YouTube / 1,200+ 站点下载引擎 · <strong>360p → 4K</strong> · 格式选择 · 字幕提取 · 进度回调',
            tags: [
                { text: '1.2k 站点', modifier: 'cyan' },
                { text: 'Python',    modifier: 'purple' },
                { text: '5 次重试',  modifier: 'accent' }
            ],
            badge: '开源',
            nameHref: '../../index.html'
        },

        ui: {
            inputLabel:        '粘贴视频 URL 模拟 yt-dlp 下载管线',
            placeholder:       'https://www.youtube.com/watch?v=...',
            download:          '⬇ 下载',
            downloading:       '⏳ 下载中…',
            showOptions:       '▼ 高级选项',
            hideOptions:       '▲ 收起选项',
            resolutionLabel:   '分辨率：',
            audioOnly:         '仅音频',
            extractSubtitles:  '提取字幕',
            downloadThumbnail: '下载缩略图',
            cmdLabel:          '等效命令：',

            progressHeader:    '下载进度',
            tracePrefix:       '📍',
            retryPrefix:       '⚠ 重试',
            retrySuffix:       '— 分片自动重试中',
            retryInProgress:   '分片超时 — 重试中',
            complete:          '✓ 完成',

            completeHeader:    '✓ 下载完成',
            extractedSubs:     '已提取字幕',
            resetBtn:          '↺ 换一个 URL',
            resultLabelTitle:       '标题',
            resultLabelUploader:    '上传者',
            resultLabelDuration:    '时长',
            resultLabelViews:       '播放量',
            resultLabelResolution:  '分辨率',
            resultLabelFormat:      '格式',
            resultLabelFileSize:    '文件大小',
            resultLabelSavedAs:     '保存为',
            resultLabelThumbnail:   '缩略图',
            resultLabelExtractedAt: '提取时间',

            infoHeader:        '关于此演示',
            infoP1:            '本交互式演示模拟 VideoLingo 内部运行的 <strong>yt-dlp 下载管线</strong>。每个阶段显示实际的 Python 源文件和函数 — <strong>点击即可</strong>跳转到代码依赖图中的对应节点。',
            infoP2:            '进度阶段与实际实现一致：连接池管理、分片下载并 5 次重试、FFmpeg 后处理、自动检查 yt-dlp 更新。<strong>全部数据为客户端模拟</strong>，不发起真实网络请求。',
            infoP3:            '尝试切换分辨率/格式选项，或切换界面语言（右上角），查看 UI 如何响应。通过关键词匹配，不同 URL 对应不同的模拟结果。',
            pipelineLink:      '📐 流水线图',
            graphLink:         '🕸️ 代码依赖图',
            allDemosLink:      '🎬 全部 yt-dlp 演示',
            docsHomeLink:      '🏠 文档首页'
        },

        progressStages: [
            { pct: 2,  delay: 300,
              text: '检查 yt-dlp 版本并自动更新…',
              trace: { file: '_1_ytdlp.py', fileId: 'file:update_ytdlp', func: 'update_ytdlp()', funcId: 'func:update_ytdlp', desc: '每次会话检查一次更新' } },
            { pct: 10, delay: 500,
              text: '提取视频元数据 (--dump-json)…',
              trace: { file: 'YoutubeDL.py', fileId: 'file:YoutubeDL.py', func: 'extract_info()', funcId: 'func:extract_info', desc: '获取标题、格式、字幕、缩略图信息' } },
            { pct: 25, delay: 400,
              text: '构建格式选择器字符串…',
              trace: { file: '_1_ytdlp.py', fileId: 'file:build_format_str', func: 'build_format_str()', funcId: 'func:build_format_str', desc: '构造 bestvideo+bestaudio 格式字符串' } },
            { pct: 45, delay: 900,
              text: '下载视频分片（8 路并发，30s 超时）…',
              trace: { file: 'YoutubeDL.py', fileId: 'file:YoutubeDL.py', func: 'dl() → process_info()', funcId: 'func:process_video_result', desc: '分发到分片下载器，5 次重试指数退避' } },
            { pct: 65, delay: 600,
              text: '提取字幕（人工 + 自动，全语言）…',
              trace: { file: 'YoutubeDL.py', fileId: 'file:YoutubeDL.py', func: 'process_subtitles()', funcId: 'func:process_info', desc: '获取人工 + 自动生成字幕轨道' } },
            { pct: 80, delay: 500,
              text: '后处理：FFmpeg 合并 + 缩略图嵌入…',
              trace: { file: 'YoutubeDL.py', fileId: 'file:YoutubeDL.py', func: 'post_process()', funcId: 'func:process_info', desc: '合并视频音频流，嵌入缩略图' } },
            { pct: 95, delay: 300,
              text: '文件名清洗 + 写入 output/…',
              trace: { file: 'utils/_utils.py', fileId: 'file:utils/_utils.py', func: 'sanitize_filename()', funcId: 'func:sanitize_filename', desc: '清理文件名，写入输出目录' } },
            { pct: 100, delay: 200,
              text: '管线完成 — 定位输出文件…',
              trace: { file: '_1_ytdlp.py', fileId: 'file:update_ytdlp', func: 'find_video_files()', funcId: 'func:find_video_files', desc: '定位输出文件以供下一步骤使用' } }
        ],

        mockTitles: {
            rick:  'Rick Astley — Never Gonna Give You Up (Official Music Video)',
            zoo:   '动物园的我',
            bunny: 'Big Buck Bunny — 60fps 4K'
        },

        mockResults: [
            { titleKey: 'rick', duration: '3:32', uploader: 'Rick Astley', viewCount: '14 亿+',
              resolution: '1080p', format: 'mp4 (h264 + aac)', fileSize: '128 MB',
              savedAs: 'Rick_Astley_-_Never_Gonna_Give_You_Up_1080p.mp4',
              subs: { en: '人工 (vtt)', 'zh-CN': '自动翻译 (vtt)', ja: '自动 (vtt)', ko: '自动 (vtt)', fr: '人工 (vtt)' },
              thumbnail: 'maxresdefault.jpg (1280×720)' },
            { titleKey: 'zoo', duration: '0:19', uploader: 'jawed', viewCount: '3.3 亿+',
              resolution: '360p', format: 'mp4 (h264 + aac)', fileSize: '1.2 MB',
              savedAs: 'Me_at_the_zoo_360p.mp4',
              subs: { en: '自动 (vtt)' },
              thumbnail: 'default.jpg (120×90)' },
            { titleKey: 'bunny', duration: '10:34', uploader: 'Blender Foundation', viewCount: '2200 万+',
              resolution: '4K', format: 'mp4 (av1 + opus)', fileSize: '845 MB',
              savedAs: 'Big_Buck_Bunny_60fps_4K.mp4',
              subs: { en: '人工 (srt)', de: '人工 (srt)', fr: '人工 (srt)', it: '人工 (srt)', ja: '自动 (vtt)', pt: '自动 (vtt)' },
              thumbnail: 'maxresdefault.jpg (1280×720)' }
        ],

        maxRetries: 5,

        cmdTemplate: 'yt-dlp -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" --write-subs --write-auto-subs --embed-thumbnail "{url}"'
    }
};
