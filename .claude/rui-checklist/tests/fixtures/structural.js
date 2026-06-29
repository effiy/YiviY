/**
 * Structural Completeness Test Fixtures
 * Covers: struct-name, struct-desc, struct-desc-dot, struct-desc-strong,
 *         struct-tags, struct-tags-modifier, struct-badge, struct-meta
 */

export const structural = [
  // ── struct-name ──────────────────────────────────────────────────────────
  {
    id: 'struct-name',
    name: 'valid name → pass',
    card: { name: '🎥 yt-dlp', desc: 'YouTube video download tool' },
    expected: 'pass',
  },
  {
    id: 'struct-name',
    name: 'name missing → fail',
    card: { desc: 'No name field' },
    expected: 'fail',
  },
  {
    id: 'struct-name',
    name: 'name empty string → fail',
    card: { name: '', desc: 'Empty name' },
    expected: 'fail',
  },
  {
    id: 'struct-name',
    name: 'name extremely short (1 char) → warn',
    card: { name: 'A', desc: 'Single char name' },
    expected: 'warn',
  },
  {
    id: 'struct-name',
    name: 'name very long (>80 chars) → warn',
    card: { name: 'A'.repeat(81), desc: 'Very long name' },
    expected: 'warn',
  },

  // ── struct-desc ──────────────────────────────────────────────────────────
  {
    id: 'struct-desc',
    name: 'valid desc → pass',
    card: { name: 'Test', desc: 'A meaningful description of the feature.' },
    expected: 'pass',
  },
  {
    id: 'struct-desc',
    name: 'desc missing → fail',
    card: { name: 'Test' },
    expected: 'fail',
  },
  {
    id: 'struct-desc',
    name: 'desc very short (<20 chars) → warn',
    card: { name: 'Test', desc: 'Too short.' },
    expected: 'warn',
  },
  {
    id: 'struct-desc',
    name: 'desc exactly 20 chars → pass',
    card: { name: 'Test', desc: 'Exactly twenty char!' },
    expected: 'pass',
  },

  // ── struct-desc-dot ──────────────────────────────────────────────────────
  {
    id: 'struct-desc-dot',
    name: 'desc uses · separator → pass',
    card: { name: 'Test', desc: 'Feature one · <strong>highlight</strong> · feature three' },
    expected: 'pass',
  },
  {
    id: 'struct-desc-dot',
    name: 'desc uses comma as separator → fail',
    card: { name: 'Test', desc: 'Feature one, feature two, feature three' },
    expected: 'fail',
  },
  {
    id: 'struct-desc-dot',
    name: 'desc uses Chinese comma → fail',
    card: { name: 'Test', desc: '功能一，功能二，功能三' },
    expected: 'fail',
  },
  {
    id: 'struct-desc-dot',
    name: 'desc has · but also suspicous comma → warn',
    card: { name: 'Test', desc: 'Feature one · feature two, and more' },
    expected: 'warn',
  },

  // ── struct-desc-strong ───────────────────────────────────────────────────
  {
    id: 'struct-desc-strong',
    name: 'desc has <strong> → pass',
    card: { name: 'Test', desc: 'Description with <strong>key takeaway</strong>.' },
    expected: 'pass',
  },
  {
    id: 'struct-desc-strong',
    name: 'desc has no <strong> → fail',
    card: { name: 'Test', desc: 'Description without any strong tag.' },
    expected: 'fail',
  },
  {
    id: 'struct-desc-strong',
    name: 'desc has empty <strong> → warn',
    card: { name: 'Test', desc: 'Description with <strong></strong> empty.' },
    expected: 'warn',
  },

  // ── struct-tags ──────────────────────────────────────────────────────────
  {
    id: 'struct-tags',
    name: '2-4 tags → pass',
    card: { name: 'Test', desc: '...', tags: [
      { text: 'Python', modifier: 'info' },
      { text: '1.2k sites', modifier: 'cyan' },
    ]},
    expected: 'pass',
  },
  {
    id: 'struct-tags',
    name: 'tags missing → fail',
    card: { name: 'Test', desc: '...' },
    expected: 'fail',
  },
  {
    id: 'struct-tags',
    name: 'only 1 tag → warn',
    card: { name: 'Test', desc: '...', tags: [
      { text: 'Python', modifier: 'info' },
    ]},
    expected: 'warn',
  },
  {
    id: 'struct-tags',
    name: '5+ tags → warn',
    card: { name: 'Test', desc: '...', tags: [
      { text: 'A', modifier: 'info' },
      { text: 'B', modifier: 'info' },
      { text: 'C', modifier: 'info' },
      { text: 'D', modifier: 'info' },
      { text: 'E', modifier: 'info' },
    ]},
    expected: 'warn',
  },

  // ── struct-tags-modifier ─────────────────────────────────────────────────
  {
    id: 'struct-tags-modifier',
    name: 'mixed modifiers → pass',
    card: { name: 'Test', desc: '...', tags: [
      { text: 'Score', modifier: 'warn' },
      { text: 'Count', modifier: 'cyan' },
      { text: 'Method', modifier: 'purple' },
    ]},
    expected: 'pass',
  },
  {
    id: 'struct-tags-modifier',
    name: 'tag missing modifier → fail',
    card: { name: 'Test', desc: '...', tags: [
      { text: 'Python' },
    ]},
    expected: 'fail',
  },
  {
    id: 'struct-tags-modifier',
    name: 'all tags use info modifier → warn',
    card: { name: 'Test', desc: '...', tags: [
      { text: 'Python', modifier: 'info' },
      { text: 'Streamlit', modifier: 'info' },
      { text: 'Web', modifier: 'info' },
    ]},
    expected: 'warn',
  },
  {
    id: 'struct-tags-modifier',
    name: 'all info but only 2 neutral tech tags → pass (exception)',
    card: { name: 'Test', desc: '...', tags: [
      { text: 'Python', modifier: 'info' },
      { text: 'Streamlit', modifier: 'info' },
    ]},
    expected: 'pass',
  },

  // ── struct-badge ─────────────────────────────────────────────────────────
  {
    id: 'struct-badge',
    name: 'no badge → pass (not required)',
    card: { name: 'Test', desc: '...' },
    expected: 'pass',
  },
  {
    id: 'struct-badge',
    name: 'uppercase badge → pass',
    card: { name: 'Test', desc: '...', badge: 'Core' },
    expected: 'pass',
  },
  {
    id: 'struct-badge',
    name: 'lowercase badge → fail',
    card: { name: 'Test', desc: '...', badge: 'new' },
    expected: 'fail',
  },
  {
    id: 'struct-badge',
    name: 'multi-word badge with spaces → warn',
    card: { name: 'Test', desc: '...', badge: 'New Feature' },
    expected: 'warn',
  },
  {
    id: 'struct-badge',
    name: 'badge too long (>30 chars) → fail',
    card: { name: 'Test', desc: '...', badge: 'ThisIsAVeryLongBadgeThatExceedsTheLimit' },
    expected: 'fail',
  },

  // ── struct-meta ──────────────────────────────────────────────────────────
  {
    id: 'struct-meta',
    name: 'meta present on Report card → pass',
    card: { name: 'Code Health', desc: '...', badge: 'Report', meta: 'Assessment date 2026-06-29' },
    expected: 'pass',
  },
  {
    id: 'struct-meta',
    name: 'no badge → meta not required → pass',
    card: { name: 'Test', desc: '...' },
    expected: 'pass',
  },
  {
    id: 'struct-meta',
    name: 'Report badge but missing meta → fail',
    card: { name: 'Code Health', desc: '...', badge: 'Report' },
    expected: 'fail',
  },
  {
    id: 'struct-meta',
    name: 'Rich-tier signals but no meta → warn',
    card: { name: 'Feature', desc: 'Quantified 3 metrics · <strong>key result</strong>', tags: [
      { text: '58/100', modifier: 'warn' },
      { text: '7 dims', modifier: 'cyan' },
      { text: 'ATAM', modifier: 'purple' },
    ], nameHref: 'views/report/' },
    expected: 'warn',
  },
];
