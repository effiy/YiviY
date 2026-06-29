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
};
