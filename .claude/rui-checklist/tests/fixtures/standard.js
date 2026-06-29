/**
 * Standard Compliance Test Fixtures
 * Covers: std-numbers, std-badge-case, std-card-distinct
 */

export const standard = [
  // ── std-numbers ───────────────────────────────────────────────────────────
  {
    id: 'std-numbers',
    name: 'desc contains digits → pass',
    card: { name: 'Test', desc: 'YouTube video download · <strong>1,200+ sites</strong> supported' },
    expected: 'pass',
  },
  {
    id: 'std-numbers',
    name: 'desc contains percentage digit → pass',
    card: { name: 'Test', desc: 'Success rate of 95% with <strong>fast processing</strong>' },
    expected: 'pass',
  },
  {
    id: 'std-numbers',
    name: 'no digits in desc → fail',
    card: { name: 'Test', desc: 'Multiple features with various improvements and enhancements.' },
    expected: 'fail',
  },
  {
    id: 'std-numbers',
    name: 'desc contains only number in HTML tag → pass',
    card: { name: 'Test', desc: 'Supports <strong>3 engines</strong> for maximum flexibility.' },
    expected: 'pass',
  },

  // ── std-badge-case ────────────────────────────────────────────────────────
  {
    id: 'std-badge-case',
    name: 'no badge → pass (not required)',
    card: { name: 'Test', desc: '...' },
    expected: 'pass',
  },
  {
    id: 'std-badge-case',
    name: 'uppercase badge → pass',
    card: { name: 'Test', desc: '...', badge: 'Core' },
    expected: 'pass',
  },
  {
    id: 'std-badge-case',
    name: 'lowercase badge → fail',
    card: { name: 'Test', desc: '...', badge: 'new' },
    expected: 'fail',
  },
  {
    id: 'std-badge-case',
    name: 'acronym badge → pass',
    card: { name: 'Test', desc: '...', badge: 'OSS' },
    expected: 'pass',
  },

  // ── std-card-distinct ─────────────────────────────────────────────────────
  {
    id: 'std-card-distinct',
    name: 'card differs from siblings → pass',
    card: { name: 'Unique Name', desc: 'Unique description for this card.' },
    siblings: [
      { name: 'Other Card', desc: 'Completely different description here.' },
    ],
    expected: 'pass',
  },
  {
    id: 'std-card-distinct',
    name: 'card has same name and desc as sibling → fail',
    card: { name: 'Duplicate', desc: 'Same exact description as another card in the grid.' },
    siblings: [
      { name: 'Duplicate', desc: 'Same exact description as another card in the grid.' },
    ],
    expected: 'fail',
  },
  {
    id: 'std-card-distinct',
    name: 'card has same desc prefix as sibling → warn',
    card: { name: 'Card A', desc: 'This is a very similar description that starts the same way but ends differently.' },
    siblings: [
      { name: 'Card B', desc: 'This is a very similar description that starts the same way with minor changes.' },
    ],
    expected: 'warn',
  },
];
