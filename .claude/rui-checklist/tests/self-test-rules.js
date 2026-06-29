/**
 * rui-checklist 规则自测试 (Rule Self-Test)
 *
 * 对 references/check-rules.md 中每个检查规则运行自测试。
 * 使用 sample-cards.js 中的测试夹具验证每条规则产生正确的 status。
 *
 * 运行方式（在 Claude 对话中）：
 *   用户: "run checklist self-test"
 *   或直接读取本文件并执行其中的测试逻辑。
 *
 * 自测试覆盖：
 *   - structural:    7 checks × N cards
 *   - tag-quality:   4 checks × N cards
 *   - link-hygiene:  3 checks × N cards
 *   - standard:      3 checks × N cards
 *   - i18n:          3 checks (cross-language)
 *   - human:         3 checks (always pending verification)
 *
 * @see tests/fixtures/sample-cards.js
 * @see references/check-rules.md
 */

// ═══════════════════════════════════════════════════════
// 测试结果结构
// ═══════════════════════════════════════════════════════

/**
 * @typedef {Object} TestResult
 * @property {string} checkId      - 检查规则 ID
 * @property {string} cardName     - 卡片名称
 * @property {string} expected     - 预期状态
 * @property {string} actual       - 实际状态
 * @property {boolean} passed      - 是否通过
 * @property {string} [mismatch]   - 不匹配时的详情
 */

/**
 * @typedef {Object} TestSuite
 * @property {number} total        - 总测试数
 * @property {number} passed       - 通过数
 * @property {number} failed       - 失败数
 * @property {number} skipped      - 跳过数
 * @property {TestResult[]} results - 所有测试结果
 * @property {Object<string, number>} byCategory - 按类别统计
 */

// ═══════════════════════════════════════════════════════
// 检查规则实现
// ═══════════════════════════════════════════════════════

/**
 * struct-name: card 有非空 name
 */
function checkStructName(card) {
  if (!card.name || typeof card.name !== 'string' || card.name.trim().length === 0) {
    return { status: 'fail', evidence: 'name missing or empty' };
  }
  if (card.name.length === 1) {
    return { status: 'warn', evidence: `name is only 1 char: "${card.name}"` };
  }
  if (card.name.length > 80) {
    return { status: 'warn', evidence: `name is ${card.name.length} chars (max 80)` };
  }
  return { status: 'pass', evidence: `"${card.name.substring(0, 40)}"` };
}

/**
 * struct-desc: card 有非空 desc
 */
function checkStructDesc(card) {
  if (!card.desc || typeof card.desc !== 'string' || card.desc.trim().length === 0) {
    return { status: 'fail', evidence: 'desc missing or empty' };
  }
  if (card.desc.length < 20) {
    return { status: 'warn', evidence: `desc is only ${card.desc.length} chars — may lack detail` };
  }
  return { status: 'pass', evidence: `${card.desc.length} chars, starts with '${card.desc.substring(0, 30)}...'` };
}

/**
 * struct-desc-dot: desc 使用 · 分隔符（不是逗号）
 */
function checkStructDescDot(card) {
  if (!card.desc || card.desc.trim().length === 0) {
    return { status: 'fail', evidence: 'desc missing' };
  }
  const middleDotCount = (card.desc.match(/·/g) || []).length;
  // Check for comma separators outside HTML tags
  const stripped = card.desc.replace(/<[^>]+>/g, '');
  const commaSeparatorCount = (stripped.match(/[,，]、/g) || []).length;

  if (middleDotCount === 0) {
    if (commaSeparatorCount >= 1) {
      return { status: 'fail', evidence: `no · found; uses comma/、 as separator` };
    }
    return { status: 'fail', evidence: `no · separators found in desc` };
  }
  if (commaSeparatorCount > 0) {
    return { status: 'warn', evidence: `${middleDotCount} · found but also has comma/、separators` };
  }
  return { status: 'pass', evidence: `found ${middleDotCount} · separators, 0 comma-separators` };
}

