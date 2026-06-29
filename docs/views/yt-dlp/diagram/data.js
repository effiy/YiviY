/**
 * yt-dlp Download Pipeline Diagram — 数据源
 *
 * 语言键值对格式，与 mount-component.js 的 i18n: true 配合使用。
 *
 * 字段说明：
 *   - constants   顶层语言无关常量
 *   - en          英语内容
 *   - zh-CN       简体中文内容
 *
 * 所有语言 slice 必须具有相同的顶层结构。
 */
window.DIAGRAM_CONFIG = {
    /* ── 跨语言常量 ─────────────────────────────────────── */
    constants: {
        repoUrl: 'https://github.com/org/VideoLingo',
        version: 'v3.x'
    },

    /* ── English ─────────────────────────────────────────── */
    en: {
        title: 'yt-dlp Download Pipeline in VideoLingo',
        subtitle: 'YouTube → yt-dlp → VideoLingo pipeline · format selection · subtitle extraction · progress hooks',
        switchLangHint: 'Switch to Chinese',
        exportOptions: 'Export options',
        copyPng: '📋 Copy',
        downloadPng: '🖼️ PNG',
        downloadPdf: '📄 PDF',
        cards: [
            {
                dotClass: 'amber',
                title: 'Supported Sources',
                items: [
                    '• YouTube (watch / shorts / live / embed / playlist)',
                    '• 1,200+ sites via yt-dlp extractors',
                    '• Local file upload as fallback',
                    '• Audio → black_screen.mp4 conversion (FFmpeg)'
                ]
            },
            {
                dotClass: 'emerald',
                title: 'Key Features',
                items: [
                    '• Resolution: 360p → 4K + best (auto-detect)',
                    '• Format: video+audio / audio-only',
                    '• Subtitle extraction (manual + auto, multi-lang)',
                    '• Thumbnail download + FFmpeg post-process'
                ]
            },
            {
                dotClass: 'violet',
                title: 'Reliability & Integration',
                items: [
                    '• 5 retries + 3 fragment/file/extractor retries',
                    '• Session-level yt-dlp auto-update + class cache',
                    '• Filename sanitization post-download',
                    '• Cookie + proxy support for restricted content'
                ]
            }
        ],
        footer: 'VideoLingo · yt-dlp Download Pipeline · docs/views/yt-dlp/ · Apache-2.0'
    },

    /* ── 简体中文 ────────────────────────────────────────── */
    'zh-CN': {
        title: 'VideoLingo 中的 yt-dlp 下载管线',
        subtitle: 'YouTube → yt-dlp → VideoLingo 管线 · 格式选择 · 字幕提取 · 进度回调',
        switchLangHint: '切换到英文',
        exportOptions: '导出选项',
        copyPng: '📋 复制',
        downloadPng: '🖼️ PNG',
        downloadPdf: '📄 PDF',
        cards: [
            {
                dotClass: 'amber',
                title: '支持的来源',
                items: [
                    '• YouTube（watch / shorts / live / embed / playlist）',
                    '• 通过 yt-dlp 提取器支持 1,200+ 网站',
                    '• 本地文件上传作为备用方案',
                    '• 音频 → black_screen.mp4 转换（FFmpeg）'
                ]
            },
            {
                dotClass: 'emerald',
                title: '核心功能',
                items: [
                    '• 分辨率：360p → 4K + best（自动检测）',
                    '• 格式：视频+音频 / 纯音频',
                    '• 字幕提取（手动 + 自动，多语言）',
                    '• 缩略图下载 + FFmpeg 后处理'
                ]
            },
            {
                dotClass: 'violet',
                title: '可靠性 & 集成',
                items: [
                    '• 5 次重试 + 3 次分片/文件/提取器重试',
                    '• 会话级 yt-dlp 自动更新 + 类缓存',
                    '• 下载后文件名清理',
                    '• Cookie + 代理支持受限内容'
                ]
            }
        ],
        footer: 'VideoLingo · yt-dlp 下载管线 · docs/views/yt-dlp/ · Apache-2.0'
    }
};
