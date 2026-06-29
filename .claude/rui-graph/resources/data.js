/* ════════════════════════════════════════════════════════════════════════
   rui-graph — Graph Data (Code Dependency)
   window.GRAPH_DATA is read by index.js.

   Node types: file (round-rect), class (hexagon), function (ellipse), module (diamond)
   Edge types: imports, calls, inherits, contains, exports

   Regenerate this file when source structure changes.
   ════════════════════════════════════════════════════════════════════════ */

window.GRAPH_DATA = {
  elements: [
    // ── File nodes (one per .py source file) ──
    // { data: { id: 'file:path/to/module.py', type: 'file', label: 'module.py',
    //           path: 'path/to/module.py', lines: 1234, tier: 'core', module: 'package_name' } }

    // ── Class nodes (one per class definition) ──
    // { data: { id: 'class:ClassName', type: 'class', label: 'ClassName',
    //           file: 'file:path/to/module.py', methodCount: 15, category: 'orchestrator' } }

    // ── Function nodes (one per function/method) ──
    // { data: { id: 'func:function_name', type: 'function', label: 'function_name()',
    //           file: 'file:path/to/module.py', class: 'ClassName', role: 'core_logic' } }

    // ── Module nodes (one per package __init__.py) ──
    // { data: { id: 'module:package_name', type: 'module', label: 'package_name',
    //           path: 'package_name/', submoduleCount: 3 } }

    // ── Edges — contains (file → class/function) ──
    // { data: { id: 'edge:file_a:class_x:contains', source: 'file:path/to/module.py',
    //           target: 'class:ClassName', type: 'contains' } }

    // ── Edges — imports (file → file) ──
    // { data: { id: 'edge:file_a:file_b:imports', source: 'file:a.py',
    //           target: 'file:b.py', type: 'imports' } }

    // ── Edges — inherits (subclass → superclass) ──
    // { data: { id: 'edge:class_a:class_b:inherits', source: 'class:SubClass',
    //           target: 'class:BaseClass', type: 'inherits' } }

    // ── Edges — calls (caller → callee) ──
    // { data: { id: 'edge:func_a:func_b:calls', source: 'func:caller',
    //           target: 'func:callee', type: 'calls' } }

    // ── Edges — exports (__init__.py → submodule) ──
    // { data: { id: 'edge:file_a:file_b:exports:symbol', source: 'file:path/to/__init__.py',
    //           target: 'file:path/to/submodule.py', type: 'exports', symbol: 'ExportedClass' } }
  ],

  meta: {
    nodeCount: 0,
    edgeCount: 0,
    fileCount: 0,
    classCount: 0,
    functionCount: 0,
    moduleCount: 0,
    modules: [],
    source: '',
  }
};
