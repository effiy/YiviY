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

      // ── Card nodes by badge ──
      { selector: 'node[type="card"]',
        style: { 'shape': 'round-rectangle', 'width': 140, 'height': 60, 'font-size': '11px', 'font-weight': '600' } },
      { selector: 'node[badge="Core"], node[badge="核心"]',
        style: { 'background-color': 'rgba(6, 78, 59, 0.85)', 'border-color': '#34d399' } },
      { selector: 'node[badge="Report"], node[badge="报告"]',
        style: { 'background-color': 'rgba(136, 19, 55, 0.85)', 'border-color': '#fb7185' } },
      { selector: 'node[badge="Guide"], node[badge="指南"]',
        style: { 'background-color': 'rgba(8, 51, 68, 0.85)', 'border-color': '#38bdf8' } },
      { selector: 'node[badge="OSS"]',
        style: { 'background-color': 'rgba(120, 53, 15, 0.85)', 'border-color': '#fbbf24' } },
      { selector: 'node[badge="Agent"]',
        style: { 'background-color': 'rgba(76, 29, 149, 0.85)', 'border-color': '#a78bfa' } },
      { selector: 'node[badge="Beta"]',
        style: { 'background-color': 'rgba(120, 53, 15, 0.85)', 'border-color': '#fb923c' } },

      // ── Tag nodes by modifier ──
      { selector: 'node[type="tag"]',
        style: { 'shape': 'ellipse', 'width': 90, 'height': 36, 'font-size': '9px', 'font-weight': '500' } },
      { selector: 'node[modifier="warn"]',  style: { 'background-color': 'rgba(245, 158, 11, 0.2)', 'border-color': '#f59e0b' } },
      { selector: 'node[modifier="accent"]',style: { 'background-color': 'rgba(234, 179, 8, 0.2)', 'border-color': '#eab308' } },
      { selector: 'node[modifier="info"]',  style: { 'background-color': 'rgba(59, 130, 246, 0.2)', 'border-color': '#3b82f6' } },
      { selector: 'node[modifier="red"]',   style: { 'background-color': 'rgba(239, 68, 68, 0.2)', 'border-color': '#ef4444' } },
      { selector: 'node[modifier="purple"]',style: { 'background-color': 'rgba(139, 92, 246, 0.2)', 'border-color': '#8b5cf6' } },
      { selector: 'node[modifier="cyan"]',  style: { 'background-color': 'rgba(6, 182, 212, 0.2)', 'border-color': '#06b6d4' } },
      { selector: 'node[modifier="pass"], node[modifier="green"]',
        style: { 'background-color': 'rgba(34, 197, 94, 0.2)', 'border-color': '#22c55e' } },

      // ── Link destination nodes ──
      { selector: 'node[type="link_dest"]',
        style: { 'shape': 'diamond', 'width': 60, 'height': 60, 'font-size': '8px',
                 'background-color': 'rgba(71, 85, 105, 0.4)', 'border-color': '#64748b' } },

      // ── Badge nodes ──
      { selector: 'node[type="badge"]',
        style: { 'shape': 'triangle', 'width': 40, 'height': 40, 'font-size': '8px' } },

      // ── Cluster nodes ──
      { selector: 'node[type="cluster"]',
        style: { 'shape': 'hexagon', 'width': 80, 'height': 70, 'font-size': '9px',
                 'background-color': 'rgba(30, 41, 59, 0.6)', 'border-color': '#475569', 'border-style': 'dashed' } },

      // ── Edge types ──
      { selector: 'edge[type="has_tag"]',
        style: { 'line-style': 'solid', 'width': 1, 'target-arrow-shape': 'none', 'curve-style': 'unbundled-bezier' } },
      { selector: 'edge[type="shares_tag"]',
        style: { 'line-style': 'dashed', 'width': 0.5, 'line-color': '#94a3b8', 'target-arrow-shape': 'none', 'opacity': 0.3 } },
      { selector: 'edge[type="has_badge"]',
        style: { 'line-style': 'solid', 'width': 2, 'opacity': 0.8 } },
      { selector: 'edge[type="shares_badge"]',
        style: { 'line-style': 'dashed', 'width': 1, 'target-arrow-shape': 'none', 'opacity': 0.4 } },
      { selector: 'edge[type="links_to"]',
        style: { 'line-style': 'dotted', 'width': 1, 'line-color': '#475569', 'opacity': 0.5 } },
      { selector: 'edge[type="shares_link"]',
        style: { 'line-style': 'dotted', 'width': 0.5, 'line-color': '#334155', 'target-arrow-shape': 'none', 'opacity': 0.2 } },
      // LLM-inferred edges
      { selector: 'edge[type="depends_on"]',
        style: { 'line-style': 'solid', 'width': 1.5, 'line-color': '#22d3ee', 'opacity': 0.7 } },
      { selector: 'edge[type="related_to"]',
        style: { 'line-style': 'dashed', 'width': 0.8, 'line-color': '#64748b', 'target-arrow-shape': 'none', 'opacity': 0.35 } },
      { selector: 'edge[type="extends"]',
        style: { 'line-style': 'solid', 'width': 1.5, 'line-color': '#a78bfa', 'opacity': 0.7 } },
      { selector: 'edge[type="implements"]',
        style: { 'line-style': 'dotted', 'width': 1.2, 'line-color': '#34d399', 'opacity': 0.6 } },

      // ── Interaction states ──
      { selector: 'node:selected',
        style: { 'border-width': 3, 'border-color': '#f8fafc', 'shadow-blur': 12, 'shadow-color': '#22d3ee', 'shadow-opacity': 0.4 } },
      { selector: 'node.highlight', style: { 'border-width': 2.5, 'border-color': '#f8fafc', 'opacity': 1 } },
      { selector: 'edge.highlight', style: { 'opacity': 1, 'width': 2 } },
      { selector: 'node.dimmed', style: { 'opacity': 0.12 } },
      { selector: 'edge.dimmed', style: { 'opacity': 0.04 } },
      { selector: 'node.search-hit',
        style: { 'border-width': 3, 'border-color': '#fbbf24', 'shadow-blur': 16, 'shadow-color': '#fbbf24', 'shadow-opacity': 0.6 } },
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
      opts = { ...opts, name: 'concentric', concentric: function(n) { return n.data('richness') || 1; }, minNodeSpacing: 40 };
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
      if (!query || query.length < 1) { fitGraph(); return; }
      var q = query.toLowerCase();
      var found = false;
      cy.nodes().forEach(function(n) {
        var label = (n.data('label') || '').toLowerCase();
        var tags = (n.data('tags') || []).map(function(t) { return (t.text || t).toLowerCase(); }).join(' ');
        var desc = (n.data('desc') || '').toLowerCase();
        if (label.indexOf(q) !== -1 || tags.indexOf(q) !== -1 || desc.indexOf(q) !== -1) {
          n.addClass('search-hit').removeClass('dimmed');
          found = true;
        } else {
          n.addClass('dimmed');
        }
      });
      if (found) {
        cy.fit(cy.nodes('.search-hit'), 80);
      }
    }, 250);
  };

  /* ════════════════════════════════════════════════════════════════════════
   * FILTER BY BADGE
   * ════════════════════════════════════════════════════════════════════════ */

  window.filterByBadge = function(badge, btn) {
    document.querySelectorAll('#badge-filters .filter-btn').forEach(function(b) { b.classList.remove('active'); });
    if (btn) btn.classList.add('active');

    if (badge === 'all') {
      cy.nodes().style('display', 'element');
      cy.edges().style('display', 'element');
      fitGraph();
      return;
    }

    cy.nodes().forEach(function(n) {
      if (n.data('type') === 'card') {
        n.style('display', n.data('badge') === badge ? 'element' : 'none');
      } else if (n.data('type') === 'tag' || n.data('type') === 'link_dest' || n.data('type') === 'badge') {
        var connected = n.connectedEdges().some(function(e) {
          return e.source().style('display') !== 'none' && e.target().style('display') !== 'none';
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
    updateDetail(node.data());
  });

  cy.on('tap', function(evt) {
    if (evt.target === cy) {
      document.getElementById('detail-content').innerHTML = '<div class="detail-empty">Click a node<br>to see details</div>';
    }
  });

  function updateDetail(data) {
    var container = document.getElementById('detail-content');
    var node = cy.getElementById(data.id);
    var type = data.type;

    if (type === 'card') {
      var connectedTags = node.connectedEdges('[type="has_tag"]').length;
      var connectedCards = node.connectedEdges('[type="shares_tag"], [type="shares_badge"], [type="depends_on"], [type="related_to"], [type="extends"], [type="implements"]').map(function(e) {
        var other = e.source().id() === data.id ? e.target() : e.source();
        return { id: other.id(), label: other.data('label') };
      });
      var connectedLinks = node.connectedEdges('[type="links_to"]').length;

      var html = '<div class="detail-header">';
      html += '<h3>' + escHtml(data.label || data.id) + '</h3>';
      if (data.badge) {
        html += '<span class="detail-badge badge-' + badgeClass(data.badge) + '">' + escHtml(data.badge) + '</span>';
      }
      html += '</div>';

      if (data.desc) {
        html += '<div class="detail-desc">' + data.desc + '</div>';
      }
      if (data.tags && data.tags.length) {
        html += '<div class="detail-section-title">Tags</div>';
        html += '<div class="detail-tags">';
        data.tags.forEach(function(t) {
          var mod = t.modifier || 'info';
          html += '<span class="detail-tag tag-' + mod + '">' + escHtml(t.text || t) + '</span>';
        });
        html += '</div>';
      }
      if (data.meta) {
        html += '<div class="detail-meta">' + escHtml(data.meta) + '</div>';
      }
      if (data.links && data.links.length) {
        html += '<div class="detail-section-title">Links (' + data.links.length + ')</div>';
        html += '<div class="detail-links">';
        data.links.forEach(function(l) {
          html += '<a class="detail-link" href="' + escHtml(l.href) + '" target="_blank" rel="noopener">' + (l.label || l.href) + '</a>';
        });
        html += '</div>';
      }
      html += '<div class="detail-stats">';
      html += connectedTags + ' tags · ' + connectedCards.length + ' related cards · ' + connectedLinks + ' links';
      if (data.richness) html += ' · Richness: ' + data.richness;
      html += '</div>';

      // Deduplicate related cards by id
      var seen = {};
      var uniqueCards = connectedCards.filter(function(c) { return seen[c.id] ? false : (seen[c.id] = true); });
      if (uniqueCards.length) {
        html += '<div class="detail-section-title">Related Cards (' + uniqueCards.length + ')</div>';
        html += '<ul class="detail-conn-list">';
        uniqueCards.forEach(function(c) {
          html += '<li onclick="focusNode(\'' + c.id + '\')">' + escHtml(c.label) + '</li>';
        });
        html += '</ul>';
      }
      container.innerHTML = html;

    } else if (type === 'tag') {
      var cards = node.connectedEdges('[type="has_tag"]').map(function(e) {
        var c = e.source().data('type') === 'card' ? e.source() : e.target();
        return { id: c.id(), label: c.data('label') };
      });
      var html = '<div class="detail-header"><h3>🏷️ ' + escHtml(data.label) + '</h3></div>';
      html += '<div class="detail-meta">Modifier: ' + escHtml(data.modifier || 'info') + ' · Used by ' + cards.length + ' cards</div>';
      if (cards.length) {
        html += '<div class="detail-section-title">Cards with this tag</div>';
        html += '<ul class="detail-conn-list">';
        cards.forEach(function(c) { html += '<li onclick="focusNode(\'' + c.id + '\')">' + escHtml(c.label) + '</li>'; });
        html += '</ul>';
      }
      container.innerHTML = html;

    } else if (type === 'badge') {
      var cards = node.connectedEdges('[type="has_badge"]').map(function(e) {
        var c = e.source().data('type') === 'card' ? e.source() : e.target();
        return { id: c.id(), label: c.data('label') };
      });
      var html = '<div class="detail-header"><h3>🔖 ' + escHtml(data.label) + '</h3></div>';
      html += '<div class="detail-meta">' + cards.length + ' cards</div>';
      if (cards.length) {
        html += '<ul class="detail-conn-list">';
        cards.forEach(function(c) { html += '<li onclick="focusNode(\'' + c.id + '\')">' + escHtml(c.label) + '</li>'; });
        html += '</ul>';
      }
      container.innerHTML = html;

    } else if (type === 'link_dest') {
      var cards = node.connectedEdges('[type="links_to"]').map(function(e) {
        var c = e.source().data('type') === 'card' ? e.source() : e.target();
        return { id: c.id(), label: c.data('label') };
      });
      var html = '<div class="detail-header"><h3>🔗 ' + escHtml(data.label) + '</h3></div>';
      if (data.url) {
        html += '<a class="detail-link" href="' + escHtml(data.url) + '" target="_blank" rel="noopener">' + escHtml(data.url) + '</a>';
      }
      html += '<div class="detail-meta">Referenced by ' + cards.length + ' cards</div>';
      if (cards.length) {
        html += '<ul class="detail-conn-list">';
        cards.forEach(function(c) { html += '<li onclick="focusNode(\'' + c.id + '\')">' + escHtml(c.label) + '</li>'; });
        html += '</ul>';
      }
      container.innerHTML = html;

    } else if (type === 'cluster') {
      var memberCards = [];
      if (data.memberCards) {
        memberCards = data.memberCards.map(function(id) {
          var n = cy.getElementById(id);
          return n.length ? { id: id, label: n.data('label') } : null;
        }).filter(Boolean);
      }
      var html = '<div class="detail-header"><h3>📦 ' + escHtml(data.label) + '</h3></div>';
      html += '<div class="detail-meta">Tag cluster · ' + (data.memberTags || []).length + ' tags · ' + memberCards.length + ' cards</div>';
      if (data.memberTags && data.memberTags.length) {
        html += '<div class="detail-section-title">Member Tags</div>';
        html += '<div class="detail-tags">';
        data.memberTags.forEach(function(t) { html += '<span class="detail-tag tag-info">' + escHtml(t) + '</span>'; });
        html += '</div>';
      }
      if (memberCards.length) {
        html += '<div class="detail-section-title">Cards in cluster</div>';
        html += '<ul class="detail-conn-list">';
        memberCards.forEach(function(c) { html += '<li onclick="focusNode(\'' + c.id + '\')">' + escHtml(c.label) + '</li>'; });
        html += '</ul>';
      }
      container.innerHTML = html;
    }
  }

  window.focusNode = function(id) {
    var node = cy.getElementById(id);
    if (node.length) {
      cy.nodes().removeClass('search-hit dimmed');
      node.addClass('search-hit');
      cy.animate({ center: { eles: node }, zoom: 1.5 }, { duration: 400 });
      updateDetail(node.data());
    }
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
    window.filterByBadge('all', null);
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
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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

    // Badge filter buttons
    var uniqueBadges = [];
    var seenBadges = {};
    cards.forEach(function(c) {
      var b = c.data('badge');
      if (b && !seenBadges[b]) { seenBadges[b] = true; uniqueBadges.push(b); }
    });
    var filterHtml = '<span class="toolbar-label">Filter</span>';
    filterHtml += '<button class="filter-btn active" onclick="filterByBadge(\'all\', this)">All</button>';
    uniqueBadges.forEach(function(b) {
      filterHtml += '<button class="filter-btn" onclick="filterByBadge(\'' + escHtml(b) + '\', this)">' + escHtml(b) + '</button>';
    });
    document.getElementById('badge-filters').innerHTML = filterHtml;
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
