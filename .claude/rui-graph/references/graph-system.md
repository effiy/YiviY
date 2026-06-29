# Graph System Reference — Code Dependency Graph

> Color palette, layout configurations, node/edge styles, and CSS variables for rui-graph code dependency graphs using Cytoscape.js.
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

## Node Types (4 types)

| Node Type | Source | Color | Hex | Shape | Size |
|-----------|--------|-------|-----|-------|------|
| **file** | Each `.py` source file | Sky blue | `#38bdf8` | Round-rectangle | 150×58, font-size: 10px, weight: 600 |
| **class** | Each class definition | Violet | `#a78bfa` | Hexagon | 110×95, font-size: 9px, weight: 600 |
| **function** | Each function/method def | Emerald | `#34d399` | Ellipse | 125×48, font-size: 9px, weight: 500 |
| **module** | Package `__init__.py` (namespace) | Amber | `#fbbf24` | Diamond | 80×80, font-size: 9px, weight: 600 |

### File Tier → Size Modifier

File node width scales by line count (a proxy for importance):

| Tier | Line Count | Width | Description |
|------|-----------|-------|-------------|
| Core | >1000 | 160 | Main orchestrator / large module |
| Library | 100–1000 | 140 | Feature module |
| Utility | <100 | 120 | Small helper / constants |

## Edge Types (5 types)

| Edge Type | Source → Target | Line Style | Width | Color | Meaning |
|-----------|----------------|------------|-------|-------|---------|
| `imports` | file → file | Solid arrow | 1.5 | `#475569` | One file imports another |
| `calls` | function → function | Dashed arrow | 1 | `#94a3b8` | Function calls another |
| `inherits` | class → class | Bold solid arrow | 2 | `#a78bfa` | Class inherits from superclass |
| `contains` | file → class/function | Solid no arrow | 0.8 | `#475569` | File defines class/function |
| `exports` | file → file | Dotted arrow | 1 | `#22d3ee` | `__init__.py` re-exports symbols |

## Color Palette — Entity Type → Cytoscape

| Entity Type | Color | Hex | Background |
|-------------|-------|-----|------------|
| `file` | Sky blue | `#38bdf8` | `rgba(8, 51, 68, 0.85)` |
| `class` | Violet | `#a78bfa` | `rgba(76, 29, 149, 0.85)` |
| `function` | Emerald | `#34d399` | `rgba(6, 78, 59, 0.85)` |
| `module` | Amber | `#fbbf24` | `rgba(120, 53, 15, 0.85)` |

### Edge Colors

| Edge Type | Color | Hex |
|-----------|-------|-----|
| `imports` | Slate | `#475569` |
| `calls` | Gray | `#94a3b8` |
| `inherits` | Violet | `#a78bfa` |
| `contains` | Slate | `#475569` |
| `exports` | Cyan | `#22d3ee` |

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

    /* ===== FILE NODES ===== */
    {
      selector: 'node[type="file"]',
      style: {
        'shape': 'round-rectangle',
        'width': 140,
        'height': 55,
        'font-size': '10px',
        'font-weight': '600',
        'background-color': 'rgba(8, 51, 68, 0.85)',
        'border-color': '#38bdf8',
      }
    },

    /* ===== CLASS NODES ===== */
    {
      selector: 'node[type="class"]',
      style: {
        'shape': 'hexagon',
        'width': 110,
        'height': 95,
        'font-size': '9px',
        'font-weight': '600',
        'background-color': 'rgba(76, 29, 149, 0.85)',
        'border-color': '#a78bfa',
      }
    },

    /* ===== FUNCTION NODES ===== */
    {
      selector: 'node[type="function"]',
      style: {
        'shape': 'ellipse',
        'width': 125,
        'height': 48,
        'font-size': '9px',
        'font-weight': '500',
        'background-color': 'rgba(6, 78, 59, 0.85)',
        'border-color': '#34d399',
      }
    },

    /* ===== MODULE NODES ===== */
    {
      selector: 'node[type="module"]',
      style: {
        'shape': 'diamond',
        'width': 80,
        'height': 80,
        'font-size': '9px',
        'font-weight': '600',
        'background-color': 'rgba(120, 53, 15, 0.85)',
        'border-color': '#fbbf24',
      }
    },

    /* ===== EDGE TYPES ===== */
    // imports: file → file
    {
      selector: 'edge[type="imports"]',
      style: { 'line-style': 'solid', 'width': 1.5, 'line-color': '#475569', 'target-arrow-shape': 'triangle' }
    },
    // calls: function → function
    {
      selector: 'edge[type="calls"]',
      style: { 'line-style': 'dashed', 'width': 1, 'line-color': '#94a3b8', 'target-arrow-shape': 'triangle' }
    },
    // inherits: class → class
    {
      selector: 'edge[type="inherits"]',
      style: { 'line-style': 'solid', 'width': 2, 'line-color': '#a78bfa', 'target-arrow-shape': 'triangle' }
    },
    // contains: file → class/function
    {
      selector: 'edge[type="contains"]',
      style: { 'line-style': 'solid', 'width': 0.8, 'line-color': '#475569', 'target-arrow-shape': 'none', 'curve-style': 'unbundled-bezier' }
    },
    // exports: file → file (re-export)
    {
      selector: 'edge[type="exports"]',
      style: { 'line-style': 'dotted', 'width': 1, 'line-color': '#22d3ee', 'target-arrow-shape': 'triangle' }
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
      style: { 'opacity': 0.12 }
    },
    {
      selector: 'edge.dimmed',
      style: { 'opacity': 0.04 }
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
    nodeRepulsion: 12000,
    idealEdgeLength: 120,
    gravity: 0.3,
    numIter: 3000,
    tile: true,
  },
});
```

## Layout Configurations

### cose-bilkent (Default — Force-Directed)

Best for: general code graphs, 20–200 nodes. Increased repulsion for code graphs.

```javascript
{
  name: 'cose-bilkent',
  animate: true,
  animationDuration: 800,
  nodeRepulsion: 12000,
  idealEdgeLength: 120,
  gravity: 0.3,
  numIter: 3000,
  tile: true,
}
```

### dagre (Hierarchical)

Best for: layered architectures, import chains, dependency trees.

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

Best for: class hierarchies, strict dependency trees.

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

Best for: core vs utility modules, hub-and-spoke architecture.

```javascript
{
  name: 'concentric',
  animate: true,
  animationDuration: 600,
  concentric: function(node) {
    return node.data('depth') || 1;
  },
  minNodeSpacing: 40,
}
```

### grid

Best for: small codebases (<20 files), comparison views.

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
  radius: Math.max(200, cy.nodes().length * 15),
}
```

