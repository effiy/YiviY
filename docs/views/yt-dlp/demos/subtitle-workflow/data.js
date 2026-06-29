/**
 * Subtitle Workflow Demo — Data
 * =============================================================================
 * Type B: Pipeline Visualization — Subtitle Extraction Pipeline
 *
 * This demo visualizes how yt-dlp extracts subtitles in 5 stages:
 *   1. List Available Languages   — discover what subtitle tracks exist
 *   2. Fetch Manual Subtitles     — download human-created captions
 *   3. Fetch Auto-Generated Subs  — download ASR-generated captions
 *   4. Convert Subtitle Format    — transform between vtt/srt/ass
 *   5. Write Subtitle Files       — save to output directory
 *
 * Stage trace objects link to code graph nodes for deep-linking.
 * Language matrix shows subtitle availability per language.
 */
window.SUBTITLE_WORKFLOW_CONFIG = {

    /* Cross-language: stages with trace info */
    stages: [
        { icon: '🔍', id: 'list',
          enText: 'List Available Languages',     zhText: '列出可用语言',
          enDesc: 'Query video metadata to discover which subtitle tracks exist — manual captions (uploaded by creator) and auto-generated (ASR by YouTube).', zhDesc: '查询视频元数据，发现可用的字幕轨道 — 人工字幕（创作者上传）和自动生成字幕（YouTube ASR）。',
          enDetail: 'yt-dlp sends a request to the video info endpoint and parses the <code>subtitles</code> and <code>automatic_captions</code> fields from the JSON response. Languages are identified by ISO 639-1 codes (en, zh-CN, ja, etc.).',
          zhDetail: 'yt-dlp 向视频信息端点发送请求，解析 JSON 响应中的 <code>subtitles</code> 和 <code>automatic_captions</code> 字段。语言以 ISO 639-1 代码标识（en、zh-CN、ja 等）。',
          trace: { file: 'YoutubeDL.py', fileId: 'file:YoutubeDL.py', func: 'extract_info()', funcId: 'func:extract_info', desc: 'parses subtitle track metadata from video info JSON' } },
        { icon: '📥', id: 'manual',
          enText: 'Fetch Manual Subtitles',       zhText: '获取人工字幕',
          enDesc: 'Download creator-uploaded caption files. These are typically high-quality, timed correctly, and may include formatting. Available in fewer languages.', zhDesc: '下载创作者上传的字幕文件。通常质量高、时间轴准确，可能包含格式信息。可用的语言较少。',
          enDetail: 'Manual subtitles are fetched via the subtitle download URL extracted from video metadata. Each language track is downloaded separately. These are the preferred source when available.',
          zhDetail: '人工字幕通过视频元数据中的字幕下载链接获取。每种语言轨道单独下载。当可用时，这是首选来源。',
          trace: { file: 'YoutubeDL.py', fileId: 'file:YoutubeDL.py', func: 'process_subtitles()', funcId: 'func:process_info', desc: 'downloads manual caption tracks per language' } },
        { icon: '🤖', id: 'auto',
          enText: 'Fetch Auto-Generated Subtitles', zhText: '获取自动生成字幕',
          enDesc: 'Download YouTube ASR (speech-to-text) captions. Available in many languages but quality varies. Good as fallback when manual subs are unavailable.', zhDesc: '下载 YouTube ASR（语音转文字）字幕。支持多种语言，但质量参差不齐。当人工字幕不可用时的良好备选方案。',
          enDetail: 'Auto-generated subtitles use YouTube\'s speech recognition. They include timing info but no speaker diarization. Accuracy depends on audio clarity and language. Pass <code>--write-auto-subs</code> to enable.',
          zhDetail: '自动生成字幕使用 YouTube 的语音识别技术。包含时间信息但没有说话人分离。准确度取决于音频清晰度和语言。使用 <code>--write-auto-subs</code> 启用。',
          trace: { file: 'YoutubeDL.py', fileId: 'file:YoutubeDL.py', func: 'process_subtitles()', funcId: 'func:process_info', desc: 'downloads auto-generated ASR tracks per language' } },
        { icon: '🔄', id: 'convert',
          enText: 'Convert Subtitle Format',       zhText: '转换字幕格式',
          enDesc: 'Transform downloaded subtitles into the requested output format. yt-dlp supports VTT, SRT, ASS, and LRC. Automatic encoding detection and conversion to UTF-8.', zhDesc: '将下载的字幕转换为请求的输出格式。yt-dlp 支持 VTT、SRT、ASS 和 LRC。自动检测编码并转换为 UTF-8。',
          enDetail: 'Format conversion uses <code>--convert-subs</code> flag. VTT → SRT strips WebVTT styling and re-numbers cues. SRT → ASS adds ASS header and style defaults. Encoding is normalized to UTF-8.',
          zhDetail: '格式转换使用 <code>--convert-subs</code> 参数。VTT → SRT 去除 WebVTT 样式并重新编号。SRT → ASS 添加 ASS 头部和默认样式。编码统一转为 UTF-8。',
          trace: { file: 'subtitles.py', fileId: 'file:subtitles.py', func: 'get_subs()', funcId: 'func:get_subs', desc: 'converts subtitle files between formats, normalizes encoding' } },
        { icon: '💾', id: 'write',
          enText: 'Write Subtitle Files',          zhText: '写入字幕文件',
          enDesc: 'Save processed subtitle files to the output directory. Files are named <code>video_title.{lang}.{ext}</code>. Ready for the next pipeline step (translation or embedding).', zhDesc: '将处理后的字幕文件保存到输出目录。文件命名为 <code>video_title.{lang}.{ext}</code>。准备进入下一管线步骤（翻译或嵌入）。',
          enDetail: 'Files are written to the output path alongside the video file. Naming convention: <code>{title}.{lang}.{format}</code>. If <code>--embed-subs</code> is used, subtitles are also embedded into the video container.',
          zhDetail: '文件写入到视频文件旁的输出目录。命名规则：<code>{title}.{lang}.{format}</code>。如果使用 <code>--embed-subs</code>，字幕还会嵌入到视频容器中。',
          trace: { file: 'utils/_utils.py', fileId: 'file:utils/_utils.py', func: 'sanitize_filename()', funcId: 'func:sanitize_filename', desc: 'writes cleaned subtitle files to output directory' } }
    ],

    /** Language availability matrix for demo visualization */
    languages: [
        { code: 'en',    nameEn: 'English',           nameZh: '英语',     manual: true,  auto: true,  quality: '★★★★★' },
        { code: 'zh-CN', nameEn: 'Chinese (Simplified)', nameZh: '简体中文', manual: true,  auto: true,  quality: '★★★★☆' },
        { code: 'ja',    nameEn: 'Japanese',           nameZh: '日语',     manual: true,  auto: true,  quality: '★★★★☆' },
        { code: 'ko',    nameEn: 'Korean',             nameZh: '韩语',     manual: false, auto: true,  quality: '★★★☆☆' },
        { code: 'fr',    nameEn: 'French',             nameZh: '法语',     manual: true,  auto: true,  quality: '★★★★★' },
        { code: 'de',    nameEn: 'German',             nameZh: '德语',     manual: false, auto: true,  quality: '★★★★☆' }
    ],

    /** Sample subtitle output snippets per language (shown in step 5) */
    sampleSubtitles: {
        en:    '00:00:01,000 → 00:00:04,500\nWelcome to this tutorial on yt-dlp.',
        'zh-CN': '00:00:01,000 → 00:00:04,500\n欢迎来到 yt-dlp 教程。',
        ja:    '00:00:01,000 → 00:00:04,500\nyt-dlp のチュートリアルへようこそ。',
        ko:    '00:00:01,000 → 00:00:04,500\nyt-dlp 튜토리얼에 오신 것을 환영합니다.',
        fr:    '00:00:01,000 → 00:00:04,500\nBienvenue dans ce tutoriel sur yt-dlp.',
        de:    '00:00:01,000 → 00:00:04,500\nWillkommen zu diesem yt-dlp-Tutorial.'
    },

    /* ── English ──────────────────────────────────────── */
    en: {
        card: {
            name: '📝 Subtitle Extraction Pipeline',
            desc: '5-stage subtitle download · <strong>manual + auto</strong> captions · format conversion (VTT/SRT/ASS) · multi-language support',
            tags: [
                { text: '5 stages',      modifier: 'purple' },
                { text: '6 languages',    modifier: 'cyan' },
                { text: 'VTT/SRT/ASS',    modifier: 'accent' }
            ],
            badge: 'Feature',
            nameHref: '../../index.html'
        },

        ui: {
            /* Pipeline controls */
            autoPlay: '▶ Auto Play',
            pause: '⏸ Pause',
            reset: '↺ Reset',
            step: 'Step',

            /* Stage labels */
            stepDetail: 'Stage Details',
            codeTrace: 'Code Trace',

            /* Language matrix */
            langMatrix: 'Language Availability Matrix',
            colLang: 'Language',
            colManual: 'Manual Subs',
            colAuto: 'Auto Subs',
            colQuality: 'Quality',
            yes: '✓ Yes',
            no: '—',

            /* Sample output */
            sampleOutput: 'Sample Output',
            sampleOutputDesc: 'Preview of extracted subtitle content:',

            /* Info area */
            infoHeader: 'About This Demo',
            infoP1: 'This animated pipeline visualizes how yt-dlp <strong>extracts and processes subtitles</strong> in 5 stages. Each stage represents a real step in the yt-dlp source code — click a stage node to inspect what happens, or use Auto Play to watch the full sequence.',
            infoP2: 'The language matrix shows subtitle availability for a typical popular YouTube video. <strong>Manual captions</strong> are uploaded by the creator; <strong>auto-generated</strong> captions use YouTube\'s speech recognition. Quality varies significantly.',
            infoP3: 'Format conversion (stage 4) handles WebVTT → SRT stripping, cue renumbering, encoding normalization, and ASS header generation. The output files are ready for translation or video embedding.',
            pipelineLink: '📐 Pipeline Diagram',
            graphLink: '🕸️ Code Dependency Graph',
            allDemosLink: '🎬 All yt-dlp Demos',
            docsHomeLink: '🏠 Docs Home'
        }
    },

    /* ── 简体中文 ──────────────────────────────────────── */
    'zh-CN': {
        card: {
            name: '📝 字幕提取流水线',
            desc: '5 阶段字幕下载 · <strong>人工 + 自动</strong>字幕 · 格式转换（VTT/SRT/ASS）· 多语言支持',
            tags: [
                { text: '5 阶段',        modifier: 'purple' },
                { text: '6 种语言',       modifier: 'cyan' },
                { text: 'VTT/SRT/ASS',    modifier: 'accent' }
            ],
            badge: '功能',
            nameHref: '../../index.html'
        },

        ui: {
            autoPlay: '▶ 自动播放',
            pause: '⏸ 暂停',
            reset: '↺ 重置',
            step: '步骤',

            stepDetail: '阶段详情',
            codeTrace: '代码追溯',

            langMatrix: '语言可用性矩阵',
            colLang: '语言',
            colManual: '人工字幕',
            colAuto: '自动字幕',
            colQuality: '质量',
            yes: '✓ 有',
            no: '—',

            sampleOutput: '示例输出',
            sampleOutputDesc: '提取的字幕内容预览：',

            infoHeader: '关于此演示',
            infoP1: '本动画流水线展示了 yt-dlp 如何通过 5 个阶段<strong>提取和处理字幕</strong>。每个阶段对应 yt-dlp 源码中的真实步骤 — 点击阶段节点查看详情，或使用自动播放观看完整过程。',
            infoP2: '语言矩阵展示了一段典型热门 YouTube 视频的字幕可用性。<strong>人工字幕</strong>由创作者上传；<strong>自动生成</strong>字幕使用 YouTube 语音识别技术。质量差异显著。',
            infoP3: '格式转换（第 4 阶段）处理 WebVTT → SRT 的样式去除、提示重新编号、编码规范化和 ASS 头部生成。输出文件可直接用于翻译或视频嵌入。',
            pipelineLink: '📐 流水线图',
            graphLink: '🕸️ 代码依赖图',
            allDemosLink: '🎬 全部 yt-dlp 演示',
            docsHomeLink: '🏠 文档首页'
        }
    }
};
