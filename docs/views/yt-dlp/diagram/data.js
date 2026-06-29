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
 * svg 子树包含 SVG diagram 内所有文本的翻译——语言切换时整个
 * svg 对象被替换，Vue 响应式系统自动重渲染所有 {{ svg.* }} 绑定。
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
        footer: 'VideoLingo · yt-dlp Download Pipeline · docs/views/yt-dlp/ · Apache-2.0',

        /* ── SVG Diagram Text ──────────────────────────── */
        svg: {
            arrows: {
                url: 'URL',
                invoke: 'invoke'
            },
            regions: {
                youtube: 'YouTube / 1,200+ Sites',
                videoLingo: 'VideoLingo — Download Stage (Step 1/15)',
                output: 'Output Directory: output/',
                pipeline: 'VideoLingo Pipeline (Steps 2–12) — downstream consumers of output/'
            },
            youtube: {
                title: 'YouTube URL',
                desc: 'watch?v= / shorts / live'
            },
            cookie: {
                text: 'cookies + proxy support'
            },
            streamlit: {
                title: 'Streamlit UI',
                file: 'download_video_section.py',
                input: 'Input: URL / Upload file',
                preview: 'Preview Info / Progress bar',
                res: 'res: 360p → 4K · fmt: video+/audio-only',
                advanced: 'Advanced: subs · cookies · proxy'
            },
            engine: {
                title: 'yt-dlp Engine',
                file: '_1_ytdlp.py',
                cache: 'YoutubeDL class · session cache',
                update: 'auto-update once per session',
                format: 'format_str builder · 5 retries',
                concurrency: '8 concurrent fragments · socket to 30s'
            },
            ydlOpts: {
                title: 'ydl_opts',
                items: [
                    '• format (resolution)',
                    '• outtmpl (save path)',
                    '• noplaylist: true',
                    '• progress_hooks',
                    '• retries: 5 + backoff',
                    '• merge_output: mp4',
                    '• writethumbnail (opt)',
                    '• subtitles (opt)',
                    '• cookiefile (opt)',
                    '• proxy (opt)'
                ]
            },
            progressHook: {
                text: 'progress_hook → status_callback'
            },
            outputs: {
                video: {
                    title: '🎬 video.mp4',
                    desc1: 'sanitized filename',
                    desc2: '→ Step 2: ASR pipeline'
                },
                thumbnail: {
                    title: '🖼️ thumbnail.jpg',
                    desc1: 'FFmpeg post-process',
                    desc2: 'optional'
                },
                subtitles: {
                    title: '📝 subtitles.vtt',
                    desc1: 'manual + auto subs',
                    desc2: 'en, zh-CN, ja, …'
                },
                audio: {
                    title: '🎵 audio.m4a',
                    desc1: 'audio-only mode',
                    desc2: 'black_screen.mp4 fallback'
                }
            },
            metadata: {
                text: 'Metadata (Preview): title · uploader · duration · view_count · formats_available'
            },
            pipeline: {
                step2:  { title: 'Step 2',   desc: 'ASR · WhisperX' },
                step3:  { title: 'Step 3',   desc: 'NLP / Split' },
                step4:  { title: 'Step 4',   desc: 'Translate' },
                step57: { title: 'Step 5-7', desc: 'Sub → Embed' },
                step812:{ title: 'Step 8-12',desc: 'TTS → Dub' }
            },
            gateway: {
                line1: 'find_video_files() → single .mp4 → input to Step 2',
                line2: 'allowed_video_formats filter · exactly 1 file required · sanitize_filename() cleanup'
            },
            legend: {
                title: 'Legend',
                youtube: 'YouTube / Cloud Source',
                frontend: 'Frontend / UI',
                backend: 'Backend / Engine',
                output: 'Output / Data',
                options: 'Options / Config',
                hooks: 'Hooks / Auth',
                boundary: 'Region Boundary'
            },
            techStack: 'Python · yt-dlp · FFmpeg · Streamlit · VideoLingo v3.x'
        }
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
        footer: 'VideoLingo · yt-dlp 下载管线 · docs/views/yt-dlp/ · Apache-2.0',

        /* ── SVG Diagram Text (Chinese) ─────────────────── */
        svg: {
            arrows: {
                url: 'URL',
                invoke: '调用'
            },
            regions: {
                youtube: 'YouTube / 1,200+ 网站',
                videoLingo: 'VideoLingo — 下载阶段（步骤 1/15）',
                output: '输出目录：output/',
                pipeline: 'VideoLingo 管线（步骤 2–12）— output/ 的下游消费者'
            },
            youtube: {
                title: 'YouTube 链接',
                desc: 'watch?v= / shorts / live'
            },
            cookie: {
                text: 'Cookies + 代理支持'
            },
            streamlit: {
                title: 'Streamlit 界面',
                file: 'download_video_section.py',
                input: '输入：URL / 上传文件',
                preview: '预览信息 / 进度条',
                res: '分辨率：360p → 4K · 格式：视频+音频/纯音频',
                advanced: '高级：字幕 · Cookies · 代理'
            },
            engine: {
                title: 'yt-dlp 引擎',
                file: '_1_ytdlp.py',
                cache: 'YoutubeDL 类 · 会话缓存',
                update: '每会话自动更新一次',
                format: 'format_str 构建器 · 5 次重试',
                concurrency: '8 并发分片 · socket 超时 30s'
            },
            ydlOpts: {
                title: 'ydl_opts',
                items: [
                    '• format（分辨率）',
                    '• outtmpl（保存路径）',
                    '• noplaylist: true',
                    '• progress_hooks',
                    '• retries: 5 + 退避',
                    '• merge_output: mp4',
                    '• writethumbnail（可选）',
                    '• subtitles（可选）',
                    '• cookiefile（可选）',
                    '• proxy（可选）'
                ]
            },
            progressHook: {
                text: 'progress_hook → status_callback'
            },
            outputs: {
                video: {
                    title: '🎬 video.mp4',
                    desc1: '清理后的文件名',
                    desc2: '→ 步骤 2：ASR 管线'
                },
                thumbnail: {
                    title: '🖼️ thumbnail.jpg',
                    desc1: 'FFmpeg 后处理',
                    desc2: '可选'
                },
                subtitles: {
                    title: '📝 subtitles.vtt',
                    desc1: '手动 + 自动字幕',
                    desc2: 'en, zh-CN, ja, …'
                },
                audio: {
                    title: '🎵 audio.m4a',
                    desc1: '纯音频模式',
                    desc2: 'black_screen.mp4 回退'
                }
            },
            metadata: {
                text: '元数据（预览）：标题 · 上传者 · 时长 · 播放量 · 可用格式'
            },
            pipeline: {
                step2:  { title: '步骤 2',   desc: 'ASR · WhisperX' },
                step3:  { title: '步骤 3',   desc: 'NLP / 分割' },
                step4:  { title: '步骤 4',   desc: '翻译' },
                step57: { title: '步骤 5-7', desc: '字幕 → 嵌入' },
                step812:{ title: '步骤 8-12',desc: 'TTS → 配音' }
            },
            gateway: {
                line1: 'find_video_files() → 单个 .mp4 → 输入到步骤 2',
                line2: 'allowed_video_formats 过滤 · 恰好 1 个文件 · sanitize_filename() 清理'
            },
            legend: {
                title: '图例',
                youtube: 'YouTube / 云来源',
                frontend: '前端 / 界面',
                backend: '后端 / 引擎',
                output: '输出 / 数据',
                options: '选项 / 配置',
                hooks: '钩子 / 认证',
                boundary: '区域边界'
            },
            techStack: 'Python · yt-dlp · FFmpeg · Streamlit · VideoLingo v3.x'
        }
    }
};
