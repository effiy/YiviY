# Architecture Diagram Design System

Complete reference for the dark-themed SVG architecture diagram system. This is the detailed "how" — the SKILL.md body covers the "why and when."

## Color Palette

Use these semantic colors for component types. Colors are mapped from the 10-layer Knowledge Graph taxonomy — see `codebase-analysis.md` for the full layer→node type mapping.

### Full 10-Layer Palette

| Layer | KG Layer ID | Fill (rgba) | Stroke | Node Types | Directory Signals |
|-------|------------|-------------|--------|-----------|-------------------|
| **UI** | `layer:ui` | `rgba(8, 51, 68, 0.4)` | `#22d3ee` (cyan-400) | `file`, `class` | `frontend/`, `ui/`, `pages/`, `views/`, `components/`, `app/`, `templates/` |
| **API** | `layer:api` | `rgba(2, 43, 82, 0.45)` | `#38bdf8` (sky-400) | `file`, `endpoint` | `api/`, `routes/`, `handlers/`, `controllers/`, `endpoints/`, `gateway/` |
| **Service** | `layer:service` | `rgba(6, 78, 59, 0.4)` | `#34d399` (emerald-400) | `file`, `function`, `module` | `services/`, `logic/`, `domain/`, `core/`, `engine/`, `pipeline/` |
| **Data** | `layer:data` | `rgba(76, 29, 149, 0.4)` | `#a78bfa` (violet-400) | `table`, `schema`, `file` | `models/`, `entities/`, `db/`, `repositories/`, `store/`, `schemas/`, `migrations/` |
| **Infrastructure** | `layer:infrastructure` | `rgba(120, 53, 15, 0.3)` | `#fbbf24` (amber-400) | `service`, `pipeline`, `resource` | `infra/`, `deploy/`, `k8s/`, `terraform/`, `docker/`, `ci/`, `cloud/` |
| **Config** | `layer:config` | `rgba(51, 65, 85, 0.45)` | `#94a3b8` (slate-400) | `config` | `config/`, `env/`, `settings/`, `options/`, `.env`, `constants/` |
| **Auth** | `layer:auth` | `rgba(136, 19, 55, 0.4)` | `#fb7185` (rose-400) | `file`, `function` | `auth/`, `security/`, `guard/`, `middleware/auth*`, `oauth/`, `jwt/` |
| **Events** | `layer:events` | `rgba(251, 146, 60, 0.3)` | `#fb923c` (orange-400) | `file`, `function` | `queue/`, `events/`, `messages/`, `pubsub/`, `bus/`, `kafka/`, `stream/` |
| **Utility** | `layer:utility` | `rgba(30, 41, 59, 0.5)` | `#64748b` (slate-500) | `file`, `function` | `utils/`, `lib/`, `helpers/`, `common/`, `shared/` |
| **External** | `layer:external` | `rgba(30, 41, 59, 0.35)` | `#475569` (slate-600) | `module`, `service` | Third-party, external APIs, SaaS |

### Simplified 7-Color Quick Reference

For manual diagrams not driven by a KG:

| Component Type | Fill (rgba) | Stroke | Maps to Layer |
|---------------|-------------|--------|---------------|
| Frontend | `rgba(8, 51, 68, 0.4)` | `#22d3ee` (cyan-400) | `layer:ui` |
| Backend | `rgba(6, 78, 59, 0.4)` | `#34d399` (emerald-400) | `layer:service` |
| Database | `rgba(76, 29, 149, 0.4)` | `#a78bfa` (violet-400) | `layer:data` |
| AWS/Cloud | `rgba(120, 53, 15, 0.3)` | `#fbbf24` (amber-400) | `layer:infrastructure` |
| Security | `rgba(136, 19, 55, 0.4)` | `#fb7185` (rose-400) | `layer:auth` |
| Message Bus | `rgba(251, 146, 60, 0.3)` | `#fb923c` (orange-400) | `layer:events` |
| External/Generic | `rgba(30, 41, 59, 0.5)` | `#94a3b8` (slate-400) | `layer:external` |