/**
 * struct-desc-strong: desc 包含 <strong> 标签
 */
function checkStructDescStrong(card) {
  if (!card.desc || card.desc.trim().length === 0) {
    return { status: 'fail', evidence: 'desc missing' };
  }
  const strongMatches = card.desc.match(/<strong>(.*?)<\/strong>/g) || [];
  if (strongMatches.length === 0) {
    return { status: 'fail', evidence: 'no <strong> in desc' };
  }
  // Check for empty/trivially short strong content
  const hasEmpty = strongMatches.some(m => {
    const inner = m.replace(/<\/?strong>/g, '');
    return inner.trim().length < 3;
  });
  if (hasEmpty) {
    return { status: 'warn', evidence: `<strong> found but wraps short/empty text` };
  }
  return { status: 'pass', evidence: `${strongMatches.length} <strong> found: '${strongMatches[0].replace(/<\/?strong>/g, '')}'` };
}

/**
 * struct-tags: card 有 2-4 个 tags
 */
function checkStructTags(card) {
  if (!card.tags || !Array.isArray(card.tags)) {
    return { status: 'fail', evidence: 'tags is missing or not an array' };
  }
  if (card.tags.length === 0) {
    return { status: 'fail', evidence: 'tags array is empty' };
  }
  if (card.tags.length === 1) {
    return { status: 'warn', evidence: `only 1 tag — minimum is 2` };
  }
  if (card.tags.length >= 5) {
    return { status: 'warn', evidence: `${card.tags.length} tags — overkill (max 4 recommended)` };
  }
  return { status: 'pass', evidence: `${card.tags.length} tags: ${card.tags.map(t => t.text).join(', ')}` };
}

/**
 * struct-tags-modifier: 每个 tag 都有语义 modifier，不全部是 info
 */
function checkStructTagsModifier(card) {
  if (!card.tags || !Array.isArray(card.tags) || card.tags.length === 0) {
    return { status: 'fail', evidence: 'no tags to check modifiers' };
  }
  const validModifiers = ['info', 'accent', 'warn', 'red', 'purple', 'cyan', 'green', 'pass'];
  const missingModifier = card.tags.some(t => !t.modifier || !validModifiers.includes(t.modifier));
  if (missingModifier) {
    return { status: 'fail', evidence: 'some tags missing valid modifier' };
  }
  const allInfo = card.tags.every(t => t.modifier === 'info');
  if (allInfo && card.tags.length > 2) {
    return { status: 'warn', evidence: `all ${card.tags.length} tags use 'info' — consider semantic modifiers` };
  }
  return { status: 'pass', evidence: `${card.tags.length}/${card.tags.length} tags have modifiers: ${card.tags.map(t => t.modifier).join(', ')}` };
}

/**
 * struct-badge: badge 是大写开头的类型分类器（如有）
 */
function checkStructBadge(card) {
  if (!card.badge) {
    return { status: 'pass', evidence: 'no badge (acceptable)' };
  }
  if (typeof card.badge !== 'string') {
    return { status: 'fail', evidence: 'badge is not a string' };
  }
  if (card.badge.length > 30) {
    return { status: 'fail', evidence: `badge is ${card.badge.length} chars — not a classifier` };
  }
  if (card.badge[0] !== card.badge[0].toUpperCase()) {
    return { status: 'fail', evidence: `badge: '${card.badge}' starts lowercase` };
  }
  if (card.badge.includes(' ')) {
    return { status: 'warn', evidence: `badge: '${card.badge}' contains spaces — unusual for badge` };
  }
  return { status: 'pass', evidence: `badge: '${card.badge}' (valid)` };
}

/**
 * struct-meta: Rich 层卡片应有 meta 溯源信息
 */
