# Standalone Demo Pattern (`views/<name>/demos/`)

When demos live under `docs/views/<name>/demos/<slug>/` (not under `docs/components/`), they are standalone pages with no `data-include` or `mountDocComponent` dependency. This pattern is used for feature-specific demos (e.g., yt-dlp tool demo, graph viewer).

**Canonical reference implementation**: `docs/views/yt-dlp/demos/` — a 4-demo professional suite covering Types A, B, C, F. Study these demos for the complete pattern in action.

## CDN Path Resolution (views)

From `docs/views/<name>/demos/<slug>/index.html`:
```
../../../../../cdn/theme/{name}.css           → docs/cdn/theme/{name}.css
../../../../../cdn/yry-scene-card/index.js   → docs/cdn/yry-scene-card/index.js
../../../../assets/lang.js                    → docs/assets/lang.js
../../graph/index.html                        → code dependency graph
../../diagram/index.html                      → pipeline diagram
```

## Manual i18n Pattern

Standalone demos consume `window.VL_LANG` directly without `mountDocComponent`:

```javascript
var CONFIG = window.MY_DEMO_CONFIG || {};

function getLang() {
    return (window.VL_LANG && window.VL_LANG.current) || 'en';
}

function resolveLang(lang) {
    var slice = CONFIG[lang] || CONFIG.en || {};
    var out = {};
    // Copy cross-language keys (top-level, non-language-slice)
    for (var k in CONFIG) {
        if (k !== 'en' && k !== 'zh-CN' && Object.prototype.hasOwnProperty.call(CONFIG, k)) {
            out[k] = CONFIG[k];
        }
    }
    // Overlay language slice
    for (k in slice) {
        if (Object.prototype.hasOwnProperty.call(slice, k)) out[k] = slice[k];
    }
    return out;
}

// Listen for language changes
document.addEventListener('vl-lang-changed', function(e) {
    var newLang = e && e.detail && e.detail.lang;
    if (newLang && newLang !== self.lang) self.applyLang(newLang);
});
```

## YrySceneCard Standalone Mount

```javascript
var cardSlot = document.getElementById('scene-card');

function mountCard(lang) {
    if (!cardSlot || !window.YrySceneCard) return;
    var slice = CONFIG[lang || getLang()];
    if (!slice || !slice.card) return;
    cardSlot.innerHTML = '';
    window.YrySceneCard.mount(slice.card, cardSlot);
}

// Init: try immediate, fallback to event
if (window.YrySceneCard) { mountCard(); }
else {
    document.addEventListener('yry-scene-card-ready', function once() {
        document.removeEventListener('yry-scene-card-ready', once);
        mountCard();
    });
}
```

## Config Structure (`data.js`)

```javascript
window.MY_DEMO_CONFIG = {
    // Cross-language constants
    sampleInputs: [...],
    urlPatterns: [...],
    retryRate: { ... },

    en: {
        card: { name, desc, tags, badge, nameHref },  // YrySceneCard props
        ui: { ... },     // All i18n strings, flat keyed
        progressStages: [...],
        mockResults: [...],
        maxRetries: 5
    },
    'zh-CN': {
        card: { ... },   // Same structure, translated
        ui: { ... },
        progressStages: [...],
        mockResults: [...],
        maxRetries: 5
    }
};
```
