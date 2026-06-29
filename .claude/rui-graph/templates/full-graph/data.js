/**
 * rui-graph data schema:
 *   nodes: [{ id, label, type, ... }]
 *   edges: [{ source, target, type, weight? }]
 *   styles: Cytoscape style array (optional, falls back to defaults)
 */
window.GRAPH_DATA = {
    nodes: __NODES_JSON__,
    edges: __EDGES_JSON__,
    meta: {
        title:    '__GRAPH_TITLE__',
        subtitle: '__GRAPH_SUBTITLE__',
        source:   '__SOURCE_PATH__',
        generatedAt: '__GENERATED_AT__'
    }
};

window.GRAPH_STYLES = [
    {
        selector: 'node[type = "file"]',
        style: {
            'shape':           'round-rectangle',
            'background-color': 'var(--graph-node-file, #475569)',
            'label':           'data(label)',
            'color':           'var(--graph-text, #f8fafc)',
            'font-size':       '10px',
            'text-valign':     'center',
            'text-halign':     'center'
        }
    },
    {
        selector: 'node[type = "class"]',
        style: {
            'shape': 'hexagon',
            'background-color': 'var(--graph-node-class, #a78bfa)'
        }
    },
    {
        selector: 'node[type = "function"]',
        style: {
            'shape': 'ellipse',
            'background-color': 'var(--graph-node-function, #34d399)'
        }
    },
    {
        selector: 'node[type = "module"]',
        style: {
            'shape': 'diamond',
            'background-color': 'var(--graph-node-module, #fbbf24)'
        }
    },
    {
        selector: 'edge',
        style: {
            'curve-style':   'bezier',
            'target-arrow-shape': 'triangle',
            'line-color':    'var(--graph-edge, #1e293b)',
            'target-arrow-color': 'var(--graph-edge, #1e293b)',
            'width':         1.2
        }
    },
    {
        selector: 'edge[type = "calls"]',
        style: { 'line-style': 'dashed' }
    },
    {
        selector: 'edge[type = "inherits"]',
        style: { 'width': 2.5 }
    },
    {
        selector: '.highlighted',
        style: { 'border-color': 'var(--graph-accent, #22d3ee)', 'border-width': 3 }
    },
    {
        selector: '.dimmed',
        style: { 'opacity': 0.2 }
    }
];