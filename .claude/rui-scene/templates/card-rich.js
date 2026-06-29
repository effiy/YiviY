/**
 * YrySceneCard · Rich Tier Template
 * ---------------------------------------------------------------------------
 * 用于：报告、审计、工具、项目、Agent 等需要展示完整上下文的核心卡片。
 *
 * 强制字段：
 *   - name      : 卡片标题（emoji 前缀用于视觉节奏）
 *   - desc      : 描述（使用 · 分隔，至少一个 <strong> 强调关键指标）
 *   - tags      : 2–4 个语义化标签，modifier 必须与含义匹配
 *   - badge     : 类型分类（'Report' / 'Core' / 'Agent' / 'OSS' / 'Beta'）
 *
 * 可选字段：
 *   - nameHref + nameTarget : 标题链接（同窗口用 nameTarget: ''）
 *   - meta : 日期/版本/来源等 provenance 信息
 *   - links: 自定义底部链接（null = 默认，[] = 隐藏，[...] = 覆盖）
 *
 * Modifier 语义映射：
 *   - 分数（58/100）         → warn / green / red
 *   - 维度/方法（7 dimensions）→ info / purple
 *   - 计数（26 actions）      → cyan
 *   - 分类/亮点（highlighted）→ accent
 */
window.YRY_CARD_RICH = {
    name: 'Card Title · 🔬',
    nameHref: 'views/example/index.html',
    nameTarget: '',
    badge: 'Report',
    desc: '7-dimension static analysis · quantitative scoring · <strong>26 improvements</strong> identified · 56h governance roadmap',
    tags: [
        { text: '58 / 100',  modifier: 'warn' },
        { text: '7 dimensions', modifier: 'info' },
        { text: '26 actions',   modifier: 'cyan' }
    ],
    meta: 'Assessment date 2026-06-29 · Technical Due Diligence',
    links: null   // null = use data.js default link row
};

/**
 * Variant: tool card
 */
window.YRY_CARD_RICH_TOOL = {
    name: 'yt-dlp · 🎥',
    nameHref: 'https://github.com/yt-dlp/yt-dlp',
    nameTarget: '_blank',
    badge: 'OSS',
    desc: '200+ sites supported · <strong>4K / HDR</strong> preserved · robust extractor fallback chain',
    tags: [
        { text: 'Active',      modifier: 'green' },
        { text: 'Python',      modifier: 'purple' },
        { text: '200+ sites',  modifier: 'cyan' }
    ],
    meta: 'Latest release 2026.06.20',
    links: [
        { icon: '⭐', label: 'GitHub',    href: 'https://github.com/yt-dlp/yt-dlp' },
        { icon: '📖', label: 'Wiki',      href: 'https://github.com/yt-dlp/yt-dlp/wiki' },
        { icon: '💬', label: 'Discussions', href: 'https://github.com/yt-dlp/yt-dlp/discussions' }
    ]
};

/**
 * Variant: agent card
 */
window.YRY_CARD_RICH_AGENT = {
    name: 'Code Reviewer · 🤖',
    nameHref: 'views/agents/code-reviewer/index.html',
    nameTarget: '',
    badge: 'Agent',
    desc: 'Multi-language static analysis · <strong>OWASP top-10</strong> coverage · 12 review dimensions',
    tags: [
        { text: '12 dimensions', modifier: 'info' },
        { text: 'OWASP-aware',   modifier: 'accent' },
        { text: 'Beta',          modifier: 'warn' }
    ],
    meta: 'Latest run 2026-06-29 · 47 issues found',
    links: null
};