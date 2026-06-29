/**
 * Intro 数据源
 * ----------------------------------------------------------------------
 * 语言键值对格式，与 mount-component.js 的 i18n: true 配合使用。
 *
 * 字段说明：
 *   - hero            取自 README，迁移自 translations 组件
 *       - title       Hero 大标题（产品 slogan）
 *   - overview        取自 README 简介章节，迁移自 translations 组件
 *       - title       章节标题（含 emoji）
 *       - cta         CTA 按钮文案（指向 videolingo.io）
 *       - ctaHref     CTA 跳转链接
 *       - lead        Hero 副标题（同时也是 Overview 的导语）
 *       - features    feature 卡片数组，每项对齐 YrySceneCard props：
 *                       { name, desc, badge?, links: [] }
 *                       （links: [] 显式抑制默认底部链接，由
 *                         cdn/yry-scene-card 的 Array.isArray 三态语义支持）
 *                       原 strong 标记的核心特性通过 badge 视觉强调。
 *       - tagline     总结条幅（{ html }）
 *       - demo        演示视频章节（从 translations 上移至此）
 *                       · title  章节标题（含 emoji）
 *                       · items  按 demoVideos[i].id 索引的标题映射
 *   - cards           站点导航卡片（YrySceneCard props）
 *   - callout         底部提示条
 *
 *   - constants（顶层，语言无关）
 *       - social.trendshift  Hero 徽章链接
 *       - demoVideos         演示视频数组 [{ id, url }]，id 与 demo.items 一一对应
 *
 * cards 字段对齐 YrySceneCard props：
 *   - name          卡片主标题
 *   - nameHref      标题点击跳转（站内 #fragment 或 views/* 相对路径）
 *   - nameTarget    链接打开方式，'' 表示当前窗口
 *   - badge         可选 · 标题后小徽标（如 "新" / "报告"）
 *   - desc          描述文字（支持 HTML）
 *   - tags          可选 · 标签芯片数组，每项 { text, modifier, href? }
 *   - meta          可选 · 底部元信息
 */

