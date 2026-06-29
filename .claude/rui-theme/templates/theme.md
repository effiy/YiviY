# <Theme Name>

> <One-line description of the theme's mood and use case.>

## Visual Identity

| Aspect | Choice |
|--------|--------|
| Mood | <e.g., "Warm and grounded earth tones"> |
| Best for | <e.g., "Documentation, productivity tools"> |
| Light/Dark | <Both / Light only / Dark only> |

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--yry-bg-primary` | `#XXXXXX` | Page background |
| `--yry-bg-secondary` | `#XXXXXX` | Surface (cards, panels) |
| `--yry-bg-tertiary` | `#XXXXXX` | Elevated surface (hover, active) |
| `--yry-text-primary` | `#XXXXXX` | Main text |
| `--yry-text-secondary` | `#XXXXXX` | Muted text |
| `--yry-text-muted` | `#XXXXXX` | Disabled / hints |
| `--yry-border` | `#XXXXXX` | Borders, dividers |
| `--yry-accent` | `#XXXXXX` | Primary accent / interactive |
| `--yry-accent-muted` | `#XXXXXX` | Accent backgrounds |
| `--yry-success` | `#XXXXXX` | Success state |
| `--yry-warn` | `#XXXXXX` | Warning state |
| `--yry-error` | `#XXXXXX` | Error state |
| `--yry-chart-1` | `#XXXXXX` | Chart series 1 |
| `--yry-chart-2` | `#XXXXXX` | Chart series 2 |
| `--yry-chart-3` | `#XXXXXX` | Chart series 3 |
| `--yry-chart-4` | `#XXXXXX` | Chart series 4 |
| `--yry-chart-5` | `#XXXXXX` | Chart series 5 |

## Font Pairings

| Slot | Family | Weights |
|------|--------|---------|
| Heading | `<e.g., "Inter">` | 600, 700 |
| Body | `<e.g., "Inter">` | 400, 500 |
| Mono | `<e.g., "JetBrains Mono">` | 400, 600 |

## Usage Heuristics

- **Pair with**: <e.g., "Suited for SaaS dashboards"> 
- **Avoid**: <e.g., "Avoid on image-heavy hero pages"> 
- **Accessibility**: <e.g., "AA contrast on body text"> 

## CSS Skeleton

```css
:root {
    --yry-bg-primary:    #XXXXXX;
    --yry-bg-secondary:  #XXXXXX;
    --yry-bg-tertiary:   #XXXXXX;
    --yry-text-primary:  #XXXXXX;
    --yry-text-secondary:#XXXXXX;
    --yry-text-muted:    #XXXXXX;
    --yry-border:        #XXXXXX;
    --yry-accent:        #XXXXXX;
    --yry-accent-muted:  #XXXXXX;
    --yry-success:       #XXXXXX;
    --yry-warn:          #XXXXXX;
    --yry-error:         #XXXXXX;
    --yry-chart-1:       #XXXXXX;
    --yry-chart-2:       #XXXXXX;
    --yry-chart-3:       #XXXXXX;
    --yry-chart-4:       #XXXXXX;
    --yry-chart-5:       #XXXXXX;

    --yry-font-sans: <heading>, <fallback>;
    --yry-font-mono: <mono>, <fallback>;
}
```