# Graph System Reference — Full Design System

> Color palette, layout configurations, node/edge styles, and CSS variables for rui-graph Cytoscape.js graphs.
>
> **See also:** [[edge-types.md]] for the expanded edge type catalog with creation rules and collision prevention. [[validation.md]] for the complete validation rules and auto-fix pipeline.

## Design Tokens

All graphs share these base tokens, matching the VideoLingo dark theme:

```css
:root {
  --graph-bg: #020617;
  --graph-surface: #0f172a;
  --graph-border: #1e293b;
  --graph-text: #f8fafc;
  --graph-text-soft: #94a3b8;
  --graph-text-muted: #64748b;
  --graph-font: 'JetBrains Mono', monospace;
}
```

## Cytoscape.js Container Styles

```javascript
const cy = cytoscape({
  container: document.getElementById('cy'),
  style: [
    // Node defaults
    {
      selector: 'node',
      style: {
        'font-family': 'JetBrains Mono, monospace',
        'font-size': '10px',
        'color': '#f8fafc',
        'text-valign': 'center',
        'text-halign': 'center',
        'text-wrap': 'wrap',
        'text-max-width': '120px',
        'background-opacity': 0.85,
        'border-width': 1.5,
        'transition-property': 'background-color, border-color, width, height',
        'transition-duration': '0.2s',
      }
    },
    // Edge defaults
    {
      selector: 'edge',
      style: {
        'width': 1,
        'line-color': '#475569',
        'target-arrow-color': '#475569',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'opacity': 0.6,
        'transition-property': 'opacity, width',
        'transition-duration': '0.15s',
      }
    },

    /* ===== CARD NODES ===== */
    {
      selector: 'node[type="card"]',
      style: {
        'shape': 'round-rectangle',
        'width': 140,
        'height': 60,
        'font-size': '11px',
        'font-weight': '600',
        'padding': '8px',
      }
    },
    // Card: badge=Core
    { selector: 'node[badge="Core"], node[badge="核心"]',
      style: { 'background-color': 'rgba(6, 78, 59, 0.85)', 'border-color': '#34d399' } },
    // Card: badge=Report
    { selector: 'node[badge="Report"], node[badge="报告"]',
      style: { 'background-color': 'rgba(136, 19, 55, 0.85)', 'border-color': '#fb7185' } },
    // Card: badge=Guide
    { selector: 'node[badge="Guide"], node[badge="指南"]',
      style: { 'background-color': 'rgba(8, 51, 68, 0.85)', 'border-color': '#38bdf8' } },
    // Card: badge=OSS
    { selector: 'node[badge="OSS"]',
      style: { 'background-color': 'rgba(120, 53, 15, 0.85)', 'border-color': '#fbbf24' } },
    // Card: badge=Agent
    { selector: 'node[badge="Agent"]',
      style: { 'background-color': 'rgba(76, 29, 149, 0.85)', 'border-color': '#a78bfa' } },
    // Card: badge=Beta
    { selector: 'node[badge="Beta"]',
      style: { 'background-color': 'rgba(120, 53, 15, 0.85)', 'border-color': '#fb923c' } },
    // Card: no badge (default)
    { selector: 'node[type="card"]',
      style: { 'background-color': 'rgba(8, 51, 68, 0.85)', 'border-color': '#22d3ee' } },

    /* ===== TAG NODES ===== */
    {
      selector: 'node[type="tag"]',
      style: {
        'shape': 'ellipse',
        'width': 90,
        'height': 36,
        'font-size': '9px',
        'font-weight': '500',
      }
    },
    { selector: 'node[modifier="warn"]',  style: { 'background-color': 'rgba(245, 158, 11, 0.2)', 'border-color': '#f59e0b' } },
    { selector: 'node[modifier="accent"]',style: { 'background-color': 'rgba(234, 179, 8, 0.2)', 'border-color': '#eab308' } },
    { selector: 'node[modifier="info"]',  style: { 'background-color': 'rgba(59, 130, 246, 0.2)', 'border-color': '#3b82f6' } },
    { selector: 'node[modifier="red"]',   style: { 'background-color': 'rgba(239, 68, 68, 0.2)', 'border-color': '#ef4444' } },
    { selector: 'node[modifier="purple"]',style: { 'background-color': 'rgba(139, 92, 246, 0.2)', 'border-color': '#8b5cf6' } },
    { selector: 'node[modifier="cyan"]',  style: { 'background-color': 'rgba(6, 182, 212, 0.2)', 'border-color': '#06b6d4' } },
    { selector: 'node[modifier="pass"], node[modifier="green"]',
      style: { 'background-color': 'rgba(34, 197, 94, 0.2)', 'border-color': '#22c55e' } },

    /* ===== LINK DESTINATION NODES ===== */
    {
      selector: 'node[type="link_dest"]',
      style: {
        'shape': 'diamond',
        'width': 60,
        'height': 60,
        'font-size': '8px',
        'background-color': 'rgba(71, 85, 105, 0.4)',
        'border-color': '#64748b',
      }
    },

    /* ===== BADGE NODES ===== */
    {
      selector: 'node[type="badge"]',
      style: {
        'shape': 'triangle',
        'width': 40,
        'height': 40,
        'font-size': '8px',
      }
    },

    /* ===== EDGE TYPES ===== */
    // has_tag: card → tag
    {
      selector: 'edge[type="has_tag"]',
      style: { 'line-style': 'solid', 'width': 1, 'line-color': '#475569', 'target-arrow-shape': 'none', 'curve-style': 'unbundled-bezier' }
    },
    // shares_tag: card ↔ card
    {
      selector: 'edge[type="shares_tag"]',
      style: { 'line-style': 'dashed', 'width': 0.5, 'line-color': '#94a3b8', 'target-arrow-shape': 'none', 'opacity': 0.3 }
    },
    // has_badge: card → badge
    {
      selector: 'edge[type="has_badge"]',
      style: { 'line-style': 'solid', 'width': 2, 'target-arrow-shape': 'triangle', 'opacity': 0.8 }
    },
    // shares_badge: card ↔ card
    {
      selector: 'edge[type="shares_badge"]',
      style: { 'line-style': 'dashed', 'width': 1, 'target-arrow-shape': 'none', 'opacity': 0.4 }
    },
    // links_to: card → link dest
    {
      selector: 'edge[type="links_to"]',
      style: { 'line-style': 'dotted', 'width': 1, 'line-color': '#475569', 'target-arrow-shape': 'triangle', 'opacity': 0.5 }
    },
    // shares_link: card ↔ card
    {
      selector: 'edge[type="shares_link"]',
      style: { 'line-style': 'dotted', 'width': 0.5, 'line-color': '#334155', 'target-arrow-shape': 'none', 'opacity': 0.2 }
    },

    /* ===== INTERACTION STATES ===== */
    // Selected
    {
      selector: 'node:selected',
      style: { 'border-width': 3, 'border-color': '#f8fafc', 'shadow-blur': 12, 'shadow-color': '#22d3ee', 'shadow-opacity': 0.4 }
    },
    // Hover highlight
    {
      selector: 'node.highlight',
      style: { 'border-width': 2.5, 'border-color': '#f8fafc', 'opacity': 1 }
    },
    {
      selector: 'edge.highlight',
      style: { 'opacity': 1, 'width': 2 }
    },
    // Dimmed (non-neighbors on hover)
    {
      selector: 'node.dimmed',
      style: { 'opacity': 0.15 }
    },
    {
      selector: 'edge.dimmed',
      style: { 'opacity': 0.05 }
    },
    // Search highlight
    {
      selector: 'node.search-hit',
      style: { 'border-width': 3, 'border-color': '#fbbf24', 'shadow-blur': 16, 'shadow-color': '#fbbf24', 'shadow-opacity': 0.6 }
    },
  ],

  layout: {
    name: 'cose-bilkent',
    animate: true,
    animationDuration: 800,
    nodeRepulsion: 8000,
    idealEdgeLength: 120,
    gravity: 0.3,
    numIter: 2000,
    tile: true,
  },
});
```

