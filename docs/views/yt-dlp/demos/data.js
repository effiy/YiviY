/**
 * yt-dlp Demos — Data Source
 * =============================================================================
 * Language-keyed config consumed by mountDocComponent() with i18n: true.
 *
 * Demo types:
 *   A — Tool Interface    (yt-dlp-tool: download pipeline simulator)
 *   B — Pipeline          (subtitle-workflow: subtitle extraction stages)
 *   C — Comparison        (format-selector: format/resolution tradeoffs)
 *   F — Guide Walkthrough (config-wizard: step-by-step configuration)
 *
 * Each demo entry:
 *   slug        — directory name under demos/
 *   type        — A/B/C/D/E/F classification
 *   name        — display name (emoji + title)
 *   href        — link relative to this directory
 *   desc        — HTML description (1-2 sentences, supports <strong>)
 *   tags        — flat array of classification tags
 *   highlights  — 2-3 bullet points of what you'll learn (NEW)
 *   complexity  — difficulty indicator (optional)
 */

window.YT_DLP_DEMOS_CONFIG = {

    en: {
        pageTitle: '⬇ yt-dlp Interactive Demos',
        pageDescription: 'Hands-on demonstrations of the yt-dlp download engine — simulate pipelines, compare formats, explore subtitle extraction, and configure options like a pro.',
        diagramLink: 'Pipeline Diagram',
        graphLink: 'Code Graph',
        backToDiagram: 'Pipeline Diagram',
        backToGraph: 'Code Graph',
        backToDocs: 'Docs Home',
        tryDemo: '▶ Try Demo',
        noResults: 'No demos found for this category.',
        allFilter: 'All',

        typeLabels: {
            A: '🛠️ Tool Demos',
            B: '🔄 Pipeline Demos',
            C: '⚖️ Comparison Demos',
            D: '🎮 Control Demos',
            E: '📊 Dashboard Demos',
            F: '📖 Walkthroughs'
        },

        demos: [
            {
                slug: 'yt-dlp-tool',
                type: 'A',
                name: '⬇ Download Pipeline Simulator',
                href: 'yt-dlp-tool/index.html',
                desc: 'Paste a video URL and watch the <strong>complete 8-stage download pipeline</strong> execute in real time. Each stage traces to the actual Python source file — click to jump to the code graph. Includes retry simulation, format options, and mock results for three popular videos.',
                tags: ['8-stage pipeline', 'retry logic', 'source tracing', 'Python'],
                highlights: [
                    'Watch 8 download stages execute with live progress',
                    'Click stage traces to jump to source code in the graph',
                    'Simulate fragment download failures and automatic retries',
                    'Explore how format/resolution options affect output'
                ],
                complexity: 'Beginner'
            },
            {
                slug: 'format-selector',
                type: 'C',
                name: '🎬 Format & Resolution Selector',
                href: 'format-selector/index.html',
                desc: 'Compare <strong>video/audio format combinations</strong> side-by-side. Toggle between resolutions (360p → 4K), codec pairs, and container types. See real-time file size estimates and understand the tradeoffs between quality, compatibility, and storage.',
                tags: ['format comparison', 'resolution', 'codec', 'file size'],
                highlights: [
                    'Compare 10+ format combinations in a sortable table',
                    'See how resolution, codec, and container affect file size',
                    'Learn which formats yt-dlp selects by default',
                    'Toggle audio-only mode for podcast/music extraction'
                ],
                complexity: 'Intermediate'
            },
            {
                slug: 'subtitle-workflow',
                type: 'B',
                name: '📝 Subtitle Extraction Pipeline',
                href: 'subtitle-workflow/index.html',
                desc: 'An <strong>animated 5-stage visualization</strong> of how yt-dlp extracts subtitles. See manual vs auto-generated subtitle discovery, format conversion (vtt/srt/ass), and multi-language availability. Click any stage to inspect the intermediate output.',
                tags: ['5-stage pipeline', 'multi-language', 'manual + auto', 'format conversion'],
                highlights: [
                    'Watch subtitle extraction animate through 5 stages',
                    'Compare manual captions vs auto-generated subtitles',
                    'Explore language availability across 6 languages',
                    'Understand vtt → srt → ass format conversion'
                ],
                complexity: 'Beginner'
            },
            {
                slug: 'config-wizard',
                type: 'F',
                name: '⚙️ Configuration Wizard',
                href: 'config-wizard/index.html',
                desc: 'A <strong>step-by-step walkthrough</strong> for configuring yt-dlp in VideoLingo. Build format strings, set subtitle preferences, configure post-processing, and design output templates. Each step has copyable snippets with real yt-dlp flags.',
                tags: ['step-by-step', 'format strings', 'config', 'copyable snippets'],
                highlights: [
                    'Build real yt-dlp format selector strings interactively',
                    'Learn subtitle language codes and download options',
                    'Configure FFmpeg post-processing options',
                    'Design output filename templates with variables'
                ],
                complexity: 'Advanced'
            }
        ]
    },

    'zh-CN': {
        pageTitle: '⬇ yt-dlp 交互演示',
        pageDescription: 'yt-dlp 下载引擎的动手实践演示 — 模拟下载管线、对比格式、探索字幕提取、像专家一样配置选项。',
        diagramLink: '流水线图',
        graphLink: '代码图',
        backToDiagram: '流水线图',
        backToGraph: '代码图',
        backToDocs: '文档首页',
        tryDemo: '▶ 体验演示',
        noResults: '此分类暂无演示。',
        allFilter: '全部',

        typeLabels: {
            A: '🛠️ 工具演示',
            B: '🔄 流水线演示',
            C: '⚖️ 对比演示',
            D: '🎮 控制演示',
            E: '📊 仪表盘演示',
            F: '📖 教程演示'
        },

        demos: [
            {
                slug: 'yt-dlp-tool',
                type: 'A',
                name: '⬇ 下载管线模拟器',
                href: 'yt-dlp-tool/index.html',
                desc: '粘贴视频 URL，实时观看<strong>完整的 8 阶段下载管线</strong>执行过程。每个阶段均追溯至实际 Python 源文件 — 点击即可跳转到代码图。包含重试模拟、格式选项和三段流行视频的模拟结果。',
                tags: ['8 阶段管线', '重试逻辑', '源码追溯', 'Python'],
                highlights: [
                    '观看 8 个下载阶段实时执行并显示进度',
                    '点击阶段追溯链接跳转到代码图中的源码',
                    '模拟分片下载失败及其自动重试机制',
                    '探索格式/分辨率选项对输出文件的影响'
                ],
                complexity: '入门'
            },
            {
                slug: 'format-selector',
                type: 'C',
                name: '🎬 格式与分辨率选择器',
                href: 'format-selector/index.html',
                desc: '<strong>视频/音频格式组合</strong>并排对比。切换分辨率（360p → 4K）、编码对和容器类型。查看实时文件大小估算，理解画质、兼容性与存储空间之间的权衡。',
                tags: ['格式对比', '分辨率', '编码', '文件大小'],
                highlights: [
                    '在可排序表格中对比 10+ 种格式组合',
                    '了解分辨率、编码和容器如何影响文件大小',
                    '理解 yt-dlp 的默认格式选择逻辑',
                    '切换仅音频模式用于播客/音乐提取'
                ],
                complexity: '中级'
            },
            {
                slug: 'subtitle-workflow',
                type: 'B',
                name: '📝 字幕提取流水线',
                href: 'subtitle-workflow/index.html',
                desc: 'yt-dlp 字幕提取过程的<strong>5 阶段动画可视化</strong>。查看人工字幕与自动生成字幕的发现过程、格式转换（vtt/srt/ass）以及多语言可用性。点击任意阶段查看中间输出。',
                tags: ['5 阶段流水线', '多语言', '人工 + 自动', '格式转换'],
                highlights: [
                    '观看字幕提取的 5 个阶段动画演示',
                    '对比人工字幕与自动生成字幕',
                    '探索 6 种语言的字幕可用性',
                    '理解 vtt → srt → ass 格式转换过程'
                ],
                complexity: '入门'
            },
            {
                slug: 'config-wizard',
                type: 'F',
                name: '⚙️ 配置向导',
                href: 'config-wizard/index.html',
                desc: '在 VideoLingo 中配置 yt-dlp 的<strong>逐步操作指南</strong>。构建格式字符串、设置字幕偏好、配置后处理、设计输出模板。每一步都包含可复制的 yt-dlp 实际参数片段。',
                tags: ['分步教程', '格式字符串', '配置', '可复制片段'],
                highlights: [
                    '交互式构建真实的 yt-dlp 格式选择器字符串',
                    '学习字幕语言代码和下载选项',
                    '配置 FFmpeg 后处理选项',
                    '使用变量设计输出文件名模板'
                ],
                complexity: '高级'
            }
        ]
    }
};
