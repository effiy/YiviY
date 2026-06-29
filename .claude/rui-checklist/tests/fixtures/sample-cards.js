/**
 * rui-checklist 自测试夹具 (Self-Test Fixtures)
 *
 * 覆盖所有检查规则的正/反/边 cases。每个卡片标注预期检查结果。
 *
 * 使用方法：将 cards 数组喂给 check-rules 的每个规则，验证输出 status 与 expected 一致。
 *
 * @see references/check-rules.md
 */

export const TEST_FIXTURES = {
  /** 场景元信息 */
  scene: {
    name: 'self-test-fixture',
    language: 'en',
    description: 'Exhaustive test fixture covering all 23 check rules across 5 categories',
  },

  /**
   * 卡片列表。
   * 每个卡片包含：
   *   - card: 原始卡片数据
   *   - tier: Rich | Standard | Nav
   *   - expected: { [checkId]: 'pass' | 'fail' | 'warn' | 'pending' }
   */
  cards: [
    // ── 1. 完美 Rich 卡片 (所有检查 pass) ──
    {
      card: {
        name: '📊 Code Health Report',
        desc: '7-dimension static analysis · quantitative scoring · <strong>26 improvements</strong> identified · 56h governance roadmap',
        tags: [
          { text: '58 / 100', modifier: 'warn' },
          { text: '7 dimensions', modifier: 'cyan' },
          { text: '26 actions', modifier: 'cyan' },
        ],
        badge: 'Report',
        meta: 'Assessment date 2026-06-28 · Technical Due Diligence',
        nameHref: 'views/health-report/index.html',
        nameTarget: '',
        links: null,
      },
      tier: 'Rich',
      expected: {
        'struct-name': 'pass',
        'struct-desc': 'pass',
        'struct-desc-dot': 'pass',
        'struct-desc-strong': 'pass',
        'struct-tags': 'pass',
        'struct-tags-modifier': 'pass',
        'struct-badge': 'pass',
        'struct-meta': 'pass',
        'tag-semantic': 'pass',
        'tag-self-describing': 'pass',
        'tag-concise': 'pass',
        'tag-fingerprint': 'pass',
        'link-intentional': 'pass',
        'link-grid': 'pass',
        'link-namehref': 'pass',
        'std-numbers': 'pass',
        'std-badge-case': 'pass',
        'std-card-distinct': 'pass',
      },
    },

    // ── 2. 结构性缺失卡片 ──
    {
      card: {
        // name 缺失 → struct-name: fail
        desc: '', // 空 desc → struct-desc: fail
        tags: [], // 空 tags → struct-tags: fail
        badge: 'report', // 小写 badge → struct-badge: fail, std-badge-case: fail
      },
      tier: 'Standard',
      expected: {
        'struct-name': 'fail',
        'struct-desc': 'fail',
        'struct-desc-dot': 'fail',
        'struct-desc-strong': 'fail',
        'struct-tags': 'fail',
        'struct-tags-modifier': 'fail',
        'struct-badge': 'fail',
        'struct-meta': 'pass', // Standard tier, no badge:Report, no Rich signals → pass
        'tag-semantic': 'fail', // no tags → fail
        'tag-self-describing': 'fail',
        'tag-concise': 'fail',
        'tag-fingerprint': 'fail', // empty tags → can't be unique
        'link-intentional': 'warn', // links undefined → warn
        'link-grid': 'pass', // no grid context
        'link-namehref': 'pass', // no nameHref
        'std-numbers': 'fail', // no desc → no digits
        'std-badge-case': 'fail', // lowercase badge
        'std-card-distinct': 'pass', // distinct: undefined name ≠ any other name
      },
    },

    // ── 3. 标签质量问题卡片 ──
    {
      card: {
        name: '🎬 Demo Viewer',
        desc: 'View video demos and interactive examples · <strong>12 demos</strong> available',
        tags: [
          { text: 'View details', modifier: 'info' }, // 指令式 → tag-self-describing: fail
          { text: 'click here to learn more about this amazing tool', modifier: 'info' }, // 过长 → tag-concise: fail (37 chars)
          { text: 'X', modifier: 'info' }, // 过短 → tag-concise: fail (1 char)
          { text: 'Video', modifier: 'info' },
          { text: 'Demo', modifier: 'info' }, // 5个 tag → struct-tags: warn
        ],
        badge: 'Demo',
        desc: 'View video demos and interactive examples, <strong>12 demos</strong> available', // 用逗号 · struct-desc-dot: fail
      },
      tier: 'Standard',
      expected: {
        'struct-name': 'pass',
        'struct-desc': 'pass',
        'struct-desc-dot': 'fail', // uses comma not ·
        'struct-desc-strong': 'pass',
        'struct-tags': 'warn', // 5 tags → warn
        'struct-tags-modifier': 'warn', // all info → warn
        'struct-badge': 'pass',
        'struct-meta': 'warn', // 5 tags → Rich signals but no meta
        'tag-semantic': 'pass', // all info; neutral tags → match (all-info caught by struct-tags-modifier)
        'tag-self-describing': 'fail', // 'View details' + 'click here...'
        'tag-concise': 'fail', // 'X' too short, 'click here...' too long
        'tag-fingerprint': 'pass',
        'link-intentional': 'warn',
        'link-grid': 'pass',
        'link-namehref': 'pass',
        'std-numbers': 'pass', // '12' found
        'std-badge-case': 'pass',
        'std-card-distinct': 'pass',
      },
    },

    // ── 4. Link 问题卡片 ──
    {
      card: {
        name: '🔗 Link Test',
        desc: 'Testing link hygiene rules · <strong>3 scenarios</strong> covered',
        tags: [
          { text: 'Testing', modifier: 'info' },
          { text: 'Links', modifier: 'accent' },
        ],
        badge: 'Test',
        nameHref: 'https://external-site.com/docs', // external URL
        nameTarget: '', // external but target is '' → link-namehref: warn
        links: undefined, // undefined (not null/[]/[...]) → link-intentional: fail
      },
      tier: 'Standard',
      expected: {
        'struct-name': 'pass',
        'struct-desc': 'pass',
        'struct-desc-dot': 'pass',
        'struct-desc-strong': 'pass',
        'struct-tags': 'pass',
        'struct-tags-modifier': 'pass',
        'struct-badge': 'pass',
        'struct-meta': 'warn', // nameHref present → Rich signal, no meta
        'tag-semantic': 'pass', // 'Testing'→info, 'Links'→accent — neutral, matches
        'tag-self-describing': 'pass',
        'tag-concise': 'pass',
        'tag-fingerprint': 'fail', // tags duplicated by Link Test Clone
        'link-intentional': 'warn', // undefined — should be null/[]
        'link-grid': 'pass',
        'link-namehref': 'warn', // external with ''
        'std-numbers': 'pass',
        'std-badge-case': 'pass',
        'std-card-distinct': 'warn', // desc prefix matches Link Test Clone
      },
    },

    // ── 5. tag-fingerprint 重复卡片 ──
    {
      card: {
        name: '🔗 Link Test Clone', // same name, will test distinct
        desc: 'Testing link hygiene rules · <strong>3 scenarios</strong> covered', // same desc as #4
        tags: [
          { text: 'Testing', modifier: 'info' },
          { text: 'Links', modifier: 'accent' },
        ], // identical tags to #4 → tag-fingerprint: fail
        badge: 'Test',
      },
      tier: 'Standard',
      expected: {
        'struct-name': 'pass',
        'struct-desc': 'pass',
        'struct-desc-dot': 'pass',
        'struct-desc-strong': 'pass',
        'struct-tags': 'pass',
        'struct-tags-modifier': 'pass',
        'struct-badge': 'pass',
        'struct-meta': 'pass',
        'tag-semantic': 'pass',
        'tag-self-describing': 'pass',
        'tag-concise': 'pass',
        'tag-fingerprint': 'fail', // duplicates card #4
        'link-intentional': 'warn',
        'link-grid': 'pass',
        'link-namehref': 'pass',
        'std-numbers': 'pass',
        'std-badge-case': 'pass',
        'std-card-distinct': 'warn', // desc matches #4 first 60 chars
      },
    },

    // ── 6. desc 使用逗号分隔（中文逗号） ──
    {
      card: {
        name: '🎯 Comma Test',
        desc: '支持批量下载，自动重命名，断点续传，<strong>1200+</strong> 站点', // Chinese comma
        tags: [
          { text: 'Batch', modifier: 'accent' },
          { text: 'Resume', modifier: 'green' },
        ],
      },
      tier: 'Standard',
      expected: {
        'struct-name': 'pass',
        'struct-desc': 'pass',
        'struct-desc-dot': 'fail', // uses Chinese comma ，not ·
        'struct-desc-strong': 'pass',
        'struct-tags': 'pass',
        'struct-tags-modifier': 'pass',
        'struct-badge': 'pass',
        'struct-meta': 'pass',
        'tag-semantic': 'pass', // 'Batch'→accent, 'Resume'→green — neutral, matches
        'tag-self-describing': 'pass',
        'tag-concise': 'pass',
        'tag-fingerprint': 'pass',
        'link-intentional': 'warn',
        'link-grid': 'pass',
        'link-namehref': 'pass',
        'std-numbers': 'pass',
        'std-badge-case': 'pass',
        'std-card-distinct': 'pass',
      },
    },

    // ── 7. 无数字 desc 卡片 ──
    {
      card: {
        name: '📝 Vague Card',
        desc: 'This tool provides various features for users to accomplish many tasks efficiently',
        tags: [
          { text: 'General', modifier: 'info' },
          { text: 'Utility', modifier: 'info' },
        ],
      },
      tier: 'Standard',
      expected: {
        'struct-name': 'pass',
        'struct-desc': 'pass',
        'struct-desc-dot': 'fail', // no · separator
        'struct-desc-strong': 'fail', // no <strong>
        'struct-tags': 'pass',
        'struct-tags-modifier': 'pass', // only 2 tags both info, neutral — exception applies
        'struct-badge': 'pass', // no badge
        'struct-meta': 'pass',
        'tag-semantic': 'pass', // 'General'→info, 'Utility'→info — neutral, matches
        'tag-self-describing': 'pass',
        'tag-concise': 'pass',
        'tag-fingerprint': 'pass',
        'link-intentional': 'warn',
        'link-grid': 'pass',
        'link-namehref': 'pass',
        'std-numbers': 'fail', // no digits
        'std-badge-case': 'pass',
        'std-card-distinct': 'pass',
      },
    },

    // ── 8. Nav 层卡片 ──
    {
      card: {
        name: '🏠 Home',
        desc: 'Return to the main dashboard',
        nameHref: 'views/home/index.html',
        nameTarget: '',
      },
      tier: 'Nav',
      expected: {
        'struct-name': 'pass',
        'struct-desc': 'pass',
        'struct-desc-dot': 'fail', // no ·
        'struct-desc-strong': 'fail', // no <strong>
        'struct-tags': 'fail', // no tags
        'struct-tags-modifier': 'fail',
        'struct-badge': 'pass',
        'struct-meta': 'pass',
        // Nav cards only get limited checks — we expect 'skip' for most
        // The tier detection will limit which checks apply
      },
    },

    // ── 9. Rich 卡片缺 meta ──
    {
      card: {
        name: '📋 Missing Meta Report',
        desc: 'Comprehensive analysis of code quality · <strong>42 findings</strong> across 8 modules · 120h remediation plan',
        tags: [
          { text: '72 / 100', modifier: 'warn' },
          { text: '8 modules', modifier: 'cyan' },
          { text: '42 findings', modifier: 'red' },
        ],
        badge: 'Report', // Rich tier marker
        // meta is missing → struct-meta: fail
        nameHref: 'views/analysis/index.html',
        nameTarget: '',
        links: [],
      },
      tier: 'Rich',
      expected: {
        'struct-name': 'pass',
        'struct-desc': 'pass',
        'struct-desc-dot': 'pass',
        'struct-desc-strong': 'pass',
        'struct-tags': 'pass',
        'struct-tags-modifier': 'pass',
        'struct-badge': 'pass',
        'struct-meta': 'fail', // Rich tier with badge:Report but no meta
        'tag-semantic': 'pass', // score→warn, count→cyan, risk(42 findings)→red — all match
        'tag-self-describing': 'pass',
        'tag-concise': 'pass',
        'tag-fingerprint': 'pass',
        'link-intentional': 'warn', // [] on Rich-tier → consider adding nav
        'link-grid': 'pass',
        'link-namehref': 'pass',
        'std-numbers': 'pass',
        'std-badge-case': 'pass',
        'std-card-distinct': 'pass',
      },
    },

    // ── 10. Grid 卡片有全量默认 links ──
    {
      card: {
        name: '🔧 Grid Feature',
        desc: 'Feature in a grid layout · <strong>10 features</strong> in this section',
        tags: [
          { text: 'Feature', modifier: 'accent' },
          { text: 'Grid', modifier: 'info' },
        ],
        badge: 'Feature',
        links: [
          { label: '清单', href: 'checklist/' },
          { label: '架构', href: 'architecture/' },
          { label: '图谱', href: 'graph/' },
          { label: '测试', href: 'test/' },
          { label: '源码', href: 'source/' },
          { label: '演示', href: 'demo/' },
          { label: '审查', href: 'review/' },
        ],
      },
      tier: 'Standard',
      gridContext: true, // flag: this card is in a grid of 3+ cards
      expected: {
        'struct-name': 'pass',
        'struct-desc': 'pass',
        'struct-desc-dot': 'pass',
        'struct-desc-strong': 'pass',
        'struct-tags': 'pass',
        'struct-tags-modifier': 'pass',
        'struct-badge': 'pass',
        'struct-meta': 'pass',
        'tag-semantic': 'pass', // 'Feature'→accent, 'Grid'→info — neutral, matches
        'tag-self-describing': 'pass',
        'tag-concise': 'pass',
        'tag-fingerprint': 'pass',
        'link-intentional': 'pass',
        'link-grid': 'fail', // grid card with 7 default links
        'link-namehref': 'pass',
        'std-numbers': 'pass',
        'std-badge-case': 'pass',
        'std-card-distinct': 'pass',
      },
    },
  ],

  /**
   * i18n 多语言夹具 — 单独提供，因为需要跨语言比较
   */
  i18n: {
    en: {
      cards: [
        {
          name: '🌐 i18n Card',
          desc: 'Multi-language test · <strong>3 languages</strong> supported',
          tags: [
            { text: 'i18n', modifier: 'accent' },
            { text: '3 langs', modifier: 'cyan' },
            { text: 'RTL', modifier: 'info' },
          ],
          badge: 'Core',
        },
      ],
    },
    'zh-CN': {
      cards: [
        {
          name: '🌐 国际化卡片',
          desc: '多语言测试 · <strong>3种语言</strong> 支持',
          tags: [
            { text: '国际化', modifier: 'accent' },
            { text: '3种语言', modifier: 'cyan' },
            { text: '双向', modifier: 'info' },
            { text: '额外标签', modifier: 'green' }, // 4 tags vs 3 in en → i18n-tag-count: fail
          ],
          badge: '核心', // translated badge → i18n-badge-same: fail
        },
      ],
    },
  },

  /** i18n expected results */
  i18nExpected: {
    'i18n-structure': 'pass', // same keys
    'i18n-tag-count': 'fail', // 3 vs 4 tags
    'i18n-badge-same': 'fail', // 'Core' vs '核心'
  },
};