### KG → SVG Mapping Summary

| KG Element | SVG Element | Key Detail |
|-----------|-------------|------------|
| `GraphNode` with layer | Colored component box | Fill + stroke from layer palette |
| `GraphNode.name` | Label `<text>` | `font-size="11"`, `font-weight="600"`, `fill="white"` |
| `GraphNode.summary` | Sublabel `<text>` | `font-size="9"`, `fill="#94a3b8"` |
| `GraphNode.tags[]` | Annotation tags | `font-size="8"`, `fill="#64748b"`, below sublabel |
| `GraphEdge` (internal) | Solid arrow + marker | Drawn before boxes (z-order) |
| `GraphEdge` (external) | Dashed arrow to external box | `stroke-dasharray="6,4"` |
| `GraphEdge.type` = "calls" | Arrow label "invokes" | `font-size="7"`, `fill="#64748b"` |
| Layer grouping | Region boundary rect | `stroke-dasharray="8,4"`, amber stroke |
| Auth grouping | Security boundary rect | `stroke-dasharray="4,4"`, rose stroke |
| Hub node (high fan-in) | Taller box | Extra 20-30px height, bold label |
| Hub node (high fan-out) | Wider box | Extra 30-50px width |
| `DiffImpact.changedNodes` | Dashed border on component | `stroke-dasharray="4,2"`, subtle `*` badge |
| `TourStep` annotation | Numbered circle + connecting line | Layer color fill, white number |

## Typography

JetBrains Mono exclusively (monospace, technical aesthetic):

```html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Font sizes: 12px component names, 9px sublabels, 8px annotations, 7px tiny labels.

## Background

`#020617` (slate-950) with subtle grid pattern:

```svg
<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" stroke-width="0.5"/>
</pattern>
```

Background rect fills the entire viewBox with `url(#grid)`.

## Component Boxes

Rounded rectangles (`rx="6"`) with 1.5px stroke, semi-transparent fills.

```svg
<rect x="X" y="Y" width="W" height="H" rx="6" fill="FILL_COLOR" stroke="STROKE_COLOR" stroke-width="1.5"/>
<text x="CENTER_X" y="Y+20" fill="white" font-size="11" font-weight="600" text-anchor="middle">LABEL</text>
<text x="CENTER_X" y="Y+36" fill="#94a3b8" font-size="9" text-anchor="middle">sublabel</text>
```

## Arrow Z-Order (Critical)

Draw connection arrows early in the SVG — after the background grid but before component boxes. SVG elements paint in document order, so arrows drawn first render behind shapes drawn later.

## Masking Arrows Behind Transparent Fills (Critical)

Since component fills are semi-transparent (`rgba(..., 0.4)`), arrows behind them bleed through. To fully mask an arrow: draw an opaque background rect (`fill="#0f172a"`) at the same position first, then the semi-transparent styled rect on top:

```svg
<!-- Opaque background to mask arrows -->
<rect x="X" y="Y" width="W" height="H" rx="6" fill="#0f172a"/>
<!-- Styled component on top -->
<rect x="X" y="Y" width="W" height="H" rx="6" fill="rgba(76, 29, 149, 0.4)" stroke="#a78bfa" stroke-width="1.5"/>
```

## Arrows

Use SVG marker for arrowheads:

```svg
<marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
  <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
</marker>
```

Arrow paths use `marker-end="url(#arrowhead)"`. Variants for dashed (auth flows: `stroke-dasharray="6,4" stroke="#fb7185"`) and bidirectional.

## Security Groups

Dashed stroke (`stroke-dasharray="4,4"`), transparent fill, rose color (`#fb7185`). Used to group components within a security boundary (VPC, auth zone, etc.).

## Region Boundaries

Larger dashed stroke (`stroke-dasharray="8,4"`), amber color (`#fbbf24`), `rx="12"`. Used for cluster/region groupings (Kubernetes cluster, AWS region, etc.).