function checkStructMeta(card, tier) {
  if (card.meta && typeof card.meta === 'string' && card.meta.trim().length > 0) {
    return { status: 'pass', evidence: `meta: '${card.meta.substring(0, 40)}...'` };
  }
  // Nav tier: meta is always optional
  if (tier === 'Nav') {
    return { status: 'pass', evidence: 'Nav tier — meta optional' };
  }
  if (card.badge === 'Report' || tier === 'Rich') {
    return { status: 'fail', evidence: 'Rich tier card (badge: Report) missing meta' };
  }
  // Check Rich-tier signals for Standard cards
  const richSignals = (card.tags && card.tags.length >= 3) || card.nameHref;
  if (richSignals && !card.meta) {
    return { status: 'warn', evidence: 'Rich-tier signals present but no meta — might benefit from provenance' };
  }
  return { status: 'pass', evidence: 'Standard tier — meta optional' };
}

/**
 * tag-semantic: modifier 与 tag 文本语义匹配
 */
function checkTagSemantic(card) {
  if (!card.tags || card.tags.length === 0) {
    return { status: 'fail', evidence: 'no tags to check semantics' };
  }

  const scorePattern = /\d+\s*\/\s*\d+|\d+%$/;
  const countPattern = /^\d+\s+\w+/;
  const riskPattern = /\d+\s*(critical|bug|issue|risk|finding|vuln|error)s?\b|^(critical|bug|issue|risk)$/i;
  const isAllCapsAcronym = (text) => /^[A-Z]{2,}$/.test(text);  // case-sensitive: only all-caps like ATAM, TDD
  const isMethodWord = /driven|based|methodology|framework|pattern/i;

  let mismatchCount = 0;
  const details = [];

  for (const tag of card.tags) {
    const text = tag.text || '';
    const mod = tag.modifier || 'info';

    let expectedMod = null;
    // Priority: risk > score > count > method > neutral
    if (riskPattern.test(text)) {
      expectedMod = ['red', 'warn'];
    } else if (scorePattern.test(text)) {
      expectedMod = ['warn', 'green', 'red'];
    } else if (countPattern.test(text)) {
      expectedMod = ['cyan', 'info'];
    } else if (isAllCapsAcronym(text) || isMethodWord.test(text)) {
      expectedMod = ['purple'];
    } else {
      expectedMod = ['info', 'accent', 'green'];
    }

    if (expectedMod && !expectedMod.includes(mod)) {
      mismatchCount++;
      details.push(`'${text}' uses ${mod} but suggests ${expectedMod.join('/')}`);
    }
  }

  const matchRatio = (card.tags.length - mismatchCount) / card.tags.length;
  if (matchRatio < 0.5) {
    return { status: 'fail', evidence: `${mismatchCount}/${card.tags.length} modifiers mismatch semantics` };
  }
  if (mismatchCount > 0) {
    return { status: 'warn', evidence: details.join('; ') };
  }
  return { status: 'pass', evidence: 'all modifiers match semantics' };
}

/**
 * tag-self-describing: 标签是自描述的，不是指令式的
 */
function checkTagSelfDescribing(card) {
  if (!card.tags || card.tags.length === 0) {
    return { status: 'fail', evidence: 'no tags to check' };
  }

  const instructionalPatterns = [
    /\bview\b/i, /\bclick\b/i, /\blearn\b/i, /\bread\b/i,
    /\bsee\b/i, /\bgo to\b/i, /\bcheck\b/i, /\bexplore\b/i,
    /\bdiscover\b/i, /\bfind out\b/i, /\bdownload\b/i,
    /\binstall\b/i, /\btry\b/i, /\bget started\b/i,
    /查看/, /点击/, /了解更多/, /阅读/, /详情/, /进入/,
  ];

  const badTags = [];
  for (const tag of card.tags) {
    const text = tag.text || '';
    for (const pattern of instructionalPatterns) {
      if (pattern.test(text)) {
        badTags.push(`'${text}' is instructional`);
        break;
      }
    }
  }

  if (badTags.length > 0) {
    return { status: 'fail', evidence: badTags.join('; ') };
  }
  return { status: 'pass', evidence: 'all tags are self-describing' };
}

