/**
 * rui-graph · Full Graph View (Mode A)
 *
 * Renders files + classes + functions + modules with all edge types.
 * Mounts: Cytoscape canvas, sidebar stats/legend, inspector panel, toolbar.
 *
 * Resource cleanup: must destroy Cytoscape instance and clear DOM refs
 * before page navigation to prevent memory leaks.
 */
(function mountFullGraph() {
    if (typeof cytoscape === 'undefined') {
        console.warn('[rui-graph] Cytoscape not loaded; aborting mount.');
        return;
    }
    var data = window.GRAPH_DATA || { nodes: [], edges: [] };

    var cy = cytoscape({
        container: document.getElementById('cy'),
        elements:  data.nodes.concat(data.edges),
        style:     window.GRAPH_STYLES || [],
        layout:    { name: 'cose-bilkent', animate: false }
    });

    window.__cy = cy;
    window.doSearch     = doSearch;
    window.switchLayout = switchLayout;
    window.resetView    = function () { cy.fit(); };
    window.fitGraph     = function () { cy.fit(undefined, 30); };
    window.downloadPNG  = function () {
        var png = cy.png({ scale: 2, full: true, bg: getComputedStyle(document.body).backgroundColor });
        var link = document.createElement('a');
        link.href = png; link.download = 'graph.png'; link.click();
    };
    window.closeInspector = function () {
        document.getElementById('inspector').hidden = true;
    };

    function doSearch(q) {
        if (!q) { cy.elements().removeClass('dimmed highlighted'); return; }
        var match = cy.elements().filter(function (el) {
            var label = (el.data('label') || el.data('id') || '').toLowerCase();
            return label.indexOf(q.toLowerCase()) >= 0;
        });
        cy.elements().addClass('dimmed');
        match.removeClass('dimmed').addClass('highlighted');
    }

    function switchLayout(name) {
        cy.layout({ name: name, animate: true, fit: true }).run();
    }

    cy.on('tap', 'node', function (e) {
        var node = e.target;
        var inspector = document.getElementById('inspector');
        inspector.hidden = false;
        document.getElementById('inspector-title').textContent = node.data('label') || node.id();
        document.getElementById('inspector-body').innerHTML = renderInspector(node);
    });

    function renderInspector(node) {
        var d = node.data();
        var html = '<dl class="inspector-dl">';
        Object.keys(d).forEach(function (k) {
            html += '<dt>' + k + '</dt><dd>' + JSON.stringify(d[k], null, 2) + '</dd>';
        });
        html += '</dl>';
        return html;
    }

    renderStats();
    renderLegend();
})();

function renderStats() {
    var data = window.GRAPH_DATA || { nodes: [], edges: [] };
    var stats = { files: 0, classes: 0, functions: 0, modules: 0 };
    data.nodes.forEach(function (n) {
        if (stats[n.type] !== undefined) stats[n.type] += 1;
    });
    var html = '<div class="stat-row">' + Object.keys(stats).map(function (k) {
        return '<span class="stat-cell"><span class="stat-num">' + stats[k] + '</span><span class="stat-label">' + k + '</span></span>';
    }).join('') + '</div>';
    var el = document.getElementById('stats-overview');
    if (el) el.innerHTML = html;
}

function renderLegend() {
    var data = window.GRAPH_DATA || { nodes: [], edges: [] };
    var nodeTypes = Array.from(new Set(data.nodes.map(function (n) { return n.type; })));
    var edgeTypes = Array.from(new Set(data.edges.map(function (e) { return e.type; })));
    var nodesEl = document.getElementById('legend-nodes');
    var edgesEl = document.getElementById('legend-edges');
    if (nodesEl) nodesEl.innerHTML = nodeTypes.map(function (t) { return '<div class="legend-item">' + t + '</div>'; }).join('');
    if (edgesEl) edgesEl.innerHTML = edgeTypes.map(function (t) { return '<div class="legend-item">' + t + '</div>'; }).join('');
}