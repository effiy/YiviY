# Infrastructure API Reference

Full API documentation for the four core infrastructure modules in `docs/assets/`.

---

## `mount-component.js` — mountDocComponent()

### Signature

```javascript
mountDocComponent(opts)
```

### opts Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String | **Yes** | Vue component name (PascalCase, e.g. `'DocIntro'`). Used as Vue devtools identifier and console.error prefix. |
| `templateId` | String | **Yes** | DOM id of the `<template id="...">` element in the component's `index.html`. |
| `dataKey` | String | **Yes** | Key on `window` where the component's data is stored (e.g. `'INTRO_CONFIG'`). |
| `i18n` | Boolean | No | Enable automatic language switching. When `true`, the data at `window[dataKey]` must follow the `{constants:{...}, en:{...}, 'zh-CN':{...}}` format. |
| `extra` | Object | No | Additional Vue 2/3 component options merged via `Object.assign`. Supports `data`, `methods`, `mounted`, `beforeUnmount`, `computed`, `watch`, etc. |

### Behavior

1. Checks that `Vue` global exists; logs error and returns if not
2. Finds `<template id="<templateId>">` in DOM; logs error if not found or empty
3. Calls `injectComponentStylesheet()` to auto-load component CSS if applicable
4. Creates a generic `<div>` mount point inserted before the `<template>` element
5. Assembles Vue component options: `{name, template: '#<templateId>', data, ...extra}`
6. If `i18n: true`, wraps component with `wrapI18n()` (see below)
7. Calls `Vue.createApp(Component).mount(mountEl)`

### i18n Data Format

When `i18n: true`, `window[dataKey]` must follow this structure:

```javascript
window.EXAMPLE_CONFIG = {
    // Language-agnostic constants (automatically merged into every language slice)
    constants: {
        apiUrl: 'https://api.example.com/data.json',
        version: '2.1.0'
    },
    // English slice
    en: {
        title: 'Example Title',
        description: 'Example description text'
    },
    // Chinese slice (identical structure, different text)
    'zh-CN': {
        title: '示例标题',
        description: '示例描述文本'
    }
};
```

### wrapI18n Internals

The `wrapI18n()` function modifies the Component object in-place:

**`data()` override:**
1. Calls original `data()` (from `extra.data` or default `window[dataKey]`)
2. Checks if `window[dataKey]` has language-code keys
3. If yes: resolves current language, merges `constants` + language slice + `currentLang` + component-private state
4. If no: returns original data unchanged (component has no i18n despite `i18n: true` flag)

**`mounted()` override:**
1. Calls original `mounted()` if present
2. Registers `vl-lang-changed` listener
3. On language change: calls `applyI18nSlice()` which iterates over new language slice and sets each property on the Vue instance (triggering reactive re-render)

---

## `mount-component.js` — injectComponentStylesheet()

### Signature

```javascript
injectComponentStylesheet()
```

### Behavior

1. Reads `document.currentScript` to determine the calling script's directory
2. Priority: `script.getAttribute('data-cs-dir')` → `script.src` dirname
3. Extracts component name from path segments (looks for `components/<name>/` or `cdn/<name>/`)
4. Checks if component name is in the `_COMPONENTS_WITH_CSS` Set
5. If yes: checks if `<link rel="stylesheet" href="<dir>/index.css">` already exists in `<head>`
6. If not: creates and appends the `<link>` element

### _COMPONENTS_WITH_CSS Set

A hardcoded whitelist of component directory names that have `index.css`:

```javascript
var _COMPONENTS_WITH_CSS = new Set([
    'sidebar',
    'intro',
    'quick-start',
    'workflow',
    'translations',
    'code-activity',
    'footer'
]);
```

**To add a new component with CSS:** append its directory name to this Set.

---

## `include.js` — includeHTML()

### Signature

```javascript
includeHTML()  // returns Promise<void>
```

### Behavior