## Layout Configurations

### cose-bilkent (Default — Force-Directed)

Best for: general card graphs, 5–50 nodes.

```javascript
{
  name: 'cose-bilkent',
  animate: true,
  animationDuration: 800,
  nodeRepulsion: 8000,
  idealEdgeLength: 120,
  gravity: 0.3,
  numIter: 2000,
  tile: true,
}
```

### dagre (Hierarchical)

Best for: pipeline cards, step-by-step guides, reports.

```javascript
{
  name: 'dagre',
  animate: true,
  animationDuration: 600,
  rankDir: 'LR',        // LR = left→right, TB = top→bottom
  nodeSep: 60,
  edgeSep: 20,
  rankSep: 100,
}
```

### breadthfirst

Best for: navigation cards, dependency trees.

```javascript
{
  name: 'breadthfirst',
  animate: true,
  animationDuration: 600,
  directed: true,
  spacingFactor: 1.5,
}
```

### concentric

Best for: core vs supporting features, hub-and-spoke.

```javascript
{
  name: 'concentric',
  animate: true,
  animationDuration: 600,
  concentric: function(node) {
    return node.data('richness') || 1;
  },
  minNodeSpacing: 40,
}
```

### grid

Best for: small sets (<15 nodes), comparison views.

```javascript
{
  name: 'grid',
  animate: true,
  animationDuration: 400,
  rows: undefined,      // auto-calculate
  cols: 4,
}
```

