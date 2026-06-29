# Theme Reference

Quick-reference for all 10 preset CDN themes. Full details (exact hex values, font pairings, usage notes) are in `.claude/rui-theme/themes/<name>.md`. The CDN CSS files are at `cdn/theme/<name>.css`.

## How Themes Work

All 10 themes define the same set of `--yry-*` CSS custom properties on `:root`. The docs token bridge (`docs/styles/tokens.css`) maps `--yry-*` → `--vl-doc-*`, so switching themes requires changing only ONE line — the `<link>` href in `docs/index.html`:

```html
<!-- Change this line to switch themes -->
<link rel="stylesheet" href="../cdn/theme/ocean-depths.css">
```

## Theme Table

| # | Theme Name | CDN File | Mode | Primary Colors | Mood | Best For |
|---|-----------|----------|------|---------------|------|----------|
| 1 | Ocean Depths | `ocean-depths.css` | Dark | Deep Navy `#1a2332`, Teal `#2d8b8b`, Seafoam `#a8dadc`, Cream `#f1faee` | Professional, Calm | Corporate, financial, trust-building |
| 2 | Sunset Boulevard | `sunset-boulevard.css` | Light | Burnt Orange `#e76f51`, Coral `#f4a261`, Gold `#e9c46a`, Dark Purple `#264653` | Warm, Energetic | Creative, marketing, storytelling |
| 3 | Forest Canopy | `forest-canopy.css` | Light | Forest Green `#2d4a2b`, Sage `#7d8471`, Olive `#a4ac86`, Ivory `#faf9f6` | Natural, Grounded | Sustainability, outdoor, wellness |
| 4 | Modern Minimalist | `modern-minimalist.css` | Light | Charcoal `#36454f`, Slate `#708090`, Light Gray `#d3d3d3`, White `#ffffff` | Clean, Contemporary | General-purpose, versatile (default) |
| 5 | Golden Hour | `golden-hour.css` | Light | Mustard `#f4a900`, Terracotta `#c1666b`, Beige `#d4b896`, Brown `#4a403a` | Rich, Sophisticated | Premium brands, editorial, luxury |
| 6 | Arctic Frost | `arctic-frost.css` | Light | Ice Blue `#d4e4f7`, Steel Blue `#4a6fa5`, Silver `#c0c0c0`, White `#fafafa` | Cool, Precise | Data-heavy, analytics, technical |
| 7 | Desert Rose | `desert-rose.css` | Light | Dusty Rose `#d4a5a5`, Clay `#b87d6d`, Sand `#e8d5c4`, Burgundy `#5d2e46` | Soft, Elegant | Fashion, beauty, lifestyle |
| 8 | Tech Innovation | `tech-innovation.css` | Dark | Electric Blue `#0066ff`, Cyan `#00ffff`, Dark Gray `#1e1e1e`, White `#ffffff` | Bold, Modern | SaaS, developer tools, startups |
| 9 | Botanical Garden | `botanical-garden.css` | Light | Fern Green `#4a7c59`, Marigold `#f9a620`, Terracotta `#b7472a`, Cream `#f5f3ed` | Fresh, Organic | Health, education, community |
| 10 | Midnight Galaxy | `midnight-galaxy.css` | Dark | Deep Purple `#2b1e3e`, Cosmic Blue `#4a4e8f`, Lavender `#a490c2`, Silver `#e6e6fa` | Dramatic, Cosmic | Gaming, AI, creative tech, immersive |

## Theme Selection Decision Tree

```
Does the page need dark mode?
├─ Yes → Is it corporate/professional?
│   ├─ Yes → Ocean Depths (#1)
│   └─ No → Is it bold/tech-forward?
│       ├─ Yes → Tech Innovation (#8)
│       └─ No → Midnight Galaxy (#10)
│
└─ No (light mode) → What's the mood?
    ├─ Clean/neutral/general → Modern Minimalist (#4)
    ├─ Warm/creative/marketing → Sunset Boulevard (#2) or Golden Hour (#5)
    ├─ Cool/technical/precise → Arctic Frost (#6)
    ├─ Natural/earthy/calm → Forest Canopy (#3) or Botanical Garden (#9)
    └─ Soft/elegant/fashion → Desert Rose (#7)
```

## Matching Design System Palettes to Themes

When rui-ui's `--design-system` recommends a color palette, match it to the closest theme:

| Design System Palette | Closest Theme(s) |
|----------------------|------------------|
| Dark + blue/teal accent | Ocean Depths |
| Dark + blue/cyan accent | Tech Innovation |
| Dark + purple/violet accent | Midnight Galaxy |
| Light + warm orange/yellow | Sunset Boulevard, Golden Hour |
| Light + green/earth tones | Forest Canopy, Botanical Garden |
| Light + blue/cool tones | Arctic Frost |
| Light + neutral/grayscale | Modern Minimalist |
| Light + pink/rose/mauve | Desert Rose |

## Custom Themes

If none of the 10 presets fit:
1. Copy an existing `cdn/theme/<name>.css` as a starting point
2. Modify the hex values in the `:root` block (all `--yry-*` variables must be defined)
3. Create a matching `.claude/rui-theme/themes/<name>.md` file following the existing format
4. The token bridge (`docs/styles/tokens.css`) works automatically with any theme that defines the full `--yry-*` variable set

## Fallback

`cdn/theme/default.css` is a minimal fallback theme. Use it as a base when creating custom themes or when no preset theme is suitable.
