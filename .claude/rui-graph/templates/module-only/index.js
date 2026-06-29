/**
 * rui-graph · Module-Only View (Mode B)
 *
 * Renders only files + imports between them. No functions / classes.
 * Useful for package-level overview.
 */
(function mountModuleOnlyGraph() {
    if (typeof cytoscape === 'undefined') {
        console.warn('[rui-graph] Cytoscape not loaded; aborting mount.');
        return;
    }
    var data = window.GRAPH_DATA || { nodes: [], edges: [] };
    // Filter: keep only file nodes and import edges
    var filteredNodes = data.nodes.filter(function (n) { return n.type === 'file' || n.type === 'module'; });
    var nodeIds = new Set(filteredNodes.map(function (n) { return n.id; }));
    var filteredEdges = data.edges.filter(function (e) {
        return (e.type === 'imports' || e.type === 'depends_on') &&
               nodeIds.has(e.source) && nodeIds.has(e.target);
    });

    var cy = cytoscape({
        container: document.getElementById('cy'),
        elements:  filteredNodes.concat(filteredEdges),
        style: [
            {
                selector: 'node',
                style: {
                    'label':           'data(label)',
                    'background-color': 'var(--graph-node-file)',
                    'color':           'var(--graph-text)',
                    'font-size':       '11px',
                    'text-valign':     'center',
                    'text-halign':     'center',
                    'width':           'label',
                    'height':          'label',
                    'padding':         '8px',
                    'shape':           'round-rectangle'
                }
            },
            {
                selector: 'node[type = "module"]',
                style: { 'background-color': 'var(--graph-node-module)', 'font-weight': 700 }
            },
            {
                selector: 'edge',
                style: {
                    'curve-style':   'bezier',
                    'target-arrow-shape': 'triangle',
                    'line-color':    'var(--graph-edge)',
                    'target-arrow-color': 'var(--graph-edge)',
                    'width':         1.2
                }
            }
        ],
        layout: { name: 'dagre', rankDir: 'LR', animate: false, fit: true }
    });

    var listEl = document.getElementById('module-list');
    filteredNodes.forEach(function (n) {
        var li = document.createElement('li');
        li.className = 'module-list-item';
        li.textContent = n.label || n.id;
        li.addEventListener('click', function () { cy.fit(cy.getElementById(n.id), 60); });
        listEl.appendChild(li);
    });
})();