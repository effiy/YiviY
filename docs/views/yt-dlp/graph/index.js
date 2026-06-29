/* ════════════════════════════════════════════════════════════════════════
   yt-dlp — Code Dependency Graph Logic
   Reads window.GRAPH_DATA, initializes Cytoscape, wires all interactions.

   Node types: file, class, function, module
   Edge types: imports, calls, inherits, contains, exports

   Depends on: data.js (window.GRAPH_DATA), Cytoscape.js CDN,
               dagre, cytoscape-dagre, cytoscape-cose-bilkent
   ════════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  var DATA = window.GRAPH_DATA;
  if (!DATA || !DATA.elements) {
    console.error('yt-dlp graph: window.GRAPH_DATA not found. Ensure data.js is loaded before index.js.');
    return;
  }

  /* ════════════════════════════════════════════════════════════════════════
   * CY INIT
   * ════════════════════════════════════════════════════════════════════════ */

  var cy = cytoscape({
    container: document.getElementById('cy'),
    elements: DATA.elements,
    style: getGraphStyle(),
    layout: {
      name: 'cose-bilkent',
      animate: true,
      animationDuration: 800,
      nodeRepulsion: 12000,
      idealEdgeLength: 130,
      gravity: 0.3,
      numIter: 3000,
      tile: true,
    },
    minZoom: 0.15,
    maxZoom: 4,
  });

  /* ════════════════════════════════════════════════════════════════════════
   * GRAPH STYLE — Node/Edge visual mapping
   * ════════════════════════════════════════════════════════════════════════ */

  function getGraphStyle() {
    return [
      // ── Node defaults ──
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
          'line-color': '#475569',
          'target-arrow-color': '#475569',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          'opacity': 0.6,
        }
      },

      // ── File nodes (round-rectangle, sky blue) ──
      {
        selector: 'node[type="file"]',
        style: {
          'shape': 'round-rectangle',
          'width': 140, 'height': 55,
          'font-size': '10px', 'font-weight': '600',
          'background-color': 'rgba(8, 51, 68, 0.85)',
          'border-color': '#38bdf8',
        }
      },
      // Core files are wider
      {
        selector: 'node[tier="core"]',
        style: { 'width': 160 }
      },
      // Utility files are narrower
      {
        selector: 'node[tier="utility"]',
        style: { 'width': 120 }
      },

      // ── Class nodes (hexagon, violet) ──
      {
        selector: 'node[type="class"]',
        style: {
          'shape': 'hexagon',
          'width': 110, 'height': 95,
          'font-size': '9px', 'font-weight': '600',
          'background-color': 'rgba(76, 29, 149, 0.85)',
          'border-color': '#a78bfa',
        }
      },

      // ── Function nodes (ellipse, emerald) ──
      {
        selector: 'node[type="function"]',
        style: {
          'shape': 'ellipse',
          'width': 125, 'height': 48,
          'font-size': '9px', 'font-weight': '500',
          'background-color': 'rgba(6, 78, 59, 0.85)',
          'border-color': '#34d399',
        }
      },

      // ── Module nodes (diamond, amber) ──
      {
        selector: 'node[type="module"]',
        style: {
          'shape': 'diamond',
          'width': 80, 'height': 80,
          'font-size': '9px', 'font-weight': '600',
          'background-color': 'rgba(120, 53, 15, 0.85)',
          'border-color': '#fbbf24',
        }
      },

      // ── Edge: imports (file → file, solid arrow) ──
      {
        selector: 'edge[type="imports"]',
        style: { 'line-style': 'solid', 'width': 1.5, 'line-color': '#475569', 'target-arrow-shape': 'triangle' }
      },
      // ── Edge: calls (function → function, dashed arrow) ──
      {
        selector: 'edge[type="calls"]',
        style: { 'line-style': 'dashed', 'width': 1, 'line-color': '#94a3b8', 'target-arrow-shape': 'triangle' }
      },
      // ── Edge: inherits (class → class, bold solid violet arrow) ──
      {
        selector: 'edge[type="inherits"]',
        style: { 'line-style': 'solid', 'width': 2, 'line-color': '#a78bfa', 'target-arrow-shape': 'triangle' }
      },
      // ── Edge: contains (file → class/function, thin solid no arrow) ──
      {
        selector: 'edge[type="contains"]',
        style: { 'line-style': 'solid', 'width': 0.8, 'line-color': '#475569', 'target-arrow-shape': 'none', 'curve-style': 'bezier' }
      },
      // ── Edge: exports (file → file, dotted cyan arrow) ──
      {
        selector: 'edge[type="exports"]',
        style: { 'line-style': 'dotted', 'width': 1, 'line-color': '#22d3ee', 'target-arrow-shape': 'triangle' }
      },

      // ── Interaction states ──
      { selector: 'node:selected',
        style: { 'border-width': 3, 'border-color': '#f8fafc' } },
      { selector: 'node.highlight', style: { 'border-width': 2.5, 'border-color': '#f8fafc', 'opacity': 1 } },
      { selector: 'edge.highlight', style: { 'opacity': 1, 'width': 2 } },
      { selector: 'node.dimmed', style: { 'opacity': 0.12 } },
      { selector: 'edge.dimmed', style: { 'opacity': 0.04 } },
      { selector: 'node.search-hit',
        style: { 'border-width': 3, 'border-color': '#fbbf24' } },
    ];
  }

  /* ════════════════════════════════════════════════════════════════════════
   * LAYOUT SWITCHER (7 layouts)
   * ════════════════════════════════════════════════════════════════════════ */

  window.switchLayout = function(name) {
    var opts = { animate: true, animationDuration: 600 };
    if (name === 'cose-bilkent') {
      opts = Object.assign(opts, { name: 'cose-bilkent', nodeRepulsion: 12000, idealEdgeLength: 130, gravity: 0.3, numIter: 3000, tile: true });
    } else if (name === 'dagre') {
      opts = Object.assign(opts, { name: 'dagre', rankDir: 'LR', nodeSep: 60, edgeSep: 20, rankSep: 100 });
    } else if (name === 'dagre-tb') {
      opts = Object.assign(opts, { name: 'dagre', rankDir: 'TB', nodeSep: 60, edgeSep: 20, rankSep: 100 });
    } else if (name === 'breadthfirst') {
      opts = Object.assign(opts, { name: 'breadthfirst', directed: true, spacingFactor: 1.5 });
    } else if (name === 'concentric') {
      opts = Object.assign(opts, { name: 'concentric', concentric: function(n) {
        var t = n.data('type');
        return t === 'module' ? 3 : t === 'file' ? 2 : t === 'class' ? 1 : 0;
      }, minNodeSpacing: 40 });
    } else if (name === 'grid') {
      opts = Object.assign(opts, { name: 'grid', cols: Math.ceil(Math.sqrt(cy.nodes().length)) });
    } else if (name === 'circle') {
      opts = Object.assign(opts, { name: 'circle', radius: Math.max(200, cy.nodes().length * 15) });
    }
    cy.layout(opts).run();
  };

  /* ════════════════════════════════════════════════════════════════════════
   * SEARCH — Matching file paths, class names, function names
   * ════════════════════════════════════════════════════════════════════════ */

  var currentFilter = 'yt_dlp'; // Tracks active module filter ('all' or module name)
  var searchTimeout;
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
    currentFilter = moduleName;

    // Update toolbar filter buttons
    var tButtons = document.querySelectorAll('#module-filters .filter-btn');
    tButtons.forEach(function(b) { b.classList.remove('active'); });
    // Find the corresponding toolbar button and activate it
    if (moduleName === 'all') {
      var allBtn = document.querySelector('#module-filters .filter-btn');
      if (allBtn) allBtn.classList.add('active');
    } else {
      tButtons.forEach(function(b) {
        if (b.textContent === moduleName) b.classList.add('active');
      });
    }

    // Update sidebar module rows
    var sRows = document.querySelectorAll('#stats-modules .stat-module-row');
    sRows.forEach(function(r) { r.classList.remove('active'); });
    if (moduleName !== 'all') {
      var targetRow = document.querySelector('#stats-modules .stat-module-row[data-module="' + moduleName + '"]');
      if (targetRow) targetRow.classList.add('active');
    }

    if (moduleName === 'all') {
      cy.nodes().style('display', 'element');
      cy.edges().style('display', 'element');
      updateStats(null);
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
    updateStats(moduleName);
    fitGraph();
  };

  /* ════════════════════════════════════════════════════════════════════════
   * CLICK → DETAIL PANEL (type-specific)
   * ════════════════════════════════════════════════════════════════════════ */

  cy.on('tap', 'node', function(evt) {
    var node = evt.target;
    updateDetail(node);
  });

  cy.on('tap', function(evt) {
    if (evt.target === cy) {
      document.getElementById('detail-content').innerHTML = '<div class="detail-empty">Click a node<br>to see details</div>';
    }
  });

  function updateDetail(node) {
    var container = document.getElementById('detail-content');
    var data = node.data();
    var type = data.type;
    var html = '';

    if (type === 'file') {
      /* ═══════════════════════════════════════════════════════════════
       * FILE DETAIL — path, tier, size, module, defines, imports, etc.
       * ═══════════════════════════════════════════════════════════════ */

      // ── Header: filename + tier badge ──
      html += '<div class="detail-header">';
      html += '<div class="detail-icon type-file">📄</div>';
      html += '<div class="detail-header-info">';
      html += '<h3>' + escHtml(data.label || data.id) + '</h3>';
      html += '<span class="detail-type-tag type-file">' + (data.tier || 'file') + ' tier</span>';
      html += '</div>';
      html += '</div>';

      // ── Meta: path, lines, module ──
      html += '<div class="detail-meta">';
      html += '<div class="detail-meta-row"><span class="dm-label">Path</span><code>' + escHtml(data.path || '—') + '</code></div>';
      html += '<div class="detail-meta-row"><span class="dm-label">Lines</span><span class="dm-value">' + (data.lines || '—') + '</span></div>';
      if (data.module) {
        html += '<div class="detail-meta-row"><span class="dm-label">Module</span><span class="dm-value" style="color:var(--module)">' + escHtml(data.module) + '</span></div>';
      }
      html += '</div>';

      // ── Defines (classes + functions via contains edges) ──
      var defines = node.connectedEdges('[type="contains"]').targets()
        .filter(function(n) { return n.id() !== data.id; });
      var definedClasses = defines.filter('[type="class"]');
      var definedFuncs = defines.filter('[type="function"]');

      // ── Summary stat chips ──
      html += '<div class="detail-chip-row">';
      html += '<span class="detail-chip chip-class">' + definedClasses.length + ' classes</span>';
      html += '<span class="detail-chip chip-func">' + definedFuncs.length + ' functions</span>';
      var importCount = node.connectedEdges('[type="imports"]').targets().filter(function(n) { return n.id() !== data.id; }).length;
      var importedByCount = node.connectedEdges('[type="imports"]').sources().filter(function(n) { return n.id() !== data.id; }).length;
      html += '<span class="detail-chip chip-import">' + importCount + ' imports</span>';
      html += '<span class="detail-chip chip-imported">' + importedByCount + ' imported-by</span>';
      html += '</div>';

      // ── Defines section ──
      if (definedClasses.length + definedFuncs.length > 0) {
        html += '<div class="detail-section">';
        html += '<div class="detail-section-title">📦 Defined Symbols <span class="detail-count">' + (definedClasses.length + definedFuncs.length) + '</span></div>';
        html += '<ul class="detail-conn-list">';
        definedClasses.forEach(function(n) {
          html += '<li onclick="focusNode(\'' + n.id() + '\')"><span class="detail-entity-icon">⬡</span><span class="detail-stat-chip chip-class">class</span> ' + escHtml(n.data('label')) + '</li>';
        });
        definedFuncs.forEach(function(n) {
          html += '<li onclick="focusNode(\'' + n.id() + '\')"><span class="detail-entity-icon">○</span><span class="detail-stat-chip chip-func">func</span> ' + escHtml(n.data('label')) + '</li>';
        });
        html += '</ul>';
        html += '</div>';
      }

      // ── Imports section ──
      var imports = node.connectedEdges('[type="imports"]').targets()
        .filter(function(n) { return n.id() !== data.id; });
      if (imports.length) {
        html += '<div class="detail-section">';
        html += '<div class="detail-section-title">→ Imports <span class="detail-count">' + imports.length + '</span></div>';
        html += '<ul class="detail-conn-list">';
        imports.forEach(function(n) {
          html += '<li onclick="focusNode(\'' + n.id() + '\')">' + escHtml(n.data('label')) + ' <span class="detail-sub">' + escHtml(n.data('path') || '') + '</span></li>';
        });
        html += '</ul>';
        html += '</div>';
      }

      // ── Imported-by section ──
      var importedBy = node.connectedEdges('[type="imports"]').sources()
        .filter(function(n) { return n.id() !== data.id; });
      if (importedBy.length) {
        html += '<div class="detail-section">';
        html += '<div class="detail-section-title">← Imported By <span class="detail-count">' + importedBy.length + '</span></div>';
        html += '<ul class="detail-conn-list">';
        importedBy.forEach(function(n) {
          html += '<li onclick="focusNode(\'' + n.id() + '\')">' + escHtml(n.data('label')) + ' <span class="detail-sub">' + escHtml(n.data('path') || '') + '</span></li>';
        });
        html += '</ul>';
        html += '</div>';
      }

      // ── Exports section ──
      var exportsList = node.connectedEdges('[type="exports"]').targets()
        .filter(function(n) { return n.id() !== data.id; });
      if (exportsList.length) {
        html += '<div class="detail-section">';
        html += '<div class="detail-section-title">⇢ Re-exports <span class="detail-count">' + exportsList.length + '</span></div>';
        html += '<ul class="detail-conn-list">';
        exportsList.forEach(function(n) {
          var sym = '';
          var edgeData = node.connectedEdges('[type="exports"]').filter(function(e) { return e.target().id() === n.id(); });
          if (edgeData.length) sym = edgeData[0].data('symbol') || '';
          html += '<li onclick="focusNode(\'' + n.id() + '\')">' + escHtml(n.data('label'));
          if (sym) html += ' <span class="detail-symbol">' + escHtml(sym) + '</span>';
          html += '</li>';
        });
        html += '</ul>';
        html += '</div>';
      }

    } else if (type === 'class') {
      /* ═══════════════════════════════════════════════════════════════
       * CLASS DETAIL — name, file, inheritance, methods, subclasses
       * ═══════════════════════════════════════════════════════════════ */

      // ── Header ──
      html += '<div class="detail-header">';
      html += '<div class="detail-icon type-class">⬡</div>';
      html += '<div class="detail-header-info">';
      html += '<h3>' + escHtml(data.label || data.id) + '</h3>';
      html += '<span class="detail-type-tag type-class">' + (data.category || 'class') + '</span>';
      html += '</div>';
      html += '</div>';

      // ── Meta ──
      html += '<div class="detail-meta">';
      if (data.file) {
        var fileNode = cy.getElementById(data.file);
        html += '<div class="detail-meta-row"><span class="dm-label">File</span><code onclick="focusNode(\'' + escHtml(data.file) + '\')" style="cursor:pointer;color:var(--file)">' + escHtml(fileNode.length ? fileNode.data('path') || fileNode.data('label') : data.file) + '</code></div>';
      }
      if (data.methodCount) {
        html += '<div class="detail-meta-row"><span class="dm-label">Methods</span><span class="dm-value">' + data.methodCount + '</span></div>';
      }
      html += '</div>';

      // ── Summary chips ──
      var bases = node.connectedEdges('[type="inherits"]').targets()
        .filter(function(n) { return n.id() !== data.id; });
      var subs = node.connectedEdges('[type="inherits"]').sources()
        .filter(function(n) { return n.id() !== data.id && n.data('type') === 'class'; });
      // Methods
      var methods = [];
      if (data.file) {
        var fNode = cy.getElementById(data.file);
        if (fNode.length) {
          methods = fNode.connectedEdges('[type="contains"]').targets()
            .filter(function(n) { return n.data('type') === 'function' && n.data('class') === data.label; });
        }
      }
      html += '<div class="detail-chip-row">';
      html += '<span class="detail-chip chip-class">' + methods.length + ' methods</span>';
      if (bases.length) html += '<span class="detail-chip chip-inherit">extends ' + bases.length + '</span>';
      if (subs.length) html += '<span class="detail-chip chip-inherit">' + subs.length + ' subclasses</span>';
      html += '</div>';

      // ── Inheritance: Base Classes ──
      if (bases.length) {
        html += '<div class="detail-section">';
        html += '<div class="detail-section-title">⬆ Extends <span class="detail-count">' + bases.length + '</span></div>';
        html += '<ul class="detail-conn-list">';
        bases.forEach(function(n) {
          html += '<li onclick="focusNode(\'' + n.id() + '\')"><span class="detail-entity-icon">⬡</span>' + escHtml(n.data('label')) + '</li>';
        });
        html += '</ul>';
        html += '</div>';
      }

      // ── Subclasses ──
      if (subs.length) {
        html += '<div class="detail-section">';
        html += '<div class="detail-section-title">⬇ Extended By <span class="detail-count">' + subs.length + '</span></div>';
        html += '<ul class="detail-conn-list">';
        subs.forEach(function(n) {
          html += '<li onclick="focusNode(\'' + n.id() + '\')"><span class="detail-entity-icon">⬡</span>' + escHtml(n.data('label')) + '</li>';
        });
        html += '</ul>';
        html += '</div>';
      }

      // ── Methods ──
      if (methods.length) {
        html += '<div class="detail-section">';
        html += '<div class="detail-section-title">⚙ Methods <span class="detail-count">' + methods.length + '</span></div>';
        html += '<ul class="detail-conn-list">';
        methods.forEach(function(n) {
          var role = n.data('role') || '';
          html += '<li onclick="focusNode(\'' + n.id() + '\')"><span class="detail-entity-icon">○</span>' + escHtml(n.data('label'));
          if (role) html += ' <span class="detail-sub">' + escHtml(role) + '</span>';
          html += '</li>';
        });
        html += '</ul>';
        html += '</div>';
      }

    } else if (type === 'function') {
      /* ═══════════════════════════════════════════════════════════════
       * FUNCTION DETAIL — name, file, class, role, calls, called-by
       * ═══════════════════════════════════════════════════════════════ */

      // ── Header ──
      html += '<div class="detail-header">';
      html += '<div class="detail-icon type-function">○</div>';
      html += '<div class="detail-header-info">';
      html += '<h3>' + escHtml(data.label || data.id) + '</h3>';
      html += '<span class="detail-type-tag type-function">' + (data.role || 'function') + '</span>';
      html += '</div>';
      html += '</div>';

      // ── Meta ──
      html += '<div class="detail-meta">';
      if (data.file) {
        var fNode = cy.getElementById(data.file);
        html += '<div class="detail-meta-row"><span class="dm-label">File</span><code onclick="focusNode(\'' + escHtml(data.file) + '\')" style="cursor:pointer;color:var(--file)">' + escHtml(fNode.length ? fNode.data('path') || fNode.data('label') : data.file) + '</code></div>';
      }
      if (data.class) {
        html += '<div class="detail-meta-row"><span class="dm-label">Class</span><span class="dm-value" style="color:var(--class)">' + escHtml(data.class) + '</span></div>';
      }
      html += '<div class="detail-meta-row"><span class="dm-label">Role</span><span class="dm-value">' + (data.role || 'unknown') + '</span></div>';
      html += '</div>';

      // ── Call graph ──
      var callTargets = node.connectedEdges('[type="calls"]').targets()
        .filter(function(n) { return n.id() !== data.id; });
      var callers = node.connectedEdges('[type="calls"]').sources()
        .filter(function(n) { return n.id() !== data.id; });

      html += '<div class="detail-chip-row">';
      html += '<span class="detail-chip chip-call">calls ' + callTargets.length + '</span>';
      html += '<span class="detail-chip chip-caller">called-by ' + callers.length + '</span>';
      html += '</div>';

      // ── Calls ──
      if (callTargets.length) {
        html += '<div class="detail-section">';
        html += '<div class="detail-section-title">→ Calls <span class="detail-count">' + callTargets.length + '</span></div>';
        html += '<ul class="detail-conn-list">';
        callTargets.forEach(function(n) {
          var clsRef = n.data('class') || '';
          html += '<li onclick="focusNode(\'' + n.id() + '\')"><span class="detail-entity-icon">○</span>' + escHtml(n.data('label'));
          if (clsRef) html += ' <span class="detail-sub">' + escHtml(clsRef) + '.' + escHtml(n.data('label')) + '</span>';
          html += '</li>';
        });
        html += '</ul>';
        html += '</div>';
      }

      // ── Called By ──
      if (callers.length) {
        html += '<div class="detail-section">';
        html += '<div class="detail-section-title">← Called By <span class="detail-count">' + callers.length + '</span></div>';
        html += '<ul class="detail-conn-list">';
        callers.forEach(function(n) {
          html += '<li onclick="focusNode(\'' + n.id() + '\')"><span class="detail-entity-icon">○</span>' + escHtml(n.data('label')) + '</li>';
        });
        html += '</ul>';
        html += '</div>';
      }

    } else if (type === 'module') {
      /* ═══════════════════════════════════════════════════════════════
       * MODULE DETAIL — package name, path, sub-packages, files, exports
       * ═══════════════════════════════════════════════════════════════ */

      // ── Header ──
      html += '<div class="detail-header">';
      html += '<div class="detail-icon type-module">◇</div>';
      html += '<div class="detail-header-info">';
      html += '<h3>' + escHtml(data.label || data.id) + '</h3>';
      html += '<span class="detail-type-tag type-module">package</span>';
      html += '</div>';
      html += '</div>';

      // ── Meta ──
      html += '<div class="detail-meta">';
      if (data.path) {
        html += '<div class="detail-meta-row"><span class="dm-label">Path</span><code>' + escHtml(data.path) + '</code></div>';
      }
      if (data.submoduleCount !== undefined) {
        html += '<div class="detail-meta-row"><span class="dm-label">Sub-packages</span><span class="dm-value">' + data.submoduleCount + '</span></div>';
      }
      html += '</div>';

      // ── Contained files ──
      var containedFiles = cy.nodes('[type="file"]').filter(function(n) {
        return n.data('module') === data.label;
      });
      html += '<div class="detail-chip-row">';
      html += '<span class="detail-chip chip-file">' + containedFiles.length + ' files</span>';
      var exportCount = node.connectedEdges('[type="exports"]').targets().filter(function(n) { return n.id() !== data.id; }).length;
      if (exportCount) html += '<span class="detail-chip chip-export">' + exportCount + ' exports</span>';
      html += '</div>';

      // ── Files list ──
      if (containedFiles.length) {
        html += '<div class="detail-section">';
        html += '<div class="detail-section-title">📄 Contained Files <span class="detail-count">' + containedFiles.length + '</span></div>';
        html += '<ul class="detail-conn-list">';
        containedFiles.forEach(function(n) {
          var tier = n.data('tier') || '';
          html += '<li onclick="focusNode(\'' + n.id() + '\')"><span class="detail-entity-icon">📄</span>' + escHtml(n.data('label'));
          if (tier) html += ' <span class="detail-stat-chip chip-tier">' + escHtml(tier) + '</span>';
          html += '</li>';
        });
        html += '</ul>';
        html += '</div>';
      }

      // ── Exports ──
      var exportsList = node.connectedEdges('[type="exports"]').targets()
        .filter(function(n) { return n.id() !== data.id; });
      if (exportsList.length) {
        html += '<div class="detail-section">';
        html += '<div class="detail-section-title">⇢ Public API (Re-exports) <span class="detail-count">' + exportsList.length + '</span></div>';
        html += '<ul class="detail-conn-list">';
        exportsList.forEach(function(n) {
          var sym = '';
          var edgeData = node.connectedEdges('[type="exports"]').filter(function(e) { return e.target().id() === n.id(); });
          if (edgeData.length) sym = edgeData[0].data('symbol') || '';
          html += '<li onclick="focusNode(\'' + n.id() + '\')">' + escHtml(n.data('label'));
          if (sym) html += ' <span class="detail-symbol">' + escHtml(sym) + '</span>';
          html += '</li>';
        });
        html += '</ul>';
        html += '</div>';
      }
    }

    container.innerHTML = html;
  }

  window.focusNode = function(id) {
    var node = cy.getElementById(id);
    if (!node || !node.length) return;
    cy.nodes().removeClass('search-hit dimmed');
    node.addClass('search-hit');
    cy.animate({ center: { eles: node }, zoom: 1.5 }, { duration: 400 });
    updateDetail(node);
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
    // Reset to yt_dlp module filter
    window.filterByModule('yt_dlp');
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
      var png = cy.png({ full: true, scale: 2, bg: '#020617' });
      var link = document.createElement('a');
      link.download = 'yt-dlp-code-graph.png';
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

  function showToast(msg) {
    var toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function() { toast.classList.remove('show'); }, 2000);
  }

  /* ════════════════════════════════════════════════════════════════════════
   * INIT — Populate title, sidebar stats, legend, module filters
   * ════════════════════════════════════════════════════════════════════════ */

  /* ── Compute per-module stats from graph data ── */
  function getModuleStats(moduleName) {
    var files = cy.nodes('[type="file"]').filter(function(n) {
      return n.data('module') === moduleName;
    });
    var classCount = 0, funcCount = 0;
    files.forEach(function(f) {
      f.connectedEdges('[type="contains"]').targets().forEach(function(t) {
        if (t.data('type') === 'class') classCount++;
        else if (t.data('type') === 'function') funcCount++;
      });
    });
    return { files: files.length, classes: classCount, functions: funcCount };
  }

  /* ── Update stats panel: overview + module rows (null) or filtered view (module name) ── */
  function updateStats(filteredModule) {
    var overviewEl = document.getElementById('stats-overview');
    var modulesEl = document.getElementById('stats-modules');
    var sectionLabel = document.querySelector('#stats-modules').previousElementSibling;

    if (!filteredModule) {
      // ── All modules view ──
      if (sectionLabel) sectionLabel.style.display = '';
      var allFiles = cy.nodes('[type="file"]');
      var allClasses = cy.nodes('[type="class"]');
      var allFuncs = cy.nodes('[type="function"]');
      var allModules = cy.nodes('[type="module"]');

      var html = '';
      html += '<div class="stat-row"><span class="stat-label">Files</span><span class="stat-val">' + allFiles.length + '</span></div>';
      html += '<div class="stat-row"><span class="stat-label">Classes</span><span class="stat-val">' + allClasses.length + '</span></div>';
      html += '<div class="stat-row"><span class="stat-label">Functions</span><span class="stat-val">' + allFuncs.length + '</span></div>';
      html += '<div class="stat-row"><span class="stat-label">Modules</span><span class="stat-val">' + allModules.length + '</span></div>';
      html += '<div class="stat-row"><span class="stat-label">Edges</span><span class="stat-val">' + cy.edges().length + '</span></div>';
      overviewEl.innerHTML = html;

      // Build module rows
      var uniqueModules = [];
      var seenMods = {};
      allFiles.forEach(function(f) {
        var m = f.data('module');
        if (m && !seenMods[m]) { seenMods[m] = true; uniqueModules.push(m); }
      });
      uniqueModules.sort();
      var modHtml = '';
      uniqueModules.forEach(function(m) {
        var s = getModuleStats(m);
        modHtml += '<div class="stat-module-row' + (currentFilter === m ? ' active' : '') + '" data-module="' + escHtml(m) + '" onclick="filterByModule(\'' + escHtml(m) + '\', this)">';
        modHtml += '<span class="stat-module-name">' + escHtml(m) + '</span>';
        modHtml += '<span class="stat-module-counts">' + s.files + 'f · ' + s.classes + 'c · ' + s.functions + 'fn</span>';
        modHtml += '</div>';
      });
      modulesEl.innerHTML = modHtml;
    } else {
      // ── Filtered module view ──
      if (sectionLabel) sectionLabel.style.display = 'none';
      var s = getModuleStats(filteredModule);
      // Count visible edges (faster: count across all)
      var visEdges = 0;
      cy.edges().forEach(function(e) {
        if (e.style('display') !== 'none') visEdges++;
      });

      var html = '';
      html += '<div class="stat-filtered-label">' + escHtml(filteredModule) + '</div>';
      html += '<div class="stat-row"><span class="stat-label">Files</span><span class="stat-val">' + s.files + ' / ' + cy.nodes('[type="file"]').length + '</span></div>';
      html += '<div class="stat-row"><span class="stat-label">Classes</span><span class="stat-val">' + s.classes + ' / ' + cy.nodes('[type="class"]').length + '</span></div>';
      html += '<div class="stat-row"><span class="stat-label">Functions</span><span class="stat-val">' + s.functions + ' / ' + cy.nodes('[type="function"]').length + '</span></div>';
      html += '<div class="stat-row"><span class="stat-label">Edges</span><span class="stat-val">' + visEdges + ' / ' + cy.edges().length + '</span></div>';
      overviewEl.innerHTML = html;
      modulesEl.innerHTML = '';
    }
  }

  function initUI() {
    // Stats — yt_dlp module only
    updateStats('yt_dlp');

    // Legend — Nodes
    var nodeLegend = '';
    var nodeColors = [
      ['File', '#38bdf8', 'rgba(8, 51, 68, 0.85)'],
      ['Class', '#a78bfa', 'rgba(76, 29, 149, 0.85)'],
      ['Function', '#34d399', 'rgba(6, 78, 59, 0.85)'],
      ['Module/Package', '#fbbf24', 'rgba(120, 53, 15, 0.85)'],
    ];
    nodeColors.forEach(function(pair) {
      nodeLegend += '<div class="legend-item"><span class="legend-dot" style="border:1.5px solid ' + pair[1] + ';background:' + pair[2] + '"></span>' + pair[0] + '</div>';
    });
    document.getElementById('legend-nodes').innerHTML = nodeLegend;

    // Legend — Edges
    document.getElementById('legend-edges').innerHTML =
      '<div class="legend-item"><span class="legend-line" style="background:#475569;position:relative;">' +
        '<span style="position:absolute;right:-5px;top:50%;border:3px solid transparent;border-left:5px solid #475569;transform:translateY(-50%)"></span></span> imports (solid arrow)</div>' +
      '<div class="legend-item"><span class="legend-line" style="background:transparent;border-top:1.5px dashed #94a3b8"></span> calls (dashed arrow)</div>' +
      '<div class="legend-item"><span class="legend-line" style="background:#a78bfa;height:2px"></span> inherits (bold violet)</div>' +
      '<div class="legend-item"><span class="legend-line" style="background:#475569;height:1px"></span> contains (thin solid)</div>' +
      '<div class="legend-item"><span class="legend-line" style="background:transparent;border-top:1.5px dotted #22d3ee"></span> exports (dotted cyan)</div>';

    // Module filter hidden — only yt_dlp module shown
  }

  /* ── Deep-link: ?focus=<nodeId> from demos/diagram ── */
  function handleDeepLink() {
    var params = new URLSearchParams(window.location.search);
    var focusId = params.get('focus');
    if (!focusId) return;
    var node = cy.getElementById(focusId);
    if (!node || !node.length) return;
    // Wait a tick for layout to settle, then focus
    setTimeout(function() {
      cy.nodes().removeClass('search-hit dimmed');
      node.addClass('search-hit');
      cy.animate({ center: { eles: node }, zoom: 1.5 }, { duration: 500 });
      updateDetail(node);
    }, 600);
  }

  cy.ready(function() {
    initUI();
    filterByModule('yt_dlp');
    handleDeepLink();
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
