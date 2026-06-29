/**
 * YrySceneCard · Nav Tier Template
 * ---------------------------------------------------------------------------
 * 用于：文档页内导航卡片。nameHref 是文档锚点或子页面，
 * nameTarget: '' 表示同窗口打开。
 *
 * Nav 卡片不要仅靠 name + desc 一句话；desc 必须用 · 分隔多个具体点，
 * 即便最简洁的导航卡也要有"做了什么"的描述。
 */
window.YRY_CARD_NAV = {
    name: 'Quick Start',
    nameHref: 'views/quick-start/index.html',
    nameTarget: '',
    desc: 'Get running in <strong>3 minutes</strong> · uv or Docker · minimal config'
};

/**
 * Variant: nav with badge (e.g., "新" / "Guide")
 */
window.YRY_CARD_NAV_BADGE = {
    name: 'Troubleshooting',
    nameHref: 'views/troubleshooting/index.html',
    nameTarget: '',
    badge: 'Guide',
    desc: 'Common errors · <strong>10 known issues</strong> · fix recipes'
};

/**
 * Variant: nav with tags (highlighted / new)
 */
window.YRY_CARD_NAV_TAGS = {
    name: 'Architecture Diagram',
    nameHref: 'views/diagram/index.html',
    nameTarget: '',
    desc: 'System overview · <strong>4 layers</strong> · 18 components',
    tags: [
        { text: 'New', modifier: 'accent' }
    ]
};