### circle

Best for: symmetric views, no hierarchy implied.

```javascript
{
  name: 'circle',
  animate: true,
  animationDuration: 500,
  radius: 250,
}
```

## Node Sizing

Card node size is proportional to its "richness score":

```javascript
function calcRichness(card) {
  let score = 1;  // base
  if (card.desc) score += Math.min(card.desc.length / 50, 3);  // up to +3 for long desc
  if (card.tags) score += card.tags.length * 0.5;               // +0.5 per tag
  if (card.links && card.links.length) score += 1;              // +1 for custom links
  if (card.meta) score += 1;                                    // +1 for meta
  if (card.badge) score += 0.5;                                 // +0.5 for badge
  return Math.round(score);
}

// Map to size
const width = 100 + richness * 15;   // 115–175px
const height = 44 + richness * 8;     // 52–84px
```

## Detail Panel Template

When a card node is clicked, show:

```html
<div class="detail-panel" id="detail">
  <div class="detail-header">
    <h3 id="detail-name">Card Name</h3>
    <span class="detail-badge" id="detail-badge">Badge</span>
  </div>
  <div class="detail-desc" id="detail-desc">
    <!-- v-html: supports <strong>, <code>, <br> -->
  </div>
  <div class="detail-tags" id="detail-tags">
    <!-- tag chips -->
  </div>
  <div class="detail-meta" id="detail-meta">
    <!-- monospace meta -->
  </div>
  <div class="detail-links" id="detail-links">
    <!-- clickable links -->
  </div>
  <div class="detail-stats" id="detail-stats">
    <!-- connection counts -->
  </div>
</div>
```

## CDN Dependencies

```html
<!-- Cytoscape.js 3.x (primary) -->
<script src="https://cdn.jsdelivr.net/npm/cytoscape@3.30.4/dist/cytoscape.min.js"></script>

<!-- Layout extensions (loaded via CDN) -->
<script src="https://cdn.jsdelivr.net/npm/cytoscape-dagre@2.5.0/cytoscape-dagre.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/cytoscape-cose-bilkent@4.1.0/cytoscape-cose-bilkent.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dagre@0.8.5/dist/dagre.min.js"></script>

<!-- Export -->
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>

<!-- Font -->
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Export Implementation

```javascript
// PNG export using Cytoscape's built-in
function downloadPNG() {
  const png = cy.png({ full: true, scale: 2, bg: '#020617' });
  const link = document.createElement('a');
  link.download = 'graph.png';
  link.href = png;
  link.click();
}

// Copy to clipboard
async function copyPNG() {
  const png = cy.png({ full: true, scale: 2, bg: '#020617' });
  const blob = await (await fetch(png)).blob();
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
}
```

## Filter System

```javascript
// Filter by badge
function filterByBadge(badge) {
  cy.nodes().forEach(n => {
    if (n.data('type') === 'card') {
      n.style('display', badge === 'all' || n.data('badge') === badge ? 'element' : 'none');
    }
  });
}

// Filter by tag modifier
function filterByModifier(modifier) {
  cy.nodes('[type="tag"]').forEach(n => {
    n.style('display', modifier === 'all' || n.data('modifier') === modifier ? 'element' : 'none');
  });
  // Also hide orphaned edges
  cy.edges().forEach(e => {
    e.style('display', e.source().style('display') !== 'none' && e.target().style('display') !== 'none' ? 'element' : 'none');
  });
}
```

## Responsive Breakpoints

```css
@media (max-width: 768px) {
  .sidebar { width: 100%; height: auto; max-height: 200px; }
  .graph-container { height: 60vh; }
  .detail-panel { width: 100%; max-height: 30vh; }
}

@media (max-width: 480px) {
  .toolbar { flex-wrap: wrap; }
  .toolbar button { font-size: 0.7rem; padding: 0.3rem 0.5rem; }
}
```
