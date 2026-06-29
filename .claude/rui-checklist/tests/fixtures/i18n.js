/**
 * i18n Consistency Test Fixtures
 * Covers: i18n-structure, i18n-tag-count, i18n-badge-same
 *
 * These fixtures use a special format: instead of a single card, they provide
 * multi-language config objects. The check functions are run across languages.
 */

export const i18n = [
  // ── i18n-structure ────────────────────────────────────────────────────────
  {
    id: 'i18n-structure',
    name: 'identical structure across languages → pass',
    config: {
      en: { sectionTitle: 'Hello', items: [{ name: 'A', desc: 'Desc A' }] },
      'zh-CN': { sectionTitle: '你好', items: [{ name: 'A', desc: '描述 A' }] },
    },
    expected: 'pass',
  },
  {
    id: 'i18n-structure',
    name: 'different top-level keys → fail',
    config: {
      en: { sectionTitle: 'Hello', items: [{ name: 'A' }] },
      'zh-CN': { sectionTitle: '你好', cards: [{ name: 'A' }] },
    },
    expected: 'fail',
  },
  {
    id: 'i18n-structure',
    name: 'different array lengths → fail',
    config: {
      en: { items: [{ name: 'A' }, { name: 'B' }] },
      'zh-CN': { items: [{ name: 'A' }] },
    },
    expected: 'fail',
  },
  {
    id: 'i18n-structure',
    name: 'nested structure differs → warn',
    config: {
      en: { overview: { features: [{ name: 'A', meta: 'date' }] } },
      'zh-CN': { overview: { features: [{ name: 'A' }] } },
    },
    expected: 'warn',
  },

  // ── i18n-tag-count ────────────────────────────────────────────────────────
  {
    id: 'i18n-tag-count',
    name: 'same tag count across languages → pass',
    card: {
      name: { en: 'Feature', 'zh-CN': '功能' },
      tags: {
        en: [{ text: 'Python' }, { text: 'Fast' }, { text: 'AI' }],
        'zh-CN': [{ text: 'Python' }, { text: '快速' }, { text: 'AI' }],
      },
    },
    expected: 'pass',
  },
  {
    id: 'i18n-tag-count',
    name: 'different tag count → fail',
    card: {
      name: { en: 'Feature', 'zh-CN': '功能' },
      tags: {
        en: [{ text: 'Python' }, { text: 'Fast' }],
        'zh-CN': [{ text: 'Python' }, { text: '快速' }, { text: 'AI' }],
      },
    },
    expected: 'fail',
  },
  {
    id: 'i18n-tag-count',
    name: 'only one language has tags → fail',
    card: {
      name: { en: 'Feature', 'zh-CN': '功能' },
      tags: { en: [{ text: 'Python' }] },
    },
    expected: 'fail',
  },

  // ── i18n-badge-same ───────────────────────────────────────────────────────
  {
    id: 'i18n-badge-same',
    name: 'badge identical across languages → pass',
    card: {
      name: { en: 'Feature', 'zh-CN': '功能' },
      badge: { en: 'Core', 'zh-CN': 'Core' },
    },
    expected: 'pass',
  },
  {
    id: 'i18n-badge-same',
    name: 'no badge → pass',
    card: {
      name: { en: 'Feature', 'zh-CN': '功能' },
    },
    expected: 'pass',
  },
  {
    id: 'i18n-badge-same',
    name: 'badge translated across languages → fail',
    card: {
      name: { en: 'Feature', 'zh-CN': '功能' },
      badge: { en: 'Core', 'zh-CN': '核心' },
    },
    expected: 'fail',
  },
];
