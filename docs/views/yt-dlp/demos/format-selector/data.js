/**
 * Format Selector Demo — Data
 * =============================================================================
 * Type C: Comparison Showcase — Format & Resolution Selector
 *
 * Structure:
 *   Top-level keys      — cross-language constants
 *   en / 'zh-CN'        — language slices with card + ui + format data
 *
 * Format categories:
 *   video   — video+audio muxed formats with resolution × codec matrix
 *   audio   — audio-only extraction formats
 *   default — what yt-dlp selects by default for each resolution tier
 *
 * Each format entry:
 *   id          — unique format identifier
 *   resolution  — display resolution (4K, 1080p, etc.) or 'audio-only'
 *   codec       — video codec (h264, av1, vp9) or audio codec (aac, opus, vorbis)
 *   container   — file container (mp4, mkv, webm, m4a)
 *   bitrate     — approximate bitrate
 *   sizePerMin  — estimated MB per minute of video
 *   quality     — subjective quality rating (★★★★★)
 *   compatibility — playback compatibility (★★★★★)
 *   note        — additional note (e.g., default selection)
 *   isDefault   — whether yt-dlp selects this by default
 */
window.FORMAT_SELECTOR_CONFIG = {

    /* Cross-language: format data is locale-independent */
    formatCategories: ['video', 'audio'],

    formats: [
        /* ── Video Formats ─────────────────────────── */
        { id: '4k-av1',      category: 'video', resolution: '4K (2160p)',    codec: 'AV1',     container: 'mkv',  bitrate: '35 Mbps',  sizePerMin: 262, quality: '★★★★★', compatibility: '★★★☆☆', isDefault: false },
        { id: '4k-h264',     category: 'video', resolution: '4K (2160p)',    codec: 'H.264',   container: 'mp4',  bitrate: '45 Mbps',  sizePerMin: 338, quality: '★★★★★', compatibility: '★★★★★', isDefault: false },
        { id: '4k-vp9',      category: 'video', resolution: '4K (2160p)',    codec: 'VP9',     container: 'webm', bitrate: '30 Mbps',  sizePerMin: 225, quality: '★★★★★', compatibility: '★★★★☆', isDefault: false },
        { id: '1440p-av1',   category: 'video', resolution: '1440p (QHD)',   codec: 'AV1',     container: 'mkv',  bitrate: '16 Mbps',  sizePerMin: 120, quality: '★★★★☆', compatibility: '★★★☆☆', isDefault: false },
        { id: '1440p-h264',  category: 'video', resolution: '1440p (QHD)',   codec: 'H.264',   container: 'mp4',  bitrate: '20 Mbps',  sizePerMin: 150, quality: '★★★★☆', compatibility: '★★★★★', isDefault: false },
        { id: '1080p-av1',   category: 'video', resolution: '1080p (FHD)',   codec: 'AV1',     container: 'mkv',  bitrate: '8 Mbps',   sizePerMin: 60,  quality: '★★★★☆', compatibility: '★★★☆☆', isDefault: false },
        { id: '1080p-h264',  category: 'video', resolution: '1080p (FHD)',   codec: 'H.264',   container: 'mp4',  bitrate: '10 Mbps',  sizePerMin: 75,  quality: '★★★★☆', compatibility: '★★★★★', isDefault: true  },
        { id: '1080p-vp9',   category: 'video', resolution: '1080p (FHD)',   codec: 'VP9',     container: 'webm', bitrate: '7 Mbps',   sizePerMin: 52,  quality: '★★★★☆', compatibility: '★★★★☆', isDefault: false },
        { id: '720p-h264',   category: 'video', resolution: '720p (HD)',     codec: 'H.264',   container: 'mp4',  bitrate: '5 Mbps',   sizePerMin: 38,  quality: '★★★☆☆', compatibility: '★★★★★', isDefault: false },
        { id: '720p-vp9',    category: 'video', resolution: '720p (HD)',     codec: 'VP9',     container: 'webm', bitrate: '3.5 Mbps', sizePerMin: 26,  quality: '★★★☆☆', compatibility: '★★★★☆', isDefault: false },
        { id: '480p-h264',   category: 'video', resolution: '480p (SD)',     codec: 'H.264',   container: 'mp4',  bitrate: '2.5 Mbps', sizePerMin: 19,  quality: '★★☆☆☆', compatibility: '★★★★★', isDefault: false },
        { id: '360p-h264',   category: 'video', resolution: '360p',          codec: 'H.264',   container: 'mp4',  bitrate: '1 Mbps',   sizePerMin: 8,   quality: '★☆☆☆☆', compatibility: '★★★★★', isDefault: false },

        /* ── Audio-Only Formats ────────────────────── */
        { id: 'audio-opus',  category: 'audio', resolution: 'Audio-only',    codec: 'Opus',    container: 'webm', bitrate: '160 kbps', sizePerMin: 1.2,  quality: '★★★★★', compatibility: '★★★★☆', isDefault: false },
        { id: 'audio-aac',   category: 'audio', resolution: 'Audio-only',    codec: 'AAC',     container: 'm4a',  bitrate: '128 kbps', sizePerMin: 1.0,  quality: '★★★★☆', compatibility: '★★★★★', isDefault: true  },
        { id: 'audio-vorbis',category: 'audio', resolution: 'Audio-only',    codec: 'Vorbis',  container: 'webm', bitrate: '128 kbps', sizePerMin: 1.0,  quality: '★★★★☆', compatibility: '★★★☆☆', isDefault: false },
        { id: 'audio-mp3',   category: 'audio', resolution: 'Audio-only',    codec: 'MP3',     container: 'mp3',  bitrate: '192 kbps', sizePerMin: 1.4,  quality: '★★★☆☆', compatibility: '★★★★★', isDefault: false }
    ],

    /* ── English ──────────────────────────────────────── */
    en: {
        card: {
            name: '🎬 Format & Resolution Selector',
            desc: 'Compare <strong>video/audio format combinations</strong> · Codec tradeoffs · File size estimation · Default selection logic',
            tags: [
                { text: '10+ formats',  modifier: 'cyan' },
                { text: '4K → 360p',    modifier: 'purple' },
                { text: 'H.264/AV1/VP9', modifier: 'accent' }
            ],
            badge: 'Feature',
            nameHref: '../../index.html'
        },

        ui: {
            /* Table controls */
            showVideo: 'Video Formats',
            showAudio: 'Audio Formats',
            showAll: 'All Formats',
            sortBySize: 'Sort by Size',
            sortByQuality: 'Sort by Quality',
            highlightDefault: 'Highlight defaults',

            /* Table columns */
            colResolution: 'Resolution',
            colCodec: 'Codec',
            colContainer: 'Container',
            colBitrate: 'Bitrate',
            colSize: 'Size/min',
            colQuality: 'Quality',
            colCompat: 'Compatibility',
            colNote: 'Notes',

            /* Detail panel */
            selectedFormat: 'Selected Format',
            estimatedSize: 'Estimated size for a',
            minuteVideo: 'minute video:',
            bestFor: 'Best for:',
            detailResolution: 'Resolution',
            detailCodec: 'Codec',
            detailContainer: 'Container',
            detailBitrate: 'Bitrate',
            detailSizePerMin: 'Size per minute',
            detailQuality: 'Visual quality',
            detailCompatibility: 'Device compatibility',

            /* Best-for descriptions */
            bestArchival: 'Archival — maximum quality, large file size',
            bestGeneral: 'General use — best quality/size balance ★ Recommended',
            bestSpace: 'Space efficient — good quality, smaller files',
            bestCompatibility: 'Maximum compatibility — plays everywhere',
            bestAudio: 'Audio extraction — music & podcasts',
            bestStreaming: 'Streaming optimized — modern codec efficiency',

            /* Footer */
            defaultLabel: '★ yt-dlp default',
            ytdlpNote: 'yt-dlp selects AVC/H.264 in MP4 by default for maximum device compatibility. For smaller files, prefer AV1 or VP9 in MKV/WebM containers.',

            /* Info area */
            infoHeader: 'About This Demo',
            infoP1: 'This interactive table shows the <strong>format × resolution matrix</strong> that yt-dlp navigates when you run a download. Click any row to see detailed stats and recommendations.',
            infoP2: 'yt-dlp\'s format selector (<code>-f</code>) uses a sophisticated sorting algorithm. By default it picks the best combined video+audio format with the highest resolution and most compatible codec — usually <strong>H.264 + AAC in MP4 at 1080p</strong>.',
            infoP3: 'Learn how codec choice affects file size (AV1 saves ~40% vs H.264 at the same quality) and device compatibility (H.264 plays everywhere, AV1 needs modern hardware).',
            pipelineLink: '📐 Pipeline Diagram',
            graphLink: '🕸️ Code Dependency Graph',
            allDemosLink: '🎬 All yt-dlp Demos',
            docsHomeLink: '🏠 Docs Home'
        }
    },

    /* ── 简体中文 ──────────────────────────────────────── */
    'zh-CN': {
        card: {
            name: '🎬 格式与分辨率选择器',
            desc: '对比<strong>视频/音频格式组合</strong> · 编码权衡 · 文件大小估算 · 默认选择逻辑',
            tags: [
                { text: '10+ 格式',     modifier: 'cyan' },
                { text: '4K → 360p',    modifier: 'purple' },
                { text: 'H.264/AV1/VP9', modifier: 'accent' }
            ],
            badge: '功能',
            nameHref: '../../index.html'
        },

        ui: {
            showVideo: '视频格式',
            showAudio: '音频格式',
            showAll: '全部格式',
            sortBySize: '按大小排序',
            sortByQuality: '按质量排序',
            highlightDefault: '高亮默认选项',

            colResolution: '分辨率',
            colCodec: '编码',
            colContainer: '容器',
            colBitrate: '码率',
            colSize: '大小/分钟',
            colQuality: '画质',
            colCompat: '兼容性',
            colNote: '备注',

            selectedFormat: '已选格式',
            estimatedSize: '估算大小（',
            minuteVideo: '分钟视频）：',
            bestFor: '最适合：',
            detailResolution: '分辨率',
            detailCodec: '编码',
            detailContainer: '容器',
            detailBitrate: '码率',
            detailSizePerMin: '每分钟大小',
            detailQuality: '画质',
            detailCompatibility: '设备兼容性',

            bestArchival: '存档级别 — 最高画质，文件较大',
            bestGeneral: '通用选择 — 最佳画质/大小平衡 ★ 推荐',
            bestSpace: '空间友好 — 质量不错，文件更小',
            bestCompatibility: '最大兼容性 — 任意设备可播放',
            bestAudio: '音频提取 — 音乐与播客',
            bestStreaming: '流媒体优化 — 现代编码效率',

            defaultLabel: '★ yt-dlp 默认',
            ytdlpNote: 'yt-dlp 默认选择 AVC/H.264 的 MP4 格式以获得最大设备兼容性。如需更小文件，推荐 AV1 或 VP9 编码配合 MKV/WebM 容器。',

            infoHeader: '关于此演示',
            infoP1: '此交互式表格展示了 yt-dlp 执行下载时查询的<strong>格式 × 分辨率矩阵</strong>。点击任意行查看详细统计与推荐。',
            infoP2: 'yt-dlp 的格式选择器（<code>-f</code>）使用复杂的排序算法。默认选择最高分辨率、最兼容编码的组合视频+音频格式 — 通常是 <strong>H.264 + AAC 的 MP4 1080p</strong>。',
            infoP3: '了解编码选择如何影响文件大小（同等画质下 AV1 比 H.264 节省约 40%）和设备兼容性（H.264 随处可播，AV1 需现代硬件）。',
            pipelineLink: '📐 流水线图',
            graphLink: '🕸️ 代码依赖图',
            allDemosLink: '🎬 全部 yt-dlp 演示',
            docsHomeLink: '🏠 文档首页'
        }
    }
};
