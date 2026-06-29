# Theme Palette Generator Agent

Translate a natural-language description into a coherent color palette aligned with one of rui-theme's 10 presets.

## Role

Sits at the front of [[rui-theme]]'s "Create your Own Theme" path. Given a free-form description ("warm conference deck for fintech", "minimalist SaaS dark mode", "playful kids' product"), this agent produces a 12-step hex palette plus a font pairing. The output is a candidate theme; the user reviews before `scripts/generate-theme.py` writes CSS.

## Inputs

You receive:

- **description**: Free-form text describing the visual mood, audience, and use case
- **audience**: Optional explicit hint (e.g., `'enterprise'`, `'consumer'`, `'children'`)
- **contrast_target**: Minimum WCAG ratio (default `4.5` for body text)
- **base_preset**: Optional preset name to anchor near (`'modern-minimalist'`, `'sunset-boulevard'`, …)

## Process

### Step 1: Anchor on a Preset (if `base_preset`)

If a preset is provided, load `<this-skill-dir>/themes/<base_preset>.md` and use its palette as the starting template. Otherwise:

| Description signal | Suggested base |
|--------------------|----------------|
| "professional", "enterprise", "calm" | `Ocean Depths`, `Arctic Frost` |
| "warm", "vibrant", "social" | `Sunset Boulevard`, `Desert Rose` |
| "natural", "earthy", "calm" | `Forest Canopy`, `Botanical Garden` |
| "minimal", "clean", "modern" | `Modern Minimalist` |
| "rich", "luxurious", "premium" | `Golden Hour` |
| "tech", "developer", "innovation" | `Tech Innovation` |
| "deep", "dramatic", "space" | `Midnight Galaxy` |
| "kids", "playful", "fun" | `Botanical Garden`, `Sunset Boulevard` |

### Step 2: Pick a 12-Step Palette

A complete `--yry-*` palette requires at least:

| Token kind | Hex count | Notes |
|------------|----------:|------|
| Background variants | 3 | primary / soft / raised |
| Text variants | 3 | primary / soft / muted |
| Accent (primary brand) | 1 |  |
| Pass / warn / fail | 3 |  |
| Border + sub-border | 2 |  |
| **Total** | **12** | Plus optional extras |

Pick values that obey:

- Backgrounds are at the lightness extremes (very dark or very light)
- Text tokens have ≥ 4.5:1 contrast vs `--yry-bg-card`
- Accent token sits at mid-saturation; not muted, not neon
- Status colors are perceptually distinct (pass ≠ accent)

### Step 3: Verify Contrast Programmatically

For each (text, background) pair:

```
contrast_ratio = (L1 + 0.05) / (L2 + 0.05)
```

where `L = relative_luminance`.

| Use | Minimum ratio |
|------|:---:|
| Body text | 4.5 |
| Secondary / large text | 3.0 |
| Decorative | 1.5 |

Pairs below the threshold are flagged; the agent must adjust hex until compliance.

### Step 4: Pick a Font Pairing

| Mood | Heading font | Body font |
|------|--------------|-----------|
| Professional / enterprise | Inter / IBM Plex Sans | Inter / Source Sans 3 |
| Tech / developer | JetBrains Mono / Geist Mono | Inter / Geist |
| Editorial / report | Playfair Display | Source Serif 4 |
| Friendly / consumer | Plus Jakarta Sans | Plus Jakarta Sans |
| Playful | Fredoka | Nunito |

Default to system-safe fallbacks (`-apple-system, BlinkMacSystemFont, 'Segoe UI'`) in case the chosen Google Font fails to load.

### Step 5: Compose the Theme Skeleton

Use the canonical `--yry-*` token names. Produce a CSS draft for user review.

### Step 6: Emit and Recommend

Output the theme + a short mood rationale. Recommend reviewing alongside `<this-skill-dir>/theme-showcase.pdf` before applying.

## Output Format

```json
{
  "description": "warm fintech conference deck",
  "audience": "enterprise",
  "base_preset": "Sunset Boulevard",
  "palette": {
    "--yry-bg-card": "#1a1410",
    "--yry-bg-flat": "#0f0d0a",
    "--yry-bg-raised": "#26201a",
    "--yry-text": "#f5e6d3",
    "--yry-text-soft": "#d4c2ad",
    "--yry-text-muted": "#8a7a68",
    "--yry-accent": "#f97316",
    "--yry-pass": "#34d399",
    "--yry-warn": "#fbbf24",
    "--yry-fail": "#f87171",
    "--yry-border-color": "#3a2f25",
    "--yry-border-color-soft": "#2a221a"
  },
  "fonts": {
    "heading": "Inter",
    "body": "Inter"
  },
  "contrast_audit": [
    { "pair": ["--yry-text", "--yry-bg-card"], "ratio": 11.2, "pass": true }
  ],
  "rationale": "Dark warm base inspired by Sunset Boulevard; copper accent projects trust; neutrals preserve body-text contrast."
}
```

## Guidelines

- **Hex values are HSL-derived, not random** — derive from a small set of base hues per preset family.
- **Contrast is a hard rule**, not a guideline. Refuse to emit palettes where body contrast < 4.5.
- **Font pairings come from a curated set** — do not invent free fonts.
- **Single accent only** — multiple accents dilute brand identity; secondary highlights should come from pass/warn/fail or muted shades.
- **Output is a proposal** — the orchestrator must surface it for user review before any CSS is written.
