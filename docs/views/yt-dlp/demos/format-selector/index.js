/**
 * Format Selector Demo — Vue 3 Application
 * =============================================================================
 * Type C: Comparison Showcase — Format & Resolution Selector
 *
 * Features:
 *   - Interactive format comparison table (sortable by size/quality/resolution)
 *   - Category filtering (video / audio / all)
 *   - Click-to-select with detail panel showing full format stats
 *   - Default format highlighting
 *   - File size bar visualization
 *   - Cross-language i18n via VL_LANG event bus
 */
(function() {
    'use strict';

    var CONFIG = window.FORMAT_SELECTOR_CONFIG || {};
    var cardSlot = document.getElementById('scene-card');

    /* ── i18n Helpers ───────────────────────────── */
    function getLang() {
        return (window.VL_LANG && window.VL_LANG.current) || 'en';
    }

    function resolveLang(lang) {
        var slice = CONFIG[lang] || CONFIG.en || {};
        var out = {};
        var k;
        for (k in CONFIG) {
            if (k !== 'en' && k !== 'zh-CN' && Object.prototype.hasOwnProperty.call(CONFIG, k)) {
                out[k] = CONFIG[k];
            }
        }
        for (k in slice) {
            if (Object.prototype.hasOwnProperty.call(slice, k)) out[k] = slice[k];
        }
        return out;
    }

    /* ── YrySceneCard Mount ─────────────────────── */
    function mountCard(lang) {
        if (!cardSlot || !window.YrySceneCard) return;
        var slice = CONFIG[lang || getLang()];
        if (!slice || !slice.card) return;
        cardSlot.innerHTML = '';
        window.YrySceneCard.mount(slice.card, cardSlot);
    }

    function initCard() {
        if (!cardSlot) return;
        if (window.YrySceneCard) { mountCard(); return; }
        document.addEventListener('yry-scene-card-ready', function once() {
            document.removeEventListener('yry-scene-card-ready', once);
            mountCard();
        });
    }

    /* ── Vue 3 Application ──────────────────────── */
    var app = Vue.createApp({
        data: function() {
            var lang = getLang();
            var d = resolveLang(lang);
            return {
                lang: lang,
                langData: d,
                ui: d.ui || {},
                formats: CONFIG.formats || [],
                activeCategory: 'all',
                sortBy: 'size',         // 'size' | 'quality' | 'resolution'
                highlightDefault: true,
                selectedId: null
            };
        },

        computed: {
            categories: function() {
                var self = this;
                return [
                    { id: 'all',   label: this.ui.showAll },
                    { id: 'video', label: this.ui.showVideo },
                    { id: 'audio', label: this.ui.showAudio }
                ];
            },

            filteredFormats: function() {
                var self = this;
                var fmts = this.formats;
                if (this.activeCategory !== 'all') {
                    fmts = fmts.filter(function(f) { return f.category === self.activeCategory; });
                }
                return fmts;
            },

            sortedFormats: function() {
                var fmts = this.filteredFormats.slice();
                var sortBy = this.sortBy;

                /* Predefined quality order for sorting */
                var qualityOrder = { '★★★★★': 5, '★★★★☆': 4, '★★★☆☆': 3, '★★☆☆☆': 2, '★☆☆☆☆': 1 };

                fmts.sort(function(a, b) {
                    if (sortBy === 'size')  return a.sizePerMin - b.sizePerMin;
                    if (sortBy === 'quality') return (qualityOrder[b.quality] || 0) - (qualityOrder[a.quality] || 0);
                    if (sortBy === 'resolution') return (a.sizePerMin || 0) - (b.sizePerMin || 0);
                    return 0;
                });
                return fmts;
            },

            selectedFormat: function() {
                var self = this;
                if (!this.selectedId) return null;
                return this.formats.find(function(f) { return f.id === self.selectedId; }) || null;
            }
        },

        methods: {
            selectFormat: function(fmt) {
                this.selectedId = (this.selectedId === fmt.id) ? null : fmt.id;
            },

            sizeBarWidth: function(fmt) {
                var max = 338; // max sizePerMin in the dataset (4k-h264)
                return Math.round((fmt.sizePerMin / max) * 100) + '%';
            },

            bestForText: function(fmt) {
                if (!fmt) return '';
                if (fmt.category === 'audio') {
                    return fmt.codec === 'AAC' ? this.ui.bestAudio : this.ui.bestAudio;
                }
                if (fmt.resolution.indexOf('4K') === 0) return this.ui.bestArchival;
                if (fmt.codec === 'AV1' || fmt.codec === 'VP9') {
                    if (fmt.resolution.indexOf('1080p') === 0) return this.ui.bestStreaming;
                    return this.ui.bestSpace;
                }
                if (fmt.codec === 'H.264' && fmt.resolution.indexOf('1080p') === 0) return this.ui.bestGeneral;
                if (fmt.codec === 'H.264') return this.ui.bestCompatibility;
                return this.ui.bestGeneral;
            },

            applyLang: function(lang) {
                var d = resolveLang(lang);
                this.lang = lang;
                this.langData = d;
                this.ui = d.ui || {};
                mountCard(lang);
            }
        },

        mounted: function() {
            var self = this;
            document.addEventListener('vl-lang-changed', function(e) {
                var newLang = e && e.detail && e.detail.lang;
                if (newLang && newLang !== self.lang) self.applyLang(newLang);
            });
            /* Auto-select the default format on load */
            var def = this.formats.find(function(f) { return f.isDefault && f.category === 'video'; });
            if (def) this.selectedId = def.id;
        }
    });

    app.mount('#demo-app');
    initCard();
})();
