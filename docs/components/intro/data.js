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
 *       - features    feature-list 项数组（每项 { html }）
 *       - tagline     总结条幅（{ html }）
 *   - cards           站点导航卡片（YrySceneCard props）
 *   - callout         底部提示条
 *
 *   - constants（顶层，语言无关）
 *       - social.trendshift  Hero 徽章链接
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
        }
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
                { html: '🎥 YouTube video download via yt-dlp' },
                { html: '<strong>🎙️ Word-level and Low-illusion subtitle recognition with WhisperX</strong>' },
                { html: '<strong>📝 NLP and AI-powered subtitle segmentation</strong>' },
                { html: '<strong>📚 Custom + AI-generated terminology for coherent translation</strong>' },
                { html: '<strong>🔄 3-step Translate-Reflect-Adaptation for cinematic quality</strong>' },
                { html: '<strong>✅ Netflix-standard, Single-line subtitles Only</strong>' },
                { html: '<strong>🗣️ Dubbing with GPT-SoVITS, Azure, OpenAI, and more</strong>' },
                { html: '🚀 One-click startup and processing in Streamlit' },
                { html: '🌍 Multi-language support in Streamlit UI' },
                { html: '📝 Detailed logging with progress resumption' },
                { html: '🔍 Model searchbox with API auto-fetch — search and filter from your provider\'s full model list' },
                { html: '⏯️ Task control — pause, resume, or stop processing at any step' }
            ],
            tagline: { html: 'Difference from similar projects: <strong>Single-line subtitles only, superior translation quality, seamless dubbing experience</strong>' }
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
                { html: '🎥 使用 yt-dlp 从 Youtube 链接下载视频' },
                { html: '<strong>🎙️ 使用 WhisperX 进行单词级和低幻觉字幕识别</strong>' },
                { html: '<strong>📝 使用 NLP 和 AI 进行字幕分割</strong>' },
                { html: '<strong>📚 自定义 + AI 生成术语库，保证翻译连贯性</strong>' },
                { html: '<strong>🔄 三步直译、反思、意译，实现影视级翻译质量</strong>' },
                { html: '<strong>✅ 按照 Netflix 标准检查单行长度，绝无双行字幕</strong>' },
                { html: '<strong>🗣️ 支持 GPT-SoVITS、Azure、OpenAI 等多种配音方案</strong>' },
                { html: '🚀 一键启动，在 streamlit 中一键出片' },
                { html: '🌍 多语言支持就绪的 streamlit UI' },
                { html: '📝 详细记录每步操作日志，支持随时中断和恢复进度' },
                { html: '🔍 模型搜索选择器，自动从 API 获取完整模型列表，支持搜索筛选' },
                { html: '⏯️ 任务控制 — 处理过程中可随时暂停、继续或停止' }
            ],
            tagline: { html: '与同类项目相比的优势：<strong>绝无多行字幕，最佳的翻译质量，无缝的配音体验</strong>' }
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
                { html: '🎥 通過 yt-dlp 下載 YouTube 影片' },
                { html: '<strong>🎙️ 使用 WhisperX 進行詞級別和低幻覺字幕識別</strong>' },
                { html: '<strong>📝 基於 NLP 和 AI 的字幕分段</strong>' },
                { html: '<strong>📚 自定義 + AI 生成術語庫確保翻譯一致性</strong>' },
                { html: '<strong>🔄 三步驟翻譯-反思-調適實現影院級品質</strong>' },
                { html: '<strong>✅ Netflix 標準，僅單行字幕</strong>' },
                { html: '<strong>🗣️ 使用 GPT-SoVITS、Azure、OpenAI 等進行配音</strong>' },
                { html: '🚀 在 Streamlit 中一鍵啟動和處理' },
                { html: '🌍 Streamlit UI 多語言支持' },
                { html: '📝 詳細日誌記錄和進度恢復' },
                { html: '🔍 模型搜尋選擇器，自動從 API 獲取完整模型清單，支援搜尋篩選' },
                { html: '⏯️ 任務控制 — 處理過程中可隨時暫停、繼續或停止' }
            ],
            tagline: { html: '與類似項目的區別：<strong>僅單行字幕、更優質的翻譯、無縫配音體驗</strong>' }
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
                { html: '🎥 yt-dlpによるYouTube動画のダウンロード' },
                { html: '<strong>🎙️ WhisperXによる単語レベルの低誤認識字幕認識</strong>' },
                { html: '<strong>📝 NLPとAIを活用した字幕セグメンテーション</strong>' },
                { html: '<strong>📚 一貫性のある翻訳のためのカスタム＋AI生成用語</strong>' },
                { html: '<strong>🔄 映画品質のための3ステップ（翻訳-反映-適応）プロセス</strong>' },
                { html: '<strong>✅ Netflixスタンダードの1行字幕のみ</strong>' },
                { html: '<strong>🗣️ GPT-SoVITS、Azure、OpenAIなどによる吹き替え</strong>' },
                { html: '🚀 Streamlitでのワンクリック起動と処理' },
                { html: '🌍 Streamlit UIの多言語サポート' },
                { html: '📝 進捗再開機能付きの詳細なログ記録' },
                { html: '🔍 モデル検索セレクター — APIからモデル一覧を自動取得、検索・フィルター対応' },
                { html: '⏯️ タスクコントロール — 処理中いつでも一時停止・再開・中止が可能' }
            ],
            tagline: { html: '類似プロジェクトとの違い：<strong>1行字幕のみ、優れた翻訳品質、シームレスな吹き替え体験</strong>' }
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
                { html: '🎥 Descarga de videos de YouTube mediante yt-dlp' },
                { html: '<strong>🎙️ Reconocimiento de subtítulos a nivel de palabra y baja ilusión con WhisperX</strong>' },
                { html: '<strong>📝 Segmentación de subtítulos impulsada por NLP e IA</strong>' },
                { html: '<strong>📚 Terminología personalizada + generada por IA para una traducción coherente</strong>' },
                { html: '<strong>🔄 Proceso de 3 pasos Traducción-Reflexión-Adaptación para calidad cinematográfica</strong>' },
                { html: '<strong>✅ Solo subtítulos de una línea, estándar Netflix</strong>' },
                { html: '<strong>🗣️ Doblaje con GPT-SoVITS, Azure, OpenAI y más</strong>' },
                { html: '🚀 Inicio y procesamiento con un clic en Streamlit' },
                { html: '🌍 Soporte multilingüe en la interfaz de Streamlit' },
                { html: '📝 Registro detallado con reanudación de progreso' },
                { html: '🔍 Selector de modelos con búsqueda — obtiene automáticamente la lista completa de modelos desde tu API' },
                { html: '⏯️ Control de tareas — pausa, reanuda o detén el procesamiento en cualquier paso' }
            ],
            tagline: { html: 'Diferencia con proyectos similares: <strong>Solo subtítulos de una línea, calidad superior de traducción, experiencia de doblaje perfecta</strong>' }
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
                { html: '🎥 Загрузка видео с YouTube через yt-dlp' },
                { html: '<strong>🎙️ Пословное распознавание субтитров с низким уровнем искажений с помощью WhisperX</strong>' },
                { html: '<strong>📝 Сегментация субтитров на основе NLP и ИИ</strong>' },
                { html: '<strong>📚 Пользовательская + ИИ-генерируемая терминология для согласованного перевода</strong>' },
                { html: '<strong>🔄 3-этапный процесс Перевод-Осмысление-Адаптация для кинематографического качества</strong>' },
                { html: '<strong>✅ Только однострочные субтитры стандарта Netflix</strong>' },
                { html: '<strong>🗣️ Дубляж с помощью GPT-SoVITS, Azure, OpenAI и других</strong>' },
                { html: '🚀 Запуск и обработка в один клик в Streamlit' },
                { html: '🌍 Многоязычная поддержка в интерфейсе Streamlit' },
                { html: '📝 Подробное логирование с возможностью возобновления прогресса' },
                { html: '🔍 Селектор моделей с поиском — автоматическое получение полного списка моделей от вашего API-провайдера' },
                { html: '⏯️ Управление задачами — пауза, возобновление или остановка обработки на любом этапе' }
            ],
            tagline: { html: 'Отличие от похожих проектов: <strong>Только однострочные субтитры, превосходное качество перевода, безупречный опыт дубляжа</strong>' }
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
                { html: '🎥 Téléchargement de vidéos YouTube via yt-dlp' },
                { html: '<strong>🎙️ Reconnaissance de sous-titres au niveau des mots et à faible illusion avec WhisperX</strong>' },
                { html: '<strong>📝 Segmentation des sous-titres basée sur le NLP et l\'IA</strong>' },
                { html: '<strong>📚 Terminologie personnalisée + générée par IA pour une traduction cohérente</strong>' },
                { html: '<strong>🔄 Processus en 3 étapes : Traduction-Réflexion-Adaptation pour une qualité cinématographique</strong>' },
                { html: '<strong>✅ Sous-titres uniquement sur une ligne, aux normes Netflix</strong>' },
                { html: '<strong>🗣️ Doublage avec GPT-SoVITS, Azure, OpenAI et plus</strong>' },
                { html: '🚀 Démarrage et traitement en un clic dans Streamlit' },
                { html: '🌍 Support multi-langues dans l\'interface utilisateur Streamlit' },
                { html: '📝 Journalisation détaillée avec reprise de la progression' },
                { html: '🔍 Sélecteur de modèles avec recherche — récupère automatiquement la liste complète des modèles depuis votre API' },
                { html: '⏯️ Contrôle des tâches — mettez en pause, reprenez ou arrêtez le traitement à n\'importe quelle étape' }
            ],
            tagline: { html: 'Différence par rapport aux projets similaires : <strong>Sous-titres sur une seule ligne uniquement, qualité de traduction supérieure, expérience de doublage transparente</strong>' }
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
