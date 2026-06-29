/**
 * yt-dlp Demos 数据源
 * ----------------------------------------------------------------------
 * 语言键值对格式，与 mount-component.js 的 i18n: true 配合使用。
 *
 * 字段说明：
 *   - pageTitle / pageDescription  页面标题与描述
 *   - diagramLink                  顶部"查看流水线图"链接文案
 *   - backToDiagram / backToDocs   底部返回链接文案
 *   - tryDemo                      卡片行动按钮文案
 *   - noResults                    无结果提示
 *   - allFilter                    "全部"筛选按钮文案
 *   - typeLabels                   按类型 ID 索引的标签文案映射
 *   - demos                        演示列表数组
 *       - slug       演示目录名
 *       - type       类型 ID（A/B/C/D/E/F）
 *       - name       展示名称
 *       - href       跳转链接（相对于本目录）
 *       - desc       描述文字（支持 HTML）
 *       - tags       标签数组
 */

window.YT_DLP_DEMOS_CONFIG = {
    /* ── 跨语言常量 ─────────────────────────────────── */
    constants: {},

    /* ── 多语言内容 ───────────────────────────────────── */
    en: {
        pageTitle: '⬇ yt-dlp Demos',
        pageDescription: 'Interactive demonstrations of the yt-dlp download pipeline — click a card to explore',
        diagramLink: '← View yt-dlp Pipeline Diagram',
        backToDiagram: '← Back to yt-dlp Diagram',
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
                name: '⬇ yt-dlp Download Simulator',
                href: 'yt-dlp-tool/index.html',
                desc: 'Simulate the full yt-dlp download pipeline — paste a URL and watch the 7-stage progress from info extraction through subtitle download and FFmpeg post-processing. Includes retry simulation, format options, and mock results.',
                tags: ['1.2k sites', 'Python', '7-stage pipeline', 'retry logic']
            }
        ]
    },

    'zh-CN': {
        pageTitle: '⬇ yt-dlp 演示',
        pageDescription: 'yt-dlp 下载管线的交互式演示 — 点击卡片探索',
        diagramLink: '← 查看 yt-dlp 流水线图',
        backToDiagram: '← 返回 yt-dlp 流水线图',
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
                name: '⬇ yt-dlp 下载模拟器',
                href: 'yt-dlp-tool/index.html',
                desc: '模拟完整的 yt-dlp 下载管线 — 粘贴 URL，观看从信息提取到字幕下载再到 FFmpeg 后处理的 7 阶段进度。包含重试模拟、格式选项和模拟结果。',
                tags: ['1.2k 站点', 'Python', '7 阶段管线', '重试逻辑']
            }
        ]
    }
};
