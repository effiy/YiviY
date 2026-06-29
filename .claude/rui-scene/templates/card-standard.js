/**
 * YrySceneCard · Standard Tier Template
 * ---------------------------------------------------------------------------
 * 用于：特性网格、能力卡片。需要 tags 但可以省 badge 和 links。
 *
 * 标准要求：
 *   - name + desc（desc 必须用 · 分隔，含 <strong>）
 *   - 2–4 个 tags（语义 modifier）
 *   - badge 在卡片是"核心特性"时建议加
 */
window.YRY_CARD_STANDARD = {
    name: 'Feature Name',
    desc: 'Multi-language support · <strong>12 formats</strong> · auto-detection',
    tags: [
        { text: 'Multi-lang',  modifier: 'purple' },
        { text: 'Auto-detect', modifier: 'accent' }
    ]
};

/**
 * Variant: feature grid card (no bottom links)
 * Use links: [] to hide the default 7-link row for grid density.
 */
window.YRY_CARD_FEATURE_GRID = {
    name: '🎨 Theme System',
    desc: '10 curated themes · <strong>CSS variable</strong> swapping · dark-mode pair designs',
    tags: [
        { text: '10 themes',  modifier: 'info' },
        { text: 'CSS vars',   modifier: 'cyan' },
        { text: 'Dark mode',  modifier: 'accent' }
    ],
    badge: 'Core',
    links: []   // empty array = hide default link row (preferred for dense grids)
};

/**
 * Variant: capability card with meta
 */
window.YRY_CARD_CAPABILITY = {
    name: '⚡ Batch Processing',
    desc: 'Concurrent execution · <strong>4× speedup</strong> via worker pool · progress callbacks',
    tags: [
        { text: 'Concurrent',  modifier: 'green' },
        { text: '4× speedup',  modifier: 'warn' }
    ],
    meta: 'Added in v2.3.0'
};