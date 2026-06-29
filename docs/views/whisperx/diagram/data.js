/**
 * WhisperX Transcription Pipeline Diagram — 数据源
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
        title: 'WhisperX Transcription Pipeline in VideoLingo',
        subtitle: 'Audio → Demucs → WhisperX → word-level timestamps · forced alignment · multi-runtime support',
        switchLangHint: 'Switch to Chinese',
        exportOptions: 'Export options',
        copyPng: '📋 Copy',
        downloadPng: '🖼️ PNG',
        downloadPdf: '📄 PDF',
        cards: [
            {
                dotClass: 'emerald',
                title: 'Core Pipeline',
                items: [
                    '• Audio input from Step 1 (video.mp4 / audio.m4a)',
                    '• Demucs vocal separation (optional, +2-5 min)',
                    '• WhisperX: load model → transcribe → forced alignment',
                    '• Word-level timestamps + speaker diarization'
                ]
            },
            {
                dotClass: 'cyan',
                title: 'Model & Language',
                items: [
                    '• large-v3: highest accuracy, ~10 GB VRAM',
                    '• large-v3-turbo: faster, ~6 GB VRAM',
                    '• Chinese: auto-switch Belle/large-v3 punctuation model',
                    '• Multi-language: primary language retained only'
                ]
            },
            {
                dotClass: 'amber',
                title: 'Runtime & Output',
                items: [
                    '• Local GPU (8+ GB, free) · 302.ai Cloud · ElevenLabs',
                    '• Output: word-level JSON, SRT, VTT subtitles',
                    '• Feeds into Step 3: NLP sentence splitting',
                    '• Punctuation restoration + language detection'
                ]
            }
        ],
        footer: 'VideoLingo · WhisperX Transcription Pipeline · docs/views/whisperx/ · Apache-2.0',

        /* ── SVG Diagram Text ──────────────────────────── */
        svg: {
            arrows: {
                audio: 'audio',
                demux: 'vocal',
                skip: 'skip Demucs'
            },
            regions: {
                audio: 'Audio Source (from Step 1)',
                engine: 'VideoLingo — Transcription Stage (Step 2/15)',
                output: 'Output → Step 3: NLP / Sentence Split'
            },
            audioInput: {
                title: 'Audio Input',
                file: 'video.mp4 / audio.m4a',
                from: 'from output/ directory'
            },
            demucs: {
                title: 'Demucs (optional)',
                model: 'htdemucs · +2-5 min',
                effect: 'separates vocals from BGM'
            },
            engine: {
                title: 'WhisperX Engine',
                load: '1. Load Model (CTranslate2)',
                transcribe: '2. Transcribe (ASR · beam search)',
                align: '3. Forced Alignment (phoneme-level)',
                output: '4. Word Timestamps + Speaker Labels',
                batch: 'batch_size · compute_type · device'
            },
            modelSelect: {
                title: 'Model Selection',
                v3: 'large-v3 · ~10 GB',
                turbo: 'large-v3-turbo · ~6 GB',
                belle: 'Belle/large-v3 (zh)'
            },
            runtime: {
                title: 'Runtime Backends',
                local: 'Local GPU · 8+ GB',
                cloud: '302.ai · Cloud API',
                elevenlabs: 'ElevenLabs · Cloud API'
            },
            chinese: {
                title: 'Chinese Auto-Switch',
                desc: 'detects zh → Belle/large-v3',
                note: 'punctuation-enhanced model'
            },
            outputs: {
                title: 'Output Artifacts',
                words: 'word_timestamps.json',
                srt: 'subtitles.srt',
                vtt: 'subtitles.vtt',
                arrow: '→ Step 3'
            },
            gateway: {
                line1: 'Audio file → WhisperX load → transcribe(audio, model, language) → align() → save()',
                line2: 'demucs flag · model_name · language detection · compute_device · batch_size'
            },
            legend: {
                title: 'Legend',
                audio: 'Audio / Input',
                engine: 'Engine / Processing',
                model: 'Model / Config',
                runtime: 'Runtime / Infra',
                optional: 'Optional Module',
                special: 'Special Handling',
                boundary: 'Region Boundary'
            },
            techStack: 'Python · WhisperX · CTranslate2 · Demucs · FFmpeg · VideoLingo v3.x'
        }
    },

    /* ── 简体中文 ────────────────────────────────────────── */
    'zh-CN': {
        title: 'VideoLingo 中的 WhisperX 转录管线',
        subtitle: '音频 → Demucs → WhisperX → 词级时间戳 · 强制对齐 · 多运行时支持',
        switchLangHint: '切换到英文',
        exportOptions: '导出选项',
        copyPng: '📋 复制',
        downloadPng: '🖼️ PNG',
        downloadPdf: '📄 PDF',
        cards: [
            {
                dotClass: 'emerald',
                title: '核心管线',
                items: [
                    '• 从步骤 1 获取音频输入（video.mp4 / audio.m4a）',
                    '• Demucs 人声分离（可选，+2-5 分钟）',
                    '• WhisperX：加载模型 → 转录 → 强制对齐',
                    '• 词级时间戳 + 说话人分离'
                ]
            },
            {
                dotClass: 'cyan',
                title: '模型 & 语言',
                items: [
                    '• large-v3：最高准确度，~10 GB 显存',
                    '• large-v3-turbo：更快，~6 GB 显存',
                    '• 中文：自动切换 Belle/large-v3 标点增强模型',
                    '• 多语言：仅保留主要语言'
                ]
            },
            {
                dotClass: 'amber',
                title: '运行时 & 输出',
                items: [
                    '• 本地 GPU（8+ GB，免费）· 302.ai 云端 · ElevenLabs',
                    '• 输出：词级 JSON、SRT、VTT 字幕',
                    '• 输入步骤 3：NLP 句子分割',
                    '• 标点恢复 + 语言检测'
                ]
            }
        ],
        footer: 'VideoLingo · WhisperX 转录管线 · docs/views/whisperx/ · Apache-2.0',

        /* ── SVG Diagram Text (Chinese) ─────────────────── */
        svg: {
            arrows: {
                audio: '音频',
                demux: '人声',
                skip: '跳过 Demucs'
            },
            regions: {
                audio: '音频来源（来自步骤 1）',
                engine: 'VideoLingo — 转录阶段（步骤 2/15）',
                output: '输出 → 步骤 3：NLP / 句子分割'
            },
            audioInput: {
                title: '音频输入',
                file: 'video.mp4 / audio.m4a',
                from: '来自 output/ 目录'
            },
            demucs: {
                title: 'Demucs（可选）',
                model: 'htdemucs · +2-5 分钟',
                effect: '分离人声与背景音乐'
            },
            engine: {
                title: 'WhisperX 引擎',
                load: '1. 加载模型（CTranslate2）',
                transcribe: '2. 转录（ASR · 束搜索）',
                align: '3. 强制对齐（音素级）',
                output: '4. 词级时间戳 + 说话人标签',
                batch: 'batch_size · compute_type · device'
            },
            modelSelect: {
                title: '模型选择',
                v3: 'large-v3 · ~10 GB',
                turbo: 'large-v3-turbo · ~6 GB',
                belle: 'Belle/large-v3（中文）'
            },
            runtime: {
                title: '运行时后端',
                local: '本地 GPU · 8+ GB',
                cloud: '302.ai · 云端 API',
                elevenlabs: 'ElevenLabs · 云端 API'
            },
            chinese: {
                title: '中文自动切换',
                desc: '检测中文 → Belle/large-v3',
                note: '标点增强模型'
            },
            outputs: {
                title: '输出产物',
                words: 'word_timestamps.json',
                srt: 'subtitles.srt',
                vtt: 'subtitles.vtt',
                arrow: '→ 步骤 3'
            },
            gateway: {
                line1: '音频文件 → WhisperX 加载 → transcribe(audio, model, language) → align() → save()',
                line2: 'demucs 标志 · model_name · 语言检测 · compute_device · batch_size'
            },
            legend: {
                title: '图例',
                audio: '音频 / 输入',
                engine: '引擎 / 处理',
                model: '模型 / 配置',
                runtime: '运行时 / 基础设施',
                optional: '可选模块',
                special: '特殊处理',
                boundary: '区域边界'
            },
            techStack: 'Python · WhisperX · CTranslate2 · Demucs · FFmpeg · VideoLingo v3.x'
        }
    }
};