/**
 * tag-concise: 标签文字 2-20 字符
 */
function checkTagConcise(card) {
  if (!card.tags || card.tags.length === 0) {
    return { status: 'fail', evidence: 'no tags to check' };
  }

  const tooShort = card.tags.filter(t => (t.text || '').length < 2);
  const tooLong = card.tags.filter(t => (t.text || '').length > 30);
  const borderline = card.tags.filter(t => {
    const len = (t.text || '').length;
    return len > 20 && len <= 30;
  });

  if (tooShort.length > 0) {
    return { status: 'fail', evidence: `tag '${tooShort[0].text}' is ${tooShort[0].text.length} char — too short` };
  }
  if (tooLong.length > 0) {
    return { status: 'fail', evidence: `tag '${tooLong[0].text}' is ${tooLong[0].text.length} chars — too long` };
  }
  if (borderline.length > 0) {
    return { status: 'warn', evidence: `tag '${borderline[0].text}' is ${borderline[0].text.length} chars — a bit long` };
  }
  const lengths = card.tags.map(t => (t.text || '').length).join(', ');
  return { status: 'pass', evidence: `tag lengths: ${lengths} — all within 2-20` };
}

/**
 * tag-fingerprint: 每张卡片的 tag 组合唯一
 */
function checkTagFingerprint(card, allCards, cardIndex) {
  if (!card.tags || card.tags.length === 0) {
    return { status: 'fail', evidence: 'no tags to fingerprint' };
  }

  const cardTagSet = [...card.tags.map(t => t.text)].sort().join('||');

  for (let i = 0; i < allCards.length; i++) {
    if (i === cardIndex) continue;
    const other = allCards[i];
    if (!other.tags || other.tags.length === 0) continue;
    const otherTagSet = [...other.tags.map(t => t.text)].sort().join('||');
    if (cardTagSet === otherTagSet) {
      return { status: 'fail', evidence: `tag set duplicates card '${other.name || 'unnamed'}' at index ${i}` };
    }
  }

  return { status: 'pass', evidence: 'unique tag set' };
}

/**
 * link-intentional: links 配置有意图
 */
function checkLinkIntentional(card) {
  if (card.links === undefined) {
    return { status: 'warn', evidence: 'links field is undefined — should be null, [], or [...]' };
  }
  if (card.links === null) {
    return { status: 'pass', evidence: 'links: null (using defaults)' };
  }
  if (Array.isArray(card.links) && card.links.length === 0) {
    // Warn if Rich-tier card with empty links
    if (card.badge === 'Report' || (card.tags && card.tags.length >= 3)) {
      return { status: 'warn', evidence: 'links: [] on Rich-tier card — consider adding navigation' };
    }
    return { status: 'pass', evidence: 'links: [] (hidden)' };
  }
  if (Array.isArray(card.links) && card.links.length > 0) {
    return { status: 'pass', evidence: `links: ${card.links.length} custom items` };
  }
  return { status: 'fail', evidence: `links is invalid type: ${typeof card.links}` };
}

/**
 * link-grid: Grid 卡片不应有全量默认 links
 */
function checkLinkGrid(card, gridContext) {
  if (!gridContext) {
    return { status: 'pass', evidence: 'not in grid context' };
  }
  if (!card.links || !Array.isArray(card.links) || card.links.length === 0) {
    return { status: 'pass', evidence: 'grid card, no custom links — clean' };
  }

  const defaultLinkLabels = ['清单', '架构', '图谱', '测试', '源码', '演示', '审查',
    'Checklist', 'Architecture', 'Graph', 'Test', 'Source', 'Demo', 'Review'];
  const cardLabels = card.links.map(l => l.label || '');
  const matchCount = cardLabels.filter(l => defaultLinkLabels.includes(l)).length;

  if (matchCount >= 6 && card.links.length >= 6) {
    return { status: 'fail', evidence: `grid card with ${card.links.length} default links — should use links: null instead` };
  }
  if (card.links.length >= 4) {
    return { status: 'warn', evidence: `grid card with ${card.links.length} custom links — consider if all needed` };
  }
  return { status: 'pass', evidence: 'grid card links ok' };
}

