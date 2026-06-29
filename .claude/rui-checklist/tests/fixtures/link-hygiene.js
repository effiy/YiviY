/**
 * Link Hygiene Test Fixtures
 * Covers: link-intentional, link-grid, link-namehref
 */

export const linkHygiene = [
  // ── link-intentional ──────────────────────────────────────────────────────
  {
    id: 'link-intentional',
    name: 'links: null (use defaults) → pass',
    card: { name: 'Test', desc: '...', links: null },
    expected: 'pass',
  },
  {
    id: 'link-intentional',
    name: 'links: [] (intentionally hidden) → pass',
    card: { name: 'Test', desc: '...', links: [] },
    expected: 'pass',
  },
  {
    id: 'link-intentional',
    name: 'links: custom array → pass',
    card: { name: 'Test', desc: '...', links: [{ label: 'GitHub', href: 'https://github.com' }] },
    expected: 'pass',
  },
  {
    id: 'link-intentional',
    name: 'links field missing → warn',
    card: { name: 'Test', desc: '...' },
    expected: 'warn',
  },
  {
    id: 'link-intentional',
    name: 'links is undefined → fail',
    card: { name: 'Test', desc: '...', links: undefined },
    expected: 'fail',
  },
  {
    id: 'link-intentional',
    name: 'links: [] on Rich-tier card → warn',
    card: { name: 'Report', desc: 'Detailed analysis · <strong>key findings</strong>', badge: 'Report', tags: [
      { text: '58/100', modifier: 'warn' }, { text: '7 dims', modifier: 'cyan' }, { text: 'ATAM', modifier: 'purple' }
    ], meta: 'date 2026-06', nameHref: 'views/report/', links: [] },
    expected: 'warn',
  },

  // ── link-grid ─────────────────────────────────────────────────────────────
  {
    id: 'link-grid',
    name: 'standalone card (<3 in group) with any links → pass',
    card: { name: 'Standalone', desc: '...', links: [
      { label: 'Checklist', href: '#' }, { label: 'Arch', href: '#' }
    ]},
    siblings: [{ name: 'Other' }],
    expected: 'pass',
  },
  {
    id: 'link-grid',
    name: 'grid card (3+ siblings) with empty links → pass',
    card: { name: 'Card A', desc: '...', links: [] },
    siblings: [{ name: 'Card B' }, { name: 'Card C' }, { name: 'Card D' }],
    expected: 'pass',
  },
  {
    id: 'link-grid',
    name: 'grid card with 7 default links → fail',
    card: { name: 'Card A', desc: '...', links: [
      { label: '清单', href: '#' }, { label: '架构', href: '#' },
      { label: '图谱', href: '#' }, { label: '测试', href: '#' },
      { label: '源码', href: '#' }, { label: '演示', href: '#' },
      { label: '审查', href: '#' },
    ]},
    siblings: [{ name: 'Card B' }, { name: 'Card C' }, { name: 'Card D' }],
    expected: 'fail',
  },
  {
    id: 'link-grid',
    name: 'grid card with 4+ custom links → warn',
    card: { name: 'Card A', desc: '...', links: [
      { label: 'A', href: '#' }, { label: 'B', href: '#' },
      { label: 'C', href: '#' }, { label: 'D', href: '#' },
      { label: 'E', href: '#' },
    ]},
    siblings: [{ name: 'Card B' }, { name: 'Card C' }, { name: 'Card D' }],
    expected: 'warn',
  },

  // ── link-namehref ─────────────────────────────────────────────────────────
  {
    id: 'link-namehref',
    name: 'no nameHref → pass',
    card: { name: 'Test', desc: '...' },
    expected: 'pass',
  },
  {
    id: 'link-namehref',
    name: 'internal path with empty nameTarget → pass',
    card: { name: 'Test', desc: '...', nameHref: 'views/report/', nameTarget: '' },
    expected: 'pass',
  },
  {
    id: 'link-namehref',
    name: 'internal path with _blank → fail',
    card: { name: 'Test', desc: '...', nameHref: 'views/report/', nameTarget: '_blank' },
    expected: 'fail',
  },
  {
    id: 'link-namehref',
    name: 'external URL with _blank → pass',
    card: { name: 'Test', desc: '...', nameHref: 'https://github.com', nameTarget: '_blank' },
    expected: 'pass',
  },
  {
    id: 'link-namehref',
    name: 'external URL with empty target → warn',
    card: { name: 'Test', desc: '...', nameHref: 'https://github.com', nameTarget: '' },
    expected: 'warn',
  },
];