1. Queries all `document.querySelectorAll('[data-include]')` elements
2. For each element, reads the `data-include` attribute as a URL
3. Fetches the URL; on success, sets `el.innerHTML = html`
4. Calls `loadIncludedScriptsSequentially(el, includeDir)` to execute scripts in order
5. Returns `Promise.all(promises)` — resolves when ALL includes are fetched and scripts executed

### loadIncludedScriptsSequentially()

```javascript
loadIncludedScriptsSequentially(container, baseDir)  // returns Promise<void>
```

**Key guarantee:** scripts execute sequentially in DOM order. A `.reduce()` Promise chain ensures each script fully loads and executes before the next begins. This is critical for the `data.js` → `index.js` ordering guarantee.

**External scripts (`<script src="...">`):**
1. Resolves `src` relative to `baseDir` (the included HTML file's directory)
2. Fetches script source
3. Creates a new `<script>` element with `textContent = fetchedCode` (inline injection)
4. Sets `data-cs-dir` attribute to the script's own directory (for CSS injection)
5. Replaces old script node with new one

**Inline scripts (`<script>code</script>`):**
1. Copies `textContent` to a new `<script>` element
2. Replaces old script node with new one (triggering execution)

---

## `lang.js` — VL_LANG

### API

```javascript
window.VL_LANG = {
    current: 'en',              // (getter) Current language code
    available: [                 // Array of available languages
        { code: 'en',    label: 'English',   native: 'English',   emoji: '🇬🇧' },
        { code: 'zh-CN', label: '简体中文',  native: '简体中文',  emoji: '🇨🇳' }
    ],
    setLanguage: function(code) { ... },  // Switch language
    onChange: function(fn) { ... }        // Register listener, returns unsubscribe()
};
```

### setLanguage(code)

1. Validates `code` is in the `LANG_MAP` (built from `AVAILABLE`)
2. No-ops if `code === _current`
3. Updates `_current`
4. Persists to `localStorage.setItem('vl-docs-lang', code)`
5. Dispatches `new CustomEvent('vl-lang-changed', { detail: { lang: code } })` on `document`
6. Calls all registered `.onChange()` listeners

### Initial Language Resolution

Priority order:
1. `localStorage.getItem('vl-docs-lang')` — if valid code, use it
2. `navigator.language` — if starts with `'zh'`, return `'zh-CN'`
3. Default: `'en'`

### CustomEvent: `vl-lang-changed`

```javascript
// Dispatch (by VL_LANG.setLanguage)
document.dispatchEvent(new CustomEvent('vl-lang-changed', {
    detail: { lang: 'zh-CN' }
}));

// Listen (in component mounted hooks)
document.addEventListener('vl-lang-changed', function(e) {
    var newLang = e.detail.lang;
    // re-mount CDN sub-apps, refresh DOM-dependent state, etc.
});
```

**Note:** Components using `i18n: true` do NOT need to manually listen for this event — `wrapI18n()` handles it automatically. Only components that manually manage CDN sub-apps (like YrySceneCard) need explicit listeners.

---

## `main.js` — Page-Level Logic

### Scroll Spy

```javascript
function updateActiveLink() {
    // Finds all section[id] elements
    // Determines which section is currently in view (offsetTop - 100 < scrollY)
    // Toggles .active class on .nav-link[href="#<id>"]
    // Edge case: if scrolled to page bottom, forces last section as active
}
```

Registered on `window.addEventListener('scroll', ..., { passive: true })`.

### Smooth Scroll

Delegated click handler on `#sidebar-root`:
1. Finds closest `.nav-link` from click target
2. Calls `e.preventDefault()`
3. Calls `target.scrollIntoView({ behavior: 'smooth' })`
4. Immediately updates `.active` on all nav links (doesn't wait for scroll event)

### Language Change Refresh

```javascript
document.addEventListener('vl-lang-changed', function() {
    updateActiveLink();  // Re-run scroll spy after Vue rebuilds sections
});
```
