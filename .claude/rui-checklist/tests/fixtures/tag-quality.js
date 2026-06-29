/**
 * Tag Quality Test Fixtures
 * Covers: tag-semantic, tag-self-describing, tag-concise, tag-fingerprint
 */

// Exported as named array; runner accesses via mod['tag-quality']
const tests = [
  // ── tag-semantic ────────────────────────────────────────────────────────
  {
    id: 'tag-semantic',
    name: 'modifiers match semantics → pass',
    card: { name: 'Test', desc: '...', tags: [
      { text: '58/100', modifier: 'warn' },
      { text: '7 dimensions', modifier: 'cyan' },
      { text: 'ATAM', modifier: 'purple' },
    ]},
    expected: 'pass',
  },
  {
    id: 'tag-semantic',
    name: 'score uses info instead of warn (50% → warn per spec)',
    card: { name: 'Test', desc: '...', tags: [
      { text: '58/100', modifier: 'info' },
      { text: '7 dimensions', modifier: 'cyan' },
    ]},
    expected: 'warn',
  },
  {
    id: 'tag-semantic',
    name: 'one tag has questionable modifier → pass (count+info and score+warn both correct)',
    card: { name: 'Test', desc: '...', tags: [
      { text: '95%', modifier: 'warn' },
      { text: '26 actions', modifier: 'info' },
    ]},
    expected: 'pass',
  },
  {
    id: 'tag-semantic',
    name: 'count uses cyan → pass',
    card: { name: 'Test', desc: '...', tags: [
      { text: '26 actions', modifier: 'cyan' },
      { text: '10 items', modifier: 'cyan' },
    ]},
    expected: 'pass',
  },

  // ── tag-self-describing ─────────────────────────────────────────────────
  {
    id: 'tag-self-describing',
    name: 'all tags self-describing → pass',
    card: { name: 'Test', desc: '...', tags: [
      { text: 'Python', modifier: 'info' },
      { text: 'AI-driven', modifier: 'purple' },
      { text: '1.2k sites', modifier: 'cyan' },
    ]},
    expected: 'pass',
  },
  {
    id: 'tag-self-describing',
    name: 'instructional tag → fail',
    card: { name: 'Test', desc: '...', tags: [
      { text: 'View details', modifier: 'info' },
      { text: 'Python', modifier: 'info' },
    ]},
    expected: 'fail',
  },
  {
    id: 'tag-self-describing',
    name: 'Chinese instructional tag → fail',
    card: { name: 'Test', desc: '...', tags: [
      { text: '点击查看', modifier: 'info' },
    ]},
    expected: 'fail',
  },
  {
    id: 'tag-self-describing',
    name: 'ambiguous tag → warn',
    card: { name: 'Test', desc: '...', tags: [
      { text: 'Explore', modifier: 'info' },
    ]},
    expected: 'warn',
  },

  // ── tag-concise ─────────────────────────────────────────────────────────
  {
    id: 'tag-concise',
    name: 'tags within 2-20 chars → pass',
    card: { name: 'Test', desc: '...', tags: [
      { text: 'Python', modifier: 'info' },
      { text: 'AI-driven NLP', modifier: 'purple' },
    ]},
    expected: 'pass',
  },
  {
    id: 'tag-concise',
    name: 'tag <2 chars → fail',
    card: { name: 'Test', desc: '...', tags: [
      { text: 'P', modifier: 'info' },
    ]},
    expected: 'fail',
  },
  {
    id: 'tag-concise',
    name: 'tag >30 chars → fail',
    card: { name: 'Test', desc: '...', tags: [
      { text: 'This is a very long tag that exceeds the limit', modifier: 'info' },
    ]},
    expected: 'fail',
  },
  {
    id: 'tag-concise',
    name: 'tag 21-30 chars → warn',
    card: { name: 'Test', desc: '...', tags: [
      { text: 'Twenty-five character tag', modifier: 'info' },
    ]},
    expected: 'warn',
  },

  // ── tag-fingerprint ─────────────────────────────────────────────────────
  // NOTE: tag-fingerprint compares across cards. These fixtures are used with
  // a helper that provides the sibling card context.
  {
    id: 'tag-fingerprint',
    name: 'unique tag set → pass',
    card: { name: 'Card A', desc: '...', tags: [
      { text: 'Python', modifier: 'info' },
      { text: 'Fast', modifier: 'accent' },
    ]},
    siblings: [
      { name: 'Card B', tags: [{ text: 'Rust', modifier: 'info' }, { text: 'Faster', modifier: 'accent' }] },
    ],
    expected: 'pass',
  },
  {
    id: 'tag-fingerprint',
    name: 'duplicate tag set → fail',
    card: { name: 'Card A', desc: '...', tags: [
      { text: 'Python', modifier: 'info' },
      { text: 'Fast', modifier: 'accent' },
    ]},
    siblings: [
      { name: 'Card B', tags: [{ text: 'Python', modifier: 'info' }, { text: 'Fast', modifier: 'accent' }] },
    ],
    expected: 'fail',
  },
];

export const tagQuality = tests;