## Detail Panel Template

When a node is clicked, show type-specific detail:

### File Node Detail

```html
<div class="detail-header">
  <h3>📄 file_name.py</h3>
  <span class="detail-type-tag type-file">File</span>
</div>
<div class="detail-meta">path: yt_dlp/module/file_name.py · 1,234 lines</div>
<div class="detail-section-title">Defines</div>
<ul class="detail-conn-list">
  <li onclick="focusNode('class:ClassName')">class ClassName</li>
  <li onclick="focusNode('func:function_name')">function_name()</li>
</ul>
<div class="detail-section-title">Imports</div>
<ul class="detail-conn-list">
  <li onclick="focusNode('file:yt_dlp/other.py')">other.py</li>
</ul>
<div class="detail-section-title">Imported By</div>
<ul class="detail-conn-list">
  <li onclick="focusNode('file:yt_dlp/__init__.py')">__init__.py</li>
</ul>
```

### Class Node Detail

```html
<div class="detail-header">
  <h3>🔷 ClassName</h3>
  <span class="detail-type-tag type-class">Class</span>
</div>
<div class="detail-meta">Defined in: yt_dlp/module.py</div>
<div class="detail-section-title">Base Classes</div>
<ul class="detail-conn-list">
  <li onclick="focusNode('class:BaseClass')">BaseClass</li>
</ul>
<div class="detail-section-title">Methods</div>
<ul class="detail-conn-list">
  <li onclick="focusNode('func:ClassName.method_name')">method_name()</li>
</ul>
```

### Function Node Detail

```html
<div class="detail-header">
  <h3>🟢 function_name()</h3>
  <span class="detail-type-tag type-function">Function</span>
</div>
<div class="detail-meta">Defined in: yt_dlp/module.py · Class: ClassName</div>
<div class="detail-section-title">Calls</div>
<ul class="detail-conn-list">
  <li onclick="focusNode('func:other_function')">other_function()</li>
</ul>
<div class="detail-section-title">Called By</div>
<ul class="detail-conn-list">
  <li onclick="focusNode('func:caller')">caller()</li>
</ul>
```

### Module Node Detail

```html
<div class="detail-header">
  <h3>📦 package_name</h3>
  <span class="detail-type-tag type-module">Package</span>
</div>
<div class="detail-meta">path: yt_dlp/package_name/</div>
<div class="detail-section-title">Exports</div>
<ul class="detail-conn-list">
  <li onclick="focusNode('file:yt_dlp/package/submodule.py')">submodule.py</li>
</ul>
<div class="detail-section-title">Sub-packages</div>
<ul class="detail-conn-list">
  <li onclick="focusNode('module:yt_dlp.subpackage')">subpackage</li>
</ul>
```

## CDN Dependencies

```html
<!-- Cytoscape.js 3.x (primary) -->
<script src="https://cdn.jsdelivr.net/npm/cytoscape@3.30.4/dist/cytoscape.min.js"></script>

<!-- Layout extensions -->
<script src="https://cdn.jsdelivr.net/npm/cytoscape-dagre@2.5.0/cytoscape-dagre.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dagre@0.8.5/dist/dagre.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/cytoscape-cose-bilkent@4.1.0/cytoscape-cose-bilkent.min.js"></script>

<!-- Font -->
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Export Implementation

```javascript
// PNG export using Cytoscape's built-in
function downloadPNG() {
  const png = cy.png({ full: true, scale: 2, bg: '#020617' });
  const link = document.createElement('a');
  link.download = 'code-graph.png';
  link.href = png;
  link.click();
}
```

## Filter System — By Module

```javascript
// Filter by module/package
window.filterByModule = function(moduleName, btn) {
  var buttons = document.querySelectorAll('#module-filters .filter-btn');
  buttons.forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');

  if (moduleName === 'all') {
    cy.nodes().style('display', 'element');
    cy.edges().style('display', 'element');
    fitGraph();
    return;
  }

  cy.nodes().forEach(function(n) {
    if (n.data('type') === 'file') {
      n.style('display', (n.data('module') || '') === moduleName ? 'element' : 'none');
    } else if (n.data('type') === 'class' || n.data('type') === 'function' || n.data('type') === 'module') {
      var connected = n.connectedEdges('[type="contains"]').some(function(e) {
        var fileNode = e.source().data('type') === 'file' ? e.source() : e.target();
        return fileNode.style('display') !== 'none';
      });
      n.style('display', connected ? 'element' : 'none');
    }
  });

  cy.edges().forEach(function(e) {
    e.style('display', e.source().style('display') !== 'none' && e.target().style('display') !== 'none' ? 'element' : 'none');
  });
  fitGraph();
};
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
