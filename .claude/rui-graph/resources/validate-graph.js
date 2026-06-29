#!/usr/bin/env node
/**
 * Deterministic graph validator for rui-graph.
 *
 * Reads graph-data.json and optionally card-analysis.json, performs all
 * schema/referential/completeness checks, and writes a review.json report.
 *
 * Usage:
 *   node validate-graph.js <graph-data.json> <card-analysis.json> <output-review.json>
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Canonical sets
// ---------------------------------------------------------------------------

const VALID_NODE_TYPES = new Set([
  'card', 'tag', 'link_dest', 'badge', 'cluster', 'card_group'
]);

const VALID_EDGE_TYPES = new Set([
  'has_tag', 'shares_tag', 'has_badge', 'shares_badge',
  'links_to', 'shares_link',
  'depends_on', 'related_to', 'extends', 'implements',
  'translates_to', 'belongs_to'
]);

const VALID_BADGES = new Map([
  ['Core', '#34d399'], ['核心', '#34d399'],
  ['Report', '#fb7185'], ['报告', '#fb7185'],
  ['Guide', '#38bdf8'], ['指南', '#38bdf8'],
  ['OSS', '#fbbf24'],
  ['Agent', '#a78bfa'],
  ['Beta', '#fb923c'],
]);

const VALID_MODIFIERS = new Set([
  'warn', 'accent', 'info', 'red', 'purple', 'cyan', 'pass', 'green'
]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function computeRichness(card) {
  let score = 1;
  const desc = (card.desc || '').replace(/<[^>]*>/g, '');
  if (desc) score += Math.min(desc.length / 50, 3);
  if (card.tags && card.tags.length) score += card.tags.length * 0.5;
  if (card.links && card.links.length) score += 1;
  if (card.meta) score += 1;
  if (card.badge) score += 0.5;
  return Math.round(score);
}

// ---------------------------------------------------------------------------
// Main validation
// ---------------------------------------------------------------------------

function validate(graphPath, analysisPath, outputPath) {
  const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
  const analysis = analysisPath ? JSON.parse(fs.readFileSync(analysisPath, 'utf8')) : null;

  const issues = [];
  const warnings = [];

  // Extract nodes/edges (handle both wrapped and unwrapped formats)
  const nodes = graph.nodes || [];
  const edges = graph.edges || [];

  // ── Check 1: Schema validation ──
  const nodeIds = new Set();
  const seenNodeIds = new Map();

  nodes.forEach((n, i) => {
    const d = n.data || n;
    if (!d.id) { issues.push(`Node[${i}] missing id`); return; }
    if (!d.type) { issues.push(`Node[${i}] '${d.id}' missing type`); }
    else if (!VALID_NODE_TYPES.has(d.type)) {
      issues.push(`Node[${i}] '${d.id}' has invalid type '${d.type}'`);
    }
    if (!d.label && d.label !== '') { issues.push(`Node[${i}] '${d.id}' missing label`); }

    if (seenNodeIds.has(d.id)) {
      issues.push(`Duplicate node ID '${d.id}' at indices ${seenNodeIds.get(d.id)} and ${i}`);
    } else {
      seenNodeIds.set(d.id, i);
    }
    nodeIds.add(d.id);
  });

  if (nodes.length === 0) {
    issues.push('Graph has zero nodes');
  }

  const seenEdgeIds = new Map();
  const seenEdgeKeys = new Set();

  edges.forEach((e, i) => {
    const d = e.data || e;
    if (!d.id) { issues.push(`Edge[${i}] missing id`); return; }
    if (!d.source) { issues.push(`Edge[${i}] '${d.id}' missing source`); }
    if (!d.target) { issues.push(`Edge[${i}] '${d.id}' missing target`); }
    if (!d.type) { issues.push(`Edge[${i}] '${d.id}' missing type`); }
    else if (!VALID_EDGE_TYPES.has(d.type)) {
      issues.push(`Edge[${i}] '${d.id}' has invalid type '${d.type}'`);
    }

    if (seenEdgeIds.has(d.id)) {
      issues.push(`Duplicate edge ID '${d.id}' at indices ${seenEdgeIds.get(d.id)} and ${i}`);
    } else {
      seenEdgeIds.set(d.id, i);
    }

    const key = `${d.source}|${d.target}|${d.type}`;
    if (seenEdgeKeys.has(key)) {
      warnings.push(`Duplicate edge key '${key}'`);
    } else {
      seenEdgeKeys.add(key);
    }
  });

  if (edges.length === 0 && analysis) {
    warnings.push('Graph has zero edges (may be valid for small card sets)');
  }

  // ── Check 2: Referential integrity ──
  let danglingEdges = 0;
  edges.forEach((e, i) => {
    const d = e.data || e;
    if (d.source && !nodeIds.has(d.source)) {
      issues.push(`Edge[${i}] '${d.id}' source '${d.source}' not found in nodes`);
      danglingEdges++;
    }
    if (d.target && !nodeIds.has(d.target)) {
      issues.push(`Edge[${i}] '${d.id}' target '${d.target}' not found in nodes`);
      danglingEdges++;
    }
  });
  if (danglingEdges > 0) {
    warnings.push(`${danglingEdges} dangling edge references`);
  }

  // ── Check 3: Card coverage (if analysis provided) ──
  if (analysis && analysis.cards) {
    const graphCardCount = nodes.filter(n => (n.data || n).type === 'card').length;
    const sourceCardCount = analysis.cards.length;
    if (graphCardCount !== sourceCardCount) {
      issues.push(`Card coverage mismatch: ${graphCardCount} in graph, ${sourceCardCount} in source`);
    }
  }

  // ── Check 4: Color mapping ──
  nodes.forEach(n => {
    const d = n.data || n;
    if (d.type === 'card' && d.badge && !VALID_BADGES.has(d.badge)) {
      // Also check normalized badge
      const norm = (d.badgeNormalized || d.badge || '').toLowerCase();
      const knownBases = ['core', 'report', 'guide', 'oss', 'agent', 'beta'];
      const knownCN = ['核心', '报告', '指南'];
      const isKnown = knownBases.some(b => norm.includes(b)) || knownCN.includes(d.badge);
      if (!isKnown) {
        warnings.push(`Card '${d.id}' has non-canonical badge '${d.badge}' — mapped to default cyan`);
      }
    }
    if (d.type === 'tag' && d.modifier && !VALID_MODIFIERS.has(d.modifier)) {
      warnings.push(`Tag '${d.id}' has non-canonical modifier '${d.modifier}' — mapped to slate default`);
    }
  });

  // ── Check 5: Richness consistency ──
  if (analysis && analysis.cards) {
    const analysisCards = new Map(analysis.cards.map(c => [c.id, c]));
    nodes.forEach(n => {
      const d = n.data || n;
      if (d.type === 'card' && d.richness !== undefined) {
        const srcCard = analysisCards.get(d.id);
        if (srcCard) {
          const computed = computeRichness({
            desc: srcCard.desc,
            tags: srcCard.tags,
            links: srcCard.links,
            meta: srcCard.meta,
            badge: srcCard.badge,
          });
          const diff = Math.abs((d.richness || 1) - computed);
          if (diff > 1) {
            issues.push(`Card '${d.id}' richness is ${d.richness} but computed richness is ${computed} (diff: ${diff})`);
          } else if (diff === 1) {
            warnings.push(`Card '${d.id}' richness mismatch (has:${d.richness}, computed:${computed})`);
          }
        }
      }
    });
  }

  // ── Check 6: Orphan detection ──
  const connectedNodes = new Set();
  edges.forEach(e => {
    const d = e.data || e;
    if (d.source) connectedNodes.add(d.source);
    if (d.target) connectedNodes.add(d.target);
  });
  const orphans = nodes.filter(n => !connectedNodes.has((n.data || n).id));
  if (orphans.length > 0) {
    warnings.push(`${orphans.length} orphan nodes (zero edges): ${orphans.slice(0, 5).map(n => (n.data || n).id).join(', ')}${orphans.length > 5 ? '...' : ''}`);
  }

  // ── Check 7: Self-reference ──
  let selfRefs = 0;
  edges.forEach(e => {
    const d = e.data || e;
    if (d.source === d.target) {
      issues.push(`Self-referencing edge '${d.id}': source and target are both '${d.source}'`);
      selfRefs++;
    }
  });
  if (selfRefs > 0) {
    warnings.push(`${selfRefs} self-referencing edges detected`);
  }

  // ── Compute stats ──
  const nodeTypes = {};
  nodes.forEach(n => {
    const t = (n.data || n).type || 'unknown';
    nodeTypes[t] = (nodeTypes[t] || 0) + 1;
  });

  const edgeTypes = {};
  edges.forEach(e => {
    const t = (e.data || e).type || 'unknown';
    edgeTypes[t] = (edgeTypes[t] || 0) + 1;
  });

  const stats = {
    totalNodes: nodes.length,
    totalEdges: edges.length,
    nodeTypes,
    edgeTypes,
    orphanNodes: orphans.length,
    danglingEdges,
  };

  // ── Write output ──
  const output = {
    scriptCompleted: true,
    issues,
    warnings,
    stats,
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.error(`[validate-graph] ${nodes.length} nodes, ${edges.length} edges, ${issues.length} issues, ${warnings.length} warnings`);
  if (issues.length > 0) {
    console.error(`[validate-graph] FAILED — ${issues.length} critical issues`);
  } else {
    console.error(`[validate-graph] PASSED — 0 critical issues`);
  }
}

// ---------------------------------------------------------------------------
// Entry
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node validate-graph.js <graph-data.json> <card-analysis.json> <output-review.json>');
  process.exit(1);
}

try {
  validate(args[0], args[1], args[2]);
} catch (err) {
  console.error(`[validate-graph] Fatal error: ${err.message}`);
  process.exit(1);
}
