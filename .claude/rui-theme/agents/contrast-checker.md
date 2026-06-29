# Theme Contrast Checker Agent

Audit an existing `--yry-*` palette or a generated `<name>.css` for WCAG compliance and visual harmony.

## Role

Run before deploying a theme to any page. Surface every contrast and harmony violation that would slip past human review, especially around the user-chosen `--yry-text` vs `--yry-bg-*` pairs and the relationship between accent, pass, warn, and fail tokens.

## Inputs

You receive:

- **theme_path**: Absolute path to `cdn/theme/<name>.css` (or to a CSS draft saved by `palette-generator`)
- **pairs_to_audit**: Optional explicit list of `(fg, bg, role)` triples; default = the canonical pairs

## Process

### Step 1: Parse the CSS

Extract every `--yry-<token>: <color-value>;` declaration. Acceptable color forms:

| Form | Example |
|------|---------|
| Hex | `#1a1410`, `#fff`, `#aabbccdd` |
| `rgb()` / `rgba()` | `rgb(26, 20, 16)`, `rgba(255,255,255,0.85)` |
| `hsl()` | `hsl(28, 40%, 12%)` |
| Token reference | `var(--yry-bg-card)` (resolve recursively) |

### Step 2: Compute the Canonical Pairs

| Role | Foreground | Background |
|------|------------|------------|
| Body text | `--yry-text` | `--yry-bg-card` |
| Secondary text | `--yry-text-soft` | `--yry-bg-card` |
| Muted text | `--yry-text-muted` | `--yry-bg-card` |
| Inverse (e.g., button) | `--yry-bg-card` | `--yry-accent` |
| Pass copy | `--yry-pass` | `--yry-bg-card` |
| Warn copy | `--yry-warn` | `--yry-bg-card` |
| Fail copy | `--yry-fail` | `--yry-bg-card` |
| Border on card | `--yry-border-color` | `--yry-bg-card` |

For each pair, compute `contrast_ratio`.

### Step 3: Apply WCAG Thresholds

| Role | Min ratio |
|------|:---:|
| Body text | 4.5 |
| Large text (≥ 18 px / 14 px bold) | 3.0 |
| Decorative / boundary | 1.5 |
| Status copy | 3.0 |

Mark every pair `pass` or `fail`.

### Step 4: Detect Status Confusion

The three status tokens (pass / warn / fail) must be perceptually distinguishable from each other AND from the accent token. Compute ΔE (perceptual color distance, simplified CIE76):

| Constraint | Threshold |
|------------|:---:|
| `--yry-pass` vs `--yry-fail` ΔE | ≥ 10 |
| `--yry-warn` vs `--yry-fail` ΔE | ≥ 8 |
| `--yry-pass` vs `--yry-accent` ΔE | ≥ 6 |

Pairs below threshold are flagged as "visual confusion risk".

### Step 5: Detect Monochrome Pitfall

If all 12 tokens fall in the same hue range:

- Compute hue span (max hue - min hue across all 12)
- If span < 30°: warn "monochrome palette — accent may not stand out"

### Step 6: Detect Light-on-Light or Dark-on-Dark Failure

For each text vs background pair in `pairs_to_audit` (or the canonical set):

- Compute relative luminance difference (`|L_text - L_bg|`)
- If difference < 0.10: error "unreadable"

### Step 7: Emit Per-Token Report

| Token | Hex | Computed luminance | Notes |
|-------|-----|--------------------|-------|
| `--yry-bg-card` | `#1a1410` | 0.018 | base |
| `--yry-text` | `#f5e6d3` | 0.84 |  |

### Step 8: Summary

Output a verdict block:

```json
{
  "verdict": "conditional_pass",
  "errors": 0,
  "warnings": 3,
  "must_fix": [...],
  "should_consider": [...]
}
```

`verdict` values: `pass`, `conditional_pass`, `fail`.

## Output Format

```json
{
  "theme_path": "cdn/theme/modern-minimalist.css",
  "tokens": {
    "--yry-bg-card": { "hex": "#0f172a", "luminance": 0.018 },
    "--yry-text": { "hex": "#e2e8f0", "luminance": 0.78 }
  },
  "pairs": [
    {
      "role": "body_text",
      "fg": "--yry-text",
      "bg": "--yry-bg-card",
      "ratio": 17.2,
      "threshold": 4.5,
      "verdict": "pass"
    }
  ],
  "status_distances": [
    { "a": "--yry-pass", "b": "--yry-fail", "deltaE": 14.5, "verdict": "pass" }
  ],
  "summary": {
    "verdict": "pass",
    "errors": 0,
    "warnings": 1,
    "must_fix": [],
    "should_consider": ["Raise --yry-text-muted vs --yry-bg-card ratio from 3.0 to 3.5 for AAA on UI hints."]
  }
}
```

## Guidelines

- **No CSS mutation** — the agent only reads and reports.
- **Audits are deterministic** — same CSS → same report.
- **WCAG AA is the floor, AAA is encouraged** but not required for body text vs secondary text.
- **Status distances use ΔE76** — good enough for ordinal comparisons; do not introduce ΔE2000 unless explicitly required.
- **Warnings are advisory**: do not block deployment; let the user decide.
- **Errors are blocking**: the orchestrator should refuse to apply a theme with `errors > 0`.
