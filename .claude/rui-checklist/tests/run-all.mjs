#!/usr/bin/env node
/**
 * rui-checklist Self-Test Runner
 * Executes all check rule fixtures and reports pass/fail/warn results.
 *
 * Usage:
 *   node .claude/rui-checklist/tests/run-all.mjs
 *   node .claude/rui-checklist/tests/run-all.mjs --category=structural
 */

import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Check functions (mirrors the actual check logic) ────────────────────────

const CHECKS = {
  'struct-name': (card) => {
    if (!card.name || typeof card.name !== 'string' || card.name.length === 0) return 'fail';
    if (card.name.length === 1) return 'warn';
    if (card.name.length > 80) return 'warn';
    return 'pass';
  },

  'struct-desc': (card) => {
    if (!card.desc || typeof card.desc !== 'string' || card.desc.length === 0) return 'fail';
    if (card.desc.length < 20) return 'warn';
    return 'pass';
  },

  'struct-desc-dot': (card) => {
    if (!card.desc) return 'fail';
    const hasDot = card.desc.includes('·');
    if (!hasDot) return 'fail';
    // Check for suspicious comma usage outside tags
    const stripped = card.desc.replace(/<[^>]*>/g, '');
    const hasComma = /(?<!\d),(?!\d)/.test(stripped) || /，/.test(stripped);
    if (hasComma && hasDot) return 'warn';
    return 'pass';
  },

  'struct-desc-strong': (card) => {
    if (!card.desc) return 'fail';
    const strongMatch = card.desc.match(/<strong>(.*?)<\/strong>/);
    if (!strongMatch) return 'fail';
    if (strongMatch[1].length < 3) return 'warn';
    return 'pass';
  },

  'struct-tags': (card) => {
    if (!card.tags || !Array.isArray(card.tags)) return 'fail';
    if (card.tags.length === 0) return 'fail';
    if (card.tags.length === 1) return 'warn';
    if (card.tags.length >= 5) return 'warn';
    return 'pass';
  },

  'struct-tags-modifier': (card) => {
    if (!card.tags || !Array.isArray(card.tags)) return 'fail';
    const VALID = ['info', 'accent', 'warn', 'red', 'purple', 'cyan', 'green', 'pass'];
    const allHave = card.tags.every(t => t.modifier && VALID.includes(t.modifier));
    if (!allHave) return 'fail';
    // Check if all are 'info' — warn unless only 2 truly neutral tech tags
    const allInfo = card.tags.every(t => t.modifier === 'info');
    if (allInfo && card.tags.length === 2) {
      const isTech = card.tags.every(t => /^[A-Z]/.test(t.text) && t.text.length < 20);
      if (isTech) return 'pass';
    }
    if (allInfo) return 'warn';
    return 'pass';
  },

  'struct-badge': (card) => {
    if (!card.badge) return 'pass'; // not required
    if (typeof card.badge !== 'string') return 'fail';
    if (card.badge.length > 30) return 'fail';
    if (card.badge[0] !== card.badge[0].toUpperCase()) return 'fail';
    if (card.badge.includes(' ')) return 'warn';
    return 'pass';
  },

  'struct-meta': (card) => {
    if (card.badge === 'Report' && !card.meta) return 'fail';
    // Rich-tier signals without meta → warn
    const isRich = card.tags && card.tags.length >= 3 && card.nameHref;
    if (isRich && !card.meta && !card.badge) return 'warn';
    return 'pass';
  },

  'tag-semantic': (card) => {
    if (!card.tags || !Array.isArray(card.tags)) return 'fail';
    let mismatches = 0;
    let total = 0;
    for (const tag of card.tags) {
      const text = tag.text || '';
      const mod = tag.modifier || 'info';
      const isScore = /\d+\s*\/\s*\d+/.test(text) || /\d+%$/.test(text);
      const isCount = /^\d+\s+\w+/.test(text);
      const isMethod = /[A-Z]{2,}/.test(text) || /driven|based/i.test(text);
      if (isScore) {
        total++;
        if (!['warn', 'green', 'red'].includes(mod)) mismatches++;
      } else if (isCount) {
        total++;
        if (!['cyan', 'info'].includes(mod)) mismatches++;
      } else if (isMethod) {
        total++;
        if (mod !== 'purple') mismatches++;
      }
    }
    if (total === 0) return 'pass'; // no semantic signals to check
    if (mismatches > total / 2) return 'fail';
    if (mismatches > 0) return 'warn';
    return 'pass';
  },

  'tag-self-describing': (card) => {
    if (!card.tags || !Array.isArray(card.tags)) return 'fail';
    // English instructional: word-boundary works for Latin chars
    const EN_INSTRUCTIONAL = /\b(view|click|learn|read|see|go\s+to|check|explore|discover|find\s+out|download|install|try|get\s+started)\b/i;
    // Chinese instructional: no \b needed — match substring anywhere
    const ZH_INSTRUCTIONAL = /(查看|点击|了解更多|阅读|详情|进入)/;
    // Ambiguous (English only — Chinese instructional words are unambiguous)
    const AMBIGUOUS = /\b(explore|discover|find)\b/i;

    const hasEnglishInstr = card.tags.some(t => EN_INSTRUCTIONAL.test(t.text) && !AMBIGUOUS.test(t.text));
    const hasChineseInstr = card.tags.some(t => ZH_INSTRUCTIONAL.test(t.text));
    if (hasEnglishInstr || hasChineseInstr) return 'fail';

    const hasAmbiguous = card.tags.some(t => AMBIGUOUS.test(t.text));
    if (hasAmbiguous) return 'warn';
    return 'pass';
  },

  'tag-concise': (card) => {
    if (!card.tags || !Array.isArray(card.tags)) return 'fail';
    if (card.tags.some(t => (t.text || '').length < 2)) return 'fail';
    if (card.tags.some(t => (t.text || '').length > 30)) return 'fail';
    if (card.tags.some(t => (t.text || '').length > 20)) return 'warn';
    return 'pass';
  },

  'tag-fingerprint': (card, context) => {
    if (!card.tags) return 'fail';
    const siblings = context?.siblings || [];
    if (siblings.length === 0) return 'pass';
    const mySet = [...card.tags.map(t => t.text)].sort().join('|');
    const dupe = siblings.some(s => {
      if (!s.tags) return false;
      return [...s.tags.map(t => t.text)].sort().join('|') === mySet;
    });
    return dupe ? 'fail' : 'pass';
  },

  // ── link-hygiene ─────────────────────────────────────────────────────────
  'link-intentional': (card) => {
    // Key missing entirely → warn (not explicitly configured)
    if (!('links' in card)) return 'warn';
    // Key present but undefined → fail (was explicitly set wrong)
    if (card.links === undefined) return 'fail';
    if (card.links === null || Array.isArray(card.links)) {
      if (Array.isArray(card.links) && card.links.length === 0) {
        const isRich = card.badge === 'Report' || (card.tags && card.tags.length >= 3 && card.meta);
        return isRich ? 'warn' : 'pass';
      }
      return 'pass';
    }
    return 'fail';
  },

  'link-grid': (card, context) => {
    const siblings = context?.siblings || [];
    if (siblings.length < 2) return 'pass'; // not in a grid
    const links = card.links;
    if (!Array.isArray(links)) return 'pass';
    if (links.length === 0) return 'pass';
    const DEFAULT_LABELS = ['清单','架构','图谱','测试','源码','演示','审查',
      'Checklist','Architecture','Graph','Test','Source','Demo','Review'];
    const matchCount = links.filter(l => DEFAULT_LABELS.includes(l.label)).length;
    if (matchCount >= 7) return 'fail';
    if (links.length >= 4) return 'warn';
    return 'pass';
  },

  'link-namehref': (card) => {
    if (!card.nameHref) return 'pass';
    const isInternal = /^(views\/|components\/|#|\.\/|\.\.\/)/.test(card.nameHref);
    const isExternal = /^https?:\/\//.test(card.nameHref);
    const target = card.nameTarget;
    if (isInternal && target === '_blank') return 'fail';
    if (isExternal && (target === '' || target === undefined)) return 'warn';
    return 'pass';
  },

  // ── standard ─────────────────────────────────────────────────────────────
  'std-numbers': (card) => {
    if (!card.desc) return 'fail';
    return /\d/.test(card.desc) ? 'pass' : 'fail';
  },

  'std-badge-case': (card) => {
    if (!card.badge) return 'pass';
    return card.badge[0] === card.badge[0].toUpperCase() ? 'pass' : 'fail';
  },

  'std-card-distinct': (card, context) => {
    const siblings = context?.siblings || [];
    if (siblings.length === 0) return 'pass';
    const myDescPrefix = (card.desc || '').slice(0, 60);
    const myName = card.name;
    const identical = siblings.some(s => s.name === myName && (s.desc || '').slice(0, 60) === myDescPrefix);
    if (identical) return 'fail';
    const similarPrefix = siblings.some(s => s.name !== myName && (s.desc || '').slice(0, 40) === myDescPrefix.slice(0, 40));
    if (similarPrefix) return 'warn';
    return 'pass';
  },

  // ── i18n ─────────────────────────────────────────────────────────────────
  'i18n-structure': (card, context) => {
    const config = context?.config || card.config;
    if (!config) return 'pass';
    const langKeys = Object.keys(config).filter(k => k !== 'constants' && k !== '_meta');
    if (langKeys.length < 2) return 'pass';

    // Get array-length signature at each nesting path (ignores item-internal keys)
    function getArraySignature(obj, prefix) {
      const sig = {};
      if (!obj || typeof obj !== 'object') return sig;
      for (const [key, val] of Object.entries(obj)) {
        const path = prefix ? prefix + '.' + key : key;
        if (Array.isArray(val)) {
          sig[path] = val.length; // record array length
          val.forEach((item, idx) => {
            Object.assign(sig, getArraySignature(item, path + '[' + idx + ']'));
          });
        } else if (val && typeof val === 'object') {
          Object.assign(sig, getArraySignature(val, path));
        }
      }
      return sig;
    }

    // Get all key paths (including nested object keys)
    function getKeyPaths(obj, prefix) {
      const paths = new Set();
      if (!obj || typeof obj !== 'object') return paths;
      for (const [key, val] of Object.entries(obj)) {
        const path = prefix ? prefix + '.' + key : key;
        paths.add(path);
        if (Array.isArray(val)) {
          paths.add(path); // the array key itself
          val.forEach((item, idx) => {
            if (item && typeof item === 'object') {
              for (const p of getKeyPaths(item, path + '[' + idx + ']')) {
                paths.add(p);
              }
            }
          });
        } else if (val && typeof val === 'object') {
          for (const p of getKeyPaths(val, path)) {
            paths.add(p);
          }
        }
      }
      return paths;
    }

    const baseKeyPaths = getKeyPaths(config[langKeys[0]], '');
    const baseArraySig = getArraySignature(config[langKeys[0]], '');

    for (let i = 1; i < langKeys.length; i++) {
      const otherKeyPaths = getKeyPaths(config[langKeys[i]], '');
      const otherArraySig = getArraySignature(config[langKeys[i]], '');

      // Check: same top-level keys? (fail if different)
      const baseTopKeys = new Set();
      for (const p of baseKeyPaths) { if (!p.includes('.') && !p.includes('[')) baseTopKeys.add(p); }
      const otherTopKeys = new Set();
      for (const p of otherKeyPaths) { if (!p.includes('.') && !p.includes('[')) otherTopKeys.add(p); }
      if (baseTopKeys.size !== otherTopKeys.size ||
          [...baseTopKeys].some(k => !otherTopKeys.has(k))) {
        return 'fail';
      }

      // Check: same array lengths at same paths? (fail if array lengths differ)
      const allArrayPaths = new Set([...Object.keys(baseArraySig), ...Object.keys(otherArraySig)]);
      for (const p of allArrayPaths) {
        if (baseArraySig[p] !== otherArraySig[p]) return 'fail';
      }
    }

    // Check: nested structure identical? (warn if key paths differ but arrays match)
    for (let i = 1; i < langKeys.length; i++) {
      const otherKeyPaths = getKeyPaths(config[langKeys[i]], '');
      if (baseKeyPaths.size !== otherKeyPaths.size ||
          [...baseKeyPaths].some(p => !otherKeyPaths.has(p))) {
        return 'warn';
      }
    }

    return 'pass';
  },

  'i18n-tag-count': (card) => {
    const tags = card.tags;
    if (!tags) return 'pass';
    const keys = Object.keys(tags).filter(k => k !== 'constants');
    if (keys.length < 2) return 'fail';
    const count0 = (tags[keys[0]] || []).length;
    for (let i = 1; i < keys.length; i++) {
      if ((tags[keys[i]] || []).length !== count0) return 'fail';
    }
    return 'pass';
  },

  'i18n-badge-same': (card) => {
    const badge = card.badge;
    if (!badge) return 'pass';
    const keys = Object.keys(badge).filter(k => k !== 'constants');
    if (keys.length < 2) return 'pass';
    const val0 = badge[keys[0]];
    for (let i = 1; i < keys.length; i++) {
      if (badge[keys[i]] !== val0) return 'fail';
    }
    return 'pass';
  },
};

// ── Runner ──────────────────────────────────────────────────────────────────

async function loadFixtures(category) {
  const cats = category ? [category] : ['structural', 'tag-quality', 'link-hygiene', 'standard', 'i18n'];
  const allTests = [];

  // export name mapping: kebab-case filename → possible JS identifier names
  const NAME_MAP = {
    'tag-quality': ['tagQuality', 'tag-quality', 'tests'],
    'link-hygiene': ['linkHygiene', 'link-hygiene', 'tests'],
  };

  for (const cat of cats) {
    try {
      const mod = await import(join(__dirname, 'fixtures', `${cat}.js`));
      // Try category name first, then mapped names, then 'tests' variable
      const aliases = NAME_MAP[cat] || [cat, 'tests'];
      let tests = mod[cat];
      if (!tests) {
        for (const alias of aliases) {
          if (mod[alias]) { tests = mod[alias]; break; }
        }
      }
      tests = tests || [];
      allTests.push(...tests.map(t => ({ ...t, category: cat })));
    } catch (err) {
      if (err.code === 'ERR_MODULE_NOT_FOUND') {
        console.log(`  ⚠️  Fixture file not found: fixtures/${cat}.js (skipping)`);
      } else {
        console.error(`  ❌ Error loading fixtures/${cat}.js: ${err.message}`);
      }
    }
  }

  return allTests;
}

function runTest(testCase) {
  const fn = CHECKS[testCase.id];
  if (!fn) return { status: 'error', message: `Unknown check: ${testCase.id}` };

  // i18n tests use a config object; other tests use a card + siblings context
  const context = {
    siblings: testCase.siblings,
    config: testCase.config,
  };
  const result = fn(testCase.card || testCase, context);
  const passed = result === testCase.expected;

  return {
    status: passed ? 'pass' : 'fail',
    expected: testCase.expected,
    actual: result,
    name: testCase.name,
    id: testCase.id,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const catArg = args.find(a => a.startsWith('--category='));
  const category = catArg ? catArg.split('=')[1] : null;

  console.log('\n🧪 rui-checklist Self-Tests');
  console.log('═'.repeat(60));

  const tests = await loadFixtures(category);
  if (tests.length === 0) {
    console.log('  No test fixtures found.\n');
    process.exit(0);
  }

  const results = tests.map(runTest);
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const errors = results.filter(r => r.status === 'error').length;

  // Group by check ID
  const byCheck = {};
  for (const r of results) {
    if (!byCheck[r.id]) byCheck[r.id] = { passed: 0, failed: 0, total: 0, details: [] };
    byCheck[r.id].total++;
    byCheck[r.id][r.status === 'pass' ? 'passed' : 'failed']++;
    byCheck[r.id].details.push(r);
  }

  // Print per-check summary
  for (const [checkId, stats] of Object.entries(byCheck)) {
    const icon = stats.failed === 0 ? '✅' : '❌';
    console.log(`  ${icon} ${checkId}: ${stats.passed}/${stats.total} passed`);
  }

  // Print failures
  const failures = results.filter(r => r.status !== 'pass');
  if (failures.length > 0) {
    console.log(`\n── Failures ──`);
    for (const f of failures) {
      if (f.status === 'error') {
        console.log(`  ❌ ${f.id}: ${f.name}`);
        console.log(`     Error: ${f.message}`);
      } else {
        console.log(`  ❌ ${f.id}: ${f.name}`);
        console.log(`     Expected: ${f.expected} → Got: ${f.actual}`);
      }
    }
  }

  // Summary
  console.log(`\n── Summary ──`);
  console.log(`  Total:  ${tests.length}`);
  console.log(`  Passed: ${passed} ✅`);
  console.log(`  Failed: ${failed} ❌`);
  if (errors > 0) console.log(`  Errors: ${errors} ⚠️`);
  console.log('');

  process.exit(failed + errors > 0 ? 1 : 0);
}

main().catch(err => {
  console.error(`Fatal: ${err.message}`);
  process.exit(1);
});
