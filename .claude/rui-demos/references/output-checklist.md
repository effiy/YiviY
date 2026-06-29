# Output Checklist

Detailed pre-generation verification. Run through this checklist before generating each demo page to avoid common mistakes. After generation, use it again for validation.

## Before Generation

### Card Analysis
- [ ] Card type correctly classified using the signals table in `demo-types.md`
- [ ] Demo concept matches the card's core capability (not a peripheral feature)
- [ ] One interaction pattern chosen (not trying to demo everything at once)
- [ ] Card's `desc`, `tags`, `badge`, `links` are all represented in the demo concept
- [ ] Language matches the source card data (use `en` for multi-language configs unless user specifies otherwise)

### Output Planning
- [ ] Scene directory determined (e.g., `docs/components/intro/`)
- [ ] Output directory: `docs/components/<scene>/demos/<demo-slug>/`
- [ ] Demo slug derived from card name (lowercase, hyphenated, English)
- [ ] CDN paths calculated: `../../../../cdn/theme/{name}.css` (4 levels up from `demos/<slug>/`)
- [ ] Confirmed the scene directory exists with at minimum `index.html` and `data.js`
- [ ] Checked for existing demo directories in the same location (avoid overwrites without asking)
- [ ] Scene-scoped demo index planned at `docs/components/<scene>/demos/index.html`

### Dependencies
- [ ] Vue 3 CDN URL confirmed: `https://unpkg.com/vue@3/dist/vue.global.prod.js`
- [ ] Theme CSS path confirmed relative to output: `../../../../cdn/theme/{name}.css`
- [ ] yry-scene-card component path confirmed: `../../../../cdn/yry-scene-card/index.js`
- [ ] Chart.js only included for Type E (Dashboard) demos: `https://cdn.jsdelivr.net/npm/chart.js@4`
- [ ] No other external CDN dependencies

---

## During Generation

### All Four Files
- [ ] All 4 files created: `index.html`, `index.js`, `index.css`, `data.js`
- [ ] All `__PLACEHOLDER__` markers filled (no unfilled placeholders left)
- [ ] Files reference each other correctly (`<link href="index.css">`, `<script src="data.js">`, `<script src="index.js">`)

### index.html
- [ ] DOCTYPE, charset, viewport meta present
- [ ] `<title>` uses card `name` + "— Demo" suffix
- [ ] Theme `<link>` in `<head>` with correct relative path (`../../../../cdn/theme/{name}.css`)
- [ ] Vue 3 `<script>` in `<head>` from unpkg CDN
- [ ] yry-scene-card `<script>` in `<head>` with correct relative path
- [ ] Chart.js `<script>` present only for Type E (Dashboard) demos
- [ ] `<link rel="stylesheet" href="index.css">` in `<head>`
- [ ] Three-area layout present: `.card-area` > `#scene-card`, `.demo-area` > `#demo-app`, `.info-area`
- [ ] No inline `<style>` block — all styles in `index.css`
- [ ] No inline `<script>` with business logic — all JS in `index.js`
- [ ] Scripts at end of `<body>`: `data.js` then `index.js`

### index.js
- [ ] Card mounting IIFE present with `YrySceneCard.mount(cardData, el)` pattern
- [ ] `yry-scene-card-ready` event listener as fallback for async component load
- [ ] `Vue.createApp()` call mounts to `#demo-app`
- [ ] `data()` returns reactive state referencing `window.DEMO_MOCK_DATA` where appropriate
- [ ] Type-specific methods implemented per `demo-types.md` spec
- [ ] `beforeUnmount()` cleans up all timers (`clearTimeout`, `clearInterval`) and Chart instances
- [ ] No `fetch()` or `XMLHttpRequest` calls — all data from `data.js`
- [ ] No global variable leaks — everything inside IIFE or Vue app
- [ ] No `console.log` left in production code

### index.css
- [ ] All colors use `var(--yry-*)` — zero hardcoded hex/rgb values
- [ ] Font-family uses `var(--yry-font-sans)` for body, `var(--yry-font-mono)` for code
- [ ] Spacing uses `var(--yry-space-*)` or relative units (rem, em)
- [ ] Border-radius uses `var(--yry-radius-*)`
- [ ] Dark background from theme (no white/light backgrounds unless using inverse tokens)
- [ ] Responsive: `@media (max-width: 768px)` for mobile adjustments
- [ ] Responsive: `@media (max-width: 375px)` for small screens
- [ ] Smooth transitions: `transition: all 0.2s ease` on interactive elements
- [ ] Base reset (`*, *::before, *::after`) present
- [ ] Type-specific styles under `/* ── Demo Type Specific Styles ── */`