/**
 * link-namehref: nameHref 与 nameTarget 配对正确
 */
function checkLinkNamehref(card) {
  if (!card.nameHref) {
    return { status: 'pass', evidence: 'no nameHref' };
  }
  const isExternal = /^https?:\/\//i.test(card.nameHref);
  const isInternal = /^(views|components|#|\.\/|\.\.\/)/i.test(card.nameHref);

  if (isInternal && card.nameTarget !== '') {
    return { status: 'fail', evidence: `nameHref is internal (${card.nameHref}) but nameTarget is not '' — external behavior on internal page` };
  }
  if (isExternal && card.nameTarget === '') {
    return { status: 'warn', evidence: `nameHref is external (${card.nameHref}) but nameTarget is '' — opens external site in same window` };
  }
  const target = card.nameTarget || '(unset)';
  return { status: 'pass', evidence: `nameHref: '${card.nameHref}', nameTarget: '${target}' — correct` };
}

/**
 * std-numbers: desc 包含具体数字
 */
function checkStdNumbers(card) {
  if (!card.desc || card.desc.trim().length === 0) {
    return { status: 'fail', evidence: 'desc missing — no digits' };
  }
  const digitCount = (card.desc.match(/\d/g) || []).length;
  if (digitCount === 0) {
    return { status: 'fail', evidence: 'no digits in desc — vague language' };
  }
  return { status: 'pass', evidence: `found ${digitCount} digits in desc` };
}

/**
 * std-badge-case: badge 大写开头
 */
function checkStdBadgeCase(card) {
  if (!card.badge) {
    return { status: 'pass', evidence: 'no badge' };
  }
  if (card.badge[0] === card.badge[0].toUpperCase()) {
    return { status: 'pass', evidence: `badge: '${card.badge}' — correct case` };
  }
  return { status: 'fail', evidence: `badge: '${card.badge}' — should be '${card.badge[0].toUpperCase() + card.badge.slice(1)}'` };
}

/**
 * std-card-distinct: 每张卡片至少有一个字段与其他卡片不同
 */
function checkStdCardDistinct(card, allCards, cardIndex) {
  for (let i = 0; i < allCards.length; i++) {
    if (i === cardIndex) continue;
    const other = allCards[i];
    const sameName = card.name === other.name;
    const sameDescPrefix = (card.desc || '').substring(0, 60) === (other.desc || '').substring(0, 60);

    if (sameName && sameDescPrefix) {
      return { status: 'fail', evidence: `identical name and desc to card '${other.name || 'unnamed'}'` };
    }
    // Desc prefix match alone (possible copy-paste with name change)
    if (sameDescPrefix && (card.desc || '').length > 0) {
      return { status: 'warn', evidence: `desc first 60 chars matches card '${other.name || 'unnamed'}' (possible copy-paste)` };
    }
  }
  return { status: 'pass', evidence: 'distinct from all other cards' };
}

/**
 * i18n-structure: 多语言结构一致
 */
function checkI18nStructure(enCards, zhCards) {
  if (!enCards || !zhCards) {
    return { status: 'fail', evidence: 'missing language slice' };
  }
  if (enCards.length !== zhCards.length) {
    return { status: 'fail', evidence: `card count mismatch: en=${enCards.length}, zh-CN=${zhCards.length}` };
  }
  return { status: 'pass', evidence: 'en and zh-CN have identical structure' };
}

/**
 * i18n-tag-count: 每个卡片跨语言标签数一致
 */
function checkI18nTagCount(enCards, zhCards) {
  if (!enCards || !zhCards || enCards.length !== zhCards.length) {
    return { status: 'fail', evidence: 'card arrays differ in length' };
  }
  for (let i = 0; i < enCards.length; i++) {
    const enLen = (enCards[i].tags || []).length;
    const zhLen = (zhCards[i].tags || []).length;
    if (enLen !== zhLen) {
      return { status: 'fail', evidence: `${enCards[i].name || `card[${i}]`}: ${enLen} tags in en, ${zhLen} in zh-CN — mismatch` };
    }
  }
  return { status: 'pass', evidence: 'all cards have consistent tag counts across languages' };
}

/**
 * i18n-badge-same: badge 不翻译
 */
function checkI18nBadgeSame(enCards, zhCards) {
  if (!enCards || !zhCards) {
    return { status: 'fail', evidence: 'missing language slice' };
  }
  for (let i = 0; i < Math.min(enCards.length, zhCards.length); i++) {
    const enBadge = enCards[i].badge;
    const zhBadge = zhCards[i].badge;
    if (enBadge && zhBadge && enBadge !== zhBadge) {
      return { status: 'fail', evidence: `badge '${enBadge}' translated to '${zhBadge}' in zh-CN — should stay '${enBadge}'` };
    }
  }
  return { status: 'pass', evidence: 'all badges consistent across languages' };
}

// ═══════════════════════════════════════════════════════
// 测试运行器
// ═══════════════════════════════════════════════════════

/**
 * 对单张卡片运行所有检查
 */
function runCardChecks(card, allCards, cardIndex, gridContext, tier) {
  const results = {};

  // Structural (7)
  results['struct-name'] = checkStructName(card);
  results['struct-desc'] = checkStructDesc(card);
  results['struct-desc-dot'] = checkStructDescDot(card);
  results['struct-desc-strong'] = checkStructDescStrong(card);
  results['struct-tags'] = checkStructTags(card);
  results['struct-tags-modifier'] = checkStructTagsModifier(card);
  results['struct-badge'] = checkStructBadge(card);
  results['struct-meta'] = checkStructMeta(card, tier);

  // Tag Quality (4)
  results['tag-semantic'] = checkTagSemantic(card);
  results['tag-self-describing'] = checkTagSelfDescribing(card);
  results['tag-concise'] = checkTagConcise(card);
  results['tag-fingerprint'] = checkTagFingerprint(card, allCards, cardIndex);

  // Link Hygiene (3)
  results['link-intentional'] = checkLinkIntentional(card);
  results['link-grid'] = checkLinkGrid(card, gridContext);
  results['link-namehref'] = checkLinkNamehref(card);

  // Standard (3)
  results['std-numbers'] = checkStdNumbers(card);
  results['std-badge-case'] = checkStdBadgeCase(card);
  results['std-card-distinct'] = checkStdCardDistinct(card, allCards, cardIndex);

  return results;
}

/**
 * 运行完整测试套件
 */
function runSelfTest(fixtures) {
  /** @type {TestResult[]} */
  const allResults = [];
  const allCards = fixtures.cards.map(f => f.card);

  // 对每个卡片运行检查
  for (let i = 0; i < fixtures.cards.length; i++) {
    const fixture = fixtures.cards[i];
    const card = fixture.card;
    const expected = fixture.expected;
    const gridContext = fixture.gridContext || false;
    const tier = fixture.tier || 'Standard';

    const actualResults = runCardChecks(card, allCards, i, gridContext, tier);

    for (const [checkId, expectedStatus] of Object.entries(expected)) {
      const actual = actualResults[checkId];
      if (!actual) {
        allResults.push({
          checkId,
          cardName: card.name || `card[${i}]`,
          expected: expectedStatus,
          actual: 'MISSING',
          passed: false,
          mismatch: `check ${checkId} not implemented`,
        });
        continue;
      }
      const passed = actual.status === expectedStatus;
      allResults.push({
        checkId,
        cardName: card.name || `card[${i}]`,
        expected: expectedStatus,
        actual: actual.status,
        passed,
        evidence: actual.evidence,
        mismatch: passed ? undefined : `expected ${expectedStatus}, got ${actual.status}`,
      });
    }
  }

  // i18n 检查
  if (fixtures.i18n) {
    const enCards = fixtures.i18n.en.cards;
    const zhCards = fixtures.i18n['zh-CN'].cards;

    const i18nStruct = checkI18nStructure(enCards, zhCards);
    const i18nTags = checkI18nTagCount(enCards, zhCards);
    const i18nBadge = checkI18nBadgeSame(enCards, zhCards);

    for (const [checkId, result] of Object.entries({
      'i18n-structure': i18nStruct,
      'i18n-tag-count': i18nTags,
      'i18n-badge-same': i18nBadge,
    })) {
      const expectedStatus = fixtures.i18nExpected[checkId] || 'pass';
      allResults.push({
        checkId,
        cardName: 'i18n-cross-language',
        expected: expectedStatus,
        actual: result.status,
        passed: result.status === expectedStatus,
        evidence: result.evidence,
        mismatch: result.status !== expectedStatus ? `expected ${expectedStatus}, got ${result.status}` : undefined,
      });
    }
  }

  // 汇总
  const passed = allResults.filter(r => r.passed).length;
  const failed = allResults.filter(r => !r.passed).length;
  const byCategory = {};
  for (const r of allResults) {
    const cat = r.checkId.split('-')[0];
    if (!byCategory[cat]) byCategory[cat] = { total: 0, passed: 0, failed: 0 };
    byCategory[cat].total++;
    if (r.passed) byCategory[cat].passed++;
    else byCategory[cat].failed++;
  }

  return {
    total: allResults.length,
    passed,
    failed,
    skipped: 0,
    results: allResults,
    byCategory,
    failedTests: allResults.filter(r => !r.passed),
  };
}

/**
 * 格式化测试报告
 */
function formatTestReport(suite) {
  const lines = [];
  const passRate = suite.total > 0 ? Math.round((suite.passed / suite.total) * 100) : 0;

  lines.push('════════════════════════════════════════');
  lines.push('  rui-checklist 规则自测试报告');
  lines.push('════════════════════════════════════════');
  lines.push('');
  lines.push(`  总计: ${suite.total} tests`);
  lines.push(`  通过: ${suite.passed} ✅`);
  lines.push(`  失败: ${suite.failed} ❌`);
  lines.push(`  通过率: ${passRate}%`);
  lines.push('');

  if (suite.failed > 0) {
    lines.push('── 失败详情 ──');
    for (const r of suite.failedTests) {
      lines.push(`  ❌ [${r.checkId}] ${r.cardName}`);
      lines.push(`     expected: ${r.expected} → actual: ${r.actual}`);
      if (r.mismatch) lines.push(`     ${r.mismatch}`);
    }
    lines.push('');
  }

  lines.push('── 分类汇总 ──');
  for (const [cat, stats] of Object.entries(suite.byCategory)) {
    const icon = stats.failed === 0 ? '✅' : '❌';
    lines.push(`  ${icon} ${cat}: ${stats.passed}/${stats.total} passed`);
  }

  return lines.join('\n');
}

// ═══════════════════════════════════════════════════════
// 导出
// ═══════════════════════════════════════════════════════

export {
  // Check functions (可单独导入用于外部验证)
  checkStructName,
  checkStructDesc,
  checkStructDescDot,
  checkStructDescStrong,
  checkStructTags,
  checkStructTagsModifier,
  checkStructBadge,
  checkStructMeta,
  checkTagSemantic,
  checkTagSelfDescribing,
  checkTagConcise,
  checkTagFingerprint,
  checkLinkIntentional,
  checkLinkGrid,
  checkLinkNamehref,
  checkStdNumbers,
  checkStdBadgeCase,
  checkStdCardDistinct,
  checkI18nStructure,
  checkI18nTagCount,
  checkI18nBadgeSame,
  // Runner
  runCardChecks,
  runSelfTest,
  formatTestReport,
};
