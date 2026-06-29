/**
 * Subtitle Workflow Demo — Vue 3 Application
 * =============================================================================
 * Type B: Pipeline Visualization — Subtitle Extraction Pipeline
 *
 * Features:
 *   - Animated 5-stage pipeline with auto-play
 *   - Clickable stage nodes with expandable detail panel
 *   - Language availability matrix (shown at stage 1)
 *   - Sample subtitle output preview (shown at stage 5)
 *   - Source code trace links to graph
 *   - Cross-language i18n
 */
(function() {
    'use strict';

    var CONFIG = window.SUBTITLE_WORKFLOW_CONFIG || {};
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
                rawStages: CONFIG.stages || [],
                languages: CONFIG.languages || [],
                sampleSubtitles: CONFIG.sampleSubtitles || {},
                currentStep: -1,
                playing: false,
                sampleLang: 'en',
                _timers: []
            };
        },

        computed: {
            /** Stages with i18n-resolved text/desc/detail */
            displayStages: function() {
                var isZh = this.lang === 'zh-CN';
                return this.rawStages.map(function(s) {
                    var out = {};
                    Object.keys(s).forEach(function(k) {
                        if (k === 'enText' || k === 'zhText' || k === 'enDesc' || k === 'zhDesc' || k === 'enDetail' || k === 'zhDetail') return;
                        out[k] = s[k];
                    });
                    out.text = isZh ? (s.zhText || s.enText) : s.enText;
                    out.desc = isZh ? (s.zhDesc || s.enDesc) : s.enDesc;
                    out.detail = isZh ? (s.zhDetail || s.enDetail) : s.enDetail;
                    return out;
                });
            },

            currentStageData: function() {
                if (this.currentStep < 0 || this.currentStep >= this.displayStages.length) return null;
                return this.displayStages[this.currentStep];
            },

            stageCount: function() {
                return this.displayStages.length;
            }
        },

        methods: {
            graphLink: function(nodeId) {
                if (!nodeId) return '#';
                return '../../graph/index.html?focus=' + encodeURIComponent(nodeId);
            },

            displayLangName: function(lang) {
                return this.lang === 'zh-CN' ? (lang.nameZh || lang.nameEn) : lang.nameEn;
            },

            selectStep: function(i) {
                if (this.playing) this.playing = false;
                this.currentStep = i;
            },

            autoPlay: function() {
                var self = this;
                if (this.playing) { this.playing = false; return; }
                this.playing = true;
                this.currentStep = -1;
                this._advanceAuto(0);
            },

            _advanceAuto: function(i) {
                var self = this;
                if (!this.playing) return;
                if (i >= this.displayStages.length) {
                    this.playing = false;
                    return;
                }
                this.currentStep = i;
                var h = setTimeout(function() {
                    var idx = self._timers.indexOf(h);
                    if (idx >= 0) self._timers.splice(idx, 1);
                    self._advanceAuto(i + 1);
                }, 1800);
                this._timers.push(h);
            },

            resetPipeline: function() {
                this.playing = false;
                this._timers.forEach(function(h) { clearTimeout(h); });
                this._timers = [];
                this.currentStep = -1;
                this.sampleLang = 'en';
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
        },

        beforeUnmount: function() {
            this._timers.forEach(function(h) { clearTimeout(h); });
            this._timers = [];
        }
    });

    app.mount('#demo-app');
    initCard();
})();
