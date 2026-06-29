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
 *       - features    feature 卡片数组，每项对齐 YrySceneCard props
 *                       { name, desc, badge?, tags, links }
 *                       外部工具卡：3-4 条自定义 links 指向工具自身仓库
 *                       内部功能卡：links: null 使用 cdn 基线默认链接
 *       - tagline     总结条幅（{ html }）
 *       - demo        演示视频章节（从 translations 上移至此）
 *                       · title  章节标题（含 emoji）
 *                       · items  按 demoVideos[i].id 索引的标题映射
 * cards           站点导航卡片（YrySceneCard props）
 *                       按 rui-scene 标准补齐 badge / tags / meta / links
 *                       文档导航卡（Quick Start / Configuration / ...）
 *                         · badge = 'Guide' / '指南' 标识章节类型
 *                         · tags 用语义 modifier 标识阅读门槛 / 主题
 *                         · meta 含 #fragment 锚点便于快速定位
 *                         · links 3 项关键入口（演示 / 配置 / 源码或文档）
 *                       报告卡（Code Health / Architecture）
 *                         · 沿用 Rich tier 描述 + 多 modifier tags + 评估 meta
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
 *   - tags          标签芯片数组，每项 { text, modifier, href? }（Standard+ 必备）
 *   - meta          可选 · 底部元信息
 *   - links         底部链接：null=基线默认, []=隐藏, [...]=自定义
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
                /* ── 外部工具 · 自定义链接指向工具自身仓库 ── */
                { name: '🎥 yt-dlp', nameHref: 'https://github.com/yt-dlp/yt-dlp', nameTarget: '_blank', desc: 'YouTube video download via yt-dlp · <strong>1,200+ sites</strong> · format selection · subtitle extraction',
                  tags: [{ text: '1.2k sites', modifier: 'accent' }, { text: 'Python', modifier: 'info' }],
                  links: [
                      { label: '清单', href: 'views/yt-dlp/checklist/index.html',                  target: '' },
                      { label: '图解', href: 'views/yt-dlp/diagram/index.html',                  target: '' },
                      { label: '图谱', href: 'views/yt-dlp/graph/index.html',                     target: '' },
                      { label: '演示', href: 'views/yt-dlp/demos/yt-dlp-tool/index.html',          target: '' },
                      { label: 'Issues', href: 'https://github.com/yt-dlp/yt-dlp/issues',           target: '_blank' }
                  ]},
                { name: '🎙️ WhisperX', badge: 'Core', desc: 'Word-level subtitle recognition · <strong>low-illusion</strong> output · speaker diarization · multi-language',
                  tags: [{ text: 'word-level', modifier: 'accent' }, { text: 'diarization', modifier: 'info' }],
                  links: [
                      { label: '源码', href: 'https://github.com/m-bain/whisperX',                  target: '_blank' },
                      { label: '论文', href: 'https://arxiv.org/abs/2303.00747',                    target: '_blank' },
                      { label: '文档', href: 'https://github.com/m-bain/whisperX#readme',          target: '_blank' },
                      { label: 'Issues', href: 'https://github.com/m-bain/whisperX/issues',        target: '_blank' }
                  ]},

                /* ── 内部功能 · links: null 使用 cdn 基线默认链接 ── */
                { name: '📝 NLP Split', badge: 'Core', desc: 'NLP and AI-powered subtitle segmentation · <strong>natural reading flow</strong> · sentence-boundary detection · context-aware splitting',
                  tags: [{ text: 'AI-driven', modifier: 'purple' }, { text: 'sentence-aware', modifier: 'info' }],
                  links: null },
                { name: '📚 Term Base', badge: 'Core', desc: 'Custom + AI-generated terminology database · <strong>translation consistency</strong> · domain-specific glossaries · auto-term extraction',
                  tags: [{ text: 'AI + Custom', modifier: 'purple' }, { text: 'glossary', modifier: 'info' }],
                  links: null },
                { name: '🔄 3-Step T-R-A', badge: 'Core', desc: 'Translate → Reflect → Adapt pipeline · <strong>cinematic-quality</strong> translation · self-critique loop · context-aware refinement',
                  tags: [{ text: '3-stage', modifier: 'purple' }, { text: 'self-critique', modifier: 'accent' }],
                  links: null },
                { name: '✅ Netflix 1-Line', badge: 'Core', desc: 'Netflix-standard single-line subtitles only · <strong>no multi-line clutter</strong> · character-length check · reading-speed compliance',
                  tags: [{ text: 'Netflix', modifier: 'accent' }, { text: '1-line', modifier: 'info' }],
                  links: null },
                { name: '🗣️ Multi-TTS', badge: 'Core', desc: 'Multi-engine TTS dubbing · <strong>GPT-SoVITS</strong> · Azure · OpenAI · Edge · F5-TTS · voice cloning support',
                  tags: [{ text: '6 engines', modifier: 'cyan' }, { text: 'voice-clone', modifier: 'accent' }],
                  links: null },

                /* ── 外部工具 · Streamlit 官方链接 ── */
                { name: '🚀 Streamlit UI', desc: 'One-click Streamlit startup · <strong>zero-config</strong> launch · real-time progress visualization · log streaming',
                  tags: [{ text: 'zero-config', modifier: 'accent' }, { text: 'Streamlit', modifier: 'info' }],
                  links: [
                      { label: '源码', href: 'https://github.com/streamlit/streamlit',              target: '_blank' },
                      { label: '文档', href: 'https://docs.streamlit.io/',                          target: '_blank' },
                      { label: '演示', href: 'https://streamlit.io/',                               target: '_blank' },
                      { label: '架构', href: 'https://docs.streamlit.io/develop/concepts/architecture', target: '_blank' }
                  ]},

                /* ── 内部功能 · links: null 使用 cdn 基线默认链接 ── */
                { name: '🌍 i18n', desc: 'Multi-language Streamlit UI · <strong>zh-CN · en · ja · zh-TW</strong> · auto-detect browser locale',
                  tags: [{ text: '4 languages', modifier: 'cyan' }, { text: 'auto-detect', modifier: 'info' }],
                  links: null },
                { name: '📝 Resume', desc: 'Detailed logging with checkpointing · <strong>pause and resume</strong> anytime · progress recovery · session management',
                  tags: [{ text: 'checkpoint', modifier: 'info' }, { text: 'recovery', modifier: 'accent' }],
                  links: null },
                { name: '🔍 Model Picker', desc: 'Auto-fetch full model list from provider API · <strong>search and filter</strong> · model comparison · capability badges',
                  tags: [{ text: 'auto-fetch', modifier: 'accent' }, { text: 'search', modifier: 'info' }],
                  links: null },
                { name: '⏯️ Task Control', desc: 'Pause, resume, or stop at any pipeline step · <strong>real-time task control</strong> · graceful state transitions · resource cleanup',
                  tags: [{ text: 'real-time', modifier: 'accent' }, { text: '3 states', modifier: 'cyan' }],
                  links: null }
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
            /* ── 文档导航卡 · badge / tags / meta / links 三件套 ── */
            { name: 'Quick Start',      nameHref: '#quick-start',  nameTarget: '', badge: 'Guide',
              desc: 'Get running in 3 minutes with uv or Docker · <strong>zero to translated video</strong>',
              tags: [{ text: '5 min', modifier: 'pass' }, { text: 'uv/Docker', modifier: 'info' }],
              meta: '#quick-start · cross-platform',
              links: [
                  { label: 'Demo',    href: 'https://videolingo.io',                                       target: '_blank' },
                  { label: 'Config',  href: '#config',                                                     target: '' },
                  { label: 'Issues',  href: 'https://github.com/Huanshere/VideoLingo/issues',              target: '_blank' }
              ]},
            { name: 'Configuration',    nameHref: '#config',       nameTarget: '', badge: 'Guide',
              desc: 'Every knob in config.yaml explained · LLM · Whisper · TTS · output settings',
              tags: [{ text: 'yaml', modifier: 'info' }, { text: 'full ref', modifier: 'cyan' }],
              meta: '#config · config.yaml',
              links: [
                  { label: 'API',     href: '#api-config',                                                 target: '' },
                  { label: 'Docs',    href: 'https://github.com/Huanshere/VideoLingo/blob/main/README.md',  target: '_blank' },
                  { label: 'Source',  href: 'https://github.com/Huanshere/VideoLingo',                      target: '_blank' }
              ]},
            { name: 'API Setup',        nameHref: '#api-config',   nameTarget: '', badge: 'Guide',
              desc: 'LLM providers · Whisper variants · TTS engines · <strong>all APIs documented</strong>',
              tags: [{ text: 'LLM/Whisper/TTS', modifier: 'purple' }],
              meta: '#api-config · multi-provider',
              links: [
                  { label: 'Config',  href: '#config',                                                     target: '' },
                  { label: 'Docs',    href: 'https://github.com/Huanshere/VideoLingo/blob/main/README.md',  target: '_blank' },
                  { label: 'Source',  href: 'https://github.com/Huanshere/VideoLingo',                      target: '_blank' }
              ]},
            { name: 'Dubbing Guide',    nameHref: '#dubbing',      nameTarget: '', badge: 'Guide',
              desc: '<strong>9 TTS engines</strong> compared side-by-side · quality assessments · pro tips',
              tags: [{ text: '9 engines', modifier: 'cyan' }, { text: 'advanced', modifier: 'warn' }],
              meta: '#dubbing · 9 TTS engines',
              links: [
                  { label: 'Demo',    href: 'https://videolingo.io',                                       target: '_blank' },
                  { label: 'Config',  href: '#config',                                                     target: '' },
                  { label: 'Source',  href: 'https://github.com/Huanshere/VideoLingo',                      target: '_blank' }
              ]},
            { name: 'Troubleshooting',  nameHref: '#troubleshooting', nameTarget: '', badge: 'Guide',
              desc: 'Common pitfalls and their fixes · dependency conflicts · API errors · CUDA issues',
              tags: [{ text: 'FAQ', modifier: 'warn' }],
              meta: '#troubleshooting · common issues',
              links: [
                  { label: 'Config',  href: '#config',                                                     target: '' },
                  { label: 'Logs',    href: '#config',                                                     target: '' },
                  { label: 'Issues',  href: 'https://github.com/Huanshere/VideoLingo/issues',              target: '_blank' }
              ]},
            { name: 'Pipeline Deep Dive', nameHref: '#workflow',   nameTarget: '', badge: 'Guide',
              desc: 'Step-by-step walkthrough: <strong>download · transcribe · translate · dub</strong>',
              tags: [{ text: '6 steps', modifier: 'cyan' }, { text: 'flowchart', modifier: 'purple' }],
              meta: '#workflow · download → dub',
              links: [
                  { label: 'Demo',    href: 'https://videolingo.io',                                       target: '_blank' },
                  { label: 'Source',  href: 'https://github.com/Huanshere/VideoLingo',                      target: '_blank' },
                  { label: 'Docs',    href: 'https://github.com/Huanshere/VideoLingo/blob/main/README.md',  target: '_blank' }
              ]},
            /* ── 报告卡 · Rich tier，含评估 meta + 多 modifier tags ── */
            { name: 'Code Health Report', nameHref: 'views/健康报告/index.html', nameTarget: '', badge: 'Report', desc: '7-dimension static analysis · quantitative scoring · <strong>26 improvements</strong> · 56h governance roadmap',
              tags: [{ text: '58 / 100', modifier: 'warn' }, { text: '7 dimensions', modifier: 'info' }, { text: '26 actions', modifier: 'cyan' }],
              meta: 'Assessment date 2026-06-28 · Technical Due Diligence' },
            { name: 'Architecture Report', nameHref: 'views/架构报告/index.html', nameTarget: '', badge: 'Report', desc: 'ATAM method · 8-dimension weighted scoring · <strong>10 action items</strong> · 5-week implementation plan',
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
                /* ── 外部工具 · 自定义链接指向工具自身仓库 ── */
                { name: '🎥 yt-dlp', nameHref: 'https://github.com/yt-dlp/yt-dlp', nameTarget: '_blank', desc: '使用 yt-dlp 下载 YouTube 视频 · <strong>1,200+ 站点</strong> · 格式选择 · 字幕提取',
                  tags: [{ text: '1.2k 站点', modifier: 'accent' }, { text: 'Python', modifier: 'info' }],
                  links: [
                      { label: '清单', href: 'views/yt-dlp/checklist/index.html',                  target: '' },
                      { label: '图解', href: 'views/yt-dlp/diagram/index.html',                  target: '' },
                      { label: '图谱', href: 'views/yt-dlp/graph/index.html',                     target: '' },
                      { label: '演示', href: 'views/yt-dlp/demos/yt-dlp-tool/index.html',          target: '' },
                      { label: 'Issues', href: 'https://github.com/yt-dlp/yt-dlp/issues',           target: '_blank' }
                  ]},
                { name: '🎙️ WhisperX', badge: '核心', desc: '单词级字幕识别 · <strong>低幻觉</strong>输出 · 说话人分离 · 多语言支持',
                  tags: [{ text: '词级识别', modifier: 'accent' }, { text: '说话人分离', modifier: 'info' }],
                  links: [
                      { label: '源码', href: 'https://github.com/m-bain/whisperX',                  target: '_blank' },
                      { label: '论文', href: 'https://arxiv.org/abs/2303.00747',                    target: '_blank' },
                      { label: '文档', href: 'https://github.com/m-bain/whisperX#readme',          target: '_blank' },
                      { label: 'Issues', href: 'https://github.com/m-bain/whisperX/issues',        target: '_blank' }
                  ]},

                /* ── 内部功能 · links: null 使用 cdn 基线默认链接 ── */
                { name: '📝 NLP 分割', badge: '核心', desc: 'NLP 和 AI 驱动的字幕分割 · <strong>自然阅读流</strong> · 句子边界检测 · 上下文感知拆分',
                  tags: [{ text: 'AI 驱动', modifier: 'purple' }, { text: '句子感知', modifier: 'info' }],
                  links: null },
                { name: '📚 术语库', badge: '核心', desc: '自定义 + AI 生成术语数据库 · <strong>翻译一致性</strong> · 领域术语表 · 自动术语提取',
                  tags: [{ text: 'AI + 自定义', modifier: 'purple' }, { text: '术语表', modifier: 'info' }],
                  links: null },
                { name: '🔄 三步意译', badge: '核心', desc: '直译 → 反思 → 意译流水线 · <strong>影视级</strong>翻译质量 · 自省循环 · 上下文感知精炼',
                  tags: [{ text: '三阶段', modifier: 'purple' }, { text: '自省循环', modifier: 'accent' }],
                  links: null },
                { name: '✅ Netflix 单行', badge: '核心', desc: 'Netflix 标准单行字幕 · <strong>绝无双行</strong> · 字符长度检查 · 阅读速度合规',
                  tags: [{ text: 'Netflix 标准', modifier: 'accent' }, { text: '单行', modifier: 'info' }],
                  links: null },
                { name: '🗣️ 多 TTS', badge: '核心', desc: '多引擎 TTS 配音 · <strong>GPT-SoVITS</strong> · Azure · OpenAI · Edge · F5-TTS · 声音克隆',
                  tags: [{ text: '6 引擎', modifier: 'cyan' }, { text: '声音克隆', modifier: 'accent' }],
                  links: null },

                /* ── 外部工具 · Streamlit 官方链接 ── */
                { name: '🚀 一键启动', desc: 'Streamlit 一键启动 · <strong>零配置</strong> · 实时进度可视化 · 日志流',
                  tags: [{ text: '零配置', modifier: 'accent' }, { text: 'Streamlit', modifier: 'info' }],
                  links: [
                      { label: '源码', href: 'https://github.com/streamlit/streamlit',              target: '_blank' },
                      { label: '文档', href: 'https://docs.streamlit.io/',                          target: '_blank' },
                      { label: '演示', href: 'https://streamlit.io/',                               target: '_blank' },
                      { label: '架构', href: 'https://docs.streamlit.io/develop/concepts/architecture', target: '_blank' }
                  ]},

                /* ── 内部功能 · links: null 使用 cdn 基线默认链接 ── */
                { name: '🌍 多语言 UI', desc: '多语言 Streamlit UI · <strong>简体中文 · 英语 · 日语 · 繁体中文</strong> · 自动检测浏览器语言',
                  tags: [{ text: '4 种语言', modifier: 'cyan' }, { text: '自动检测', modifier: 'info' }],
                  links: null },
                { name: '📝 进度恢复', desc: '详细日志与检查点 · <strong>随时中断恢复</strong> · 进度恢复 · 会话管理',
                  tags: [{ text: '检查点', modifier: 'info' }, { text: '恢复', modifier: 'accent' }],
                  links: null },
                { name: '🔍 模型选择器', desc: '自动获取 API 完整模型列表 · <strong>搜索筛选</strong> · 模型对比 · 能力标签',
                  tags: [{ text: '自动获取', modifier: 'accent' }, { text: '搜索', modifier: 'info' }],
                  links: null },
                { name: '⏯️ 任务控制', desc: '任意步骤暂停、继续或停止 · <strong>实时任务控制</strong> · 优雅状态转换 · 资源清理',
                  tags: [{ text: '实时', modifier: 'accent' }, { text: '3 状态', modifier: 'cyan' }],
                  links: null }
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
            /* ── 文档导航卡 · badge / tags / meta / links 三件套 ── */
            { name: '快速上手',        nameHref: '#quick-start',  nameTarget: '', badge: '指南',
              desc: '使用 uv 或 Docker 3 分钟快速启动 · <strong>零到翻译视频</strong>',
              tags: [{ text: '5 分钟', modifier: 'pass' }, { text: 'uv/Docker', modifier: 'info' }],
              meta: '#quick-start · 跨平台',
              links: [
                  { label: '演示',   href: 'https://videolingo.io',                                       target: '_blank' },
                  { label: '配置',   href: '#config',                                                     target: '' },
                  { label: 'Issues', href: 'https://github.com/Huanshere/VideoLingo/issues',              target: '_blank' }
              ]},
            { name: '配置说明',        nameHref: '#config',       nameTarget: '', badge: '指南',
              desc: 'config.yaml 每个配置项详解 · LLM · Whisper · TTS · 输出设置',
              tags: [{ text: 'yaml', modifier: 'info' }, { text: '完整参考', modifier: 'cyan' }],
              meta: '#config · config.yaml',
              links: [
                  { label: 'API',   href: '#api-config',                                                 target: '' },
                  { label: '文档',  href: 'https://github.com/Huanshere/VideoLingo/blob/main/README.md',  target: '_blank' },
                  { label: '源码',  href: 'https://github.com/Huanshere/VideoLingo',                      target: '_blank' }
              ]},
            { name: 'API 设置',        nameHref: '#api-config',   nameTarget: '', badge: '指南',
              desc: 'LLM 提供商 · Whisper 变体 · TTS 引擎 · <strong>所有 API 文档</strong>',
              tags: [{ text: 'LLM/Whisper/TTS', modifier: 'purple' }],
              meta: '#api-config · 多服务商',
              links: [
                  { label: '配置',  href: '#config',                                                     target: '' },
                  { label: '文档',  href: 'https://github.com/Huanshere/VideoLingo/blob/main/README.md',  target: '_blank' },
                  { label: '源码',  href: 'https://github.com/Huanshere/VideoLingo',                      target: '_blank' }
              ]},
            { name: '配音指南',        nameHref: '#dubbing',      nameTarget: '', badge: '指南',
              desc: '<strong>9 种 TTS 引擎</strong>横向对比 · 质量评估 · 专业技巧',
              tags: [{ text: '9 引擎', modifier: 'cyan' }, { text: '进阶', modifier: 'warn' }],
              meta: '#dubbing · 9 种 TTS',
              links: [
                  { label: '演示',  href: 'https://videolingo.io',                                       target: '_blank' },
                  { label: '配置',  href: '#config',                                                     target: '' },
                  { label: '源码',  href: 'https://github.com/Huanshere/VideoLingo',                      target: '_blank' }
              ]},
            { name: '故障排除',        nameHref: '#troubleshooting', nameTarget: '', badge: '指南',
              desc: '常见错误与解决方案 · 依赖冲突 · API 报错 · CUDA 问题',
              tags: [{ text: 'FAQ', modifier: 'warn' }],
              meta: '#troubleshooting · 常见问题',
              links: [
                  { label: '配置',    href: '#config',                                                    target: '' },
                  { label: '日志',    href: '#config',                                                    target: '' },
                  { label: 'Issues', href: 'https://github.com/Huanshere/VideoLingo/issues',              target: '_blank' }
              ]},
            { name: '流水线深度解析',  nameHref: '#workflow',     nameTarget: '', badge: '指南',
              desc: '逐步详解：<strong>下载 · 转录 · 翻译 · 配音</strong>',
              tags: [{ text: '6 步骤', modifier: 'cyan' }, { text: '流程图', modifier: 'purple' }],
              meta: '#workflow · 下载 → 配音',
              links: [
                  { label: '演示',  href: 'https://videolingo.io',                                       target: '_blank' },
                  { label: '源码',  href: 'https://github.com/Huanshere/VideoLingo',                      target: '_blank' },
                  { label: '文档',  href: 'https://github.com/Huanshere/VideoLingo/blob/main/README.md',  target: '_blank' }
              ]},
            /* ── 报告卡 · Rich tier，含评估 meta + 多 modifier tags ── */
            { name: '代码健康报告',    nameHref: 'views/健康报告/index.html', nameTarget: '', badge: '报告', desc: '7 维度静态分析 · 量化评分 · <strong>26 项改进</strong> · 56h 治理路线图',
              tags: [{ text: '58 / 100', modifier: 'warn' }, { text: '7 维度评分', modifier: 'info' }, { text: '26 改进行动', modifier: 'cyan' }],
              meta: '评估日期 2026-06-28 · Technical Due Diligence' },
            { name: '架构分析报告',    nameHref: 'views/架构报告/index.html', nameTarget: '', badge: '报告', desc: 'ATAM 方法 · 8 维度加权评分 · <strong>10 行动项</strong> · 5 周落地排期',
              tags: [{ text: '5.6 → 7.9', modifier: 'red' }, { text: 'ATAM 方法', modifier: 'purple' }, { text: '10 行动项', modifier: 'cyan' }],
              meta: 'v3.0.0 → v3.1.0 · 评估日期 2026-06-28' }
        ],
        callout: { strong: '提示：', text: 'VideoLingo 接收 YouTube 链接，输出目标语言的高质量字幕与配音视频。跳转到 ', linkText: '快速上手', linkHref: '#quick-start' }
    },
};