window.INTRO_CONFIG = {
    /* ── 跨语言常量 ─────────────────────────────────── */
    constants: {
        social: {
            trendshift: 'https://trendshift.io/repositories/12200'
        },
        /* 演示视频（URL 不变，标题按语言翻译） */
        demoVideos: [
            { id: 'dualSubtitles',    url: 'https://github.com/user-attachments/assets/a5c3d8d1-2b29-4ba9-b0d0-25896829d951' },
            { id: 'cosyVoiceClone',   url: 'https://github.com/user-attachments/assets/e065fe4c-3694-477f-b4d6-316917df7c0a' },
            { id: 'gptSovitsDubbing', url: 'https://github.com/user-attachments/assets/47d965b2-b4ab-4a0b-9d08-b49a7bf3508c' }
        ]
    },

    /* ── 多语言内容 ───────────────────────────────────── */
    en: {
        hero: {
            title: 'Connect the World, Frame by Frame'
        },
        overview: {
            title: '🌟 Overview',
            cta:   'Try VL Now!',
            ctaHref: 'https://videolingo.io',
            lead:  'VideoLingo is an all-in-one video translation, localization, and dubbing tool aimed at generating Netflix-quality subtitles. It eliminates stiff machine translations and multi-line subtitles while adding high-quality dubbing, enabling global knowledge sharing across language barriers.',
            features: [
                { name: '🎥 yt-dlp',       desc: 'YouTube video download via yt-dlp',                                                                                    links: [] },
                { name: '🎙️ WhisperX',     badge: 'Core', desc: 'Word-level and Low-illusion subtitle recognition with WhisperX',                                                  links: [] },
                { name: '📝 NLP Split',    badge: 'Core', desc: 'NLP and AI-powered subtitle segmentation',                                                                       links: [] },
                { name: '📚 Term Base',    badge: 'Core', desc: 'Custom + AI-generated terminology for coherent translation',                                                     links: [] },
                { name: '🔄 3-Step T-R-A', badge: 'Core', desc: 'Translate-Reflect-Adaptation for cinematic quality',                                                            links: [] },
                { name: '✅ Netflix 1-Line',badge: 'Core', desc: 'Netflix-standard, single-line subtitles only',                                                                   links: [] },
                { name: '🗣️ Multi-TTS',    badge: 'Core', desc: 'Dubbing with GPT-SoVITS, Azure, OpenAI, and more',                                                              links: [] },
                { name: '🚀 Streamlit UI',  desc: 'One-click startup and processing in Streamlit',                                                                       links: [] },
                { name: '🌍 i18n',          desc: 'Multi-language support in Streamlit UI',                                                                             links: [] },
                { name: '📝 Resume',        desc: 'Detailed logging with progress resumption',                                                                          links: [] },
                { name: '🔍 Model Picker',  desc: 'Model searchbox with API auto-fetch — search and filter from your provider\'s full model list',                    links: [] },
                { name: '⏯️ Task Control',  desc: 'Task control — pause, resume, or stop processing at any step',                                                       links: [] }
            ],
            tagline: { html: 'Difference from similar projects: <strong>Single-line subtitles only, superior translation quality, seamless dubbing experience</strong>' }
        },
        demo: {
            title: '🎥 Demo',
            items: {
                dualSubtitles:    'Dual Subtitles',
                cosyVoiceClone:   'Cosy2 Voice Clone',
                gptSovitsDubbing: 'GPT-SoVITS Dubbing'
            }
        },
        cards: [
            { name: 'Quick Start',      nameHref: '#quick-start',  nameTarget: '', desc: 'Get running in 3 minutes with uv or Docker' },
            { name: 'Configuration',    nameHref: '#config',       nameTarget: '', desc: 'Understand every knob in config.yaml' },
            { name: 'API Setup',        nameHref: '#api-config',   nameTarget: '', desc: 'LLM, Whisper, TTS — all API providers explained' },
            { name: 'Dubbing Guide',    nameHref: '#dubbing',      nameTarget: '', desc: '9 TTS engines compared with pro tips' },
            { name: 'Troubleshooting',  nameHref: '#troubleshooting', nameTarget: '', desc: 'Common issues and their solutions' },
            { name: 'Pipeline Deep Dive', nameHref: '#workflow',   nameTarget: '', desc: 'Step-by-step: download → transcribe → translate → dub' },
            { name: 'Code Health Report', nameHref: 'views/健康报告/index.html', nameTarget: '', badge: 'Report', desc: '7-dimension static analysis · quantitative scoring · 26 improvements · 56h roadmap',
              tags: [{ text: '58 / 100', modifier: 'warn' }, { text: '7 dimensions', modifier: 'info' }, { text: '26 actions', modifier: 'cyan' }],
              meta: 'Assessment date 2026-06-28 · Technical Due Diligence' },
            { name: 'Architecture Report', nameHref: 'views/架构报告/index.html', nameTarget: '', badge: 'Report', desc: 'ATAM method · 8-dimension weighted scoring · 10 action items · 5-week plan',
              tags: [{ text: '5.6 → 7.9', modifier: 'red' }, { text: 'ATAM', modifier: 'purple' }, { text: '10 actions', modifier: 'cyan' }],
              meta: 'v3.0.0 → v3.1.0 · Assessment date 2026-06-28' }
        ],
        callout: { strong: 'Tip:', text: 'VideoLingo takes a YouTube URL and turns it into a perfectly subtitled + dubbed video in your target language. Jump to ', linkText: 'Quick Start', linkHref: '#quick-start' }
    },
    'zh-CN': {
        hero: {
            title: '连接世界每一帧'
        },
        overview: {
            title: '🌟 简介',
            cta:   '在线体验！',
            ctaHref: 'https://videolingo.io',
            lead:  'VideoLingo 是一站式视频翻译本地化配音工具，能够一键生成 Netflix 级别的高质量字幕，告别生硬机翻，告别多行字幕，还能加上高质量的克隆配音，让全世界的知识能够跨越语言的障碍共享。',
            features: [
                { name: '🎥 yt-dlp',       desc: '使用 yt-dlp 从 YouTube 链接下载视频',                            links: [] },
                { name: '🎙️ WhisperX',     badge: '核心', desc: '单词级和低幻觉字幕识别',                                       links: [] },
                { name: '📝 NLP 分割',      badge: '核心', desc: '基于 NLP 和 AI 的字幕分割',                                    links: [] },
                { name: '📚 术语库',        badge: '核心', desc: '自定义 + AI 生成术语库，保证翻译连贯性',                       links: [] },
                { name: '🔄 三步意译',      badge: '核心', desc: '直译、反思、意译，实现影视级翻译质量',                         links: [] },
                { name: '✅ Netflix 单行',  badge: '核心', desc: '按 Netflix 标准检查单行长度，绝无双行字幕',                    links: [] },
                { name: '🗣️ 多 TTS',        badge: '核心', desc: '支持 GPT-SoVITS、Azure、OpenAI 等多种配音方案',                links: [] },
                { name: '🚀 一键启动',      desc: '在 Streamlit 中一键启动与处理',                                  links: [] },
                { name: '🌍 多语言 UI',     desc: 'Streamlit UI 内置多语言支持',                                    links: [] },
                { name: '📝 进度恢复',      desc: '详细日志，支持随时中断和恢复进度',                               links: [] },
                { name: '🔍 模型选择器',    desc: '自动从 API 获取完整模型列表，支持搜索筛选',                     links: [] },
                { name: '⏯️ 任务控制',      desc: '处理过程中可随时暂停、继续或停止',                               links: [] }
            ],
            tagline: { html: '与同类项目相比的优势：<strong>绝无多行字幕，最佳的翻译质量，无缝的配音体验</strong>' }
        },
        demo: {
            title: '🎥 演示',
            items: {
                dualSubtitles:    '双语字幕',
                cosyVoiceClone:   'Cosy2 声音克隆',
                gptSovitsDubbing: 'GPT-SoVITS 配音'
            }
        },
        cards: [
            { name: '快速上手',        nameHref: '#quick-start',  nameTarget: '', desc: '使用 uv 或 Docker 3 分钟快速启动' },
            { name: '配置说明',        nameHref: '#config',       nameTarget: '', desc: '了解 config.yaml 中的每个配置项' },
            { name: 'API 设置',        nameHref: '#api-config',   nameTarget: '', desc: 'LLM、Whisper、TTS — 所有 API 提供商详解' },
            { name: '配音指南',        nameHref: '#dubbing',      nameTarget: '', desc: '9 种 TTS 引擎对比与专业技巧' },
            { name: '故障排除',        nameHref: '#troubleshooting', nameTarget: '', desc: '常见问题及解决方案' },
            { name: '流水线深度解析',  nameHref: '#workflow',     nameTarget: '', desc: '逐步详解：下载 → 转录 → 翻译 → 配音' },
            { name: '代码健康报告',    nameHref: 'views/健康报告/index.html', nameTarget: '', badge: '报告', desc: '7 维度静态分析 · 量化评分 · 26 项改进 · 56h 治理路线图',
              tags: [{ text: '58 / 100', modifier: 'warn' }, { text: '7 维度评分', modifier: 'info' }, { text: '26 改进行动', modifier: 'cyan' }],
              meta: '评估日期 2026-06-28 · Technical Due Diligence' },
            { name: '架构分析报告',    nameHref: 'views/架构报告/index.html', nameTarget: '', badge: '报告', desc: 'ATAM 方法 · 8 维度加权评分 · 10 行动项 · 5 周落地排期',
              tags: [{ text: '5.6 → 7.9', modifier: 'red' }, { text: 'ATAM 方法', modifier: 'purple' }, { text: '10 行动项', modifier: 'cyan' }],
              meta: 'v3.0.0 → v3.1.0 · 评估日期 2026-06-28' }
        ],
        callout: { strong: '提示：', text: 'VideoLingo 接收 YouTube 链接，输出目标语言的高质量字幕与配音视频。跳转到 ', linkText: '快速上手', linkHref: '#quick-start' }
    },
    'zh-TW': {
        hero: {
            title: '連結世界，逐格前行'
        },
        overview: {
            title: '🌟 概述',
            cta:   '立即體驗 VL！',
            ctaHref: 'https://videolingo.io',
            lead:  'VideoLingo 是一個全方位的影片翻譯、本地化和配音工具，旨在生成 Netflix 品質的字幕。它消除了機器翻譯的生硬感和多行字幕，同時提供高品質配音，實現跨越語言障礙的全球知識共享。',
            features: [
                { name: '🎥 yt-dlp',       desc: '透過 yt-dlp 下載 YouTube 影片',                                  links: [] },
                { name: '🎙️ WhisperX',     badge: '核心', desc: '詞級別與低幻覺字幕識別',                                       links: [] },
                { name: '📝 NLP 切割',      badge: '核心', desc: '基於 NLP 與 AI 的字幕切割',                                    links: [] },
                { name: '📚 術語庫',        badge: '核心', desc: '自訂 + AI 生成術語庫，確保翻譯一致性',                         links: [] },
                { name: '🔄 三步意譯',      badge: '核心', desc: '翻譯、反思、調適，實現電影級品質',                             links: [] },
                { name: '✅ Netflix 單行',  badge: '核心', desc: 'Netflix 標準，僅單行字幕',                                     links: [] },
                { name: '🗣️ 多 TTS',        badge: '核心', desc: '支援 GPT-SoVITS、Azure、OpenAI 等配音方案',                    links: [] },
                { name: '🚀 一鍵啟動',      desc: '在 Streamlit 中一鍵啟動與處理',                                  links: [] },
                { name: '🌍 多語系 UI',     desc: 'Streamlit UI 內建多語系支援',                                    links: [] },
                { name: '📝 進度續傳',      desc: '詳細日誌，支援隨時中斷與恢復進度',                               links: [] },
                { name: '🔍 模型選擇器',    desc: '自動從 API 取得完整模型清單，支援搜尋篩選',                     links: [] },
                { name: '⏯️ 工作控制',      desc: '處理過程中可隨時暫停、繼續或停止',                               links: [] }
            ],
            tagline: { html: '與類似項目的區別：<strong>僅單行字幕、更優質的翻譯、無縫配音體驗</strong>' }
        },
        demo: {
            title: '🎥 演示',
            items: {
                dualSubtitles:    '雙語字幕',
                cosyVoiceClone:   'Cosy2 聲音克隆',
                gptSovitsDubbing: 'GPT-SoVITS 配音'
            }
        },
        cards: [
            { name: '快速上手',        nameHref: '#quick-start',  nameTarget: '', desc: '使用 uv 或 Docker 3 分鐘快速啟動' },
            { name: '設定說明',        nameHref: '#config',       nameTarget: '', desc: '了解 config.yaml 中的每個設定項' },
            { name: 'API 設定',        nameHref: '#api-config',   nameTarget: '', desc: 'LLM、Whisper、TTS — 所有 API 提供商詳解' },
            { name: '配音指南',        nameHref: '#dubbing',      nameTarget: '', desc: '9 種 TTS 引擎對比與專業技巧' },
            { name: '故障排除',        nameHref: '#troubleshooting', nameTarget: '', desc: '常見問題及解決方案' },
            { name: '管線深度解析',    nameHref: '#workflow',     nameTarget: '', desc: '逐步詳解：下載 → 轉錄 → 翻譯 → 配音' },
            { name: '程式碼健康報告',  nameHref: 'views/健康报告/index.html', nameTarget: '', badge: '報告', desc: '7 維度靜態分析 · 量化評分 · 26 項改進 · 56h 治理路線圖',
              tags: [{ text: '58 / 100', modifier: 'warn' }, { text: '7 維度評分', modifier: 'info' }, { text: '26 改進行動', modifier: 'cyan' }],
              meta: '評估日期 2026-06-28 · Technical Due Diligence' },
            { name: '架構分析報告',    nameHref: 'views/架构报告/index.html', nameTarget: '', badge: '報告', desc: 'ATAM 方法 · 8 維度加權評分 · 10 行動項 · 5 週落地排期',
              tags: [{ text: '5.6 → 7.9', modifier: 'red' }, { text: 'ATAM 方法', modifier: 'purple' }, { text: '10 行動項', modifier: 'cyan' }],
              meta: 'v3.0.0 → v3.1.0 · 評估日期 2026-06-28' }
        ],
        callout: { strong: '提示：', text: 'VideoLingo 接收 YouTube 連結，輸出目標語言的高品質字幕與配音影片。跳轉到 ', linkText: '快速上手', linkHref: '#quick-start' }
    },
    ja: {
        hero: {
            title: 'フレームごとに世界をつなぐ'
        },
        overview: {
            title: '🌟 概要',
            cta:   'VLを試す！',
            ctaHref: 'https://videolingo.io',
            lead:  'VideoLingoは、Netflixクオリティの字幕を生成することを目的とした、オールインワンの動画翻訳、ローカライゼーション、吹き替えツールです。機械的な翻訳や複数行の字幕を排除し、高品質な吹き替えを追加することで、言語の壁を越えた世界的な知識共有を可能にします。',
            features: [
                { name: '🎥 yt-dlp',       desc: 'yt-dlp による YouTube 動画のダウンロード',                                links: [] },
                { name: '🎙️ WhisperX',     badge: 'コア', desc: 'WhisperX による単語レベルの低誤認識字幕認識',                          links: [] },
                { name: '📝 NLP 分割',      badge: 'コア', desc: 'NLP と AI を活用した字幕セグメンテーション',                            links: [] },
                { name: '📚 用語集',        badge: 'コア', desc: 'カスタム + AI 生成用語集で一貫性のある翻訳',                            links: [] },
                { name: '🔄 3 ステップ',    badge: 'コア', desc: '翻訳-反映-適応による映画品質プロセス',                                  links: [] },
                { name: '✅ Netflix 1 行',  badge: 'コア', desc: 'Netflix スタンダードの 1 行字幕のみ',                                  links: [] },
                { name: '🗣️ マルチ TTS',    badge: 'コア', desc: 'GPT-SoVITS、Azure、OpenAI など複数対応',                                links: [] },
                { name: '🚀 ワンクリック',  desc: 'Streamlit でワンクリック起動と処理',                                       links: [] },
                { name: '🌍 多言語 UI',     desc: 'Streamlit UI の多言語サポート',                                            links: [] },
                { name: '📝 ログ再開',      desc: '進捗再開機能付きの詳細なログ記録',                                        links: [] },
                { name: '🔍 モデル選択',    desc: 'API からモデル一覧を自動取得、検索・フィルター対応',                      links: [] },
                { name: '⏯️ タスク制御',    desc: '処理中いつでも一時停止・再開・中止が可能',                                links: [] }
            ],
            tagline: { html: '類似プロジェクトとの違い：<strong>1行字幕のみ、優れた翻訳品質、シームレスな吹き替え体験</strong>' }
        },
        demo: {
            title: '🎥 デモ',
            items: {
                dualSubtitles:    'デュアル字幕',
                cosyVoiceClone:   'Cosy2 ボイスクローン',
                gptSovitsDubbing: 'GPT-SoVITS 吹き替え'
            }
        },
        cards: [
            { name: 'クイックスタート', nameHref: '#quick-start',  nameTarget: '', desc: 'uv または Docker で 3 分で起動' },
            { name: '設定',             nameHref: '#config',       nameTarget: '', desc: 'config.yaml のすべての設定を理解する' },
            { name: 'API 設定',         nameHref: '#api-config',   nameTarget: '', desc: 'LLM、Whisper、TTS — すべての API プロバイダーを解説' },
            { name: '吹き替えガイド',   nameHref: '#dubbing',      nameTarget: '', desc: '9 種類の TTS エンジン比較とプロのヒント' },
            { name: 'トラブルシューティング', nameHref: '#troubleshooting', nameTarget: '', desc: 'よくある問題とその解決策' },
            { name: 'パイプライン詳細', nameHref: '#workflow',     nameTarget: '', desc: 'ステップバイステップ：ダウンロード → 文字起こし → 翻訳 → 吹き替え' },
            { name: 'コード健全性レポート', nameHref: 'views/健康报告/index.html', nameTarget: '', badge: 'レポート', desc: '7 次元静的解析 · 定量スコア · 26 改善項目 · 56h ロードマップ',
              tags: [{ text: '58 / 100', modifier: 'warn' }, { text: '7 次元', modifier: 'info' }, { text: '26 項目', modifier: 'cyan' }],
              meta: '評価日 2026-06-28 · Technical Due Diligence' },
            { name: 'アーキテクチャレポート', nameHref: 'views/架构报告/index.html', nameTarget: '', badge: 'レポート', desc: 'ATAM 方式 · 8 次元加重スコア · 10 アクション · 5 週間計画',
              tags: [{ text: '5.6 → 7.9', modifier: 'red' }, { text: 'ATAM', modifier: 'purple' }, { text: '10 アクション', modifier: 'cyan' }],
              meta: 'v3.0.0 → v3.1.0 · 評価日 2026-06-28' }
        ],
        callout: { strong: 'ヒント：', text: 'VideoLingo は YouTube URL を受け取り、ターゲット言語で完璧な字幕と吹き替え動画を出力します。', linkText: 'クイックスタート', linkHref: '#quick-start' }
    },
    es: {
        hero: {
            title: 'Conectando el Mundo, Cuadro por Cuadro'
        },
        overview: {
            title: '🌟 Descripción General',
            cta:   '¡Prueba VL Gratis!',
            ctaHref: 'https://videolingo.io',
            lead:  'VideoLingo es una herramienta todo en uno para traducción, localización y doblaje de videos, diseñada para generar subtítulos de calidad Netflix. Elimina las traducciones mecánicas y los subtítulos de múltiples líneas mientras agrega doblaje de alta calidad, permitiendo compartir conocimiento globalmente a través de las barreras del idioma.',
            features: [
                { name: '🎥 yt-dlp',         desc: 'Descarga de videos de YouTube mediante yt-dlp',                                       links: [] },
                { name: '🎙️ WhisperX',       badge: 'Destacado', desc: 'Reconocimiento a nivel de palabra y baja ilusión con WhisperX',                   links: [] },
                { name: '📝 Segment. NLP',    badge: 'Destacado', desc: 'Segmentación de subtítulos impulsada por NLP e IA',                                links: [] },
                { name: '📚 Glosario',        badge: 'Destacado', desc: 'Terminología personalizada + IA para traducción coherente',                        links: [] },
                { name: '🔄 3 Pasos T-R-A',   badge: 'Destacado', desc: 'Traducción-Reflexión-Adaptación para calidad cinematográfica',                     links: [] },
                { name: '✅ Netflix 1 Línea', badge: 'Destacado', desc: 'Subtítulos de una sola línea, estándar Netflix',                                    links: [] },
                { name: '🗣️ Multi-TTS',      badge: 'Destacado', desc: 'Doblaje con GPT-SoVITS, Azure, OpenAI y más',                                      links: [] },
                { name: '🚀 Streamlit',       desc: 'Inicio y procesamiento con un clic en Streamlit',                                     links: [] },
                { name: '🌍 Multi-idioma',    desc: 'Soporte multilingüe en la interfaz de Streamlit',                                     links: [] },
                { name: '📝 Reanudar',        desc: 'Registro detallado con reanudación de progreso',                                      links: [] },
                { name: '🔍 Selector',        desc: 'Selector de modelos con búsqueda y filtro automático desde tu API',                 links: [] },
                { name: '⏯️ Control',         desc: 'Pausa, reanuda o detén el procesamiento en cualquier paso',                          links: [] }
            ],
            tagline: { html: 'Diferencia con proyectos similares: <strong>Solo subtítulos de una línea, calidad superior de traducción, experiencia de doblaje perfecta</strong>' }
        },
        demo: {
            title: '🎥 Demo',
            items: {
                dualSubtitles:    'Subtítulos Duales',
                cosyVoiceClone:   'Clon de Voz Cosy2',
                gptSovitsDubbing: 'Doblaje GPT-SoVITS'
            }
        },
        cards: [
            { name: 'Inicio rápido',    nameHref: '#quick-start',  nameTarget: '', desc: 'Funcionando en 3 minutos con uv o Docker' },
            { name: 'Configuración',    nameHref: '#config',       nameTarget: '', desc: 'Comprende cada opción en config.yaml' },
            { name: 'Config. API',      nameHref: '#api-config',   nameTarget: '', desc: 'LLM, Whisper, TTS — todos los proveedores explicados' },
            { name: 'Guía de doblaje',  nameHref: '#dubbing',      nameTarget: '', desc: '9 motores TTS comparados con consejos profesionales' },
            { name: 'Solución de problemas', nameHref: '#troubleshooting', nameTarget: '', desc: 'Problemas comunes y sus soluciones' },
            { name: 'Pipeline en detalle', nameHref: '#workflow',  nameTarget: '', desc: 'Paso a paso: descargar → transcribir → traducir → doblar' },
            { name: 'Informe de salud del código', nameHref: 'views/健康报告/index.html', nameTarget: '', badge: 'Informe', desc: 'Análisis estático 7D · puntuación cuantitativa · 26 mejoras · hoja de ruta 56h',
              tags: [{ text: '58 / 100', modifier: 'warn' }, { text: '7 dimensiones', modifier: 'info' }, { text: '26 acciones', modifier: 'cyan' }],
              meta: 'Fecha de evaluación 2026-06-28 · Due Diligence Técnica' },
            { name: 'Informe de arquitectura', nameHref: 'views/架构报告/index.html', nameTarget: '', badge: 'Informe', desc: 'Método ATAM · 8 dimensiones ponderadas · 10 acciones · plan 5 semanas',
              tags: [{ text: '5.6 → 7.9', modifier: 'red' }, { text: 'ATAM', modifier: 'purple' }, { text: '10 acciones', modifier: 'cyan' }],
              meta: 'v3.0.0 → v3.1.0 · Fecha de evaluación 2026-06-28' }
        ],
        callout: { strong: 'Consejo:', text: 'VideoLingo toma una URL de YouTube y la convierte en un video perfectamente subtitulado y doblado en tu idioma. Ir a ', linkText: 'Inicio rápido', linkHref: '#quick-start' }
    },
    ru: {
        hero: {
            title: 'Объединяя Мир, Кадр за Кадром'
        },
        overview: {
            title: '🌟 Обзор',
            cta:   'Попробуйте VL бесплатно!',
            ctaHref: 'https://videolingo.io',
            lead:  'VideoLingo - это универсальный инструмент для перевода, локализации и дубляжа видео, направленный на создание субтитров качества Netflix. Он устраняет механические переводы и многострочные субтитры, добавляя высококачественный дубляж, что позволяет делиться знаниями по всему миру, преодолевая языковые барьеры.',
            features: [
                { name: '🎥 yt-dlp',         desc: 'Загрузка видео с YouTube через yt-dlp',                                                links: [] },
                { name: '🎙️ WhisperX',       badge: 'Ядро', desc: 'Пословное распознавание субтитров с низким уровнем искажений',                     links: [] },
                { name: '📝 NLP Сегмент.',   badge: 'Ядро', desc: 'Сегментация субтитров на основе NLP и ИИ',                                           links: [] },
                { name: '📚 Глоссарий',      badge: 'Ядро', desc: 'Пользовательская + ИИ терминология для согласованного перевода',                     links: [] },
                { name: '🔄 3 Этапа',        badge: 'Ядро', desc: 'Перевод-Осмысление-Адаптация для кинематографического качества',                     links: [] },
                { name: '✅ Netflix 1 Строка',badge: 'Ядро', desc: 'Только однострочные субтитры стандарта Netflix',                                      links: [] },
                { name: '🗣️ Мульти-TTS',     badge: 'Ядро', desc: 'Дубляж через GPT-SoVITS, Azure, OpenAI и другие',                                    links: [] },
                { name: '🚀 Streamlit',       desc: 'Запуск и обработка в один клик в Streamlit',                                           links: [] },
                { name: '🌍 Мульти-язык',    desc: 'Многоязычный интерфейс Streamlit',                                                     links: [] },
                { name: '📝 Возобновление',  desc: 'Подробное логирование с возможностью возобновления прогресса',                        links: [] },
                { name: '🔍 Выбор модели',   desc: 'Селектор моделей с автопоиском и фильтрацией от вашего API',                          links: [] },
                { name: '⏯️ Управление',     desc: 'Пауза, возобновление или остановка обработки на любом этапе',                          links: [] }
            ],
            tagline: { html: 'Отличие от похожих проектов: <strong>Только однострочные субтитры, превосходное качество перевода, безупречный опыт дубляжа</strong>' }
        },
        demo: {
            title: '🎥 Демонстрация',
            items: {
                dualSubtitles:    'Двойные Субтитры',
                cosyVoiceClone:   'Клонирование Голоса Cosy2',
                gptSovitsDubbing: 'GPT-SoVITS с моим голосом'
            }
        },
        cards: [
            { name: 'Быстрый старт',    nameHref: '#quick-start',  nameTarget: '', desc: 'Запуск за 3 минуты с uv или Docker' },
            { name: 'Настройка',        nameHref: '#config',       nameTarget: '', desc: 'Разберитесь с каждой настройкой в config.yaml' },
            { name: 'Настройка API',    nameHref: '#api-config',   nameTarget: '', desc: 'LLM, Whisper, TTS — все провайдеры с пояснениями' },
            { name: 'Руководство по озвучиванию', nameHref: '#dubbing', nameTarget: '', desc: 'Сравнение 9 TTS-движков с советами' },
            { name: 'Устранение неполадок', nameHref: '#troubleshooting', nameTarget: '', desc: 'Частые проблемы и их решения' },
            { name: 'Конвейер в деталях', nameHref: '#workflow',  nameTarget: '', desc: 'Пошагово: загрузка → транскрипция → перевод → озвучивание' },
            { name: 'Отчёт о состоянии кода', nameHref: 'views/健康报告/index.html', nameTarget: '', badge: 'Отчёт', desc: '7-мерный статический анализ · количественная оценка · 26 улучшений · план на 56ч',
              tags: [{ text: '58 / 100', modifier: 'warn' }, { text: '7 измерений', modifier: 'info' }, { text: '26 действий', modifier: 'cyan' }],
              meta: 'Дата оценки 2026-06-28 · Технический Due Diligence' },
            { name: 'Архитектурный отчёт', nameHref: 'views/架构报告/index.html', nameTarget: '', badge: 'Отчёт', desc: 'Метод ATAM · 8 взвешенных измерений · 10 действий · план на 5 недель',
              tags: [{ text: '5.6 → 7.9', modifier: 'red' }, { text: 'ATAM', modifier: 'purple' }, { text: '10 действий', modifier: 'cyan' }],
              meta: 'v3.0.0 → v3.1.0 · Дата оценки 2026-06-28' }
        ],
        callout: { strong: 'Совет:', text: 'VideoLingo берёт ссылку YouTube и создаёт идеально субтитрированное и озвученное видео на вашем языке. Перейти к ', linkText: 'Быстрый старт', linkHref: '#quick-start' }
    },
    fr: {
        hero: {
            title: 'Connecter le Monde, Image par Image'
        },
        overview: {
            title: '🌟 Aperçu',
            cta:   'Essayez VL maintenant !',
            ctaHref: 'https://videolingo.io',
            lead:  'VideoLingo est un outil tout-en-un de traduction, de localisation et de doublage vidéo visant à générer des sous-titres de qualité Netflix. Il élimine les traductions automatiques rigides et les sous-titres multi-lignes tout en ajoutant un doublage de haute qualité, permettant le partage des connaissances à l\'échelle mondiale au-delà des barrières linguistiques.',
            features: [
                { name: '🎥 yt-dlp',         desc: 'Téléchargement de vidéos YouTube via yt-dlp',                                                links: [] },
                { name: '🎙️ WhisperX',       badge: 'Essentiel', desc: 'Reconnaissance au niveau des mots et à faible illusion avec WhisperX',             links: [] },
                { name: '📝 Segm. NLP',      badge: 'Essentiel', desc: 'Segmentation des sous-titres basée sur le NLP et l\'IA',                            links: [] },
                { name: '📚 Glossaire',      badge: 'Essentiel', desc: 'Terminologie personnalisée + IA pour traduction cohérente',                        links: [] },
                { name: '🔄 3 Étapes',       badge: 'Essentiel', desc: 'Traduction-Réflexion-Adaptation pour qualité cinématographique',                    links: [] },
                { name: '✅ Netflix 1 Ligne',badge: 'Essentiel', desc: 'Sous-titres sur une seule ligne, norme Netflix',                                   links: [] },
                { name: '🗣️ Multi-TTS',      badge: 'Essentiel', desc: 'Doublage avec GPT-SoVITS, Azure, OpenAI et plus',                                  links: [] },
                { name: '🚀 Streamlit',       desc: 'Démarrage et traitement en un clic dans Streamlit',                                   links: [] },
                { name: '🌍 Multi-langue',    desc: 'Interface Streamlit multi-langues',                                                    links: [] },
                { name: '📝 Reprise',         desc: 'Journalisation détaillée avec reprise de progression',                                links: [] },
                { name: '🔍 Sélecteur',       desc: 'Sélecteur de modèles avec recherche et filtrage automatique depuis votre API',       links: [] },
                { name: '⏯️ Contrôle',        desc: 'Pause, reprise ou arrêt à n\'importe quelle étape',                                    links: [] }
            ],
            tagline: { html: 'Différence par rapport aux projets similaires : <strong>Sous-titres sur une seule ligne uniquement, qualité de traduction supérieure, expérience de doublage transparente</strong>' }
        },
        demo: {
            title: '🎥 Démo',
            items: {
                dualSubtitles:    'Sous-titres Doubles',
                cosyVoiceClone:   'Clone de Voix Cosy2',
                gptSovitsDubbing: 'Doublage GPT-SoVITS'
            }
        },
        cards: [
            { name: 'Démarrage rapide', nameHref: '#quick-start',  nameTarget: '', desc: 'Opérationnel en 3 minutes avec uv ou Docker' },
            { name: 'Configuration',    nameHref: '#config',       nameTarget: '', desc: 'Comprenez chaque paramètre de config.yaml' },
            { name: 'Configuration API', nameHref: '#api-config',  nameTarget: '', desc: 'LLM, Whisper, TTS — tous les fournisseurs expliqués' },
            { name: 'Guide de doublage', nameHref: '#dubbing',     nameTarget: '', desc: '9 moteurs TTS comparés avec des conseils pro' },
            { name: 'Dépannage',        nameHref: '#troubleshooting', nameTarget: '', desc: 'Problèmes courants et leurs solutions' },
            { name: 'Pipeline en détail', nameHref: '#workflow',   nameTarget: '', desc: 'Étape par étape : télécharger → transcrire → traduire → doubler' },
            { name: 'Rapport de santé du code', nameHref: 'views/健康报告/index.html', nameTarget: '', badge: 'Rapport', desc: 'Analyse statique 7D · score quantitatif · 26 améliorations · feuille de route 56h',
              tags: [{ text: '58 / 100', modifier: 'warn' }, { text: '7 dimensions', modifier: 'info' }, { text: '26 actions', modifier: 'cyan' }],
              meta: 'Date d\'évaluation 2026-06-28 · Due Diligence Technique' },
            { name: 'Rapport d\'architecture', nameHref: 'views/架构报告/index.html', nameTarget: '', badge: 'Rapport', desc: 'Méthode ATAM · 8 dimensions pondérées · 10 actions · plan 5 semaines',
              tags: [{ text: '5.6 → 7.9', modifier: 'red' }, { text: 'ATAM', modifier: 'purple' }, { text: '10 actions', modifier: 'cyan' }],
              meta: 'v3.0.0 → v3.1.0 · Date d\'évaluation 2026-06-28' }
        ],
        callout: { strong: 'Conseil :', text: 'VideoLingo prend une URL YouTube et la transforme en une vidéo parfaitement sous-titrée et doublée dans votre langue. Aller à ', linkText: 'Démarrage rapide', linkHref: '#quick-start' }
    }
};