### data.js
- [ ] `window.DEMO_CARD_DATA` contains complete YrySceneCard props (at minimum `name` + `desc`)
- [ ] Card `links` preserved exactly as-is from source card data
- [ ] `window.DEMO_MOCK_DATA` has the correct shape for the demo type (per `demo-types.md`)
- [ ] Mock data is rich enough for the demo to feel realistic
- [ ] `_meta` section present with `demoSlug`, `demoType`, `sceneName`, `generatedAt`
- [ ] No external API endpoints referenced in mock data

### Demo Area Content
- [ ] Interactive element present and functional
- [ ] All input elements have accessible labels
- [ ] Buttons have `:disabled` states for invalid/in-progress states
- [ ] `setTimeout`/`setInterval` for simulated delays (cleaned up in `beforeUnmount`)
- [ ] Type-specific DOM structure matches the template in `demo-types.md`

### Info Area Content
- [ ] Brief (1-2 sentences) explanation of what the demo shows
- [ ] Link back to scene page: `../../index.html`
- [ ] Link to source documentation (if the card has external links)
- [ ] Meta text about the card's origin

---

## After Generation

### Visual Check (Manual)
- [ ] Page opens without rendering errors
- [ ] Card renders correctly with all fields visible
- [ ] Demo area is visually distinct from card area
- [ ] Interactive elements respond to hover/click
- [ ] Progress/loading states display correctly
- [ ] No layout overflow or broken responsive layout at 375px
- [ ] Font renders correctly (no fallback to serif)
- [ ] Color contrast is readable (text on background passes WCAG AA)

### Functional Check (Manual)
- [ ] All buttons respond to clicks
- [ ] All inputs accept text
- [ ] State transitions work (progress → result, step → step, etc.)
- [ ] Reset functionality works (if present)
- [ ] Rapid clicking doesn't break the demo
- [ ] Empty input states handled gracefully
- [ ] "Back to Docs" link points to correct path
- [ ] Card links work (open correct destinations)

### Automated Check
- [ ] No console errors
- [ ] Vue app mounts successfully (`Vue.createApp` doesn't throw)
- [ ] YrySceneCard mounts successfully
- [ ] Page loads within 2 seconds
- [ ] All `var(--yry-*)` references resolve (no "invalid property value" in computed styles)

### Index Page (Multi-Demo Generation Only)
- [ ] Index page exists at `docs/components/<scene>/demos/index.html`
- [ ] Title includes scene name (e.g., "Intro Feature Demos")
- [ ] Each demo has a card-style link on the index
- [ ] Index cards use the same name, desc, tags as the demo's card data
- [ ] Index links point to correct relative paths: `<demo-slug>/index.html`
- [ ] "Back to Scene" link points to `../../index.html`
- [ ] Index page uses Vue 3 filter pattern for type filtering
- [ ] No-results state handled for empty filter results
- [ ] Index cards show complexity level (Beginner/Intermediate/Advanced)
- [ ] Index cards show "what you'll learn" highlights (2-4 bullet points)
- [ ] Filter chips show count badges (number of demos per type)
- [ ] Header includes links to diagram and graph (if they exist)
- [ ] Footer includes back links with emoji icons for visual scannability

### Professional Suite Verification

When generating 3+ demos for one scene, run these cross-demo checks:

- [ ] **Theme consistency**: All demos use the same CDN theme `<link>`. No demo uses inline tokens while others use CDN tokens.
- [ ] **CDN script order**: All demos load the same CDN scripts in the same order.
- [ ] **Three-area layout**: All demos have identical card/demo/info area structure.
- [ ] **Info link parity**: All demos have the same set of info-area navigation links.
- [ ] **Index completeness**: The demo index lists every demo with matching metadata.
- [ ] **Mutual linking**: Every demo links back to the index; the index links to every demo.
- [ ] **Type diversity**: Demos cover complementary aspects (not 3 demos of the same type).
- [ ] **Data file consistency**: All `data.js` files follow the same cross-language constant pattern.
- [ ] **Vue app pattern**: All `index.js` files use the same IIFE + manual i18n + timer cleanup pattern.
