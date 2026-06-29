# Component Checklist

Step-by-step verification for creating a new doc component. Check each item before declaring a component done.

## index.html (Template + Script Includes)

- [ ] Template ID is kebab-case and unique across the page (search existing templates for collisions)
- [ ] Root element inside `<template>` is the semantic container (`<section id="xxx">` or `<div id="xxx">`)
- [ ] Opening HTML comment documents the component's responsibility
- [ ] Scripts are in correct order: `<script src="data.js"></script>` BEFORE `<script src="index.js"></script>`
- [ ] No inline `<script>` blocks — all logic goes in `index.js`
- [ ] Vue template syntax is valid: `{{ }}` for text, `v-for` for loops, `v-if`/`v-show` for conditionals, `:attr` for bindings, `@event` for handlers
- [ ] Template references only fields that exist in `data.js` or `extra.data()` — no undefined property access in rendering

## data.js (Configuration & i18n Data)

- [ ] Injected as `window.XXX_CONFIG` (ALL_CAPS, matches `dataKey` in `mountDocComponent` call)
- [ ] `constants` key at top level for language-agnostic data (URLs, version strings, logo config, etc.)
- [ ] One key per language (`en`, `zh-CN`, etc.) — each language slice has identical structure
- [ ] Language codes match entries in `VL_LANG.available` array (defined in `assets/lang.js`)
- [ ] No fields duplicated between `constants` and language slices — if a field changes with language, it belongs in the language slice; if it never changes, it belongs in `constants`
- [ ] For YrySceneCard card data: `desc` uses `·` separators, at least one `<strong>`, 2-4 tags with semantic modifiers
- [ ] Valid JavaScript — no trailing commas that break older parsers, no ES6+ syntax in arrays/objects if targeting ES5
- [ ] Opening comment documents field responsibilities (especially for complex nested structures)

## index.js (Vue 3 Mounting Logic)

- [ ] Calls `mountDocComponent({...})` — not `Vue.createApp()` directly (unless component has documented custom mount pattern)
- [ ] `name` is PascalCase: `'DocXxx'`
- [ ] `templateId` matches the `<template id="...">` in `index.html` exactly
- [ ] `dataKey` matches the `window.XXX_CONFIG` key in `data.js` exactly
- [ ] `i18n: true` if component uses language-specific data from `data.js`
- [ ] `extra.data()` returns only component-private state (loading flags, abort controllers, chart instances) — does NOT redeclare fields from `data.js`
- [ ] `extra.methods` contains reusable logic extracted from lifecycle hooks
- [ ] `extra.mounted()` wraps DOM-dependent init in `this.$nextTick()`
- [ ] CDN sub-apps (YrySceneCard) are tracked in `this._mountedApps` array
- [ ] `extra.beforeUnmount()` cleans up: chart instances (`.destroy()`), fetch abort controllers (`.abort()`), timers (`clearTimeout`), CDN sub-apps (`.unmount()`)
- [ ] Language switch handler re-runs DOM-dependent init after `this.$nextTick()` (for components where Vue reactivity rebuilds child DOM)

## index.css (Component-Scoped Styles, Optional)

- [ ] Only contains styles that are truly component-specific — shared UI atoms go in `docs/styles/base.css`
- [ ] All selectors are scoped under the component's root class/id (e.g., `.code-activity-wrapper`, `#intro .demo-grid`)
- [ ] Uses `--vl-doc-*` CSS variables from tokens.css (never hardcoded colors/spacing/fonts)
- [ ] Component name is added to `_COMPONENTS_WITH_CSS` Set in `docs/assets/mount-component.js`

## docs/index.html (Entry Point Registration)

- [ ] `<div data-include="components/<name>/index.html">` added inside `<main class="main">` (or before it for sidebar)
- [ ] No explicit `<link rel="stylesheet">` for component CSS — it's auto-injected by `mountDocComponent`
- [ ] If component needs a new CDN dependency (new Vue plugin, new chart library), it's added in the correct position in `<head>` or before doc scripts

## i18n Verification (for multilingual components)

- [ ] All language slices in `data.js` have identical keys (spot-check: `Object.keys(config.en).sort()` equals `Object.keys(config['zh-CN']).sort()`)
- [ ] `constants` fields are accessible in templates without language prefix (they're merged into the resolved data object)
- [ ] Language switch doesn't cause console errors — test by calling `VL_LANG.setLanguage('zh-CN')` in dev console
- [ ] After language switch, CDN sub-apps (YrySceneCard) are re-mounted with new language data
