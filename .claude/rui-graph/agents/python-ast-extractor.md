# Python AST Symbol Extractor Agent

Walk a Python source tree with `ast` and emit structured symbol records.

## Role

Phase 1 of the rui-graph pipeline. This is the deterministic scanner that produces `code-analysis.json` from `.py` files. It runs locally, has no LLM calls, and survives Python version drift (3.8+) by avoiding preview / 3.12+ only features unless the project's minimum Python version is documented.

## Inputs

You receive:

- **source_root**: Absolute path to the Python package directory
- **exclude_globs**: Subdirectories or filename globs to skip (defaults to the project's exclusion rules)
- **max_file_bytes**: Skip files larger than this (default 1 MB)
- **python_target_version**: Optional `3.8` / `3.10` / `3.12` — guides AST feature allow-list

## Process

### Step 1: Walk the Tree

- Use `pathlib.Path.rglob('*.py')`
- Skip `__pycache__`, `.git`, `.venv`, `node_modules`
- Honor `exclude_globs`
- For each `__init__.py`: also emit a `module` record pointing at the package directory

### Step 2: Parse Each File

Use `ast.parse(source, filename, feature_version=(python_target_version or (3, 8)))`. On `SyntaxError`, record `error: "syntax_error"` with line/column and continue.

### Step 3: Extract Module-Level Symbols

| AST node | Record kind | Record id |
|----------|-------------|-----------|
| `FunctionDef` outside any class | function | `function:<rel_path>:<name>` |
| `AsyncFunctionDef` outside any class | function | same id scheme, tag `["async"]` |
| `ClassDef` | class | `class:<rel_path>:<name>` |
| `Import` | edge only | `imports` from file → target |
| `ImportFrom` | edge only | resolve relative + absolute |
| `Assign` with `__all__` | export markers | track for `exports` edges |
| Module docstring | `summary` candidate | first line only |

### Step 4: Extract Class Internals

For each `ClassDef`:

- `baseClasses`: from `ClassDef.bases` (resolved names; unresolved → keep the literal)
- `decorators`: top-level decorators as tags (`@dataclass → "data"`, `@abstractmethod → "abstract"`)
- `methods`: each `FunctionDef` / `AsyncFunctionDef` under `ClassDef.body`
- Method id: `function:<rel_path>:<ClassName>.<method_name>`
- Categorize:

| Signal | category |
|--------|----------|
| `__init__.py` with `main()` and class hierarchy | orchestrator |
| `@dataclass` / simple data holder | data |
| `@abstractmethod` present | abstract |
| ≥ 30 methods | orchestrator |
| Else | handler |

### Step 5: Extract Imports

For each `Import` / `ImportFrom`:

- Resolve the **module path** within the analyzed tree:
  - Relative `from .x import y` → sibling / parent file
  - Absolute `from package.x import y` → `package/x.py` within `source_root`
- Record a `imports` edge with `source: file:<current>`, `target: file:<resolved>` or `target: external:<dotted_module>` if unresolvable
- Aliases (`as`) do not change the target, only the local name; record `alias` on the edge

### Step 6: Same-File Calls (Best-Effort)

Walk `FunctionDef.body` and `AsyncFunctionDef.body` for `Call` nodes. Resolve names:

- If the callee is bare (e.g., `foo(...)`) and a top-level function defined in the same file exists with that name → `calls` edge
- If the callee is an attribute (`self.foo(...)`, `obj.method(...)`) → only emit a `calls` edge if the attribute is resolvable to a method definition in the same class

Keep call edges **best-effort**: missing call edges are NOT errors; only emit when the resolution is unambiguous.

### Step 7: Classify Tier by Lines

| Lines | Tier |
|------:|------|
| > 1000 OR top-level orchestrator (e.g., contains `def main()`) | `core` |
| 100–1000 | `library` |
| < 100 | `utility` |

If a file contains a top-level class with ≥ 30 methods, prefer `core` even when lines ≤ 1000.

### Step 8: Symbol Index

Build a `(qualified_name → node_id)` map for the entire package to enable phase-2 edge construction:

```
"YoutubeDL"  → "class:<pkg>/YoutubeDL.py:YoutubeDL"
"extract_info" → "function:<pkg>/YoutubeDL.py:YoutubeDL.extract_info"
```

Store the map in `code-analysis.json > symbol_index` for downstream consumers.

### Step 9: Write Code Analysis

Write the full payload below. Errors do not stop the walk; partial output is allowed.

## Output Format

```json
{
  "source": "site-packages/yt_dlp/",
  "fileCount": 22,
  "classCount": 25,
  "functionCount": 25,
  "moduleCount": 3,
  "files": [
    {
      "id": "file:yt_dlp/YoutubeDL.py",
      "path": "yt_dlp/YoutubeDL.py",
      "basename": "YoutubeDL.py",
      "lines": 4542,
      "tier": "core",
      "type": "file",
      "classes": ["class:yt_dlp/YoutubeDL.py:YoutubeDL"],
      "functions": [],
      "imports": ["file:yt_dlp/utils/__init__.py"],
      "importedBy": ["file:yt_dlp/__init__.py"]
    }
  ],
  "classes": [
    {
      "id": "class:yt_dlp/YoutubeDL.py:YoutubeDL",
      "name": "YoutubeDL",
      "fileId": "file:yt_dlp/YoutubeDL.py",
      "baseClasses": [],
      "methods": ["function:yt_dlp/YoutubeDL.py:YoutubeDL.extract_info"],
      "category": "orchestrator"
    }
  ],
  "functions": [
    {
      "id": "function:yt_dlp/YoutubeDL.py:YoutubeDL.extract_info",
      "name": "extract_info",
      "fileId": "file:yt_dlp/YoutubeDL.py",
      "classId": "class:yt_dlp/YoutubeDL.py:YoutubeDL",
      "calls": [],
      "calledBy": [],
      "role": "core_logic"
    }
  ],
  "modules": [
    { "id": "module:yt_dlp", "name": "yt_dlp", "path": "yt_dlp/", "initFileId": "file:yt_dlp/__init__.py", "exports": [] }
  ],
  "symbol_index": { "YoutubeDL": "class:yt_dlp/YoutubeDL.py:YoutubeDL" },
  "excluded": ["test/", "compat/"],
  "errors": []
}
```

## Guidelines

- **Idempotent**: re-running on unchanged source yields byte-identical output.
- **No `import` side effects** during analysis — use `ast` only; do not actually import the modules being analyzed.
- **Errors are recorded, not raised** — one bad file does not stop the walk.
- **Stable line counts**: count `len(source.splitlines())`, not token-based heuristics.
- **Don't invent symbols**: if a name is unresolvable, log it as `unresolved_in_call`.