## Message Buses

Small connector elements between services. Orange color:

```svg
<rect x="X" y="Y" width="120" height="20" rx="4" fill="rgba(251, 146, 60, 0.3)" stroke="#fb923c" stroke-width="1"/>
<text x="CENTER_X" y="Y+14" fill="#fb923c" font-size="7" text-anchor="middle">Kafka / RabbitMQ</text>
```

## Spacing Rules (Critical)

- Standard component height: 60px (services), 80-120px (larger components)
- Minimum vertical gap between components: 40px
- Inline connectors (message buses): place in the gap, centered vertically

Example vertical layout:
```
Component A: y=70,  height=60  → ends at y=130
Gap:         y=130 to y=170   → 40px gap, place bus at y=140 (20px tall)
Component B: y=170, height=60  → ends at y=230
```

## Legend Placement (Critical)

Legends MUST be outside all boundary boxes, at least 20px below the lowest boundary. Expand SVG viewBox height to accommodate.

```
Kubernetes Cluster: y=30, height=460 → ends at y=490
Legend should start at: y=510 or below
SVG viewBox height: at least 560
```

## Layout Structure

1. **Header** — Title with pulsing dot indicator, subtitle, export toolbar
2. **Main SVG diagram** — Contained in rounded border card
3. **Summary cards** — Grid of 3 cards with key details
4. **Footer** — Minimal metadata line

## Info Card Pattern

```html
<div class="card">
  <div class="card-header">
    <div class="card-dot COLOR"></div>
    <h3>Title</h3>
  </div>
  <ul>
    <li>• Item one</li>
    <li>• Item two</li>
  </ul>
</div>
```

## Export Toolbar

Every diagram ships with a `⋯` toggle in the header. Click to reveal three buttons:
- 📋 **Copy** — high-DPI PNG to clipboard (scale: 2)
- 🖼️ **PNG** — high-DPI PNG download
- 📄 **PDF** — PNG embedded in a one-page PDF via jsPDF

### Required CDN Scripts (pinned versions, with SRI hashes)

```html
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"
  integrity="sha384-ZZ1pncU3bQe8y31yfZdMFdSpttDoPmOZg2wguVK9almUodir1PghgT0eY7Mrty8H"
  crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js"
  integrity="sha384-en/ztfPSRkGfME4KIm05joYXynqzUgbsG5nMrj/xEFAHXkeZfO3yMK8QQ+mP7p1/"
  crossorigin="anonymous"></script>
```

Do not modify the SRI hashes. If bumping versions, compute fresh hashes.

### Required DOM Structure

- `id="report-container"` on the outermost `.container` div (this is what gets captured)
- `.toolbar` with `.toolbar-actions` (collapsed by default) and `.toolbar-toggle` (the `⋯` button)
- `.toolbar` CSS + `@media print { .toolbar { display: none !important; } }`
- `copyAsImage()`, `downloadPNG()`, `downloadPDF()` functions before `</body>`

### Export JS Functions

All three use `getBoundingClientRect()` + `html2canvas(document.body, { x, y, width, height, ignoreElements })` to capture a precise rect with 32px padding and the toolbar excluded.

Caveats: clipboard API needs a secure context (https/file/localhost). SVG `<foreignObject>` renders inconsistently in html2canvas — stick to plain `<svg>` shapes and `<text>`. Bump `scale: 2` to `3` or `4` for higher-res output.

## Template

Copy `resources/template.html` as a starting point. Customization points:
1. `<title>` and header text
2. SVG viewBox dimensions (default: `1000 x 680`)
3. Component boxes (add/remove/reposition)
4. Connection arrows between components
5. Three summary cards
6. Footer metadata

## Output Convention

Single self-contained `.html` file with:
- Embedded CSS (no external stylesheets except Google Fonts)
- Inline SVG (no external images)
- CSS-only animations (no JS required for display)
- Export toolbar JS (html2canvas + jsPDF CDN)
