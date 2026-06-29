# Theme CSS Variables

Every generated demo page uses `--yry-*` CSS variables from the CDN theme. Never hardcode colors — use these variables so the demo works with any theme.

## Available Variables

These variables are defined by the CDN theme CSS (`cdn/theme/{name}.css`). All generated demo pages must reference these, never raw hex values.

### Background & Surface

| Variable | Semantic Meaning | Typical Usage |
|----------|-----------------|---------------|
| `--yry-bg-primary` | Page background | `body` background |
| `--yry-bg-secondary` | Elevated surface | Cards, panels, code blocks |
| `--yry-bg-tertiary` | Higher elevation | Modal overlays, tooltips, hover states |
| `--yry-bg-inverse` | Inverse background | Inverted sections, footer |

### Text & Content

| Variable | Semantic Meaning | Typical Usage |
|----------|-----------------|---------------|
| `--yry-text-primary` | Primary text | Body copy, headings |
| `--yry-text-secondary` | Secondary text | Subtitles, descriptions |
| `--yry-text-muted` | Muted/disabled text | Placeholders, disabled controls, timestamps |
| `--yry-text-inverse` | Inverse text | Text on accent/inverse backgrounds |

### Brand & Accent

| Variable | Semantic Meaning | Typical Usage |
|----------|-----------------|---------------|
| `--yry-accent` | Primary brand accent | Active states, primary buttons, links, progress fills |
| `--yry-accent-hover` | Accent hover state | Button hover, link hover |
| `--yry-accent-muted` | Muted accent | Subtle accent backgrounds |
| `--yry-accent-text` | Text on accent bg | Button labels, badge text |

### Status Colors

| Variable | Semantic Meaning | Typical Usage |
|----------|-----------------|---------------|
| `--yry-success` | Success / positive | Green indicators, pass badges, completed steps |
| `--yry-warning` | Warning / caution | Orange indicators, score warnings, attention-needed states |
| `--yry-error` | Error / danger | Red indicators, critical issues, failed states |
| `--yry-info` | Info / neutral | Blue indicators, info badges, neutral classification |

### Borders & Lines

| Variable | Semantic Meaning | Typical Usage |
|----------|-----------------|---------------|
| `--yry-border` | Default border | Card borders, input borders, dividers |
| `--yry-border-hover` | Border on hover | Input focus, card hover highlight |
| `--yry-border-accent` | Accent border | Active card border, selected state |

### Shadows & Effects

| Variable | Semantic Meaning | Typical Usage |
|----------|-----------------|---------------|
| `--yry-shadow-sm` | Subtle shadow | Card elevation (low) |
| `--yry-shadow-md` | Medium shadow | Card elevation (medium), hover lift |
| `--yry-shadow-lg` | Large shadow | Modal elevation |

### Typography

| Variable | Semantic Meaning | Typical Usage |
|----------|-----------------|---------------|
| `--yry-font-sans` | Sans-serif font stack | Body text, UI elements |
| `--yry-font-mono` | Monospace font stack | Code blocks, logs, technical data |
| `--yry-font-size-xs` | Extra small | Badges, meta text, log timestamps |
| `--yry-font-size-sm` | Small | Secondary text, labels |
| `--yry-font-size-base` | Base | Body copy (16px typical) |
| `--yry-font-size-lg` | Large | Section headings |
| `--yry-font-size-xl` | Extra large | Page titles |
| `--yry-font-size-2xl` | 2x large | Hero titles |

### Spacing & Sizing

| Variable | Semantic Meaning | Typical Usage |
|----------|-----------------|---------------|
| `--yry-space-1` | 4px | Tight gaps (icon + text) |
| `--yry-space-2` | 8px | Small gaps (tag gaps) |
| `--yry-space-3` | 12px | Medium gaps (card padding) |
| `--yry-space-4` | 16px | Standard gaps (section padding) |
| `--yry-space-5` | 20px | Section spacing |
| `--yry-space-6` | 24px | Large gaps (page sections) |
| `--yry-space-8` | 32px | Page margins |
| `--yry-radius-sm` | 4px | Small radius (tags, badges) |
| `--yry-radius-md` | 8px | Medium radius (cards, inputs, buttons) |
| `--yry-radius-lg` | 12px | Large radius (modals, large cards) |

## Usage Rules

### Always Use Variables

```css
/* ✅ Correct — uses theme variables */
.demo-area {
    background: var(--yry-bg-secondary);
    border: 1px solid var(--yry-border);
    border-radius: var(--yry-radius-md);
    padding: var(--yry-space-4);
    color: var(--yry-text-primary);
}

/* ❌ Wrong — hardcoded values */
.demo-area {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 16px;
    color: #e2e8f0;
}
```

### Use Semantic Values, Not Visual Ones

```css
/* ✅ Correct — semantic choice */
.status-critical {
    color: var(--yry-error);
}
.status-good {
    color: var(--yry-success);
}

/* ❌ Wrong — using accent for error states */
.status-critical {
    color: var(--yry-accent);  /* accent is brand color, not error */
}
```

### When a Variable Is Missing

If the theme doesn't provide a variable you need, derive it:

```css
/* Derive a semi-transparent version of an existing token */
.custom-overlay {
    background: color-mix(in srgb, var(--yry-bg-primary) 80%, transparent);
    /* or */
    background: var(--yry-bg-secondary);  /* fall back to nearest semantic match */
}
```

Do NOT add inline hex values. Do NOT define new `--custom-*` variables with hardcoded colors.

### Font Stack

Always use the theme font variables:

```css
body {
    font-family: var(--yry-font-sans);
}
code, pre, .log-entry, .metric-value {
    font-family: var(--yry-font-mono);
}
```
