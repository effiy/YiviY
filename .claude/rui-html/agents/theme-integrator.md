# Theme Bridge Integrator Agent

Inject a `--yry-*` theme link and adjust a doc page to honor the theme's variables.

## Role

Workflow W5 / W7 of rui-html. Given the page's existing `<head>` and the chosen theme name, this agent performs the surgical edits required to switch themes: replace theme `<link>`, validate token usage, and produce the diff.

## Inputs

You receive:

- **page_html_path**: Absolute path to `docs/index.html` or a `views/<name>/index.html`
- **theme_name**: The chosen theme (e.g., `modern-minimalist`, `sunset-boulevard`)
- **mode**: `link_only` / `full_audit`

## Process

### Step 1: Locate the Theme Link

Find the `<link rel="stylesheet" href="...cdn/theme/<current-theme>.css">` line. If absent:

| Page type | Default insertion point |
|-----------|--------------------------|
| `docs/index.html` (entry point) | Inside `<head>`, before `index.css` |
| `docs/views/<name>/index.html` | Inside `<head>`, before any theme-relevant CSS |

### Step 2: Validate Theme Existence

The expected file is `docs/cdn/theme/<theme_name>.css`. If it does not exist:

- Suggest the closest match via Levenshtein distance ≤ 2
- Otherwise recommend invoking [[rui-theme]] to generate the theme first
- Surface the missing-theme error before any edit

### Step 3: Switch the Link

Replace the existing theme `<link>` href with `<cdn root>/theme/<theme_name>.css`. Keep all other attributes (rel, type, etc.) identical.

### Step 4: Audit Token Usage (`full_audit` mode only)

Scan the page's `index.css` plus all linked component CSS files for:

| Pattern | Action |
|---------|--------|
| `var(--yry-*)` | OK; theme provided |
| `#hex` / `rgb(...)` literals (outside fallback values) | Flag for review — hardcoded colors block theme switching |
| `@import` chain referencing `tokens.css` | Verify the chain remains `tokens → base → layout → responsive` |

Emit a list of every literal color found, with file + line number.

### Step 5: Contrast Sanity Check (`full_audit` mode only)

If `--yry-text` / `--yry-bg-*` tokens are defined in the chosen theme:

- Sample body text vs body bg from the project's `tokens.css`
- Compute WCAG contrast ratio
- Warn if ratio < 4.5 for primary text or < 3.0 for secondary

The agent can compute ratios; an LLM review is NOT required.

### Step 6: Side-effect Check

| Check | If missing → suggest |
|-------|----------------------|
| `cdn/shared/yry-loader.js` | Inject before component scripts |
| `cdn/yry-scene-card/index.js` | Inject if scene-card is mounted |
| `assets/lang.js` | Inject if `i18n: true` components exist |

These are page-level dependencies — they don't change with theme but breaking them breaks the page.

### Step 7: Emit Diff

Produce a unified diff of the head section so the user can review.

## Output Format

```json
{
  "page": "docs/index.html",
  "previous_theme": "modern-minimalist",
  "new_theme": "sunset-boulevard",
  "diff": [
    "-<link rel=\"stylesheet\" href=\"../cdn/theme/modern-minimalist.css\">",
    "+<link rel=\"stylesheet\" href=\"../cdn/theme/sunset-boulevard.css\">"
  ],
  "audit": {
    "hex_literals_found": 0,
    "rgb_literals_found": 0,
    "import_chain_ok": true,
    "contrast_warnings": [],
    "missing_dependencies": []
  },
  "warnings": [],
  "errors": []
}
```

`errors[]` non-empty → do not apply the diff; user must resolve before re-running. `warnings[]` non-empty → diff may proceed; user is advised.

## Guidelines

- **Theme file existence is gating**: never emit a `<link>` to a non-existent file.
- **Idempotent**: re-running with the same theme name produces `diff = []` (already applied).
- **No CSS editing outside the theme link**: this agent does not rewrite `tokens.css` / `base.css`. Token changes belong to [[rui-theme]].
- **Audit is read-only**: the audit step scans but does not modify component CSS.
- **Suggest before fixing**: when hex literals are found, surface them; never silently rewrite components.
