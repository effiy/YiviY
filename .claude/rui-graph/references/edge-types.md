# Edge Type Reference — rui-graph (Code Dependency)

> Complete edge type catalog with semantic meaning, visual styling, weight conventions, and creation rules for code dependency graphs.

## Edge Type Catalog

### Structural Edges (deterministic — from AST analysis)

| Edge Type | Source → Target | Line Style | Width | Color | Category |
|-----------|----------------|------------|-------|-------|----------|
| `imports` | file → file | Solid arrow | 1.5 | `#475569` | Deterministic |
| `contains` | file → class/function | Solid no arrow | 0.8 | `#475569` | Deterministic |
| `inherits` | class → class | Bold solid arrow | 2 | `#a78bfa` | Deterministic |
| `exports` | file → file | Dotted arrow | 1 | `#22d3ee` | Deterministic |

### Semantic Edges (best-effort from AST + heuristics)

| Edge Type | Source → Target | Line Style | Width | Color | Category |
|-----------|----------------|------------|-------|-------|----------|
| `calls` | function → function | Dashed arrow | 1 | `#94a3b8` | Best-effort |

## Edge Creation Rules

### imports

**When**: File A contains `import` or `from ... import ...` referencing symbols defined in File B.
**Direction**: importing file → imported file.
**ID format**: `edge:<fileAId>:<fileBId>:imports`.
**Prevention**: Deduplicate by (source, target, type). Same pair may have multiple import statements — emit exactly one `imports` edge.

```javascript
for (const [importer, imported] of resolvedImports) {
  edges.push({
    data: {
      id: `edge:${importer.id}:${imported.id}:imports`,
      source: importer.id,
      target: imported.id,
      type: 'imports'
    }
  });
}
```

### contains

**When**: A class or function definition appears within a file's AST body.
**Direction**: file → symbol (class or function).
**ID format**: `edge:<fileId>:<symbolId>:contains`.
**Prevention**: Each (file, symbol) pair is unique. Emit exactly one edge per symbol.

```javascript
for (const file of files) {
  for (const symbol of file.definedSymbols) {
    edges.push({
      data: {
        id: `edge:${file.id}:${symbol.id}:contains`,
        source: file.id,
        target: symbol.id,
        type: 'contains'
      }
    });
  }
}
```

### inherits

**When**: Class A lists Class B in its `bases` tuple (AST `ClassDef.bases`).
**Direction**: subclass → superclass.
**ID format**: `edge:<classAId>:<classBId>:inherits`.
**Prevention**: Each (subclass, superclass) pair is unique. Deduplicate.

```javascript
for (const cls of classes) {
  for (const base of cls.baseClasses) {
    edges.push({
      data: {
        id: `edge:${cls.id}:${base.id}:inherits`,
        source: cls.id,
        target: base.id,
        type: 'inherits',
        base_class: base.name
      }
    });
  }
}
```

### exports

**When**: An `__init__.py` file re-exports symbols from sub-module files via `from .submodule import X`.
**Direction**: init file → sub-module file.
**ID format**: `edge:<initFileId>:<submoduleFileId>:exports:<symbolName>`.
**Prevention**: One edge per (init, submodule, symbol) tuple. Deduplicate.

```javascript
for (const [initFile, exported] of exports) {
  edges.push({
    data: {
      id: `edge:${initFile.id}:${exported.targetFile.id}:exports:${exported.symbol}`,
      source: initFile.id,
      target: exported.targetFile.id,
      type: 'exports',
      symbol: exported.symbol
    }
  });
}
```

### calls

**When**: Function A's AST body contains a `Call` node where the called name resolves to Function B. This is best-effort — only same-file calls are reliably detectable without full program analysis.
**Direction**: caller → callee.
**ID format**: `edge:<funcAId>:<funcBId>:calls`.
**Prevention**: Deduplicate by (caller, callee) pair.

```javascript
for (const [caller, callee] of resolvedCalls) {
  edges.push({
    data: {
      id: `edge:${caller.id}:${callee.id}:calls`,
      source: caller.id,
      target: callee.id,
      type: 'calls'
    }
  });
}
```

**Limitation**: Cross-module call detection requires type inference or manual annotation. The generated `calls` edges represent confirmed same-module calls plus manually curated cross-module key calls. This is documented in the graph meta and is acceptable for architectural visualization.

## Edge ID Collision Prevention

Edge IDs must be unique across all edge types. The format `edge:<source>:<target>:<type>[:<discriminator>]` ensures this:

- `imports`: `edge:file_a:file_b:imports` — no discriminator needed (at most one per file pair)
- `contains`: `edge:file_a:symbol_a:contains` — no discriminator needed
- `inherits`: `edge:class_a:class_b:inherits` — no discriminator needed
- `exports`: `edge:file_a:file_b:exports:symbol_name` — discriminator needed (multiple symbols per pair)
- `calls`: `edge:func_a:func_b:calls` — no discriminator needed (at most one per function pair)

## Visual Distinction Rules

All edge types must be VISUALLY distinguishable:

- **Structural** (imports, contains, inherits) → **solid** lines. Thicker for stronger bonds.
- **Re-export** (exports) → **dotted** lines. Cyan to indicate indirection.
- **Call graph** (calls) → **dashed** lines. Gray, medium opacity.
- **Inheritance** (inherits) → **bold** solid lines in violet — the strongest structural relationship.
