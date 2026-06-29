/* ════════════════════════════════════════════════════════════════════════
   rui-graph — Graph Logic
   Reads window.GRAPH_DATA, initializes Cytoscape, wires all interactions.

   Depends on: data.js (window.GRAPH_DATA), Cytoscape.js CDN,
               dagre, cytoscape-dagre, cytoscape-cose-bilkent
   ════════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  const DATA = window.GRAPH_DATA;
  if (!DATA || !DATA.elements) {
    console.error('rui-graph: window.GRAPH_DATA not found. Ensure data.js is loaded before index.js.');
    return;
  }

  /* ════════════════════════════════════════════════════════════════════════
   * CY INIT
   * ════════════════════════════════════════════════════════════════════════ */

  const cy = cytoscape({
    container: document.getElementById('cy'),
    elements: DATA.elements,
    style: getGraphStyle(),
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
    wheelSensitivity: 0.3,
    minZoom: 0.15,
    maxZoom: 4,
  });

  /* ════════════════════════════════════════════════════════════════════════
   * GRAPH STYLE — Node/Edge visual mapping
   * Colors read from --yry-* CSS custom properties via readThemeColors()
   * ════════════════════════════════════════════════════════════════════════ */

  /**
   * Read theme colors from CSS custom properties.
   * This bridges rui-theme's --yry-* variables into Cytoscape's JS styles.
   * Call once at init; values are cached for the graph's lifetime.
   */
  function readThemeColors() {
    var style = getComputedStyle(document.documentElement);
    var get = function(name, fallback) {
      var val = style.getPropertyValue(name).trim();
      return val || fallback;
    };
    return {
      // Surface
      bg:             get('--yry-bg-primary', '#020617'),
      surface:        get('--yry-bg-secondary', '#0f172a'),
      border:         get('--yry-border', '#1e293b'),
      // Text
      text:           get('--yry-text-primary', '#f8fafc'),
      textSoft:       get('--yry-text-secondary', '#94a3b8'),
      textMuted:      get('--yry-text-muted', '#64748b'),
      // Accent
      accent:         get('--yry-accent', '#22d3ee'),
      accentMuted:    get('--yry-accent-muted', 'rgba(8, 51, 68, 0.4)'),
      // Status
      success:        get('--yry-success', '#34d399'),
      warning:        get('--yry-warning', '#f59e0b'),
      error:          get('--yry-error', '#ef4444'),
      info:           get('--yry-info', '#3b82f6'),
      // Extended palette (chart/badge colors)
      chart1:         get('--yry-chart-1', '#fbbf24'),   // amber / oss
      chart2:         get('--yry-chart-2', '#a78bfa'),   // violet / agent
      chart3:         get('--yry-chart-3', '#34d399'),   // emerald / core
      chart4:         get('--yry-chart-4', '#fb923c'),   // orange / beta
      chart5:         get('--yry-chart-5', '#38bdf8'),   // sky / guide
      chart6:         get('--yry-chart-6', '#fb7185'),   // rose / report
      // Badge backgrounds (derived with opacity)
      bgCore:         get('--graph-badge-core-bg', 'rgba(6, 78, 59, 0.85)'),
      bgReport:       get('--graph-badge-report-bg', 'rgba(136, 19, 55, 0.85)'),
      bgGuide:        get('--graph-badge-guide-bg', 'rgba(8, 51, 68, 0.85)'),
      bgOss:          get('--graph-badge-oss-bg', 'rgba(120, 53, 15, 0.85)'),
      bgAgent:        get('--graph-badge-agent-bg', 'rgba(76, 29, 149, 0.85)'),
      bgBeta:         get('--graph-badge-beta-bg', 'rgba(120, 53, 15, 0.85)'),
    };
  }

  var TC = readThemeColors();  // Theme Colors — use throughout

  function getGraphStyle() {
    return [
      // ── Node defaults ──
      {
        selector: 'node',
        style: {
          'font-family': 'JetBrains Mono, monospace',
          'font-size': '10px',
          'color': TC.text,
          'text-valign': 'center',
          'text-halign': 'center',
          'text-wrap': 'wrap',
          'text-max-width': '120px',
          'background-opacity': 0.85,
          'border-width': 1.5,
          'label': 'data(label)',
          'transition-property': 'background-color, border-color, width, height, opacity',
          'transition-duration': '0.2s',
        }
      },
      // ── Edge defaults ──
      {
        selector: 'edge',
        style: {
          'width': 1,
          'line-color': TC.textMuted,
          'target-arrow-color': TC.textMuted,
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          'opacity': 0.6,
        }
      },

      // ── File nodes (round-rectangle, sky blue) ──
      { selector: 'node[type="file"]',
        style: { 'shape': 'round-rectangle', 'width': 140, 'height': 55, 'font-size': '10px', 'font-weight': '600',
                 'background-color': 'rgba(8, 51, 68, 0.85)', 'border-color': '#38bdf8' } },
      { selector: 'node[tier="core"]', style: { 'width': 160 } },
      { selector: 'node[tier="utility"]', style: { 'width': 120 } },

      // ── Class nodes (hexagon, violet) ──
      { selector: 'node[type="class"]',
        style: { 'shape': 'hexagon', 'width': 110, 'height': 95, 'font-size': '9px', 'font-weight': '600',
                 'background-color': 'rgba(76, 29, 149, 0.85)', 'border-color': '#a78bfa' } },

      // ── Function nodes (ellipse, emerald) ──
      { selector: 'node[type="function"]',
        style: { 'shape': 'ellipse', 'width': 125, 'height': 48, 'font-size': '9px', 'font-weight': '500',
                 'background-color': 'rgba(6, 78, 59, 0.85)', 'border-color': '#34d399' } },

      // ── Module nodes (diamond, amber) ──
      { selector: 'node[type="module"]',
        style: { 'shape': 'diamond', 'width': 80, 'height': 80, 'font-size': '9px', 'font-weight': '600',
                 'background-color': 'rgba(120, 53, 15, 0.85)', 'border-color': '#fbbf24' } },

      // ── Edge: imports (file → file, solid arrow) ──
      { selector: 'edge[type="imports"]',
        style: { 'line-style': 'solid', 'width': 1.5, 'line-color': '#475569', 'target-arrow-shape': 'triangle' } },
      // ── Edge: calls (function → function, dashed arrow) ──
      { selector: 'edge[type="calls"]',
        style: { 'line-style': 'dashed', 'width': 1, 'line-color': '#94a3b8', 'target-arrow-shape': 'triangle' } },
      // ── Edge: inherits (class → class, bold solid violet arrow) ──
      { selector: 'edge[type="inherits"]',
        style: { 'line-style': 'solid', 'width': 2, 'line-color': '#a78bfa', 'target-arrow-shape': 'triangle' } },
      // ── Edge: contains (file → class/function, thin solid no arrow) ──
      { selector: 'edge[type="contains"]',
        style: { 'line-style': 'solid', 'width': 0.8, 'line-color': '#475569', 'target-arrow-shape': 'none', 'curve-style': 'unbundled-bezier' } },
      // ── Edge: exports (file → file, dotted cyan arrow) ──
      { selector: 'edge[type="exports"]',
        style: { 'line-style': 'dotted', 'width': 1, 'line-color': '#22d3ee', 'target-arrow-shape': 'triangle' } },

      // ── Interaction states ──
      { selector: 'node:selected',
        style: { 'border-width': 3, 'border-color': TC.text, 'shadow-blur': 12, 'shadow-color': '#22d3ee', 'shadow-opacity': 0.4 } },
      { selector: 'node.highlight', style: { 'border-width': 2.5, 'border-color': TC.text, 'opacity': 1 } },
      { selector: 'edge.highlight', style: { 'opacity': 1, 'width': 2 } },
      { selector: 'node.dimmed', style: { 'opacity': 0.12 } },
      { selector: 'edge.dimmed', style: { 'opacity': 0.04 } },
      { selector: 'node.search-hit',
        style: { 'border-width': 3, 'border-color': TC.chart1, 'shadow-blur': 16, 'shadow-color': '#fbbf24', 'shadow-opacity': 0.6 } },
    ];
  }

  /* ════════════════════════════════════════════════════════════════════════
   * LAYOUT SWITCHER
   * ════════════════════════════════════════════════════════════════════════ */

  window.switchLayout = function(name) {
    let opts = { animate: true, animationDuration: 600 };
    if (name === 'cose-bilkent') {
      opts = { ...opts, name: 'cose-bilkent', nodeRepulsion: 8000, idealEdgeLength: 120, gravity: 0.3, numIter: 2000, tile: true };
    } else if (name === 'dagre') {
      opts = { ...opts, name: 'dagre', rankDir: 'LR', nodeSep: 60, edgeSep: 20, rankSep: 100 };
    } else if (name === 'dagre-tb') {
      opts = { ...opts, name: 'dagre', rankDir: 'TB', nodeSep: 60, edgeSep: 20, rankSep: 100 };
    } else if (name === 'breadthfirst') {
      opts = { ...opts, name: 'breadthfirst', directed: true, spacingFactor: 1.5 };
    } else if (name === 'concentric') {
      opts = { ...opts, name: 'concentric', concentric: function(n) {
        var t = n.data('type');
        return t === 'module' ? 3 : t === 'file' ? 2 : t === 'class' ? 1 : 0;
      }, minNodeSpacing: 40 };
    } else if (name === 'grid') {
      opts = { ...opts, name: 'grid', cols: Math.ceil(Math.sqrt(cy.nodes().length)) };
    } else if (name === 'circle') {
      opts = { ...opts, name: 'circle', radius: Math.max(200, cy.nodes().length * 15) };
    }
    cy.layout(opts).run();
  };

  /* ════════════════════════════════════════════════════════════════════════
   * SEARCH
   * ════════════════════════════════════════════════════════════════════════ */

  let searchTimeout;
  window.doSearch = function(query) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function() {
      cy.nodes().removeClass('search-hit dimmed');
      cy.edges().removeClass('dimmed');
      if (!query || query.length < 1) { fitGraph(); return; }
      var q = query.toLowerCase();
      var found = false;
      cy.nodes().forEach(function(n) {
        var label = (n.data('label') || '').toLowerCase();
        var path = (n.data('path') || '').toLowerCase();
        var module = (n.data('module') || '').toLowerCase();
        var cls = (n.data('class') || '').toLowerCase();
        var role = (n.data('role') || '').toLowerCase();
        var category = (n.data('category') || '').toLowerCase();
        if (label.indexOf(q) !== -1 || path.indexOf(q) !== -1 || module.indexOf(q) !== -1 ||
            cls.indexOf(q) !== -1 || role.indexOf(q) !== -1 || category.indexOf(q) !== -1) {
          n.addClass('search-hit').removeClass('dimmed');
          found = true;
        } else {
          n.addClass('dimmed');
        }
      });
      // Dim edges not connected to any search-hit node
      if (found) {
        cy.edges().forEach(function(e) {
          if (e.source().hasClass('search-hit') || e.target().hasClass('search-hit')) {
            e.removeClass('dimmed');
          } else {
            e.addClass('dimmed');
          }
        });
        cy.fit(cy.nodes('.search-hit'), 80);
      }
    }, 250);
  };

  /* ════════════════════════════════════════════════════════════════════════
   * FILTER BY MODULE
   * ════════════════════════════════════════════════════════════════════════ */

  window.filterByModule = function(moduleName, btn) {
    document.querySelectorAll('#module-filters .filter-btn').forEach(function(b) { b.classList.remove('active'); });
    if (btn) btn.classList.add('active');

    if (moduleName === 'all') {
      cy.nodes().style('display', 'element');
      cy.edges().style('display', 'element');
      fitGraph();
      return;
    }

    cy.nodes().forEach(function(n) {
      var t = n.data('type');
      if (t === 'file') {
        n.style('display', (n.data('module') || '') === moduleName ? 'element' : 'none');
      } else if (t === 'class' || t === 'function' || t === 'module') {
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

  /* ════════════════════════════════════════════════════════════════════════
   * CLICK → DETAIL PANEL
   * ════════════════════════════════════════════════════════════════════════ */

  cy.on('tap', 'node', function(evt) {
    var node = evt.target;
    updateDetail(node.data(), node);
  });

  cy.on('tap', function(evt) {
    if (evt.target === cy) {
      document.getElementById('detail-content').innerHTML = '<div class="detail-empty">Click a node<br>to see details</div>';
    }
  });

  function updateDetail(data, node) {
    var container = document.getElementById('detail-content');
    var type = data.type;
    var html = '';

    /* ═══════════════════════════════════════════════════════════════
     * CODE GRAPH TYPES: file, class, function, module
     * Use Cytoscape node for edge traversal (requires node param).
     * ═══════════════════════════════════════════════════════════════ */

    if (type === 'file' && node) {
      // ── Header ──
      html += '<div class="detail-header">';
      html += '<div class="detail-icon type-file">📄</div>';
      html += '<div class="detail-header-info">';
      html += '<h3>' + escHtml(data.label || data.id) + '</h3>';
      html += '<span class="detail-type-tag type-file">' + (data.tier || 'file') + ' tier</span>';
      html += '</div></div>';

      // ── Meta ──
      html += '<div class="detail-meta">';
      html += '<div class="detail-meta-row"><span class="dm-label">Path</span><code>' + escHtml(data.path || '—') + '</code></div>';
      html += '<div class="detail-meta-row"><span class="dm-label">Lines</span><span class="dm-value">' + (data.lines || '—') + '</span></div>';
      if (data.module) html += '<div class="detail-meta-row"><span class="dm-label">Module</span><span class="dm-value" style="color:var(--module)">' + escHtml(data.module) + '</span></div>';
      html += '</div>';

      // ── Summary chips ──
      var defs = node.connectedEdges('[type="contains"]').targets().filter(function(n) { return n.id() !== data.id; });
      var defClasses = defs.filter('[type="class"]'), defFuncs = defs.filter('[type="function"]');
      var imps = node.connectedEdges('[type="imports"]').targets().filter(function(n) { return n.id() !== data.id; });
      var impBy = node.connectedEdges('[type="imports"]').sources().filter(function(n) { return n.id() !== data.id; });
      html += '<div class="detail-chip-row">';
      html += '<span class="detail-chip chip-class">' + defClasses.length + ' classes</span>';
      html += '<span class="detail-chip chip-func">' + defFuncs.length + ' functions</span>';
      html += '<span class="detail-chip chip-import">' + imps.length + ' imports</span>';
      html += '<span class="detail-chip chip-imported">' + impBy.length + ' imported-by</span>';
      html += '</div>';

      // ── Defines ──
      if (defClasses.length + defFuncs.length > 0) {
        html += '<div class="detail-section"><div class="detail-section-title">📦 Defined Symbols <span class="detail-count">' + (defClasses.length + defFuncs.length) + '</span></div><ul class="detail-conn-list">';
        defClasses.forEach(function(n) { html += '<li onclick="focusNode(\'' + n.id() + '\')"><span class="detail-entity-icon">⬡</span><span class="detail-stat-chip chip-class">class</span>' + escHtml(n.data('label')) + '</li>'; });
        defFuncs.forEach(function(n) { html += '<li onclick="focusNode(\'' + n.id() + '\')"><span class="detail-entity-icon">○</span><span class="detail-stat-chip chip-func">func</span>' + escHtml(n.data('label')) + '</li>'; });
        html += '</ul></div>';
      }
      // ── Imports / Imported-by ──
      if (imps.length) { html += '<div class="detail-section"><div class="detail-section-title">→ Imports <span class="detail-count">' + imps.length + '</span></div><ul class="detail-conn-list">'; imps.forEach(function(n) { html += '<li onclick="focusNode(\'' + n.id() + '\')">' + escHtml(n.data('label')) + ' <span class="detail-sub">' + escHtml(n.data('path') || '') + '</span></li>'; }); html += '</ul></div>'; }
      if (impBy.length) { html += '<div class="detail-section"><div class="detail-section-title">← Imported By <span class="detail-count">' + impBy.length + '</span></div><ul class="detail-conn-list">'; impBy.forEach(function(n) { html += '<li onclick="focusNode(\'' + n.id() + '\')">' + escHtml(n.data('label')) + ' <span class="detail-sub">' + escHtml(n.data('path') || '') + '</span></li>'; }); html += '</ul></div>'; }

    } else if (type === 'class' && node) {
      html += '<div class="detail-header"><div class="detail-icon type-class">⬡</div><div class="detail-header-info"><h3>' + escHtml(data.label || data.id) + '</h3><span class="detail-type-tag type-class">' + (data.category || 'class') + '</span></div></div>';
      html += '<div class="detail-meta">';
      if (data.file) { var fNode = cy.getElementById(data.file); html += '<div class="detail-meta-row"><span class="dm-label">File</span><code onclick="focusNode(\'' + escHtml(data.file) + '\')" style="cursor:pointer;color:var(--file)">' + escHtml(fNode.length ? fNode.data('path') || fNode.data('label') : data.file) + '</code></div>'; }
      if (data.methodCount) html += '<div class="detail-meta-row"><span class="dm-label">Methods</span><span class="dm-value">' + data.methodCount + '</span></div>';
      html += '</div>';
      var bases = node.connectedEdges('[type="inherits"]').targets().filter(function(n) { return n.id() !== data.id; });
      var subs = node.connectedEdges('[type="inherits"]').sources().filter(function(n) { return n.id() !== data.id && n.data('type') === 'class'; });
      var methods = []; if (data.file) { var fn = cy.getElementById(data.file); if (fn.length) methods = fn.connectedEdges('[type="contains"]').targets().filter(function(n) { return n.data('type') === 'function' && n.data('class') === data.label; }); }
      html += '<div class="detail-chip-row"><span class="detail-chip chip-class">' + methods.length + ' methods</span>'; if (bases.length) html += '<span class="detail-chip chip-inherit">extends ' + bases.length + '</span>'; if (subs.length) html += '<span class="detail-chip chip-inherit">' + subs.length + ' subclasses</span>'; html += '</div>';
      if (bases.length) { html += '<div class="detail-section"><div class="detail-section-title">⬆ Extends <span class="detail-count">' + bases.length + '</span></div><ul class="detail-conn-list">'; bases.forEach(function(n) { html += '<li onclick="focusNode(\'' + n.id() + '\')"><span class="detail-entity-icon">⬡</span>' + escHtml(n.data('label')) + '</li>'; }); html += '</ul></div>'; }
      if (subs.length) { html += '<div class="detail-section"><div class="detail-section-title">⬇ Extended By <span class="detail-count">' + subs.length + '</span></div><ul class="detail-conn-list">'; subs.forEach(function(n) { html += '<li onclick="focusNode(\'' + n.id() + '\')"><span class="detail-entity-icon">⬡</span>' + escHtml(n.data('label')) + '</li>'; }); html += '</ul></div>'; }
      if (methods.length) { html += '<div class="detail-section"><div class="detail-section-title">⚙ Methods <span class="detail-count">' + methods.length + '</span></div><ul class="detail-conn-list">'; methods.forEach(function(n) { html += '<li onclick="focusNode(\'' + n.id() + '\')"><span class="detail-entity-icon">○</span>' + escHtml(n.data('label')) + '</li>'; }); html += '</ul></div>'; }

    } else if (type === 'function' && node) {
      html += '<div class="detail-header"><div class="detail-icon type-function">○</div><div class="detail-header-info"><h3>' + escHtml(data.label || data.id) + '</h3><span class="detail-type-tag type-function">' + (data.role || 'function') + '</span></div></div>';
      html += '<div class="detail-meta">';
      if (data.file) { var fNode = cy.getElementById(data.file); html += '<div class="detail-meta-row"><span class="dm-label">File</span><code onclick="focusNode(\'' + escHtml(data.file) + '\')" style="cursor:pointer;color:var(--file)">' + escHtml(fNode.length ? fNode.data('path') || fNode.data('label') : data.file) + '</code></div>'; }
      if (data.class) html += '<div class="detail-meta-row"><span class="dm-label">Class</span><span class="dm-value" style="color:var(--class)">' + escHtml(data.class) + '</span></div>';
      html += '<div class="detail-meta-row"><span class="dm-label">Role</span><span class="dm-value">' + (data.role || 'unknown') + '</span></div>';
      html += '</div>';
      var callTgts = node.connectedEdges('[type="calls"]').targets().filter(function(n) { return n.id() !== data.id; });
      var callers = node.connectedEdges('[type="calls"]').sources().filter(function(n) { return n.id() !== data.id; });
      html += '<div class="detail-chip-row"><span class="detail-chip chip-call">calls ' + callTgts.length + '</span><span class="detail-chip chip-caller">called-by ' + callers.length + '</span></div>';
      if (callTgts.length) { html += '<div class="detail-section"><div class="detail-section-title">→ Calls <span class="detail-count">' + callTgts.length + '</span></div><ul class="detail-conn-list">'; callTgts.forEach(function(n) { html += '<li onclick="focusNode(\'' + n.id() + '\')"><span class="detail-entity-icon">○</span>' + escHtml(n.data('label')) + '</li>'; }); html += '</ul></div>'; }
      if (callers.length) { html += '<div class="detail-section"><div class="detail-section-title">← Called By <span class="detail-count">' + callers.length + '</span></div><ul class="detail-conn-list">'; callers.forEach(function(n) { html += '<li onclick="focusNode(\'' + n.id() + '\')"><span class="detail-entity-icon">○</span>' + escHtml(n.data('label')) + '</li>'; }); html += '</ul></div>'; }

    } else if (type === 'module' && node) {
      html += '<div class="detail-header"><div class="detail-icon type-module">◇</div><div class="detail-header-info"><h3>' + escHtml(data.label || data.id) + '</h3><span class="detail-type-tag type-module">package</span></div></div>';
      html += '<div class="detail-meta">';
      if (data.path) html += '<div class="detail-meta-row"><span class="dm-label">Path</span><code>' + escHtml(data.path) + '</code></div>';
      if (data.submoduleCount !== undefined) html += '<div class="detail-meta-row"><span class="dm-label">Sub-pkgs</span><span class="dm-value">' + data.submoduleCount + '</span></div>';
      html += '</div>';
      var containedFiles = cy.nodes('[type="file"]').filter(function(n) { return n.data('module') === data.label; });
      var exportsList = node.connectedEdges('[type="exports"]').targets().filter(function(n) { return n.id() !== data.id; });
      html += '<div class="detail-chip-row"><span class="detail-chip chip-file">' + containedFiles.length + ' files</span>'; if (exportsList.length) html += '<span class="detail-chip chip-export">' + exportsList.length + ' exports</span>'; html += '</div>';
      if (containedFiles.length) { html += '<div class="detail-section"><div class="detail-section-title">📄 Contained Files <span class="detail-count">' + containedFiles.length + '</span></div><ul class="detail-conn-list">'; containedFiles.forEach(function(n) { html += '<li onclick="focusNode(\'' + n.id() + '\')"><span class="detail-entity-icon">📄</span>' + escHtml(n.data('label')) + ' <span class="detail-stat-chip chip-tier">' + escHtml(n.data('tier') || '') + '</span></li>'; }); html += '</ul></div>'; }
      if (exportsList.length) { html += '<div class="detail-section"><div class="detail-section-title">⇢ Public API <span class="detail-count">' + exportsList.length + '</span></div><ul class="detail-conn-list">'; exportsList.forEach(function(n) { html += '<li onclick="focusNode(\'' + n.id() + '\')">' + escHtml(n.data('label')) + '</li>'; }); html += '</ul></div>'; }

    /* ═══════════════════════════════════════════════════════════════
     * KNOWLEDGE GRAPH TYPES: card, tag, badge, link_dest, cluster
     * ═══════════════════════════════════════════════════════════════ */

    } else if (type === 'card') {
      var nRef = node || cy.getElementById(data.id);
      var connectedTags = nRef.connectedEdges('[type="has_tag"]').length;
      var connectedCards = nRef.connectedEdges('[type="shares_tag"], [type="shares_badge"], [type="depends_on"], [type="related_to"], [type="extends"], [type="implements"]').map(function(e) {
        var other = e.source().id() === data.id ? e.target() : e.source();
        return { id: other.id(), label: other.data('label') };
      });
      var connectedLinks = nRef.connectedEdges('[type="links_to"]').length;
      html = '<div class="detail-header">';
      html += '<h3>' + escHtml(data.label || data.id) + '</h3>';
      if (data.badge) html += '<span class="detail-badge badge-' + badgeClass(data.badge) + '">' + escHtml(data.badge) + '</span>';
      html += '</div>';
      if (data.desc) html += '<div class="detail-desc">' + data.desc + '</div>';
      if (data.tags && data.tags.length) {
        html += '<div class="detail-section-title">Tags</div><div class="detail-tags">';
        data.tags.forEach(function(t) { var mod = t.modifier || 'info'; html += '<span class="detail-tag tag-' + mod + '">' + escHtml(t.text || t) + '</span>'; });
        html += '</div>';
      }
      if (data.meta) html += '<div class="detail-meta">' + escHtml(data.meta) + '</div>';
      if (data.links && data.links.length) {
        html += '<div class="detail-section-title">Links (' + data.links.length + ')</div><div class="detail-links">';
        data.links.forEach(function(l) { html += '<a class="detail-link" href="' + escHtml(l.href) + '" target="_blank" rel="noopener">' + (l.label || l.href) + '</a>'; });
        html += '</div>';
      }
      html += '<div class="detail-stats">' + connectedTags + ' tags · ' + connectedCards.length + ' related cards · ' + connectedLinks + ' links';
      if (data.richness) html += ' · Richness: ' + data.richness;
      html += '</div>';
      var seen = {}; var uniqueCards = connectedCards.filter(function(c) { return seen[c.id] ? false : (seen[c.id] = true); });
      if (uniqueCards.length) { html += '<div class="detail-section-title">Related Cards (' + uniqueCards.length + ')</div><ul class="detail-conn-list">'; uniqueCards.forEach(function(c) { html += '<li onclick="focusNode(\'' + c.id + '\')">' + escHtml(c.label) + '</li>'; }); html += '</ul>'; }

    } else if (type === 'tag') {
      var nRef = node || cy.getElementById(data.id);
      var cards = nRef.connectedEdges('[type="has_tag"]').map(function(e) { var c = e.source().data('type') === 'card' ? e.source() : e.target(); return { id: c.id(), label: c.data('label') }; });
      html = '<div class="detail-header"><h3>🏷️ ' + escHtml(data.label) + '</h3></div>';
      html += '<div class="detail-meta">Modifier: ' + escHtml(data.modifier || 'info') + ' · Used by ' + cards.length + ' cards</div>';
      if (cards.length) { html += '<div class="detail-section-title">Cards with this tag</div><ul class="detail-conn-list">'; cards.forEach(function(c) { html += '<li onclick="focusNode(\'' + c.id + '\')">' + escHtml(c.label) + '</li>'; }); html += '</ul>'; }

    } else if (type === 'badge') {
      var nRef = node || cy.getElementById(data.id);
      var cards = nRef.connectedEdges('[type="has_badge"]').map(function(e) { var c = e.source().data('type') === 'card' ? e.source() : e.target(); return { id: c.id(), label: c.data('label') }; });
      html = '<div class="detail-header"><h3>🔖 ' + escHtml(data.label) + '</h3></div>';
      html += '<div class="detail-meta">' + cards.length + ' cards</div>';
      if (cards.length) { html += '<ul class="detail-conn-list">'; cards.forEach(function(c) { html += '<li onclick="focusNode(\'' + c.id + '\')">' + escHtml(c.label) + '</li>'; }); html += '</ul>'; }

    } else if (type === 'link_dest') {
      var nRef = node || cy.getElementById(data.id);
      var cards = nRef.connectedEdges('[type="links_to"]').map(function(e) { var c = e.source().data('type') === 'card' ? e.source() : e.target(); return { id: c.id(), label: c.data('label') }; });
      html = '<div class="detail-header"><h3>🔗 ' + escHtml(data.label) + '</h3></div>';
      if (data.url) html += '<a class="detail-link" href="' + escHtml(data.url) + '" target="_blank" rel="noopener">' + escHtml(data.url) + '</a>';
      html += '<div class="detail-meta">Referenced by ' + cards.length + ' cards</div>';
      if (cards.length) { html += '<ul class="detail-conn-list">'; cards.forEach(function(c) { html += '<li onclick="focusNode(\'' + c.id + '\')">' + escHtml(c.label) + '</li>'; }); html += '</ul>'; }

    } else if (type === 'cluster') {
      var memberCards = []; if (data.memberCards) { memberCards = data.memberCards.map(function(id) { var n = cy.getElementById(id); return n.length ? { id: id, label: n.data('label') } : null; }).filter(Boolean); }
      html = '<div class="detail-header"><h3>📦 ' + escHtml(data.label) + '</h3></div>';
      html += '<div class="detail-meta">Tag cluster · ' + (data.memberTags || []).length + ' tags · ' + memberCards.length + ' cards</div>';
      if (data.memberTags && data.memberTags.length) { html += '<div class="detail-section-title">Member Tags</div><div class="detail-tags">'; data.memberTags.forEach(function(t) { html += '<span class="detail-tag tag-info">' + escHtml(t) + '</span>'; }); html += '</div>'; }
      if (memberCards.length) { html += '<div class="detail-section-title">Cards in cluster</div><ul class="detail-conn-list">'; memberCards.forEach(function(c) { html += '<li onclick="focusNode(\'' + c.id + '\')">' + escHtml(c.label) + '</li>'; }); html += '</ul>'; }
    }

    container.innerHTML = html;
  }

  window.focusNode = function(id) {
    var node = cy.getElementById(id);
    if (!node || !node.length) return;
    cy.nodes().removeClass('search-hit dimmed');
    node.addClass('search-hit');
    cy.animate({ center: { eles: node }, zoom: 1.5 }, { duration: 400 });
    updateDetail(node.data(), node);
  };

  /* ════════════════════════════════════════════════════════════════════════
   * HOVER → NEIGHBOR HIGHLIGHT
   * ════════════════════════════════════════════════════════════════════════ */

  cy.on('mouseover', 'node', function(evt) {
    var node = evt.target;
    var neighborhood = node.closedNeighborhood();
    cy.nodes().not(neighborhood).addClass('dimmed');
    cy.edges().not(neighborhood.edges()).addClass('dimmed');
    neighborhood.nodes().addClass('highlight');
    neighborhood.edges().addClass('highlight');
  });

  cy.on('mouseout', 'node', function() {
    cy.nodes().removeClass('highlight dimmed');
    cy.edges().removeClass('highlight dimmed');
  });

  /* ════════════════════════════════════════════════════════════════════════
   * VIEW CONTROLS
   * ════════════════════════════════════════════════════════════════════════ */

  window.resetView = function() {
    cy.nodes().removeClass('search-hit dimmed');
    cy.edges().removeClass('dimmed');
    document.getElementById('search-input').value = '';
    // Re-activate the "All" filter button
    var allBtn = document.querySelector('#module-filters .filter-btn');
    window.filterByModule('all', allBtn);
    fitGraph();
  };

  window.fitGraph = function() {
    cy.fit(undefined, 60);
    cy.center();
  };

  /* ════════════════════════════════════════════════════════════════════════
   * EXPORT
   * ════════════════════════════════════════════════════════════════════════ */

  window.downloadPNG = function() {
    try {
      var png = cy.png({ full: true, scale: 2, bg: TC.bg });
      var link = document.createElement('a');
      link.download = 'graph.png';
      link.href = png;
      link.click();
      showToast('PNG downloaded ✓');
    } catch(e) {
      showToast('Export failed: ' + e.message);
    }
  };

  /* ════════════════════════════════════════════════════════════════════════
   * DETAIL PANEL TOGGLE
   * ════════════════════════════════════════════════════════════════════════ */

  var detailOpen = true;
  window.toggleDetail = function() {
    var panel = document.getElementById('detail-panel');
    detailOpen = !detailOpen;
    panel.classList.toggle('collapsed', !detailOpen);
    document.querySelector('.detail-toggle').textContent = detailOpen ? '◀' : '▶';
    setTimeout(function() { cy.resize(); }, 350);
  };

  /* ════════════════════════════════════════════════════════════════════════
   * HELPERS
   * ════════════════════════════════════════════════════════════════════════ */

  function escHtml(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function badgeClass(badge) {
    if (!badge) return '';
    var b = badge.toLowerCase();
    if (b.indexOf('core') !== -1 || b.indexOf('核心') !== -1) return 'badge-core';
    if (b.indexOf('report') !== -1 || b.indexOf('报告') !== -1) return 'badge-report';
    if (b.indexOf('guide') !== -1 || b.indexOf('指南') !== -1) return 'badge-guide';
    if (b.indexOf('oss') !== -1) return 'badge-oss';
    if (b.indexOf('agent') !== -1) return 'badge-agent';
    if (b.indexOf('beta') !== -1) return 'badge-beta';
    return '';
  }

  function showToast(msg) {
    var toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function() { toast.classList.remove('show'); }, 2000);
  }

  /* ════════════════════════════════════════════════════════════════════════
   * INIT — Populate title, sidebar stats, legend, badge filters
   * ════════════════════════════════════════════════════════════════════════ */

  function initUI() {
    // Title
    var meta = DATA.meta || {};
    if (meta.source) {
      document.getElementById('graph-title').textContent = 'Source Graph';
      document.getElementById('graph-subtitle').textContent = meta.source;
    }

    // Stats
    var cards = cy.nodes('[type="card"]');
    var tags = cy.nodes('[type="tag"]');
    var badges = cy.nodes('[type="badge"]');
    var linkDests = cy.nodes('[type="link_dest"]');
    var clusters = cy.nodes('[type="cluster"]');

    var statsHtml = '';
    if (cards.length) statsHtml += '<div class="stat-row"><span class="stat-label">Cards</span><span class="stat-val">' + cards.length + '</span></div>';
    if (tags.length) statsHtml += '<div class="stat-row"><span class="stat-label">Tags</span><span class="stat-val">' + tags.length + '</span></div>';
    if (badges.length) statsHtml += '<div class="stat-row"><span class="stat-label">Badges</span><span class="stat-val">' + badges.length + '</span></div>';
    if (linkDests.length) statsHtml += '<div class="stat-row"><span class="stat-label">Links</span><span class="stat-val">' + linkDests.length + '</span></div>';
    if (clusters.length) statsHtml += '<div class="stat-row"><span class="stat-label">Clusters</span><span class="stat-val">' + clusters.length + '</span></div>';
    statsHtml += '<div class="stat-row"><span class="stat-label">Edges</span><span class="stat-val">' + cy.edges().length + '</span></div>';
    document.getElementById('stats-content').innerHTML = statsHtml;

    // Legend — nodes
    var nodeLegend = '';
    var nodeColors = [
      ['Core/核心', '#34d399', 'rgba(6, 78, 59, 0.85)'],
      ['Report/报告', '#fb7185', 'rgba(136, 19, 55, 0.85)'],
      ['Guide/指南', '#38bdf8', 'rgba(8, 51, 68, 0.85)'],
      ['OSS', '#fbbf24', 'rgba(120, 53, 15, 0.85)'],
      ['Agent', '#a78bfa', 'rgba(76, 29, 149, 0.85)'],
      ['Tag', '#64748b', 'rgba(100, 116, 139, 0.2)'],
      ['Link Dest', '#64748b', 'rgba(71, 85, 105, 0.4)'],
    ];
    nodeColors.forEach(function(pair) {
      nodeLegend += '<div class="legend-item"><span class="legend-dot" style="border:1.5px solid ' + pair[1] + ';background:' + pair[2] + '"></span>' + pair[0] + '</div>';
    });
    document.getElementById('legend-nodes').innerHTML = nodeLegend;

    // Legend — edges
    document.getElementById('legend-edges').innerHTML =
      '<div class="legend-item"><span class="legend-line" style="background:#475569"></span> has_tag (solid)</div>' +
      '<div class="legend-item"><span class="legend-line" style="background:#94a3b8;border-top:1.5px dashed #94a3b8"></span> shares_tag (dashed)</div>' +
      '<div class="legend-item"><span class="legend-line" style="background:#475569;border-top:1.5px dotted #475569"></span> links_to (dotted)</div>' +
      '<div class="legend-item"><span class="legend-line" style="background:#22d3ee"></span> depends_on (cyan)</div>';

    // Module filter buttons
    var uniqueModules = [];
    var seenMods = {};
    files.forEach(function(f) {
      var m = f.data('module');
      if (m && !seenMods[m]) { seenMods[m] = true; uniqueModules.push(m); }
    });
    uniqueModules.sort();
    var filterHtml = '<span class="toolbar-label">Module</span>';
    filterHtml += '<button class="filter-btn active" onclick="filterByModule(\'all\', this)">All</button>';
    uniqueModules.forEach(function(m) {
      filterHtml += '<button class="filter-btn" onclick="filterByModule(\'' + escHtml(m) + '\', this)">' + escHtml(m) + '</button>';
    });
    document.getElementById('module-filters').innerHTML = filterHtml;
  }

  cy.ready(function() {
    initUI();
    fitGraph();
  });

  // Handle resize
  window.addEventListener('resize', function() { cy.resize(); });

  // Keyboard shortcuts
  window.addEventListener('keydown', function(e) {
    if (e.key === 'f' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      document.getElementById('search-input').focus();
    }
    if (e.key === 'Escape') {
      cy.nodes().removeClass('search-hit dimmed');
      cy.edges().removeClass('dimmed');
      document.getElementById('search-input').value = '';
      fitGraph();
    }
    if (e.key === 'r' || e.key === 'R') {
      if (document.activeElement !== document.getElementById('search-input')) {
        window.resetView();
      }
    }
    if (e.key === 'f' || e.key === 'F') {
      if (document.activeElement !== document.getElementById('search-input')) {
        window.fitGraph();
      }
    }
  });

})();
